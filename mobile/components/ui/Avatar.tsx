import { StyleSheet, Text, View, ViewProps } from 'react-native';
import { colors, radii } from '../../theme';

type Props = ViewProps & {
  name: string;
  size?: number;
};

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export default function Avatar({ name, size = 40, style, ...rest }: Props) {
  return (
    <View
      style={[
        styles.circle,
        { width: size, height: size, borderRadius: radii.full },
        style,
      ]}
      {...rest}
    >
      <Text style={[styles.initials, { fontSize: size * 0.36 }]}>
        {getInitials(name)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  circle: {
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  initials: {
    color: colors.white,
    fontWeight: '600',
  },
});
