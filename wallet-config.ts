polyfillForWagmi();

import { http, createConfig } from "wagmi"
import {
    createConnectorFromWallet,
    Wallets,
  } from "@mobile-wallet-protocol/wagmi-connectors";
  import { createPublicClient} from "viem";

import { base, baseSepolia, zora, zoraSepolia } from 'wagmi/chains'
import * as Linking from "expo-linking";


import { createClient} from "viem";
   
  const metadata = {
    appDeeplinkUrl: "https://www.dispopen.com", // required to establish your app's identity, use 'https://' link for production
    // appCustomScheme: 'myapp://', // optional, used to remove the Done screen after signing
    appName: "Dispopen",
    appChainIds: [baseSepolia.id, base.id, zoraSepolia.id],
    appLogoUrl: 'https://www.dispopen.com/public/logo.png'
  }
   
  export const config = createConfig({
    chains: [baseSepolia, base, zoraSepolia],
    connectors: [
      createConnectorFromWallet({
        metadata,
        wallet: Wallets.CoinbaseSmartWallet,
      }),
    ],
    transports: {
      [base.id]: http(),
      [baseSepolia.id]: http(),
      [zoraSepolia.id]: http(),
    },
  });
  

 
const paymasterService = process.env.PAYMASTER_SERVICE_URL!;
 
  function polyfillForWagmi() {
    const noop = (() => {}) as any;
  
    window.addEventListener = noop;
    window.dispatchEvent = noop;
    window.removeEventListener = noop;
    window.CustomEvent = function CustomEvent() {
      return {};
    } as any;
  }