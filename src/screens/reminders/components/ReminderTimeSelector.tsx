import React, { useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import { Colors, Radius, Spacing } from '../../../theme';
import { AppText, PressableScale } from '../../../components/ui';

interface ReminderTimeSelectorProps {
  value: string; // HH:mm 24h
  onChange: (time: string) => void;
}

const HOURS = [6, 7, 8, 9, 10, 11, 12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
const MINUTES = [0, 15, 30, 45];

function parse24(value: string): { hour12: number; minute: number; period: 'AM' | 'PM' } {
  const match = value.match(/^(\d{1,2}):(\d{2})$/);
  if (!match) return { hour12: 9, minute: 0, period: 'AM' };
  let hours = Number(match[1]);
  const minute = Number(match[2]);
  const period: 'AM' | 'PM' = hours >= 12 ? 'PM' : 'AM';
  const hour12 = hours % 12 || 12;
  return { hour12, minute, period };
}

function to24(hour12: number, minute: number, period: 'AM' | 'PM'): string {
  let hours = hour12 % 12;
  if (period === 'PM') hours += 12;
  return `${String(hours).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
}

export function ReminderTimeSelector({ value, onChange }: ReminderTimeSelectorProps) {
  const parsed = useMemo(() => parse24(value), [value]);

  const display = `${parsed.hour12}:${String(parsed.minute).padStart(2, '0')} ${parsed.period}`;

  const setHour = (hour12: number) => {
    onChange(to24(hour12, parsed.minute, parsed.period));
  };

  const setMinute = (minute: number) => {
    onChange(to24(parsed.hour12, minute, parsed.period));
  };

  const setPeriod = (period: 'AM' | 'PM') => {
    onChange(to24(parsed.hour12, parsed.minute, period));
  };

  return (
    <View style={styles.container}>
      <AppText variant="bodySmall" color="secondary">
        Time
      </AppText>
      <View style={styles.preview}>
        <AppText variant="bodyMedium">{display}</AppText>
      </View>

      <AppText variant="caption" color="muted">
        Hour
      </AppText>
      <View style={styles.row}>
        {HOURS.map((h, idx) => {
          const selected = parsed.hour12 === h;
          return (
            <PressableScale
              key={`${h}-${idx}`}
              onPress={() => setHour(h)}
              style={[styles.chip, selected && styles.chipSelected]}
              accessibilityRole="button"
              accessibilityState={{ selected }}
              accessibilityLabel={`Hour ${h}`}
            >
              <AppText variant="caption" style={{ fontWeight: '600', color: selected ? Colors.primary : Colors.textSecondary }}>
                {h}
              </AppText>
            </PressableScale>
          );
        })}
      </View>

      <AppText variant="caption" color="muted">
        Minute
      </AppText>
      <View style={styles.row}>
        {MINUTES.map((m) => {
          const selected = parsed.minute === m;
          return (
            <PressableScale
              key={m}
              onPress={() => setMinute(m)}
              style={[styles.chip, selected && styles.chipSelected]}
              accessibilityRole="button"
              accessibilityState={{ selected }}
              accessibilityLabel={`Minute ${m}`}
            >
              <AppText variant="caption" style={{ fontWeight: '600', color: selected ? Colors.primary : Colors.textSecondary }}>
                {String(m).padStart(2, '0')}
              </AppText>
            </PressableScale>
          );
        })}
      </View>

      <View style={styles.periodRow}>
        {(['AM', 'PM'] as const).map((p) => {
          const selected = parsed.period === p;
          return (
            <PressableScale
              key={p}
              onPress={() => setPeriod(p)}
              style={[styles.periodChip, selected && styles.chipSelected]}
              accessibilityRole="button"
              accessibilityState={{ selected }}
              accessibilityLabel={p}
            >
              <AppText variant="bodySmall" style={{ fontWeight: '700', color: selected ? Colors.primary : Colors.textSecondary }}>
                {p}
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
  preview: {
    backgroundColor: Colors.background,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  chip: {
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: Radius.full,
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.border,
    minWidth: 36,
    alignItems: 'center',
  },
  chipSelected: {
    backgroundColor: Colors.primarySubtle,
    borderColor: Colors.primary + '55',
  },
  periodRow: { flexDirection: 'row', gap: 8 },
  periodChip: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: Radius.lg,
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
  },
});
