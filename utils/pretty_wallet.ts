export function prettyWalletAddress(address: string): { prefix: string; dots: string; suffix: string } {
    if (!address.startsWith("0x") || address.length < 5) {
      throw new Error("Invalid wallet address");
    }
    return {
      prefix: "0x",
      dots: "...",
      suffix: address.slice(-3)
    };
  }

  export function prettyCreatorWalletAddress(address: string): string {
    if (!address.startsWith("0x") || address.length < 5) {
      throw new Error("Invalid wallet address");
    }
    return `0x...${address.slice(-3)}`;
  }
  
  
  
  