import React from "react";
import { View, Image, StyleSheet, Dimensions } from "react-native";

// Get screen dimensions for responsive sizing
const { width } = Dimensions.get("window");

// Define the type of props for the component
interface CompositeImageProps {
  frameSource: string;
  imageSource: string;
}

const CompositeImage: React.FC<CompositeImageProps> = ({
  frameSource,
  imageSource,
}) => {
  return (
    <View style={styles.container}>
      {/* Frame Image */}
      <Image
        source={{ uri: frameSource }}
        style={styles.frame}
        resizeMode="contain"
      />

      {/* Wrapper for centering the inner image */}
      <View style={styles.innerImageWrapper}>
        {/* Actual Image Positioned Inside */}
        <Image
          source={{ uri: imageSource }}
          style={styles.innerImage}
          resizeMode="cover"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: width * 0.42, // Adjust frame width based on screen size
    aspectRatio: 1, // Keep frame square
    alignItems: "center",
    justifyContent: "center",
  },
  frame: {
    width: "100%",
    height: "100%",
    position: "absolute",
  },
  innerImageWrapper: {
    width: "50%", // Inner image width relative to the container
    height: "50%", // Inner image height relative to the container
    alignItems: "center",
    justifyContent: "center",
  },
  innerImage: {
    width: "100%", // Adjust size to fit within the wrapper
    height: "100%",
    // borderRadius: 15, // Smooth edges
  },
});

export default CompositeImage;
