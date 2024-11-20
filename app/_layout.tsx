import "../polyfills";

import { config } from "@/wallet-config";
import { WagmiProvider } from "wagmi";
import { Stack, Slot, useSegments, useRouter, SplashScreen } from "expo-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { PrivyProvider } from "@privy-io/expo";
import { useFonts } from "expo-font";
import { PrivyElements } from "@privy-io/expo";
import { SessionProvider, useSession } from "../components/ctx";
import { useEffect, useState } from "react";
import React from "react";
import { handleResponse } from "@mobile-wallet-protocol/client";
import * as Linking from "expo-linking";
import { Text } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

const queryClient = new QueryClient();
// SplashScreen.preventAutoHideAsync();

function RootLayoutNav() {
  // useFonts({
  //   Inter_400Regular,
  //   Inter_500Medium,
  //   Inter_600SemiBold,
  // });

  const [loaded, error] = useFonts({
    "CabinetGrotesk-Black": require("@/assets/fonts/CabinetGrotesk-Black.otf"),
    "CabinetGrotesk-Bold": require("@/assets/fonts/CabinetGrotesk-Bold.otf"),
    "CabinetGrotesk-Extrabold": require("@/assets/fonts/CabinetGrotesk-Extrabold.otf"),
    "CabinetGrotesk-Medium": require("@/assets/fonts/CabinetGrotesk-Medium.otf"),
    "CabinetGrotesk-Regular": require("@/assets/fonts/CabinetGrotesk-Regular.otf"),
  });

  const { session, isLoading } = useSession();
  const segments = useSegments();
  const router = useRouter();
  const [visitedDisplayName, setVisitedDisplayName] = useState(false);

  useEffect(() => {
    const subscription = Linking.addEventListener("url", ({ url }) => {
      console.log("incoming deeplink:", url);
      try {
        handleResponse(url);
        // router.back(); // Need this to work with expo router
      } catch (err) {
        console.error(err);
      }
    });

    return () => subscription.remove();
  }, []);

  useEffect(() => {
    // if (isLoading) return;
    console.log(isLoading);
    const inAuthGroup = segments[0] === "(auth)";
    const inDisplayName = segments[1] === "display_name";
    // router.replace("/(home)");
    if (session) {
      router.replace("/(auth)/(home)");
    } else {
      console.log("Not authenticated, redirecting to login");
      router.replace("/login");
    }
    // else if (session && inAuthGroup && !visitedDisplayName) {
    //   console.log("Authenticated, redirecting to display name");
    //   router.replace("/(auth)/display_name");
    //   setVisitedDisplayName(true);
    // } else if (session && !inDisplayName) {
    //   console.log("Authenticated, redirecting to home");
    //   router.replace("/(home)");
    // }

    // if (!session && !inAuthGroup) {
    //   console.log("Not authenticated, redirecting to login");
    //   router.replace("/(auth)/login");
    //   setVisitedDisplayName(false);
    // } else if (session && !inDisplayName && !visitedDisplayName) {
    //   console.log("Redirecting to /display-name for the first time");
    //   router.replace("/(auth)/display_name");
    //   setVisitedDisplayName(true);
    // } else if (session && visitedDisplayName && !inDisplayName) {
    //   console.log("Redirecting to home screen after visiting /display-name");
    //   router.replace("/(home)");
    // }
  }, [session]);

  if (loaded) {
    return <Slot />; // You could return a loading spinner here if needed
  }

  return (
    <Stack
      screenOptions={{
        contentStyle: { backgroundColor: "white" },
      }}
    >
      <Stack.Screen
        name="login"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="(auth)"
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <PrivyProvider
          appId="cm22h0e5o00w23s57v1nnm0ww"
          clientId="client-WY5cXUpgShbmeWe8YYTGi2xzgQ2915JowmbkvJpaUceF3"
        >
          <SessionProvider>
            <GestureHandlerRootView>
              <RootLayoutNav />
            </GestureHandlerRootView>
            <PrivyElements />
          </SessionProvider>
        </PrivyProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
