import { Platform, ViewStyle } from 'react-native';

const createShadow = (
  elevation: number,
  color: string = 'rgba(0,0,0,0.08)',
  offsetY: number = elevation * 0.5,
  radius: number = elevation * 2,
): ViewStyle => {
  if (Platform.OS === 'android') {
    return { elevation };
  }
  return {
    shadowColor: color,
    shadowOffset: { width: 0, height: offsetY },
    shadowOpacity: 1,
    shadowRadius: radius,
  };
};

export const Shadows = {
  none: {} as ViewStyle,
  sm: createShadow(2, 'rgba(0,0,0,0.06)', 1, 4),
  md: createShadow(4, 'rgba(0,0,0,0.08)', 2, 8),
  lg: createShadow(8, 'rgba(0,0,0,0.1)', 4, 16),
  xl: createShadow(12, 'rgba(0,0,0,0.12)', 8, 24),
  primary: createShadow(6, 'rgba(135,80,247,0.3)', 4, 12),
} as const;
