import { Stack } from 'expo-router';
import 'react-native-gesture-handler';
import { DrawerProvider } from '../contexts/DrawerContext';
import { ThemeProvider } from '../contexts/ThemeContext';

export default function RootLayout() {
  return (
    <ThemeProvider>
      <DrawerProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" />
        </Stack>
      </DrawerProvider>
    </ThemeProvider>
  );
}
