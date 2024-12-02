// import React, { useRef, useState } from "react";
// import { View, Image, Button, StyleSheet } from "react-native";
// import ViewShot from "react-native-view-shot"; // Import ViewShot correctly
// import { launchImageLibrary } from "react-native-image-picker";

// /**
//  * Frame Component: Displays the selected image with a white background frame
//  */
// const Frame: React.FC<{
//   imageUri?: string;
//   onCapture: (uri: string) => void;
// }> = ({ imageUri, onCapture }) => {
//   const viewShotRef = useRef<ViewShot>(null); // Use ViewShot as the ref type

//   // Function to capture the current view of the frame
//   const captureImage = async () => {
//     if (viewShotRef.current) {
//       const uri = await viewShotRef.current?.capture(); // Capture the view as an image
//       onCapture(uri); // Pass the captured image URI
//     }
//   };

//   return (
//     <ViewShot
//       ref={viewShotRef}
//       style={styles.frame}
//       options={{ format: "png", quality: 1 }}
//     >
//       <View style={styles.whiteBackground}>
//         {imageUri ? (
//           <Image source={{ uri: imageUri }} style={styles.image} />
//         ) : (
//           <Button title="Select an Image" onPress={captureImage} />
//         )}
//       </View>
//     </ViewShot>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     backgroundColor: "#f5f5f5",
//   },
//   frame: {
//     width: 300,
//     height: 300,
//     padding: 20,
//     backgroundColor: "white",
//     justifyContent: "center",
//     alignItems: "center",
//     marginTop: 20,
//   },
//   whiteBackground: {
//     width: "100%",
//     height: "100%",
//     backgroundColor: "white",
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   image: {
//     width: "100%",
//     height: "100%",
//     resizeMode: "contain",
//   },
// });
