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
  const [emoji, setEmoji] = useState('🏃');
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
        <Pressable
          onPress={() => router.back()}
          style={({ pressed }) => [styles.backBtn, pressed && { opacity: 0.7 }]}
          hitSlop={12}
        >
          <Feather name="arrow-left" size={18} color={colors.textSecondary} />
        </Pressable>
        <View>
          <Text style={styles.title}>New habit</Text>
          <Text style={styles.subtitle}>Build something consistent</Text>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.body}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.formCard}>
          {/* Name + emoji row */}
          <View style={styles.fieldBlock}>
            <Text style={styles.fieldLabel}>
              Habit name <Text style={styles.required}>*</Text>
            </Text>
            <View style={styles.nameRow}>
              <Pressable
                onPress={() => setShowEmoji(true)}
                style={({ pressed }) => [styles.emojiBtn, pressed && { opacity: 0.7 }]}
              >
                <Text style={styles.emojiText}>{emoji || '😊'}</Text>
              </Pressable>
              <View style={styles.nameInputWrapper}>
                <Input
                  placeholder="e.g. Morning run"
                  value={name}
                  onChangeText={(t) => { setName(t); setError(''); }}
                  autoFocus
                  returnKeyType="next"
                />
              </View>
            </View>
          </View>

          {/* Quantity */}
          <View style={styles.fieldBlock}>
            <Text style={styles.fieldLabel}>
              Quantity{' '}
              <Text style={styles.optional}>optional</Text>
            </Text>
            <Input
              placeholder="e.g. 5"
              value={quantity}
              onChangeText={(t) => { setQuantity(t); setError(''); }}
              keyboardType="number-pad"
              returnKeyType="done"
            />
            <Text style={styles.hint}>How many times per day? (e.g. Read — 5 pages)</Text>
          </View>

          <View style={styles.divider} />

          {error ? <Text style={styles.error}>{error}</Text> : null}

          <View style={styles.actions}>
            <Button
              label="Cancel"
              variant="outline"
              onPress={() => router.back()}
              style={styles.actionBtn}
            />
            <Button
              label={loading ? 'Creating…' : 'Create habit'}
              variant="primary"
              onPress={handleCreate}
              loading={loading}
              disabled={!name.trim()}
              style={styles.actionBtn}
            />
          </View>
        </View>
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
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
    paddingBottom: spacing.md,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: radii.md,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: fontSizes.lg,
    fontWeight: fontWeights.semibold,
    color: colors.textPrimary,
  },
  subtitle: {
    fontSize: fontSizes.xs,
    color: colors.textMuted,
    marginTop: 1,
  },
  body: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  formCard: {
    backgroundColor: colors.white,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: colors.textPrimary,
    shadowOpacity: 0.04,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
    padding: spacing.lg,
    gap: spacing.lg,
  },
  fieldBlock: {
    gap: spacing.xs,
  },
  fieldLabel: {
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.medium,
    color: colors.textPrimary,
  },
  required: {
    color: colors.primary,
  },
  optional: {
    fontSize: fontSizes.xs,
    fontWeight: fontWeights.regular,
    color: colors.textMuted,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  emojiBtn: {
    width: 44,
    height: 44,
    borderRadius: radii.md,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  emojiText: {
    fontSize: 22,
  },
  nameInputWrapper: {
    flex: 1,
  },
  hint: {
    fontSize: fontSizes.xs,
    color: colors.textMuted,
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.xs,
  },
  error: {
    fontSize: fontSizes.sm,
    color: '#B04848',
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  actionBtn: {
    flex: 1,
  },
});
