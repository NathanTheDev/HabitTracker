import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, fontSizes, fontWeights, radii, spacing } from '../theme';
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
      <View style={[styles.card, localCompleted && styles.cardDone]}>
        <View style={[styles.check, localCompleted && styles.checkDone]}>
          {localCompleted && <Text style={styles.checkmark}>✓</Text>}
        </View>
        <Text style={[styles.name, localCompleted && styles.nameDone]} numberOfLines={1}>
          {habit.emoji ? <Text>{habit.emoji} </Text> : null}
          {habit.name}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.white,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 20,
    paddingVertical: 16,
    shadowColor: colors.textPrimary,
    shadowOpacity: 0.04,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  cardDone: {
    backgroundColor: colors.primarySubtle,
    borderColor: colors.primaryBorder,
  },
  check: {
    width: 20,
    height: 20,
    borderRadius: radii.full,
    borderWidth: 1.5,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  checkDone: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  checkmark: {
    color: colors.white,
    fontSize: 11,
    fontWeight: fontWeights.bold,
    lineHeight: 14,
  },
  name: {
    flex: 1,
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.medium,
    color: colors.textPrimary,
  },
  nameDone: {
    color: colors.primary,
    textDecorationLine: 'line-through',
  },
});
