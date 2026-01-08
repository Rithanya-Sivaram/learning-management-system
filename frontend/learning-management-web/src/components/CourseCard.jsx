import React from "react";
import { Box, Card, CardMedia } from "@mui/material";

function CourseCard({ course, children }) {
  return (
    <Card
      sx={{
         maxWidth: 345,
        height: "100%",
        display: "flex",
        flexDirection: "column",
        boxShadow: 3,
        transition: "transform 0.3s ease, box-shadow 0.3s ease",
        "&:hover": {
          transform: "scale(1.05)",
          boxShadow: 6,
        },
        cursor: "pointer",
      }}
    >
      <Box
  sx={{
    border: "1px solid #ddd",
    margin: "10px",
    borderRadius: "4px",
    overflow: "hidden", // This ensures the image is clipped within rounded corners
  }}
>
      <CardMedia
        component="img"
        height="180"
        image={course.photoKey}
        alt={course.title}
      />
      </Box>
      {children}
    </Card>
  );
}

export default CourseCard;
