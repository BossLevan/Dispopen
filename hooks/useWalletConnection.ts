// import { useCallback, useState } from 'react';
// import { baseSepolia } from 'viem/chains';
// import { generateSiweMessage } from '@privy-io/expo';
// import { Connector, ConnectArgs, ConnectResult } from '@wagmi/core';
// import { SignMessageArgs } from 'wagmi/actions';

// type ConnectFunction = (
//   args: Partial<ConnectArgs> & { connector: Connector },
//   config?: {
//     onSuccess?: (data: ConnectResult) => void;
//     onError?: (error: Error) => void;
//   }
// ) => void;

// type SignMessageFunction = (args: SignMessageArgs) => Promise<`0x${string}`>;

// export const useWalletConnection = (
//   connect: ConnectFunction,
//   connectors: Connector[],
//   signMessage: SignMessageFunction
// ) => {
//   const [address, setAddress] = useState<string | null>(null);
//   const [message, setMessage] = useState<string | null>(null);

//   const connectWallet = useCallback(async () => {
//     try {
//       const result = await new Promise<ConnectResult>((resolve, reject) => {
//         connect(
//           {
//             connector: connectors[0],
//             chainId: baseSepolia.id,
//           },
//           {
//             onSuccess: (data) => resolve(data),
//             onError: (error) => reject(error),
//           }
//         );
//       });

//       console.log("Connected wallet address:", result.account);
//       setAddress(result.account);

//       const msg = await generateSiweMessage({
//         from: {
//           domain: "www.dispopen.com",
//           uri: "https://www.dispopen.com",
//         },
//         wallet: {
//           chainId: `${baseSepolia.id}`,
//           address: result.account,
//         },
//       });

//       setMessage(msg);
//       console.log("set message", msg);

//       try {
//         await signMessage({ message: msg });
//         console.log("Message signed successfully");
//       } catch (error) {
//         console.error("Failed to sign message:", error);
//         throw error;
//       }

//       return result;
//     } catch (error) {
//       console.error("Error in wallet connection process:", error);
//       throw error;
//     }
//   }, [connect, connectors, signMessage]);

//   return { connectWallet, address, message };
// };

