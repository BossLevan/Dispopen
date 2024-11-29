import React, { useState, useMemo, useRef, useEffect } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  TextInput,
  Animated,
  Easing,
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import { BadgeCheck, Clock, X } from "lucide-react-native";
import { BlurView } from "expo-blur";
import { router } from "expo-router";

//zora imports
import { useZoraTokenCreation } from "@/hooks/useZora";

export default function FramesSelectionScreen() {
  const [selectedFrame, setSelectedFrame] = useState("1");
  const [title, setTitle] = useState("");
  const [ticker, setTicker] = useState("");
  const [isTickerModalVisible, setTickerModalVisible] = useState(false);
  const [tempTicker, setTempTicker] = useState("");
  const { image } = useLocalSearchParams();

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(300)).current;

  const {
    sendFileToPinata,
    getToken,
    createToken,
    createTokenOnExistingContract,
  } = useZoraTokenCreation();

  const frames = [
    {
      id: "1",
      title: "Ethereal",
      artist: "Jessica Ryan",
      image: "https://picsum.photos/200",
    },
    {
      id: "2",
      title: "Virgil Abloh",
      artist: "Saint Levan",
      image: "https://picsum.photos/200",
    },
    {
      id: "3",
      title: "Moodeng",
      artist: "Oma Anabogu",
      image: "https://picsum.photos/200",
    },
    {
      id: "4",
      title: "Obsession",
      artist: "Halima Starr",
      image: "https://picsum.photos/200",
    },
  ];

  useEffect(() => {
    if (isTickerModalVisible) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
          easing: Easing.out(Easing.ease),
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 300,
          duration: 300,
          useNativeDriver: true,
          easing: Easing.in(Easing.ease),
        }),
      ]).start();
    }
  }, [isTickerModalVisible]);

  const handleAddTicker = () => {
    setTickerModalVisible(true);
  };

  const handleTickerSubmit = () => {
    setTicker(tempTicker);
    setTickerModalVisible(false);
  };

  const handleTickerDelete = () => {
    setTicker("");
  };

  const closeModal = () => {
    setTickerModalVisible(false);
  };

  const handleDone = async () => {
    const result = await sendFileToPinata(image as string, title);
    const address = await createToken(title, result as string, ticker);
    console.log(address);

    // const res = await createToken(
    //   title,
    //   "ipfs://bafybeibovhytxia2dfcibkiqtzofdd5euv4q4r6r4s4gv5zmrgqntzd2sy"
    // );
    console.log(result);
    router.back();
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <SafeAreaView style={styles.container}>
          <StatusBar style="dark" />

          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={handleCancel}>
              <Text style={styles.cancelButton}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleDone}>
              <Text style={styles.doneButton}>Done</Text>
            </TouchableOpacity>
          </View>

          {/* Title Input Area */}
          <View style={styles.titleContainer}>
            <View style={styles.placeholderImage}>
              <Image
                source={{ uri: image as string }}
                style={StyleSheet.absoluteFill}
              />
              <BlurView intensity={20} style={StyleSheet.absoluteFill} />
              <Clock strokeWidth="3" stroke="#fff" />
            </View>
            <View style={styles.titleInputArea}>
              <TextInput
                style={styles.titleInput}
                placeholder="Add a title"
                placeholderTextColor="#C7C7CC"
                value={title}
                onChangeText={setTitle}
              />
              {ticker ? (
                <View style={styles.tickerContainer}>
                  <Text style={styles.tickerText}>{ticker}</Text>
                  <TouchableOpacity
                    onPress={handleTickerDelete}
                    style={styles.deleteTickerButton}
                  >
                    <X size={16} color="#8E8E93" />
                  </TouchableOpacity>
                </View>
              ) : (
                <TouchableOpacity
                  style={styles.addTickerButton}
                  onPress={handleAddTicker}
                >
                  <Text style={styles.addTickerText}>+ Add a Ticker</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>

          {/* Frames Section */}
          <View style={styles.framesSection}>
            <Text style={styles.framesTitle}>Frames</Text>
            <Text style={styles.framesSubtitle}>
              Designed exclusively by talented artists
            </Text>
          </View>

          {/* Frames Grid */}
          <ScrollView style={styles.scrollView}>
            <View style={styles.grid}>
              {frames.map((frame) => (
                <TouchableOpacity
                  key={frame.id}
                  style={[
                    styles.frameItem,
                    selectedFrame === frame.id && styles.selectedFrame,
                  ]}
                  onPress={() => setSelectedFrame(frame.id)}
                >
                  <View style={styles.frameImageContainer}>
                    <Image
                      source={{ uri: image as string }}
                      style={styles.frameImage}
                    />
                  </View>
                  <View style={styles.frameInfo}>
                    <Text style={styles.frameTitle}>{frame.title}</Text>
                    <View style={styles.artistContainer}>
                      <Text style={styles.artistName}>{frame.artist}</Text>
                      <BadgeCheck fill="#61A0FF" stroke="#fff" />
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>

          {/* Ticker Modal */}
          {isTickerModalVisible && (
            <Animated.View
              style={[
                styles.modalOverlay,
                {
                  opacity: fadeAnim,
                },
              ]}
            >
              <TouchableWithoutFeedback onPress={closeModal}>
                <View style={styles.modalBackground} />
              </TouchableWithoutFeedback>
              <Animated.View
                style={[
                  styles.modalContent,
                  {
                    transform: [{ translateY: slideAnim }],
                  },
                ]}
              >
                <View style={styles.modalHeader}>
                  <TouchableOpacity onPress={closeModal}>
                    <Text style={styles.modalCancelButton}>Cancel</Text>
                  </TouchableOpacity>
                  <Text style={styles.modalTitle}>Add Ticker</Text>
                  <TouchableOpacity onPress={handleTickerSubmit}>
                    <Text style={styles.modalDoneButton}>Done</Text>
                  </TouchableOpacity>
                </View>
                <TextInput
                  style={styles.tickerInput}
                  placeholder="Enter ticker"
                  value={tempTicker}
                  onChangeText={setTempTicker}
                  autoFocus
                />
              </Animated.View>
            </Animated.View>
          )}
        </SafeAreaView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  cancelButton: {
    fontSize: 17,
    color: "#000",
  },
  doneButton: {
    fontSize: 17,
    color: "#FF3B30",
    fontWeight: "600",
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    padding: 16,
    gap: 8,
  },
  placeholderImage: {
    width: 80,
    height: 80,
    borderRadius: 2,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  titleInputArea: {
    flexDirection: "column",
    marginLeft: 12,
    flex: 1,
    gap: 4,
  },
  titleInput: {
    fontSize: 19,
    color: "#000",
    marginBottom: 8,
    fontFamily: "CabinetGrotesk-Medium",
  },
  addTickerButton: {
    backgroundColor: "#F2F2F7",
    borderRadius: 15,
    paddingVertical: 6,
    paddingHorizontal: 12,
    alignSelf: "flex-start",
  },
  addTickerText: {
    fontSize: 15,
    color: "#8E8E93",
    fontFamily: "CabinetGrotesk-Medium",
  },
  tickerContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F2F2F7",
    borderRadius: 15,
    paddingVertical: 6,
    paddingLeft: 12,
    paddingRight: 6,
    alignSelf: "flex-start",
  },
  tickerText: {
    fontSize: 15,
    color: "#000",
    fontFamily: "CabinetGrotesk-Medium",
    marginRight: 4,
  },
  deleteTickerButton: {
    padding: 2,
  },
  framesSection: {
    flexDirection: "column",
    padding: 16,
    gap: 4,
  },
  framesTitle: {
    fontSize: 17,
    fontWeight: "bold",
    fontFamily: "CabinetGrotesk-Bold",
    marginBottom: 4,
  },
  framesSubtitle: {
    fontSize: 15,
    color: "#8E8E93",
    fontFamily: "CabinetGrotesk-Medium",
  },
  scrollView: {
    flex: 1,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    padding: 8,
  },
  frameItem: {
    width: "50%",
    padding: 12,
    marginBottom: 12,
  },
  selectedFrame: {
    borderWidth: 2,
    borderColor: "#F27F65",
    borderRadius: 5,
  },
  frameImageContainer: {
    aspectRatio: 1,
    backgroundColor: "#F2F2F7",
    borderRadius: 4,
    overflow: "hidden",
  },
  frameImage: {
    width: "100%",
    height: "100%",
  },
  frameInfo: {
    marginTop: 8,
  },
  frameTitle: {
    fontSize: 17,
    fontFamily: "CabinetGrotesk-Medium",
    fontWeight: "600",
  },
  artistContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  artistName: {
    fontSize: 17,
    fontFamily: "CabinetGrotesk-Medium",
    color: "#8E8E93",
    marginRight: 4,
  },
  modalOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalBackground: {
    flex: 1,
  },
  modalContent: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    padding: 20,
    paddingBottom: Platform.OS === "ios" ? 40 : 20, // Extra padding for iOS home bar
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: "600",
    fontFamily: "CabinetGrotesk-Bold",
  },
  modalCancelButton: {
    fontSize: 17,
    color: "#000",
    fontFamily: "CabinetGrotesk-Medium",
  },
  modalDoneButton: {
    fontSize: 17,
    color: "#FF3B30",
    fontWeight: "600",
    fontFamily: "CabinetGrotesk-Bold",
  },
  tickerInput: {
    borderWidth: 1,
    borderColor: "#E1E1E1",
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    fontFamily: "CabinetGrotesk-Medium",
  },
});
