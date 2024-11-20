import { Button, Text, View } from "react-native";

import { zora } from "viem/chains";
import { firebaseApp } from "@/firebaseConfig";
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
import { useState, useMemo } from "react";
import { CallStatus } from "@/components/CallStatus";

export default function Index() {
  const functions = getFunctions(firebaseApp);
  connectFunctionsEmulator(functions, "127.0.0.1", 5001);
  const pinFileToPinata = httpsCallable(functions, "pinFileToPinata");

  const [selectedFile, setSelectedFile]: any = useState();

  //modify function, possible to include compression
  const pickFile = (event: any) => {
    setSelectedFile(event.target.files[0]);
  };

  const sendFileToPinata = () => {
    //Data to Pin
    pinFileToPinata({
      file: selectedFile,
      name: "",
      description: "",
      attributes: {
        trait_type: "contributing_artist_name",
        value: "",
      },
    })
      .then((result) => {
        // Read result of the Cloud Function.
        /** @type {any} */
        const data: any = result.data;
        const sanitizedMessage = data.metadataUrl;
      })
      .catch((error) => {
        // Getting the Error details.
        const code = error.code;
        const message = error.message;
        const details = error.details;
        throw error;
      });
  };

  const publicClient = createPublicClient({
    chain: zora as Chain,
    transport: http(),
  });
  const { writeContract } = useWriteContract();

  const creatorClient = createCreatorClient({ chainId: zora.id, publicClient });
  // initiate the collector client
  const collectorClient = createCollectorClient({
    chainId: zora.id,
    publicClient,
  });

  const getToken = async () => {
    // get the item that can be minted, and a function to prepare
    // a mint transaction
    const { token, prepareMint } = await collectorClient.getToken({
      // contract address token belongs to
      tokenContract: "0x1234567890123456789012345678901234567890",
      // can be set to 1155, 721, or premint
      mintType: "1155",
      tokenId: 1n,
    });

    token.tokenURI;
  };

  const createToken = async () => {
    try {
      const { parameters, contractAddress } = await creatorClient.create1155({
        // the contract will be created at a deterministic address
        contract: {
          // contract name
          name: "testContract",
          // contract metadata uri
          uri: "ipfs://DUMMY/contract.json",
        },
        token: {
          createReferral: account.address,
          tokenMetadataURI: "ipfs://DUMMY/token.json",
        },

        // account to execute the transaction (the creator)
        account: "0xb3F9EED5eEcbEb7eE838B1FA5eb2646e56cC3648",
      });

      // writeContract(parameters);
      writeContracts({
        contracts: [
          {
            ...parameters,
          },
        ],
        capabilities,
      });

      console.log(contractAddress);
      console.log(id);
    } catch (e) {
      console.log(e);
    }
  };

  const account = useAccount();
  const [id, setId] = useState<string | undefined>(undefined);
  const { writeContracts } = useWriteContracts({
    mutation: { onSuccess: (id) => setId(id), onError: (e) => console.log(e) },
  });
  const { data: availableCapabilities } = useCapabilities({
    account: account.address,
  });
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

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>Edit app/index.tsx to edit this screen.</Text>
      <Button title="Create" onPress={createToken} />
      {id && <CallStatus id={id} />}
    </View>
  );
}
