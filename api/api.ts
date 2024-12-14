import {
  getFunctions,
  httpsCallable,
  connectFunctionsEmulator,
} from "firebase/functions";
import { GraphQLClient, gql } from 'graphql-request';
import { firebaseApp } from "@/firebaseConfig";
import { getFirestore, connectFirestoreEmulator, collection, getDocs } from "firebase/firestore";
import { Frame } from "lucide-react-native";

// Define types based on the GraphQL response
export interface Token {
  creator: string;
  maxSupply: string;
  royalties: { royaltyRecipient: string }[];
  uri: string;
  totalMinted: string;
  totalSupply: string;
  metadataIPFSID: string;
  id: string
  metadata: { image: string, name: string, id: string };
}

interface ApiResponse<T> {
  data: T | null;
  error?: string;
}

type Frame = {
  id: string;
  title: string;
  artist_name: string;
  artist_address: string;
  frame_image_url: string;
};

export type ZoraCreateTokenResponse = {
    totalMinted: string; // Total minted tokens as a string
    timestamp: string
    metadata: {
      name: string; // Name of the token or file
      image: string; // IPFS image URI
      rawJson: string //to get the artist details
    };
    address: string; // Contract address
    creator: string; // Creator's address
    salesStrategies: {
      zoraTimedMinter: {
        marketCountdown: string;
        erc20z: string; // Address of the ERC20 token used for sales
        erc20Z: {
          id: string; // ERC20 token ID
          name: string; // ERC20 token name
          symbol: string; // ERC20 token symbol
        };
      };
    }[];
};

const functions = getFunctions(firebaseApp);
const db = getFirestore(firebaseApp, "dispopen");
connectFunctionsEmulator(functions, "127.0.0.1", 5001);
// connectFirestoreEmulator(db, "localhost", 8080);
const getUserDispopens = httpsCallable<any>(functions, "getUserDispopens");
const getUserDispopen = httpsCallable<any>(functions, "getUserDispopen");
const getFeaturedDispopens = httpsCallable<any>(functions, "getFeaturedDispopens");

const endpoint = 'https://api.goldsky.com/api/public/project_clhk16b61ay9t49vm6ntn4mkz/subgraphs/zora-create-base-sepolia/stable/gn';
const client = new GraphQLClient(endpoint);

export const apiService = {
  // async getUserDispopens(creatorAddress: string): Promise<ApiResponse<Token[]>> {
  // },

  async getDispopens(creatorAddress: string): Promise<Token[]> {
    try {
      console.debug(creatorAddress)
      const result = await getUserDispopens({
        creatorAddress: creatorAddress
      })

      let usableResult = result.data as unknown as ApiResponse<Token[]>
      console.log("result",usableResult.data)
      return usableResult.data!
    } catch (e) {
      console.error(e)
      return [];
    }
  },

  async getDispopen(id: string): Promise<ZoraCreateTokenResponse> {
    try {
      const result = await getUserDispopen({
        id: id
      })


      let usableResult = result.data as ApiResponse<ZoraCreateTokenResponse>
      return usableResult.data!
    } catch (e) {
      console.error(e)
      return null!;
    }
  },

  //=======FOR FIRESTORE MANUAL CONFIG, INCASE============//
  // async getFeaturedDispopens(): Promise<Token[]>{
  //   console.log("starte");
  //   try {
  //     const featuredDispopensRef = collection(db, "featured-dispopens");
  //     const snapshot = await getDocs(featuredDispopensRef);
  
  //     // Map Firestore documents to the Token interface
  //     const dispopens: Token[] = snapshot.docs.map((doc) => {
  //       const data = doc.data();
  
  //       // Ensure data matches the Token structure
  //       return {
  //         creator: data.creator || "",
  //         maxSupply: data.maxSupply || "",
  //         royalties: data.royalties || [],
  //         uri: data.uri || "",
  //         totalMinted: data.totalMinted || "",
  //         totalSupply: data.totalSupply || "",
  //         metadataIPFSID: data.metadataIPFSID || "",
  //         id: data.id, // Use the Firestore document ID
  //         metadata: {
  //           image: data.metadata?.image || "",
  //           name: data.metadata?.name || "",
  //           id: data.metadata?.id || "",
  //         },
  //       };
  //     });
  
  //     console.log("Fetched featured dispopens:", dispopens);
  //     return dispopens;
  //   } catch (error) {
  //     console.error("Error fetching featured dispopens:", error);
  //     return [];
  //   }
  // }

  async getFeaturedDispopens(): Promise<Token[]>{
    try {
      const result = await getFeaturedDispopens()

      let usableResult = result.data as unknown as ApiResponse<Token[]>
      console.log("featured dispopens",usableResult.data)
      return usableResult.data!
    } catch (e) {
      console.error(e)
      return [];
    }
  },

  async fetchFrames(): Promise<Frame[]> {
    try {
      const featuredDispopensRef = collection(db, "frames");
      const snapshot = await getDocs(featuredDispopensRef);
  
      const frames: Frame[] = snapshot.docs.map((doc) => {
        const data = doc.data();
  
        // Create a Frame object from the data
        return { ...data } as Frame; // Ensure data is cast to Frame type
      });
  
      console.log("Fetched featured frames:", frames);
      return frames;
    } catch (e) {
      console.error(e);
      return [];
    }
  }
}