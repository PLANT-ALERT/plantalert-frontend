import {ThemeProvider, useTheme} from '@/components/ThemeProvider';
import {useFonts} from 'expo-font';
import {Stack} from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import {StatusBar} from 'expo-status-bar';
import {useEffect} from 'react';
import 'react-native-reanimated';
import {AuthProvider} from "@/components/AuthProvider";
// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider>
      <AuthProvider>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false, headerTitle: 'Go back'}} />
          <Stack.Screen name="+not-found" />
          <Stack.Screen name="auth" options={{ headerTitle: 'Authentication' }}  />
          <Stack.Screen name="flowerpage" options={{ headerTitle: '' }}  />
        </Stack>
        <StatusBar style="auto"/>
      </AuthProvider>
    </ThemeProvider>
  );
}
