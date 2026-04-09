import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { Card } from '../../src/components/Card';
import { Screen } from '../../src/components/Screen';
import { templeStreams } from '../../src/data/content';
import {
  fetchAllTempleLiveStatuses,
  formatLiveStatusMessage,
  getCachedTempleLiveStatuses,
  mergeTempleStreamsWithStatuses,
} from '../../src/services/liveDarshan';
import { palette } from '../../src/theme/palette';
import type { TempleStream, YouTubeLiveStatus } from '../../src/types/models';

export default function LiveScreen() {
  const router = useRouter();
  const [streams, setStreams] = useState<TempleStream[]>(templeStreams);
  const [statuses, setStatuses] = useState<Record<string, YouTubeLiveStatus>>({});
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [statusNote, setStatusNote] = useState<string | null>(null);
  const featuredTemple = streams.find((stream) => stream.isLive) ?? streams[0]!;

  useEffect(() => {
    void loadStreams();
  }, []);

  const templeIds = templeStreams.map((temple) => temple.id);

  async function loadStreams(forceRefresh = false) {
    if (forceRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    try {
      const cached = await getCachedTempleLiveStatuses();

      if (Object.keys(cached.statuses).length > 0) {
        setStatuses(cached.statuses);
        setStreams(mergeTempleStreamsWithStatuses(cached.statuses));
        setStatusNote(getStatusNote(cached.statuses));
      }

      const hasMissingTempleStatuses = templeIds.some((id) => !cached.statuses[id]);

      if (
        forceRefresh ||
        cached.isExpired ||
        Object.keys(cached.statuses).length === 0 ||
        hasMissingTempleStatuses
      ) {
        const nextStatuses = await fetchAllTempleLiveStatuses();
        setStatuses(nextStatuses);
        setStreams(mergeTempleStreamsWithStatuses(nextStatuses));
        setStatusNote(getStatusNote(nextStatuses));
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  return (
    <Screen
      scroll
      contentStyle={{ paddingBottom: 140 }}
      refreshControl={
        <RefreshControl
          onRefresh={() => {
            void loadStreams(true);
          }}
          refreshing={refreshing}
          tintColor={palette.primary}
        />
      }
    >
      <Text style={styles.title}>Live Darshan</Text>
      <Text style={styles.subtitle}>
        Follow a curated set of temple streams and open live darshan without loading the full
        YouTube page inside the app.
      </Text>

      <Pressable onPress={() => router.push(`/live/${featuredTemple.id}`)}>
        <Card>
          <View style={[styles.featuredVisual, { backgroundColor: featuredTemple.glow }]}>
            <Ionicons
              color={featuredTemple.accent}
              name={featuredTemple.isLive ? 'play-circle' : 'moon'}
              size={58}
            />
            <View
              style={[
                styles.liveBadge,
                featuredTemple.isLive ? styles.liveBadgeActive : styles.liveBadgeIdle,
              ]}
            >
              <Text style={styles.liveBadgeText}>
                {featuredTemple.isLive ? 'LIVE NOW' : 'OFFLINE'}
              </Text>
            </View>
          </View>
          <Text style={styles.featuredTitle}>{featuredTemple.name}</Text>
          <Text style={styles.featuredSubtitle}>
            {featuredTemple.isLive
              ? featuredTemple.liveTitle ?? featuredTemple.headline
              : featuredTemple.headline}
          </Text>
        </Card>
      </Pressable>

      <View style={styles.metaRow}>
        <Text style={styles.sectionTitle}>Curated Temples</Text>
        {loading ? <Text style={styles.metaText}>Checking YouTube…</Text> : null}
      </View>

      {statusNote ? (
        <Card>
          <Text style={styles.noteText}>{statusNote}</Text>
        </Card>
      ) : null}

      {statusNote ? <View style={{ height: 12 }} /> : null}

      {streams.map((temple) => {
        const status = statuses[temple.id];

        return (
          <Pressable
            key={temple.id}
            onPress={() => router.push(`/live/${temple.id}`)}
            style={styles.templePress}
          >
            <Card>
              <View style={styles.templeRow}>
                <View style={[styles.templeThumb, { backgroundColor: temple.glow }]}>
                  <Ionicons
                    color={temple.accent}
                    name={temple.isLive ? 'radio' : 'pause-circle'}
                    size={22}
                  />
                </View>
                <View style={styles.templeMeta}>
                  <Text style={styles.templeName}>{temple.name}</Text>
                  <Text style={styles.templeLocation}>{temple.location}</Text>
                  <Text style={styles.templeHeadline} numberOfLines={2}>
                    {temple.isLive ? temple.liveTitle ?? temple.headline : temple.headline}
                  </Text>
                </View>
                <View style={styles.templeRight}>
                  <Text style={[styles.livePill, temple.isLive ? styles.livePillActive : styles.livePillIdle]}>
                    {temple.isLive ? 'LIVE' : 'OFFLINE'}
                  </Text>
                  <Text style={styles.templeTime}>
                    {temple.isLive ? 'Open stream' : `Next aarti ${temple.nextAarti}`}
                  </Text>
                  {status?.lastCheckedAt ? (
                    <Text style={styles.lastChecked}>
                      {new Date(status.lastCheckedAt).toLocaleTimeString([], {
                        hour: 'numeric',
                        minute: '2-digit',
                      })}
                    </Text>
                  ) : null}
                </View>
              </View>
            </Card>
          </Pressable>
        );
      })}
    </Screen>
  );
}

function getStatusNote(statuses: Record<string, YouTubeLiveStatus>) {
  const notes = Object.values(statuses)
    .map((status) => formatLiveStatusMessage(status))
    .filter((message) => message !== null);

  return notes[0] ?? null;
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
  },
  liveBadgeActive: {
    backgroundColor: '#FF5B63',
  },
  liveBadgeIdle: {
    backgroundColor: '#7E88AA',
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
  metaRow: {
    marginTop: 18,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  sectionTitle: {
    color: palette.text,
    fontSize: 19,
    fontWeight: '800',
  },
  metaText: {
    color: palette.textMuted,
    fontSize: 13,
    fontWeight: '700',
  },
  noteText: {
    color: palette.textMuted,
    fontSize: 14,
    lineHeight: 21,
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
  templeHeadline: {
    marginTop: 6,
    color: palette.textMuted,
    fontSize: 13,
    lineHeight: 18,
  },
  templeRight: {
    alignItems: 'flex-end',
    gap: 6,
  },
  livePill: {
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
  },
  livePillActive: {
    backgroundColor: '#FF5B63',
  },
  livePillIdle: {
    backgroundColor: '#97A0BC',
  },
  templeTime: {
    color: palette.textMuted,
    fontSize: 12,
    fontWeight: '700',
  },
  lastChecked: {
    color: palette.textMuted,
    fontSize: 11,
  },
});
