import React from "react";
import { View, StyleSheet, Dimensions, Animated } from "react-native";

const { width } = Dimensions.get("window");
const cardWidth = width * 0.5; // Adjust this value to match your card width

interface DispopenCardSkeletonProps {
  animatedValue: Animated.Value;
}

export const DispopenCardSkeleton: React.FC<DispopenCardSkeletonProps> = ({
  animatedValue,
}) => {
  const translateX = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [-cardWidth, cardWidth],
  });

  return (
    <View style={styles.card}>
      <View style={styles.imageContainer}>
        <View style={styles.image} />
        <Animated.View
          style={[styles.shimmer, { transform: [{ translateX }] }]}
        />
      </View>
      <View style={styles.textContainer}>
        {/* <View style={styles.titleSkeleton} /> */}
        <View style={styles.subtitleSkeleton} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: cardWidth,
    marginRight: 12,
    borderRadius: 12,
    backgroundColor: "#f0f0f0",
    overflow: "hidden",
  },
  imageContainer: {
    height: cardWidth,
    backgroundColor: "#e0e0e0",
    position: "relative",
    overflow: "hidden",
  },
  image: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#e0e0e0",
  },
  shimmer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    transform: [{ translateX: -cardWidth }],
  },
  textContainer: {
    padding: 12,
  },
  titleSkeleton: {
    height: 16,
    width: "70%",
    backgroundColor: "#e0e0e0",
    marginBottom: 8,
    borderRadius: 4,
  },
  subtitleSkeleton: {
    height: 12,
    width: "70%",
    backgroundColor: "#e0e0e0",
    borderRadius: 4,
  },
});
