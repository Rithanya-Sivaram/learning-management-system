import React, { useEffect } from "react";
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
} from "@mui/material";
import CourseCard from "../../components/CourseCard";
import BackendService from "../../service/BackendService";
import { useSelector } from "react-redux";

function MyEnrolledCourses() {
  const courses = [
    {
      title: "Python for Data Science",
      description:
        "Learn Python programming and data analysis with pandas, NumPy, and visualization tools.",
      tags: ["Python", "Data Science"],
      duration: "10 weeks",
      enrolled: "1,200 enrolled",
      image:
        "https://images.pexels.com/photos/170811/pexels-photo-170811.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
    },
    {
      title: "React Fundamentals",
      description:
        "Build interactive UIs with React and understand component-based architecture.",
      tags: ["React", "Frontend"],
      duration: "8 weeks",
      enrolled: "850 enrolled",
      image: "https://source.unsplash.com/random/400x200?reactjs",
    },
    {
      title: "Java Programming",
      description:
        "Master Java programming, object-oriented concepts, and build scalable applications.Master Java programming, object-oriented concepts, and build scalable applications.Master Java programming, object-oriented concepts, and build scalable applications.",
      tags: ["Java", "Backend"],
      duration: "12 weeks",
      enrolled: "950 enrolled",
      image: "https://source.unsplash.com/random/400x200?java",
    },
    {
      title: "Web Design Basics",
      description: "",
      tags: ["HTML", "CSS", "Design"],
      duration: "6 weeks",
      enrolled: "600 enrolled",
      image: "https://source.unsplash.com/random/400x200?webdesign",
    },
    {
      title: "Web Design Basics",
      description: "",
      tags: ["HTML", "CSS", "Design"],
      duration: "6 weeks",
      enrolled: "600 enrolled",
      image: "https://source.unsplash.com/random/400x200?webdesign",
    },
  ];


  return (
    <Box>
      <Box className="headerContainer">
        <Typography className="header" gutterBottom>
          My Enrolled Coursess
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
                  <Box>
                    <Tooltip title={course.title}>
                      <Typography
                        variant="h6"
                        component="div"
                        noWrap
                        sx={{ mb: 1 }}
                      >
                        {course.title}
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
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      display="block"
                      sx={{ mb: 1 }}
                    >
                      Duration: {course.duration} | Enrolled: {course.enrolled}
                    </Typography>
                    <Stack
                      direction="row"
                      spacing={1}
                      flexWrap="wrap"
                      sx={{ mb: 2 }}
                    >
                      {course.tags.map((tag, index) => (
                        <Chip
                          key={index}
                          label={tag}
                          size="small"
                          color="primary"
                        />
                      ))}
                    </Stack>
                    <Box textAlign="center">
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
                      >
                        {"Continue"}
                      </Button>
                    </Box>
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

export default MyEnrolledCourses;
