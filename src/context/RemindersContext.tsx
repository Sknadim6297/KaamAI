import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  localReminderRepository,
  type ReminderRepository,
} from '../services/reminders';
import {
  localNotificationService,
  type NotificationService,
} from '../services/notifications';
import type {
  CreateReminderInput,
  Reminder,
  ReminderFilters,
  ReminderGroup,
  UpdateReminderInput,
} from '../types/reminder';
import {
  filterReminders,
  getTodayReminders,
  getUpcomingReminders,
  groupReminders,
} from '../utils/reminderFilters';
import { isValidFutureOneTime } from '../utils/reminderDate';

interface RemindersContextValue {
  reminders: Reminder[];
  filteredReminders: Reminder[];
  groupedReminders: ReminderGroup[];
  todayReminders: Reminder[];
  upcomingReminders: Reminder[];
  filters: ReminderFilters;
  loading: boolean;
  error: string | null;
  notificationNotice: string | null;
  sheetOpen: boolean;
  sheetMode: 'add' | 'edit';
  editingReminder: Reminder | null;
  searchOpen: boolean;
  setFilters: (patch: Partial<ReminderFilters>) => void;
  setSearchOpen: (open: boolean) => void;
  openAddSheet: () => void;
  openEditSheet: (reminder: Reminder) => void;
  closeSheet: () => void;
  addReminder: (input: CreateReminderInput) => Promise<Reminder>;
  updateReminder: (id: string, input: UpdateReminderInput) => Promise<Reminder>;
  deleteReminder: (id: string) => Promise<void>;
  toggleComplete: (id: string) => Promise<Reminder>;
  refresh: () => Promise<void>;
  clearNotificationNotice: () => void;
}

const RemindersContext = createContext<RemindersContextValue | null>(null);

function createDefaultFilters(): ReminderFilters {
  return {
    status: 'all',
    categoryId: 'all',
    search: '',
  };
}

interface RemindersProviderProps {
  children: React.ReactNode;
  repository?: ReminderRepository;
  notificationService?: NotificationService;
}

export function RemindersProvider({
  children,
  repository = localReminderRepository,
  notificationService = localNotificationService,
}: RemindersProviderProps) {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [filters, setFiltersState] = useState<ReminderFilters>(createDefaultFilters);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notificationNotice, setNotificationNotice] = useState<string | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [sheetMode, setSheetMode] = useState<'add' | 'edit'>('add');
  const [editingReminder, setEditingReminder] = useState<Reminder | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);

  const refresh = useCallback(async () => {
    try {
      setError(null);
      const data = await repository.getAll();
      setReminders(data);
    } catch {
      setError('Could not load reminders. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [repository]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const scheduleForReminder = useCallback(
    async (reminder: Reminder): Promise<void> => {
      if (reminder.notificationId) {
        await notificationService.cancelNotification(reminder.notificationId);
      }

      const result = await notificationService.scheduleReminder({
        reminderId: reminder.id,
        title: reminder.title,
        date: reminder.date,
        time: reminder.time,
      });

      if (result.message) {
        setNotificationNotice(result.message);
      }

      if (result.notificationId) {
        await repository.update(reminder.id, { notificationId: result.notificationId });
      }
    },
    [notificationService, repository],
  );

  const setFilters = useCallback((patch: Partial<ReminderFilters>) => {
    setFiltersState((prev) => ({ ...prev, ...patch }));
  }, []);

  const openAddSheet = useCallback(() => {
    setSheetMode('add');
    setEditingReminder(null);
    setSheetOpen(true);
  }, []);

  const openEditSheet = useCallback((reminder: Reminder) => {
    setSheetMode('edit');
    setEditingReminder(reminder);
    setSheetOpen(true);
  }, []);

  const closeSheet = useCallback(() => {
    setSheetOpen(false);
    setEditingReminder(null);
  }, []);

  const addReminder = useCallback(
    async (input: CreateReminderInput) => {
      if (input.type === 'one-time' && !isValidFutureOneTime(input.date, input.time)) {
        throw new Error('One-time reminders must be scheduled in the future.');
      }

      const created = await repository.add(input);
      await scheduleForReminder(created);
      await refresh();
      setSheetOpen(false);
      return created;
    },
    [repository, refresh, scheduleForReminder],
  );

  const updateReminder = useCallback(
    async (id: string, input: UpdateReminderInput) => {
      const existing = await repository.getById(id);
      if (!existing) throw new Error('Reminder not found.');

      const nextType = input.type ?? existing.type;
      const nextDate = input.date ?? existing.date;
      const nextTime = input.time ?? existing.time;

      if (nextType === 'one-time' && !isValidFutureOneTime(nextDate, nextTime)) {
        throw new Error('One-time reminders must be scheduled in the future.');
      }

      const updated = await repository.update(id, input);
      await scheduleForReminder(updated);
      await refresh();
      setSheetOpen(false);
      setEditingReminder(null);
      return updated;
    },
    [repository, refresh, scheduleForReminder],
  );

  const deleteReminder = useCallback(
    async (id: string) => {
      const existing = await repository.getById(id);
      if (existing?.notificationId) {
        await notificationService.cancelNotification(existing.notificationId);
      }
      await repository.delete(id);
      await refresh();
      setSheetOpen(false);
      setEditingReminder(null);
    },
    [repository, refresh, notificationService],
  );

  const toggleComplete = useCallback(
    async (id: string) => {
      const updated = await repository.toggleComplete(id);
      await refresh();
      return updated;
    },
    [repository, refresh],
  );

  const clearNotificationNotice = useCallback(() => {
    setNotificationNotice(null);
  }, []);

  const filteredReminders = useMemo(
    () => filterReminders(reminders, filters),
    [reminders, filters],
  );

  const groupedReminders = useMemo(
    () => groupReminders(filteredReminders),
    [filteredReminders],
  );

  const todayReminders = useMemo(() => getTodayReminders(reminders), [reminders]);
  const upcomingReminders = useMemo(() => getUpcomingReminders(reminders, 3), [reminders]);

  const value = useMemo<RemindersContextValue>(
    () => ({
      reminders,
      filteredReminders,
      groupedReminders,
      todayReminders,
      upcomingReminders,
      filters,
      loading,
      error,
      notificationNotice,
      sheetOpen,
      sheetMode,
      editingReminder,
      searchOpen,
      setFilters,
      setSearchOpen,
      openAddSheet,
      openEditSheet,
      closeSheet,
      addReminder,
      updateReminder,
      deleteReminder,
      toggleComplete,
      refresh,
      clearNotificationNotice,
    }),
    [
      reminders,
      filteredReminders,
      groupedReminders,
      todayReminders,
      upcomingReminders,
      filters,
      loading,
      error,
      notificationNotice,
      sheetOpen,
      sheetMode,
      editingReminder,
      searchOpen,
      setFilters,
      openAddSheet,
      openEditSheet,
      closeSheet,
      addReminder,
      updateReminder,
      deleteReminder,
      toggleComplete,
      refresh,
      clearNotificationNotice,
    ],
  );

  return <RemindersContext.Provider value={value}>{children}</RemindersContext.Provider>;
}

export function useReminders(): RemindersContextValue {
  const ctx = useContext(RemindersContext);
  if (!ctx) {
    throw new Error('useReminders must be used within RemindersProvider');
  }
  return ctx;
}
