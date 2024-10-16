import { Stack } from "expo-router";

// Import the PrivyProvider
import { PrivyProvider } from "@privy-io/expo";

export default function RootLayout() {
  return (
    <PrivyProvider
      appId="cm22h0e5o00w23s57v1nnm0ww"
      clientId="client-WY5cXUpgShbmeWe8YYTGi2xzgQ2915JowmbkvJpaUceF3"
    >
      <Stack>
        <Stack.Screen name="index" />
      </Stack>
    </PrivyProvider>
  );
}
