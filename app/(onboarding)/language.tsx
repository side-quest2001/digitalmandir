import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Card } from '../../src/components/Card';
import { PrimaryButton } from '../../src/components/PrimaryButton';
import { Screen } from '../../src/components/Screen';
import { useAppState } from '../../src/context/AppProvider';
import { palette } from '../../src/theme/palette';

const options = [
  { id: 'hi', label: 'हिन्दी', subtitle: 'Hindi-first devotional labels' },
  { id: 'en', label: 'English', subtitle: 'English-first devotional labels' },
] as const;

export default function LanguageScreen() {
  const router = useRouter();
  const { state, updateLanguage } = useAppState();

  return (
    <Screen footer={<PrimaryButton label="Finish Setup" onPress={() => router.push('/(onboarding)/personal-info')} />}>
      <View style={styles.header}>
        <Text style={styles.title}>Select Language</Text>
        <Text style={styles.subtitle}>
          This POC saves your language preference visually and reflects it in Settings.
        </Text>
      </View>

      {options.map((option) => {
        const selected = option.id === state.onboarding.language;
        return (
          <Pressable key={option.id} onPress={() => updateLanguage(option.id)} style={styles.optionPressable}>
            <Card>
              <View style={styles.optionRow}>
                <View>
                  <Text style={styles.optionLabel}>{option.label}</Text>
                  <Text style={styles.optionSubtitle}>{option.subtitle}</Text>
                </View>
                <View style={[styles.radio, selected && styles.radioSelected]} />
              </View>
            </Card>
          </Pressable>
        );
      })}
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingTop: 24,
    paddingBottom: 24,
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
  optionPressable: {
    marginBottom: 14,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  optionLabel: {
    color: palette.text,
    fontSize: 24,
    fontWeight: '700',
  },
  optionSubtitle: {
    marginTop: 6,
    color: palette.textMuted,
    fontSize: 14,
  },
  radio: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: palette.border,
    backgroundColor: '#FFFFFF',
  },
  radioSelected: {
    borderColor: palette.primary,
    backgroundColor: palette.primary,
  },
});
