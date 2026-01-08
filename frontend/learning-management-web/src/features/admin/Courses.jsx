import React, { useEffect, useState } from "react";
import {
  Alert,
  Backdrop,
  Box,
  Button,
  CardContent,
  CircularProgress,
  Divider,
  Grid,
  IconButton,
  Menu,
  MenuItem,
  Snackbar,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import CourseCard from "../../components/CourseCard";
import CreateOrEditCourse from "../course/CreateOrEditCourse";
import DeleteConfirmationModal from "../../components/DeleteConfirmationModal";
import BackendService from "../../service/BackendService";
import { Link } from "react-router-dom";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useDispatch } from "react-redux";
import { notificationSliceActions } from "../../service/NotificationSlice";
import AddIcon from '@mui/icons-material/Add';
import SentimentDissatisfiedIcon from "@mui/icons-material/SentimentDissatisfied"; // icon for empty state

function Courses() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const dispatch = useDispatch();
  const handleMenuOpen = (event, course) => {
    setMenuAnchorEl(event.currentTarget);
    setSelectedCourse(course);
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
    // setSelectedCourse(null);
  };

  const handleEdit = () => {
    setOpen(true);
    setMenuAnchorEl(null);
  };

  const handleDelete = () => {
    setDeleteModalOpen(true);
    handleMenuClose();
  };

  const confirmDelete = () => {
    if (!selectedCourse) return;
    setLoading(true);
    BackendService.deleteCourse(selectedCourse.uniqueId)
      .then(() => {
        setCourses((prev) =>
          prev.filter((c) => c.uniqueId !== selectedCourse.uniqueId)
        );
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  const getCourses = () => {
    setLoading(true);
    BackendService.getCourses()
      .then((res) => {
        setCourses(res?.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    getCourses();
  }, []);

  const deleteCourse = () => {
    setDeleteLoading(true);
    BackendService.deleteCoure(selectedCourse?.id)
      .then((res) => {
        setDeleteLoading(false);
        setDeleteModalOpen(false);
        getCourses()
        dispatch(
          notificationSliceActions?.setNotification({
            open: true,
            severity: "success",
            message: "Course deleted successfully",
          })
        );
      })
      
      .catch((err) => {
        setDeleteLoading(false);
        dispatch(
          notificationSliceActions?.setNotification({
            open: true,
            severity: "error",
            message: "Failed to delete course",
          })
        );
      });
  };

  return (
    <Box style={{width:'100%'}}>
      <Box style={{width:'100%'}} className="headerContainer">
     
      </Box>

      <Box  className="flexBox" style={{ flexWrap: "wrap", gap: "4px",width:'100%' }}>
      <Typography className="header" gutterBottom>
          All Courses
        </Typography>

        <Button
          onClick={() => {
            setSelectedCourse(null);
            setOpen(true);
          }}
          className="pimaryBtnAdmin"
        >
          <AddIcon />
          Create Course
        </Button>
      </Box>

      <Box style={{ marginTop: "12px",width:'100%'}} className="gridBox">
        <Backdrop
          sx={(theme) => ({
            color: "#3B9261",
            zIndex: theme.zIndex.drawer + 1,
          })}
          open={loading}
        >
          <CircularProgress color="#3B9261" />
        </Backdrop>

        {/* ✅ Empty State */}
        {courses?.length === 0 && !loading && (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              height: "50vh",
              textAlign: "center",
              color: "#666",
              width: "95vw",

            }}
          >
            <SentimentDissatisfiedIcon sx={{ fontSize: 80, color: "#999", mb: 2 }} />
            <Typography variant="h6">No courses available</Typography>
            <Typography variant="body2" sx={{ mt: 1 }}>
              Start by creating a new course using the button above.
            </Typography>
          </Box>
        )}

        {courses?.map((course, index) => {
          const hasDescription =
            course?.description && course.description.trim() !== "";
          return (
            <Grid key={index}>
              <CourseCard courseType="all" course={course}>
                <CardContent
                  sx={{
                    flexGrow: 1,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                  }}
                >
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Tooltip title={course?.name}>
                      <Typography    variant="h6" noWrap>
                        {course.name}
                      </Typography>
                    </Tooltip>

                    {/* More menu icon */}
                    <IconButton onClick={(e) => handleMenuOpen(e, course)}>
                      <MoreVertIcon />
                    </IconButton>

                    <Menu
                      anchorEl={menuAnchorEl}
                      open={
                        Boolean(menuAnchorEl) &&
                        selectedCourse?.uniqueId === course.uniqueId
                      }
                      onClose={handleMenuClose}
                      PaperProps={{
                        sx: {
                          boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.15)", // lighter shadow
                          borderRadius: "8px",
                          // minWidth: "140px",
                        },
                      }}
                    >
                      <MenuItem
                        onClick={() => {
                          handleEdit();
                        }}
                      >
                        <EditIcon
                          style={{ color: "#3B9261", marginRight: "8px" }}
                        />
                        Edit
                      </MenuItem>
                      <Divider />
                      <MenuItem onClick={handleDelete}>
                        <DeleteIcon
                          style={{ color: "#b30909", marginRight: "8px" }}
                        />
                        Delete
                      </MenuItem>
                    </Menu>
                  </Box>

                  <Tooltip title={hasDescription ? course.description : ""}>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        display: "-webkit-box",
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        minHeight: "3.6em",
                        mt: 1,
                      }}
                    >
                      {hasDescription ? course.description : "-"}
                    </Typography>
                  </Tooltip>
                  <Box>
                    <Box
                      style={{
                        display: "flex",
                        gap: "12px",
                        alignItems: "center",
                        marginTop: "12px",
                      }}
                    >
                      <Button 
                        component={Link}
                        to={`/view-course/${course?.id}`}
                        variant={"all"}
                        style={{
                          width: "100%",
                          color: "#3B9261",
                          border: "1px solid #3B9261",
                          backgroundColor: "white",
                          boxShadow: "none",
                          textTransform: "none",
                          "&:hover": {
                            backgroundColor: "#f0f0f0",
                          },
                        }}
                      >
                        {"View"}
                      </Button>
                    </Box>
                  </Box>
                </CardContent>
              </CourseCard>
            </Grid>
          );
        })}
      </Box>

      {/* Create / Edit Modal */}
      <CreateOrEditCourse
        open={open}
        setOpen={setOpen}
        getCourses={getCourses}
        selectedCourse={selectedCourse}
        setSelectedCourse={setSelectedCourse}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        open={deleteModalOpen}
        setOpen={setDeleteModalOpen}
        title="Delete Course"
        message="Are you sure you want to delete this course? This action cannot be undone."
        onConfirm={deleteCourse}
        loading={deleteLoading}
      />
    </Box>
  );
}

export default Courses;
