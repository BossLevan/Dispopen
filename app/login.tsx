import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Animated,
  Pressable,
} from "react-native";
import { useSession } from "@/components/ctx";
import { useRef } from "react";
import { NextButton } from "@/components/GradientButton";

export default function WelcomeScreen() {
  const { signIn, signOut } = useSession();
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const onPressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const onPressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Welcome to Dispopen</Text>
          <Text style={styles.subtitle}>
            Turn Selfies into billion dollar narratives.
          </Text>
        </View>

        <Animated.View
          style={[
            styles.buttonContainer,
            { transform: [{ scale: scaleAnim }] },
          ]}
        >
          <Pressable
            style={styles.button}
            onPressIn={onPressIn}
            onPressOut={onPressOut}
            onPress={signIn}
          >
            <Text style={styles.buttonText}>Get Started</Text>
          </Pressable>
        </Animated.View>
        {/* <NextButton onPress={() => {}} /> */}

        <View style={styles.footer}>
          <Text style={styles.footerText}>Terms</Text>
          <Text style={styles.footerDot}>•</Text>
          <Text style={styles.footerText}>Privacy</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  content: {
    flex: 1,
    justifyContent: "flex-end",
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  titleContainer: {
    alignItems: "center",
    marginBottom: 32,
  },
  title: {
    fontSize: 32,
    fontFamily: "CabinetGrotesk-Extrabold",
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 20,
    color: "#666",
    textAlign: "center",
    fontFamily: "CabinetGrotesk-Medium",
  },
  buttonContainer: {
    width: "100%",
    marginBottom: 32,
  },
  button: {
    backgroundColor: "#000",
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 100,
  },
  buttonText: {
    color: "#fff",
    fontSize: 20,
    fontFamily: "CabinetGrotesk-Medium",
    textAlign: "center",
    fontWeight: "500",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  footerText: {
    color: "#666",
    fontSize: 16,
    fontFamily: "CabinetGrotesk-Medium",
  },
  footerDot: {
    color: "#666",
    marginHorizontal: 8,
    fontSize: 16,
  },
});
