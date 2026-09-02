import React, { memo, useCallback } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Check, MoreHorizontal } from 'lucide-react-native';
import Animated, {
  FadeInDown,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { Colors, Radius, Shadows, Spacing } from '../../../theme';
import { AppText, PressableScale } from '../../../components/ui';
import {
  getReminderCategoryById,
  getReminderCategoryIcon,
} from '../../../constants/reminders';
import type { Reminder } from '../../../types/reminder';
import {
  formatReminderDateTime,
  getRecurrenceLabel,
  isReminderOverdue,
} from '../../../utils/reminderDate';

interface ReminderCardProps {
  reminder: Reminder;
  index?: number;
  onToggleComplete: (id: string) => void;
  onPress?: (reminder: Reminder) => void;
  onEdit?: (reminder: Reminder) => void;
  onDelete?: (id: string) => void;
}

function ReminderCardComponent({
  reminder,
  index = 0,
  onToggleComplete,
  onPress,
  onEdit,
  onDelete,
}: ReminderCardProps) {
  const scale = useSharedValue(1);
  const category = getReminderCategoryById(reminder.categoryId);
  const Icon = getReminderCategoryIcon(category?.iconKey ?? 'more');
  const overdue = isReminderOverdue(reminder);
  const completed = reminder.completed;

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: completed ? 0.72 : 1,
  }));

  const handleComplete = useCallback(() => {
    scale.value = withSpring(0.97, { damping: 14 }, () => {
      scale.value = withSpring(1);
    });
    onToggleComplete(reminder.id);
  }, [onToggleComplete, reminder.id, scale]);

  const handleMenu = useCallback(() => {
    Alert.alert(reminder.title, undefined, [
      { text: 'Edit', onPress: () => onEdit?.(reminder) },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          Alert.alert(
            'Delete reminder?',
            'This action cannot be undone.',
            [
              { text: 'Cancel', style: 'cancel' },
              { text: 'Delete', style: 'destructive', onPress: () => onDelete?.(reminder.id) },
            ],
          );
        },
      },
      { text: 'Cancel', style: 'cancel' },
    ]);
  }, [onDelete, onEdit, reminder]);

  const priorityBorder =
    reminder.priority === 'high'
      ? Colors.warning + '66'
      : reminder.priority === 'medium'
        ? Colors.primary + '33'
        : Colors.borderLight;

  return (
    <Animated.View
      entering={FadeInDown.delay(index * 40).duration(360).springify()}
      style={animatedStyle}
    >
      <PressableScale
        onPress={() => onPress?.(reminder)}
        style={[
          styles.card,
          { borderColor: priorityBorder },
          completed && styles.cardCompleted,
        ]}
        accessibilityRole="button"
        accessibilityLabel={`${reminder.title}, ${formatReminderDateTime(reminder)}`}
      >
        <View style={[styles.iconWrap, { backgroundColor: category?.bgColor ?? Colors.borderLight }]}>
          <Icon color={category?.color ?? Colors.textMuted} size={18} strokeWidth={2} />
        </View>

        <View style={styles.content}>
          <View style={styles.titleRow}>
            <AppText
              variant="bodyMedium"
              numberOfLines={1}
              style={completed ? styles.titleCompleted : styles.title}
            >
              {reminder.title}
            </AppText>
            {overdue && !completed ? (
              <View style={styles.overdueBadge}>
                <AppText variant="caption" style={styles.overdueText}>
                  Overdue
                </AppText>
              </View>
            ) : null}
          </View>

          {reminder.note ? (
            <AppText variant="bodySmall" color="muted" numberOfLines={2}>
              {reminder.note}
            </AppText>
          ) : null}

          <AppText variant="bodySmall" color="secondary" numberOfLines={1}>
            {formatReminderDateTime(reminder)}
          </AppText>

          {reminder.type !== 'one-time' ? (
            <AppText variant="caption" color="muted">
              {getRecurrenceLabel(reminder)}
            </AppText>
          ) : null}
        </View>

        <View style={styles.actions}>
          <PressableScale
            onPress={handleMenu}
            style={styles.menuBtn}
            accessibilityRole="button"
            accessibilityLabel="More actions"
          >
            <MoreHorizontal color={Colors.textMuted} size={18} />
          </PressableScale>

          <PressableScale
            onPress={handleComplete}
            style={[styles.checkBtn, completed && styles.checkBtnDone]}
            accessibilityRole="checkbox"
            accessibilityState={{ checked: completed }}
            accessibilityLabel={completed ? 'Mark incomplete' : 'Mark complete'}
          >
            {completed ? (
              <Check color={Colors.surface} size={14} strokeWidth={3} />
            ) : null}
          </PressableScale>
        </View>
      </PressableScale>
    </Animated.View>
  );
}

export const ReminderCard = memo(ReminderCardComponent);

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: Colors.surface,
    borderRadius: Radius.xl,
    padding: 14,
    gap: 12,
    borderWidth: 1,
    ...Shadows.sm,
  },
  cardCompleted: {
    backgroundColor: Colors.borderLight,
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  content: {
    flex: 1,
    gap: 4,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    flex: 1,
    fontWeight: '600',
  },
  titleCompleted: {
    textDecorationLine: 'line-through',
    color: Colors.textMuted,
  },
  overdueBadge: {
    backgroundColor: Colors.dangerLight,
    borderRadius: Radius.full,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  overdueText: {
    color: Colors.danger,
    fontWeight: '700',
  },
  actions: {
    alignItems: 'center',
    gap: 8,
  },
  menuBtn: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: Colors.primary + '88',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.surface,
  },
  checkBtnDone: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
});
