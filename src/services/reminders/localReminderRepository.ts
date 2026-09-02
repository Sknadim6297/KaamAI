import { getReminderCategoryById } from '../../constants/reminders';
import type {
  CreateReminderInput,
  Reminder,
  ReminderCategoryId,
  UpdateReminderInput,
} from '../../types/reminder';
import { advanceRecurringReminder } from '../../utils/reminderDate';
import { toISODateString } from '../../utils/formatNumber';
import type { ReminderRepository } from './reminderRepository';

function createId(): string {
  return `rem_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

function addDays(date: Date, days: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

function buildSeed(): Reminder[] {
  const now = new Date();
  const nowIso = now.toISOString();
  const today = toISODateString(now);
  const tomorrow = toISODateString(addDays(now, 1));

  const dec20 = new Date(now.getFullYear(), 11, 20);
  if (dec20.getTime() < now.getTime()) {
    dec20.setFullYear(dec20.getFullYear() + 1);
  }

  const rentDay = 5;
  const rentDate = new Date(now.getFullYear(), now.getMonth(), rentDay);
  if (rentDate.getTime() < now.getTime()) {
    rentDate.setMonth(rentDate.getMonth() + 1);
  }

  return [
    {
      id: 'rem_seed_1',
      title: 'Electricity Bill',
      note: 'Pay electricity bill',
      type: 'monthly',
      priority: 'medium',
      date: tomorrow,
      time: '20:00',
      categoryId: 'bills',
      categoryName: 'Bills',
      completed: false,
      recurrence: { monthDay: 5 },
      createdAt: nowIso,
      updatedAt: nowIso,
    },
    {
      id: 'rem_seed_2',
      title: 'Gym',
      note: 'Workout session',
      type: 'one-time',
      priority: 'low',
      date: today,
      time: '19:00',
      categoryId: 'health',
      categoryName: 'Health',
      completed: false,
      createdAt: nowIso,
      updatedAt: nowIso,
    },
    {
      id: 'rem_seed_3',
      title: 'Rent',
      note: 'Pay monthly rent',
      type: 'monthly',
      priority: 'high',
      date: toISODateString(rentDate),
      time: '09:00',
      categoryId: 'finance',
      categoryName: 'Finance',
      completed: false,
      recurrence: { monthDay: rentDay },
      createdAt: nowIso,
      updatedAt: nowIso,
    },
    {
      id: 'rem_seed_4',
      title: 'Insurance Renewal',
      note: 'Renew health insurance',
      type: 'yearly',
      priority: 'high',
      date: toISODateString(dec20),
      time: '10:00',
      categoryId: 'finance',
      categoryName: 'Finance',
      completed: false,
      createdAt: nowIso,
      updatedAt: nowIso,
    },
  ];
}

function validateInput(input: CreateReminderInput | UpdateReminderInput, isCreate: boolean): void {
  if (isCreate && (!('title' in input) || !input.title?.trim())) {
    throw new Error('Title is required.');
  }
  if ('title' in input && input.title !== undefined && !input.title.trim()) {
    throw new Error('Title is required.');
  }
  if ('date' in input && input.date) {
    const parts = input.date.split('-').map(Number);
    if (parts.length !== 3 || parts.some((n) => !Number.isFinite(n))) {
      throw new Error('Invalid date.');
    }
  }
  if ('time' in input && input.time) {
    const match = input.time.match(/^(\d{1,2}):(\d{2})$/);
    if (!match) throw new Error('Invalid time.');
    const h = Number(match[1]);
    const m = Number(match[2]);
    if (h < 0 || h > 23 || m < 0 || m > 59) throw new Error('Invalid time.');
  }
}

export class LocalReminderRepository implements ReminderRepository {
  private reminders: Reminder[];

  constructor(initial?: Reminder[]) {
    this.reminders = initial ? [...initial] : buildSeed();
  }

  async getAll(): Promise<Reminder[]> {
    return [...this.reminders].sort((a, b) => {
      if (a.completed !== b.completed) return a.completed ? 1 : -1;
      const dateCmp = a.date.localeCompare(b.date);
      if (dateCmp !== 0) return dateCmp;
      return a.time.localeCompare(b.time);
    });
  }

  async getById(id: string): Promise<Reminder | null> {
    return this.reminders.find((r) => r.id === id) ?? null;
  }

  async add(input: CreateReminderInput): Promise<Reminder> {
    validateInput(input, true);
    const category = getReminderCategoryById(input.categoryId);
    if (!category) throw new Error('Please select a valid category.');

    const now = new Date().toISOString();
    const reminder: Reminder = {
      id: createId(),
      title: input.title.trim(),
      note: input.note?.trim() || undefined,
      type: input.type,
      priority: input.priority,
      date: input.date,
      time: input.time,
      categoryId: input.categoryId,
      categoryName: category.name,
      completed: false,
      recurrence: input.recurrence,
      notificationId: null,
      createdAt: now,
      updatedAt: now,
    };

    this.reminders = [reminder, ...this.reminders];
    return reminder;
  }

  async update(id: string, updates: UpdateReminderInput): Promise<Reminder> {
    const index = this.reminders.findIndex((r) => r.id === id);
    if (index === -1) throw new Error('Reminder not found.');

    validateInput(updates, false);
    const existing = this.reminders[index];
    const categoryId = (updates.categoryId ?? existing.categoryId) as ReminderCategoryId;
    const category = getReminderCategoryById(categoryId);
    if (!category) throw new Error('Please select a valid category.');

    const updated: Reminder = {
      ...existing,
      title: updates.title !== undefined ? updates.title.trim() : existing.title,
      note: updates.note !== undefined ? updates.note.trim() || undefined : existing.note,
      type: updates.type ?? existing.type,
      priority: updates.priority ?? existing.priority,
      date: updates.date ?? existing.date,
      time: updates.time ?? existing.time,
      categoryId,
      categoryName: category.name,
      completed: updates.completed ?? existing.completed,
      recurrence: updates.recurrence !== undefined ? updates.recurrence : existing.recurrence,
      notificationId:
        updates.notificationId !== undefined ? updates.notificationId : existing.notificationId,
      updatedAt: new Date().toISOString(),
    };

    this.reminders = [
      ...this.reminders.slice(0, index),
      updated,
      ...this.reminders.slice(index + 1),
    ];
    return updated;
  }

  async delete(id: string): Promise<void> {
    const exists = this.reminders.some((r) => r.id === id);
    if (!exists) throw new Error('Reminder not found.');
    this.reminders = this.reminders.filter((r) => r.id !== id);
  }

  async toggleComplete(id: string): Promise<Reminder> {
    const index = this.reminders.findIndex((r) => r.id === id);
    if (index === -1) throw new Error('Reminder not found.');

    const existing = this.reminders[index];

    if (existing.completed) {
      return this.update(id, { completed: false });
    }

    if (existing.type !== 'one-time') {
      const advanced = advanceRecurringReminder(existing);
      this.reminders = [
        ...this.reminders.slice(0, index),
        advanced,
        ...this.reminders.slice(index + 1),
      ];
      return advanced;
    }

    return this.update(id, { completed: true });
  }
}

export const localReminderRepository = new LocalReminderRepository();
