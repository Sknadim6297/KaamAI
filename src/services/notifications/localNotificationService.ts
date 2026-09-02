import type {
  NotificationScheduleResult,
  NotificationService,
  ScheduleReminderInput,
} from './notificationService';

/**
 * Placeholder notification service for STEP 6.
 * Reminders are saved locally; push scheduling requires expo-notifications later.
 */
export class LocalNotificationService implements NotificationService {
  async requestPermission(): Promise<boolean> {
    return false;
  }

  async scheduleReminder(_input: ScheduleReminderInput): Promise<NotificationScheduleResult> {
    return {
      scheduled: false,
      notificationId: null,
      message: 'Reminder saved, but notifications are disabled.',
    };
  }

  async cancelNotification(_id: string): Promise<void> {
    // no-op until real notification backend is wired
  }
}

export const localNotificationService = new LocalNotificationService();
