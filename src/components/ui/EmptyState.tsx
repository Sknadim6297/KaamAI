import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Colors, Radius, Spacing } from '../../theme';
import { AppText } from './AppText';
import { AppButton } from './AppButton';

interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  onActionPress?: () => void;
  icon?: React.ReactNode;
}

export function EmptyState({
  title,
  description,
  actionLabel,
  onActionPress,
  icon,
}: EmptyStateProps) {
  return (
    <View style={styles.container} accessibilityRole="text">
      {icon ? <View style={styles.iconWrap}>{icon}</View> : null}
      <AppText variant="h3" style={styles.title}>
        {title}
      </AppText>
      <AppText variant="bodySmall" color="secondary" style={styles.description}>
        {description}
      </AppText>
      {actionLabel ? (
        <AppButton
          label={actionLabel}
          onPress={onActionPress}
          size="sm"
          style={styles.button}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.md,
  },
  iconWrap: {
    width: 52,
    height: 52,
    borderRadius: Radius.xl,
    backgroundColor: Colors.primarySubtle,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
  },
  title: {
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
  description: {
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: Spacing.md,
  },
  button: {
    marginTop: Spacing.xs,
  },
});
