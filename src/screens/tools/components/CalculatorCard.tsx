import React, { memo } from 'react';
import { View, StyleSheet } from 'react-native';
import { ChevronRight, Star } from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Colors, Radius, Spacing } from '../../../theme';
import { AppText, PressableScale } from '../../../components/ui';
import type { CalculatorDefinition } from '../../../types/calculator';
import { getCalculatorIcon } from '../calculatorIcons';

interface CalculatorCardProps {
  calculator: CalculatorDefinition;
  index?: number;
  featured?: boolean;
  isFavorite?: boolean;
  onPress: () => void;
  onToggleFavorite?: () => void;
}

function CalculatorCardComponent({
  calculator,
  index = 0,
  featured,
  isFavorite,
  onPress,
  onToggleFavorite,
}: CalculatorCardProps) {
  const Icon = getCalculatorIcon(calculator.iconKey);

  if (featured) {
    return (
      <Animated.View entering={FadeInDown.duration(450).springify()} style={styles.featuredWrap}>
        <PressableScale
          onPress={onPress}
          style={styles.featuredCard}
          accessibilityRole="button"
          accessibilityLabel={`${calculator.title}. ${calculator.description}`}
        >
          <View style={styles.featuredLeft}>
            <View style={styles.featuredIcon}>
              <Icon color={Colors.white} size={24} strokeWidth={2} />
            </View>
            <View style={styles.featuredText}>
              <AppText variant="h3" style={styles.featuredTitle}>
                {calculator.title}
              </AppText>
              <AppText variant="bodySmall" color="secondary">
                {calculator.description}
              </AppText>
              <AppText variant="bodySmall" color="primary" style={styles.featuredCta}>
                Calculate →
              </AppText>
            </View>
          </View>
        </PressableScale>
      </Animated.View>
    );
  }

  return (
    <Animated.View
      entering={FadeInDown.delay(Math.min(index * 40, 200)).duration(420).springify()}
      style={styles.wrap}
    >
      <PressableScale
        onPress={onPress}
        style={styles.card}
        accessibilityRole="button"
        accessibilityLabel={`${calculator.title}. ${calculator.description}`}
      >
        <View style={styles.iconWrap}>
          <Icon color={Colors.primary} size={20} strokeWidth={2} />
        </View>
        <View style={styles.content}>
          <AppText variant="bodyMedium" numberOfLines={1}>
            {calculator.title}
          </AppText>
          <AppText variant="caption" color="muted" numberOfLines={2}>
            {calculator.description}
          </AppText>
          <AppText variant="caption" color="primary" style={styles.category}>
            {calculator.category}
          </AppText>
        </View>
        <View style={styles.right}>
          {onToggleFavorite ? (
            <PressableScale
              onPress={onToggleFavorite}
              style={styles.starBtn}
              accessibilityRole="button"
              accessibilityLabel={isFavorite ? 'Remove favorite' : 'Add favorite'}
            >
              <Star
                color={isFavorite ? Colors.warning : Colors.textMuted}
                size={16}
                strokeWidth={2}
                fill={isFavorite ? Colors.warning : 'transparent'}
              />
            </PressableScale>
          ) : null}
          <ChevronRight color={Colors.textMuted} size={18} strokeWidth={2} />
        </View>
      </PressableScale>
    </Animated.View>
  );
}

export const CalculatorCard = memo(CalculatorCardComponent);

const styles = StyleSheet.create({
  featuredWrap: {
    paddingHorizontal: Spacing.md,
    marginTop: Spacing.md,
  },
  featuredCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radius['2xl'],
    padding: Spacing.md + 4,
    borderWidth: 1,
    borderColor: Colors.primary + '33',
  },
  featuredLeft: {
    flexDirection: 'row',
    gap: Spacing.md,
    alignItems: 'center',
  },
  featuredIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  featuredText: {
    flex: 1,
    gap: 4,
  },
  featuredTitle: {
    color: Colors.text,
  },
  featuredCta: {
    marginTop: 4,
    fontWeight: '700',
  },
  wrap: {
    paddingHorizontal: Spacing.md,
    marginBottom: Spacing.sm,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: Radius.xl,
    padding: Spacing.md,
    gap: 12,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    minHeight: 76,
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.primarySubtle,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    gap: 2,
  },
  category: {
    marginTop: 2,
    fontWeight: '600',
  },
  right: {
    alignItems: 'center',
    gap: 6,
  },
  starBtn: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
