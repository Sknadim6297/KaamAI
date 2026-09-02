import React from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Colors, Radius, Spacing } from '../../../theme';
import { AppText, ProgressBar } from '../../../components/ui';
import { formatCurrency } from '../../../utils/money';
import type { MoneySummary } from '../../../types/money';

interface MonthlySpendingProps {
  summary: MoneySummary;
}

export function MonthlySpending({ summary }: MonthlySpendingProps) {
  const percent = Math.round(summary.spendingProgress * 100);
  const fillColor =
    summary.spendingProgress >= 0.9
      ? Colors.danger
      : summary.spendingProgress >= 0.7
        ? Colors.warning
        : Colors.primary;

  return (
    <Animated.View
      entering={FadeInDown.delay(140).duration(480).springify()}
      style={styles.wrapper}
    >
      <View style={styles.card}>
        <View style={styles.header}>
          <AppText variant="bodySemiBold">Monthly spending</AppText>
          <AppText variant="bodySmall" color="primary" style={styles.percent}>
            {percent}%
          </AppText>
        </View>

        <AppText variant="bodySmall" color="secondary" style={styles.amounts}>
          {formatCurrency(summary.expense)} of {formatCurrency(summary.monthlyBudget)}
        </AppText>

        <ProgressBar progress={summary.spendingProgress} fillColor={fillColor} height={8} />

        <AppText variant="bodySmall" color="muted" style={styles.remaining}>
          {formatCurrency(summary.remaining)} remaining
        </AppText>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: Spacing.md,
    marginTop: Spacing.md,
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.xl,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    gap: Spacing.sm,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  percent: {
    fontWeight: '700',
  },
  amounts: {
    marginBottom: 2,
  },
  remaining: {
    marginTop: 2,
  },
});
