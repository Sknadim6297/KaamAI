export const Radius = {
  sm: 6,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 28,
  full: 9999,
} as const;

export type RadiusKey = keyof typeof Radius;
