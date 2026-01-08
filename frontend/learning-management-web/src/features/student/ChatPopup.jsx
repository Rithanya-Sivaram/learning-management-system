import React, { useState, useRef, useEffect } from "react";
import {
  Box,
  IconButton,
  TextField,
  Paper,
  Typography,
  InputAdornment,
  Dialog,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import SendIcon from "@mui/icons-material/Send";
import OpenInFullIcon from "@mui/icons-material/OpenInFull"; // expand
import CloseFullscreenIcon from "@mui/icons-material/CloseFullscreen"; // shrink
import BackendService from "../../service/BackendService";
import { useDispatch } from "react-redux";
import { notificationSliceActions } from "../../service/NotificationSlice";

const ChatPopup = ({ open, setOpen }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const messagesEndRef = useRef(null);

  const toggleOpen = () => setOpen((prev) => !prev);
  const dispatch = useDispatch();
  const sendMessage = () => {
    if (!input.trim()) return;
    setLoading(true);

    // Show user message
    setMessages((prev) => [...prev, { text: input, sender: "user" }]);
    const userMessage = input;
    setInput("");

    // Fetch AI response
    BackendService.askAi(userMessage)
      .then((res) => {
        setLoading(false);
        setMessages((prev) => [
          ...prev,
          { text: res?.data || "No response", sender: "ai" },
        ]);
      })
      .catch(() => {
        setLoading(false);
        dispatch(
          notificationSliceActions?.setNotification({
            open: true,
            severity: "error",
            message: "Something went wrong. Try again",
          })
        );
        setMessages((prev) => [...prev, { text: "", sender: "ai" }]);
      });
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const ChatContent = (isModal = false) => (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          bgcolor: "#1b3764",
          color: "#fff",
          p: 1,
        }}
      >
        <Typography style={{ color: "white",marginLeft:'8px' }} variant="subtitle1">
          LMS AI
        </Typography>
        <Box>
          {isModal ? (
            <IconButton
              onClick={() => setIsExpanded(false)}
              sx={{ color: "#fff" }}
            >
              <CloseFullscreenIcon />
            </IconButton>
          ) : (
            <IconButton
              onClick={() => setIsExpanded(true)}
              sx={{ color: "#fff" }}
            >
              <OpenInFullIcon />
            </IconButton>
          )}
          <IconButton onClick={toggleOpen} sx={{ color: "#fff" }}>
            <CloseIcon />
          </IconButton>
        </Box>
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
          placeholder="Ask LMS AI..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton disabled={loading} onClick={sendMessage} edge="end">
                  <SendIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Box>
    </Box>
  );

  return (
    <>
      {/* Small Floating Popup */}
      {open && !isExpanded && (
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
          {ChatContent(false)}
        </Paper>
      )}

      {/* Expanded Modal */}
      <Dialog
        open={isExpanded}
        onClose={() => setIsExpanded(false)}
        fullWidth
        maxWidth="md"
      >
        <Box sx={{ height: "80vh" }}>{ChatContent(true)}</Box>
      </Dialog>
    </>
  );
};

export default ChatPopup;
