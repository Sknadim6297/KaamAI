import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Lightbulb } from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Colors, Radius, Spacing } from '../../../theme';
import { AppText } from '../../../components/ui';

interface DailyInsightProps {
  title?: string;
  message?: string;
}

export function DailyInsight({
  title = 'Smart insight',
  message = 'You spent 18% less on food this month compared with last month.',
}: DailyInsightProps) {
  return (
    <Animated.View
      entering={FadeInDown.delay(520).duration(500).springify()}
      style={styles.wrapper}
      accessibilityRole="text"
      accessibilityLabel={`${title}. ${message}`}
    >
      <View style={styles.card}>
        <View style={styles.iconWrap}>
          <Lightbulb color={Colors.insightAccent} size={18} strokeWidth={2} />
        </View>
        <View style={styles.content}>
          <AppText variant="bodySmall" style={styles.title}>
            💡 {title}
          </AppText>
          <AppText variant="bodySmall" color="secondary" style={styles.message}>
            {message}
          </AppText>
        </View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: Spacing.md,
    marginTop: Spacing.lg,
    marginBottom: Spacing.xl,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    backgroundColor: Colors.insightBg,
    borderRadius: Radius.xl,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.insightBorder,
  },
  iconWrap: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: Colors.warningLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
  },
  content: {
    flex: 1,
    gap: 4,
  },
  title: {
    fontWeight: '600',
    color: Colors.insightAccent,
  },
  message: {
    lineHeight: 20,
  },
});
