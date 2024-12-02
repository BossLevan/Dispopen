import React, { useRef, useImperativeHandle, forwardRef } from "react";
import { View, Image, StyleSheet, ImageSourcePropType } from "react-native";
import ViewShot, { captureRef } from "react-native-view-shot";

export interface CompositeImageProps {
  id: string;
  selectedImage: string;
  frameImageUri: string;
  frameSize: number;
  title: string;
  artist: string;
  onExport: (uri: string) => void;
}

export interface CompositeImageRef {
  exportImage: () => Promise<string>;
}

export const CompositeImage = forwardRef<
  CompositeImageRef,
  CompositeImageProps
>(({ selectedImage, frameImageUri, frameSize, onExport }, ref) => {
  const imageRef = useRef<View>(null);

  const innerImageSize = frameSize * 0.5; // 55% of frame size
  const innerImagePosition = (frameSize - innerImageSize) / 2; // Centered vertically and horizontally

  const captureImage = async (): Promise<string> => {
    try {
      const uri = await captureRef(imageRef, {
        height: frameSize,
        width: frameSize,
        quality: 1,
        format: "jpg",
      });
      onExport(uri);
      return uri;
    } catch (error) {
      console.error("Failed to capture image:", error);
      throw error;
    }
  };

  useImperativeHandle(ref, () => ({
    exportImage: captureImage,
  }));

  return (
    <View ref={imageRef}>
      <View style={[styles.container, { width: frameSize, height: frameSize }]}>
        {/* Frame Background */}
        <Image
          source={{ uri: frameImageUri }}
          style={[styles.frameImage, { width: frameSize, height: frameSize }]}
        />

        {/* Selected Image Overlay */}
        {selectedImage && (
          <View
            style={[
              styles.selectedImageContainer,
              {
                width: innerImageSize,
                height: innerImageSize,
                top: innerImagePosition,
                left: innerImagePosition,
              },
            ]}
          >
            <Image
              source={{ uri: selectedImage }}
              style={styles.selectedImage}
            />
          </View>
        )}
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    position: "relative",
    backgroundColor: "transparent",
  },
  frameImage: {
    position: "absolute",
    resizeMode: "contain",
    backgroundColor: "transparent",
  },
  selectedImageContainer: {
    position: "absolute",
    overflow: "hidden",
    // borderRadius: 8, // Optional: Adds rounded corners to the overlay
  },
  selectedImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
});
