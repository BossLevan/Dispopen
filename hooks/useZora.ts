import { useState, useMemo, useCallback } from "react";
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
  useWriteContract,
} from "wagmi";
import { useCapabilities, useWriteContracts } from "wagmi/experimental";
import { Address, formatEther } from "viem";
import {
  createCreatorClient,
  createCollectorClient,
  type GetMintParameters,
} from "@zoralabs/protocol-sdk";
import { createPublicClient, http, Chain } from "viem";
import FormData from 'form-data';
import * as FileSystem from 'expo-file-system';

export function useZoraTokenCreation() {
  const functions = getFunctions(firebaseApp);
  connectFunctionsEmulator(functions, "127.0.0.1", 5001);
  const pinFileToPinata = httpsCallable(functions, "pinFileToPinata");
  const [metadataUrl, setMetadataUrl] = useState<string | null>(null);
  const [id, setId] = useState<string | undefined>(undefined);
  const publicClient = createPublicClient({
    chain: zora as Chain,
    transport: http(),
  });
  const creatorClient = createCreatorClient({ chainId: baseSepolia.id, publicClient });
  const collectorClient = createCollectorClient({
    chainId: baseSepolia.id,
    publicClient,
  });
  const account = useAccount();
  const { writeContracts } = useWriteContracts({
    mutation: { 
      onSuccess: (id) => setId(id), 
      onError: (e) => console.error("Error writing contracts:", e) 
    },
  });
  const { data: availableCapabilities } = useCapabilities({
    account: account.address,
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
  

  const sendFileToPinata = useCallback(async (image: string, dispopenTitle: string ) => {
         // Read the file as base64
      const base64 = await FileSystem.readAsStringAsync(image, {
        encoding: FileSystem.EncodingType.Base64 
       });
       const imageName = getFileNameFromUri(image)
    try {
        //Call the Firebase Cloud Function
        const result = await pinFileToPinata({
          file: base64,
          name: imageName, // You might want to allow the user to input this
          description: dispopenTitle, // You might want to allow the user to input this
          attributes: {
            trait_type: "artist",
            value: "John Doe", // You might want to allow the user to input this
          },
        });
  
        // @ts-ignore
        setMetadataUrl(result.data.metadataUrl);
        console.log(metadataUrl)
        return metadataUrl;
      } catch (error) {
        console.error('Error uploading to Pinata:', error);
      } 
  }, [pinFileToPinata]);



  const getToken = useCallback(async (tokenContract:`0x${string}`, tokenId: bigint) => {
    const { token, prepareMint } = await collectorClient.getToken({
      tokenContract,
      mintType: "1155",
      tokenId,
    });
    return token.tokenURI;
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

  const createToken = useCallback(async (contractName: string, tokenMetadataUri: string) => {
    try {
      const { parameters, contractAddress } = await creatorClient.create1155({
        contract: {
          name: contractName,
          uri: "ipfs://DUMMY/contract.json",
        },
        token: {
            createReferral: account.address,
            tokenMetadataURI: metadataUrl as string,
        },
        account: account.address as Address,
      });

      writeContracts({
        contracts: [{ ...parameters }],
        capabilities,
      });

      return { contractAddress, id };
    } catch (e) {
      console.error("Error creating token:", e);
      throw e;
    }
  }, [creatorClient, account.address, writeContracts, capabilities, id]);

  return {
    sendFileToPinata,
    getToken,
    createToken,
    id,
  };
}