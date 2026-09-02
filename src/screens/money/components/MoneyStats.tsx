import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ArrowDownLeft, ArrowUpRight } from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Colors, Radius, Spacing } from '../../../theme';
import { AppText } from '../../../components/ui';
import { formatCurrency } from '../../../utils/money';
import type { MoneySummary } from '../../../types/money';

interface MoneyStatsProps {
  summary: MoneySummary;
}

function formatChange(percent: number, positiveIsGood: boolean): { text: string; color: string } {
  const sign = percent > 0 ? '+' : '';
  const text = `${sign}${percent}% from last month`;
  if (percent === 0) return { text: 'No change from last month', color: Colors.textMuted };
  const isGood = positiveIsGood ? percent > 0 : percent < 0;
  return { text, color: isGood ? Colors.success : Colors.danger };
}

export function MoneyStats({ summary }: MoneyStatsProps) {
  const incomeChange = formatChange(summary.incomeChangePercent, true);
  const expenseChange = formatChange(summary.expenseChangePercent, false);

  return (
    <Animated.View
      entering={FadeInDown.delay(100).duration(480).springify()}
      style={styles.wrapper}
    >
      <View style={styles.card}>
        <View style={[styles.icon, styles.incomeBg]}>
          <ArrowDownLeft color={Colors.success} size={18} strokeWidth={2.5} />
        </View>
        <AppText variant="caption" color="muted">
          Income
        </AppText>
        <AppText variant="h3" style={styles.incomeAmount}>
          {formatCurrency(summary.income)}
        </AppText>
        <AppText variant="caption" style={{ color: incomeChange.color }}>
          {incomeChange.text}
        </AppText>
      </View>

      <View style={styles.card}>
        <View style={[styles.icon, styles.expenseBg]}>
          <ArrowUpRight color={Colors.danger} size={18} strokeWidth={2.5} />
        </View>
        <AppText variant="caption" color="muted">
          Expense
        </AppText>
        <AppText variant="h3" style={styles.expenseAmount}>
          {formatCurrency(summary.expense)}
        </AppText>
        <AppText variant="caption" style={{ color: expenseChange.color }}>
          {expenseChange.text}
        </AppText>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: Spacing.md,
    marginTop: Spacing.md,
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  card: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: Radius.xl,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    gap: 4,
  },
  icon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  incomeBg: {
    backgroundColor: Colors.successLight,
  },
  expenseBg: {
    backgroundColor: Colors.dangerLight,
  },
  incomeAmount: {
    color: Colors.success,
  },
  expenseAmount: {
    color: Colors.danger,
  },
});
