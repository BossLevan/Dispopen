import { useState, useCallback } from "react";
import { useLinkWithSiwe, usePrivy } from "@privy-io/expo";
import { useConnect, useSignMessage, useDisconnect } from "wagmi";
import type { Hex, SignableMessage } from "viem";
import { baseSepolia } from "viem/chains";

type WalletHook = {
  connectWallet: () => Promise<void>;
  handleGenerateMessage: () => Promise<void>;
  handleSignMessage: () => void;
  handleDisconnect: () => void;
  linkWallet: () => Promise<void>;
  address: string;
  message: SignableMessage | null;
  linked: boolean;
  privyUser: unknown;
};

export const useWallet = (): WalletHook => {
  const [address, setAddress] = useState("");
  const [message, setMessage] = useState<SignableMessage | null>(null);
  const [linked, setLinked] = useState(false);
  const [signature, setSignature] = useState("");
  const [privyUser, setPrivyUser] = useState<unknown | null>(null);

  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();
  const { signMessage } = useSignMessage({
    mutation: {
      onSuccess: (signature) => {
        console.log("Signature:", signature);
        setSignature(signature);
        // Here, you would send the signature to your backend or use it with linkWithSiwe
      },
      onError: (error) => console.error("Error Signing Message:", error),
    },
  });
  const { generateSiweMessage, linkWithSiwe } = useLinkWithSiwe({
    onSuccess: console.log,
    onError: console.error,
  });

  const { user } = usePrivy();

  const connectWallet = useCallback(async () => {

      connect({
        connector: connectors[0],
        chainId: baseSepolia.id, // Sepolia testnet
      }, {onSuccess: (data) => {
        console.log("Connected wallet address:", data.accounts[0]);
        setAddress(data.accounts[0]);
        
      },
      onError: (error) => {
        console.error("Error connecting wallet:", error);
      }, });
  }, [connect, connectors]);

  const handleDisconnect = useCallback(() => {
    disconnect();
    setAddress("");
  }, [disconnect]);

  const handleGenerateMessage = useCallback(async () => {
    if (!address) {
      console.error("Wallet address is required to generate a message");
      return;
    }
    const msg = await generateSiweMessage({
      from: {
        domain: "www.dispopen.com",
        uri: "https://www.dispopen.com",
      },
      wallet: {
        chainId: `${baseSepolia.id}`, // Change this to your desired chain ID
        address,
      },
    });
    console.log(msg);
    setMessage(msg);
  }, [address, generateSiweMessage]);

  const handleSignMessage = useCallback(() => {
    if (!message) {
      console.error("No message to sign");
      return;
    }

    try {
      signMessage({ account: address as Hex, message });
    } catch (error) {
      console.error("Failed to sign message:", error);
    }
  }, [message, address, signMessage, signature]);

  const linkWallet = useCallback(async () => {
    if (!user || !message) {
      console.error("User and signed message are required to link wallet");
      return;
    }

    const linkedUser = await linkWithSiwe({ signature});
    if (linkedUser) {
      setLinked(true);
      setPrivyUser(linkedUser);
    }
  }, [user, message, linkWithSiwe]);

  return {
    connectWallet,
    handleGenerateMessage,
    handleSignMessage,
    handleDisconnect,
    linkWallet,
    address,
    message,
    linked,
    privyUser,
  };
};
