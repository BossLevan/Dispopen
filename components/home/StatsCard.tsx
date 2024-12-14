import { LinearGradient } from "expo-linear-gradient";
import { View, Text, StyleSheet } from "react-native";

interface StatsCardProps {
  title: string;
  value: string;
  subtitle: string;
  gradientColors: [string, string, string];
  color: "red" | "blue";
}

const GradientView: React.FC<{
  colors: [string, string, string];
  style?: any;
  children: React.ReactNode;
}> = ({ colors, style, children }) => (
  <LinearGradient
    colors={colors}
    start={{ x: 1, y: 0 }}
    end={{ x: 1, y: 1 }}
    style={[styles.gradientView, style]}
  >
    <View style={styles.innerContent}>{children}</View>
  </LinearGradient>
);

export const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  subtitle,
  color,
  gradientColors,
}) => (
  <GradientView colors={gradientColors} style={styles.statsCard}>
    <View style={styles.statsContent}>
      <View
        style={[
          styles.badgeContainer,
          { backgroundColor: color === "blue" ? "#61A0FF" : "#FF6161" },
        ]}
      >
        <Text
          style={[
            styles.badgeText,
            { color: color === "blue" ? "#fff" : "#fff" },
          ]}
        >
          {title}
        </Text>
      </View>
      <Text style={styles.statsValue}>{value}</Text>
      <Text style={styles.statsSubtitle}>{subtitle}</Text>
    </View>
  </GradientView>
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
    color: "#FF4545",
    fontWeight: "500",
    fontFamily: "CabinetGrotesk-Extrabold",
  },
  statsValue: {
    fontSize: 40,
    fontWeight: "bold",
    fontFamily: "CabinetGrotesk-Extrabold",
    color: "#000",
  },
  statsSubtitle: {
    color: "#8B8A8A",
    fontSize: 15,
    fontFamily: "CabinetGrotesk-Medium",
  },
});
