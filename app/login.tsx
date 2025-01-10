import React, { useRef, useEffect } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  SafeAreaView,
  Animated,
  Dimensions,
} from "react-native";
import { useSession } from "@/components/ctx";
import * as Haptics from "expo-haptics";

const { width, height } = Dimensions.get("window");
export default function WelcomeScreen() {
  const { signIn } = useSession();
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const titleOpacity = useRef(new Animated.Value(0)).current;
  const subtitleOpacity = useRef(new Animated.Value(0)).current;
  const buttonOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.stagger(300, [
      Animated.timing(titleOpacity, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(subtitleOpacity, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(buttonOpacity, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const onPressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  };

  const onPressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* <Video
        source={require("../assets/videos/Starfield.mp4")} // Replace with your video URL or local file
        style={styles.video}
        resizeMode={ResizeMode.COVER}
        isLooping
        shouldPlay
      /> */}
      <View style={styles.content}>
        <View style={styles.titleContainer}>
          <Animated.Text style={[styles.title, { opacity: titleOpacity }]}>
            Welcome to Dispopen
          </Animated.Text>
          <Animated.Text
            style={[styles.subtitle, { opacity: subtitleOpacity }]}
          >
            Showcase your taste. Earn rewards.
          </Animated.Text>
        </View>

        <Animated.View
          style={[
            styles.buttonContainer,
            {
              transform: [{ scale: scaleAnim }],
              opacity: buttonOpacity,
            },
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
  video: {
    width: width,
    height: height,
    position: "absolute",
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
