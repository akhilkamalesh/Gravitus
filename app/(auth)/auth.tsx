import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Platform,
  KeyboardAvoidingView,
  ScrollView
} from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '@/lib/authContext';
import BrandHeader from '@/components/BrandHeader';
import TextInputField from '@/components/ui/TextInputField';
import PrimaryButton from '@/components/ui/PrimaryButton';
import FormFieldStack from '@/components/ui/FormFieldStack';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { signInWithEmail } = useAuth();

  const handleLogin = async () => {
    if (!email || !password) return;

    setLoading(true);
    try {
      await signInWithEmail(email, password);
      Alert.alert('Success', 'Signed in successfully');
      router.replace('/');
    } catch (error: any) {
      console.error(error);
      Alert.alert('Login Failed', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.screen}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <BrandHeader />

        <View style={styles.formSection}>
          <FormFieldStack>
            <TextInputField
              label="Email"
              value={email}
              onChangeText={setEmail}
            />

            <TextInputField
              label="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </FormFieldStack>

          <View style={styles.actions}>
            <PrimaryButton
              label="Log In"
              onPress={handleLogin}
              loading={loading}
              disabled={!email || !password}
            />

            <TouchableOpacity onPress={() => router.push('/(onboarding)/welcomeScreen')}>
              <Text style={styles.signupText}>
                New here? <Text style={styles.signupLink}>Create an account</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#000',
  },
  container: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 60,
  },
  formSection: {
    marginTop: 48,
    gap: 32,
  },
  actions: {
    gap: 24,
    marginTop: 16,
  },
  signupText: {
    color: '#666',
    fontSize: 14,
    textAlign: 'center',
  },
  signupLink: {
    color: '#FFF',
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
});
