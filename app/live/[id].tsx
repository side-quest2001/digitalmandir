import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { WebView } from 'react-native-webview';

import { Card } from '../../src/components/Card';
import { Screen } from '../../src/components/Screen';
import { templeStreams } from '../../src/data/content';
import { palette } from '../../src/theme/palette';

export default function LiveTempleScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ id: string }>();
  const temple = templeStreams.find((entry) => entry.id === params.id) ?? templeStreams[0]!;

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
        <WebView
          allowsInlineMediaPlayback
          javaScriptEnabled
          mediaPlaybackRequiresUserAction={false}
          originWhitelist={['*']}
          source={{ uri: temple.liveUrl }}
          style={styles.webview}
        />
      </View>

      <View style={{ height: 16 }} />

      <Card>
        <Text style={styles.cardTitle}>Channel Source</Text>
        <Text style={styles.cardText}>{temple.channelLabel}</Text>
        <Text style={styles.cardTitle}>Upcoming Aarti</Text>
        <Text style={styles.cardText}>{temple.nextAarti}</Text>
        <Text style={styles.cardTitle}>About This Stream</Text>
        <Text style={styles.cardText}>{temple.headline}</Text>
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
    borderRadius: 24,
    overflow: 'hidden',
    backgroundColor: '#000000',
    borderWidth: 1,
    borderColor: palette.border,
  },
  webview: {
    height: 260,
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
