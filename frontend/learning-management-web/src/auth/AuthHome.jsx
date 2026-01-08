import { Box, Grid2, Typography } from "@mui/material";
import classes from "./Auth.module.css";
// import ApplicationLogo from "../assets/logo/app-logo-color.png";
import HomeScreenImage from "../assets/img/AppBgImg.png";

import { Outlet } from "react-router-dom";

/**
 * A functional component that serves as the home screen for authentication-related operations.
 * It may include login, signup, or authentication-related UI elements.
 *
 * @returns {JSX.Element} The JSX representation of the authentication home screen.
 */

export default function AuthHome() {
  return (
    <Grid2 container sx={{ height: "100vh",backgroundColor:'white' }}>
      <Grid2 item size={{ xs: 0, md: 6, lg: 8 }}>
        <Box
          style={{ backgroundColor: "#1b3764" }}
          className={classes.loginscreencontainer}
        >
          <Box
            className={`${classes.topRoundContainer} ${classes.roundContainer}`}
          >
            <Box className={`${classes.topRound} ${classes.halfRound}`} />
          </Box>

          <Box className={classes.authHomeConatiner}>
            <img
              alt="doctor-image"
              src={HomeScreenImage}
              className={classes.docImage}
            />
            <Box
              className={`${classes.bottomRoundContainer} ${classes.roundContainer}`}
            >
              <Box className={`${classes.bottomRound} ${classes.halfRound}`} />
            </Box>
          </Box>

          <Box className={classes.loginScreenContentContiner}>
            <Typography className={classes.loginScreenContent}>
              Transform Learning with Smarter Education
            </Typography>
            <Typography className={classes.loginScreenSecondaryContent}>
              LMS has completely transformed our learning process.
            </Typography>
            <Typography className={classes.loginScreenSecondaryContent}>
              It's reliable, efficient, and ensures our education is always
              top-notch.
            </Typography>
          </Box>
        </Box>
      </Grid2>

      <Grid2
        container
        // size={4}
        size={{ xs: 12, md: 6, lg: 4 }}
        display="flex"
        textAlign="center"
        alignItems="center"
      >
        <Grid2
          item
          size={12}
          display="flex"
          alignItems="center"
          textAlign="center"
          flexDirection="column"
        >
          {/* <Grid2 item size={12}>
            <img
              alt="application-logo"
              src={"ApplicationLogo"}
              style={{ height: "55px" }}
            />
          </Grid2> */}
          <Grid2 item size={6}>
            <Outlet />
          </Grid2>
        </Grid2>
      </Grid2>
    </Grid2>
  );
}
