import { Stack } from "expo-router";
import { AppProvider } from "./context/AppContext";
import { colors } from "./constants/colors";

// Polyfill fetch to prevent Supabase from trying to import @supabase/node-fetch
if (typeof globalThis.fetch === 'undefined') {
  // @ts-ignore
  globalThis.fetch = fetch;
}

export default function RootLayout() {
  return (
    <AppProvider>
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: colors.primary,
          },
          headerTintColor: '#FFFFFF',
          headerTitleStyle: {
            fontWeight: '600',
            fontSize: 18,
          },
          contentStyle: {
            backgroundColor: colors.background,
          },
          headerBackTitle: 'पछाडि',
        }}
      >
        <Stack.Screen 
          name="index" 
          options={{ 
            title: 'Autism Saathi',
            headerShown: false,
          }} 
        />
        <Stack.Screen 
          name="autism-info" 
          options={{ 
            title: 'अटिजम के हो?',
          }} 
        />
        <Stack.Screen 
          name="signs" 
          options={{ 
            title: 'लक्षणहरू',
          }} 
        />
        <Stack.Screen 
          name="speech-therapy" 
          options={{ 
            title: 'स्पिच थेरापी',
          }} 
        />
        <Stack.Screen 
          name="video-practice" 
          options={{ 
            title: 'भिडियो अभ्यास',
          }} 
        />
        <Stack.Screen 
          name="parent-guide" 
          options={{ 
            title: 'अभिभावकका लागि',
          }} 
        />
        <Stack.Screen 
          name="daily-practice" 
          options={{ 
            title: 'दैनिक अभ्यास',
          }} 
        />
        <Stack.Screen 
          name="settings" 
          options={{ 
            title: 'सेटिङ्स',
          }} 
        />
        <Stack.Screen 
          name="speech-module" 
          options={{ 
            title: 'अभ्यास',
          }} 
        />
        <Stack.Screen 
          name="resources" 
          options={{ 
            title: 'थप स्रोतहरू',
          }} 
        />
      </Stack>
    </AppProvider>
  );
}
