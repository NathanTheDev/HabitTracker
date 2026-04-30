import { useEffect, useRef, useState } from 'react';
import {
  Animated,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { PanGestureHandler, State } from 'react-native-gesture-handler';
import { colors, fontSizes, fontWeights, radii, spacing } from '../theme';
import { api } from '../lib/api';
import type { Habit } from '../lib/types';

type Props = {
  habit: Habit;
  progress: number;
  completed: boolean;
  onUpdate?: () => void;
};

export default function QuantityCard({ habit, progress, completed, onUpdate }: Props) {
  const [localProgress, setLocalProgress] = useState(progress);
  const [editing, setEditing] = useState(false);
  const [editText, setEditText] = useState(String(progress));

  const progressAnim = useRef(new Animated.Value(progress)).current;
  const startProgressRef = useRef(progress);
  const trackWidthRef = useRef(0);

  useEffect(() => {
    setLocalProgress(progress);
    progressAnim.setValue(progress);
  }, [progress]);

  const widthAnim = progressAnim.interpolate({
    inputRange: [0, habit.quantity],
    outputRange: ['0%', '100%'],
    extrapolate: 'clamp',
  });

  const onGestureEvent = ({ nativeEvent: { translationX } }: any) => {
    if (!trackWidthRef.current) return;
    const delta = (translationX / trackWidthRef.current) * habit.quantity;
    const next = Math.max(0, Math.min(habit.quantity, startProgressRef.current + delta));
    progressAnim.setValue(next);
    setLocalProgress(Math.round(next));
  };

  const onHandlerStateChange = async ({ nativeEvent }: any) => {
    if (nativeEvent.state === State.BEGAN) {
      startProgressRef.current = localProgress;
    }
    if (nativeEvent.state === State.END || nativeEvent.state === State.FAILED) {
      const final = Math.round(localProgress);
      progressAnim.setValue(final);
      try {
        await api.habits.complete(habit.id, { quantityProgress: final });
        onUpdate?.();
      } catch {
        setLocalProgress(progress);
        progressAnim.setValue(progress);
      }
    }
  };

  const commitEdit = async () => {
    setEditing(false);
    const parsed = parseInt(editText, 10);
    if (isNaN(parsed)) {
      setEditText(String(localProgress));
      return;
    }
    const final = Math.max(0, Math.min(habit.quantity, parsed));
    setLocalProgress(final);
    progressAnim.setValue(final);
    try {
      await api.habits.complete(habit.id, { quantityProgress: final });
      onUpdate?.();
    } catch {
      setLocalProgress(progress);
      progressAnim.setValue(progress);
      setEditText(String(progress));
    }
  };

  const localCompleted = localProgress >= habit.quantity;

  return (
    <View style={[styles.card, localCompleted && styles.cardDone]}>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          {habit.emoji ? (
            <Text style={styles.emoji}>{habit.emoji}</Text>
          ) : null}
          <Text style={[styles.name, localCompleted && styles.nameDone]} numberOfLines={1}>
            {habit.name}
          </Text>
        </View>

        {editing ? (
          <TextInput
            style={styles.editInput}
            value={editText}
            onChangeText={setEditText}
            keyboardType="number-pad"
            autoFocus
            onBlur={commitEdit}
            onSubmitEditing={commitEdit}
            selectTextOnFocus
          />
        ) : (
          <Text
            style={styles.counter}
            onPress={() => {
              setEditText(String(localProgress));
              setEditing(true);
            }}
          >
            {localProgress}/{habit.quantity}
          </Text>
        )}
      </View>

      <View
        style={styles.trackWrapper}
        onLayout={(e) => { trackWidthRef.current = e.nativeEvent.layout.width; }}
      >
        <PanGestureHandler
          onGestureEvent={onGestureEvent}
          onHandlerStateChange={onHandlerStateChange}
        >
          <View style={styles.track}>
            <Animated.View style={[styles.fill, { width: widthAnim }]} />
          </View>
        </PanGestureHandler>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: spacing.sm,
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    flex: 1,
  },
  emoji: {
    fontSize: fontSizes.md,
  },
  name: {
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.medium,
    color: colors.textPrimary,
    flex: 1,
  },
  nameDone: {
    color: colors.primary,
    textDecorationLine: 'line-through',
  },
  counter: {
    fontSize: fontSizes.xs,
    fontWeight: fontWeights.medium,
    color: colors.textPrimary,
    backgroundColor: colors.muted,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.sm,
    paddingHorizontal: 8,
    paddingVertical: 3,
    overflow: 'hidden',
  },
  editInput: {
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.medium,
    color: colors.primary,
    minWidth: 48,
    textAlign: 'right',
    borderBottomWidth: 1,
    borderBottomColor: colors.primary,
    paddingVertical: 0,
  },
  trackWrapper: {
    borderRadius: radii.full,
    overflow: 'hidden',
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
