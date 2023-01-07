import { useState } from 'react';
import { httpBatchLink } from '@trpc/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Constants from 'expo-constants';
import { trpc } from './utils/trpc';
import { Discover } from './modules/Discover';
import { View } from 'react-native';
import { StatusBar } from 'expo-status-bar';

const API_URL = Constants.expoConfig?.extra?.API_URL;

function App() {
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
        <View className="flex-1 bg-black">
          <StatusBar style="light" />
          <Discover />
        </View>
      </QueryClientProvider>
    </trpc.Provider>
  );
}

export default App;
