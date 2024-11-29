import { useState, useMemo, useCallback, useEffect } from "react";
import { baseSepolia, zora } from "viem/chains";
import { firebaseApp } from "@/firebaseConfig";
import { Buffer } from 'buffer';
import * as ImageManipulator from 'expo-image-manipulator';
import {
  getFunctions,
  httpsCallable,
  connectFunctionsEmulator,
} from "firebase/functions";
import {
  useAccount,
  useChainId,
  useReadContract,
  useConfig
} from "wagmi";
import { waitForTransactionReceipt, writeContract } from '@wagmi/core'
import { useCapabilities, useWriteContracts } from "wagmi/experimental";
import { Address, custom, formatEther } from "viem";
import {
  createCreatorClient,
  createCollectorClient,
  type GetMintParameters,
  TokenMetadataJson
} from "@zoralabs/protocol-sdk";
import { createPublicClient, http, Chain, createWalletClient } from "viem";
import FormData from 'form-data';
import * as FileSystem from 'expo-file-system';
import { config } from "@/wallet-config"

type Metadata = {
  metadataUrl: string
}


export function useZoraTokenCreation() {
  const functions = getFunctions(firebaseApp);
  connectFunctionsEmulator(functions, "127.0.0.1", 5001);
  const pinFileToPinata = httpsCallable<any>(functions, "pinFileToPinata");
  const [metadataUrl, setMetadataUrl] = useState<string | null>(null);
  const [id, setId] = useState<string | undefined>(undefined);
  const [provider, setProvider] = useState<any>(null);
  const configg = useConfig()
  const publicClient = createPublicClient({
    chain: baseSepolia as Chain,
    transport: http(),
  });
  const creatorClient = createCreatorClient({ chainId: baseSepolia.id, publicClient });
  const collectorClient = createCollectorClient({
    chainId: baseSepolia.id,
    publicClient,
  });
  let walletClient: any

  useEffect(() => {
    const fetchProvider = async () => {
      const provider = await config.connectors[0].getProvider()

      walletClient = createWalletClient({
        chain: baseSepolia,
        transport: custom(provider as any),
      });
    }
    fetchProvider()
  }, [])

  const { address } = useAccount();
  const account = useAccount();

  const { writeContracts } = useWriteContracts({
    mutation: {
      onSuccess: (id) => { setId(id); console.log("wrote contracts") },
      onError: (e) => console.error("Error writing contracts:", e)
    },
  });
  const { data: availableCapabilities } = useCapabilities({
    account: address,
  });

  const prepareImageForUpload = async (uri: string) => {
    const fileInfo = await FileSystem.getInfoAsync(uri);

    const originalName = getFileNameFromUri(uri); // Extract original filename
    const dynamicName = generateUniqueFileName(originalName); // Generate unique filename
    const formData = new FormData();

    // formData.append('file', {
    //   uri: fileInfo.uri,
    //   type: 'image/jpeg', // or use the actual MIME type of the file
    //   name: dynamicName, // a name for the uploaded file
    // });

    formData.append("file", "file:///Users/kosianyaegbuna/Library/Developer/CoreSimulator/Devices/6E183257-2FE3-4D7D-8335-302F784AA855/data/Containers/Data/Application/D0350F13-85C2-475E-B1CF-26C890CFDA5B/Library/Caches/ImagePicker/496F3DC7-6115-4211-9A52-9E1768D929D1.jpg");

    return formData;
  };

  const getFileNameFromUri = (uri: string): string => {
    const parts = uri.split('/');
    return parts[parts.length - 1]; // Extract the last part of the URI
  };

  const generateUniqueFileName = (originalName: string): string => {
    const timestamp = new Date().toISOString().replace(/[:.-]/g, ''); // Format timestamp
    const randomString = Math.random().toString(36).substring(2, 8); // Generate random string
    const extension = originalName.split('.').pop(); // Extract file extension
    const baseName = originalName.replace(`.${extension}`, ''); // Remove extension from name

    return `${baseName}_${timestamp}_${randomString}.${extension}`;
  };

  const compressImage = async (uri: string) => {
    const manipulatedImage = await ImageManipulator.manipulateAsync(
      uri,
      [{ resize: { width: 800 } }], // Resize to 800px width, maintaining aspect ratio
      { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG } // Compress and save as JPEG
    );
    return manipulatedImage.uri;
  };


  const sendFileToPinata = useCallback(async (image: string, dispopenTitle: string) => {
    // Read the file as base64
    const base64 = await FileSystem.readAsStringAsync(image, {
      encoding: FileSystem.EncodingType.Base64
    });
    const imageName = getFileNameFromUri(image)
    try {
      //Call the Firebase Cloud Function
      const result = await pinFileToPinata({
        file: base64,
        name: dispopenTitle, // You might want to allow the user to input this 
        attributes: {
          trait_type: "artist",
          value: "John Doe", // You might want to allow the user to input this
        },
      });
      let realResult = result.data as unknown as Metadata

      // @ts-ignore
      setMetadataUrl(realResult.metadataUrl);
      console.log(realResult.metadataUrl)
      console.log(metadataUrl)
      return realResult.metadataUrl;
    } catch (error) {
      console.error('Error uploading to Pinata:', error);
    }
  }, [pinFileToPinata]);



  const getToken = useCallback(async (tokenContract: `0x${string}`, tokenId: bigint) => {
    const { token, prepareMint, primaryMintActive } = await collectorClient.getToken({
      tokenContract,
      mintType: "1155",
      tokenId,
    });
    console.log(token)

    return token;
  }, [collectorClient]);





  const capabilities = useMemo(() => {
    if (!availableCapabilities || !account.chainId) return {};
    const capabilitiesForChain = availableCapabilities[account.chainId];
    if (
      capabilitiesForChain["paymasterService"] &&
      capabilitiesForChain["paymasterService"].supported
    ) {
      return {
        paymasterService: {
          url: `https://api.developer.coinbase.com/rpc/v1/base/oGxqGGB2Klb93aQ77XP37niJNljJg4tf`,
        },
      };
    }
    return {};
  }, [availableCapabilities, account.chainId]);

  const createToken = useCallback(async (contractName: string, tokenMetadataUri: string, ticker?: string) => {
    try {
      const { parameters, contractAddress } = await creatorClient.create1155({
        // the contract will be created at a deterministic address
        contract: {
          // contract name
          name: contractName,
          // contract metadata uri
          uri: tokenMetadataUri,

        },
        token: {
          tokenMetadataURI: tokenMetadataUri,
          createReferral: "0xdd59a87E011CAe37f479900F7275c3b45d954505",
          salesConfig: {
            // Symbol of the erc20z token to create for the secondary sale.  If not provided, extracts it from the name.
            erc20Symbol: ticker ?? "DISPOPEN",
            // Earliest time a token can be minted.  If undefined or 0, then it can be minted immediately.  Defaults to 0n.
            saleStart: 0n,
            // Market countdown, in seconds, that will start once the minimum mints for countdown is reached. Defaults to 24 hours.
            marketCountdown: BigInt(24 * 60 * 60),
            // Minimum quantity of mints that will trigger the countdown.  Defaults to 1111n
            minimumMintsForCountdown: 1111n,
          },
        },
        // account to execute the transaction (the creator)
        account: address as `0x${string}`,
      });





      console.log(parameters)
      console.log(config)
      // simulate the transaction
      const { request } = await publicClient.simulateContract(parameters);
      // await walletClient.writeContract(request)
      await writeContract(configg, request)
      //   writeContracts({
      //     contracts: [{ ...request }],
      //     capabilities,
      //   });

      return { contractAddress };
    } catch (e) {
      console.error("Error creating token:", e);
      throw e;
    }
  }, [creatorClient, account.address, writeContracts, capabilities, id]);

  const createTokenOnExistingContract = useCallback(async (contractName: string, tokenMetadataUri: string) => {
    try {
      //   const contractAddress = "0xC577a676D4E1C492D074a0401410Cf2BF5142faf" as `0x${string}`
      //   const { parameters} = await creatorClient.create1155OnExistingContract({
      //     contractAddress,
      //     token: {
      //         // createReferral: account.address,
      //         tokenMetadataURI: tokenMetadataUri,
      //     },
      //     account: "0xdd59a87E011CAe37f479900F7275c3b45d954505" as `0x${string}`,
      //   });


      const contractAddress = "0xAB3B1386C538285Cc0C0722065Ed83f145B78947" as `0x${string}`
      const { parameters } = await creatorClient.create1155OnExistingContract({
        contractAddress,
        //by providing a contract address, the token will be created on an existing contract
        // at that address

        token: {
          // token metadata uri
          tokenMetadataURI: "ipfs://DUMM/token.json",
        },
        // account to execute the transaction (the creator)
        account: "0xdd59a87E011CAe37f479900F7275c3b45d954505",
      });


      // simulate the transaction
      const { request } = await publicClient.simulateContract(parameters);
      console.log(request)

      //   writeContracts({
      //     contracts: [{ ...parameters }],
      //     capabilities,
      //   });

      /// execute the transaction
      const hash = await walletClient.writeContract(parameters);
      // wait for the response
      const reciept = await publicClient.waitForTransactionReceipt({ hash });
      console.log(reciept)
      return reciept;
    } catch (e) {
      console.error("Error creating token:", e);
      throw e;
    }
  }, [creatorClient, account.address, writeContracts, capabilities, id]);


  collectorClient.getTokensOfContract
  return {
    sendFileToPinata,
    getToken,
    createToken,
    createTokenOnExistingContract,
    id,
  };
}