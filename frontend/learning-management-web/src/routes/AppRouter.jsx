import React, { useState } from "react";
import NavBar from "../components/NavBar";
import { Route, Routes } from "react-router-dom";
import MyCourse from "../screens/student/MyCourse";
import { Alert, Box, Snackbar, IconButton, Fab } from "@mui/material";
import AllCourses from "../screens/student/AllCourses";
import MyCourses from "../features/admin/Courses";
import Students from "../screens/author/Students";
import EnterOTP from "../auth/EnterOtp";
import { useSelector, useDispatch } from "react-redux";
import ViewCourse from "../features/course/ViewCourse";
import AddTopics from "../features/topics/AddTopics";
import { notificationSliceActions } from "../service/NotificationSlice";
import ChatIcon from "@mui/icons-material/Chat"; // MUI chat icon
import ChatPopup from "../features/student/ChatPopup";

function AppRouter() {
  const userGroups = useSelector((state) => state?.cognito?.userGroups);
  const dispatch = useDispatch();
  const isAdmin = userGroups?.includes("r_author");
  const openNotificationState = useSelector((state) => state.notification.open);
  const notificationSeverityState = useSelector(
    (state) => state.notification.severity
  );
  const message = useSelector((state) => state.notification.message);
  const [open, setOpen] = useState(false);
  return (
    <>
      {/* Snackbar */}
      <Snackbar
        autoHideDuration={3000}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={openNotificationState}
        onClose={() => dispatch(notificationSliceActions.closeNotification())}
      >
        <Alert
          onClose={() => dispatch(notificationSliceActions.closeNotification())}
          severity={notificationSeverityState}
        >
          {message}
        </Alert>
      </Snackbar>

      {/* Navbar */}
      <NavBar isAdmin={isAdmin} />

      {/* Main content */}
      <Box className={"appContainer"}>
        <Routes>
          {isAdmin ? (
            <>
              <Route path="/" element={<MyCourses />} />
              <Route path="/my-courses" element={<MyCourses />} />
              <Route path="/learners" element={<Students />} />
              <Route
                path="/view-course/:courseId"
                element={<ViewCourse isAdmin={isAdmin} />}
              />
              <Route path="/add-topic/:courseId" element={<AddTopics />} />
              <Route
                path="/edit-topic/:courseId/:topicId"
                element={<AddTopics />}
              />
            </>
          ) : (
            <>
              <Route path="/" element={<MyCourse />} />
              <Route
                path="/view-course/:courseId"
                element={<ViewCourse isAdmin={isAdmin} />}
              />
              <Route path="/my-courses" element={<MyCourse />} />
              <Route path="/all-courses" element={<AllCourses />} />
            </>
          )}
        </Routes>
        {(!isAdmin&&open )&& <ChatPopup open={open} setOpen={setOpen}/>}

        {/* Floating Chat Icon for non-admins only */}
        {(!isAdmin&&!open) && (
          <Fab
            color="primary"
            aria-label="chat"
            sx={{
              position: "fixed",
              bottom: 24,
              right: 24,
              zIndex: 9999,
            }}
            style={{backgroundColor:'#1b3764'}}
            onClick={()=>{
              setOpen(true)
            }}
          >
            <ChatIcon />
          </Fab>
        )}
      </Box>
    </>
  );
}

export default AppRouter;
