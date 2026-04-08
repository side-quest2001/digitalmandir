import { Ionicons } from '@expo/vector-icons';
import { Alert, Pressable, StyleSheet, Switch, Text, View } from 'react-native';

import { Card } from '../../src/components/Card';
import { Screen } from '../../src/components/Screen';
import { useAppState } from '../../src/context/AppProvider';
import { deities } from '../../src/data/content';
import { palette } from '../../src/theme/palette';
import { formatTimeLabel } from '../../src/utils/time';

export default function SettingsScreen() {
  const { state, toggleNotifications, logout } = useAppState();
  const deity =
    deities.find((entry) => entry.id === state.onboarding.selectedDeityId) ?? deities[0]!;

  return (
    <Screen scroll contentStyle={{ paddingBottom: 140 }}>
      <Text style={styles.title}>Settings</Text>

      <Card>
        <View style={styles.profileRow}>
          <View style={styles.avatar}>
            <Ionicons color={palette.primary} name="person" size={28} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.profileName}>{state.profile.mandirName}</Text>
            <Text style={styles.profileSub}>+91 {state.profile.phoneNumber || '98XXXXXX12'}</Text>
          </View>
          <Ionicons color={palette.textMuted} name="chevron-forward" size={20} />
        </View>
      </Card>

      <View style={{ height: 14 }} />

      <Card>
        <SettingRow
          icon="alarm"
          label="Aarti Timing"
          value={`${formatTimeLabel(state.onboarding.aartiSchedule.morning)} & ${formatTimeLabel(
            state.onboarding.aartiSchedule.evening
          )}`}
        />
        <SettingRow icon="sparkles" label="Selected Deity" value={deity.name} />
        <SettingRow
          icon="language"
          label="Language"
          value={state.onboarding.language === 'hi' ? 'Hindi' : 'English'}
        />
        <View style={styles.toggleRow}>
          <View style={styles.settingLeft}>
            <View style={styles.settingIconWrap}>
              <Ionicons color={palette.primary} name="notifications" size={20} />
            </View>
            <View>
              <Text style={styles.settingLabel}>Notifications</Text>
              <Text style={styles.settingValue}>Daily reminders enabled</Text>
            </View>
          </View>
          <Switch
            onValueChange={toggleNotifications}
            thumbColor="#FFFFFF"
            trackColor={{ false: '#CCD4EB', true: palette.primary }}
            value={state.settings.notificationsEnabled}
          />
        </View>
      </Card>

      <View style={{ height: 14 }} />

      <Card>
        <SettingRow icon="download" label="Downloaded Bhajans" value="Curated POC playlist" />
        <SettingRow icon="help-circle" label="Help & Support" value="Frontend-only demo support" />
        <SettingRow icon="information-circle" label="About App" value="Expo Go POC build" />
      </Card>

      <Pressable
        onPress={() =>
          Alert.alert('Log out?', 'This will clear the local mocked session.', [
            { text: 'Cancel', style: 'cancel' },
            {
              text: 'Log Out',
              style: 'destructive',
              onPress: () => {
                logout().catch(() => undefined);
              },
            },
          ])
        }
        style={styles.logoutButton}
      >
        <Text style={styles.logoutText}>Log Out</Text>
      </Pressable>
    </Screen>
  );
}

function SettingRow({
  icon,
  label,
  value,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
}) {
  return (
    <View style={styles.settingRow}>
      <View style={styles.settingLeft}>
        <View style={styles.settingIconWrap}>
          <Ionicons color={palette.primary} name={icon} size={20} />
        </View>
        <View>
          <Text style={styles.settingLabel}>{label}</Text>
          <Text style={styles.settingValue}>{value}</Text>
        </View>
      </View>
      <Ionicons color={palette.textMuted} name="chevron-forward" size={20} />
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    color: palette.text,
    fontSize: 30,
    fontWeight: '800',
    marginBottom: 18,
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  avatar: {
    width: 54,
    height: 54,
    borderRadius: 18,
    backgroundColor: '#EAF0FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileName: {
    color: palette.text,
    fontSize: 18,
    fontWeight: '800',
  },
  profileSub: {
    marginTop: 4,
    color: palette.textMuted,
    fontSize: 13,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  settingIconWrap: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: '#EEF3FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingLabel: {
    color: palette.text,
    fontSize: 16,
    fontWeight: '700',
  },
  settingValue: {
    marginTop: 3,
    color: palette.textMuted,
    fontSize: 13,
  },
  logoutButton: {
    marginTop: 18,
    minHeight: 54,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#F0D8D8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoutText: {
    color: palette.danger,
    fontSize: 16,
    fontWeight: '800',
  },
});
