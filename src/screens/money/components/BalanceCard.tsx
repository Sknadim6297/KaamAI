import React from 'react';
import { View, StyleSheet } from 'react-native';
import { TrendingDown, TrendingUp, Wallet } from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Colors, Radius, Shadows, Spacing } from '../../../theme';
import { AppText } from '../../../components/ui';
import { formatCurrency } from '../../../utils/money';
import type { MoneySummary } from '../../../types/money';

interface BalanceCardProps {
  summary: MoneySummary;
}

export function BalanceCard({ summary }: BalanceCardProps) {
  return (
    <Animated.View
      entering={FadeInDown.delay(60).duration(500).springify()}
      style={styles.wrapper}
    >
      <View style={styles.card} accessibilityLabel={`Available balance ${formatCurrency(summary.balance)}`}>
        <View style={styles.badge}>
          <AppText variant="caption" color="primary" style={styles.badgeText}>
            This month
          </AppText>
        </View>

        <View style={styles.balanceHeader}>
          <View style={styles.walletIcon}>
            <Wallet color={Colors.white} size={16} strokeWidth={2} />
          </View>
          <AppText variant="bodySmall" color="muted">
            Available balance
          </AppText>
        </View>

        <AppText variant="display" style={styles.balance}>
          {formatCurrency(summary.balance)}
        </AppText>

        <View style={styles.row}>
          <View style={styles.stat}>
            <View style={[styles.statIcon, styles.incomeIcon]}>
              <TrendingUp color={Colors.success} size={14} strokeWidth={2.5} />
            </View>
            <View>
              <AppText variant="caption" color="muted">
                Income
              </AppText>
              <AppText variant="bodySemiBold" style={styles.incomeText}>
                {formatCurrency(summary.income)}
              </AppText>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.stat}>
            <View style={[styles.statIcon, styles.expenseIcon]}>
              <TrendingDown color={Colors.danger} size={14} strokeWidth={2.5} />
            </View>
            <View>
              <AppText variant="caption" color="muted">
                Expense
              </AppText>
              <AppText variant="bodySemiBold" style={styles.expenseText}>
                {formatCurrency(summary.expense)}
              </AppText>
            </View>
          </View>
        </View>
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
    borderRadius: Radius['2xl'],
    padding: Spacing.md + 4,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    ...Shadows.md,
  },
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.primarySubtle,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: Radius.full,
    marginBottom: Spacing.md,
  },
  badgeText: {
    fontWeight: '600',
  },
  balanceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  walletIcon: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  balance: {
    fontSize: 34,
    lineHeight: 40,
    marginBottom: Spacing.md,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
    paddingTop: Spacing.md,
  },
  stat: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  statIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  incomeIcon: {
    backgroundColor: Colors.successLight,
  },
  expenseIcon: {
    backgroundColor: Colors.dangerLight,
  },
  incomeText: {
    color: Colors.success,
  },
  expenseText: {
    color: Colors.danger,
  },
  divider: {
    width: 1,
    height: 32,
    backgroundColor: Colors.borderLight,
    marginHorizontal: Spacing.md,
  },
});
