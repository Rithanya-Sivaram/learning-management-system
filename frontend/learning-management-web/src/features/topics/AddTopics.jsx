import React, { useEffect, useRef, useState } from "react";
import {
  TextField,
  Button,
  Tooltip,
  IconButton,
  Tabs,
  Tab,
  Box,
  Typography,
  Backdrop,
  CircularProgress,
} from "@mui/material";
import PublishIcon from "@mui/icons-material/Publish";
import classes from "./Tpoics.module.css";
import MarkdownRenderer from "./MarkdownRenderer";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useParams } from "react-router-dom";
import BackendService from "../../service/BackendService";
import { useDispatch } from "react-redux";
import { notificationSliceActions } from "../../service/NotificationSlice";
import { useNavigate } from "react-router-dom";
import DeleteConfirmationModal from "../../components/DeleteConfirmationModal";
import { useSelector } from "react-redux";

function AddTopics() {
  const userGroups = useSelector((state) => state?.cognito?.userGroups);
  const isAdmin = userGroups?.includes("r_author");
  const contentTextareaRef = useRef(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [activeTab, setActiveTab] = useState(0);
  const [description, setDescription] = useState("");
  const [duration, setDuration] = useState("");
  const { courseId, topicId } = useParams();
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleToolbarClick = (action) => {
    const textarea = contentTextareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);

    let newText = "";

    switch (action) {
      case "bold":
        if (/^\*\*(.*)\*\*$/.test(selectedText)) {
          newText = selectedText.replace(/^\*\*(.*)\*\*$/, "$1");
        } else {
          newText = `**${selectedText || "bold text"}**`;
        }
        break;
      case "italic":
        if (/^\*(.*)\*$/.test(selectedText)) {
          newText = selectedText.replace(/^\*(.*)\*$/, "$1");
        } else {
          newText = `*${selectedText || "italic text"}*`;
        }
        break;
      case "strike":
        if (/^~~(.*)~~$/.test(selectedText)) {
          newText = selectedText.replace(/^~~(.*)~~$/, "$1");
        } else {
          newText = `~~${selectedText || "strikethrough"}~~`;
        }
        break;
      case "underline":
        if (/^<u>(.*)<\/u>$/.test(selectedText)) {
          newText = selectedText.replace(/^<u>(.*)<\/u>$/, "$1");
        } else {
          newText = `<u>${selectedText || "underlined"}</u>`;
        }
        break;
      case "link":
        if (/^\[.*\]\(.*\)$/.test(selectedText)) {
          newText = selectedText.replace(/^\[(.*)\]\(.*\)$/, "$1");
        } else {
          newText = `[${selectedText || "link text"}](https://)`;
        }
        break;
      case "quote":
        if (/^> /.test(selectedText)) {
          newText = selectedText.replace(/^> /, "");
        } else {
          newText = `> ${selectedText || "quote"}`;
        }
        break;
      case "code":
        if (/^`.*`$/.test(selectedText)) {
          newText = selectedText.replace(/^`(.*)`$/, "$1");
        } else {
          newText = `\`${selectedText || "inline code"}\``;
        }
        break;
      case "image":
        if (/^!\[.*\]\(.*\)$/.test(selectedText)) {
          newText = selectedText.replace(/^!\[(.*)\]\(.*\)$/, "$1");
        } else {
          newText = `![${selectedText || "alt text"}](https://)`;
        }
        break;
      case "ul": {
        const lines = selectedText.split("\n");
        if (lines.every((line) => /^\s*-\s/.test(line))) {
          newText = lines
            .map((line) => line.replace(/^(\s*)-\s/, "$1"))
            .join("\n");
        } else {
          newText = lines
            .map((line) => (line.trim() ? `- ${line}` : line))
            .join("\n");
        }
        break;
      }
      case "ol": {
        const lines = selectedText.split("\n");
        if (lines.every((line) => /^\s*\d+\.\s/.test(line))) {
          newText = lines
            .map((line) => line.replace(/^(\s*)\d+\.\s+/, "$1"))
            .join("\n");
        } else {
          let counter = 1;
          newText = lines
            .map((line) => (line.trim() ? `${counter++}. ${line}` : line))
            .join("\n");
        }
        break;
      }
      default:
        return;
    }

    const updatedContent =
      content.substring(0, start) + newText + content.substring(end);
    setContent(updatedContent);

    setTimeout(() => {
      textarea.focus();
      textarea.selectionStart = start;
      textarea.selectionEnd = start + newText.length;
    }, 0);
  };

  const autoResizeTextarea = (element) => {
    if (element) {
      element.style.height = "auto";
      element.style.height = element.scrollHeight + "px";
    }
  };

  const handleContentChange = (e) => {
    setContent(e.target.value);
    // setTimeout(() => autoResizeTextarea(contentTextareaRef.current), 0);
  };

  useEffect(() => {
    autoResizeTextarea(contentTextareaRef.current);
  }, [content]);

  const createTopic = () => {
    const data = {
      name: title,
      description: content,
      duration: duration,
      courseId: courseId,
    };
    setLoading(true);
    BackendService?.createTopic(data)
      .then((res) => {
        setLoading(false);
        dispatch(
          notificationSliceActions.setNotification({
            open: true,
            severity: "success",
            message: "Topic added successfully",
          })
        );
        navigate(`/view-course/${courseId}`);
      })
      .catch((err) => {
        setLoading(false);
        dispatch(
          notificationSliceActions.setNotification({
            open: true,
            severity: "error",
            message: "Failed to add topic",
          })
        );
      });
  };
  const editTopic = () => {
    const data = {
      name: title,
      description: content,
      duration: duration,
      courseId: courseId,
    };
    setLoading(true);
    BackendService?.updateTopic(data, topicId)
      .then((res) => {
        setLoading(false);
        dispatch(
          notificationSliceActions.setNotification({
            open: true,
            severity: "success",
            message: "Topic edited successfully",
          })
        );
        navigate(`/view-course/${courseId}`);
      })
      .catch((err) => {
        setLoading(false);
        dispatch(
          notificationSliceActions.setNotification({
            open: true,
            severity: "error",
            message: "Failed to edit topic",
          })
        );
      });
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const tabs = ["Write", "Preview"];
  const navigateBack = () => {
    navigate(`/view-course/${courseId}`);
  };

  const getCourse = () => {
    setLoading(true);
    BackendService?.fetchTopic(topicId)
      .then((res) => {
        setLoading(false);
        setTitle(res?.data?.name);
        setDuration(res?.data?.duration);
        setContent(res?.data?.description);
      })
      .catch((err) => {
        setLoading(false);
      });
  };
  useEffect(() => {
    if (topicId) {
      getCourse();
    }
  }, [topicId]);


  return (
    <>
      <Backdrop  sx={{
           position: 'absolute',
           zIndex: (theme) => theme.zIndex.drawer + 1,
           color: isAdmin ? '#3B9261' : '#1b3764',
         }}open={loading}>
        <CircularProgress color={isAdmin ? "#3B9261" : "#1b3764"} />
      </Backdrop>
      <Box style={{ marginBottom: "12px" }} className="flexBox">
        <Button
          onClick={navigateBack}
          startIcon={<ArrowBackIcon />}
          className="secondaryBtnAdmin"
        >
          Back
        </Button>
        <Button
          startIcon={<PublishIcon />}
          onClick={() => {
            if (topicId) {
              editTopic();
            } else {
              createTopic();
            }
          }}
          disabled={!title || !content || !duration}
          className="pimaryBtnAdmin"
        >
          {topicId ? "Edit Tpoic" : "Add Topic"}
        </Button>
      </Box>
      <Box
        sx={{
          display: "flex",
          gap: "12px",
          alignItems: "center",
        }}
      >
        <TextField
          style={{ backgroundColor: 'white' }}
          label="Topic Title"
          value={title}
          size="small"
          onChange={(e) => setTitle(e.target.value)}
          margin="normal"
          variant="outlined"
          InputLabelProps={{
            sx: {
              '&.Mui-focused': { color: isAdmin ? '#3B9261' : '#1b3764' },
            },
          }}
          InputProps={{
            sx: {
              '& .MuiOutlinedInput-notchedOutline': {
                border: 'none !important',
                borderBottom: '1px solid #ddd !important',
              },
              '&:hover .MuiOutlinedInput-notchedOutline': {
                border: 'none !important',
                borderBottom: '1px solid #ccc !important',
              },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                border: 'none !important',
                borderBottom: `2px solid ${isAdmin ? '#3B9261' : '#1b3764'} !important`,
              },
            },
          }}
        />

        <TextField
          style={{ backgroundColor: 'white' }}
          label="Duration in minutes"
          value={duration}
          size="small"
          onChange={(e) => {
            const value = e.target.value;
            // Allow only digits
            if (/^\d*$/.test(value)) {
              setDuration(value);
            }
          }}
          margin="normal"
          variant="outlined"
          InputLabelProps={{
            sx: {
              '&.Mui-focused': { color: isAdmin ? '#3B9261' : '#1b3764' },
            },
          }}
          InputProps={{
            sx: {
              '& .MuiOutlinedInput-notchedOutline': {
                border: 'none !important',
                borderBottom: '1px solid #ddd !important',
              },
              '&:hover .MuiOutlinedInput-notchedOutline': {
                border: 'none !important',
                borderBottom: '1px solid #ccc !important',
              },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                border: 'none !important',
                borderBottom: `2px solid ${isAdmin ? '#3B9261' : '#1b3764'} !important`,
              },
            },
            inputMode: "numeric", // Suggests numeric keyboard on mobile
            pattern: "[0-9]*", // Hints the allowed pattern
          }}
        />
      </Box>
      <div className={`${classes.createBlogEditor} ${classes.endlessEditor}`}>
        <div
          className={`${classes.createBlogEditorCard} ${classes.endlessCard}`}
        >
          {/* Title Row */}

          {/* Tabs and Toolbar Row */}

          {/* Content Area with Border */}
          <div
            style={{ border: "1px solid #ddd", borderRadius: "8px" }}
            className={` ${classes.detailsBox} `}
          >
            <div className={classes.headerContainers}>
              {/* Tabs */}
              <div>
                <Tabs
                  value={activeTab}
                  onChange={handleTabChange}
                  sx={{
                    '& .MuiTabs-indicator': { backgroundColor: `${isAdmin ? '#3B9261' : '#1b3764'} !important` },
                  }}
                >
                  {tabs.map((label, index) => (
                    <Tab
                      style={{ textTransform: "none" }}
                      key={index}
                      label={label}
                      sx={{
                        '&.Mui-selected': {
                          color: `${isAdmin ? '#3B9261' : '#1b3764'} !important`,
                          borderBottom: `2px solid ${isAdmin ? '#3B9261' : '#1b3764'} !important`,
                        },
                      }}
                    />
                  ))}
                </Tabs>
              </div>

              {/* Toolbar Icons */}
              {activeTab === 0 && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  {[
                    "bold",
                    "italic",
                    "strike",
                    "underline",
                    "link",
                    "quote",
                    "code",
                    "image",
                    "ul",
                    "ol",
                  ].map((icon) => (
                    <span
                      key={icon}
                      className={`material-symbols-outlined ${classes.blogIconStyle}`}
                      onClick={() => handleToolbarClick(icon)}
                      style={{ cursor: "pointer" }}
                    >
                      {icon === "bold"
                        ? "format_bold"
                        : icon === "italic"
                        ? "format_italic"
                        : icon === "strike"
                        ? "strikethrough_s"
                        : icon === "underline"
                        ? "format_underlined"
                        : icon === "link"
                        ? "link"
                        : icon === "quote"
                        ? "format_quote"
                        : icon === "code"
                        ? "code"
                        : icon === "image"
                        ? "image"
                        : icon === "ul"
                        ? "format_list_bulleted"
                        : "format_list_numbered"}
                    </span>
                  ))}
                </div>
              )}
            </div>
            <div style={{ height: "62vh", overflowY: "auto" }}>
              {activeTab === 0 ? (
                <div style={{ marginLeft: "20px" }}>
                  <textarea

                    ref={contentTextareaRef}
                    placeholder="Start writing... Let your thoughts flow freely."
                    value={content}
                    onChange={handleContentChange}
                    style={{ height: "auto",backgroundColor:'white' }}
                    className={` ${classes.endlessTextarea}`}
                    // style={{ minHeight: "calc(100vh - 300px)", width: "100%", border: "none", outline: "none" }}
                  />
                </div>
              ) : (
                <div
                  className={`${classes.createBlogPreviewArea} ${classes.endlessPreview}`}
                >
                  <h1 className={classes.createBlogPreviewTitle}>
                    {title || "Untitled Post"}
                  </h1>
                  {content ? (
                    <div className={classes.endlessPreviewContent}>
                      <MarkdownRenderer content={content} />
                    </div>
                  ) : (
                    <div
                      className={`${classes.createBlogPreviewEmpty} ${classes.endlessEmpty}`}
                    >
                      <div className={classes.endlessEmptyContent}>
                        <p>Start writing to see your preview...</p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
          {/* Right Side – Form Fields */}
        </div>
    
      </div>
    </>
  );
}

export default AddTopics;
