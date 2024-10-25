import { Text, Button, View } from "react-native";
import { useSession } from "@/components/ctx";
import { usePrivy } from "@privy-io/expo";

export default function HomeScreen() {
  const { signOut } = useSession();

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>Logout from this mf app.</Text>
      <Button title="Logout" onPress={signOut} />
    </View>
  );
}
