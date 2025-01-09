import React, { useState, useRef, useEffect } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Easing,
  ActivityIndicator,
} from "react-native";
import { Minus, Plus, X } from "lucide-react-native";
import { useZoraTokenCreation } from "@/hooks/useZora";
import { showToast } from "./Toast";
import { router } from "expo-router";
import { apiService } from "@/api/api";
import { useAccount } from "wagmi";

interface MintModalProps {
  visible: boolean;
  onClose: () => void;
  onDeposit?: (quantity: number) => void;
  tokenContract: `0x${string}`;
}

export const MintModal: React.FC<MintModalProps> = ({
  visible,
  onClose,
  onDeposit,
  tokenContract,
}) => {
  const [quantity, setQuantity] = useState<number>(1);
  const [selectedButton, setSelectedButton] = useState<number | null>(1);
  const [isModalRendered, setIsModalRendered] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { mint } = useZoraTokenCreation();
  const { address } = useAccount();

  // Animated values for overlay and modal
  const overlayOpacity = useRef(new Animated.Value(0)).current;
  const modalTranslateY = useRef(new Animated.Value(300)).current;

  useEffect(() => {
    if (visible) {
      setIsModalRendered(true);
      // Animate overlay and modal when modal opens
      Animated.parallel([
        Animated.timing(overlayOpacity, {
          toValue: 1,
          duration: 200,
          easing: Easing.ease,
          useNativeDriver: true,
        }),
        Animated.timing(modalTranslateY, {
          toValue: 0,
          duration: 200,
          easing: Easing.inOut(Easing.exp),
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      // Animate out when modal closes - slide down overlay, keep modal opaque
      Animated.parallel([
        Animated.timing(overlayOpacity, {
          toValue: 0,
          duration: 200,
          easing: Easing.ease,
          useNativeDriver: true,
        }),
        Animated.timing(modalTranslateY, {
          toValue: 800,
          duration: 200,
          easing: Easing.in(Easing.linear),
          useNativeDriver: true,
        }),
      ]).start(({ finished }) => {
        if (finished) {
          setIsModalRendered(false);
        }
      });
    }
  }, [visible, overlayOpacity, modalTranslateY]);

  const handleIncrement = () => setQuantity((prev) => prev + 1);
  const handleDecrement = () => setQuantity((prev) => Math.max(1, prev - 1));

  const handleQuantitySelect = (amount: number) => {
    setQuantity(amount);
    setSelectedButton(amount);
  };

  const handleMint = async () => {
    setIsLoading(true);
    onDeposit?.(quantity);
    const res = await mint(tokenContract, quantity);
    if (res.e) {
      showToast("error", "Mint Failed");
      setIsLoading(false);
      onClose();
      return;
    }
    showToast("success", "Minted");
    onClose();
    setIsLoading(false);

    router.back();
    await apiService.incrementDispopensCurated(address!);
  };

  if (!isModalRendered) return null;

  return (
    <Modal
      transparent
      visible={true}
      animationType="none"
      onRequestClose={onClose}
    >
      <Animated.View
        style={[
          styles.modalOverlay,
          {
            opacity: overlayOpacity,
          },
        ]}
      >
        <TouchableOpacity
          style={StyleSheet.absoluteFillObject}
          onPress={onClose}
          activeOpacity={1}
        />
        <Animated.View
          style={[
            styles.modalContent,
            {
              transform: [
                {
                  translateY: modalTranslateY,
                },
              ],
            },
          ]}
        >
          <TouchableOpacity
            style={styles.closeButton}
            onPress={onClose}
            accessibilityLabel="Close modal"
          >
            <X color="#000" size={24} />
          </TouchableOpacity>

          <Text style={styles.title}>Mint</Text>

          <View style={styles.counterContainer}>
            <TouchableOpacity
              style={styles.circleButton}
              onPress={handleDecrement}
              accessibilityLabel="Decrease quantity"
            >
              <Minus color="#000" size={24} />
            </TouchableOpacity>

            <Text style={styles.quantity}>{quantity}</Text>

            <TouchableOpacity
              style={styles.circleButton}
              onPress={handleIncrement}
              accessibilityLabel="Increase quantity"
            >
              <Plus color="#000" size={24} />
            </TouchableOpacity>
          </View>

          <View style={styles.buttonGroup}>
            {[1, 10, 100, 500].map((amount) => (
              <TouchableOpacity
                key={amount}
                style={[
                  styles.quantityButton,
                  selectedButton === amount && styles.selectedButton,
                ]}
                onPress={() => handleQuantitySelect(amount)}
                accessibilityLabel={`Select quantity ${amount}`}
              >
                <Text
                  style={[
                    styles.quantityButtonText,
                    selectedButton === amount && styles.selectedButtonText,
                  ]}
                >
                  {amount}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.totalContainer}>
            <Text style={styles.totalText}>Total:</Text>
            <Text style={styles.totalAmount}>
              ~ {`$${(0.000111 * quantity * 3719).toLocaleString()}`}
            </Text>
          </View>

          <View style={styles.disclaimerContainer}>
            <Text style={styles.disclaimer}>
              The more you mint, the closer this dispopen gets to securing a
              spot in the official collection.
            </Text>
          </View>

          <TouchableOpacity
            onPress={!isLoading ? handleMint : () => {}} // Disable button interaction when loading
            style={[styles.depositButton, isLoading && styles.disabledButton]}
            accessibilityLabel="Mint"
          >
            <View style={styles.horizontalContainer}>
              {isLoading && (
                <ActivityIndicator
                  size="small"
                  color="#ffffff"
                  style={styles.spinner}
                />
              )}
              <Text style={styles.depositButtonText}>
                {isLoading ? "Minting..." : "Mint"}
              </Text>
            </View>
          </TouchableOpacity>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 36,
    borderTopRightRadius: 36,
    padding: 24,
    alignItems: "center",
    width: "100%",
    maxHeight: "80%",
    alignSelf: "flex-end",
  },
  closeButton: {
    position: "absolute",
    top: 24,
    right: 24,
    zIndex: 1,
  },
  title: {
    fontSize: 19,
    fontFamily: "CabinetGrotesk-Bold",
    // fontWeight: "600",
    color: "#000000",
    marginTop: 0,
    marginBottom: 30,
  },
  disabledButton: {
    opacity: 0.8, // Dim the button to indicate it's in a loading state
  },
  counterContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "60%",
    marginBottom: 30,
  },
  circleButton: {
    width: 50,
    height: 50,
    borderRadius: 24,
    backgroundColor: "#F5F5F5",
    justifyContent: "center",
    alignItems: "center",
  },
  quantity: {
    fontSize: 48,
    fontFamily: "CabinetGrotesk-ExtraBold",
    // fontWeight: "bold",
    color: "#000000",
  },
  buttonGroup: {
    flexDirection: "row",
    justifyContent: "center",
    // flex: 1,
    gap: 10,
    marginBottom: 12,
    width: "100%",
  },
  quantityButton: {
    paddingVertical: 12,
    paddingHorizontal: 29,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: "#E5E5E5",
    backgroundColor: "#FFFFFF",
  },
  selectedButton: {
    backgroundColor: "#1A1A1A",
    borderColor: "#1A1A1A",
  },
  quantityButtonText: {
    fontSize: 17,
    fontFamily: "CabinetGrotesk-Bold",
    color: "#1A1A1A",
    // fontWeight: "500",
  },
  selectedButtonText: {
    color: "#FFFFFF",
  },
  disclaimerContainer: {
    backgroundColor: "#E8F5E9",
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 24,
    width: "100%",
  },
  disclaimer: {
    fontFamily: "CabinetGrotesk-Medium",
    fontSize: 15,
    lineHeight: 22,
    color: "#2E7D32",
    textAlign: "left",
  },
  totalContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    marginBottom: 12,
  },
  totalText: {
    fontSize: 15,
    fontFamily: "CabinetGrotesk-Medium",
    color: "#666666",
  },
  totalAmount: {
    fontFamily: "CabinetGrotesk-Medium",
    fontSize: 15,
    fontWeight: "600",
    color: "#000000",
  },
  depositButton: {
    backgroundColor: "#1A1A1A",
    width: "100%",
    padding: 16,
    borderRadius: 60,
    alignItems: "center",
    marginBottom: 20,
  },
  depositButtonText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontFamily: "CabinetGrotesk-Bold",
  },
  horizontalContainer: {
    flexDirection: "row", // Align spinner and text horizontally
    alignItems: "center",
  },
  spinner: {
    marginRight: 8, // Adds spacing between spinner and text
  },
});
