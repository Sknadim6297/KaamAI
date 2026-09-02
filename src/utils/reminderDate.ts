import type { Reminder, ReminderType } from '../types/reminder';
import { toISODateString } from './formatNumber';

function addDays(date: Date, days: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

function parseTime(time: string): { hours: number; minutes: number } | null {
  const match = time.match(/^(\d{1,2}):(\d{2})$/);
  if (!match) return null;
  const hours = Number(match[1]);
  const minutes = Number(match[2]);
  if (hours < 0 || hours > 23 || minutes < 0 || minutes > 59) return null;
  return { hours, minutes };
}

export function parseReminderDateTime(reminder: Reminder): Date | null {
  const [y, m, d] = reminder.date.split('-').map(Number);
  const time = parseTime(reminder.time);
  if (!time || !y || !m || !d) return null;
  return new Date(y, m - 1, d, time.hours, time.minutes, 0, 0);
}

export function formatReminderTime(time: string): string {
  const parsed = parseTime(time);
  if (!parsed) return time;
  const { hours, minutes } = parsed;
  const period = hours >= 12 ? 'PM' : 'AM';
  const h12 = hours % 12 || 12;
  return `${h12}:${String(minutes).padStart(2, '0')} ${period}`;
}

export function formatReminderDateLabel(dateIso: string, now = new Date()): string {
  const [y, m, d] = dateIso.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const tomorrow = addDays(today, 1);
  const target = new Date(date.getFullYear(), date.getMonth(), date.getDate());

  if (target.getTime() === today.getTime()) return 'Today';
  if (target.getTime() === tomorrow.getTime()) return 'Tomorrow';

  return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
}

export function formatReminderDateTime(reminder: Reminder, now = new Date()): string {
  const dateLabel = formatReminderDateLabel(reminder.date, now);
  return `${dateLabel} · ${formatReminderTime(reminder.time)}`;
}

export function getNextOccurrence(reminder: Reminder, from = new Date()): Date | null {
  const base = parseReminderDateTime(reminder);
  if (!base) return null;

  if (reminder.type === 'one-time') {
    return base;
  }

  let next = new Date(base);

  const advance = () => {
    switch (reminder.type) {
      case 'daily':
        next = addDays(next, 1);
        break;
      case 'weekly':
        next = addDays(next, 7);
        break;
      case 'monthly': {
        const day = reminder.recurrence?.monthDay ?? next.getDate();
        next = new Date(next.getFullYear(), next.getMonth() + 1, Math.min(day, 28));
        break;
      }
      case 'yearly':
        next = new Date(next.getFullYear() + 1, next.getMonth(), next.getDate());
        break;
      case 'custom': {
        const interval = reminder.recurrence?.interval ?? 1;
        const unit = reminder.recurrence?.unit ?? 'days';
        next = addDays(next, unit === 'weeks' ? interval * 7 : interval);
        break;
      }
      default:
        break;
    }
  };

  while (next.getTime() <= from.getTime()) {
    advance();
  }

  return next;
}

export function isReminderToday(reminder: Reminder, now = new Date()): boolean {
  if (reminder.completed) return false;
  const [y, m, d] = reminder.date.split('-').map(Number);
  return (
    y === now.getFullYear() &&
    m === now.getMonth() + 1 &&
    d === now.getDate()
  );
}

export function isReminderOverdue(reminder: Reminder, now = new Date()): boolean {
  if (reminder.completed) return false;
  const dt = parseReminderDateTime(reminder);
  if (!dt) return false;
  return dt.getTime() < now.getTime();
}

export function isReminderUpcoming(reminder: Reminder, now = new Date()): boolean {
  if (reminder.completed) return false;
  const dt = parseReminderDateTime(reminder);
  if (!dt) return false;
  return dt.getTime() >= now.getTime();
}

export function getReminderSortTime(reminder: Reminder): number {
  const dt = parseReminderDateTime(reminder);
  return dt?.getTime() ?? 0;
}

export function advanceRecurringReminder(reminder: Reminder, from = new Date()): Reminder {
  const next = getNextOccurrence(reminder, from);
  if (!next) return reminder;
  return {
    ...reminder,
    date: toISODateString(next),
    completed: false,
    updatedAt: new Date().toISOString(),
  };
}

export function getRecurrenceLabel(reminder: Reminder): string {
  switch (reminder.type) {
    case 'one-time':
      return 'One-time';
    case 'daily':
      return 'Daily';
    case 'weekly':
      return 'Weekly';
    case 'monthly':
      return reminder.recurrence?.monthDay
        ? `Monthly · ${reminder.recurrence.monthDay}${ordinal(reminder.recurrence.monthDay)}`
        : 'Monthly';
    case 'yearly':
      return 'Yearly';
    case 'custom': {
      const interval = reminder.recurrence?.interval ?? 1;
      const unit = reminder.recurrence?.unit ?? 'days';
      return `Every ${interval} ${unit}`;
    }
    default:
      return '';
  }
}

function ordinal(n: number): string {
  const s = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return s[(v - 20) % 10] || s[v] || s[0];
}

export function isValidFutureOneTime(date: string, time: string, now = new Date()): boolean {
  const [y, m, d] = date.split('-').map(Number);
  const parsedTime = parseTime(time);
  if (!parsedTime) return false;
  const dt = new Date(y, m - 1, d, parsedTime.hours, parsedTime.minutes, 0, 0);
  return dt.getTime() >= now.getTime();
}

export { toISODateString };
