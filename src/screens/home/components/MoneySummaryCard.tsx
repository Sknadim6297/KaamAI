import React from 'react';
import { View, StyleSheet } from 'react-native';
import { TrendingUp, TrendingDown, Wallet } from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import { Colors, Radius, Shadows, Spacing } from '../../../theme';
import { AppText, PressableScale, ProgressBar, EmptyState } from '../../../components/ui';

interface MoneySummaryCardProps {
  balance?: number;
  income?: number;
  expense?: number;
  monthlyBudget?: number;
  hasTransactions?: boolean;
  onPress?: () => void;
  onAddExpensePress?: () => void;
}

function formatCurrency(amount: number): string {
  return '₹' + amount.toLocaleString('en-IN');
}

export function MoneySummaryCard({
  balance = 12500,
  income = 16000,
  expense = 3500,
  monthlyBudget = 12000,
  hasTransactions = true,
  onPress,
  onAddExpensePress,
}: MoneySummaryCardProps) {
  const router = useRouter();
  const spendingProgress = monthlyBudget > 0 ? expense / monthlyBudget : 0;
  const progressColor =
    spendingProgress >= 0.9
      ? Colors.danger
      : spendingProgress >= 0.7
        ? Colors.warning
        : Colors.primary;

  const handlePress = () => {
    if (onPress) {
      onPress();
    } else {
      router.push('/(tabs)/money');
    }
  };

  const handleAddExpense = () => {
    if (onAddExpensePress) {
      onAddExpensePress();
    } else {
      router.push('/(tabs)/money');
    }
  };

  if (!hasTransactions) {
    return (
      <Animated.View
        entering={FadeInDown.delay(160).duration(550).springify()}
        style={styles.wrapper}
      >
        <View style={styles.card}>
          <EmptyState
            title="Start tracking your money"
            description="Add your first expense to understand where your money goes."
            actionLabel="Add expense"
            onActionPress={handleAddExpense}
            icon={<Wallet color={Colors.primary} size={24} strokeWidth={2} />}
          />
        </View>
      </Animated.View>
    );
  }

  return (
    <Animated.View
      entering={FadeInDown.delay(160).duration(550).springify()}
      style={styles.wrapper}
    >
      <PressableScale
        onPress={handlePress}
        style={styles.card}
        accessibilityRole="button"
        accessibilityLabel={`Available balance ${formatCurrency(balance)}`}
        accessibilityHint="Open money overview"
      >
        <View style={styles.monthBadge}>
          <AppText variant="caption" color="primary" style={styles.monthBadgeText}>
            This month
          </AppText>
        </View>

        <View style={styles.balanceSection}>
          <View style={styles.balanceHeader}>
            <View style={styles.walletIcon}>
              <Wallet color={Colors.white} size={16} strokeWidth={2} />
            </View>
            <AppText variant="bodySmall" color="muted">
              Available balance
            </AppText>
          </View>
          <AppText variant="display" style={styles.balanceAmount}>
            {formatCurrency(balance)}
          </AppText>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <View style={[styles.statIcon, styles.incomeIcon]}>
              <TrendingUp color={Colors.success} size={15} strokeWidth={2.5} />
            </View>
            <View style={styles.statText}>
              <AppText variant="caption" color="muted">
                Income
              </AppText>
              <AppText variant="bodySemiBold" style={styles.incomeAmount}>
                {formatCurrency(income)}
              </AppText>
            </View>
          </View>

          <View style={styles.separator} />

          <View style={styles.statItem}>
            <View style={[styles.statIcon, styles.expenseIcon]}>
              <TrendingDown color={Colors.danger} size={15} strokeWidth={2.5} />
            </View>
            <View style={styles.statText}>
              <AppText variant="caption" color="muted">
                Expense
              </AppText>
              <AppText variant="bodySemiBold" style={styles.expenseAmount}>
                {formatCurrency(expense)}
              </AppText>
            </View>
          </View>
        </View>

        <View style={styles.progressSection}>
          <View style={styles.progressHeader}>
            <AppText variant="bodySmall" color="secondary">
              Monthly spending
            </AppText>
            <AppText variant="bodySmall" color="secondary">
              {formatCurrency(expense)} / {formatCurrency(monthlyBudget)}
            </AppText>
          </View>
          <ProgressBar progress={spendingProgress} fillColor={progressColor} />
        </View>
      </PressableScale>
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
    ...Shadows.md,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    overflow: 'hidden',
  },
  monthBadge: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.primarySubtle,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: Radius.full,
    marginBottom: Spacing.md,
  },
  monthBadgeText: {
    fontWeight: '600',
  },
  balanceSection: {
    marginBottom: Spacing.md,
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
  balanceAmount: {
    fontSize: 34,
    lineHeight: 40,
    letterSpacing: -0.5,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
  },
  statItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  statIcon: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
  },
  incomeIcon: {
    backgroundColor: Colors.successLight,
  },
  expenseIcon: {
    backgroundColor: Colors.dangerLight,
  },
  statText: {
    gap: 2,
  },
  incomeAmount: {
    color: Colors.success,
  },
  expenseAmount: {
    color: Colors.danger,
  },
  separator: {
    width: 1,
    height: 32,
    backgroundColor: Colors.borderLight,
    marginHorizontal: Spacing.md,
  },
  progressSection: {
    marginTop: Spacing.md,
    gap: Spacing.sm,
  },
  progressHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});
