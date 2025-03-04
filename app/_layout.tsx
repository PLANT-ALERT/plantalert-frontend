import { ThemeProvider, useTheme } from '@/components/ThemeProvider';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { AuthProvider } from "@/components/AuthProvider";
import registerNNPushToken from 'native-notify';
import { NOTIFICATION_ID_FIRST, NOTIFICATION_ID_SECOND } from "@/utils/enviroment";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  registerNNPushToken(NOTIFICATION_ID_FIRST, NOTIFICATION_ID_SECOND);

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
          <ThemedApp />
        </AuthProvider>
      </ThemeProvider>
  );
}

// New component to access theme
function ThemedApp() {
  const { theme } = useTheme();

  return (
      <>
        <Stack>
          <Stack.Screen
              name="(tabs)"
              options={{ headerShown: false, headerTitle: 'Go back' }}
          />
          <Stack.Screen name="+not-found" />
          <Stack.Screen name="auth" options={{ headerTitle: 'Authentication' }} />
          <Stack.Screen name="flowerpage" options={{ headerTitle: 'Flower information', headerStyle: {backgroundColor: theme.background}, headerTitleStyle: {color: theme.text}, headerTintColor: theme.tint }} />
          <Stack.Screen name="flowertemplate" options={{ headerTitle: 'Select your flower template', headerStyle: {backgroundColor: theme.background}, headerTitleStyle: {color: theme.text}, headerTintColor: theme.tint }} />
        </Stack>
      </>
  );
}
