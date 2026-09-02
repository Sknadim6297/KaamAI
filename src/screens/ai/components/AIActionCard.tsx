import React, { memo } from 'react';
import { View, StyleSheet } from 'react-native';
import {
  Calculator,
  Bell,
  Wallet,
  Receipt,
  TrendingUp,
  PieChart,
  Check,
  LucideIcon,
} from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Colors, Radius, Shadows, Spacing } from '../../../theme';
import { AppText, AppButton, PressableScale } from '../../../components/ui';
import { getActionPrimaryLabel, getActionTitle } from '../../../services/ai';
import type { AIAction } from '../../../types/ai';

interface AIActionCardProps {
  action: AIAction;
  onConfirm: () => void;
  onCancel?: () => void;
  busy?: boolean;
}

const ACTION_ICONS: Record<AIAction['type'], LucideIcon> = {
  create_expense: Receipt,
  create_income: TrendingUp,
  show_spending: PieChart,
  open_calculator: Calculator,
  create_reminder: Bell,
  create_budget: Wallet,
};

function AIActionCardComponent({ action, onConfirm, onCancel, busy }: AIActionCardProps) {
  const Icon = ACTION_ICONS[action.type];
  const isMutation =
    action.type === 'create_expense' ||
    action.type === 'create_income' ||
    action.type === 'create_reminder';
  const isCompleted = action.status === 'completed';
  const isCancelled = action.status === 'cancelled';
  const isPending = action.status === 'pending' || action.status === undefined;

  if (isCompleted) {
    return (
      <Animated.View entering={FadeInDown.duration(320)} style={styles.successCard}>
        <View style={styles.successIcon}>
          <Check color={Colors.success} size={16} strokeWidth={2.5} />
        </View>
        <AppText variant="bodySmall" style={styles.successText}>
          {action.label ?? 'Done'}
        </AppText>
      </Animated.View>
    );
  }

  if (isCancelled) {
    return (
      <Animated.View entering={FadeInDown.duration(280)} style={styles.cancelledCard}>
        <AppText variant="bodySmall" color="muted">
          Action cancelled
        </AppText>
      </Animated.View>
    );
  }

  return (
    <Animated.View entering={FadeInDown.duration(360).springify()} style={styles.card}>
      <View style={styles.header}>
        <View style={styles.iconWrap}>
          <Icon color={Colors.primary} size={18} strokeWidth={2} />
        </View>
        <AppText variant="bodySemiBold" style={styles.title}>
          {getActionTitle(action)}
        </AppText>
      </View>

      <View style={styles.actions}>
        <AppButton
          label={getActionPrimaryLabel(action)}
          onPress={onConfirm}
          loading={busy}
          disabled={busy}
          size="sm"
          style={styles.primaryBtn}
        />
        {isMutation && isPending && onCancel ? (
          <PressableScale
            onPress={onCancel}
            disabled={busy}
            style={styles.cancelBtn}
            accessibilityRole="button"
            accessibilityLabel="Cancel"
          >
            <AppText variant="buttonSmall" color="secondary">
              {action.secondaryLabel ?? 'Cancel'}
            </AppText>
          </PressableScale>
        ) : null}
      </View>
    </Animated.View>
  );
}

export const AIActionCard = memo(AIActionCardComponent);

const styles = StyleSheet.create({
  card: {
    marginTop: Spacing.sm,
    backgroundColor: Colors.surface,
    borderRadius: Radius.xl,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.primary + '33',
    ...Shadows.sm,
    gap: Spacing.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.primarySubtle,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    flex: 1,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  primaryBtn: {
    flexGrow: 1,
  },
  cancelBtn: {
    minHeight: 40,
    paddingHorizontal: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  successCard: {
    marginTop: Spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: Colors.successLight,
    borderRadius: Radius.lg,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: Colors.success + '33',
  },
  successIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  successText: {
    color: Colors.success,
    fontWeight: '600',
    flex: 1,
  },
  cancelledCard: {
    marginTop: Spacing.sm,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: Radius.lg,
    backgroundColor: Colors.borderLight,
  },
});
