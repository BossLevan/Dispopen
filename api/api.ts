import {
  getFunctions,
  httpsCallable,
  connectFunctionsEmulator,
} from "firebase/functions";
import { GraphQLClient, gql } from 'graphql-request';
import { firebaseApp } from "@/firebaseConfig";

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

export type ZoraCreateTokenResponse = {
    totalMinted: string; // Total minted tokens as a string
    timestamp: string
    metadata: {
      name: string; // Name of the token or file
      image: string; // IPFS image URI
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
connectFunctionsEmulator(functions, "127.0.0.1", 5001);
const getUserDispopens = httpsCallable<any>(functions, "getUserDispopens");
const getUserDispopen = httpsCallable<any>(functions, "getUserDispopen");
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
      console.log(usableResult.data)
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
  }

};