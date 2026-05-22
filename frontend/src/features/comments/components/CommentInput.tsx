import React, { useState, useEffect, useRef } from "react";
import { View, TextInput, TouchableOpacity, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { IComment } from "../types";
import { styles } from "../styles/commentStyles";

interface CommentInputProps {
  replyTarget: IComment | null;
  onClearReplyTarget: () => void;
  onSubmit: (text: string) => void;
}

export const CommentInput: React.FC<CommentInputProps> = ({
  replyTarget,
  onClearReplyTarget,
  onSubmit,
}) => {
  const [text, setText] = useState("");
  const [inputHeight, setInputHeight] = useState(38);
  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    if (replyTarget) {
      inputRef.current?.focus();
    }
  }, [replyTarget]);

  const handleSend = () => {
    if (!text.trim()) return;
    onSubmit(text.trim());
    setText("");
    setInputHeight(38);
  };

  return (
    <View style={{ backgroundColor: "#1A2902" }}>
      {replyTarget && (
        <View style={styles.mentionIndicatorBar}>
          <Text style={styles.mentionTextData}>
            Replying to{" "}
            <Text style={styles.boldMention}>@{replyTarget.user.name}</Text>
          </Text>
          <TouchableOpacity
            onPress={onClearReplyTarget}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Ionicons
              name="close-circle"
              size={18}
              color="rgba(255, 255, 255, 0.4)"
            />
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.inputContainer}>
        <TextInput
          ref={inputRef}
          style={[styles.textInput, { height: Math.max(38, inputHeight) }]}
          placeholder={replyTarget ? "Add a reply..." : "Add comment..."}
          placeholderTextColor="rgba(255, 255, 255, 0.3)"
          value={text}
          onChangeText={setText}
          multiline
          maxLength={600}
          onContentSizeChange={(e) =>
            setInputHeight(Math.min(e.nativeEvent.contentSize.height, 100))
          }
        />
        <TouchableOpacity
          onPress={handleSend}
          disabled={!text.trim()}
          style={[styles.sendButton, !text.trim() && styles.disabledSendButton]}
        >
          <Ionicons name="arrow-up-circle" size={32} color="#99CC33" />
        </TouchableOpacity>
      </View>
    </View>
  );
};
