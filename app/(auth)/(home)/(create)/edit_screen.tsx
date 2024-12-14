import React, { useState, useMemo, useRef, useEffect, createRef } from "react";
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
import { captureRef } from "react-native-view-shot";
import * as MediaLibrary from "expo-media-library";
import { getAddress } from "viem";

//zora imports
import { useZoraTokenCreation } from "@/hooks/useZora";
import CompositeImage from "@/components/CompositeImage";
import { apiService } from "@/api/api";

type Frame = {
  id: string;
  title: string;
  artist_name: string;
  artist_address: string;
  frame_image_url: string;
};

type FrameRefs = {
  [key: string]: React.RefObject<View>;
};

export default function FramesSelectionScreen() {
  //it can actually use random id's now so you can refactor if you want
  const [selectedFrame, setSelectedFrame] = useState("1");
  const [title, setTitle] = useState("");
  const [selectedImageUri, setSelectedImageUri] = useState("");
  const [ticker, setTicker] = useState("");
  const [isTickerModalVisible, setTickerModalVisible] = useState(false);
  const [tempTicker, setTempTicker] = useState("");
  const { image } = useLocalSearchParams();

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(300)).current;

  const [frames, setFrames] = useState<Frame[]>([]);
  const [selectedFrameRef, setSelectedFrameRef] =
    useState<React.RefObject<View>>();
  const refs = useRef<FrameRefs>({});

  const {
    sendFileToPinata,
    getToken,
    createToken,
    createTokenOnExistingContract,
    getSplitAddress,
  } = useZoraTokenCreation();

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

  const handleMinting = async () => {
    const splitAddress = await getSplitAddress(
      frames.find((frame) => frame.id === selectedFrame)?.artist_address!
    );
    const result = await sendFileToPinata(
      selectedImageUri as string,
      title,
      frames.find((frame) => frame.id === selectedFrame)?.artist_name!,
      frames.find((frame) => frame.id === selectedFrame)?.title!
    );
    const address = await createToken(
      title,
      result as string,
      splitAddress,
      ticker
    );
    console.log(address);
    router.back();
  };

  useEffect(() => {
    if (selectedImageUri != "") {
      handleMinting();
    }
  }, [selectedImageUri]); // This runs every time `selectedImageUri` changes

  const handleDone = async () => {
    console.log(refs.current[selectedFrame]);
    await onSaveImageAsync(refs.current[selectedFrame]);
  };

  const handleCancel = () => {
    router.back();
  };

  // Function to simulate fetching frames from a server
  const fetchFrames = async () => {
    // Simulated API call
    // Let your API start id's with 1 etc for selection ease, can refactor later
    //wrap with try and catch
    const fetchedFrames = await apiService.fetchFrames();
    setFrames(fetchedFrames);

    // Initialize refs based on fetched frames
    const newRefs: FrameRefs = fetchedFrames.reduce((acc: FrameRefs, frame) => {
      acc[frame.id] = createRef<View>();
      return acc;
    }, {});
    refs.current = newRefs; // Update the refs with new data
  };

  // Fetch frames on component mount
  useEffect(() => {
    const initializeFrames = async () => {
      await fetchFrames(); // Wait for fetchFrames to complete
      console.log("frames", frames);
    };
    initializeFrames(); // Call the async function
  }, []);

  //Select first frame as initial
  useEffect(() => {
    if (frames && frames.length > 0) {
      handleSelectFrame(frames[0].id); // Safely select the first frame
      console.log("Selected frame on start", frames[0].id);
    }
  }, [frames]);

  // Screenshot the view and get the uri
  const onSaveImageAsync = async (ref: React.RefObject<View>) => {
    try {
      const localUri = await captureRef(ref, {
        height: 300,
        quality: 1,
      });
      setSelectedImageUri(localUri);
    } catch (e) {
      console.log("error", e);
    }
  };

  const handleSelectFrame = (frameId: string) => {
    setSelectedFrame(frameId);
    // Access the ref of the selected frame
    const selectedFrameRef = refs.current[frameId];
    setSelectedFrameRef(selectedFrameRef);
  };

  //runs each time a frame is selected
  useEffect(() => {
    if (selectedFrameRef?.current) {
      // Perform actions with the selected frame ref
      console.log(`Selected frame: ${selectedFrame}`);
      // onSaveImageAsync(selectedFrameRef);
    }
  }, [selectedFrameRef]);

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
                  onPress={() => handleSelectFrame(frame.id)}
                >
                  {/* <Image
                      source={{ uri: image as string }}
                      style={styles.frameImage}
                    /> */}
                  <View style={styles.frameImageContainer}>
                    <View ref={refs.current[frame.id]} collapsable={false}>
                      <CompositeImage
                        imageSource={image as string}
                        frameSource={frame.frame_image_url}
                      />
                    </View>
                  </View>
                  <View style={styles.frameInfo}>
                    <Text style={styles.frameTitle}>{frame.title}</Text>
                    <View style={styles.artistContainer}>
                      <Text style={styles.artistName}>{frame.artist_name}</Text>
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
