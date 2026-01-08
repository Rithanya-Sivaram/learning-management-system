import React, { useState, useRef, useEffect } from "react";
import {
  Box,
  IconButton,
  TextField,
  Paper,
  Typography,
  InputAdornment,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import SendIcon from "@mui/icons-material/Send";

const ChatPopup = ({ open, setOpen }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);

  const toggleOpen = () => setOpen((prev) => !prev);

  const sendMessage = () => {
    if (!input.trim()) return;

    // Add user message
    setMessages((prev) => [...prev, { text: input, sender: "user" }]);
    setInput("");

    // Simulate AI response
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { text: "This is an AI response to: " + input, sender: "ai" },
      ]);
    }, 1000);
  };

  // Scroll to bottom when new message arrives
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <>
      {/* Floating Chat Button */}

      {/* Chat Popup */}
      {open && (
        <Paper
          elevation={3}
          sx={{
            position: "fixed",
            bottom: 24,
            right: 24,
            width: 300,
            height: 400,
            display: "flex",
            flexDirection: "column",
            zIndex: 9999,
            borderRadius: "8px",
          }}
        >
          {/* Header */}
          <Box
            style={{ color: "white" }}
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              bgcolor: "#1b3764",
              color: "#fff",
              p: 1,
              borderTopLeftRadius: "8px",
              borderTopRightRadius: "8px",
            }}
          >
            <Typography style={{ color: "white" }} variant="subtitle1">
              Chat
            </Typography>
            <IconButton onClick={toggleOpen} sx={{ color: "#fff" }}>
              <CloseIcon />
            </IconButton>
          </Box>

          {/* Messages */}
          <Box
            sx={{
              flexGrow: 1,
              p: 1,
              overflowY: "auto",
              display: "flex",
              flexDirection: "column",
              gap: 1,
            }}
          >
            {messages.map((msg, index) => (
              <Box
                key={index}
                sx={{
                  alignSelf: msg.sender === "user" ? "flex-end" : "flex-start",
                  bgcolor: msg.sender === "user" ? "#1b3764" : "#f1f1f1",
                  color: msg.sender === "user" ? "#fff" : "#000",
                  borderRadius: 2,
                  px: 1.5,
                  py: 1,
                  maxWidth: "80%",
                  wordWrap: "break-word",
                }}
              >
                {msg.text}
              </Box>
            ))}
            <div ref={messagesEndRef} />
          </Box>

          {/* Input */}
          <Box sx={{ p: 1 }}>
            <TextField
              style={{backgroundColor:'white'}}
              fullWidth
              size="small"
              placeholder="Type a message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={sendMessage} edge="end">
                      <SendIcon />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Box>
        </Paper>
      )}
    </>
  );
};

export default ChatPopup;
