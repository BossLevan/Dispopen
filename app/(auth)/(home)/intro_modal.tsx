import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Button,
} from "react-native";
import { Camera, ImageIcon, BarChart3 } from "lucide-react-native";
import { useStorageState } from "@/hooks/useStorageState";
import { router } from "expo-router";
import { useWallet } from "@/hooks/useWallet";

export default function IntroModal({ onContinue }: { onContinue: () => void }) {
  const [[hasSeenIntroLoading, hasSeenIntro], setHasSeenIntro] =
    useStorageState("hasSeenIntro");

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

  async function handleClose() {
    try {
      await connectWallet();
      console.log("im not waiting ooo");
      setHasSeenIntro("true");
      router.back();
    } catch (error) {
      console.error("Error connecting wallet:", error);
      // Optionally, you can show an error message to the user here
    }
  }
  const steps = [
    {
      icon: Camera,
      title: "Snap",
      description: "Capture selfies and express yourself in new creative ways",
    },
    {
      icon: ImageIcon,
      title: "Mint",
      description:
        "Enhance your creation with filters by top artists, adding your unique flair",
    },
    {
      icon: BarChart3,
      title: "Share",
      description:
        "Let others collect your minted piece and watch its value growww",
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>How it works</Text>

        <View style={styles.stepsContainer}>
          {steps.map((step, index) => (
            <View key={index} style={styles.step}>
              <View style={styles.iconContainer}>
                <step.icon size={24} color="#000" strokeWidth={2} />
              </View>
              <View style={styles.stepContent}>
                <Text style={styles.stepTitle}>{step.title}</Text>
                <Text style={styles.stepDescription}>{step.description}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* <Button title="Generate Message" onPress={handleGenerateMessage} />
        <Button title="Disconnect" onPress={handleDisconnect} /> */}
        {/* 
        {Boolean(message) && <Text>{message as string}</Text>} */}

        {/* {Boolean(message) && (
          <Button title="Sign Message" onPress={handleSignMessage} />
        )}
        <Button title="Connect Wallet" onPress={connectWallet} />
        <Button title="Link Wallet with Privy" onPress={linkWallet} /> */}
      </View>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.continueButton} onPress={handleClose}>
          <Text style={styles.continueButtonText}>Connect Wallet</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "space-between",
  },
  content: {
    flex: 1,
    padding: 36,
    paddingTop: 40,
  },
  title: {
    fontSize: 34,
    fontFamily: "CabinetGrotesk-Extrabold",
    fontWeight: "bold",
    marginBottom: 40,
    justifyContent: "center",
    alignSelf: "center",
  },
  stepsContainer: {
    gap: 32,
  },
  step: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 16,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: "#F2F2F7",
    justifyContent: "center",
    alignItems: "center",
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 19,
    fontWeight: "600",
    fontFamily: "CabinetGrotesk-Bold",
    marginBottom: 4,
  },
  stepDescription: {
    fontSize: 19,
    lineHeight: 22,
    fontFamily: "CabinetGrotesk-Medium",
    color: "#606060",
  },
  footer: {
    padding: 24,
    paddingBottom: 32,
  },
  continueButton: {
    backgroundColor: "#000",
    borderRadius: 32,
    padding: 16,
    alignItems: "center",
  },
  continueButtonText: {
    color: "#fff",
    fontSize: 17,
    fontFamily: "CabinetGrotesk-Bold",
    fontWeight: "600",
  },
});
