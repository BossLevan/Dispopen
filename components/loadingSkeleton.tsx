import React, { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
  ViewStyle,
} from "react-native";
import { ChevronLeft } from "react-native-feather";

const { width } = Dimensions.get("window");

interface AnimatedBoxProps {
  style: ViewStyle;
}

export default function LoadingSkeleton() {
  const animatedValue = new Animated.Value(0);

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(animatedValue, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const translateX = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [-width, width],
  });

  const AnimatedBox: React.FC<AnimatedBoxProps> = ({ style }) => (
    <View style={[styles.shimmerContainer, style]}>
      <Animated.View
        style={[
          styles.shimmer,
          {
            transform: [{ translateX }],
          },
        ]}
      />
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      {/* <View style={styles.header}>
        <View style={styles.backButton}>
          <ChevronLeft width={24} height={24} color="#000" />
          <Text style={styles.backText}>Back</Text>
        </View>
      </View> */}

      {/* Main Image Skeleton */}
      <AnimatedBox style={styles.imageContainer} />

      {/* Title Skeleton */}
      <View style={styles.contentContainer}>
        <AnimatedBox style={styles.titleSkeleton} />

        {/* Creator Info Skeleton */}
        <View style={styles.creatorContainer}>
          <AnimatedBox style={styles.avatarSkeleton} />
          <AnimatedBox style={styles.creatorNameSkeleton} />
        </View>

        {/* Date Skeleton */}
        <AnimatedBox style={styles.dateSkeleton} />

        {/* Stats Skeletons */}
        <View style={styles.statsContainer}>
          <View style={styles.statRow}>
            <AnimatedBox style={styles.statLabelSkeleton} />
            <AnimatedBox style={styles.statValueSkeleton} />
          </View>
          <View style={styles.statRow}>
            <AnimatedBox style={styles.statLabelSkeleton} />
            <AnimatedBox style={styles.statValueSkeleton} />
          </View>
          <View style={styles.statRow}>
            <AnimatedBox style={styles.statLabelSkeleton} />
            <AnimatedBox style={styles.statValueSkeleton} />
          </View>
        </View>

        {/* Footer Text Skeleton */}
        <AnimatedBox style={styles.footerTextSkeleton} />
      </View>

      {/* Share Button Skeleton */}
      {/* <AnimatedBox style={styles.shareButtonSkeleton} /> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 16,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  backText: {
    fontSize: 16,
    marginLeft: 8,
  },
  shimmerContainer: {
    overflow: "hidden",
    backgroundColor: "#E8E8E8",
  },
  shimmer: {
    width: "100%",
    height: "100%",
    backgroundColor: "#F5F5F5",
    opacity: 0.5,
  },
  imageContainer: {
    width: width,
    height: width,
    backgroundColor: "#E8E8E8",
  },
  contentContainer: {
    padding: 16,
  },
  titleSkeleton: {
    height: 32,
    borderRadius: 4,
    marginBottom: 16,
  },
  creatorContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  avatarSkeleton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  creatorNameSkeleton: {
    height: 20,
    width: 200,
    borderRadius: 4,
  },
  dateSkeleton: {
    height: 20,
    width: "100%",
    borderRadius: 4,
    marginBottom: 24,
    alignSelf: "center",
  },
  statsContainer: {
    marginBottom: 24,
  },
  statRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  statLabelSkeleton: {
    height: 20,
    width: 100,
    borderRadius: 4,
  },
  statValueSkeleton: {
    height: 20,
    width: 80,
    borderRadius: 4,
  },
  footerTextSkeleton: {
    height: 40,
    borderRadius: 4,
    marginBottom: 24,
  },
  shareButtonSkeleton: {
    height: 56,
    borderRadius: 28,
    marginHorizontal: 16,
    position: "absolute",
    bottom: 32,
    left: 0,
    right: 0,
  },
});
