import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Card } from '../../src/components/Card';
import { Screen } from '../../src/components/Screen';
import { templeStreams } from '../../src/data/content';
import { palette } from '../../src/theme/palette';

export default function LiveScreen() {
  const router = useRouter();
  const featuredTemple = templeStreams[0]!;

  return (
    <Screen scroll contentStyle={{ paddingBottom: 140 }}>
      <Text style={styles.title}>Live Darshan</Text>
      <Text style={styles.subtitle}>Watch temple streams available on YouTube directly inside the app.</Text>

      <Pressable onPress={() => router.push(`/live/${featuredTemple.id}`)}>
        <Card>
          <View style={[styles.featuredVisual, { backgroundColor: featuredTemple.glow }]}>
            <Ionicons color={featuredTemple.accent} name="play-circle" size={58} />
            <View style={styles.liveBadge}>
              <Text style={styles.liveBadgeText}>LIVE</Text>
            </View>
          </View>
          <Text style={styles.featuredTitle}>{featuredTemple.name}</Text>
          <Text style={styles.featuredSubtitle}>{featuredTemple.headline}</Text>
        </Card>
      </Pressable>

      <Text style={styles.sectionTitle}>Live Temples</Text>

      {templeStreams.map((temple) => (
        <Pressable key={temple.id} onPress={() => router.push(`/live/${temple.id}`)} style={styles.templePress}>
          <Card>
            <View style={styles.templeRow}>
              <View style={[styles.templeThumb, { backgroundColor: temple.glow }]}>
                <Ionicons color={temple.accent} name="radio" size={22} />
              </View>
              <View style={styles.templeMeta}>
                <Text style={styles.templeName}>{temple.name}</Text>
                <Text style={styles.templeLocation}>{temple.location}</Text>
              </View>
              <View style={styles.templeRight}>
                <Text style={styles.livePill}>LIVE</Text>
                <Text style={styles.templeTime}>{temple.nextAarti}</Text>
              </View>
            </View>
          </Card>
        </Pressable>
      ))}
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: {
    color: palette.text,
    fontSize: 30,
    fontWeight: '800',
  },
  subtitle: {
    marginTop: 6,
    color: palette.textMuted,
    fontSize: 15,
    lineHeight: 22,
  },
  featuredVisual: {
    height: 200,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  liveBadge: {
    position: 'absolute',
    top: 16,
    right: 16,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#FF5B63',
  },
  liveBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
  },
  featuredTitle: {
    marginTop: 16,
    color: palette.text,
    fontSize: 24,
    fontWeight: '800',
  },
  featuredSubtitle: {
    marginTop: 6,
    color: palette.textMuted,
    fontSize: 14,
    lineHeight: 20,
  },
  sectionTitle: {
    marginTop: 18,
    marginBottom: 12,
    color: palette.text,
    fontSize: 19,
    fontWeight: '800',
  },
  templePress: {
    marginBottom: 12,
  },
  templeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  templeThumb: {
    width: 58,
    height: 58,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  templeMeta: {
    flex: 1,
  },
  templeName: {
    color: palette.text,
    fontSize: 17,
    fontWeight: '800',
  },
  templeLocation: {
    marginTop: 4,
    color: palette.textMuted,
    fontSize: 13,
  },
  templeRight: {
    alignItems: 'flex-end',
    gap: 8,
  },
  livePill: {
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
    backgroundColor: '#FF5B63',
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
  },
  templeTime: {
    color: palette.textMuted,
    fontSize: 13,
    fontWeight: '700',
  },
});
