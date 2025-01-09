import { useRouter } from "expo-router";
// import { View, StyleSheet } from "react-native";
import NFTModalDisplay from "@/components/NftModal"; // Adjust the import path as needed
import { GestureHandlerRootView } from "react-native-gesture-handler";
import * as DropdownMenu from "zeego/dropdown-menu";

import React, { useRef, useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  NativeSyntheticEvent,
  NativeScrollEvent,
  ActivityIndicator,
  Animated,
  Pressable,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { BadgeCheck } from "lucide-react-native";
import { useNavigation } from "@react-navigation/native";
import { useLocalSearchParams } from "expo-router";
import { convertIpfsToPinataUrl } from "@/utils/ipfs";
import { useZoraTokenCreation } from "@/hooks/useZora";
import { apiService } from "@/api/api";
import LoadingSkeleton from "@/components/loadingSkeleton";
import { formatCountdown } from "@/utils/time";
import { formatUnixTimestamp } from "@/utils/date";
import { parseRawJson } from "@/utils/parseRawJson";
import { MintModal } from "@/components/MintModal";
import { ZoraCreateTokenResponse } from "@/constants/types";
import { showToast } from "@/components/Toast";
import * as Clipboard from "expo-clipboard";
import { dispopenZoraAddress } from "@/constants/constants";
import * as Haptics from "expo-haptics";
import Share from "react-native-share";
import { getZoraDispopenLink } from "@/utils/zora_link";

export default function NFTModalScreen() {
  const navigation = useNavigation();
  const scrollRef = useRef<ScrollView>(null);
  const scrollPosition = useRef(0);
  const { tokenId } = useLocalSearchParams(); // tokenId from the previous page
  const [dispopen, setDispopen] = useState<ZoraCreateTokenResponse | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true); // Loading state
  const [error, setError] = useState<string | null>(null); // Error state
  // In your component:
  const [isModalVisible, setIsModalVisible] = useState(false);

  const scaleAnim = useRef(new Animated.Value(1)).current;

  const options = Platform.select({
    ios: {
      activityItemSources: [
        {
          // For sharing url with custom title.
          placeholderItem: { type: "url", content: "Dispopen" },
          item: {
            default: { type: "url", content: dispopenZoraAddress },
          },
          subject: {
            default: "Share this dispopen on X",
          },
          linkMetadata: { originalUrl: dispopenZoraAddress },
        },
      ],
    },
    default: {
      title: "Dispopen",
      subject: "mint",
      message: `check out this dispopen ${dispopenZoraAddress}`,
    },
  });

  const shareUrlWithMessage = async () => {
    const shareOptions = {
      title: "Share Dispopen",
      message: "Check out this Dispopen",
      url: getZoraDispopenLink(dispopen?.address!),
    };

    try {
      const ShareResponse = await Share.open(shareOptions);
      console.log("Result =>", ShareResponse);
    } catch (error) {
      console.log("Error =>", error);
    }
  };

  const onPressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  };

  const onPressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  useEffect(() => {
    if (tokenId) {
      fetchDispopen(tokenId as string);
    }
  }, [tokenId]);

  useEffect(() => {
    // Log whenever dispopen state changes
    if (dispopen) {
      console.log("Dispopen state updated:", dispopen);
    }
  }, [dispopen]);

  const fetchDispopen = async (id: string) => {
    try {
      setIsLoading(true);
      const response = await apiService.getDispopen(id);
      setDispopen(response);
    } catch (error) {
      console.error("Error fetching Dispopen:", error);
      setError("Failed to fetch Dispopen data.");
    } finally {
      setIsLoading(false);
    }
  };

  // Parse the token object back to JSON
  // const parsedToken = JSON.parse(token as string);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    scrollPosition.current = event.nativeEvent.contentOffset.y;
  };

  const handleTouchStart = () => {
    // Only enable navigation gestures when we're at the top of the scroll
    if (scrollPosition.current <= 0) {
      navigation.setOptions({ gestureEnabled: true });
    } else {
      navigation.setOptions({ gestureEnabled: false });
    }
  };

  const router = useRouter();

  const handleDismiss = () => {
    router.back(); // This will dismiss the modal and return to the previous screen
  };

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  if (error) {
    return (
      <View style={{ justifyContent: "center", alignSelf: "center" }}>
        <Text>Failed to fetch dispopens. {error}</Text>
      </View>
    );
  }

  const handleOnSelectContextMenuItem = async () => {
    // await Clipboard.setStringAsync(dispopenZoraAddress as string);
    // // Share.open(options)
    // //   .then((res) => {
    // //     console.log(res);
    // //   })
    // //   .catch((err) => {
    // //     err && console.log(err);
    // //   });
    // showToast("success", "Copied Link");
  };
  return (
    <SafeAreaView style={styles.container}>
      {/* <TouchableOpacity
        style={styles.dismissHandle}
        onPress={() => navigation.goBack()}
      >
        <View style={styles.handle} />
      </TouchableOpacity> */}

      <ScrollView
        ref={scrollRef}
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        onTouchStart={handleTouchStart}
        bounces={scrollPosition.current <= 0} // Only bounce when at top
      >
        <View style={styles.header} />
        <View style={styles.imageContainer}>
          {!isLoading ? (
            <Image
              source={{
                uri: convertIpfsToPinataUrl(dispopen?.metadata.image!),
              }}
              style={styles.image}
              accessibilityLabel="NFT artwork"
            />
          ) : (
            <ActivityIndicator size="large" color="#0000ff" /> // Fallback UI while image is loading or unavailable
          )}
        </View>
        <View style={styles.artistInfoHeader}>
          <View>
            <Text style={styles.title}>
              {dispopen?.salesStrategies[0].zoraTimedMinter.erc20Z.name}
            </Text>

            <View style={styles.artistInfo}>
              <View style={styles.artistIcon}>
                <Image
                  source={{ uri: "https://picsum.photos/200" }}
                  style={styles.artistImage}
                />
              </View>
              <Text style={styles.artistName}>
                <Text style={styles.artistNameBold}>
                  {parseRawJson(dispopen?.metadata.rawJson!).frameName ??
                    "Default"}
                </Text>{" "}
                by {`${parseRawJson(dispopen?.metadata.rawJson!).artistName}`}
              </Text>
              <BadgeCheck fill="#61A0FF" stroke="#fff" />
            </View>
          </View>

          <DropdownMenu.Root>
            <DropdownMenu.Trigger>
              <TouchableOpacity style={styles.moreButton}>
                <Ionicons name="ellipsis-horizontal" size={24} color="black" />
              </TouchableOpacity>
            </DropdownMenu.Trigger>

            <DropdownMenu.Content>
              {/* <DropdownMenu.Label>Options</DropdownMenu.Label> */}
              <DropdownMenu.Item
                key="Share Dispopen"
                onSelect={shareUrlWithMessage}
              >
                <DropdownMenu.ItemTitle>Share Dispopen</DropdownMenu.ItemTitle>
                <DropdownMenu.ItemIcon
                  ios={{
                    name: "square.and.arrow.up", // required
                    pointSize: 15,
                    weight: "semibold",
                    scale: "medium",
                    // hierarchicalColor: "#000",
                  }}
                ></DropdownMenu.ItemIcon>
              </DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu.Root>

          {/* <TouchableOpacity style={styles.moreButton}>
            <Ionicons name="ellipsis-horizontal" size={24} color="black" />
          </TouchableOpacity> */}
        </View>
        <View style={styles.creationInfo}>
          <Text style={styles.creationDate}>
            Created on {formatUnixTimestamp(dispopen?.timestamp!)}
          </Text>
        </View>
        <View style={styles.mintInfo}>
          <View style={styles.mintRow}>
            <Text style={styles.mintLabel}>Mints</Text>
            <Text style={styles.mintValue}>{dispopen?.totalMinted}</Text>
          </View>
          {Number.parseInt(dispopen?.totalMinted!) > 1111 && (
            <View style={styles.mintRow}>
              <Text style={styles.mintLabel}>Minting Ends</Text>
              <Text style={styles.mintValue}>
                {formatCountdown(
                  dispopen?.salesStrategies[0].zoraTimedMinter.marketCountdown!
                )}
              </Text>
            </View>
          )}
          <View style={styles.mintRow}>
            <Text style={styles.mintLabel}>Ticker</Text>
            <Text style={styles.mintValue}>
              {dispopen?.salesStrategies[0].zoraTimedMinter.erc20Z.symbol}
            </Text>
          </View>
        </View>
        <Text style={styles.disclaimer}>
          This dispopen is minted on the base network.{" "}
          <Text style={styles.learnMore}>Learn more</Text>
        </Text>
        <MintModal
          visible={isModalVisible}
          onClose={() => setIsModalVisible(false)}
          tokenContract={dispopen?.address as `0x${string}`}
        />
      </ScrollView>

      <View style={styles.footer}>
        <Animated.View
          style={[
            // styles.buttonContainer,
            { transform: [{ scale: scaleAnim }] },
          ]}
        >
          <Pressable
            style={styles.shareButton}
            onPressIn={onPressIn}
            onPressOut={onPressOut}
            onPress={() => setIsModalVisible(true)}
          >
            <Text style={styles.shareButtonText}>Mint to Curate</Text>
          </Pressable>
        </Animated.View>
        {/* <Pressable
          style={styles.shareButton}
          onPressIn={onPressIn}
          onPressOut={onPressOut}
        >
          <Text style={styles.shareButtonText}>Mint</Text>
        </Pressable> */}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    // borderTopLeftRadius: 12,
    // borderTopRightRadius: 12,
  },
  dismissHandle: {
    alignItems: "center",
    paddingVertical: 10,
  },
  buttonContainer: {
    width: "100%",
    marginBottom: 32,
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: "#E5E5EA",
    borderRadius: 2,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    marginBottom: 16,
  },
  moreButton: {
    padding: 8,
  },
  imageContainer: {
    aspectRatio: 1,
    width: "84%",
    alignSelf: "center",
    backgroundColor: "#F2F2F7",
    borderRadius: 6,
    // overflow: "hidden",
    marginBottom: 16,
    // iOS shadow properties
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 15,
    // Android shadow (elevation)
    elevation: 10, // Adjust as necessary
  },
  image: {
    width: "100%",
    height: "100%",
  },
  artistImage: {
    width: "100%",
    height: "100%",
    borderRadius: 100,
  },
  title: {
    fontSize: 21,
    fontWeight: "bold",
    fontFamily: "CabinetGrotesk-Bold",
    marginBottom: 8,
  },
  artistInfoHeader: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignContent: "center",
    marginTop: 24,
  },
  artistInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  artistIcon: {
    width: 24,
    height: 24,
    borderRadius: 64,
    backgroundColor: "#FF3B30",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  artistName: {
    fontSize: 17,
    fontFamily: "CabinetGrotesk-Medium",
    marginRight: 4,
    color: "#8E8E93",
    fontWeight: "500",
  },
  artistNameBold: {
    fontWeight: "600",
    fontFamily: "CabinetGrotesk-Bold",
    color: "#434343",
  },
  creationInfo: {
    backgroundColor: "#F2F2F7",
    borderRadius: 64,
    padding: 12,
    alignItems: "center",
    marginBottom: 24,
  },
  creationDate: {
    color: "#8E8E93",
    fontSize: 17,
    fontFamily: "CabinetGrotesk-Medium",
    fontWeight: "500",
  },
  mintInfo: {
    marginBottom: 16,
    gap: 8,
  },
  mintRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  mintLabel: {
    color: "#8E8E93",
    fontSize: 17,
    fontFamily: "CabinetGrotesk-Medium",
  },
  mintValue: {
    fontWeight: "600",
    fontSize: 17,
    fontFamily: "CabinetGrotesk-Bold",
  },
  disclaimer: {
    fontSize: 14,
    color: "#8E8E93",
    textAlign: "center",
    fontFamily: "CabinetGrotesk-Regular",
    marginBottom: 20,
  },
  learnMore: {
    color: "#007AFF",
  },
  footer: {
    padding: 16,
    // position: "absolute",
    // // bottom: 0,
    borderTopWidth: 1,
    borderTopColor: "#E5E5EA",
  },
  shareButton: {
    backgroundColor: "#000",
    borderRadius: 64,
    padding: 16,
    alignItems: "center",
  },
  shareButtonText: {
    color: "#fff",
    fontSize: 18,
    fontFamily: "CabinetGrotesk-Bold",
    fontWeight: "600",
  },
  shadowProp: {
    shadowColor: "#171717",
    shadowOffset: { width: -2, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
});
