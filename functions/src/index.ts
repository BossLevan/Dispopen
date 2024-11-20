/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import {onCall, HttpsError} from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";
import { PinataSDK, PinResponse} from "pinata-web3"


// Start writing functions
// https://firebase.google.com/docs/functions/typescript

// type PinResponse = {
//   IpfsHash: string;
//   PinSize: number;
//   Timestamp: string;
//   isDuplicate?: boolean;
// };


const pinata = new PinataSDK({ 
  pinataJwt: process.env.PINATA_JWT,
  pinataGateway: process.env.GATEWAY_URL
});



export const pinFileToPinata = onCall(async (request) => {
  // Log the function call
  logger.info("pinFileToPinata function called", {structuredData: true});
  try {
      //Pin the image / file first
      const res = await fetch(`data:image/jpeg;base64,${request.data.file}`);
      const blob = new Blob([await res.blob()]);
      logger.info(blob)
      const file = new File([blob], request.data.name, { type: "image/jpeg" });
      const result: PinResponse = await pinata.upload.file(file)

      logger.info(result);
      // Log success and send response
      logger.info("File pinned successfully", {ipfsHash: result.IpfsHash});
      logger.info(result.IpfsHash);
 
      return `ipfs://{result.IpfsHash}`;


      //then pin the metadata
      const metadata: PinResponse = await pinata.upload.json({
        name: request.data.name,
        image: `ipfs://${result.IpfsHash}`,
        attributes: {
          trait_type: request.data.attributes.trait_type,
          value: request.data.attributes.value,
        },
      })

      // Log success and send response
      logger.info("Metadata pinned successfully", {ipfsHash: metadata.IpfsHash});
      return {metadataUrl: `ipfs://${metadata.IpfsHash}`};
  } catch (error) {
      // Log error and send error response
      logger.error("Error pinning file to Pinata", error);
      throw new HttpsError("invalid-argument", `${error}`);
  }
});
