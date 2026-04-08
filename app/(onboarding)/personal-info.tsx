import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { Card } from '../../src/components/Card';
import { PrimaryButton } from '../../src/components/PrimaryButton';
import { Screen } from '../../src/components/Screen';
import { useAppState } from '../../src/context/AppProvider';
import { palette } from '../../src/theme/palette';

const ageGroups = [
  { id: 'under30', label: 'Under 30' },
  { id: '30to50', label: '30-50' },
  { id: '50plus', label: '50+' },
] as const;

export default function PersonalInfoScreen() {
  const router = useRouter();
  const { updateProfile, completeOnboarding } = useAppState();
  const [mandirName, setMandirName] = useState("Maa's Mandir");
  const [ageGroup, setAgeGroup] = useState<'under30' | '30to50' | '50plus'>('30to50');
  const [location, setLocation] = useState('Delhi, India');

  function handleFinish() {
    if (!mandirName.trim()) {
      Alert.alert('Add a mandir name', 'This helps personalise the app experience.');
      return;
    }

    updateProfile({
      mandirName: mandirName.trim(),
      ageGroup,
      location: location.trim(),
    });
    completeOnboarding();
    router.replace('/(tabs)/home');
  }

  return (
    <Screen scroll footer={<PrimaryButton label="Continue" onPress={handleFinish} />}>
      <View style={styles.header}>
        <Text style={styles.title}>Set Up Your Mandir</Text>
        <Text style={styles.subtitle}>A small amount of context makes the whole home experience feel personal.</Text>
      </View>

      <Card>
        <Text style={styles.label}>Who is this for?</Text>
        <TextInput
          onChangeText={setMandirName}
          placeholder="e.g. Maa, Papa, My Mandir"
          placeholderTextColor="#9EA5BD"
          style={styles.input}
          value={mandirName}
        />
      </Card>

      <View style={{ height: 14 }} />

      <Card>
        <Text style={styles.label}>Select Age Group</Text>
        <View style={styles.ageRow}>
          {ageGroups.map((group) => {
            const selected = group.id === ageGroup;
            return (
              <Pressable
                key={group.id}
                onPress={() => setAgeGroup(group.id)}
                style={[styles.ageChip, selected && styles.ageChipSelected]}
              >
                <Text style={[styles.ageText, selected && styles.ageTextSelected]}>{group.label}</Text>
              </Pressable>
            );
          })}
        </View>
      </Card>

      <View style={{ height: 14 }} />

      <Card>
        <Text style={styles.label}>Your Location (optional)</Text>
        <TextInput
          onChangeText={setLocation}
          placeholder="Select location"
          placeholderTextColor="#9EA5BD"
          style={styles.input}
          value={location}
        />
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingTop: 24,
    paddingBottom: 22,
    gap: 8,
  },
  title: {
    color: palette.text,
    fontSize: 28,
    fontWeight: '800',
  },
  subtitle: {
    color: palette.textMuted,
    fontSize: 15,
    lineHeight: 22,
  },
  label: {
    color: palette.text,
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 12,
  },
  input: {
    borderRadius: 18,
    borderWidth: 1,
    borderColor: palette.border,
    backgroundColor: '#FBFCFF',
    paddingHorizontal: 16,
    paddingVertical: 16,
    color: palette.text,
    fontSize: 16,
  },
  ageRow: {
    flexDirection: 'row',
    gap: 10,
  },
  ageChip: {
    flex: 1,
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: 'center',
    backgroundColor: '#F7F9FF',
    borderWidth: 1,
    borderColor: palette.border,
  },
  ageChipSelected: {
    borderColor: palette.primary,
    backgroundColor: '#E8F0FF',
  },
  ageText: {
    color: palette.text,
    fontSize: 15,
    fontWeight: '700',
  },
  ageTextSelected: {
    color: palette.primary,
  },
});
