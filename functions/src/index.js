/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { onCall, HttpsError } from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";
import { PinataSDK } from "pinata-web3";
import { GraphQLClient, gql } from 'graphql-request';
import { http, createPublicClient, createWalletClient } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { baseSepolia } from 'viem/chains';
import { SplitV1Client } from "@0xsplits/splits-sdk";
const endpoint = 'https://api.goldsky.com/api/public/project_clhk16b61ay9t49vm6ntn4mkz/subgraphs/zora-create-base-sepolia/stable/gn';
const client = new GraphQLClient(endpoint);
const pinata = new PinataSDK({
    pinataJwt: process.env.PINATA_JWT,
    pinataGateway: process.env.GATEWAY_URL
});
const ZORA_CONTRACTS_QUERY = gql `
query GetUserDispopens($creatorAddress: String!) {
  zoraCreateTokens(
    orderBy: timestamp
    first: 10
    orderDirection: desc
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
const ZORA_TOKEN_QUERY = gql `
query GetDispopen($id: String!) {
  zoraCreateToken(id: $id) {
    totalMinted
    timestamp
    metadata {
      name
      image
      rawJson
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
const ZORA_FEATURED_DISPOPENS_QUERY = gql `
query GetFeaturedDispopens {
  zoraCreateTokens(
    orderBy: timestamp
    where: {metadata_: {description_contains: "dispopen"}}
    first: 3
    orderDirection: desc
  ) {
    creator
    totalMinted
    id
    metadata {
      name
      image
      id
    }
  }
  
}
`;
const ZORA_SECONDARY_ACTIVATED_QUERY = gql `
query MyQuery($creatorAddress: String!) {
  zoraCreateTokens(
    where: {metadata_: {description_contains: "dispopen"}, creator: $creatorAddress}
  ) {
    totalMinted
  }
}
`;
export const pinFileToPinata = onCall((request) => __awaiter(void 0, void 0, void 0, function* () {
    // Log the function call
    logger.info("pinFileToPinata function called", { structuredData: true });
    try {
        //Pin the image / file first
        const res = yield fetch(`data:image/jpeg;base64,${request.data.file}`);
        const blob = new Blob([yield res.blob()]);
        logger.info(blob);
        const file = new File([blob], request.data.name, { type: "image/jpeg" });
        const result = yield pinata.upload.file(file);
        logger.info(result);
        // Log success and send response
        logger.info("File pinned successfully", { ipfsHash: result.IpfsHash });
        logger.info(result.IpfsHash);
        //then pin the metadata
        const metadata = yield pinata.upload.json({
            name: request.data.name,
            image: `ipfs://${result.IpfsHash}`,
            description: "dispopen",
            frame: {
                artist_name: request.data.frame.artist_name,
                frame_name: request.data.frame.frame_name,
            },
        });
        // Log success and send response
        logger.info("Metadata pinned successfully", { ipfsHash: metadata.IpfsHash });
        return { metadataUrl: `ipfs://${metadata.IpfsHash}` };
    }
    catch (error) {
        // Log error and send error response
        logger.error("Error pinning file to Pinata", error);
        throw new HttpsError("invalid-argument", `${error}`);
    }
}));
export const getUserDispopens = onCall((request) => __awaiter(void 0, void 0, void 0, function* () {
    const address = request.data.creatorAddress;
    try {
        const response = yield client.request(ZORA_CONTRACTS_QUERY, { creatorAddress: address });
        console.log('GraphQL response:', JSON.stringify(response, null, 2));
        if (!response || !response.zoraCreateTokens) {
            throw new Error('Unexpected response structure');
        }
        return { data: response.zoraCreateTokens };
    }
    catch (error) {
        console.error('Error fetching Zora contracts:', error);
        if (error instanceof Error) {
            console.error('Error details:', error.message);
            // console.error('Error stack:', error.stack);
        }
        return { data: [], error: 'Failed to fetch Zora contracts' };
    }
}));
export const getFeaturedDispopens = onCall((request) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield client.request(ZORA_FEATURED_DISPOPENS_QUERY);
        console.log('GraphQL response:', JSON.stringify(response, null, 2));
        if (!response || !response.zoraCreateTokens) {
            throw new Error('Unexpected response structure');
        }
        // Map the response to the Token object format
        const tokens = response.zoraCreateTokens.map((token) => ({
            creator: token.creator,
            // Set default values for missing fields
            maxSupply: "", // or any default value that makes sense
            royalties: [], // No royalties data in the response
            uri: '', // Use the metadata.id as URI
            totalMinted: token.totalMinted, // No totalMinted data in the response
            totalSupply: "", // No totalSupply data in the response
            id: token.id,
            metadataIPFSID: "",
            metadata: {
                image: token.metadata.image,
                name: token.metadata.name,
                id: token.metadata.id,
            },
        }));
        return { data: tokens };
    }
    catch (error) {
        console.error('Error fetching Zora contracts:', error);
        if (error instanceof Error) {
            console.error('Error details:', error.message);
            // console.error('Error stack:', error.stack);
        }
        return { data: [], error: 'Failed to fetch Zora contracts' };
    }
}));
export const getUserDispopen = onCall((request) => __awaiter(void 0, void 0, void 0, function* () {
    const id = request.data.id; //token id, gotten from the above
    try {
        const response = yield client.request(ZORA_TOKEN_QUERY, { id: id });
        console.log('GraphQL response:', JSON.stringify(response, null, 2));
        if (!response || !response.zoraCreateToken) {
            throw new Error('Unexpected response structure');
        }
        return { data: response.zoraCreateToken };
    }
    catch (error) {
        console.error('Error fetching Zora contracts:', error);
        if (error instanceof Error) {
            console.error('Error details:', error.message);
            // console.error('Error stack:', error.stack);
        }
        return { data: null, error: 'Failed to fetch Zora contracts' };
    }
}));
export const getSplitsAddress = onCall((request) => __awaiter(void 0, void 0, void 0, function* () {
    const creatorAddress = request.data.creatorAddress;
    const artistAddress = request.data.artistAddress;
    //Slot in your private Key Here and fund Wallet
    const account = privateKeyToAccount('0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80');
    const client = createWalletClient({
        account,
        chain: baseSepolia,
        transport: http()
    });
    const publicClient = createPublicClient({
        chain: baseSepolia,
        transport: http(),
    });
    // setup a splits client
    const splitsClient = new SplitV1Client({
        chainId: baseSepolia.id,
        publicClient: publicClient,
        apiConfig: {
            // This is a dummy 0xSplits api key, replace with your own
            apiKey: "be01ea49e4d5230b0fd49d1b",
        },
    });
    const splitsConfig = {
        recipients: [
            {
                address: creatorAddress,
                percentAllocation: 80,
            },
            {
                //Artist Address
                address: artistAddress,
                percentAllocation: 10,
            },
            {
                //My Address [Platform]
                address: "0xdd59a87E011CAe37f479900F7275c3b45d954505",
                percentAllocation: 10,
            },
        ],
        distributorFeePercent: 0,
    };
    // get the deterministic split address, and determine if it has been created or not.
    const predicted = yield splitsClient.predictImmutableSplitAddress(splitsConfig);
    console.log(predicted.splitExists);
    if (!predicted.splitExists) {
        // if the split has not been created, create it by getting the transaction to execute
        // and executing it with the wallet client
        const { data, address } = yield splitsClient.callData.createSplit(splitsConfig);
        const rt = yield client.sendTransaction({
            to: address,
            account: account,
            data,
        });
    }
    const splitRecipient = predicted.splitAddress;
    return { splitRecipient: splitRecipient };
}));
export const getGraduatedDispopensLength = onCall((request) => __awaiter(void 0, void 0, void 0, function* () {
    const address = request.data.creatorAddress;
    try {
        const response = yield client.request(ZORA_SECONDARY_ACTIVATED_QUERY, { creatorAddress: address });
        console.log('GraphQL response:', JSON.stringify(response, null, 2));
        if (!response || !response.zoraCreateTokens) {
            throw new Error('Unexpected response structure');
        }
        // Filter tokens with totalMinted > 1111
        const filteredTokens = response.zoraCreateTokens.filter(token => {
            const mintedAmount = Number(token.totalMinted);
            return !isNaN(mintedAmount) && mintedAmount > 1111;
        });
        // Check if we have any tokens that meet the criteria
        if (filteredTokens.length === 0) {
            console.log('No tokens found with totalMinted > 1111');
            return 0;
        }
        // Map only the filtered tokens
        const tokens = filteredTokens.map((token) => ({
            creator: "",
            maxSupply: "",
            royalties: [],
            uri: '',
            totalMinted: token.totalMinted,
            totalSupply: "",
            id: "",
            metadataIPFSID: "",
            metadata: {
                image: "",
                name: "",
                id: "",
            },
        }));
        return tokens.length;
    }
    catch (error) {
        console.error('Error fetching Zora contracts:', error);
        if (error instanceof Error) {
            console.error('Error details:', error.message);
        }
        return undefined;
    }
}));
