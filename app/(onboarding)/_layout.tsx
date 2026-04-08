import { Redirect, Stack } from 'expo-router';

import { useAppState } from '../../src/context/AppProvider';

export default function OnboardingLayout() {
  const { hydrated, state } = useAppState();

  if (hydrated && !state.auth.isLoggedIn) {
    return <Redirect href="/(auth)/login" />;
  }

  if (hydrated && state.profile.mandirName) {
    return <Redirect href="/(tabs)/home" />;
  }

  return <Stack screenOptions={{ headerShown: false, animation: 'slide_from_right' }} />;
}
