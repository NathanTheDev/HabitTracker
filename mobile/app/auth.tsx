import { useState } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { sendOtp, verifyOtp } from '../lib/auth';
import OtpInput from '../components/OtpInput';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { colors, fontSizes, fontWeights, spacing } from '../theme';

type Step = 'email' | 'otp';

export default function Auth() {
  const router = useRouter();
  const [step, setStep] = useState<Step>('email');
  const [email, setEmail] = useState('');
  const [session, setSession] = useState<{ deviceId: string; preAuthSessionId: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSendOtp = async () => {
    if (!email.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const res = await sendOtp(email.trim().toLowerCase());
      setSession({ deviceId: res.deviceId, preAuthSessionId: res.preAuthSessionId });
      setStep('otp');
    } catch {
      setError('Failed to send code. Check your email and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (code: string) => {
    if (!session) return;
    setLoading(true);
    setError(null);
    try {
      await verifyOtp(session.deviceId, session.preAuthSessionId, code);
      router.replace('/(tabs)/');
    } catch {
      setError('Invalid code. Please try again.');
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await sendOtp(email.trim().toLowerCase());
      setSession({ deviceId: res.deviceId, preAuthSessionId: res.preAuthSessionId });
    } catch {
      setError('Failed to resend code.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.screen}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>
            {step === 'email' ? 'Sign in to HabitTracker' : 'Check your email'}
          </Text>
          <Text style={styles.subtitle}>
            {step === 'email'
              ? "We'll send you a one-time code to sign in."
              : `We sent a 6-digit code to ${email}`}
          </Text>
        </View>

        {step === 'email' ? (
          <View style={styles.form}>
            <Input
              label="Email"
              value={email}
              onChangeText={setEmail}
              placeholder="you@example.com"
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              returnKeyType="send"
              onSubmitEditing={handleSendOtp}
            />
            {error && <Text style={styles.error}>{error}</Text>}
            <Button
              label="Send code"
              onPress={handleSendOtp}
              disabled={!email.trim()}
              loading={loading}
              style={styles.fullWidth}
            />
          </View>
        ) : (
          <View style={styles.form}>
            <OtpInput onComplete={handleVerifyOtp} disabled={loading} />
            {error && <Text style={[styles.error, styles.centered]}>{error}</Text>}
            <Button
              label="Resend code"
              variant="outline"
              onPress={handleResend}
              disabled={loading}
              style={styles.fullWidth}
            />
          </View>
        )}
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
  centered: {
    textAlign: 'center',
  },
});
