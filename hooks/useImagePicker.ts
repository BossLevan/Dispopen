// hooks/useImagePicker.ts
import * as ImagePicker from "expo-image-picker";
import { Alert } from "react-native";
import { useRouter } from "expo-router";

export const useImagePicker = () => {
  const router = useRouter();

  const openCamera = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission Required", "Camera permission is needed.");
      return;
    }
    const result = await ImagePicker.launchCameraAsync();
    if (!result.canceled) {
      router.push({
        pathname: "/(home)/(create)/edit_screen",
        params: { image: result.assets[0].uri },
      });
    }
  };

  const openImageLibrary = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission Required", "Media Library permission is needed.");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync();
    if (!result.canceled) {
      router.push({
        pathname: "/(home)/(create)/edit_screen",
        params: { image: result.assets[0].uri },
      });
    }
  };

  return { openCamera, openImageLibrary };
};
