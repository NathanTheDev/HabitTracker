import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const KEYS = { access: 'access_token', refresh: 'refresh_token' } as const;

const get = (key: string) =>
  Platform.OS === 'web'
    ? Promise.resolve(localStorage.getItem(key))
    : SecureStore.getItemAsync(key);

const set = (key: string, value: string) =>
  Platform.OS === 'web'
    ? Promise.resolve(localStorage.setItem(key, value))
    : SecureStore.setItemAsync(key, value);

const remove = (key: string) =>
  Platform.OS === 'web'
    ? Promise.resolve(localStorage.removeItem(key))
    : SecureStore.deleteItemAsync(key);

export const storage = {
  getAccess: () => get(KEYS.access),
  getRefresh: () => get(KEYS.refresh),
  setTokens: (access: string, refresh: string) =>
    Promise.all([set(KEYS.access, access), set(KEYS.refresh, refresh)]),
  clearTokens: () =>
    Promise.all([remove(KEYS.access), remove(KEYS.refresh)]),
};
