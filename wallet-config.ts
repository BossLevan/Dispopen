polyfillForWagmi();

import { http, createConfig } from "wagmi"
import {
    createConnectorFromWallet,
    Wallets,
  } from "@mobile-wallet-protocol/wagmi-connectors";

import { base } from 'wagmi/chains'
   
  const metadata = {
    appDeeplinkUrl: 'https://www.dispopen.com', // required to establish your app's identity, use 'https://' link for production
    // appCustomScheme: 'myapp://', // optional, used to remove the Done screen after signing
    appName: "Dispopen",
    appChainIds: [8453],
    appLogoUrl: 'https://www.dispopen.com/public/logo.png'
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

  function polyfillForWagmi() {
    const noop = (() => {}) as any;
  
    window.addEventListener = noop;
    window.dispatchEvent = noop;
    window.removeEventListener = noop;
    window.CustomEvent = function CustomEvent() {
      return {};
    } as any;
  }