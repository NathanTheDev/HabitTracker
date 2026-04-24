import '../global.css';
import { useEffect, useState } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { storage } from '../lib/storage';

export default function RootLayout() {
  const router = useRouter();
  const segments = useSegments();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    storage.getAccess().then((token) => {
      const inAuth = segments[0] === 'auth';
      if (!token && !inAuth) {
        router.replace('/auth');
      } else if (token && inAuth) {
        router.replace('/(tabs)/');
      }
      setReady(true);
    });
  }, []);

  if (!ready) return null;

  return <Stack screenOptions={{ headerShown: false }} />;
}
