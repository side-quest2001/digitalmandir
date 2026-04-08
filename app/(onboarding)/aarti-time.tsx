import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Card } from '../../src/components/Card';
import { PrimaryButton } from '../../src/components/PrimaryButton';
import { Screen } from '../../src/components/Screen';
import { useAppState } from '../../src/context/AppProvider';
import { formatTimeLabel } from '../../src/utils/time';
import { palette } from '../../src/theme/palette';

const morningOptions = ['05:30', '06:00', '06:30', '07:00', '07:30'];
const eveningOptions = ['18:00', '18:30', '19:00', '19:30', '20:00'];

export default function AartiTimeScreen() {
  const router = useRouter();
  const { state, updateAartiTime } = useAppState();

  return (
    <Screen footer={<PrimaryButton label="Continue" onPress={() => router.push('/(onboarding)/language')} />}>
      <View style={styles.header}>
        <Text style={styles.title}>Set Aarti Time</Text>
        <Text style={styles.subtitle}>Choose prayer times you want the app to revolve around.</Text>
      </View>

      <Card>
        <Text style={styles.cardTitle}>Morning Aarti</Text>
        <View style={styles.optionRow}>
          {morningOptions.map((option) => {
            const selected = option === state.onboarding.aartiSchedule.morning;
            return (
              <Pressable
                key={option}
                onPress={() => updateAartiTime('morning', option)}
                style={[styles.timeChip, selected && styles.timeChipSelected]}
              >
                <Text style={[styles.timeText, selected && styles.timeTextSelected]}>
                  {formatTimeLabel(option)}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </Card>

      <View style={{ height: 14 }} />

      <Card>
        <Text style={styles.cardTitle}>Evening Aarti</Text>
        <View style={styles.optionRow}>
          {eveningOptions.map((option) => {
            const selected = option === state.onboarding.aartiSchedule.evening;
            return (
              <Pressable
                key={option}
                onPress={() => updateAartiTime('evening', option)}
                style={[styles.timeChip, selected && styles.timeChipSelected]}
              >
                <Text style={[styles.timeText, selected && styles.timeTextSelected]}>
                  {formatTimeLabel(option)}
                </Text>
              </Pressable>
            );
          })}
        </View>
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
    fontSize: 28,
    fontWeight: '800',
    color: palette.text,
  },
  subtitle: {
    fontSize: 15,
    color: palette.textMuted,
    lineHeight: 22,
  },
  cardTitle: {
    fontSize: 19,
    fontWeight: '800',
    color: palette.text,
    marginBottom: 14,
  },
  optionRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  timeChip: {
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 16,
    backgroundColor: '#F7F9FF',
    borderWidth: 1,
    borderColor: palette.border,
  },
  timeChipSelected: {
    backgroundColor: palette.primary,
    borderColor: palette.primary,
  },
  timeText: {
    color: palette.text,
    fontSize: 14,
    fontWeight: '700',
  },
  timeTextSelected: {
    color: '#FFFFFF',
  },
});
