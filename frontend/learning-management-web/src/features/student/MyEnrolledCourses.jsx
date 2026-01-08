import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  CardContent,
  Chip,
  Grid,
  Stack,
  TextField,
  Tooltip,
  Typography,
  Backdrop,
  CircularProgress,
} from "@mui/material";
import CourseCard from "../../components/CourseCard";
import { useSelector } from "react-redux";
import BackendService from "../../service/BackendService";
import SchoolIcon from "@mui/icons-material/School"; // ✅ icon for empty state
import { Link } from "react-router-dom";

function MyEnrolledCourses() {
  const datas = [
    {
      name: "Course 1",
      descrption:
        " Project Documentation – Learners Management System - React Frontend",
    },
  ];
  const user = useSelector((state) => state.cognito.user);
  const [loading, setLoading] = useState(false);
  const [enrolledCourses, setEnrolledCourses] = useState();

  const getMyEnrooledCourses = () => {
    setLoading(true);
    BackendService.fetchMyEnrolledCourses(user?.sub)
      .then((res) => {
        setLoading(false);
        setEnrolledCourses(res?.data);
      })
      .catch((err) => {
        setLoading(false);
      });
  };

  useEffect(() => {
    getMyEnrooledCourses();
  }, [user]);

  return (
    <Box style={{ width: "100%" }}>
      <Box className="headerContainer">
        <Typography className="header" gutterBottom>
          My Enrolled Courses
        </Typography>
      </Box>
      <Backdrop
        sx={(theme) => ({ color: "#1b3764", zIndex: theme.zIndex.drawer + 1 })}
        open={loading}
      >
        <CircularProgress color="#1b3764" />
      </Backdrop>

      <Box style={{ width: "100%" }} className="gridBox">
        {/* ✅ Empty State */}
        {enrolledCourses?.length === 0 && !loading ? (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              height: "50vh",
              textAlign: "center",
              color: "#666",
            
            }}
            style={{ width: "95vw" }}
          >
            <SchoolIcon sx={{ fontSize: 80, color: "#999", mb: 2 }} />
            <Typography variant="h6">
              You are not enrolled in any courses
            </Typography>
            <Typography variant="body2" sx={{ mt: 1 }}>
              Explore courses and start learning today!
            </Typography>
          </Box>
        ) : (
          enrolledCourses?.map((course, index) => {
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
                    <Box>
                      <Tooltip title={course?.name}>
                        <Typography
                          variant="h6"
                          component="div"
                          noWrap
                          sx={{ mb: 1 }}
                        >
                          {course?.name}
                        </Typography>
                      </Tooltip>

                      <Tooltip title={hasDescription ? course.description : ""}>
                        <Box sx={{ mb: 1 }}>
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
                            }}
                          >
                            {hasDescription ? course.description : "-"}
                          </Typography>
                        </Box>
                      </Tooltip>
                    </Box>

                    <Box>
                      <Box textAlign="center">
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
                          {"Continue"}
                        </Button>
                      </Box>
                    </Box>
                  </CardContent>
                </CourseCard>
              </Grid>
            );
          })
        )}
      </Box>
    </Box>
  );
}

export default MyEnrolledCourses;
