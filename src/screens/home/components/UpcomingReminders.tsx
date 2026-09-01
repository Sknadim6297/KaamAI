import React from 'react';
import { View, StyleSheet } from 'react-native';
import {
  Home,
  Smartphone,
  Shield,
  LucideIcon,
} from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Colors, Radius, Spacing } from '../../../theme';
import { AppText, PressableScale, SectionHeader } from '../../../components/ui';

type ReminderStatus = 'upcoming' | 'due-soon' | 'scheduled';

interface Reminder {
  id: string;
  title: string;
  dateTime: string;
  amount?: string;
  status: ReminderStatus;
  icon: LucideIcon;
  color: string;
}

const REMINDERS: Reminder[] = [
  {
    id: '1',
    title: 'Rent',
    dateTime: 'Tomorrow • 10:00 AM',
    amount: '₹12,000',
    status: 'due-soon',
    icon: Home,
    color: Colors.danger,
  },
  {
    id: '2',
    title: 'Mobile Recharge',
    dateTime: '5 Sep • 8:00 PM',
    amount: '₹299',
    status: 'upcoming',
    icon: Smartphone,
    color: Colors.info,
  },
  {
    id: '3',
    title: 'Insurance',
    dateTime: '12 Sep',
    status: 'scheduled',
    icon: Shield,
    color: Colors.warning,
  },
];

const STATUS_COLORS: Record<ReminderStatus, string> = {
  upcoming: Colors.success,
  'due-soon': Colors.danger,
  scheduled: Colors.textMuted,
};

interface ReminderCardProps {
  reminder: Reminder;
  index: number;
  onPress?: () => void;
}

function ReminderCard({ reminder, index, onPress }: ReminderCardProps) {
  const Icon = reminder.icon;

  return (
    <Animated.View entering={FadeInDown.delay(380 + index * 60).duration(480).springify()}>
      <PressableScale
        onPress={onPress}
        style={styles.card}
        accessibilityRole="button"
        accessibilityLabel={`${reminder.title}, ${reminder.dateTime}`}
      >
        <View style={[styles.iconWrapper, { backgroundColor: reminder.color + '18' }]}>
          <Icon color={reminder.color} size={17} strokeWidth={2} />
        </View>

        <View style={styles.content}>
          <AppText variant="bodyMedium" numberOfLines={1}>
            {reminder.title}
          </AppText>
          <AppText variant="bodySmall" color="muted" numberOfLines={1}>
            {reminder.dateTime}
          </AppText>
        </View>

        <View style={styles.right}>
          {reminder.amount ? (
            <AppText variant="bodySmall" style={styles.amount}>
              {reminder.amount}
            </AppText>
          ) : null}
          <View
            style={[styles.statusDot, { backgroundColor: STATUS_COLORS[reminder.status] }]}
            accessibilityLabel={`Status ${reminder.status}`}
          />
        </View>
      </PressableScale>
    </Animated.View>
  );
}

interface UpcomingRemindersProps {
  onViewAllPress?: () => void;
  onReminderPress?: (id: string) => void;
}

export function UpcomingReminders({ onViewAllPress, onReminderPress }: UpcomingRemindersProps) {
  return (
    <View style={styles.wrapper}>
      <SectionHeader title="Upcoming" actionLabel="View all" onActionPress={onViewAllPress} />

      <View style={styles.list}>
        {REMINDERS.map((reminder, index) => (
          <ReminderCard
            key={reminder.id}
            reminder={reminder}
            index={index}
            onPress={() => onReminderPress?.(reminder.id)}
          />
        ))}
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
  right: {
    alignItems: 'flex-end',
    gap: 6,
  },
  amount: {
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  statusDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
  },
});
