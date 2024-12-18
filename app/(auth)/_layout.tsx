import { Stack } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function RootLayout() {
  const { top } = useSafeAreaInsets();
  return (
    <Stack
      screenOptions={
        {
          // contentStyle: { backgroundColor: "white", marginTop: top },
        }
      }
    >
      <Stack.Screen name="(home)/home" options={{ headerShown: false }} />
      <Stack.Screen
        name="(home)/intro_modal"
        options={{
          headerShown: false,
          presentation: "modal",
          gestureEnabled: false,
        }}
      />
      <Stack.Screen
        name="(home)/(create)/edit_screen"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="(home)/details/[id]"
        options={{
          headerBackTitle: "Back",
          //   presentation: "fullScreenModal",
          //   gestureEnabled: true,
          //   gestureDirection: "vertical",
          headerShown: true,
          headerTitle: "",
          headerTintColor: "#000",
          headerBackVisible: true,
          headerBackTitleStyle: { fontFamily: "CabinetGrotesk-Medium" },

          //   fullScreenGestureEnabled: true,
        }}
      />

      <Stack.Screen name="display_name" options={{ headerShown: false }} />
    </Stack>
  );
}
