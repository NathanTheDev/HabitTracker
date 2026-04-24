import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Card from './ui/Card';
import { colors, fontSizes, fontWeights, spacing } from '../theme';
import { api } from '../lib/api';
import type { Habit } from '../lib/types';

type Props = {
  habit: Habit;
  completed: boolean;
  onUpdate?: () => void;
};

export default function SimpleHabitCard({ habit, completed, onUpdate }: Props) {
  const [localCompleted, setLocalCompleted] = useState(completed);

  const handlePress = async () => {
    const next = !localCompleted;
    setLocalCompleted(next);
    try {
      if (next) {
        await api.habits.complete(habit.id);
      } else {
        await api.habits.uncomplete(habit.id);
      }
      onUpdate?.();
    } catch {
      setLocalCompleted(!next);
    }
  };

  return (
    <Pressable onPress={handlePress} style={({ pressed }) => pressed && { opacity: 0.85 }}>
      <Card style={[styles.card, localCompleted && styles.cardCompleted]}>
        <View style={styles.row}>
          {habit.emoji ? (
            <Text style={styles.emoji}>{habit.emoji}</Text>
          ) : (
            <View style={styles.emojiPlaceholder} />
          )}
          <View style={styles.info}>
            <Text style={[styles.name, localCompleted && styles.nameCompleted]} numberOfLines={1}>
              {habit.name}
            </Text>
            {habit.description ? (
              <Text style={styles.description} numberOfLines={1}>{habit.description}</Text>
            ) : null}
          </View>
          <View style={[styles.check, localCompleted && styles.checkCompleted]}>
            {localCompleted ? <Text style={styles.checkmark}>✓</Text> : null}
          </View>
        </View>
      </Card>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.sm,
    padding: spacing.md,
  },
  cardCompleted: {
    opacity: 0.7,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  emoji: {
    fontSize: 28,
    width: 40,
    textAlign: 'center',
  },
  emojiPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.border,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: fontSizes.md,
    fontWeight: fontWeights.semibold,
    color: colors.textPrimary,
  },
  nameCompleted: {
    textDecorationLine: 'line-through',
    color: colors.textMuted,
  },
  description: {
    fontSize: fontSizes.sm,
    color: colors.textSecondary,
    marginTop: 2,
  },
  check: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkCompleted: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  checkmark: {
    color: colors.white,
    fontSize: 14,
    fontWeight: fontWeights.bold,
  },
});
