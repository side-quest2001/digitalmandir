import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Card } from '../../src/components/Card';
import { PrimaryButton } from '../../src/components/PrimaryButton';
import { Screen } from '../../src/components/Screen';
import { useAppState } from '../../src/context/AppProvider';
import { deities } from '../../src/data/content';
import { palette } from '../../src/theme/palette';

export default function DeityScreen() {
  const router = useRouter();
  const { state, updateDeity } = useAppState();

  return (
    <Screen footer={<PrimaryButton label="Continue" onPress={() => router.push('/(onboarding)/aarti-time')} />}>
      <View style={styles.header}>
        <Text style={styles.brand}>Digital Mandir</Text>
        <Text style={styles.title}>Choose Your Deity</Text>
        <Text style={styles.subtitle}>Select the devotional mood that should guide the home screen.</Text>
      </View>

      <View style={styles.grid}>
        {deities.map((deity) => {
          const selected = deity.id === state.onboarding.selectedDeityId;
          return (
            <Pressable key={deity.id} onPress={() => updateDeity(deity.id)} style={styles.gridItem}>
              <Card>
                <View
                  style={[
                    styles.deityOrb,
                    {
                      backgroundColor: deity.glow,
                      borderColor: selected ? deity.accent : 'transparent',
                    },
                  ]}
                >
                  <Text style={[styles.deitySymbol, { color: deity.accent }]}>{deity.symbol}</Text>
                </View>
                <Text style={styles.deityName}>{deity.name}</Text>
                <Text style={styles.deityText}>{deity.description}</Text>
                {selected ? (
                  <View style={[styles.selectedBadge, { backgroundColor: deity.accent }]}>
                    <Text style={styles.selectedText}>Selected</Text>
                  </View>
                ) : null}
              </Card>
            </Pressable>
          );
        })}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
    gap: 8,
    paddingTop: 24,
    paddingBottom: 26,
  },
  brand: {
    fontSize: 28,
    fontWeight: '800',
    color: palette.text,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: palette.text,
  },
  subtitle: {
    color: palette.textMuted,
    textAlign: 'center',
    fontSize: 15,
    lineHeight: 22,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 14,
  },
  gridItem: {
    width: '48%',
  },
  deityOrb: {
    width: 76,
    height: 76,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
  },
  deitySymbol: {
    fontSize: 28,
    fontWeight: '800',
  },
  deityName: {
    marginTop: 14,
    color: palette.text,
    fontSize: 18,
    fontWeight: '800',
  },
  deityText: {
    marginTop: 6,
    color: palette.textMuted,
    fontSize: 13,
    lineHeight: 19,
    minHeight: 56,
  },
  selectedBadge: {
    alignSelf: 'flex-start',
    marginTop: 12,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
  },
  selectedText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 12,
  },
});
