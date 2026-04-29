import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import EmojiPicker, { type EmojiType } from 'rn-emoji-keyboard';
import { api } from '../../lib/api';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { colors, fontSizes, fontWeights, radii, spacing } from '../../theme';

export default function NewHabit() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [emoji, setEmoji] = useState('');
  const [quantity, setQuantity] = useState('');
  const [showEmoji, setShowEmoji] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCreate = async () => {
    const trimmed = name.trim();
    if (!trimmed) {
      setError('Name is required');
      return;
    }
    const qty = quantity ? parseInt(quantity, 10) : undefined;
    if (qty !== undefined && (isNaN(qty) || qty < 1)) {
      setError('Quantity must be a positive number');
      return;
    }
    setLoading(true);
    try {
      await api.habits.create({
        name: trimmed,
        emoji: emoji || undefined,
        quantity: qty,
      });
      router.back();
    } catch {
      setError('Failed to create habit. Please try again.');
      setLoading(false);
    }
  };

  const handleEmojiSelect = (e: EmojiType) => {
    setEmoji(e.emoji);
    setShowEmoji(false);
  };

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.headerBtn} hitSlop={12}>
          <Feather name="x" size={22} color={colors.textSecondary} />
        </Pressable>
        <Text style={styles.title}>New Habit</Text>
        <View style={styles.headerBtn} />
      </View>

      <ScrollView
        contentContainerStyle={styles.body}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Pressable
          onPress={() => setShowEmoji(true)}
          style={({ pressed }) => [styles.emojiBtn, pressed && { opacity: 0.7 }]}
        >
          {emoji ? (
            <Text style={styles.emojiSelected}>{emoji}</Text>
          ) : (
            <Feather name="smile" size={30} color={colors.textMuted} />
          )}
          <Text style={styles.emojiHint}>{emoji ? 'Tap to change' : 'Add emoji'}</Text>
        </Pressable>

        <View style={styles.fields}>
          <Input
            label="Name"
            placeholder="e.g. Morning run"
            value={name}
            onChangeText={(t) => { setName(t); setError(''); }}
            autoFocus
            returnKeyType="next"
          />

          <View style={styles.fieldGap} />

          <Input
            label="Quantity target (optional)"
            placeholder="e.g. 8  —  leave blank for a simple habit"
            value={quantity}
            onChangeText={(t) => { setQuantity(t); setError(''); }}
            keyboardType="number-pad"
            returnKeyType="done"
          />

          {error ? <Text style={styles.error}>{error}</Text> : null}
        </View>

        <Button
          label="Create Habit"
          onPress={handleCreate}
          loading={loading}
          disabled={!name.trim()}
          style={styles.submitBtn}
        />
      </ScrollView>

      <EmojiPicker
        onEmojiSelected={handleEmojiSelect}
        open={showEmoji}
        onClose={() => setShowEmoji(false)}
        theme={{
          container: colors.surface,
          knob: colors.primary,
          category: {
            icon: colors.textMuted,
            iconActive: colors.primary,
            container: colors.surface,
            containerActive: colors.border,
          },
          search: {
            background: colors.white,
            placeholder: colors.textMuted,
            text: colors.textPrimary,
          },
        }}
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
    paddingBottom: spacing.md,
  },
  headerBtn: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: fontSizes.lg,
    fontWeight: fontWeights.semibold,
    color: colors.textPrimary,
  },
  body: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xxl,
    gap: spacing.lg,
  },
  emojiBtn: {
    alignSelf: 'center',
    alignItems: 'center',
    gap: spacing.xs,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    backgroundColor: colors.white,
    borderRadius: radii.xl,
    borderWidth: 1.5,
    borderColor: colors.border,
    minWidth: 110,
  },
  emojiSelected: {
    fontSize: 40,
    lineHeight: 48,
  },
  emojiHint: {
    fontSize: fontSizes.xs,
    color: colors.textMuted,
    fontWeight: fontWeights.medium,
  },
  fields: {
    gap: 0,
  },
  fieldGap: {
    height: spacing.md,
  },
  error: {
    marginTop: spacing.sm,
    fontSize: fontSizes.sm,
    color: '#B04848',
  },
  submitBtn: {
    marginTop: spacing.sm,
  },
});
