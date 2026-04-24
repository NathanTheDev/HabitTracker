import { storage } from './storage';

const BASE_URL = process.env.EXPO_PUBLIC_API_URL;

const ST_HEADERS = {
  'Content-Type': 'application/json',
  'st-auth-mode': 'header',
};

export async function sendOtp(email: string): Promise<{ deviceId: string; preAuthSessionId: string; flowType: string }> {
  const res = await fetch(`${BASE_URL}/api/auth/signinup/code`, {
    method: 'POST',
    headers: ST_HEADERS,
    body: JSON.stringify({ email }),
  });
  if (!res.ok) throw new Error('Failed to send OTP');
  return res.json();
}

export async function verifyOtp(
  deviceId: string,
  preAuthSessionId: string,
  userInputCode: string
): Promise<void> {
  const res = await fetch(`${BASE_URL}/api/auth/signinup/code/consume`, {
    method: 'POST',
    headers: ST_HEADERS,
    body: JSON.stringify({ deviceId, preAuthSessionId, userInputCode }),
  });

  if (!res.ok) throw new Error('Invalid OTP');

  const access = res.headers.get('st-access-token');
  const refresh = res.headers.get('st-refresh-token');

  if (!access || !refresh) throw new Error('No tokens in response');

  await storage.setTokens(access, refresh);
}

export async function logout(): Promise<void> {
  const access = await storage.getAccess();
  if (access) {
    await fetch(`${BASE_URL}/api/auth/signout`, {
      method: 'POST',
      headers: { ...ST_HEADERS, Authorization: `Bearer ${access}` },
    }).catch(() => {});
  }
  await storage.clearTokens();
}
