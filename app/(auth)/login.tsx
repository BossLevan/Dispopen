import { Button, Text, View } from "react-native";
import { useSession } from "@/components/ctx";

export default function AuthScreen() {
  const { signIn, signOut } = useSession();

  return (
    <View
      style={{
        alignItems: "center",
        justifyContent: "center",
        flex: 1,
      }}
    >
      <Text>Welcome to the Secret app</Text>
      <Button title="Use Privy" onPress={signIn} />
      <Button title="Logout" onPress={signOut} />
    </View>
  );
}
