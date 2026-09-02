export interface ScheduleReminderInput {
  reminderId: string;
  title: string;
  date: string;
  time: string;
}

export interface NotificationScheduleResult {
  scheduled: boolean;
  notificationId: string | null;
  message?: string;
}

export interface NotificationService {
  requestPermission(): Promise<boolean>;
  scheduleReminder(input: ScheduleReminderInput): Promise<NotificationScheduleResult>;
  cancelNotification(id: string): Promise<void>;
}
