// app/_layout.tsx
import { Stack, SplashScreen } from 'expo-router'
import { useEffect } from 'react'
import { useFonts } from 'expo-font'

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    'inter-Regular': require('../assets/fonts/inter/Inter-Regular.ttf'),
    'inter-Medium': require('../assets/fonts/inter/Inter-Medium.ttf'),
    'inter-SemiBold': require('../assets/fonts/inter/Inter-SemiBold.ttf'),
    'inter-Bold': require('../assets/fonts/inter/Inter-Bold.ttf'),
    'inter-ExtraBold': require('../assets/fonts/inter/Inter-ExtraBold.ttf'),
    'oswald-Regular': require('../assets/fonts/oswald/Oswald-Regular.ttf'),
    'oswald-Medium': require('../assets/fonts/oswald/Oswald-Medium.ttf'),
    'oswald-SemiBold': require('../assets/fonts/oswald/Oswald-SemiBold.ttf'),
    'oswald-Bold': require('../assets/fonts/oswald/Oswald-Bold.ttf'),
    // Add more fonts if you need
  })

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync()
    }
  }, [fontsLoaded])

  if (!fontsLoaded) {
    return null
  }

  return <Stack screenOptions={{ headerShown: false }}/>
}
