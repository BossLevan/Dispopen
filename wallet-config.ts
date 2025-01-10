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
import { appChainIds, appLogoUrl, appName } from "./constants/constants";
   
  const metadata = {
    deeplinkUrl: "https://www.dispopen.com", // required to establish your app's identity, use 'https://' link for production
    customScheme: 'myapp://dispopen', // optional, used to remove the Done screen after signing
    name: appName,
    chainIds: appChainIds,
    logoUrl: appLogoUrl
  }
   
  export const config = createConfig({
    chains: [base],
    connectors: [
      createConnectorFromWallet({
        metadata,
        wallet: Wallets.CoinbaseSmartWallet,
      }),
    ],
    transports: {
      [base.id]: http(),
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