import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as Linking from 'expo-linking';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import YoutubePlayer from 'react-native-youtube-iframe';

import { Card } from '../../src/components/Card';
import { PrimaryButton } from '../../src/components/PrimaryButton';
import { Screen } from '../../src/components/Screen';
import {
  fetchTempleLiveStatus,
  formatLiveStatusMessage,
  getCachedTempleLiveStatuses,
  getTempleExternalLiveUrl,
  getTempleStreamById,
} from '../../src/services/liveDarshan';
import { palette } from '../../src/theme/palette';
import type { TempleStream, YouTubeLiveStatus } from '../../src/types/models';

export default function LiveTempleScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ id: string }>();
  const temple = getTempleStreamById(params.id);
  const [status, setStatus] = useState<YouTubeLiveStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [playerError, setPlayerError] = useState<string | null>(null);

  useEffect(() => {
    void loadTempleStatus(temple);
  }, [temple]);

  async function loadTempleStatus(currentTemple: TempleStream) {
    setLoading(true);
    setPlayerError(null);

    try {
      const cached = await getCachedTempleLiveStatuses();
      const cachedStatus = cached.statuses[currentTemple.id];

      if (cachedStatus) {
        setStatus(cachedStatus);
      }

      if (cached.isExpired || !cachedStatus) {
        const nextStatus = await fetchTempleLiveStatus(currentTemple);
        setStatus(nextStatus);
      }
    } finally {
      setLoading(false);
    }
  }

  const openInYouTube = async () => {
    const url = getTempleExternalLiveUrl(temple, status?.liveVideoId);
    await Linking.openURL(url);
  };

  const message = formatLiveStatusMessage(status);
  const canPlayInApp = Boolean(status?.isLive && status.liveVideoId);
  const playbackNote = playerError
    ? `YouTube player error: ${playerError}. Use the YouTube button below if playback is blocked on this device.`
    : null;

  return (
    <Screen scroll contentStyle={{ paddingBottom: 32 }}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Ionicons color={palette.text} name="arrow-back" size={20} />
        </Pressable>
        <Text style={styles.headerTitle}>Live Darshan</Text>
        <View style={{ width: 40 }} />
      </View>

      <Text style={styles.title}>{temple.name}</Text>
      <Text style={styles.subtitle}>{temple.location}</Text>

      <View style={styles.playerWrap}>
        {loading && !status ? (
          <View style={styles.stateWrap}>
            <ActivityIndicator color="#FFFFFF" />
            <Text style={styles.stateTitle}>Checking live status...</Text>
          </View>
        ) : canPlayInApp ? (
          <YoutubePlayer
            forceAndroidAutoplay={false}
            height={260}
            play
            videoId={status?.liveVideoId}
            webViewProps={{
              allowsInlineMediaPlayback: true,
              mediaPlaybackRequiresUserAction: false,
            }}
            onError={(error: string) => {
              setPlayerError(error);
            }}
          />
        ) : (
          <View style={styles.stateWrap}>
            <Ionicons
              color="#FFFFFF"
              name="moon"
              size={34}
            />
            <Text style={styles.stateTitle}>
              Temple stream is offline
            </Text>
            <Text style={styles.stateCopy}>
              Open the official YouTube channel to check for the next darshan stream.
            </Text>
          </View>
        )}
      </View>

      <View style={styles.buttonWrap}>
        <PrimaryButton
          label={canPlayInApp ? 'Open in YouTube' : 'Open Channel in YouTube'}
          onPress={() => {
            void openInYouTube();
          }}
          icon={<Ionicons color="#FFFFFF" name="logo-youtube" size={18} />}
        />
      </View>

      <Card>
        <Text style={styles.cardTitle}>Status</Text>
        <Text style={styles.cardText}>
          {canPlayInApp ? 'Live now' : 'Currently offline'}
        </Text>

        <Text style={styles.cardTitle}>Channel Source</Text>
        <Text style={styles.cardText}>{temple.channelLabel}</Text>

        <Text style={styles.cardTitle}>Upcoming Aarti</Text>
        <Text style={styles.cardText}>{temple.nextAarti}</Text>

        <Text style={styles.cardTitle}>About This Stream</Text>
        <Text style={styles.cardText}>{status?.liveTitle ?? temple.headline}</Text>

        {status?.lastCheckedAt ? (
          <>
            <Text style={styles.cardTitle}>Last Checked</Text>
            <Text style={styles.cardText}>
              {new Date(status.lastCheckedAt).toLocaleString()}
            </Text>
          </>
        ) : null}

        {playbackNote ? (
          <>
            <Text style={styles.cardTitle}>Playback Note</Text>
            <Text style={styles.cardText}>{playbackNote}</Text>
          </>
        ) : null}

        {message ? (
          <>
            <Text style={styles.cardTitle}>Note</Text>
            <Text style={styles.cardText}>{message}</Text>
          </>
        ) : null}
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 18,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: palette.border,
  },
  headerTitle: {
    color: palette.text,
    fontSize: 18,
    fontWeight: '800',
  },
  title: {
    color: palette.text,
    fontSize: 28,
    fontWeight: '800',
  },
  subtitle: {
    color: palette.textMuted,
    fontSize: 14,
    marginTop: 6,
    marginBottom: 16,
  },
  playerWrap: {
    minHeight: 260,
    borderRadius: 24,
    overflow: 'hidden',
    backgroundColor: '#000000',
    borderWidth: 1,
    borderColor: palette.border,
  },
  webview: {
    height: 260,
  },
  stateWrap: {
    minHeight: 260,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  stateTitle: {
    marginTop: 12,
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '800',
  },
  stateCopy: {
    marginTop: 8,
    color: 'rgba(255,255,255,0.72)',
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
  },
  buttonWrap: {
    marginVertical: 16,
  },
  cardTitle: {
    color: palette.text,
    fontSize: 16,
    fontWeight: '800',
    marginTop: 6,
  },
  cardText: {
    color: palette.textMuted,
    fontSize: 14,
    lineHeight: 21,
    marginTop: 4,
  },
});
