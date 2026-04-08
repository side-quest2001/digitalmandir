import { Redirect, Stack } from 'expo-router';

import { useAppState } from '../../src/context/AppProvider';

export default function AuthLayout() {
  const { hydrated, state } = useAppState();

  if (hydrated && state.auth.isLoggedIn) {
    if (!state.profile.mandirName) {
      return <Redirect href="/(onboarding)/deity" />;
    }

    return <Redirect href="/(tabs)/home" />;
  }

  return <Stack screenOptions={{ headerShown: false, animation: 'slide_from_right' }} />;
}
