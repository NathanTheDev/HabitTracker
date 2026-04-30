import { StyleSheet, Text, View } from 'react-native';
import Avatar from './ui/Avatar';
import { colors, fontSizes, fontWeights, spacing } from '../theme';

function greeting(): string {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

function todayLabel(): string {
  return new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });
}

type Props = {
  email?: string;
};

export default function DashboardHeader({ email }: Props) {
  const localPart = email?.split('@')[0] ?? '';
  const displayName = localPart.charAt(0).toUpperCase() + localPart.slice(1);

  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.greeting}>{greeting()}</Text>
        <Text style={styles.date}>{todayLabel()}</Text>
      </View>
      {email ? <Avatar name={displayName || email} size={40} /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
    paddingBottom: spacing.lg,
  },
  greeting: {
    fontSize: fontSizes.xl,
    fontWeight: fontWeights.semibold,
    color: colors.textPrimary,
  },
  date: {
    fontSize: fontSizes.sm,
    color: colors.textMuted,
    marginTop: 2,
  },
});
