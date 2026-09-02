import React, { useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import { Colors, Radius, Spacing } from '../../../theme';
import { AppText, PressableScale } from '../../../components/ui';
import { toISODateString } from '../../../utils/formatNumber';

interface ReminderDateSelectorProps {
  value: string;
  onChange: (isoDate: string) => void;
}

function addDays(date: Date, days: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

type Preset = 'today' | 'tomorrow' | 'custom';

function resolvePreset(value: string): Preset {
  const today = toISODateString(new Date());
  const tomorrow = toISODateString(addDays(new Date(), 1));
  if (value === today) return 'today';
  if (value === tomorrow) return 'tomorrow';
  return 'custom';
}

export function ReminderDateSelector({ value, onChange }: ReminderDateSelectorProps) {
  const preset = resolvePreset(value);

  const displayLabel = useMemo(() => {
    const [y, m, d] = value.split('-').map(Number);
    const date = new Date(y, m - 1, d);
    return date.toLocaleDateString('en-IN', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  }, [value]);

  const setToday = () => onChange(toISODateString(new Date()));
  const setTomorrow = () => onChange(toISODateString(addDays(new Date(), 1)));
  const setNextWeek = () => onChange(toISODateString(addDays(new Date(), 7)));

  return (
    <View style={styles.container}>
      <AppText variant="bodySmall" color="secondary">
        Date
      </AppText>
      <View style={styles.row}>
        <PressableScale
          onPress={setToday}
          style={[styles.chip, preset === 'today' && styles.chipSelected]}
          accessibilityRole="button"
          accessibilityState={{ selected: preset === 'today' }}
          accessibilityLabel="Today"
        >
          <AppText variant="bodySmall" style={{ fontWeight: '600', color: preset === 'today' ? Colors.primary : Colors.textSecondary }}>
            Today
          </AppText>
        </PressableScale>
        <PressableScale
          onPress={setTomorrow}
          style={[styles.chip, preset === 'tomorrow' && styles.chipSelected]}
          accessibilityRole="button"
          accessibilityState={{ selected: preset === 'tomorrow' }}
          accessibilityLabel="Tomorrow"
        >
          <AppText variant="bodySmall" style={{ fontWeight: '600', color: preset === 'tomorrow' ? Colors.primary : Colors.textSecondary }}>
            Tomorrow
          </AppText>
        </PressableScale>
        <PressableScale
          onPress={setNextWeek}
          style={[styles.chip, preset === 'custom' && styles.chipSelected]}
          accessibilityRole="button"
          accessibilityLabel="Select date"
        >
          <AppText variant="bodySmall" style={{ fontWeight: '600', color: preset === 'custom' ? Colors.primary : Colors.textSecondary }}>
            Select Date
          </AppText>
        </PressableScale>
      </View>
      <View style={styles.preview}>
        <AppText variant="bodyMedium">{displayLabel}</AppText>
        <View style={styles.quickRow}>
          <PressableScale onPress={() => onChange(toISODateString(addDays(new Date(), 3)))} style={styles.quickChip}>
            <AppText variant="caption" color="secondary">In 3 days</AppText>
          </PressableScale>
          <PressableScale onPress={setNextWeek} style={styles.quickChip}>
            <AppText variant="caption" color="secondary">In 1 week</AppText>
          </PressableScale>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: Spacing.sm },
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    paddingHorizontal: 14,
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
  preview: {
    backgroundColor: Colors.background,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    gap: 8,
  },
  quickRow: { flexDirection: 'row', gap: 8 },
  quickChip: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: Radius.full,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },
});
