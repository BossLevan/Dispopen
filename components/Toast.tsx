import Toast from "react-native-toast-message";
import { View, Text, StyleSheet } from "react-native";
import { Check, CheckCircle, X, XCircle } from "lucide-react-native"; // Importing icons from lucide-react-native

// Toast configuration styled to look like a button
export const toastConfig = {
  success: (props: any) => (
    <View style={[styles.toastContainer, styles.success]}>
      <Check size={20} color="#28a745" style={styles.icon} />
      <Text style={styles.toastText}>{props.text1}</Text>
    </View>
  ),
  error: (props: any) => (
    <View style={[styles.toastContainer, styles.error]}>
      <X size={20} color="#dc3545" style={styles.icon} />
      <Text style={styles.toastText}>{props.text1}</Text>
    </View>
  ),
};

export const showToast = (type: "success" | "error", title: string) => {
  Toast.show({
    type,
    text1: title,
    position: "top",
    visibilityTime: 3000,
  });
};

// Styles for the toast container
const styles = StyleSheet.create({
  toastContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 24,
    backgroundColor: "white",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 2, // For Android shadow
    marginVertical: 10,
    marginHorizontal: 20,
    marginTop: 20,
  },
  success: {
    borderColor: "#28a745",
    // borderWidth: 1,
  },
  error: {
    borderColor: "#dc3545",
    // borderWidth: 1,
  },
  icon: {
    marginRight: 8,
  },
  toastText: {
    fontSize: 16,
    fontWeight: "500",
    fontFamily: "CabinetGrotesk-Bold",
    color: "#333",
  },
});
