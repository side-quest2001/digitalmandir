import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { Card } from '../../src/components/Card';
import { PrimaryButton } from '../../src/components/PrimaryButton';
import { Screen } from '../../src/components/Screen';
import { useAppState } from '../../src/context/AppProvider';
import { bhajanTracks, deities } from '../../src/data/content';
import { palette } from '../../src/theme/palette';
import { getCurrentTimeLabel, getNextAarti, formatTimeLabel } from '../../src/utils/time';

export default function HomeScreen() {
  const router = useRouter();
  const { state, playTrack } = useAppState();
  const deity =
    deities.find((entry) => entry.id === state.onboarding.selectedDeityId) ?? deities[0]!;
  const featuredTrack =
    bhajanTracks.find((track) => track.deityId === deity.id && track.playable) ??
    bhajanTracks[0]!;
  const nextAarti = getNextAarti(state.onboarding.aartiSchedule);

  return (
    <Screen scroll contentStyle={{ paddingBottom: 140 }}>
      <View style={styles.header}>
        <Text style={styles.brand}>Digital Mandir</Text>
      </View>

      <Card>
        <View style={[styles.heroOrb, { backgroundColor: deity.glow }]}>
          <Text style={[styles.heroSymbol, { color: deity.accent }]}>{deity.symbol}</Text>
          <Text style={[styles.heroName, { color: deity.accent }]}>{deity.name}</Text>
        </View>
        <Text style={styles.clock}>{getCurrentTimeLabel()}</Text>
        <Text style={styles.nextText}>
          Next {nextAarti.phase.toLowerCase()} at {nextAarti.label}
        </Text>
        <View style={{ marginTop: 20 }}>
          <PrimaryButton
            label={`Play ${nextAarti.phase}`}
            onPress={() => playTrack(featuredTrack.id)}
            icon={<Ionicons color="#FFFFFF" name="play" size={18} />}
          />
        </View>
      </Card>

      <View style={{ height: 16 }} />

      <Card>
        <View style={styles.listRow}>
          <View style={[styles.inlineIcon, { backgroundColor: featuredTrack.glow }]}>
            <Ionicons color={featuredTrack.accent} name="musical-note" size={20} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.smallLabel}>Today's Bhajan</Text>
            <Text style={styles.cardTitle}>{featuredTrack.title}</Text>
            <Text style={styles.cardSubtitle}>{featuredTrack.subtitle}</Text>
          </View>
          <Ionicons color={palette.textMuted} name="chevron-forward" size={20} />
        </View>
      </Card>

      <View style={{ height: 16 }} />

      <Card>
        <Text style={styles.cardTitle}>Daily Rhythm</Text>
        <View style={styles.scheduleRow}>
          <View style={styles.scheduleChip}>
            <Text style={styles.scheduleLabel}>Morning</Text>
            <Text style={styles.scheduleTime}>
              {formatTimeLabel(state.onboarding.aartiSchedule.morning)}
            </Text>
          </View>
          <View style={styles.scheduleChip}>
            <Text style={styles.scheduleLabel}>Evening</Text>
            <Text style={styles.scheduleTime}>
              {formatTimeLabel(state.onboarding.aartiSchedule.evening)}
            </Text>
          </View>
        </View>
      </Card>

      <View style={{ height: 16 }} />

      <PrimaryButton label="Open Live Darshan" onPress={() => router.push('/(tabs)/live')} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
    marginBottom: 18,
  },
  brand: {
    color: palette.text,
    fontSize: 28,
    fontWeight: '800',
  },
  heroOrb: {
    height: 220,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroSymbol: {
    fontSize: 54,
    fontWeight: '900',
  },
  heroName: {
    marginTop: 12,
    fontSize: 24,
    fontWeight: '800',
  },
  clock: {
    marginTop: 22,
    textAlign: 'center',
    color: palette.text,
    fontSize: 44,
    fontWeight: '800',
  },
  nextText: {
    marginTop: 6,
    textAlign: 'center',
    color: palette.textMuted,
    fontSize: 16,
  },
  listRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  inlineIcon: {
    width: 52,
    height: 52,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  smallLabel: {
    color: palette.textMuted,
    fontSize: 13,
  },
  cardTitle: {
    marginTop: 4,
    color: palette.text,
    fontSize: 18,
    fontWeight: '800',
  },
  cardSubtitle: {
    marginTop: 3,
    color: palette.textMuted,
    fontSize: 14,
  },
  scheduleRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
  scheduleChip: {
    flex: 1,
    borderRadius: 18,
    backgroundColor: '#F7F9FF',
    padding: 14,
    borderWidth: 1,
    borderColor: palette.border,
  },
  scheduleLabel: {
    color: palette.textMuted,
    fontSize: 13,
  },
  scheduleTime: {
    marginTop: 6,
    color: palette.text,
    fontSize: 18,
    fontWeight: '800',
  },
});
