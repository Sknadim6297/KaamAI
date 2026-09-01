export const Colors = {
  primary: '#8750F7',
  primaryLight: '#A97BFF',
  primaryDark: '#6A3DC5',
  primarySubtle: '#F3EEFF',

  background: '#F7F8FA',
  surface: '#FFFFFF',
  surfaceSecondary: '#F5F3FF',
  surfaceElevated: '#FFFFFF',

  text: '#0F0F1A',
  textSecondary: '#4B5563',
  textMuted: '#9CA3AF',

  border: '#E5E7EB',
  borderLight: '#F3F4F6',

  success: '#22C55E',
  successLight: '#DCFCE7',
  warning: '#F59E0B',
  warningLight: '#FEF3C7',
  danger: '#EF4444',
  dangerLight: '#FEE2E2',
  info: '#3B82F6',
  infoLight: '#DBEAFE',

  white: '#FFFFFF',
  black: '#000000',
  transparent: 'transparent',

  overlay: 'rgba(0,0,0,0.5)',
  cardShadow: 'rgba(0,0,0,0.06)',

  insightBg: '#FFFBEB',
  insightBorder: '#FDE68A',
  insightAccent: '#D97706',
} as const;

export type ColorKey = keyof typeof Colors;
