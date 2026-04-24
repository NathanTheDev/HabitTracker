import { useState } from 'react';
import { StyleSheet, TextInput, TextInputProps, View, Text } from 'react-native';
import { colors, radii, fontSizes, spacing } from '../../theme';

type Props = TextInputProps & {
  label?: string;
};

export default function Input({ label, style, ...rest }: Props) {
  const [focused, setFocused] = useState(false);

  return (
    <View>
      {label && <Text style={styles.label}>{label}</Text>}
      <TextInput
        placeholderTextColor={colors.textMuted}
        onFocus={(e) => { setFocused(true); rest.onFocus?.(e); }}
        onBlur={(e) => { setFocused(false); rest.onBlur?.(e); }}
        style={[styles.input, focused && styles.inputFocused, style]}
        {...rest}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    fontSize: fontSizes.xs,
    fontWeight: '600',
    color: colors.textSecondary,
    letterSpacing: 0.5,
    marginBottom: spacing.xs,
    textTransform: 'uppercase',
  },
  input: {
    height: 48,
    borderRadius: radii.lg,
    borderWidth: 1.5,
    borderColor: colors.border,
    paddingHorizontal: 14,
    fontSize: fontSizes.md,
    color: colors.textPrimary,
    backgroundColor: colors.white,
  },
  inputFocused: {
    borderColor: colors.primaryLight,
  },
});
