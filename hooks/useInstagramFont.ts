import * as Font from 'expo-font';
import { useEffect, useState } from 'react';

export const useFonts = () => {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    async function loadFonts() {
      await Font.loadAsync({
        "Instagram-Bold": require("@/assets/fonts/Instagram-Sans-Bold.ttf"),
        "Instagram-Sans": require("@/assets/fonts/Instagram-Sans.ttf"),
        "Instagram-Medium": require("@/assets/fonts/Instagram-Sans-Medium.ttf"),
      });
      setFontsLoaded(true);
    }

    loadFonts();
  }, []);

  return fontsLoaded;
};