import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { Sparkles, ArrowUpRight } from 'lucide-react-native';
import Animated, {
  FadeInDown,
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import { Colors, Radius, Shadows, Spacing } from '../../../theme';
import { AppText, PressableScale } from '../../../components/ui';

const SUGGESTIONS = ['Create budget', 'Set reminder', 'Calculate EMI'];

interface AISearchCardProps {
  onPromptPress?: (prompt: string) => void;
  onPress?: () => void;
}

export function AISearchCard({ onPromptPress, onPress }: AISearchCardProps) {
  const router = useRouter();
  const glowOpacity = useSharedValue(0.35);

  useEffect(() => {
    glowOpacity.value = withRepeat(
      withSequence(
        withTiming(0.55, { duration: 2400, easing: Easing.inOut(Easing.ease) }),
        withTiming(0.25, { duration: 2400, easing: Easing.inOut(Easing.ease) }),
      ),
      -1,
      false,
    );
  }, [glowOpacity]);

  const glowStyle = useAnimatedStyle(() => ({
    opacity: glowOpacity.value,
  }));

  const handleCardPress = () => {
    if (onPress) {
      onPress();
    } else {
      router.push('/(tabs)/ai');
    }
  };

  const handlePromptPress = (prompt: string) => {
    if (onPromptPress) {
      onPromptPress(prompt);
    } else {
      router.push('/(tabs)/ai');
    }
  };

  return (
    <Animated.View
      entering={FadeInDown.delay(80).duration(550).springify()}
      style={styles.wrapper}
    >
      <PressableScale
        onPress={handleCardPress}
        style={styles.card}
        accessibilityRole="button"
        accessibilityLabel="AI assistant"
        accessibilityHint="Open AI assistant to ask anything"
      >
        <Animated.View style={[styles.glowOrb, glowStyle]} pointerEvents="none" />

        <View style={styles.header}>
          <View style={styles.aiIcon}>
            <Sparkles color={Colors.white} size={18} strokeWidth={2} />
          </View>
          <View style={styles.headerText}>
            <AppText variant="h3">How can I help you today?</AppText>
            <AppText variant="bodySmall" color="secondary">
              Ask me to manage your everyday tasks.
            </AppText>
          </View>
        </View>

        <View style={styles.inputArea}>
          <AppText variant="body" color="muted" style={styles.placeholder}>
            Ask anything...
          </AppText>
          <View style={styles.sendButton}>
            <ArrowUpRight color={Colors.white} size={18} strokeWidth={2.5} />
          </View>
        </View>

        <View style={styles.chipsRow}>
          {SUGGESTIONS.map((suggestion) => (
            <PressableScale
              key={suggestion}
              onPress={() => handlePromptPress(suggestion)}
              style={styles.chip}
              scaleTo={0.96}
              accessibilityRole="button"
              accessibilityLabel={suggestion}
            >
              <AppText variant="bodySmall" color="primary" style={styles.chipText}>
                {suggestion}
              </AppText>
            </PressableScale>
          ))}
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
    position: 'relative',
  },
  glowOrb: {
    position: 'absolute',
    top: -40,
    right: -30,
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: Colors.primarySubtle,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: Spacing.md,
  },
  aiIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.primary,
  },
  headerText: {
    flex: 1,
    gap: 4,
    paddingTop: 2,
  },
  inputArea: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background,
    borderRadius: Radius.lg,
    paddingHorizontal: Spacing.md,
    paddingVertical: 13,
    borderWidth: 1.5,
    borderColor: Colors.border,
    marginBottom: Spacing.md,
  },
  placeholder: {
    flex: 1,
  },
  sendButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  chip: {
    backgroundColor: Colors.primarySubtle,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: Radius.full,
    borderWidth: 1,
    borderColor: Colors.primary + '22',
  },
  chipText: {
    fontWeight: '600',
  },
});
