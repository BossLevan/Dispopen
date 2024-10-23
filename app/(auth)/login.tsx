import { useLogin } from "@privy-io/expo";
import { Button, Text, View } from "react-native";

export default function AuthScreen() {
  const { login } = useLogin();

  const onPress = () => {
    login({ loginMethods: ["email"] }).then((session) => {
      console.log("User logged in", session.user);
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
    </View>
  );
}
