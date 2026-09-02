import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Colors, Radius, Spacing } from '../../../theme';
import { AppText, AppButton } from '../../../components/ui';
import { Bell } from 'lucide-react-native';
import Animated, { FadeIn } from 'react-native-reanimated';

interface ReminderEmptyStateProps {
  onAddPress: () => void;
  compact?: boolean;
}

export function ReminderEmptyState({ onAddPress, compact }: ReminderEmptyStateProps) {
  return (
    <Animated.View entering={FadeIn.duration(320)} style={[styles.wrap, compact && styles.compact]}>
      <View style={styles.iconWrap}>
        <Bell color={Colors.primary} size={22} strokeWidth={2} />
      </View>
      <AppText variant="bodySemiBold" style={styles.title}>
        No reminders yet
      </AppText>
      <AppText variant="bodySmall" color="muted" style={styles.subtitle}>
        Add a reminder so KaamAI can help you stay on track.
      </AppText>
      <AppButton label="Add Reminder" onPress={onAddPress} size="sm" style={styles.btn} />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    paddingVertical: Spacing.xl,
    paddingHorizontal: Spacing.lg,
    gap: Spacing.sm,
  },
  compact: {
    paddingVertical: Spacing.lg,
  },
  iconWrap: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.primarySubtle,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  title: {
    textAlign: 'center',
  },
  subtitle: {
    textAlign: 'center',
    maxWidth: 280,
  },
  btn: {
    marginTop: Spacing.sm,
    minWidth: 160,
  },
});
