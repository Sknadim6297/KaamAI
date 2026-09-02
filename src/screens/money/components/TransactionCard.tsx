import React, { useCallback } from 'react';
import { View, StyleSheet, Alert, Pressable } from 'react-native';
import { MoreHorizontal, Trash2 } from 'lucide-react-native';
import Animated, {
  FadeInDown,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { Colors, Radius, Spacing } from '../../../theme';
import { AppText, PressableScale } from '../../../components/ui';
import { getCategoryById, getCategoryIcon } from '../../../constants/categories';
import { formatCurrencySigned, formatTransactionDate } from '../../../utils/money';
import type { Transaction } from '../../../types/money';

const DELETE_WIDTH = 76;
const OPEN_THRESHOLD = 40;

interface TransactionCardProps {
  transaction: Transaction;
  index?: number;
  onPress: (transaction: Transaction) => void;
  onDelete: (transaction: Transaction) => void;
}

export function TransactionCard({
  transaction,
  index = 0,
  onPress,
  onDelete,
}: TransactionCardProps) {
  const translateX = useSharedValue(0);
  const category = getCategoryById(transaction.categoryId);
  const Icon = getCategoryIcon(category?.iconKey ?? 'more');
  const iconColor = category?.color ?? Colors.textSecondary;
  const iconBg = category?.bgColor ?? Colors.borderLight;
  const isIncome = transaction.type === 'income';

  const confirmDelete = useCallback(() => {
    Alert.alert(
      'Delete transaction',
      `Remove "${transaction.title}"? This cannot be undone.`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
          onPress: () => {
            translateX.value = withSpring(0, { damping: 18, stiffness: 220 });
          },
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => onDelete(transaction),
        },
      ],
    );
  }, [onDelete, transaction, translateX]);

  const showMenu = useCallback(() => {
    Alert.alert(transaction.title, undefined, [
      { text: 'Edit', onPress: () => onPress(transaction) },
      { text: 'Delete', style: 'destructive', onPress: confirmDelete },
      { text: 'Cancel', style: 'cancel' },
    ]);
  }, [confirmDelete, onPress, transaction]);

  const pan = Gesture.Pan()
    .activeOffsetX([-12, 12])
    .failOffsetY([-8, 8])
    .onUpdate((e) => {
      const next = Math.min(0, Math.max(-DELETE_WIDTH, e.translationX));
      translateX.value = next;
    })
    .onEnd(() => {
      if (translateX.value < -OPEN_THRESHOLD) {
        translateX.value = withSpring(-DELETE_WIDTH, { damping: 18, stiffness: 220 });
      } else {
        translateX.value = withSpring(0, { damping: 18, stiffness: 220 });
      }
    });

  const rowStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <Animated.View
      entering={FadeInDown.delay(Math.min(index * 40, 240)).duration(420).springify()}
      style={styles.wrapper}
    >
      <View style={styles.deleteLane}>
        <Pressable
          onPress={confirmDelete}
          style={styles.deleteButton}
          accessibilityRole="button"
          accessibilityLabel={`Delete ${transaction.title}`}
        >
          <Trash2 color={Colors.white} size={20} strokeWidth={2} />
        </Pressable>
      </View>

      <GestureDetector gesture={pan}>
        <Animated.View style={rowStyle}>
          <PressableScale
            onPress={() => onPress(transaction)}
            onLongPress={showMenu}
            style={styles.card}
            accessibilityRole="button"
            accessibilityLabel={`${transaction.categoryName}, ${transaction.title}, ${formatCurrencySigned(transaction.amount, transaction.type)}`}
          >
            <View style={[styles.iconWrap, { backgroundColor: iconBg }]}>
              <Icon color={iconColor} size={18} strokeWidth={2} />
            </View>

            <View style={styles.content}>
              <AppText variant="bodyMedium" numberOfLines={1}>
                {transaction.categoryName}
              </AppText>
              <AppText variant="bodySmall" color="muted" numberOfLines={1}>
                {transaction.title}
                {' · '}
                {formatTransactionDate(transaction.date)}
              </AppText>
            </View>

            <View style={styles.right}>
              <AppText
                variant="bodySemiBold"
                style={{ color: isIncome ? Colors.success : Colors.danger }}
              >
                {formatCurrencySigned(transaction.amount, transaction.type)}
              </AppText>
              <Pressable
                onPress={showMenu}
                hitSlop={10}
                style={styles.menuHit}
                accessibilityRole="button"
                accessibilityLabel="Transaction actions"
              >
                <MoreHorizontal color={Colors.textMuted} size={18} strokeWidth={2} />
              </Pressable>
            </View>
          </PressableScale>
        </Animated.View>
      </GestureDetector>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: Spacing.sm,
    marginHorizontal: Spacing.md,
    overflow: 'hidden',
    borderRadius: Radius.lg,
  },
  deleteLane: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'flex-end',
    justifyContent: 'center',
    backgroundColor: Colors.danger,
    borderRadius: Radius.lg,
  },
  deleteButton: {
    width: DELETE_WIDTH,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    paddingVertical: 12,
    paddingHorizontal: 14,
    gap: 12,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    minHeight: 64,
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    gap: 2,
  },
  right: {
    alignItems: 'flex-end',
    gap: 4,
  },
  menuHit: {
    minWidth: 28,
    minHeight: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
