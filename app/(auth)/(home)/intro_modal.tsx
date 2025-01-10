import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Button,
  ActivityIndicator,
  Image,
} from "react-native";
import {
  Camera,
  ImageIcon,
  BarChart3,
  User,
  Users,
  Users2Icon,
  GraduationCap,
} from "lucide-react-native";
import { useStorageState } from "@/hooks/useStorageState";
import { router } from "expo-router";
import { useWallet } from "@/hooks/useWallet";

export default function IntroModal({ onContinue }: { onContinue: () => void }) {
  const [[hasSeenIntroLoading, hasSeenIntro], setHasSeenIntro] =
    useStorageState("hasSeenIntro");
  const [isLoading, setIsLoading] = useState(false);

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
      setIsLoading(true);
      await connectWallet();
      console.log("im not waiting ooo");
      setHasSeenIntro("true");
      setIsLoading(false);
      router.back();
    } catch (error) {
      console.error("Error connecting wallet:", error);
      // Optionally, you can show an error message to the user here
    } finally {
      setIsLoading(false);
    }
  }

  const steps = [
    {
      icon: Camera,
      title: "Create",
      mainColor: "#008080",
      accentColor: "#E6F3F3", // Softer teal accent
      description: "Turn your favorite moments into Dispopens",
    },
    {
      icon: ImageIcon,
      title: "Curate",
      mainColor: "#800020",
      accentColor: "#F9E6E9", // Softer pink accent
      description:
        "Each mint earns you $$ and moves your Dispopen closer to the official collection",
    },
    {
      icon: GraduationCap,
      title: "Graduate",
      mainColor: "#000080",
      accentColor: "#E6F0F9", // Softer blue accent
      description:
        "At ~1K mints, your Dispopen graduates and secures its spot in the collection",
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>How it works</Text>

        <View style={styles.stepsContainer}>
          {steps.map((step, index) => (
            <View key={index} style={styles.step}>
              <View
                style={[
                  styles.iconContainer,
                  { backgroundColor: step.accentColor },
                ]}
              >
                <step.icon size={24} color={step.mainColor} strokeWidth={2} />
              </View>
              <View style={styles.stepContent}>
                <Text style={styles.stepTitle}>{step.title}</Text>
                <Text style={styles.stepDescription}>{step.description}</Text>
              </View>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.footer}>
        <Text style={styles.disclaimer}>
          Dispopen uses Coinbase Smart Wallet to mint and create Dispopens. We
          will create one for you if you don't have. Takes 10s.
        </Text>
        <TouchableOpacity style={styles.continueButton} onPress={handleClose}>
          <View style={styles.horizontalContainer}>
            {isLoading && (
              <ActivityIndicator
                size="small"
                color="#ffffff"
                style={styles.spinner}
              />
            )}
            <Text style={styles.connectWalletText}>
              {isLoading ? "Connecting..." : "Continue"}
            </Text>
          </View>
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
    padding: 24,
    paddingTop: 0, // Remove top padding to accommodate the image
  },
  headerImage: {
    width: "140%",
    marginHorizontal: -80,
    height: 150, // Adjust this value as needed
    marginBottom: 20,
  },
  title: {
    fontSize: 34,
    fontFamily: "CabinetGrotesk-Extrabold",
    fontWeight: "bold",
    marginBottom: 36,
    marginTop: 64,
    justifyContent: "center",
    alignSelf: "center",
  },
  stepsContainer: {
    gap: 32,
  },
  step: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 24,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
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
    lineHeight: 26,
    fontFamily: "CabinetGrotesk-Medium",
    color: "#909090",
  },
  footer: {
    padding: 24,
    paddingBottom: 32,
    paddingTop: 16,
  },
  disclaimer: {
    paddingHorizontal: 2,
    fontSize: 15,
    lineHeight: 18,
    color: "#909090",
    textAlign: "center",
    marginBottom: 16,
    fontFamily: "CabinetGrotesk-Medium",
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
  connectWalletText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontFamily: "CabinetGrotesk-Bold",
  },
  horizontalContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  spinner: {
    marginRight: 8,
  },
});
