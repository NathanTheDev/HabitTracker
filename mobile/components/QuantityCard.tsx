import { useEffect, useRef, useState } from 'react';
import {
  Animated,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { PanGestureHandler, State } from 'react-native-gesture-handler';
import { LinearGradient } from 'expo-linear-gradient';
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

  const hasProgress = localProgress > 0;
  const localCompleted = localProgress >= habit.quantity;

  const inner = (
    <View style={[styles.card, localCompleted && styles.cardCompleted]}>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          {habit.emoji ? (
            <Text style={styles.emoji}>{habit.emoji}</Text>
          ) : (
            <View style={styles.emojiPlaceholder} />
          )}
          <Text style={styles.name} numberOfLines={1}>{habit.name}</Text>
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
          <Text style={styles.counter} onPress={() => {
            setEditText(String(localProgress));
            setEditing(true);
          }}>
            <Text style={styles.counterValue}>{localProgress}</Text>
            <Text style={styles.counterSep}> / </Text>
            <Text style={styles.counterTarget}>{habit.quantity}</Text>
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

  if (hasProgress) {
    return (
      <LinearGradient
        colors={[colors.primary, colors.primaryLight]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.gradientBorder, styles.cardOuter]}
      >
        {inner}
      </LinearGradient>
    );
  }

  return <View style={styles.cardOuter}>{inner}</View>;
}

const styles = StyleSheet.create({
  cardOuter: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.sm,
    borderRadius: radii.lg + 2,
  },
  gradientBorder: {
    padding: 2,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: radii.lg,
    padding: spacing.md,
    gap: spacing.sm,
    shadowColor: colors.textPrimary,
    shadowOpacity: 0.06,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
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
  editInput: {
    fontSize: fontSizes.lg,
    fontWeight: fontWeights.bold,
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
    height: 8,
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
