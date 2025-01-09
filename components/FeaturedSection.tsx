import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
  useMemo,
} from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Dimensions,
  Animated,
  ViewToken,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Token } from "@/constants/types";
import { apiService } from "@/api/api";
import { DispopenCardSkeleton } from "./DispopenCardSkeleton";

interface FeaturedSectionProps {
  address: `0x${string}`;
  renderDispopenCard: (props: {
    item: Token;
    index: number;
  }) => React.ReactElement;
  onViewableItemsChanged?: (info: {
    viewableItems: any[];
    changed: any[];
  }) => void;
}

export const FeaturedSection: React.FC<FeaturedSectionProps> = ({
  renderDispopenCard,
  onViewableItemsChanged,
  address,
}) => {
  const featuredRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [featuredDispopens, setFeaturedDispopens] = useState<Token[]>([]);
  const shimmerAnimation = useRef(new Animated.Value(0)).current;

  const fetchFeaturedDispopens = useCallback(async () => {
    setIsLoading(true);
    if (!address) {
      setFeaturedDispopens([]);
      setIsLoading(false);
      return 0;
    }
    try {
      const fetchedImages = await apiService.getFeaturedDispopens();
      setFeaturedDispopens(fetchedImages);
      return fetchedImages.length;
    } catch (error) {
      console.error("Error fetching featured dispopens:", error);
      setFeaturedDispopens([]);
      return 0;
    } finally {
      setIsLoading(false);
    }
  }, [address]);

  useEffect(() => {
    fetchFeaturedDispopens();
  }, [fetchFeaturedDispopens]);

  useEffect(() => {
    const shimmering = Animated.loop(
      Animated.timing(shimmerAnimation, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      })
    );
    shimmering.start();

    return () => shimmering.stop();
  }, [shimmerAnimation]);

  const renderSkeletonItem = useCallback(
    () => <DispopenCardSkeleton animatedValue={shimmerAnimation} />,
    [shimmerAnimation]
  );

  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Featured</Text>
        {/* <Ionicons name="information-circle-outline" size={24} color="#666" /> */}
      </View>
      <Text style={styles.sectionSubtitle}>
        Curate into the official collection (coming soon)
        {/* Selected dispopens for you to curate into the{" "}
        <Text style={styles.highlightText}>premier dispopen</Text> collection */}
      </Text>

      {isLoading ? (
        <FlatList
          data={[1, 2, 3]} // Render 3 skeleton items
          renderItem={renderSkeletonItem}
          keyExtractor={(item) => `skeleton-${item}`}
          horizontal
          onViewableItemsChanged={onViewableItemsChanged}
          showsHorizontalScrollIndicator={false}
          viewabilityConfig={{ itemVisiblePercentThreshold: 50 }}
          contentContainerStyle={styles.horizontalScroll}
        />
      ) : featuredDispopens.length > 0 ? (
        <FlatList
          ref={featuredRef}
          data={featuredDispopens}
          renderItem={renderDispopenCard}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          snapToInterval={Dimensions.get("window").width * 0.5 + 12} // Card width + margin
          snapToAlignment="start"
          decelerationRate="fast"
          onViewableItemsChanged={onViewableItemsChanged} // Always pass consistent value
          viewabilityConfig={{ itemVisiblePercentThreshold: 50 }}
          contentContainerStyle={styles.horizontalScroll}
        />
      ) : (
        <Text style={styles.noDataText}>No featured dispopens available</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 19,
    fontWeight: "bold",
    fontFamily: "CabinetGrotesk-Extrabold",
  },
  sectionSubtitle: {
    color: "#8B8A8A",
    marginBottom: 16,
    paddingHorizontal: 16,
    fontSize: 15,
    fontFamily: "CabinetGrotesk-Medium",
    lineHeight: 22,
  },
  highlightText: {
    color: "#FF4545",
    fontFamily: "CabinetGrotesk-Bold",
  },
  horizontalScroll: {
    paddingLeft: 16,
  },
  noDataText: {
    paddingHorizontal: 16,
    fontSize: 16,
    color: "#666",
    justifyContent: "center",
    alignContent: "center",
    alignSelf: "center",
    fontFamily: "CabinetGrotesk-Medium",
  },
});
