import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Colors, Radius, Spacing } from '../../../theme';
import { AppText, PressableScale } from '../../../components/ui';
import { REMINDER_PRIORITY_LABELS } from '../../../constants/reminders';
import type { ReminderPriority } from '../../../types/reminder';

interface ReminderPrioritySelectorProps {
  value: ReminderPriority;
  onChange: (priority: ReminderPriority) => void;
}

const OPTIONS: ReminderPriority[] = ['low', 'medium', 'high'];

const PRIORITY_COLORS: Record<ReminderPriority, string> = {
  low: Colors.textMuted,
  medium: Colors.primary,
  high: Colors.warning,
};

export function ReminderPrioritySelector({ value, onChange }: ReminderPrioritySelectorProps) {
  return (
    <View style={styles.container}>
      <AppText variant="bodySmall" color="secondary">
        Priority
      </AppText>
      <View style={styles.row}>
        {OPTIONS.map((priority) => {
          const selected = value === priority;
          return (
            <PressableScale
              key={priority}
              onPress={() => onChange(priority)}
              style={[styles.chip, selected && styles.chipSelected]}
              accessibilityRole="button"
              accessibilityState={{ selected }}
              accessibilityLabel={`Priority ${REMINDER_PRIORITY_LABELS[priority]}`}
            >
              <View style={[styles.dot, { backgroundColor: PRIORITY_COLORS[priority] }]} />
              <AppText
                variant="bodySmall"
                style={{ fontWeight: '600', color: selected ? Colors.primary : Colors.textSecondary }}
              >
                {REMINDER_PRIORITY_LABELS[priority]}
              </AppText>
            </PressableScale>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: Spacing.sm },
  row: { flexDirection: 'row', gap: 8 },
  chip: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 12,
    borderRadius: Radius.lg,
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.border,
    minHeight: 44,
  },
  chipSelected: {
    backgroundColor: Colors.primarySubtle,
    borderColor: Colors.primary + '55',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});
