// hooks/useActionSheetHandlers.ts
import { ActionSheetIOS, Alert, Platform } from "react-native";
import { useState } from "react";
import { useSession } from "@/components/ctx";
import * as Storage from "@/utils/storage_visit_name";

export const useActionSheetHandlers = (openCamera: () => void, openImageLibrary: () => void) => {
  const [isAndroidMenuVisible, setIsAndroidMenuVisible] = useState(false);
  const [isSettingsMenuVisible, setIsSettingsMenuVisible] = useState(false);
  const { signOut } = useSession();

  const handleFabPress = () => {
    if (Platform.OS === "ios") {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: ["Cancel", "Take Photo", "Choose from Library"],
          cancelButtonIndex: 0,
        },
        (buttonIndex) => {
          if (buttonIndex === 1) openCamera();
          if (buttonIndex === 2) openImageLibrary();
        }
      );
    } else {
      setIsAndroidMenuVisible(true);
    }
  };

  const handleSettingsPress = () => {
    if (Platform.OS === "ios") {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: ["Cancel", "Terms and Privacy", "Sign Out", "Delete Account"],
          destructiveButtonIndex: 3,
          cancelButtonIndex: 0,
        },
        (buttonIndex) => {
          if (buttonIndex === 1) {
            // Navigate to Terms and Privacy
          } else if (buttonIndex === 2) {
            // Sign out logic
            handleSignOut()
          } else if (buttonIndex === 3) {
            // Delete account logic
            handleDeleteAccount()
          }
        }
      );
    } else {
      setIsSettingsMenuVisible(true);
    }
  };

    const handleSignOut = () => {
    // Implement sign out logic here
    const signOutWell = async () =>{
    signOut() 
    await Storage.Storage.clearStorage()
    Alert.alert("Sign Out", "You have been signed out.");
    }

    signOutWell()
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      "Delete Account",
      "Are you sure you want to delete your account? This action cannot be undone.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            // Implement delete account logic here
            Alert.alert("Account Deleted", "Your account has been deleted.");
          },
        },
      ]
    );
  };


  return { handleFabPress, handleSettingsPress, isAndroidMenuVisible, isSettingsMenuVisible, setIsAndroidMenuVisible, setIsSettingsMenuVisible };
};
