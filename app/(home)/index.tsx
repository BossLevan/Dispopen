import { Text, Button, View, TextInput } from "react-native";
import { useSession } from "@/components/ctx";
import { useLinkWithSiwe, usePrivy } from "@privy-io/expo";
import { useState, useEffect } from "react";
import { useRouter } from "expo-router";
import { useConnect, useSignMessage, useDisconnect } from "wagmi";
import React from "react";
import type { Hex, SignableMessage } from "viem";

export default function HomeScreen() {
  const { signOut } = useSession();
  const { connect, connectors } = useConnect();
  const router = useRouter();
  const { user } = usePrivy();
  const { signMessage } = useSignMessage({
    mutation: {
      onSuccess: (signature) => {
        console.log("Signature:", signature);
        setSignature(signature);
        // Here you would typically send this signature to your backend
        // or use it with linkWithSiwe
      },
      onError: (error) => {
        console.error("Error Signing Message:", error);
      },
    },
  });
  const { disconnect } = useDisconnect();

  const [signature, setSignature] = useState("");
  const [linked, setLinked] = useState(false);
  const [address, setAddress] = useState("");
  const [message, setMessage] = useState<SignableMessage>();

  //difference is this is supposed to be linked with Wallet
  const [privyUser, setPrivyUser] = useState(user);

  const { generateSiweMessage, linkWithSiwe } = useLinkWithSiwe({
    onSuccess: console.log,
    onError: console.log,
    onGenerateMessage: console.log,
  });

  const handleDisconnect = () => {
    disconnect();
    setAddress("");
  };

  const handleGenerate = async () => {
    const message = await generateSiweMessage({
      from: {
        domain: "www.dispopen.com",
        uri: "https://www.dispopen.com",
      },
      wallet: {
        chainId: `8453`,
        address,
      },
    });
    console.log(message);
    setMessage(message);
  };

  const handleSign = () => {
    if (!message) {
      console.error("No message to sign");
      return;
    }

    try {
      signMessage({ account: address as Hex, message });
    } catch (error) {
      console.error("Failed to sign message:", error);
    }
  };

  const connectWallet = async () => {
    try {
      connect(
        {
          connector: connectors[0],
          chainId: 11155111, // Sepolia testnet
        },
        {
          onSuccess: (data) => {
            console.log("Connected wallet address:", data.accounts[0]);
            setAddress(data.accounts[0]);
            // You can also update your UI here if needed
          },
          onError: (error) => {
            console.error("Error connecting wallet:", error);
          },
        }
      );
    } catch (err) {
      console.error("Failed to connect wallet:", err);
    }
  };

  const link = async () => {
    const user = await linkWithSiwe({ signature });
    if (user != null) setLinked(true);
    setPrivyUser(user);
  };

  if (linked) {
    return (
      <View
        style={{ flex: 1, justifyContent: "center", alignContent: "center" }}
      >
        <Text>Logged In</Text>
        <Text>{JSON.stringify(privyUser, null, 2)}</Text>
      </View>
    );
  }

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <TextInput
        value={address}
        onChangeText={setAddress}
        placeholder="0x..."
        inputMode="text"
      />
      <Text>Logout from this mf app.</Text>
      <Button title="Generate Message" onPress={handleGenerate} />
      <Button title="Disconnect" onPress={handleDisconnect} />

      {Boolean(message) && <Text>{message as string}</Text>}
      <Button title="Logout" onPress={signOut} />
      {Boolean(message) && <Button title="Sign Message" onPress={handleSign} />}
      <Button title="Connect Wallet" onPress={connectWallet} />
      <Button title="Link Wallet with Privy" onPress={link} />
      <Button
        title="Go to Zora Screen"
        onPress={() => router.push("/(home)/zora")}
      />
    </View>
  );
}
