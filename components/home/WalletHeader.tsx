import React, { useEffect, useRef } from "react";
import { View, Text, Pressable, StyleSheet, Animated } from "react-native";
import { Wallet, Settings } from "lucide-react-native";
import { prettyWalletAddress } from "@/utils/pretty_wallet";

interface WalletHeaderProps {
  address: string | undefined;
  onWalletPress: () => void;
  onSettingsPress: () => void;
}

export const WalletHeader: React.FC<WalletHeaderProps> = ({
  address,
  onWalletPress,
  onSettingsPress,
}) => {
  const pulseAnim = useRef(new Animated.Value(0.5)).current;
  const shimmerAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0.5,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );
    pulse.start();

    const shimmer = Animated.loop(
      Animated.sequence([
        Animated.timing(shimmerAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(shimmerAnim, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );
    shimmer.start();

    return () => {
      pulse.stop();
      shimmer.stop();
    };
  }, [pulseAnim, shimmerAnim]);

  const renderAddress = () => {
    if (address === undefined) {
      return (
        <Animated.View
          style={[
            styles.shimmer,
            {
              opacity: shimmerAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0.3, 0.8],
              }),
            },
          ]}
        />
      );
    }

    const { prefix, suffix, dots } = prettyWalletAddress(address);
    return (
      <Text style={styles.headerTitle}>
        <Text style={styles.prefixText}>{prefix}</Text>
        <Text style={styles.dotsText}>{dots}</Text>
        <Text style={styles.suffixText}>{suffix}</Text>
      </Text>
    );
  };

  return (
    <View style={styles.header}>
      <View style={styles.addressContainer}>
        {renderAddress()}
        {address && (
          <View style={styles.connectedWrapper}>
            <View style={styles.connectedContainer}>
              <Animated.View style={[styles.dot, { opacity: pulseAnim }]} />
              <Text style={styles.connectedText}>Active</Text>
            </View>
          </View>
        )}
      </View>
      <View style={styles.iconContainer}>
        <Pressable onPress={onWalletPress} style={styles.iconButton}>
          <Wallet width={24} height={24} color="#000" strokeWidth={2.2} />
        </Pressable>
        <Pressable onPress={onSettingsPress} style={styles.iconButton}>
          <Settings width={24} height={24} color="#000" strokeWidth={2.2} />
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#f5f5f5",
  },
  addressContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginRight: 8,
    fontFamily: "CabinetGrotesk-Extrabold",
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#4CAF50",
    marginRight: 6,
  },
  connectedText: {
    fontSize: 13,
    color: "#4CAF50",
    fontFamily: "CabinetGrotesk-Bold",
  },
  iconContainer: {
    flexDirection: "row",
  },
  iconButton: {
    padding: 8,
    marginLeft: 8,
  },
  connectedWrapper: {
    borderWidth: 1,
    borderColor: "#4CAF50",
    borderRadius: 12,
    overflow: "hidden",
  },
  connectedContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E8F5E9",
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  prefixText: {
    color: "#333",
  },
  suffixText: {
    color: "#333",
  },
  dotsText: {
    color: "#C5C5C5",
  },
  shimmer: {
    width: 150,
    height: 24,
    backgroundColor: "#E0E0E0",
    borderRadius: 4,
    marginRight: 8,
  },
});

export default WalletHeader;
