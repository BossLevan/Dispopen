import React from "react";
import { Pressable, Text, StyleSheet, Animated } from "react-native";
import LinearGradient from "react-native-linear-gradient";

interface AnimatedNextButtonProps {
  onPress: () => void;
  text?: string;
}

export const NextButton: React.FC<AnimatedNextButtonProps> = ({
  onPress,
  text = "Next",
}) => {
  const scaleAnim = React.useRef(new Animated.Value(1)).current;

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
    <Animated.View
      style={[styles.buttonContainer, { transform: [{ scale: scaleAnim }] }]}
    >
      <Pressable
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        onPress={onPress}
      >
        <LinearGradient colors={["#333333", "#000000"]} style={styles.gradient}>
          <Text style={styles.buttonText}>{text}</Text>
        </LinearGradient>
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    width: "100%",
    paddingHorizontal: 16,
    marginVertical: 10,
  },
  gradient: {
    borderRadius: 50,
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});
