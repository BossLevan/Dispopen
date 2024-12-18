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
import * as Storage from "@/utils/storage_visit_name";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import LoadingSkeleton from "@/components/loadingSkeleton";
import { useNavigationLogic } from "@/hooks/useNavigation";

const queryClient = new QueryClient();
// SplashScreen.preventAutoHideAsync();

function RootLayoutNav() {
  const [loaded] = useFonts({
    "CabinetGrotesk-Black": require("@/assets/fonts/CabinetGrotesk-Black.otf"),
    "CabinetGrotesk-Bold": require("@/assets/fonts/CabinetGrotesk-Bold.otf"),
    "CabinetGrotesk-Extrabold": require("@/assets/fonts/CabinetGrotesk-Extrabold.otf"),
    "CabinetGrotesk-Medium": require("@/assets/fonts/CabinetGrotesk-Medium.otf"),
    "CabinetGrotesk-Regular": require("@/assets/fonts/CabinetGrotesk-Regular.otf"),
  });

  const { session, isLoading, signInPrivy, isPrivyLoading } = useSession();
  const segments = useSegments();
  const router = useRouter();
  const [hasVisitedDisplayName, setHasVisitedDisplayName] = useState<
    boolean | null
  >(false);

  useEffect(() => {
    const subscription = Linking.addEventListener("url", ({ url }) => {
      console.log("Incoming deeplink:", url);
      try {
        handleResponse(url);
        router.back();
      } catch (err) {
        console.error(err);
      }
    });

    return () => subscription.remove();
  }, []);

  useEffect(() => {
    // const checkDisplayNameVisit = async () => {
    //   const visited = await Storage.Storage.getItem("hasVisitedDisplayName");
    //   setHasVisitedDisplayName(visited === "true");
    //   console.log("dn", hasVisitedDisplayName);
    // };
    // checkDisplayNameVisit();
  }, []);

  // Use the new hook
  useNavigationLogic(session, isLoading, signInPrivy, isPrivyLoading);

  if (isPrivyLoading || !loaded) {
    return <LoadingSkeleton />; // Ensure a loading state is shown until navigation is ready
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
