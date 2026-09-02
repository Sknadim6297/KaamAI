import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Colors, Radius, Spacing } from '../../../theme';
import { AppText, PressableScale } from '../../../components/ui';
import { REMINDER_TYPE_LABELS } from '../../../constants/reminders';
import type { ReminderRecurrence, ReminderType } from '../../../types/reminder';

interface ReminderRepeatSelectorProps {
  value: ReminderType;
  recurrence: ReminderRecurrence | undefined;
  onChange: (type: ReminderType, recurrence?: ReminderRecurrence) => void;
}

const OPTIONS: ReminderType[] = [
  'one-time',
  'daily',
  'weekly',
  'monthly',
  'yearly',
  'custom',
];

export function ReminderRepeatSelector({
  value,
  recurrence,
  onChange,
}: ReminderRepeatSelectorProps) {
  const customInterval = recurrence?.interval ?? 2;
  const customUnit = recurrence?.unit ?? 'days';

  return (
    <View style={styles.container}>
      <AppText variant="bodySmall" color="secondary">
        Repeat
      </AppText>
      <View style={styles.grid}>
        {OPTIONS.map((type) => {
          const selected = value === type;
          return (
            <PressableScale
              key={type}
              onPress={() => {
                if (type === 'custom') {
                  onChange('custom', { interval: 2, unit: 'days' });
                } else if (type === 'monthly') {
                  onChange('monthly', { monthDay: new Date().getDate() });
                } else {
                  onChange(type);
                }
              }}
              style={[styles.chip, selected && styles.chipSelected]}
              accessibilityRole="button"
              accessibilityState={{ selected }}
              accessibilityLabel={REMINDER_TYPE_LABELS[type]}
            >
              <AppText
                variant="caption"
                style={{ fontWeight: '600', color: selected ? Colors.primary : Colors.textSecondary }}
              >
                {REMINDER_TYPE_LABELS[type]}
              </AppText>
            </PressableScale>
          );
        })}
      </View>

      {value === 'custom' ? (
        <View style={styles.customRow}>
          <AppText variant="bodySmall" color="secondary">
            Every
          </AppText>
          {[2, 3, 7, 14].map((n) => (
            <PressableScale
              key={n}
              onPress={() => onChange('custom', { interval: n, unit: customUnit })}
              style={[styles.miniChip, customInterval === n && styles.chipSelected]}
              accessibilityRole="button"
              accessibilityLabel={`Every ${n}`}
            >
              <AppText variant="caption" style={{ fontWeight: '600' }}>{n}</AppText>
            </PressableScale>
          ))}
          <PressableScale
            onPress={() => onChange('custom', { interval: customInterval, unit: 'days' })}
            style={[styles.miniChip, customUnit === 'days' && styles.chipSelected]}
            accessibilityRole="button"
            accessibilityLabel="Days"
          >
            <AppText variant="caption" style={{ fontWeight: '600' }}>days</AppText>
          </PressableScale>
          <PressableScale
            onPress={() => onChange('custom', { interval: customInterval, unit: 'weeks' })}
            style={[styles.miniChip, customUnit === 'weeks' && styles.chipSelected]}
            accessibilityRole="button"
            accessibilityLabel="Weeks"
          >
            <AppText variant="caption" style={{ fontWeight: '600' }}>weeks</AppText>
          </PressableScale>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: Spacing.sm },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: Radius.full,
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.border,
    minHeight: 40,
    justifyContent: 'center',
  },
  chipSelected: {
    backgroundColor: Colors.primarySubtle,
    borderColor: Colors.primary + '55',
  },
  customRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 6,
    paddingTop: 4,
  },
  miniChip: {
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: Radius.full,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },
});
