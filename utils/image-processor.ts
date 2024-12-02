import * as ImageManipulator from 'expo-image-manipulator';
import { Asset } from 'expo-asset';

const customFrames = {
  white: require('../assets/frames/'),
  gold: require('../assets/frames/gold-frame.png'),
  vintage: require('../assets/frames/vintage-frame.png'),
};

type FrameType = keyof typeof customFrames;

/**
 * Combines the user's image with a frame to generate a framed image.
 * @param imageUri - The URI of the user's image.
 * @param frameType - The type of frame (default is 'white').
 * @returns The URI of the final framed image.
 */
export async function createFramedImage(
  imageUri: string,
  frameType: FrameType = 'white'
): Promise<string> {
  try {
    // 1. Load the selected frame asset
    const frameAsset = await Asset.loadAsync(customFrames[frameType]);
    const frameUri = frameAsset[0].localUri || frameAsset[0].uri;

    if (!frameUri) {
      throw new Error('Could not load frame asset');
    }

    // 2. Get frame dimensions (assuming it's square)
    const frameDimensions = await ImageManipulator.manipulateAsync(frameUri, []);
    const frameWidth = frameDimensions.width || 1024; // Fallback size
    const frameHeight = frameDimensions.height || 1024; // Fallback size

    // 3. Resize user's image to fit within 80% of the frame
    const imageSize = Math.min(frameWidth, frameHeight) * 0.8;

    const resizedImage = await ImageManipulator.manipulateAsync(
      imageUri,
      [{ resize: { width: imageSize, height: imageSize } }],
      { format: ImageManipulator.SaveFormat.PNG }
    );

    // 4. Create a blank canvas with the same dimensions as the frame
    const canvasWithUserImage = await ImageManipulator.manipulateAsync(
      resizedImage.uri,
      [
        {
          resize: { width: frameWidth, height: frameHeight },
        },
        {
          crop: {
            originX: (frameWidth - imageSize) / 2,
            originY: (frameHeight - imageSize) / 2,
            width: imageSize,
            height: imageSize,
          },
        },
      ],
      { format: ImageManipulator.SaveFormat.PNG }
    );

    // 5. Merge: Composite the frame with the resized image
    const finalImage = await ImageManipulator.manipulateAsync(
      frameUri,
      [
        { resize: { width: frameWidth, height: frameHeight } },
        {
          crop: {
            originX: 0,
            originY: 0,
            width: frameWidth,
            height: frameHeight,
          },
        },
      ],
      { format: ImageManipulator.SaveFormat.PNG }
    );

    return finalImage.uri; // Returns the final framed image
  } catch (error) {
    console.error('Error creating framed image:', error);
    throw error;
  }
}
