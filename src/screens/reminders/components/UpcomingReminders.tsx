import React from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import { Colors, Radius, Spacing } from '../../../theme';
import { AppText, AppButton, PressableScale, SectionHeader } from '../../../components/ui';
import { useReminders } from '../../../context/RemindersContext';
import {
  getReminderCategoryById,
  getReminderCategoryIcon,
} from '../../../constants/reminders';
import { formatReminderDateTime } from '../../../utils/reminderDate';

interface UpcomingRemindersProps {
  limit?: number;
  showHeader?: boolean;
  onViewAllPress?: () => void;
  onAddPress?: () => void;
}

export function UpcomingReminders({
  limit = 3,
  showHeader = true,
  onViewAllPress,
  onAddPress,
}: UpcomingRemindersProps) {
  const router = useRouter();
  const { upcomingReminders, openAddSheet } = useReminders();
  const items = upcomingReminders.slice(0, limit);

  const handleViewAll = () => {
    if (onViewAllPress) {
      onViewAllPress();
    } else {
      router.push('/reminders');
    }
  };

  const handleAdd = () => {
    if (onAddPress) {
      onAddPress();
    } else {
      openAddSheet();
      router.push('/reminders');
    }
  };

  if (items.length === 0) {
    return (
      <View style={styles.wrapper}>
        {showHeader ? (
          <SectionHeader title="Upcoming" actionLabel="View all" onActionPress={handleViewAll} />
        ) : null}
        <View style={styles.empty}>
          <AppText variant="bodySmall" color="muted">
            No upcoming reminders
          </AppText>
          <AppButton label="Add Reminder" onPress={handleAdd} size="sm" style={styles.addBtn} />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.wrapper}>
      {showHeader ? (
        <SectionHeader title="Upcoming" actionLabel="View all" onActionPress={handleViewAll} />
      ) : null}

      <View style={styles.list}>
        {items.map((reminder, index) => {
          const category = getReminderCategoryById(reminder.categoryId);
          const Icon = getReminderCategoryIcon(category?.iconKey ?? 'more');

          return (
            <Animated.View
              key={reminder.id}
              entering={FadeInDown.delay(380 + index * 60).duration(480).springify()}
            >
              <PressableScale
                onPress={handleViewAll}
                style={styles.card}
                accessibilityRole="button"
                accessibilityLabel={`${reminder.title}, ${formatReminderDateTime(reminder)}`}
              >
                <View style={[styles.iconWrapper, { backgroundColor: (category?.color ?? Colors.primary) + '18' }]}>
                  <Icon color={category?.color ?? Colors.primary} size={17} strokeWidth={2} />
                </View>
                <View style={styles.content}>
                  <AppText variant="bodyMedium" numberOfLines={1}>
                    {reminder.title}
                  </AppText>
                  <AppText variant="bodySmall" color="muted" numberOfLines={1}>
                    {formatReminderDateTime(reminder)}
                  </AppText>
                </View>
              </PressableScale>
            </Animated.View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: Spacing.md,
    marginTop: Spacing.lg,
  },
  list: {
    gap: Spacing.sm,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    paddingVertical: 12,
    paddingHorizontal: 14,
    gap: 12,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  iconWrapper: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    gap: 2,
  },
  empty: {
    alignItems: 'flex-start',
    gap: Spacing.sm,
    paddingVertical: Spacing.sm,
  },
  addBtn: {
    minWidth: 140,
  },
});
