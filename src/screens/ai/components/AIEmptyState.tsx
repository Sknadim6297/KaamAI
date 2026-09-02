import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import Animated, {
  FadeIn,
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { Sparkles } from 'lucide-react-native';
import { Colors, Spacing } from '../../../theme';
import { AppText } from '../../../components/ui';

export function AIEmptyState() {
  const pulse = useSharedValue(0.35);

  useEffect(() => {
    pulse.value = withRepeat(
      withSequence(
        withTiming(0.7, { duration: 1800, easing: Easing.inOut(Easing.ease) }),
        withTiming(0.3, { duration: 1800, easing: Easing.inOut(Easing.ease) }),
      ),
      -1,
      false,
    );
  }, [pulse]);

  const glowStyle = useAnimatedStyle(() => ({
    opacity: pulse.value,
    transform: [{ scale: 0.95 + pulse.value * 0.12 }],
  }));

  return (
    <Animated.View entering={FadeIn.duration(400)} style={styles.container}>
      <View style={styles.visual}>
        <Animated.View style={[styles.glow, glowStyle]} pointerEvents="none">
          <Svg width={120} height={120}>
            <Circle cx={60} cy={60} r={54} fill={Colors.primarySubtle} />
          </Svg>
        </Animated.View>
        <View style={styles.iconWrap}>
          <Sparkles color={Colors.white} size={28} strokeWidth={2} />
        </View>
      </View>

      <AppText variant="h2" style={styles.title}>
        What can I help you with?
      </AppText>
      <AppText variant="body" color="secondary" style={styles.subtitle}>
        Ask me to manage money, set reminders, calculate things, or help with everyday tasks.
      </AppText>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.md,
  },
  visual: {
    width: 120,
    height: 120,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.lg,
  },
  glow: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrap: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
  subtitle: {
    textAlign: 'center',
    lineHeight: 22,
    maxWidth: 300,
  },
});
