import React from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Colors, Radius, Shadows, Spacing } from '../../../theme';
import { AppText } from '../../../components/ui';
import type { CalculatorResult } from '../../../types/calculator';
import { CalculatorKeyValue } from './CalculatorKeyValue';

interface CalculatorResultCardProps {
  result: CalculatorResult;
}

export function CalculatorResultCard({ result }: CalculatorResultCardProps) {
  return (
    <Animated.View entering={FadeInDown.duration(380).springify()} style={styles.card}>
      <AppText variant="bodySmall" color="muted">
        {result.title}
      </AppText>
      <AppText variant="display" style={styles.primary}>
        {result.primaryValue}
      </AppText>
      {result.primaryLabel ? (
        <AppText variant="bodySmall" color="secondary" style={styles.sub}>
          {result.primaryLabel}
        </AppText>
      ) : null}

      <View style={styles.rows}>
        {result.rows.map((row) => (
          <CalculatorKeyValue
            key={row.label}
            label={row.label}
            value={row.value}
            highlight={row.highlight}
          />
        ))}
      </View>

      {result.note ? (
        <AppText variant="caption" color="muted" style={styles.note}>
          {result.note}
        </AppText>
      ) : null}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Radius['2xl'],
    padding: Spacing.md + 4,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    ...Shadows.md,
    gap: 6,
  },
  primary: {
    fontSize: 30,
    lineHeight: 36,
    marginTop: 4,
  },
  sub: {
    marginBottom: Spacing.sm,
  },
  rows: {
    marginTop: Spacing.sm,
  },
  note: {
    marginTop: Spacing.sm,
    lineHeight: 16,
  },
});
