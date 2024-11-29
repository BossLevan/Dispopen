// utils/ipfs.ts
export const convertIpfsToPinataUrl = (ipfsUri: string): string => {
    const ipfsGateway = 'https://orange-encouraging-guanaco-614.mypinata.cloud/ipfs/';
    if (!ipfsUri.startsWith('ipfs://')) {
      throw new Error('Invalid IPFS URI. It should start with "ipfs://".');
    }
    const ipfsHash = ipfsUri.replace('ipfs://', '');
    return `${ipfsGateway}${ipfsHash}`;
  };
  