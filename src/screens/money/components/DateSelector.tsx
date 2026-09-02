import React, { useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import { Colors, Radius, Spacing } from '../../../theme';
import { AppText, PressableScale } from '../../../components/ui';
import { parseISODate, toISODate } from '../../../utils/money';

interface DateSelectorProps {
  value: string;
  onChange: (isoDate: string) => void;
}

type Preset = 'today' | 'yesterday' | 'custom';

function resolvePreset(value: string): Preset {
  const today = toISODate(new Date());
  const yesterdayDate = new Date();
  yesterdayDate.setDate(yesterdayDate.getDate() - 1);
  const yesterday = toISODate(yesterdayDate);

  if (value === today) return 'today';
  if (value === yesterday) return 'yesterday';
  return 'custom';
}

export function DateSelector({ value, onChange }: DateSelectorProps) {
  const preset = resolvePreset(value);

  const displayLabel = useMemo(() => {
    const date = parseISODate(value);
    return date.toLocaleDateString('en-IN', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  }, [value]);

  const setToday = () => onChange(toISODate(new Date()));
  const setYesterday = () => {
    const d = new Date();
    d.setDate(d.getDate() - 1);
    onChange(toISODate(d));
  };
  const setThreeDaysAgo = () => {
    const d = new Date();
    d.setDate(d.getDate() - 3);
    onChange(toISODate(d));
  };
  const setWeekAgo = () => {
    const d = new Date();
    d.setDate(d.getDate() - 7);
    onChange(toISODate(d));
  };

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
          <AppText
            variant="bodySmall"
            style={{
              fontWeight: '600',
              color: preset === 'today' ? Colors.primary : Colors.textSecondary,
            }}
          >
            Today
          </AppText>
        </PressableScale>

        <PressableScale
          onPress={setYesterday}
          style={[styles.chip, preset === 'yesterday' && styles.chipSelected]}
          accessibilityRole="button"
          accessibilityState={{ selected: preset === 'yesterday' }}
          accessibilityLabel="Yesterday"
        >
          <AppText
            variant="bodySmall"
            style={{
              fontWeight: '600',
              color: preset === 'yesterday' ? Colors.primary : Colors.textSecondary,
            }}
          >
            Yesterday
          </AppText>
        </PressableScale>

        <PressableScale
          onPress={setThreeDaysAgo}
          style={[styles.chip, preset === 'custom' && styles.chipSelected]}
          accessibilityRole="button"
          accessibilityLabel="Select another date"
        >
          <AppText
            variant="bodySmall"
            style={{
              fontWeight: '600',
              color: preset === 'custom' ? Colors.primary : Colors.textSecondary,
            }}
          >
            Select date
          </AppText>
        </PressableScale>
      </View>

      <View style={styles.preview}>
        <AppText variant="bodyMedium">{displayLabel}</AppText>
        <View style={styles.quickRow}>
          <PressableScale onPress={setThreeDaysAgo} style={styles.quickChip}>
            <AppText variant="caption" color="secondary">
              3 days ago
            </AppText>
          </PressableScale>
          <PressableScale onPress={setWeekAgo} style={styles.quickChip}>
            <AppText variant="caption" color="secondary">
              1 week ago
            </AppText>
          </PressableScale>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.sm,
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
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
  quickRow: {
    flexDirection: 'row',
    gap: 8,
  },
  quickChip: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: Radius.full,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },
});
