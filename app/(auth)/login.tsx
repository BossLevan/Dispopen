import { useLogin, usePrivy } from "@privy-io/expo";
import { Button, Text, View } from "react-native";
import { useSession } from "@/components/ctx";

export default function AuthScreen() {
  const { login } = useLogin();
  const { signIn } = useSession();
  const { logout } = usePrivy();

  const onPress = () => {
    login({ loginMethods: ["email"] }).then((session) => {
      console.log("User logged in", session.user);
      signIn();
      //handle errors
    });
  };
  return (
    <View
      style={{
        alignItems: "center",
        justifyContent: "center",
        flex: 1,
      }}
    >
      <Text>Welcome to the Secret app</Text>
      <Button title="Use Privy" onPress={onPress} />
      <Button title="Logout" onPress={logout} />
    </View>
  );
}
