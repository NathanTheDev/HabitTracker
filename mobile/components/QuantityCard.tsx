import { StyleSheet, Text, View } from 'react-native';
import Card from './ui/Card';
import { colors, fontSizes, fontWeights, radii, spacing } from '../theme';
import type { Habit } from '../lib/types';

type Props = {
  habit: Habit;
  progress: number;
  completed: boolean;
};

export default function QuantityCard({ habit, progress, completed }: Props) {
  const pct = Math.min((progress / habit.quantity) * 100, 100);

  return (
    <Card style={[styles.card, completed && styles.cardCompleted]}>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          {habit.emoji ? (
            <Text style={styles.emoji}>{habit.emoji}</Text>
          ) : (
            <View style={styles.emojiPlaceholder} />
          )}
          <Text style={styles.name} numberOfLines={1}>{habit.name}</Text>
        </View>
        <Text style={styles.counter}>
          <Text style={styles.counterValue}>{progress}</Text>
          <Text style={styles.counterSep}> / </Text>
          <Text style={styles.counterTarget}>{habit.quantity}</Text>
        </Text>
      </View>
      <View style={styles.track}>
        <View style={[styles.fill, { width: `${pct}%` }]} />
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.sm,
    padding: spacing.md,
    gap: spacing.sm,
  },
  cardCompleted: {
    opacity: 0.7,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    flex: 1,
  },
  emoji: {
    fontSize: 24,
  },
  emojiPlaceholder: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.border,
  },
  name: {
    fontSize: fontSizes.md,
    fontWeight: fontWeights.semibold,
    color: colors.textPrimary,
    flex: 1,
  },
  counter: {},
  counterValue: {
    fontSize: fontSizes.lg,
    fontWeight: fontWeights.bold,
    color: colors.primary,
  },
  counterSep: {
    fontSize: fontSizes.sm,
    color: colors.textMuted,
  },
  counterTarget: {
    fontSize: fontSizes.sm,
    color: colors.textSecondary,
  },
  track: {
    height: 6,
    borderRadius: radii.full,
    backgroundColor: colors.border,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: radii.full,
    backgroundColor: colors.primary,
  },
});
