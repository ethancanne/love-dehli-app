import { Redirect, SplashScreen, Stack } from 'expo-router';
import './global.css';
import { useFonts } from 'expo-font';
import { useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { DevToolsBubble } from 'react-native-react-query-devtools';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { useUIStore } from '@/lib/state/ui-state';
import EditContainer from '@/components/edit-container.component';

export const queryClientContext = new QueryClient();

export default function RootLayout() {
  const [loaded] = useFonts({
    SFPro: require('../assets/fonts/SF-Pro-Display-Medium.otf'),
    SFProBold: require('../assets/fonts/SF-Pro-Display-Bold.otf'),
    SFProLight: require('../assets/fonts/SF-Pro-Display-Light.otf'),
    SFProHeavy: require('../assets/fonts/SF-Pro-Display-Heavy.otf'),
    SFProBlack: require('../assets/fonts/SF-Pro-Display-Black.otf'),
    SFProSemiBold: require('../assets/fonts/SF-Pro-Display-Semibold.otf'),
    SFProRegular: require('../assets/fonts/SF-Pro-Display-Regular.otf'),
    SFProThin: require('../assets/fonts/SF-Pro-Display-Thin.otf'),
    SFProUltraLight: require('../assets/fonts/SF-Pro-Display-UltraLight.otf'),
    SFProMedium: require('../assets/fonts/SF-Pro-Display-Medium.otf'),
    Impact: require('../assets/fonts/Impact.ttf'),
    SignPainter: require('../assets/fonts/SignPainterHouseScript.ttf'),
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
    <QueryClientProvider client={queryClientContext}>
      <StatusBar style="light" />
      <LinearGradient
        colors={['rgba(123,0,0,1)', 'rgba(0,0,0,1)']}
        locations={[0, 0.1]} // Sharp transition at 7%
        start={{ x: 1.2, y: 0.04 }} // Approximation for 219deg
        end={{ x: 0.25, y: 1.15 }} // Approximation for 219deg
        style={{ flex: 1 }}
      >
        <Stack
          screenOptions={{
            headerShown: false,
            statusBarBackgroundColor: 'white',
            animation: 'none',
            contentStyle: { backgroundColor: 'transparent' },
          }}
        />{' '}
      </LinearGradient>

      <DevToolsBubble />
    </QueryClientProvider>
  );
}
