import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, View } from 'react-native';

import { Card } from '../../src/components/Card';
import { PrimaryButton } from '../../src/components/PrimaryButton';
import { Screen } from '../../src/components/Screen';
import { useAppState } from '../../src/context/AppProvider';
import { palette } from '../../src/theme/palette';

export default function LoginScreen() {
  const router = useRouter();
  const { sendOtp } = useAppState();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleContinue() {
    setLoading(true);
    const ok = await sendOtp(phoneNumber.replace(/\D/g, ''));
    setLoading(false);

    if (!ok) {
      Alert.alert('Enter a valid number', 'Please use a 10-digit mobile number.');
      return;
    }

    router.push('/(auth)/otp');
  }

  return (
    <Screen
      footer={
        <PrimaryButton label="Send OTP" loading={loading} onPress={handleContinue} />
      }
    >
      <View style={styles.logoWrap}>
        <View style={styles.logoCircle}>
          <Ionicons color={palette.primary} name="home" size={30} />
        </View>
        <Text style={styles.brand}>Digital Mandir</Text>
        <Text style={styles.title}>Enter Mobile Number</Text>
        <Text style={styles.subtitle}>
          Mocked OTP flow for Expo Go. Use any 10-digit number.
        </Text>
      </View>

      <Card>
        <View style={styles.inputWrap}>
          <View style={styles.countryCode}>
            <Text style={styles.countryCodeText}>+91</Text>
          </View>
          <TextInput
            keyboardType="number-pad"
            maxLength={10}
            onChangeText={setPhoneNumber}
            placeholder="Enter Phone Number"
            placeholderTextColor="#9EA5BD"
            style={styles.input}
            value={phoneNumber}
          />
        </View>
        <Text style={styles.helper}>A demo OTP will be shown on the next screen.</Text>
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  logoWrap: {
    alignItems: 'center',
    paddingTop: 42,
    paddingBottom: 28,
    gap: 10,
  },
  logoCircle: {
    width: 80,
    height: 80,
    borderRadius: 26,
    backgroundColor: '#EAF0FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  brand: {
    fontSize: 30,
    fontWeight: '800',
    color: palette.text,
  },
  title: {
    marginTop: 18,
    fontSize: 26,
    fontWeight: '800',
    color: palette.text,
  },
  subtitle: {
    color: palette.textMuted,
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 18,
  },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: palette.border,
    backgroundColor: '#FBFCFF',
    overflow: 'hidden',
  },
  countryCode: {
    paddingHorizontal: 14,
    paddingVertical: 16,
    borderRightWidth: 1,
    borderRightColor: palette.border,
  },
  countryCodeText: {
    fontSize: 18,
    fontWeight: '700',
    color: palette.text,
  },
  input: {
    flex: 1,
    paddingHorizontal: 14,
    paddingVertical: 16,
    fontSize: 17,
    color: palette.text,
  },
  helper: {
    marginTop: 14,
    textAlign: 'center',
    color: palette.textMuted,
    fontSize: 13,
  },
});
