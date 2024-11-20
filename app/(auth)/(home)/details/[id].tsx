import { useRouter } from "expo-router";
import { View, StyleSheet } from "react-native";
import NFTModalDisplay from "@/components/NftModal"; // Adjust the import path as needed
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function NFTModalScreen() {
  const router = useRouter();

  const handleDismiss = () => {
    router.back(); // This will dismiss the modal and return to the previous screen
  };

  return (
    <View style={styles.container}>
      <NFTModalDisplay
      // onDismiss={() => {
      //   handleDismiss;
      // }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent background
  },
});
