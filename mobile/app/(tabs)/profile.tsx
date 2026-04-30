import { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { api } from '../../lib/api';
import { logout } from '../../lib/auth';
import type { User } from '../../lib/types';
import Avatar from '../../components/ui/Avatar';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import { colors, fontSizes, fontWeights, radii, spacing } from '../../theme';

export default function Profile() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [displayName, setDisplayName] = useState('');
  const [saving, setSaving] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    api.user.me().then((u) => {
      setUser(u);
      setDisplayName(u.displayName ?? '');
      setLoading(false);
    });
  }, []);

  async function handleSave() {
    if (!user) return;
    setSaving(true);
    try {
      const trimmed = displayName.trim();
      const { displayName: saved } = await api.user.updateMe(trimmed || null);
      setUser({ ...user, displayName: saved });
      setDisplayName(saved ?? '');
      setEditing(false);
    } catch {
      Alert.alert('Error', 'Failed to save display name.');
    } finally {
      setSaving(false);
    }
  }

  function handleEditPress() {
    setEditing(true);
    setTimeout(() => inputRef.current?.focus(), 50);
  }

  function handleCancel() {
    setDisplayName(user?.displayName ?? '');
    setEditing(false);
  }

  async function handleLogout() {
    setLoggingOut(true);
    await logout();
    router.replace('/auth');
  }

  const avatarName = user?.displayName || user?.email || '?';

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.avatarRow}>
        <Avatar name={avatarName} size={72} />
        <Text style={styles.emailText}>{user?.email}</Text>
      </View>

      <Card style={styles.card}>
        <Text style={styles.sectionLabel}>Display name</Text>

        {editing ? (
          <View>
            <TextInput
              ref={inputRef}
              style={styles.nameInput}
              value={displayName}
              onChangeText={setDisplayName}
              placeholder="Enter a display name"
              placeholderTextColor={colors.textMuted}
              returnKeyType="done"
              onSubmitEditing={handleSave}
            />
            <View style={styles.editActions}>
              <Pressable onPress={handleCancel} style={styles.cancelBtn}>
                <Text style={styles.cancelText}>Cancel</Text>
              </Pressable>
              <Button
                label="Save"
                variant="primary"
                loading={saving}
                onPress={handleSave}
                style={styles.saveBtn}
              />
            </View>
          </View>
        ) : (
          <Pressable style={styles.nameRow} onPress={handleEditPress}>
            <Text style={[styles.nameText, !user?.displayName && styles.namePlaceholder]}>
              {user?.displayName || 'Tap to add a display name'}
            </Text>
            <Text style={styles.editHint}>Edit</Text>
          </Pressable>
        )}
      </Card>

      <Button
        label="Log out"
        variant="outline"
        loading={loggingOut}
        onPress={handleLogout}
        style={styles.logoutBtn}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: spacing.lg,
    paddingTop: spacing.xl,
    gap: spacing.lg,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
  },
  avatarRow: {
    alignItems: 'center',
    gap: spacing.md,
    paddingBottom: spacing.sm,
  },
  emailText: {
    fontSize: fontSizes.md,
    color: colors.textSecondary,
    fontWeight: fontWeights.medium,
  },
  card: {
    gap: spacing.sm,
  },
  sectionLabel: {
    fontSize: fontSizes.xs,
    fontWeight: '600',
    color: colors.textSecondary,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    marginBottom: spacing.xs,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  nameText: {
    fontSize: fontSizes.md,
    color: colors.textPrimary,
    fontWeight: fontWeights.medium,
    flex: 1,
  },
  namePlaceholder: {
    color: colors.textMuted,
    fontStyle: 'italic',
  },
  editHint: {
    fontSize: fontSizes.sm,
    color: colors.primary,
    fontWeight: fontWeights.semibold,
  },
  nameInput: {
    height: 48,
    borderRadius: radii.lg,
    borderWidth: 1.5,
    borderColor: colors.primaryLight,
    paddingHorizontal: 14,
    fontSize: fontSizes.md,
    color: colors.textPrimary,
    backgroundColor: colors.white,
    marginBottom: spacing.sm,
  },
  editActions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: spacing.sm,
  },
  cancelBtn: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  cancelText: {
    fontSize: fontSizes.sm,
    color: colors.textSecondary,
    fontWeight: fontWeights.medium,
  },
  saveBtn: {
    height: 40,
    paddingHorizontal: spacing.lg,
  },
  logoutBtn: {
    marginTop: spacing.sm,
  },
});
