import { BadgeCheck } from "lucide-react-native";
import { View, Text, StyleSheet, Image, Dimensions } from "react-native";

export interface DispopenCardProps {
  author: string;
  image: string;
  progress: number;
}

export const DispopenCard: React.FC<DispopenCardProps> = ({
  author,
  image,
  progress,
}) => (
  <View style={styles.dispopenCardContainer}>
    <View style={styles.authorContainer}>
      <Text style={styles.authorText}>
        by <Text style={styles.byText}>{author}</Text>
      </Text>
      <BadgeCheck fill="#61A0FF" stroke="#fff" size={20} />
    </View>
    <View style={styles.dispopenCard}>
      <Image source={{ uri: image }} style={styles.dispopenImage} />
    </View>
    <View style={styles.progressContainer}>
      <View
        style={[
          styles.progressBar,
          {
            width: `${
              progress != (0 * 100) / 1111
                ? (progress + 20 * 100) / 1111
                : (20 * 100) / 1111
            }%`,
          }, //eveything over 1111 tokens (default graduation mint)
        ]}
      />
    </View>
    <Text style={styles.progressText}>
      {((progress * 100) / 1111).toFixed()}%
    </Text>
  </View>
);

const styles = StyleSheet.create({
  dispopenCardContainer: {
    width: Dimensions.get("window").width * 0.5,
    marginRight: 12,
  },
  dispopenCard: {
    width: "100%",
    aspectRatio: 1,
    marginBottom: 12,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#E7E7E7",
    borderRadius: 24,
  },
  authorContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
    marginBottom: 8,
  },
  byText: {
    color: "#666",
    fontFamily: "CabinetGrotesk-Bold",
    fontSize: 15,
  },
  authorText: {
    color: "#AAAAAA",
    fontFamily: "CabinetGrotesk-Bold",
    fontSize: 15,
  },
  dispopenImage: {
    width: "100%",
    aspectRatio: 1,
    borderRadius: 24,
    marginBottom: 12,
  },
  progressContainer: {
    width: Dimensions.get("window").width * 0.5,
    height: 8,
    backgroundColor: "#EBEBEB",
    borderRadius: 100,
    marginBottom: 4,
  },
  progressBar: {
    height: "100%",
    backgroundColor: "#FF4545",
    borderRadius: 100,
  },
  progressText: {
    fontSize: 13,
    color: "#666",
    fontFamily: "CabinetGrotesk-Bold",
  },
});
