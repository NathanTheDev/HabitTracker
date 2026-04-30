import { ActivityIndicator, Pressable, PressableProps, StyleSheet, Text } from 'react-native';
import { colors, radii, fontSizes, fontWeights } from '../../theme';

type Variant = 'primary' | 'outline' | 'ghost' | 'secondary';

type Props = PressableProps & {
  label: string;
  variant?: Variant;
  loading?: boolean;
};

export default function Button({ label, variant = 'primary', loading, disabled, style, ...rest }: Props) {
  const isDisabled = disabled || loading;

  return (
    <Pressable
      disabled={isDisabled}
      style={({ pressed }) => [
        styles.base,
        styles[variant],
        isDisabled && styles[`${variant}Disabled` as keyof typeof styles],
        pressed && !isDisabled && { opacity: 0.85 },
        style as object,
      ]}
      {...rest}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'primary' ? colors.white : colors.primary} />
      ) : (
        <Text style={[styles.label, styles[`${variant}Label` as keyof typeof styles]]}>
          {label}
        </Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    height: 44,
    borderRadius: radii.lg,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  label: {
    fontSize: fontSizes.md,
    fontWeight: fontWeights.semibold,
  },

  primary: {
    backgroundColor: colors.primary,
  },
  primaryDisabled: {
    backgroundColor: '#DCCFCD',
  },
  primaryLabel: {
    color: colors.white,
  },

  outline: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
  },
  outlineDisabled: {
    opacity: 0.5,
  },
  outlineLabel: {
    color: colors.textPrimary,
  },

  ghost: {
    backgroundColor: 'transparent',
  },
  ghostDisabled: {},
  ghostLabel: {
    color: colors.textPrimary,
  },

  secondary: {
    backgroundColor: colors.muted,
  },
  secondaryDisabled: {
    opacity: 0.5,
  },
  secondaryLabel: {
    color: colors.textSecondary,
  },
});
