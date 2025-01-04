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

interface CreatedSectionProps {
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

export const CreatedSection: React.FC<CreatedSectionProps> = ({
  renderDispopenCard,
  onViewableItemsChanged,
  address,
}) => {
  const createdRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [createdDispopens, setCreatedDispopens] = useState<Token[]>([]);
  const shimmerAnimation = useRef(new Animated.Value(0)).current;

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
        <Text style={styles.sectionTitle}>Created</Text>
        <Ionicons name="information-circle-outline" size={24} color="#666" />
      </View>
      <Text style={styles.sectionSubtitle}>dispopens created by you</Text>

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
      ) : createdDispopens.length > 0 ? (
        <FlatList
          ref={createdRef}
          data={createdDispopens}
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
        <Text style={styles.noDataText}>No Created dispopens available</Text>
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
    lineHeight: 19,
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
    fontFamily: "CabinetGrotesk-Medium",
  },
});
