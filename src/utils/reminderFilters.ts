import type { Reminder, ReminderFilters, ReminderGroup, ReminderGroupKey } from '../types/reminder';
import {
  getReminderSortTime,
  isReminderOverdue,
  isReminderToday,
  isReminderUpcoming,
  parseReminderDateTime,
} from './reminderDate';

function addDays(date: Date, days: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export function filterReminders(reminders: Reminder[], filters: ReminderFilters, now = new Date()): Reminder[] {
  const search = filters.search.trim().toLowerCase();

  return reminders.filter((reminder) => {
    if (filters.categoryId !== 'all' && reminder.categoryId !== filters.categoryId) {
      return false;
    }

    if (search) {
      const haystack = `${reminder.title} ${reminder.note ?? ''} ${reminder.categoryName}`.toLowerCase();
      if (!haystack.includes(search)) return false;
    }

    switch (filters.status) {
      case 'today':
        return !reminder.completed && isReminderToday(reminder, now);
      case 'upcoming':
        return !reminder.completed && isReminderUpcoming(reminder, now);
      case 'overdue':
        return !reminder.completed && isReminderOverdue(reminder, now);
      case 'completed':
        return reminder.completed;
      case 'all':
      default:
        return true;
    }
  });
}

function getGroupKey(reminder: Reminder, now = new Date()): ReminderGroupKey {
  if (reminder.completed) return 'completed';

  const today = startOfDay(now);
  const tomorrow = addDays(today, 1);
  const weekEnd = addDays(today, 7);

  const dt = parseReminderDateTime(reminder);
  if (!dt) return 'later';

  const day = startOfDay(dt);
  if (day.getTime() === today.getTime()) return 'today';
  if (day.getTime() === tomorrow.getTime()) return 'tomorrow';
  if (day.getTime() > tomorrow.getTime() && day.getTime() <= weekEnd.getTime()) return 'this_week';
  return 'later';
}

const GROUP_TITLES: Record<ReminderGroupKey, string> = {
  today: 'Today',
  tomorrow: 'Tomorrow',
  this_week: 'This Week',
  later: 'Later',
  completed: 'Completed',
};

const GROUP_ORDER: ReminderGroupKey[] = [
  'today',
  'tomorrow',
  'this_week',
  'later',
  'completed',
];

export function groupReminders(reminders: Reminder[], now = new Date()): ReminderGroup[] {
  const buckets = new Map<ReminderGroupKey, Reminder[]>();

  for (const reminder of reminders) {
    const key = getGroupKey(reminder, now);
    const list = buckets.get(key) ?? [];
    list.push(reminder);
    buckets.set(key, list);
  }

  return GROUP_ORDER.filter((key) => (buckets.get(key)?.length ?? 0) > 0).map((key) => ({
    key,
    title: GROUP_TITLES[key],
    reminders: (buckets.get(key) ?? []).sort(
      (a, b) => getReminderSortTime(a) - getReminderSortTime(b),
    ),
  }));
}

export function getUpcomingReminders(reminders: Reminder[], limit = 3, now = new Date()): Reminder[] {
  return reminders
    .filter((r) => !r.completed && isReminderUpcoming(r, now))
    .sort((a, b) => getReminderSortTime(a) - getReminderSortTime(b))
    .slice(0, limit);
}

export function getTodayReminders(reminders: Reminder[], now = new Date()): Reminder[] {
  return reminders
    .filter((r) => !r.completed && (isReminderToday(r, now) || isReminderOverdue(r, now)))
    .sort((a, b) => getReminderSortTime(a) - getReminderSortTime(b));
}
