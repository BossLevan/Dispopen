import {
  getFunctions,
  httpsCallable,
  connectFunctionsEmulator,
} from "firebase/functions";
import { GraphQLClient, gql } from 'graphql-request';
import { firebaseApp } from "@/firebaseConfig";
import { getFirestore, connectFirestoreEmulator, collection, getDocs, doc, getDoc, setDoc, serverTimestamp, updateDoc, increment } from "firebase/firestore";
import { ApiResponse, Frame, Token, ZoraCreateTokenResponse } from "@/constants/types";
import { useAccount } from "wagmi";
import { showToast } from "@/components/Toast";


const functions = getFunctions(firebaseApp);
const db = getFirestore(firebaseApp, "dispopen");
connectFunctionsEmulator(functions, "127.0.0.1", 5001);

// connectFirestoreEmulator(db, "localhost", 8080);
const getUserDispopens = httpsCallable<any>(functions, "getUserDispopens");
const getUserDispopen = httpsCallable<any>(functions, "getUserDispopen");
const getFeaturedDispopens = httpsCallable<any>(functions, "getFeaturedDispopens");
const getGraduatedDispopensLength = httpsCallable<any>(functions, "getGraduatedDispopensLength");

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
      // console.log("result",usableResult.data)
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
      // console.log("featured dispopens",usableResult.data)
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
      showToast('error', 'A backend error occured')
      return [];
    }
  },


 async checkOrCreateUser(walletAddress: string) {
  try {
    const userDocRef = doc(db, "users", walletAddress);
    const userDoc = await getDoc(userDocRef);

    if (!userDoc.exists()) {
      await setDoc(userDocRef, { 
          walletAddress, 
          createdAt: serverTimestamp() 
      });
      console.log(`New wallet added: ${walletAddress}`);
  } else {
      console.log(`Wallet already exists: ${walletAddress}`);
  }
  } catch (error) {
    console.error('Error checking wallet address:', error);
    return { error: 'An error occurred while checking the wallet address' };
  }
},

/**
 * Retrieves the "dispopens_curated" field for a user in the Firestore `users` collection.
 * If the document or field does not exist, it initializes the field to 0.
 * @param walletAddress - The wallet address of the user.
 * @returns The value of "dispopens_curated" (number).
 */
 async getDispopensCurated(walletAddress: string): Promise<number> {
  try {
    console.log("wallet address", walletAddress)
    const userRef = doc(db, "users", walletAddress!);
    const userDoc = await getDoc(userRef);

    if (userDoc.exists()) {
      const data = userDoc.data();
      return data?.dispopens_curated ?? 0; // Return the field value or 0 if it doesn't exist
    } else {
      // If the document doesn't exist, initialize it with "dispopens_curated" set to 0
      await setDoc(userRef, { dispopens_curated: 0 });
      return 0;
    }
  } catch (error) {
    console.error("Error retrieving dispopens_curated:", error);
    showToast('error', 'failed to retrieve dispopens')
    throw new Error("Failed to retrieve dispopens_curated");
  }
},

/**
 * Increments the "dispopens_curated" field by 1 for a user in the Firestore `users` collection.
 * @param walletAddress - The wallet address of the user.
 */
async incrementDispopensCurated(walletAddress: string): Promise<void> {
  try {
    const userRef = doc(db, "users", walletAddress);

    // Use Firestore's increment function to atomically add 1 to the field
    await updateDoc(userRef, {
      dispopens_curated: increment(1)
    });
  } catch (error) {
    console.error("Error incrementing dispopens_curated:", error);
    throw new Error("Failed to increment dispopens_curated");
  }
},


async getGraduatedDispopensLength(creatorAddress: string): Promise<number> {

  try {
    console.debug(creatorAddress)
    const result = await getGraduatedDispopensLength({
      creatorAddress: creatorAddress
    })
    if(result == undefined){
      throw('an error occured')
    }
    let usableResult = result.data as number
    console.log("result", usableResult)
    return usableResult!
  } catch (e) {
    console.error(e)
    return 0;
  }
},
}