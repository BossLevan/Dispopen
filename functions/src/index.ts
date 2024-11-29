/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import { onCall, HttpsError } from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";
import { PinataSDK, PinResponse } from "pinata-web3"
import { GraphQLClient, gql } from 'graphql-request';


// Start writing functions
// https://firebase.google.com/docs/functions/typescript

// type PinResponse = {
//   IpfsHash: string;
//   PinSize: number;
//   Timestamp: string;
//   isDuplicate?: boolean;
// };


// Define types based on the GraphQL response
interface Token {
  creator: string;
  maxSupply: string;
  royalties: { royaltyRecipient: string }[];
  uri: string;
  totalMinted: string;
  totalSupply: string;
  id: string
  metadataIPFSID: string;
  metadata: { image: string, name: string, id: string };
}

interface ApiResponse<T> {
  data: T | null;
  error?: string;
}

type ZoraCreateTokenResponse = {
  zoraCreateToken: {
    totalMinted: string; // Total minted tokens as a string
    metadata: {
      name: string; // Name of the token or file
      image: string; // IPFS image URI
    };
    timestamp: string;
    address: string; // Contract address
    creator: string; // Creator's address
    salesStrategies: {
      zoraTimedMinter: {
        erc20z: string; // Address of the ERC20 token used for sales
        marketCountdown: string;
        erc20Z: {
          id: string; // ERC20 token ID
          name: string; // ERC20 token name
          symbol: string; // ERC20 token symbol
        };
      };
    }[];
  };
};


const endpoint = 'https://api.goldsky.com/api/public/project_clhk16b61ay9t49vm6ntn4mkz/subgraphs/zora-create-base-sepolia/stable/gn';
const client = new GraphQLClient(endpoint);


const pinata = new PinataSDK({
  pinataJwt: process.env.PINATA_JWT,
  pinataGateway: process.env.GATEWAY_URL
});

const ZORA_CONTRACTS_QUERY = gql`
query GetUserDispopens($creatorAddress: String!) {
  zoraCreateTokens(
    first: 10
    where: {metadata_: {description_contains: "dispopen"}, creator: $creatorAddress}
  ) {
    creator
    metadataIPFSID
    creator
    maxSupply
    royalties {
      royaltyRecipient
    }
    uri
    id
    totalMinted
    totalSupply
    metadata {
      image
      name
      id
    }
  }
}
`;

const ZORA_TOKEN_QUERY = gql`
query GetDispopens($id: String!) {
  zoraCreateToken(id: $id) {
    totalMinted
    timestamp
    metadata {
      name
      image
    }
    address
    creator
    salesStrategies {
      zoraTimedMinter {
        erc20z
        marketCountdown
        erc20Z {
          id
          name
          symbol
        }
      }
    }
  }
}
`;


export const pinFileToPinata = onCall(async (request) => {
  // Log the function call
  logger.info("pinFileToPinata function called", { structuredData: true });
  try {
    //Pin the image / file first
    const res = await fetch(`data:image/jpeg;base64,${request.data.file}`);
    const blob = new Blob([await res.blob()]);
    logger.info(blob)
    const file = new File([blob], request.data.name, { type: "image/jpeg" });
    const result: PinResponse = await pinata.upload.file(file)

    logger.info(result);
    // Log success and send response
    logger.info("File pinned successfully", { ipfsHash: result.IpfsHash });
    logger.info(result.IpfsHash);

    //then pin the metadata
    const metadata: PinResponse = await pinata.upload.json({
      name: request.data.name,
      image: `ipfs://${result.IpfsHash}`,
      description: "dispopen",
      attributes: {
        trait_type: request.data.attributes.trait_type,
        value: request.data.attributes.value,
      },
    })

    // Log success and send response
    logger.info("Metadata pinned successfully", { ipfsHash: metadata.IpfsHash });
    return { metadataUrl: `ipfs://${metadata.IpfsHash}` };
  } catch (error) {
    // Log error and send error response
    logger.error("Error pinning file to Pinata", error);
    throw new HttpsError("invalid-argument", `${error}`);
  }
});

export const getUserDispopens = onCall(async (request): Promise<ApiResponse<Token[]>> => {
  const address = request.data.creatorAddress
  try {
    const response = await client.request<{ zoraCreateTokens: Token[] }>(ZORA_CONTRACTS_QUERY, { creatorAddress: address });
    console.log('GraphQL response:', JSON.stringify(response, null, 2));

    if (!response || !response.zoraCreateTokens) {
      throw new Error('Unexpected response structure');
    }

    return { data: response.zoraCreateTokens };
  } catch (error) {
    console.error('Error fetching Zora contracts:', error);
    if (error instanceof Error) {
      console.error('Error details:', error.message);
      // console.error('Error stack:', error.stack);
    }
    return { data: [], error: 'Failed to fetch Zora contracts' };
  }
})

export const getUserDispopen = onCall(async (request): Promise<ApiResponse<ZoraCreateTokenResponse>> => {
  const id = request.data.id //token id, gotten from the above
  try {
    const response = await client.request<{ zoraCreateToken: ZoraCreateTokenResponse }>(ZORA_TOKEN_QUERY, { id: id });
    console.log('GraphQL response:', JSON.stringify(response, null, 2));

    if (!response || !response.zoraCreateToken) {
      throw new Error('Unexpected response structure');
    }

    return { data: response.zoraCreateToken };
  } catch (error) {
    console.error('Error fetching Zora contracts:', error);
    if (error instanceof Error) {
      console.error('Error details:', error.message);
      // console.error('Error stack:', error.stack);
    }
    return { data: null, error: 'Failed to fetch Zora contracts' };
  }
})
