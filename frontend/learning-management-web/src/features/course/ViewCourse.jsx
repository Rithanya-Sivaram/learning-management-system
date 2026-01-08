import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Divider,
  Paper,
  Button,
  IconButton,
  Tooltip,
  useMediaQuery,
  MenuItem,
  Select,
  Backdrop,
  CircularProgress,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Link, useNavigate, useParams } from "react-router-dom";
import BackendService from "../../service/BackendService";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useDispatch } from "react-redux";
import { notificationSliceActions } from "../../service/NotificationSlice";
import DeleteConfirmationModal from "../../components/DeleteConfirmationModal";
import FolderOpenIcon from "@mui/icons-material/FolderOpen";
import MarkdownRenderer from "../topics/MarkdownRenderer";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

function ViewCourse({ isAdmin }) {
  const navigate = useNavigate();
  const { courseId } = useParams();
  const [loading, setLoading] = useState();
  const [topics, setTopics] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState();
  const isMobile = useMediaQuery("(max-width:1100px)"); //
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const dispatch = useDispatch();

  const getTopics = () => {
    setLoading(true);
    BackendService?.fetchTopics(courseId)
      .then((res) => {
        setLoading(false);
        setTopics(res?.data);
      })
      .catch((err) => {
        setLoading(false);
      });
  };
  useEffect(() => {
    getTopics();
  }, [courseId]);
  useEffect(() => {
    if (!selectedTopic) {
      setSelectedTopic(topics[0]);
    }
  }, [topics]);

  const editTopics = (topic) => {
    navigate(`/edit-topic/${courseId}/${topic?.id}`);
  };
  const deleteTopic = (topic) => {
    setLoading(true);
    BackendService.deleteTopic(selectedTopic?.id)
      .then((res) => {
        getTopics();
        setDeleteModalOpen(false);
        setLoading(false);
        dispatch(
          notificationSliceActions?.setNotification({
            open: true,
            severity: "success",
            message: "Topic deleted successfully",
          })
        );
      })

      .catch((err) => {
        dispatch(
          notificationSliceActions?.setNotification({
            open: true,
            severity: "error",
            message: "Failed to delete topic",
          })
        );
      });
  };

  const closeModal = () => {
    setDeleteModalOpen(false);
    setSelectedTopic();
  };
  const deleteModalOpenHandler = (topic) => {
    setSelectedTopic(topic);
    setDeleteModalOpen(true);
  };
  const handleSelectChange = (topicId) => {
    const topic = topics?.find((t) => t?.id === topicId);
    setSelectedTopic(topic);
  };
  const navigateBack = () => {
    navigate(`/my-courses`);
  };

  return (
    <>
      <Backdrop open={loading}>
        <CircularProgress color={isAdmin ? "#3B9261" : "#1b3764"} />
      </Backdrop>
      <Button
        style={{ marginBottom: "12px" }}
        onClick={navigateBack}
        startIcon={<ArrowBackIcon />}
        className={isAdmin ? "secondaryBtnAdmin" : "secondaryBtn"}
      >
        Back
      </Button>
      <Box
        sx={{
          display: !isMobile && "flex",
          border: "1px solid #ddd",
          borderRadius: 2,
          overflow: "hidden",
          fontFamily: "Arial, sans-serif",
        }}
      >
        {!isMobile ? (
          <Box
            sx={{
              width: "25%",
              backgroundColor: "#fafafa",
              borderRight: "1px solid #ddd",
              overflowY: "auto",
              padding: 2,
            }}
            style={{ borderBottom: "1px solid #ddd" }}
          >
            <Box className="courseContentConatiner">
              <Typography
                variant="h6"
                sx={{ fontWeight: "bold", marginBottom: 2 }}
              >
                Course Content
              </Typography>
              {isAdmin && (
                <Button
                  component={Link}
                  to={`/add-topic/${courseId}`}
                  className={isAdmin ? "pimaryBtnAdmin" : "secondaryBtn"}
                  // style={{width:'100%'}}
                >
                  Add Topic
                </Button>
              )}
            </Box>
            <Box style={{ height: "70vh", overflowY: "auto" }}>
              {topics?.length === 0 ? (
                <Box
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "100%",
                  }}
                >
                  <Box
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                    }}
                  >
                    <FolderOpenIcon
                      style={{ fontSize: 60, marginBottom: 16, color: isAdmin ? '#3B9261' : undefined }}
                    />
                    <Typography>No Topics found add topic</Typography>
                  </Box>
                </Box>
              ) : (
                topics?.map((topic) => (
                  <Paper
                    key={topic.id}
                    elevation={selectedTopic?.id === topic?.id ? 4 : 1}
                    sx={{
                      padding: 2,
                      marginBottom: 1,
                      border:
                        selectedTopic?.id === topic?.id
                          ? `2px solid ${isAdmin ? '#3B9261' : '#1976d2'}`
                          : "1px solid #ccc",
                      cursor: "pointer",
                      backgroundColor:
                        selectedTopic?.id === topic?.id ? (isAdmin ? '#E8F5E9' : '#e3f2fd') : "#fff",
                    }}
                    onClick={() => setSelectedTopic(topic)}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      {/* Title with ellipsis and tooltip */}
                      <Tooltip title={topic.name} placement="top">
                        <Typography
                          variant="subtitle1"
                          sx={{
                            fontWeight: 500,
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            maxWidth: "calc(100% - 80px)", // leave space for icons
                          }}
                        >
                          {topic.name}
                        </Typography>
                      </Tooltip>

                      {isAdmin && (
                        <Box>
                          <IconButton size="small">
                            <EditIcon
                              onClick={() => {
                                editTopics(topic);
                              }}
                              style={{ color: isAdmin ? "#3B9261" : "#1b3764" }}
                              fontSize="small"
                            />
                          </IconButton>
                          <IconButton
                            onClick={() => {
                              deleteModalOpenHandler(topic);
                            }}
                            size="small"
                          >
                            <DeleteIcon
                              style={{ color: "#b30909" }}
                              fontSize="small"
                            />
                          </IconButton>
                        </Box>
                      )}
                    </Box>
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        {topic.duration} Mins
                      </Typography>
                    </Box>
                  </Paper>
                ))
              )}
            </Box>
          </Box>
        ) : (
          <Box
            style={{
              marginTop: "42px",
              paddingLeft: "32px",
              paddingRight: "32px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Select
              value={selectedTopic?.id || ""}
              onChange={(e) => handleSelectChange(e.target.value)}
              renderValue={(selectedId) => {
                const topic = topics.find((t) => t.id === selectedId);
                return topic ? topic.name : "";
              }}
              style={{ minWidth: "250px" }}
            >
              {topics.map((topic) =>
                topics === undefined || topics?.length === 0 ? (
                  <MenuItem disabled>No topic found add topic</MenuItem>
                ) : (
                  <MenuItem key={topic.id} value={topic.id}>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        width: "100%",
                      }}
                    >
                      <Tooltip title={topic.name}>
                        <Typography
                          variant="body1"
                          sx={{
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            maxWidth: "150px",
                          }}
                        >
                          {topic.name}
                        </Typography>
                      </Tooltip>
                      {isAdmin && (
                        <Box>
                          <IconButton
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                            }}
                          >
                            <EditIcon
                              onClick={() => {
                                editTopics(topic);
                              }}
                              fontSize="small"
                              style={{ color: isAdmin ? "#3B9261" : "#1b3764" }}
                            />
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteModalOpenHandler(topic);
                            }}
                          >
                            <DeleteIcon
                              fontSize="small"
                              style={{ color: "#b30909" }}
                            />
                          </IconButton>
                        </Box>
                      )}
                    </Box>
                  </MenuItem>
                )
              )}
            </Select>
                {isAdmin && (
                  <Button
                    component={Link}
                    to={`/add-topic/${courseId}`}
                    className={isAdmin ? "pimaryBtnAdmin" : "secondaryBtn"}
                    // style={{width:'100%'}}
                  >
                    Add Topic
                  </Button>
                )}
          </Box>
        )}

        {/* Right Side: Markdown Preview */}
        <Box
          sx={{
            width: !isMobile ? "75%" : "100%",
            padding: 2,
            overflowY: "auto",
            backgroundColor: "white",
          }}
        >
          <Paper
            elevation={2}
            sx={{
              padding: 3,
              borderRadius: 2,
              backgroundColor: "white",
              height: "74vh",
              overflowY: "auto",
            }}
          >
            {selectedTopic?.description ? (
              <MarkdownRenderer content={selectedTopic?.description} />
            ) : (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "100%",
                  color: "#666",
                  textAlign: "center",
                  px: 2,
                  gap: 1,
                }}
              >
                <InfoOutlinedIcon
                  sx={{ fontSize: 60, mb: 1, color: isAdmin ? "#3B9261" : "#1b3764" }}
                />
                <Typography variant="h6" sx={{ fontWeight: 500 }}>
                  No content available
                </Typography>
                <Typography variant="body2">
                  Add a topic to get started and engage your audience!
                </Typography>
              </Box>
            )}
          </Paper>
        </Box>
        <DeleteConfirmationModal
          open={deleteModalOpen}
          setOpen={setDeleteModalOpen}
          title="Delete Topic"
          message="Are you sure you want to delete this topic? This action cannot be undone."
          onConfirm={deleteTopic}
          closeModal={closeModal}
        />
      </Box>
    </>
  );
}

export default ViewCourse;
