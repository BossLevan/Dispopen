import { Button, Text, View } from "react-native";

//Smart Wallet Imports
// import { handleResponse } from "@mobile-wallet-protocol/client";
import * as Linking from "expo-linking";
import { useEffect } from "react";
import { useConnect } from "wagmi";
import { useRouter } from "expo-router";

export default function Index() {
  const { connect, connectors } = useConnect();
  const router = useRouter();

  const connectWallet = () => {
    connect({ connector: connectors[0] });
  };

  // useEffect(() => {
  //   const subscription = Linking.addEventListener("url", ({ url }) => {
  //     // const handled = handleResponse(url);
  //     if (!handled) {
  //       // handle other deeplinks
  //     }
  //   });
  //   return () => subscription.remove();
  // }, []);

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>Edit app/index.tsx to edit this screen.</Text>
      <Button title="Connect Wallet" onPress={connectWallet} />
    </View>
  );
}
