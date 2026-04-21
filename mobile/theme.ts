export const colors = {
  primary: '#C58D85',
  primaryLight: '#D9AFA9',
  primaryDark: '#A6726A',
  background: '#FFFFFF',
  surface: '#FAF8F7',
  border: '#EDE8E7',
  textPrimary: '#2D2420',
  textSecondary: '#7A6C6A',
  textMuted: '#B5A8A6',
  white: '#FFFFFF',
} as const;

export const radii = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

export const fontSizes = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 22,
  xxl: 28,
} as const;

export const fontWeights = {
  regular: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
};
