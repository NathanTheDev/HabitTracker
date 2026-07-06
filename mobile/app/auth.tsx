import { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { signIn, signUp } from '../lib/auth';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { colors, fontSizes, fontWeights, spacing } from '../theme';

type Mode = 'signIn' | 'signUp';

export default function Auth() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>('signIn');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!email.trim() || !password) return;
    setLoading(true);
    setError(null);
    try {
      if (mode === 'signIn') {
        await signIn(email.trim().toLowerCase(), password);
      } else {
        await signUp(email.trim().toLowerCase(), password);
      }
      router.replace('/(tabs)/');
    } catch (e) {
      console.error(`[${mode}]`, e);
      setError(
        mode === 'signIn'
          ? 'Invalid email or password.'
          : 'Failed to create account. Check your email and password.'
      );
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setMode((m) => (m === 'signIn' ? 'signUp' : 'signIn'));
    setError(null);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.screen}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>
            {mode === 'signIn' ? 'Sign in to HabitTracker' : 'Create your account'}
          </Text>
          <Text style={styles.subtitle}>
            {mode === 'signIn'
              ? 'Welcome back! Enter your details to continue.'
              : 'Enter an email and password to get started.'}
          </Text>
        </View>

        <View style={styles.form}>
          <Input
            value={email}
            onChangeText={setEmail}
            placeholder="you@example.com"
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            returnKeyType="next"
          />
          <Input
            value={password}
            onChangeText={setPassword}
            placeholder="Password"
            secureTextEntry
            autoCapitalize="none"
            autoComplete="password"
            returnKeyType="send"
            onSubmitEditing={handleSubmit}
          />
          {error && <Text style={styles.error}>{error}</Text>}
          <Button
            label={mode === 'signIn' ? 'Sign in' : 'Create account'}
            onPress={handleSubmit}
            disabled={!email.trim() || !password}
            loading={loading}
            style={styles.fullWidth}
          />
          <Pressable onPress={toggleMode} disabled={loading}>
            <Text style={styles.switchText}>
              {mode === 'signIn'
                ? "Don't have an account? Create one"
                : 'Already have an account? Sign in'}
            </Text>
          </Pressable>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
    maxWidth: 400,
    width: '100%',
    alignSelf: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  title: {
    fontSize: fontSizes.xl,
    fontWeight: fontWeights.semibold,
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: fontSizes.sm,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  form: {
    gap: spacing.md,
  },
  fullWidth: {
    width: '100%',
  },
  error: {
    fontSize: fontSizes.sm,
    color: '#C0504D',
  },
  switchText: {
    fontSize: fontSizes.sm,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});
