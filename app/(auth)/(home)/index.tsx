// Add this to your existing imports
import { useIsFocused } from "@react-navigation/native";
import { ActivityIndicator, RefreshControl } from "react-native";
import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  Pressable,
  StyleSheet,
  SafeAreaView,
  Platform,
  ActionSheetIOS,
  Modal,
  TouchableOpacity,
  Alert,
  Button,
} from "react-native";
import {
  Settings,
  Plus,
  ChevronRight,
  Camera,
  Image as ImageIcon,
  FileText,
  LogOut,
  Trash2,
} from "react-native-feather";
import { router } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import { useAccount } from "wagmi";
import { useSession } from "@/components/ctx";
import { useZoraTokenCreation } from "@/hooks/useZora";
import { apiService, Token } from "@/api/api";
import { useWallet } from "@/hooks/useWallet";
import { convertIpfsToPinataUrl } from "@/utils/ipfs";

export default function ProfileScreen() {
  const [isAndroidMenuVisible, setIsAndroidMenuVisible] = useState(false);
  const [isSettingsMenuVisible, setIsSettingsMenuVisible] = useState(false);
  const [images, setImages] = useState<Token[]>();
  // Add these new state variables
  const [refreshing, setRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const isFocused = useIsFocused();
  const refreshTimeout = useRef<NodeJS.Timeout>();

  // const images = Array(13).fill(null);
  const { signOut } = useSession();
  const { address } = useAccount();

  const { getToken } = useZoraTokenCreation();

  const {
    connectWallet,
    handleGenerateMessage,
    handleSignMessage,
    handleDisconnect,
    linkWallet,
    message,
    linked,
    privyUser,
  } = useWallet();

  // useEffect(() => {
  //   fetchImages();
  // }, []);

  useEffect(() => {
    if (isFocused) {
      // fetchImages();
      delayedRefresh();
    }
  }, [isFocused]);

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      if (refreshTimeout.current) {
        clearTimeout(refreshTimeout.current);
      }
    };
  }, []);

  const fetchImages = async (): Promise<number> => {
    const imagez = await apiService.getDispopens(address!);
    setImages(imagez);
    return imagez.length;
  };

  // Add this new function for pull-to-refresh
  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    try {
      await fetchImages();
    } catch (error) {
      console.error("Error refreshing images:", error);
    } finally {
      setRefreshing(false);
    }
  }, []);

  const delayedRefresh = useCallback(async () => {
    //make sure its empty not null
    if (images?.length != null) {
    }
    setIsLoading(true);
    let previousLength = images?.length || 0;
    console.log("previousLength)", previousLength);

    // First immediate refresh
    const num = await fetchImages();
    let currentLength = num || 0;
    console.log("currentLength", currentLength);

    // If we found new data, stop here
    if (currentLength > previousLength) {
      setIsLoading(false);
      return;
    }

    // If no new data, try a few more times with delays
    const delays = [6000]; // 3s, 6s, 9s delays

    // Clear any existing timeout
    if (refreshTimeout.current) {
      clearTimeout(refreshTimeout.current);
    }

    // Try refreshing until we find new data or run out of attempts
    for (const delay of delays) {
      refreshTimeout.current = setTimeout(async () => {
        try {
          previousLength = images?.length || 0;
          let num = await fetchImages();
          currentLength = num || 0;

          // If we found new data, stop future refreshes
          if (currentLength > previousLength) {
            if (refreshTimeout.current) {
              clearTimeout(refreshTimeout.current);
            }
            setIsLoading(false);
            return;
          }

          // If this is the last attempt and still no new data
          if (delay === delays[delays.length - 1]) {
            setIsLoading(false);
          }
        } catch (error) {
          console.error("Error in delayed refresh:", error);
          if (delay === delays[delays.length - 1]) {
            setIsLoading(false);
          }
        }
      }, delay);
    }
  }, [images?.length]);

  const handleFabPress = () => {
    if (Platform.OS === "ios") {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: ["Cancel", "Take Photo", "Choose from Library"],
          cancelButtonIndex: 0,
        },
        (buttonIndex) => {
          if (buttonIndex === 1) {
            openCamera();
          } else if (buttonIndex === 2) {
            openImageLibrary();
          }
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
          options: [
            "Cancel",
            "Terms and Privacy",
            "Sign Out",
            "Delete Account",
          ],
          destructiveButtonIndex: 3,
          cancelButtonIndex: 0,
        },
        (buttonIndex) => {
          if (buttonIndex === 1) {
            // Handle Terms and Privacy
            // router.push("/terms-and-privacy");
          } else if (buttonIndex === 2) {
            // Handle Sign Out
            handleSignOut();
          } else if (buttonIndex === 3) {
            // Handle Delete Account
            handleDeleteAccount();
          }
        }
      );
    } else {
      setIsSettingsMenuVisible(true);
    }
  };

  const openCamera = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      alert("Sorry, we need camera permissions to make this work!");
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
      alert("Sorry, we need camera roll permissions to make this work!");
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

  const handleSignOut = () => {
    // Implement sign out logic here
    Alert.alert("Sign Out", "You have been signed out.");
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

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#ff4545"
            colors={["#ff4545"]}
          />
        }
      >
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>kosi.base.eth</Text>
          </View>
          <Pressable
            onPress={handleSettingsPress}
            style={styles.settingsButton}
          >
            <Settings width={24} height={24} color="#000" strokeWidth={3} />
          </Pressable>
        </View>

        <View style={styles.worthContainer}>
          <View style={styles.worthHeader}>
            <Text style={styles.worthTitle}>
              the total worth of dispopens you've created
            </Text>
          </View>

          <View style={styles.valueContainer}>
            <Text style={styles.valuePrefix}>$</Text>
            <Text style={styles.value}>114,976.50</Text>
          </View>

          <View
            style={{ flexDirection: "row", gap: 8, alignItems: "baseline" }}
          >
            <View style={styles.percentageContainer}>
              <Text style={styles.percentageText}>+15.3%</Text>
            </View>
          </View>
        </View>

        <View style={styles.levelContainer}>
          <View style={styles.topRowContainer}>
            <Text style={styles.levelText}>current level: 2</Text>
            <Text style={styles.targetValue}>$150K</Text>
          </View>
          <View style={styles.progressContainer}>
            <View style={styles.progressBar} />
          </View>

          <View style={styles.milestoneContainer}>
            <Text style={styles.milestoneText}>87% to next milestone</Text>
            <Pressable style={styles.viewMilestonesButton}>
              <Text style={styles.viewMilestonesText}>view milestones</Text>
              <ChevronRight
                width={20}
                height={20}
                color="#606060"
                strokeWidth={2}
              />
            </Pressable>
          </View>
        </View>

        <View style={styles.galleryContainer}>
          <View style={styles.galleryHeader}>
            <Text style={styles.galleryTitle}>
              dispopens ({images?.length})
            </Text>
            {isLoading && (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="small" color="#ff4545" />
                <Text style={styles.loadingText}>Syncing...</Text>
              </View>
            )}
          </View>

          <View style={styles.imageGrid}>
            {images?.map((_, index) => (
              <View key={index} style={styles.imageContainer}>
                <Pressable
                  onPress={() => {
                    router.push({
                      pathname: `/(auth)/(home)/details/${index}`,
                      params: { token: JSON.stringify(_), tokenId: _.id },
                    });
                  }}
                >
                  <Image
                    source={{
                      uri: convertIpfsToPinataUrl(_.metadata.image),
                    }}
                    style={styles.image}
                  />
                </Pressable>
              </View>
            ))}
          </View>
        </View>
        <View>
          <Button title="Generate Message" onPress={handleGenerateMessage} />
          <Button title="Disconnect" onPress={handleDisconnect} />

          {Boolean(message) && <Text>{message as string}</Text>}
          <Button title="Logout" onPress={signOut} />
          {Boolean(message) && (
            <Button title="Sign Message" onPress={handleSignMessage} />
          )}
          <Button title="Connect Wallet" onPress={connectWallet} />
          <Button title="Link Wallet with Privy" onPress={linkWallet} />
          <Button
            title="Get Contract"
            onPress={() =>
              getToken("0x0D4e4f7Fa1148fB0CE1A911760b1751B9Ee8e525", 1n)
            }
          />
        </View>
      </ScrollView>

      {/* Floating Action Button */}
      <Pressable style={styles.fab} onPress={handleFabPress}>
        <Plus width={24} height={24} color="#fff" strokeWidth={3} />
      </Pressable>

      {/* Android Menu Modal */}
      <Modal
        transparent={true}
        visible={isAndroidMenuVisible}
        onRequestClose={() => setIsAndroidMenuVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPressOut={() => setIsAndroidMenuVisible(false)}
        >
          <View style={styles.modalContent}>
            <TouchableOpacity
              style={styles.modalOption}
              onPress={() => {
                setIsAndroidMenuVisible(false);
                openCamera();
              }}
            >
              <Camera width={24} height={24} color="#000" />
              <Text style={styles.modalOptionText}>Take Photo</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalOption}
              onPress={() => {
                setIsAndroidMenuVisible(false);
                openImageLibrary();
              }}
            >
              <ImageIcon width={24} height={24} color="#000" />
              <Text style={styles.modalOptionText}>Choose from Library</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Settings Menu Modal (Android) */}
      <Modal
        transparent={true}
        visible={isSettingsMenuVisible}
        onRequestClose={() => setIsSettingsMenuVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPressOut={() => setIsSettingsMenuVisible(false)}
        >
          <View style={styles.modalContent}>
            <TouchableOpacity
              style={styles.modalOption}
              onPress={() => {
                setIsSettingsMenuVisible(false);
                // router.push("/terms-and-privacy");
              }}
            >
              <FileText width={24} height={24} color="#000" />
              <Text style={styles.modalOptionText}>Terms and Privacy</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalOption}
              onPress={() => {
                setIsSettingsMenuVisible(false);
                handleSignOut();
              }}
            >
              <LogOut width={24} height={24} color="#000" />
              <Text style={styles.modalOptionText}>Sign Out</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modalOption, styles.deleteOption]}
              onPress={() => {
                setIsSettingsMenuVisible(false);
                handleDeleteAccount();
              }}
            >
              <Trash2 width={24} height={24} color="#FF3B30" />
              <Text style={[styles.modalOptionText, styles.deleteText]}>
                Delete Account
              </Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F7F7",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  title: {
    fontSize: 24,
    fontFamily: "CabinetGrotesk-Extrabold",
    fontWeight: "700",
  },
  settingsButton: {
    // padding: 8,
  },
  worthContainer: {
    paddingHorizontal: 24,
    alignItems: "center",
  },
  worthHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  worthTitle: {
    fontSize: 16,
    fontFamily: "CabinetGrotesk-Medium",
    color: "#666",
  },
  valueContainer: {
    flexDirection: "row",
    alignItems: "baseline",
    marginTop: 8,
  },
  valuePrefix: {
    fontSize: 32,
    fontWeight: "700",
  },
  value: {
    fontSize: 48,
    fontWeight: "bold",
    fontFamily: "CabinetGrotesk-Bold",
    letterSpacing: -1,
  },
  percentageContainer: {
    backgroundColor: "#D1FFDC",
    borderRadius: 100,
    paddingHorizontal: 8,
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center",
    paddingVertical: 8,
    marginTop: 4,
  },
  percentageText: {
    color: "#00B72B",
    fontWeight: "800",
    fontFamily: "CabinetGrotesk-Bold",
  },
  levelContainer: {
    paddingHorizontal: 20,
    marginTop: 20,
  },
  levelText: {
    fontSize: 16,
    color: "#606060",
    fontFamily: "CabinetGrotesk-Medium",
  },
  progressContainer: {
    height: 8,
    backgroundColor: "#e5e5e5",
    borderRadius: 4,
  },
  topRowContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "baseline",
    marginBottom: 8,
  },
  progressBar: {
    width: "87%",
    height: "100%",
    backgroundColor: "#ff4545",
    borderRadius: 4,
  },
  targetValue: {
    fontSize: 16,
    fontWeight: "600",
    color: "#666",
    fontFamily: "CabinetGrotesk-Medium",
    alignSelf: "flex-end",
  },
  milestoneContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
  },
  milestoneText: {
    color: "#606060",
    fontFamily: "CabinetGrotesk-Medium",
    fontSize: 16,
  },
  viewMilestonesButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  viewMilestonesText: {
    fontSize: 16,
    fontFamily: "CabinetGrotesk-Medium",
    color: "#606060",
  },
  galleryContainer: {
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  galleryHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  galleryTitle: {
    fontSize: 19,
    fontFamily: "CabinetGrotesk-Extrabold",
    fontWeight: "bold",
  },
  imageGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginHorizontal: -24,
    gap: 2,
  },
  imageContainer: {
    width: "33%",
    aspectRatio: 1,
    position: "relative",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  fab: {
    position: "absolute",
    width: 56,
    height: 56,
    alignItems: "center",
    justifyContent: "center",
    right: 20,
    bottom: 48,
    backgroundColor: "#ff4545",
    borderRadius: 28,
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  modalOption: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
  },
  modalOptionText: {
    marginLeft: 15,
    fontSize: 16,
    fontFamily: "CabinetGrotesk-Medium",
  },
  deleteOption: {
    borderTopWidth: 1,
    borderTopColor: "#E5E5E5",
    marginTop: 10,
    paddingTop: 20,
  },
  deleteText: {
    color: "#FF3B30",
  },
  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  loadingText: {
    fontSize: 14,
    color: "#666",
    fontFamily: "CabinetGrotesk-Medium",
  },
});

// import { Text, Button, View, TextInput } from "react-native";
// import { useSession } from "@/components/ctx";
// import { useLinkWithSiwe, usePrivy } from "@privy-io/expo";
// import { useState, useEffect } from "react";
// import { useRouter } from "expo-router";
// import { useConnect, useSignMessage, useDisconnect } from "wagmi";
// import React from "react";
// import type { Hex, SignableMessage } from "viem";

// export default function HomeScreen() {
//   const { signOut } = useSession();
//   const { connect, connectors } = useConnect();
//   const router = useRouter();
//   const { user } = usePrivy();
//   const { signMessage } = useSignMessage({
//     mutation: {
//       onSuccess: (signature) => {
//         console.log("Signature:", signature);
//         setSignature(signature);
//         // Here you would typically send this signature to your backend
//         // or use it with linkWithSiwe
//       },
//       onError: (error) => {
//         console.error("Error Signing Message:", error);
//       },
//     },
//   });
//   const { disconnect } = useDisconnect();

//   const [signature, setSignature] = useState("");
//   const [linked, setLinked] = useState(false);
//   const [address, setAddress] = useState("");
//   const [message, setMessage] = useState<SignableMessage>();

//   //difference is this is supposed to be linked with Wallet
//   const [privyUser, setPrivyUser] = useState(user);

//   const { generateSiweMessage, linkWithSiwe } = useLinkWithSiwe({
//     onSuccess: console.log,
//     onError: console.log,
//     onGenerateMessage: console.log,
//   });

//   const handleDisconnect = () => {
//     disconnect();
//     setAddress("");
//   };

//   const handleGenerate = async () => {
//     const message = await generateSiweMessage({
//       from: {
//         domain: "www.dispopen.com",
//         uri: "https://www.dispopen.com",
//       },
//       wallet: {
//         chainId: `8453`,
//         address,
//       },
//     });
//     console.log(message);
//     setMessage(message);
//   };

//   const handleSign = () => {
//     if (!message) {
//       console.error("No message to sign");
//       return;
//     }

//     try {
//       signMessage({ account: address as Hex, message });
//     } catch (error) {
//       console.error("Failed to sign message:", error);
//     }
//   };

//   const connectWallet = async () => {
//     try {
//       connect(
//         {
//           connector: connectors[0],
//           chainId: 11155111, // Sepolia testnet
//         },
//         {
//           onSuccess: (data) => {
//             console.log("Connected wallet address:", data.accounts[0]);
//             setAddress(data.accounts[0]);
//             // You can also update your UI here if needed
//           },
//           onError: (error) => {
//             console.error("Error connecting wallet:", error);
//           },
//         }
//       );
//     } catch (err) {
//       console.error("Failed to connect wallet:", err);
//     }
//   };

//   const link = async () => {
//     const user = await linkWithSiwe({ signature });
//     if (user != null) setLinked(true);
//     setPrivyUser(user);
//   };

//   if (linked) {
//     return (
//       <View
//         style={{ flex: 1, justifyContent: "center", alignContent: "center" }}
//       >
//         <Text>Logged In</Text>
//         <Text>{JSON.stringify(privyUser, null, 2)}</Text>
//       </View>
//     );
//   }

//   return (
//     <View
//       style={{
//         flex: 1,
//         justifyContent: "center",
//         alignItems: "center",
//       }}
//     >
//       <TextInput
//         value={address}
//         onChangeText={setAddress}
//         placeholder="0x..."
//         inputMode="text"
//       />
//       <Text>Logout from this mf app.</Text>
//       <Button title="Generate Message" onPress={handleGenerate} />
//       <Button title="Disconnect" onPress={handleDisconnect} />

//       {Boolean(message) && <Text>{message as string}</Text>}
//       <Button title="Logout" onPress={signOut} />
//       {Boolean(message) && <Button title="Sign Message" onPress={handleSign} />}
//       <Button title="Connect Wallet" onPress={connectWallet} />
//       <Button title="Link Wallet with Privy" onPress={link} />
//       <Button
//         title="Go to Zora Screen"
//         onPress={() => router.push("/(home)/zora")}
//       />
//     </View>
//   );
// }
