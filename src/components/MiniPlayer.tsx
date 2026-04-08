import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useAppState } from '../context/AppProvider';
import { palette } from '../theme/palette';

export function MiniPlayer() {
  const { currentTrack, playbackState, togglePlayback } = useAppState();

  if (!currentTrack) {
    return null;
  }

  return (
    <View style={styles.wrapper}>
      <View style={styles.artwork}>
        <Text style={styles.artworkText}>{currentTrack.title.slice(0, 1)}</Text>
      </View>
      <View style={styles.meta}>
        <Text numberOfLines={1} style={styles.title}>
          {currentTrack.title}
        </Text>
        <Text style={styles.subtitle}>
          {playbackState.isPlaying ? 'Now playing' : 'Paused'}
        </Text>
      </View>
      <Pressable onPress={togglePlayback} style={styles.action}>
        <Ionicons
          color="#FFFFFF"
          name={playbackState.isPlaying ? 'pause' : 'play'}
          size={20}
        />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: palette.border,
    shadowColor: '#2C4B93',
    shadowOpacity: 0.15,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 5,
  },
  artwork: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: '#FFF2DD',
    alignItems: 'center',
    justifyContent: 'center',
  },
  artworkText: {
    color: palette.primary,
    fontSize: 16,
    fontWeight: '800',
  },
  meta: {
    flex: 1,
    marginLeft: 12,
  },
  title: {
    color: palette.text,
    fontSize: 15,
    fontWeight: '700',
  },
  subtitle: {
    marginTop: 2,
    color: palette.textMuted,
    fontSize: 13,
  },
  action: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: palette.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
