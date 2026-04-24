import * as SecureStore from 'expo-secure-store';

const KEYS = { access: 'access_token', refresh: 'refresh_token' } as const;

export const storage = {
  getAccess: () => SecureStore.getItemAsync(KEYS.access),
  getRefresh: () => SecureStore.getItemAsync(KEYS.refresh),
  setTokens: (access: string, refresh: string) =>
    Promise.all([
      SecureStore.setItemAsync(KEYS.access, access),
      SecureStore.setItemAsync(KEYS.refresh, refresh),
    ]),
  clearTokens: () =>
    Promise.all([
      SecureStore.deleteItemAsync(KEYS.access),
      SecureStore.deleteItemAsync(KEYS.refresh),
    ]),
};
