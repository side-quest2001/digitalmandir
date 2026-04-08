import { Ionicons } from '@expo/vector-icons';
import { Redirect, Tabs } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { MiniPlayer } from '../../src/components/MiniPlayer';
import { useAppState } from '../../src/context/AppProvider';
import { palette } from '../../src/theme/palette';

export default function TabsLayout() {
  const { hydrated, state, currentTrack } = useAppState();

  if (hydrated && !state.auth.isLoggedIn) {
    return <Redirect href="/(auth)/login" />;
  }

  if (hydrated && !state.profile.mandirName) {
    return <Redirect href="/(onboarding)/deity" />;
  }

  return (
    <View style={styles.shell}>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: palette.primary,
          tabBarInactiveTintColor: palette.tabInactive,
          tabBarStyle: styles.tabBar,
          tabBarLabelStyle: styles.tabLabel,
        }}
      >
        <Tabs.Screen
          name="home"
          options={{
            title: 'Home',
            tabBarIcon: ({ color, size }) => <Ionicons color={color} name="home" size={size} />,
          }}
        />
        <Tabs.Screen
          name="bhajans"
          options={{
            title: 'Bhajans',
            tabBarIcon: ({ color, size }) => (
              <Ionicons color={color} name="musical-notes" size={size} />
            ),
          }}
        />
        <Tabs.Screen
          name="live"
          options={{
            title: 'Live',
            tabBarIcon: ({ color, size }) => <Ionicons color={color} name="radio" size={size} />,
          }}
        />
        <Tabs.Screen
          name="settings"
          options={{
            title: 'Settings',
            tabBarIcon: ({ color, size }) => <Ionicons color={color} name="settings" size={size} />,
          }}
        />
      </Tabs>
      {currentTrack ? (
        <View style={styles.playerDock}>
          <MiniPlayer />
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  shell: {
    flex: 1,
    backgroundColor: palette.backgroundTop,
  },
  tabBar: {
    position: 'absolute',
    left: 16,
    right: 16,
    bottom: 16,
    height: 74,
    borderTopWidth: 0,
    borderRadius: 26,
    backgroundColor: '#FFFFFF',
    paddingTop: 8,
    paddingBottom: 10,
    shadowColor: '#2C4B93',
    shadowOpacity: 0.14,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 10 },
    elevation: 10,
  },
  tabLabel: {
    fontSize: 12,
    fontWeight: '700',
  },
  playerDock: {
    position: 'absolute',
    left: 16,
    right: 16,
    bottom: 98,
  },
});
