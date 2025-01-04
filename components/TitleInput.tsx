import React, { useState } from "react";
import { View, TextInput, Text, StyleSheet } from "react-native";

interface TitleInputProps {
  onTitleChange: (title: string) => void;
  error: string | null;
}

const TitleInput: React.FC<TitleInputProps> = ({ onTitleChange, error }) => {
  const [title, setTitle] = useState("");

  const handleTitleChange = (text: string) => {
    setTitle(text);
    onTitleChange(text);
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={[styles.titleInput, error ? styles.inputError : null]}
        placeholder="Add a title"
        placeholderTextColor="#C7C7CC"
        value={title}
        onChangeText={handleTitleChange}
        accessibilityLabel="Title input"
        accessibilityHint="Enter a title for your content"
      />
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // marginBottom: 10,
  },
  titleInput: {
    height: 40,
    // borderColor: "#C7C7CC",
    // borderWidth: 1,
    // borderRadius: 5,
    // paddingHorizontal: 10,
    fontSize: 16,
    color: "#000",
    fontFamily: "CabinetGrotesk-Medium",
  },
  inputError: {
    borderColor: "red",
  },
  errorText: {
    color: "red",
    fontSize: 12,
    // marginTop: 5,
    fontFamily: "CabinetGrotesk-Medium",
  },
});

export default TitleInput;
