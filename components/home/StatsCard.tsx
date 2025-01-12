import React, { useState, useEffect } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import { useAccount } from "wagmi";
interface StatsCardProps {
  title: string;
  valueLoader?: () => Promise<number>; // Function for one-time fetching
  streamLoader?: (callback: (value: number) => void) => Promise<() => void>; // Function for real-time streaming
  subtitle: string;
  gradientColors: [string, string, string];
  color: "red" | "blue";
}

const GradientView: React.FC<{
  colors: [string, string, string];
  style?: any;
  children: React.ReactNode;
}> = React.memo(({ colors, style, children }) => (
  <LinearGradient
    colors={colors}
    start={{ x: 1, y: 0 }}
    end={{ x: 1, y: 1 }}
    style={[styles.gradientView, style]}
  >
    <View style={styles.innerContent}>{children}</View>
  </LinearGradient>
));

export const StatsCard: React.FC<StatsCardProps> = React.memo(
  ({ title, valueLoader, streamLoader, subtitle, color, gradientColors }) => {
    const [loading, setLoading] = useState(true);
    const [value, setValue] = useState<number>(0);
    const { address } = useAccount();

    useEffect(() => {
      let unsubscribe: (() => void) | undefined;
      let isMounted = true;
      let timeoutId: NodeJS.Timeout;

      const loadValue = async () => {
        if (valueLoader) {
          // One-time fetch
          setLoading(true);
          try {
            const result = await valueLoader();
            if (isMounted) {
              setValue(result);
            }
          } catch (error) {
            console.error("Error loading value:", error);
          } finally {
            if (isMounted) {
              setLoading(false);
            }
          }
        } else if (streamLoader) {
          // Real-time streaming
          setLoading(true);
          try {
            unsubscribe = await streamLoader((newValue) => {
              // Delay the update by 2 seconds
              timeoutId = setTimeout(() => {
                if (isMounted) {
                  setValue(newValue);
                  setLoading(false);
                }
              }, 2000); // 2-second delay
            });
          } catch (error) {
            console.error("Error streaming value:", error);
            setLoading(false);
          }
        }
      };

      loadValue();

      return () => {
        isMounted = false;
        if (unsubscribe) {
          unsubscribe();
        }
        clearTimeout(timeoutId); // Clear any pending timeouts
      };
    }, [streamLoader]);

    const badgeBackgroundColor = color === "blue" ? "#61A0FF" : "#FF6161";
    const badgeTextColor = "#fff";
    return (
      <GradientView colors={gradientColors} style={styles.statsCard}>
        <View style={styles.statsContent}>
          <View
            style={[
              styles.badgeContainer,
              { backgroundColor: badgeBackgroundColor },
            ]}
          >
            <Text style={[styles.badgeText, { color: badgeTextColor }]}>
              {title}
            </Text>
          </View>
          <View style={styles.valueContainer}>
            {loading ? (
              <View style={styles.shimmerBox} />
            ) : (
              <Text style={styles.statsValue}>{value}</Text>
            )}
          </View>
          <Text style={styles.statsSubtitle}>{subtitle}</Text>
        </View>
      </GradientView>
    );
  }
);

const styles = StyleSheet.create({
  gradientView: {
    borderRadius: 24,
    padding: 1.7,
  },
  innerContent: {
    backgroundColor: "#fff",
    borderRadius: 22,
    overflow: "hidden",
  },
  statsCard: {
    flex: 1,
  },
  statsContent: {
    padding: 12,
    alignItems: "flex-start",
  },
  badgeContainer: {
    backgroundColor: "#FFE5E5",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
    marginBottom: 16,
  },
  badgeText: {
    // fontWeight: "500",
    fontFamily: "CabinetGrotesk-Extrabold",
  },
  valueContainer: {
    height: 48, // Fixed height to prevent layout shift
    justifyContent: "center",
    marginBottom: 2,
  },
  statsValue: {
    fontSize: 40,
    // fontWeight: "bold",
    fontFamily: "CabinetGrotesk-Extrabold",
    color: "#000",
    lineHeight: 48, // Match the container height
  },
  statsSubtitle: {
    color: "#8B8A8A",
    fontSize: 15,
    fontFamily: "CabinetGrotesk-Medium",
  },
  shimmerBox: {
    width: 60, // Fixed width that can accommodate most numbers
    height: 40,
    backgroundColor: "#F3F3F3",
    borderRadius: 8,
  },
});
