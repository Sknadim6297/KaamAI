import type { CreateReminderInput, Reminder, UpdateReminderInput } from '../../types/reminder';

export interface ReminderRepository {
  getAll(): Promise<Reminder[]>;
  getById(id: string): Promise<Reminder | null>;
  add(input: CreateReminderInput): Promise<Reminder>;
  update(id: string, updates: UpdateReminderInput): Promise<Reminder>;
  delete(id: string): Promise<void>;
  toggleComplete(id: string): Promise<Reminder>;
}
