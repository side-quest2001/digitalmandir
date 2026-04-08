import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, View } from 'react-native';

import { Card } from '../../src/components/Card';
import { PrimaryButton } from '../../src/components/PrimaryButton';
import { Screen } from '../../src/components/Screen';
import { useAppState } from '../../src/context/AppProvider';
import { palette } from '../../src/theme/palette';

export default function OtpScreen() {
  const router = useRouter();
  const { state, verifyOtp } = useAppState();
  const [otp, setOtp] = useState(state.auth.otpCode);
  const [loading, setLoading] = useState(false);

  async function handleVerify() {
    setLoading(true);
    const ok = await verifyOtp(otp);
    setLoading(false);

    if (!ok) {
      Alert.alert('Incorrect OTP', 'Use the demo code shown below.');
      return;
    }

    router.replace('/(onboarding)/deity');
  }

  return (
    <Screen footer={<PrimaryButton label="Verify OTP" loading={loading} onPress={handleVerify} />}>
      <View style={styles.header}>
        <Text style={styles.eyebrow}>Secure sign in</Text>
        <Text style={styles.title}>Verify Your Number</Text>
        <Text style={styles.subtitle}>
          We have prefilled the mock OTP so the POC runs cleanly on first go.
        </Text>
      </View>

      <Card>
        <Text style={styles.demoLabel}>Demo OTP</Text>
        <Text style={styles.demoOtp}>{state.auth.otpCode}</Text>
        <TextInput
          keyboardType="number-pad"
          maxLength={6}
          onChangeText={setOtp}
          placeholder="Enter 6-digit OTP"
          placeholderTextColor="#9EA5BD"
          style={styles.input}
          value={otp}
        />
        <Text style={styles.helper}>Number: +91 {state.auth.pendingPhoneNumber}</Text>
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingTop: 36,
    paddingBottom: 26,
    gap: 8,
  },
  eyebrow: {
    fontSize: 14,
    fontWeight: '700',
    color: palette.primary,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  title: {
    fontSize: 30,
    fontWeight: '800',
    color: palette.text,
  },
  subtitle: {
    color: palette.textMuted,
    fontSize: 15,
    lineHeight: 22,
  },
  demoLabel: {
    color: palette.textMuted,
    fontSize: 14,
  },
  demoOtp: {
    marginTop: 8,
    marginBottom: 20,
    fontSize: 36,
    fontWeight: '800',
    color: palette.text,
    letterSpacing: 8,
  },
  input: {
    borderRadius: 18,
    borderWidth: 1,
    borderColor: palette.border,
    backgroundColor: '#FBFCFF',
    paddingHorizontal: 16,
    paddingVertical: 16,
    color: palette.text,
    fontSize: 18,
    letterSpacing: 5,
  },
  helper: {
    marginTop: 14,
    color: palette.textMuted,
    fontSize: 13,
  },
});
