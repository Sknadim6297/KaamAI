import React from 'react';
import { Text, TextStyle, StyleSheet } from 'react-native';
import { Colors, Typography } from '../../theme';

type TypographyVariant =
  | 'display'
  | 'h1'
  | 'h2'
  | 'h3'
  | 'body'
  | 'bodyMedium'
  | 'bodySemiBold'
  | 'bodySmall'
  | 'caption'
  | 'button'
  | 'buttonSmall'
  | 'label';

type ColorVariant =
  | 'default'
  | 'secondary'
  | 'muted'
  | 'primary'
  | 'white'
  | 'danger'
  | 'success'
  | 'warning';

interface AppTextProps {
  children: React.ReactNode;
  variant?: TypographyVariant;
  color?: ColorVariant;
  style?: TextStyle;
  numberOfLines?: number;
  onPress?: () => void;
}

const colorMap: Record<ColorVariant, string> = {
  default: Colors.text,
  secondary: Colors.textSecondary,
  muted: Colors.textMuted,
  primary: Colors.primary,
  white: Colors.white,
  danger: Colors.danger,
  success: Colors.success,
  warning: Colors.warning,
};

export function AppText({
  children,
  variant = 'body',
  color = 'default',
  style,
  numberOfLines,
  onPress,
}: AppTextProps) {
  return (
    <Text
      style={[
        styles.base,
        Typography[variant],
        { color: colorMap[color] },
        style,
      ]}
      numberOfLines={numberOfLines}
      onPress={onPress}
    >
      {children}
    </Text>
  );
}

const styles = StyleSheet.create({
  base: {
    includeFontPadding: false,
  },
});
