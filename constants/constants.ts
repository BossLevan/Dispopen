// export const coinbaseSmartWalletProxyBytecode =
//   "0x363d3d373d3d363d7f360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc545af43d6000803e6038573d6000fd5b3d6000f3";
// export const coinbaseSmartWalletV1Implementation =
//   "0x000100abaad02f1cfC8Bbe32bD5a564817339E72";
// export const coinbaseSmartWalletFactoryAddress =
//   "0x0BA5ED0c6AA8c49038F819E587E2633c4A9F428a";
// export const magicSpendAddress = "0x011A61C07DbF256A68256B1cB51A5e246730aB92";
// export const erc1967ProxyImplementationSlot =
//   "0x360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc";

import { base, baseSepolia, zoraSepolia } from "wagmi/chains"

 
// export const coinbaseSmartWalletABI = [
//   {
//     type: "function",
//     name: "executeBatch",
//     inputs: [
//       {
//         name: "calls",
//         type: "tuple[]",
//         internalType: "struct CoinbaseSmartWallet.Call[]",
//         components: [
//           {
//             name: "target",
//             type: "address",
//             internalType: "address",
//           },
//           {
//             name: "value",
//             type: "uint256",
//             internalType: "uint256",
//           },
//           {
//             name: "data",
//             type: "bytes",
//             internalType: "bytes",
//           },
//         ],
//       },
//     ],
//     outputs: [],
//     stateMutability: "payable",
//   },
// ];



export const myWalletAddress: `0x${string}` = '0x4Fa3ab697dA5270B7335b567cC4e5A9d798D1673'
export const appDeeplinkUr="https://www.dispopen.com"; // required to establish your app's identity, use 'https://' link for production
    // appCustomScheme: 'myapp://', // 
    //optional, used to remove the Done screen after signing
export const appName= "Dispopen";
export const appChain= base;
export const appCreateReferral= "0x4Fa3ab697dA5270B7335b567cC4e5A9d798D1673";
export const appChainIds= [baseSepolia.id, base.id, zoraSepolia.id];
export const appChains= [baseSepolia, base, zoraSepolia];
export const appLogoUrl= 'https://orange-encouraging-guanaco-614.mypinata.cloud/ipfs/QmYqYuypEwuTjiPGiLScfa8JtKHqywkw8eShN7xvdJvNrS'