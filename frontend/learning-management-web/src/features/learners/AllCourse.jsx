import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  CardContent,
  Grid,
  Tooltip,
  Typography,
  Backdrop,
  CircularProgress,
} from "@mui/material";
import CourseCard from "../../components/CourseCard";
import BackendService from "../../service/BackendService";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useDispatch, useSelector } from "react-redux";
import { notificationSliceActions } from "../../service/NotificationSlice";
import { Link } from "react-router-dom";

function AllCourse() {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [courses, setCourses] = useState([]);
  const user = useSelector((state) => state?.cognito?.user);


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

  const enrollCourses = (courseId) => {
    setLoading(true)
    BackendService.enrollCourse(courseId, user?.sub)
      .then(() => {
        setLoading(false)
        getCourses()
        dispatch(
          notificationSliceActions.setNotification({
            open: true,
            severity: "success",
            message: "Course enrollment successful",
          })
        );
      })
      .catch(() => {
        setLoading(false)
        dispatch(
          notificationSliceActions.setNotification({
            open: true,
            severity: "error",
            message: "Unable to enroll in the course. Please try again",
          })
        );
      });
  };

  return (
    <Box>
      <Backdrop
        sx={(theme) => ({
          color: "#1b3764",
          zIndex: theme.zIndex.drawer + 1,
        })}
        open={loading}
      >
        <CircularProgress color="#1b3764" />
      </Backdrop>
      <Box className="headerContainer">
        <Typography className="header" gutterBottom>
          All Courses
        </Typography>
      </Box>

      <Box className="gridBox">
        {courses.map((course, index) => {
          const hasDescription =
            course.description && course.description.trim() !== "";
          return (
            <Grid item xs={12} sm={6} md={4} key={index}>
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
                    <Typography 
    variant="h6" 
    noWrap 
    sx={{ 
      width: '100%',      // or any specific width like '200px'
      overflow: 'hidden', 
      textOverflow: 'ellipsis', 
      whiteSpace: 'nowrap' 
    }}
  >
    {course?.name}
  </Typography>
                    </Tooltip>

                    {/* More menu icon */}
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
                  <Box style={{display:'flex',alignItems:'center',gap:'12px',marginTop:'12px'}} textAlign="center">
                    <Button
                      variant={"all"}
                      style={{
                        width: "100%",
                        color: "#1b3764",
                        border: "1px solid #1b3764",
                        backgroundColor: "white",
                        boxShadow: "none",
                        textTransform: "none",
                        "&:hover": {
                          backgroundColor: "#f0f0f0",
                        },
                      }}
                      onClick={() => {
                        enrollCourses(course?.id);
                      }}
                    >
                      {"Enroll"}
                    </Button>
                    <Button
                     component={Link}
                     to={`/view-course/${course?.id}`}
                      variant={"all"}
                      style={{
                        width: "100%",
                        color: "#1b3764",
                        border: "1px solid #1b3764",
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
                </CardContent>
              </CourseCard>
            </Grid>
          );
        })}
      </Box>
    </Box>
  );
}

export default AllCourse;
