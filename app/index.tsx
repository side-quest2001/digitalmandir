import { Redirect } from 'expo-router';
import { ActivityIndicator, View } from 'react-native';

import { useAppState } from '../src/context/AppProvider';
import { palette } from '../src/theme/palette';

export default function IndexScreen() {
  const { hydrated, state } = useAppState();

  if (!hydrated) {
    return (
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: palette.backgroundTop,
        }}
      >
        <ActivityIndicator color={palette.primary} size="large" />
      </View>
    );
  }

  if (!state.auth.isLoggedIn) {
    return <Redirect href="/(auth)/login" />;
  }

  if (!state.profile.mandirName) {
    return <Redirect href="/(onboarding)/deity" />;
  }

  return <Redirect href="/(tabs)/home" />;
}
