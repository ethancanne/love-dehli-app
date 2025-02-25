import { SplashScreen, Stack } from 'expo-router';
import './global.css';
import { useFonts } from 'expo-font';
import { useEffect } from 'react';

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
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }
  return <Stack screenOptions={{ headerShown: false }} />;
}
