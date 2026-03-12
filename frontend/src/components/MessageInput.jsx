import { useState, useRef, useEffect } from "react";
import { Image, Send, Smile } from "lucide-react";
import { useChatStore } from "../store/useChatStore";
import { socket } from "../lib/socket";
import EmojiPicker from "emoji-picker-react";

const MessageInput = () => {
  const [text, setText] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [showEmoji, setShowEmoji] = useState(false);

  const emojiRef = useRef(null);

  const { sendMessage, selectedUser } = useChatStore();

  // 📸 Image upload
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onloadend = () => {
      setImagePreview(reader.result);
    };

    reader.readAsDataURL(file);
  };

  // 😀 Emoji select
  const handleEmojiClick = (emojiData) => {
    setText((prev) => prev + emojiData.emoji);
  };

  // 💬 Send message
  const handleSendMessage = async () => {
    if (!text.trim() && !imagePreview) return;

    await sendMessage({
      text,
      image: imagePreview,
    });

    setText("");
    setImagePreview(null);
  };

  // ⌨ Typing indicator
  const handleTyping = () => {
    socket.emit("typing", {
      receiverId: selectedUser._id,
    });
  };

  // ⏎ Enter send / Shift+Enter newline
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // 🔥 Close emoji when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (emojiRef.current && !emojiRef.current.contains(event.target)) {
        setShowEmoji(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="p-4 w-full border-t border-base-300 relative">

      {/* Image Preview */}
      {imagePreview && (
        <div className="mb-3">
          <img
            src={imagePreview}
            alt="preview"
            className="max-w-[200px] rounded-md"
          />
        </div>
      )}

      <div className="flex items-center gap-2">

        {/* 😀 Emoji Button */}
        <button
          onClick={() => setShowEmoji(!showEmoji)}
          className="btn btn-sm btn-circle"
        >
          <Smile size={20} />
        </button>

        {/* Emoji Picker */}
        {showEmoji && (
          <div ref={emojiRef} className="absolute bottom-16 left-4 z-50">
            <EmojiPicker onEmojiClick={handleEmojiClick} />
          </div>
        )}

        {/* Message Input */}
        <textarea
          className="textarea textarea-bordered w-full resize-none"
          placeholder="Type a message..."
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            handleTyping();
          }}
          onKeyDown={handleKeyDown}
        />

        {/* Image Upload */}
        <label className="btn btn-sm btn-circle">
          <Image size={20} />
          <input
            type="file"
            className="hidden"
            accept="image/*"
            onChange={handleImageChange}
          />
        </label>

        {/* Send Button */}
        <button
          onClick={handleSendMessage}
          className="btn btn-sm btn-circle btn-primary"
        >
          <Send size={20} />
        </button>

      </div>
    </div>
  );
};

export default MessageInput;