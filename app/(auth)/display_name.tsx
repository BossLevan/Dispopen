// import { router } from "expo-router";
// import React, { useState, useRef } from "react";
// import {
//   View,
//   Text,
//   TextInput,
//   Pressable,
//   StyleSheet,
//   SafeAreaView,
//   TouchableWithoutFeedback,
//   Keyboard,
//   Animated,
// } from "react-native";
// import * as Storage from "@/utils/storage_visit_name";
// import { useSession } from "@/components/ctx";
// export default function DisplayNameScreen() {
//   const [displayName, setDisplayName] = useState("");
//   const { setSession } = useSession();
//   const [isFocused, setIsFocused] = useState(false);
//   const inputRef = useRef<TextInput>(null);
//   const scaleAnim = useRef(new Animated.Value(1)).current;

//   const onPressIn = async () => {
//     Animated.spring(scaleAnim, {
//       toValue: 0.95,
//       useNativeDriver: true,
//     }).start();
//     router.replace("/(auth)/(home)/home");
//     //creating a local session here.
//     setSession();
//     console.log("set to true");
//   };

//   const onPressOut = () => {
//     Animated.spring(scaleAnim, {
//       toValue: 1,
//       useNativeDriver: true,
//     }).start();
//   };

//   const handleScreenPress = () => {
//     if (isFocused) {
//       Keyboard.dismiss();
//       inputRef.current?.blur();
//     }
//   };

//   const handleFocus = () => {
//     setIsFocused(true);
//   };

//   const handleBlur = () => {
//     setIsFocused(false);
//   };

//   return (
//     <TouchableWithoutFeedback onPress={handleScreenPress}>
//       <SafeAreaView style={styles.container}>
//         <View style={styles.content}>
//           <Text style={styles.title}>Display name</Text>
//           <Text style={styles.subtitle}>Let us get to know you better</Text>

//           <View
//             style={[
//               styles.inputContainer,
//               isFocused && { borderColor: "#000" },
//             ]}
//           >
//             <TextInput
//               ref={inputRef}
//               style={[styles.input, isFocused && { color: "#000" }]}
//               selectionColor="#000"
//               placeholder="Enter a display name"
//               placeholderTextColor="#D3D3D3"
//               value={displayName}
//               onChangeText={setDisplayName}
//               onFocus={handleFocus}
//               onBlur={handleBlur}
//               autoCapitalize="words"
//             />
//           </View>

//           <View style={styles.bottomContainer}>
//             <Animated.View
//               style={[
//                 styles.buttonContainer,
//                 { transform: [{ scale: scaleAnim }] },
//               ]}
//             >
//               <Pressable
//                 style={styles.button}
//                 onPressIn={onPressIn}
//                 onPressOut={onPressOut}
//               >
//                 <Text style={styles.buttonText}>Next</Text>
//               </Pressable>
//             </Animated.View>
//           </View>
//         </View>
//       </SafeAreaView>
//     </TouchableWithoutFeedback>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#fff",
//   },
//   content: {
//     flex: 1,
//     paddingHorizontal: 24,
//     paddingTop: 40,
//   },
//   title: {
//     fontSize: 30,
//     fontFamily: "CabinetGrotesk-Extrabold",
//     fontWeight: "700",
//     marginBottom: 12,
//     letterSpacing: -0.5,
//   },
//   subtitle: {
//     fontSize: 20,
//     fontFamily: "CabinetGrotesk-Medium",
//     color: "#666",
//     marginBottom: 20,
//   },
//   inputContainer: {
//     marginTop: 12,
//     borderWidth: 1.2,
//     borderColor: "#ccc",
//     borderRadius: 16,
//     paddingHorizontal: 16,

//     paddingVertical: 2,
//   },
//   input: {
//     fontSize: 20,
//     paddingVertical: 16,
//     color: "#333",
//   },
//   bottomContainer: {
//     position: "absolute",
//     bottom: 40,
//     left: 24,
//     right: 24,
//   },
//   buttonContainer: {
//     width: "100%",
//   },
//   button: {
//     backgroundColor: "#000",
//     paddingVertical: 16,
//     paddingHorizontal: 24,
//     borderRadius: 100,
//   },
//   buttonText: {
//     color: "#fff",
//     fontSize: 20,
//     fontFamily: "CabinetGrotesk-Medium",
//     textAlign: "center",
//     fontWeight: "500",
//   },
// });
