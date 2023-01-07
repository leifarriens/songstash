import { useCallback, useState } from 'react';
import { httpBatchLink } from '@trpc/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { LinearGradient } from 'expo-linear-gradient';
import Constants from 'expo-constants';
import { trpc } from './utils/trpc';
import { Discover } from './modules/Discover';
import { View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import {
  useFonts,
  Inter_400Regular,
  Inter_700Bold,
} from '@expo-google-fonts/inter';

const API_URL = Constants.expoConfig?.extra?.API_URL;

function App() {
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_700Bold,
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            retry: false,
          },
        },
      }),
  );

  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        httpBatchLink({
          url: `${API_URL}/api/trpc`,
        }),
      ],
    }),
  );

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        {fontsLoaded && (
          <View className="flex-1 bg-black" onLayout={onLayoutRootView}>
            <StatusBar style="light" />

            <Discover />

            <LinearGradient
              colors={['transparent', 'rgb(0,0,0)']}
              className="absolute w-full bottom-0 h-16 z-30"
            />
          </View>
        )}
      </QueryClientProvider>
    </trpc.Provider>
  );
}

export default App;
