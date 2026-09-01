import React from 'react';
import { TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { Colors, Radius, Shadows } from '../../theme';

type IconButtonVariant = 'default' | 'primary' | 'ghost' | 'outlined';
type IconButtonSize = 'sm' | 'md' | 'lg';

interface AppIconButtonProps {
  onPress?: () => void;
  icon: React.ReactNode;
  variant?: IconButtonVariant;
  size?: IconButtonSize;
  style?: ViewStyle;
  disabled?: boolean;
  accessibilityLabel?: string;
  accessibilityHint?: string;
}

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

const sizeMap = {
  sm: 32,
  md: 42,
  lg: 52,
};

export function AppIconButton({
  onPress,
  icon,
  variant = 'default',
  size = 'md',
  style,
  disabled = false,
  accessibilityLabel,
  accessibilityHint,
}: AppIconButtonProps) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const dim = sizeMap[size];

  return (
    <AnimatedTouchable
      onPress={onPress}
      onPressIn={() => {
        scale.value = withSpring(0.97, { damping: 15, stiffness: 300 });
      }}
      onPressOut={() => {
        scale.value = withSpring(1, { damping: 15, stiffness: 300 });
      }}
      activeOpacity={0.85}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityHint={accessibilityHint}
      style={[
        animatedStyle,
        styles.base,
        styles[variant],
        { width: dim, height: dim, borderRadius: dim / 2 },
        style,
      ]}
    >
      {icon}
    </AnimatedTouchable>
  );
}

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  default: {
    backgroundColor: Colors.surface,
    ...Shadows.sm,
  },
  primary: {
    backgroundColor: Colors.primary,
    ...Shadows.primary,
  },
  ghost: {
    backgroundColor: Colors.transparent,
  },
  outlined: {
    backgroundColor: Colors.transparent,
    borderWidth: 1.5,
    borderColor: Colors.border,
  },
});
