// firebase/auth's public .d.ts resolves to the platform-agnostic build regardless of
// the "react-native" customCondition, so getReactNativePersistence (only present in the
// RN-specific build actually loaded at runtime by Metro) is missing from its types.
// The `export {}` makes this a module so the block below augments firebase/auth's
// existing types instead of replacing them.
export {};

declare module 'firebase/auth' {
  function getReactNativePersistence(storage: ReactNativeAsyncStorage): Persistence;
}
