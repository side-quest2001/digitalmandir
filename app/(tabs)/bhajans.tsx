import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { Card } from '../../src/components/Card';
import { Screen } from '../../src/components/Screen';
import { useAppState } from '../../src/context/AppProvider';
import { bhajanTracks, deities } from '../../src/data/content';
import { palette } from '../../src/theme/palette';

const categories = ['All', 'Ganesh', 'Shiva', 'Krishna', 'Hanuman', 'Durga', 'Rama'];

export default function BhajansScreen() {
  const { playTrack, playbackState, currentTrack, togglePlayback } = useAppState();
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const visibleTracks = bhajanTracks.filter((track) => {
    const deity = deities.find((entry) => entry.id === track.deityId);
    const matchesCategory =
      selectedCategory === 'All' || deity?.name.toLowerCase() === selectedCategory.toLowerCase();
    const matchesSearch =
      !search.trim() ||
      track.title.toLowerCase().includes(search.toLowerCase()) ||
      track.subtitle.toLowerCase().includes(search.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  return (
    <Screen scroll contentStyle={{ paddingBottom: 140 }}>
      <Text style={styles.title}>Bhajans</Text>
      <Text style={styles.subtitle}>Explore devotional songs and keep the current playback state persistent.</Text>

      <View style={styles.searchBar}>
        <Ionicons color={palette.textMuted} name="search" size={18} />
        <TextInput
          onChangeText={setSearch}
          placeholder="Search bhajans..."
          placeholderTextColor="#9EA5BD"
          style={styles.searchInput}
          value={search}
        />
      </View>

      <View style={styles.filterRow}>
        {categories.map((category) => {
          const selected = category === selectedCategory;
          return (
            <Pressable
              key={category}
              onPress={() => setSelectedCategory(category)}
              style={[styles.filterChip, selected && styles.filterChipSelected]}
            >
              <Text style={[styles.filterText, selected && styles.filterTextSelected]}>{category}</Text>
            </Pressable>
          );
        })}
      </View>

      {visibleTracks.map((track) => {
        const playing = currentTrack?.id === track.id && playbackState.isPlaying;

        return (
          <View key={track.id} style={styles.trackWrap}>
            <Card>
              <View style={styles.trackRow}>
                <View style={[styles.trackBadge, { backgroundColor: track.glow }]}>
                  <Text style={[styles.trackInitial, { color: track.accent }]}>
                    {track.title.slice(0, 1)}
                  </Text>
                </View>
                <View style={styles.trackMeta}>
                  <Text style={styles.trackTitle}>{track.title}</Text>
                  <Text style={styles.trackSubtitle}>{track.category}</Text>
                </View>
                <Text style={styles.duration}>{track.durationLabel}</Text>
                <Pressable
                  disabled={!track.playable}
                  onPress={() => {
                    if (currentTrack?.id === track.id) {
                      togglePlayback();
                      return;
                    }
                    playTrack(track.id);
                  }}
                  style={[
                    styles.playButton,
                    !track.playable && styles.playButtonMuted,
                    playing && styles.playButtonActive,
                  ]}
                >
                  <Ionicons
                    color="#FFFFFF"
                    name={playing ? 'pause' : 'play'}
                    size={18}
                  />
                </Pressable>
              </View>
              {!track.playable ? (
                <Text style={styles.mockNote}>Mock item only. Playback is enabled for the curated subset above.</Text>
              ) : null}
            </Card>
          </View>
        );
      })}
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
    color: palette.textMuted,
    fontSize: 15,
    lineHeight: 22,
    marginTop: 6,
    marginBottom: 18,
  },
  searchBar: {
    height: 54,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: palette.border,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    alignItems: 'center',
    flexDirection: 'row',
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    color: palette.text,
    fontSize: 16,
  },
  filterRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 14,
    marginBottom: 16,
    flexWrap: 'wrap',
  },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: palette.border,
  },
  filterChipSelected: {
    backgroundColor: palette.primary,
    borderColor: palette.primary,
  },
  filterText: {
    color: palette.text,
    fontSize: 14,
    fontWeight: '700',
  },
  filterTextSelected: {
    color: '#FFFFFF',
  },
  trackWrap: {
    marginBottom: 12,
  },
  trackRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  trackBadge: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  trackInitial: {
    fontSize: 18,
    fontWeight: '800',
  },
  trackMeta: {
    flex: 1,
  },
  trackTitle: {
    color: palette.text,
    fontSize: 16,
    fontWeight: '800',
  },
  trackSubtitle: {
    marginTop: 4,
    color: palette.textMuted,
    fontSize: 13,
  },
  duration: {
    color: palette.textMuted,
    fontSize: 13,
    fontWeight: '700',
  },
  playButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: palette.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  playButtonActive: {
    backgroundColor: palette.primaryDark,
  },
  playButtonMuted: {
    opacity: 0.45,
  },
  mockNote: {
    marginTop: 10,
    color: palette.textMuted,
    fontSize: 12,
  },
});
