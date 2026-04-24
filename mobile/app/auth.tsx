import { useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { sendOtp, verifyOtp } from '../lib/auth';
import OtpInput from '../components/OtpInput';

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
      style={{ flex: 1, backgroundColor: '#FAFAF9' }}
    >
      <View style={{ flex: 1, justifyContent: 'center', paddingHorizontal: 24 }}>
        <Text style={{ fontSize: 28, fontWeight: '700', color: '#3D3530', marginBottom: 8 }}>
          HabitTracker
        </Text>
        <Text style={{ fontSize: 15, color: '#9E9189', marginBottom: 40 }}>
          {step === 'email' ? 'Sign in to continue' : `Enter the code sent to ${email}`}
        </Text>

        <View
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: 16,
            padding: 24,
            shadowColor: '#3D3530',
            shadowOpacity: 0.06,
            shadowRadius: 12,
            shadowOffset: { width: 0, height: 4 },
            elevation: 3,
          }}
        >
          {step === 'email' ? (
            <>
              <Text style={{ fontSize: 13, fontWeight: '600', color: '#9E9189', marginBottom: 8, letterSpacing: 0.5 }}>
                EMAIL
              </Text>
              <TextInput
                value={email}
                onChangeText={setEmail}
                placeholder="you@example.com"
                placeholderTextColor="#C4BAB6"
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                returnKeyType="send"
                onSubmitEditing={handleSendOtp}
                style={{
                  height: 48,
                  borderRadius: 12,
                  borderWidth: 1.5,
                  borderColor: '#E8E0DC',
                  paddingHorizontal: 14,
                  fontSize: 16,
                  color: '#3D3530',
                  marginBottom: 20,
                }}
              />
              <Pressable
                onPress={handleSendOtp}
                disabled={loading || !email.trim()}
                style={({ pressed }) => ({
                  height: 50,
                  borderRadius: 14,
                  backgroundColor: loading || !email.trim() ? '#DCCFCD' : '#C58D85',
                  alignItems: 'center',
                  justifyContent: 'center',
                  opacity: pressed ? 0.85 : 1,
                })}
              >
                {loading ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <Text style={{ color: '#FFFFFF', fontWeight: '600', fontSize: 16 }}>
                    Send Code
                  </Text>
                )}
              </Pressable>
            </>
          ) : (
            <>
              <Text style={{ fontSize: 13, fontWeight: '600', color: '#9E9189', marginBottom: 20, letterSpacing: 0.5, textAlign: 'center' }}>
                VERIFICATION CODE
              </Text>
              <OtpInput onComplete={handleVerifyOtp} disabled={loading} />
              {loading && (
                <ActivityIndicator color="#C58D85" style={{ marginTop: 24 }} />
              )}
              <Pressable onPress={handleResend} disabled={loading} style={{ marginTop: 24, alignItems: 'center' }}>
                <Text style={{ color: loading ? '#C4BAB6' : '#C58D85', fontSize: 14, fontWeight: '500' }}>
                  Resend code
                </Text>
              </Pressable>
            </>
          )}

          {error && (
            <Text style={{ color: '#C0504D', fontSize: 13, marginTop: 16, textAlign: 'center' }}>
              {error}
            </Text>
          )}
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
