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
      // onSuccess: async (signature) => {
      //   // console.log("Signature:", signature);
      //   // setSignature(signature);
      //   // // Here, you would send the signature to your backend or use it with linkWithSiwe
      //   // if (!user || !message) {
      //   //   console.error("User and signed message are required to link wallet");
      //   //   return;
      //   // }
    
      //   const linkedUser = await linkWithSiwe({ signature});
      //   if (linkedUser) {
      //     setLinked(true);
      //     setPrivyUser(linkedUser);
      //   }
      // },
      onError: (error) => console.error("Error Signing Message:", error),
    },
  });
  const { generateSiweMessage, linkWithSiwe } = useLinkWithSiwe({
    onSuccess: console.log,
    onError: console.error,
  });

  const { user } = usePrivy();

const connectWallet = useCallback(async () => {
  return new Promise<void>((resolve, reject) => {
    try {
      connect(
        {
          connector: connectors[0],
          chainId: baseSepolia.id,
        },
        {
          onSuccess: async (data) => {
            const walletAddress = data.accounts[0];
            console.log("Connected wallet address:", walletAddress);
            setAddress(walletAddress);

            // Generate SIWE Message
            const msg: SignableMessage = await generateSiweMessage({
              from: {
                domain: "www.dispopen.com",
                uri: "https://www.dispopen.com",
              },
              wallet: {
                chainId: `${baseSepolia.id}`,
                address: walletAddress,
              },
            });
            setMessage(msg);
            console.log("Generated SIWE Message:", msg);

            // Sign the message with onSuccess callback
            signMessage({
              account: walletAddress as Hex,
              message: msg,
              
            }, {onSuccess: async (signature) => {
              console.log("Signature:", signature);
              setSignature(signature);

              // Link with SIWE
              if (!user) {
                console.error("User is required to link wallet.");
                reject(new Error("User not found."));
                return;
              }

              const linkedUser = await linkWithSiwe({ signature });
              if (linkedUser) {
                console.log("Wallet linked successfully!");
                setLinked(true);
                setPrivyUser(linkedUser);
                resolve(); // Complete successfully
              } else {
                console.error("Failed to link wallet.");
                reject(new Error("Linking wallet failed."));
              }
            },
            onError: (error) => {
              console.error("Failed to sign message:", error);
              reject(error);
            },});
          },
          onError: (error) => {
            console.error("Error connecting wallet:", error);
            reject(error);
          },
        }
      );
    } catch (error) {
      console.error("Failed to connect wallet:", error);
      reject(error);
    }
  });
}, [connect, connectors, generateSiweMessage, signMessage, linkWithSiwe, user]);

  

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
