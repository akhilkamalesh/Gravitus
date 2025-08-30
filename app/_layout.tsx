import { Stack, usePathname, Redirect } from 'expo-router';
import { ThemeProvider } from '@react-navigation/native';
import { DarkTheme, DefaultTheme } from '@react-navigation/native';
import { useColorScheme } from '@/components/useColorScheme';
import { AuthProvider, useAuth } from '@/lib/authContext';
import { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';

SplashScreen.preventAutoHideAsync();

export const unstable_settings = {
  initialRouteName: '(auth)/auth', // safe default
};

export default function RootLayout() {
  return (
    <AuthProvider>
      <AuthGate />
    </AuthProvider>
  );
}

function AuthGate() {
  const { user, loading } = useAuth();
  const colorScheme = useColorScheme();

  const [ready, setReady] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setReady(true), 100); // small debounce
    return () => clearTimeout(timer);
  }, [user]);

  useEffect(() => {
    if (!loading && ready) SplashScreen.hideAsync();
  }, [loading, ready]);

  if (loading || !ready) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack screenOptions={{ headerShown: false }}>
        {user ? (
          <Stack.Screen name="(tabs)" options={{ gestureEnabled: false }}/>
        ) : (
          <Stack.Screen name="(auth)/auth" options={{ gestureEnabled: false }}/>
        )}
      </Stack>
    </ThemeProvider>
  );
}
