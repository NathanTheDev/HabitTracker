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
  const headingName = user?.displayName || 'My Profile';

  const memberSince = user?.timeJoined
    ? new Date(user.timeJoined).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    : null;

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
      <View style={styles.avatarSection}>
        <Avatar name={avatarName} size={80} />
        <Text style={styles.heading}>{headingName}</Text>
      </View>

      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>Account Details</Text>
          {!editing && (
            <Pressable onPress={handleEditPress} style={styles.editBtn}>
              <Text style={styles.editBtnText}>Edit</Text>
            </Pressable>
          )}
        </View>

        <View style={styles.field}>
          <Text style={styles.fieldLabel}>DISPLAY NAME</Text>
          {editing ? (
            <TextInput
              ref={inputRef}
              style={styles.nameInput}
              value={displayName}
              onChangeText={setDisplayName}
              placeholder="Your name"
              placeholderTextColor={colors.textMuted}
              returnKeyType="done"
              onSubmitEditing={handleSave}
            />
          ) : (
            <Text style={styles.fieldValue}>{user?.displayName || '—'}</Text>
          )}
        </View>

        <View style={styles.field}>
          <Text style={styles.fieldLabel}>MEMBER SINCE</Text>
          <Text style={styles.fieldValue}>{memberSince ?? '—'}</Text>
        </View>

        {editing && (
          <View style={styles.editActions}>
            <Button
              label="Save"
              variant="primary"
              loading={saving}
              onPress={handleSave}
              style={styles.saveBtn}
            />
            <Button
              label="Cancel"
              variant="outline"
              onPress={handleCancel}
              style={styles.cancelBtn}
            />
          </View>
        )}
      </View>

      <Button
        label="Log out"
        variant="primary"
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
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
    paddingBottom: spacing.xxl,
    gap: spacing.lg,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
  },
  avatarSection: {
    alignItems: 'center',
    gap: spacing.md,
    paddingBottom: spacing.xs,
  },
  heading: {
    fontSize: fontSizes.xl,
    fontWeight: fontWeights.semibold,
    color: colors.textPrimary,
  },
  card: {
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
    gap: spacing.md,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: spacing.xs,
  },
  cardTitle: {
    fontSize: fontSizes.md,
    fontWeight: fontWeights.semibold,
    color: colors.textPrimary,
  },
  editBtn: {
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  editBtnText: {
    fontSize: fontSizes.sm,
    color: colors.textMuted,
    fontWeight: fontWeights.medium,
  },
  field: {
    gap: 4,
  },
  fieldLabel: {
    fontSize: fontSizes.xs,
    fontWeight: '600',
    color: colors.textMuted,
    letterSpacing: 0.5,
  },
  fieldValue: {
    fontSize: fontSizes.sm,
    color: colors.textPrimary,
  },
  nameInput: {
    height: 40,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 12,
    fontSize: fontSizes.sm,
    color: colors.textPrimary,
    backgroundColor: colors.background,
  },
  editActions: {
    flexDirection: 'row',
    gap: spacing.sm,
    paddingTop: spacing.xs,
  },
  saveBtn: {
    height: 36,
    paddingHorizontal: spacing.lg,
    flex: 0,
  },
  cancelBtn: {
    height: 36,
    paddingHorizontal: spacing.lg,
    flex: 0,
  },
  logoutBtn: {
    width: '100%',
  },
});
