import React from 'react';
import { View, ViewStyle, StyleSheet } from 'react-native';
import { Colors, Radius, Shadows } from '../../theme';

type CardVariant = 'default' | 'elevated' | 'outlined' | 'primary' | 'ghost';

interface AppCardProps {
  children: React.ReactNode;
  variant?: CardVariant;
  style?: ViewStyle;
  padding?: number;
}

export function AppCard({
  children,
  variant = 'default',
  style,
  padding = 16,
}: AppCardProps) {
  return (
    <View
      style={[
        styles.base,
        styles[variant],
        { padding },
        style,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: Radius.xl,
    overflow: 'hidden',
  },
  default: {
    backgroundColor: Colors.surface,
    ...Shadows.md,
  },
  elevated: {
    backgroundColor: Colors.surface,
    ...Shadows.lg,
  },
  outlined: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  primary: {
    backgroundColor: Colors.primary,
    ...Shadows.primary,
  },
  ghost: {
    backgroundColor: Colors.transparent,
  },
});
