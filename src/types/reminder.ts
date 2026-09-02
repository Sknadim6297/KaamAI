export type ReminderType =
  | 'one-time'
  | 'daily'
  | 'weekly'
  | 'monthly'
  | 'yearly'
  | 'custom';

export type ReminderPriority = 'low' | 'medium' | 'high';

export type ReminderCategoryId =
  | 'bills'
  | 'finance'
  | 'home'
  | 'health'
  | 'work'
  | 'personal'
  | 'shopping'
  | 'travel'
  | 'documents'
  | 'other';

export type ReminderStatusFilter =
  | 'all'
  | 'today'
  | 'upcoming'
  | 'overdue'
  | 'completed';

export interface ReminderRecurrence {
  /** For custom: every X days/weeks */
  interval?: number;
  unit?: 'days' | 'weeks';
  /** 0=Sun..6=Sat for weekly */
  weekday?: number;
  /** Day of month for monthly */
  monthDay?: number;
}

export interface Reminder {
  id: string;
  title: string;
  note?: string;
  type: ReminderType;
  priority: ReminderPriority;
  date: string; // YYYY-MM-DD — next/current occurrence
  time: string; // HH:mm (24h)
  categoryId: ReminderCategoryId;
  categoryName: string;
  completed: boolean;
  recurrence?: ReminderRecurrence;
  notificationId?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateReminderInput {
  title: string;
  note?: string;
  type: ReminderType;
  priority: ReminderPriority;
  date: string;
  time: string;
  categoryId: ReminderCategoryId;
  recurrence?: ReminderRecurrence;
}

export interface UpdateReminderInput extends Partial<CreateReminderInput> {
  completed?: boolean;
  notificationId?: string | null;
}

export interface ReminderFilters {
  status: ReminderStatusFilter;
  categoryId: ReminderCategoryId | 'all';
  search: string;
}

export type ReminderGroupKey =
  | 'today'
  | 'tomorrow'
  | 'this_week'
  | 'later'
  | 'completed';

export interface ReminderGroup {
  key: ReminderGroupKey;
  title: string;
  reminders: Reminder[];
}
