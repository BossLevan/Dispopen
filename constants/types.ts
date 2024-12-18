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
  
  export interface ApiResponse<T> {
    data: T | null;
    error?: string;
  }
  
  export type Frame = {
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