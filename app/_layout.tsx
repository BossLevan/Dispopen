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
import { handleResponse } from "@mobile-wallet-protocol/client";
import * as Linking from "expo-linking";

const queryClient = new QueryClient();

function RootLayoutNav() {
  useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
  });
  // Define the possible segment types.
  // TODO: Need to refactor this
  // type Segment = "" | "_sitemap" | "mobile-wallet-protocol" | "(auth)" | string;

  const { session, isLoading } = useSession();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    const subscription = Linking.addEventListener("url", ({ url }) => {
      console.log("incoming deeplink:", url);
      try {
        handleResponse(url);
        router.back(); //Need this to work with expo router
      } catch (err) {
        console.error(err);
      }
    });

    return () => subscription.remove();
  }, []);
  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === "(auth)";

    if (!session && !inAuthGroup) {
      console.log("Not authenticated, redirecting to login");
      router.replace("/(auth)/login");
    } else if (session && inAuthGroup) {
      console.log("Authenticated, redirecting to home");
      router.replace("/(home)");
    }
  }, [session, segments, isLoading]);

  return (
    <Stack
      screenOptions={{
        contentStyle: { backgroundColor: "white" },
      }}
    >
      <Stack.Screen
        name="(home)/index"
        options={{ headerShown: false }} //Feel free to control the animation here
      />
      <Stack.Screen
        name="(auth)/login"
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <>
      <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
          <PrivyProvider
            appId="cm22h0e5o00w23s57v1nnm0ww"
            clientId="client-WY5cXUpgShbmeWe8YYTGi2xzgQ2915JowmbkvJpaUceF3"
          >
            <SessionProvider>
              <RootLayoutNav />
              <PrivyElements />
            </SessionProvider>
          </PrivyProvider>
        </QueryClientProvider>
      </WagmiProvider>
    </>
  );
}
