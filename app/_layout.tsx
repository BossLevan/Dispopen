import "../polyfills";

import { config } from "@/wallet-config";
import { WagmiProvider } from "wagmi";
import { Stack, Slot, useSegments, useRouter } from "expo-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Import the PrivyProvider
import { PrivyProvider } from "@privy-io/expo";
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
} from "@expo-google-fonts/inter";
import { useFonts } from "expo-font";
import { PrivyElements } from "@privy-io/expo";
import { SessionProvider, useSession } from "../components/ctx";
import { useEffect } from "react";
import React from "react";

const queryClient = new QueryClient();

function RootLayoutNav() {
  // Define the possible segment types.
  // TODO: Need to refactor this
  // type Segment = "" | "_sitemap" | "mobile-wallet-protocol" | "(auth)" | string;

  const { session, isLoading } = useSession();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    // You can keep the splash screen open, or render a loading screen like we do here.
    // if (isLoading) {
    //   return <Text>Loading...</Text>;
    // }

    const inAuthGroup = segments[0] === "(auth)";

    if (!inAuthGroup) {
      // Redirect to the sign-in page.
      router.replace("/(auth)/login");
    } else if (session && inAuthGroup) {
      // Redirect away from the sign-in page.
      router.replace("/home");
    }
  }, [session, segments, isLoading]);

  return <Slot />;
}

export default function RootLayout() {
  useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
  });

  return (
    <>
      <SessionProvider>
        <WagmiProvider config={config}>
          <QueryClientProvider client={queryClient}>
            <PrivyProvider
              appId="cm22h0e5o00w23s57v1nnm0ww"
              clientId="client-WY5cXUpgShbmeWe8YYTGi2xzgQ2915JowmbkvJpaUceF3"
            >
              <RootLayoutNav />
              <PrivyElements />
            </PrivyProvider>
          </QueryClientProvider>
        </WagmiProvider>
      </SessionProvider>
    </>
  );
}
