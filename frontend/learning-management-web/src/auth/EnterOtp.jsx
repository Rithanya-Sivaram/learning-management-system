import React, { useState } from "react";
import {
  Backdrop,
  Box,
  Button,
  CircularProgress,
  Grid2,
  Typography,
} from "@mui/material";
import { useDispatch } from "react-redux";
import classes from "./Auth.module.css";
import { notificationSliceActions } from "../service/NotificationSlice";
import { authenticationSliceActions } from "./AuthenticationSlice";
import { confirmUserAsync, otpVerifyAsync } from "./CognitiSlice";
import { useNavigate, useParams } from "react-router-dom";
import OtpInput from "./OtpInput";
import BackendService from "../service/BackendService";
import Logo from "../assets/img/BreezewareLogoSvg.svg";

/**
 * A functional component for handling the forgot password process.
 * It allows users to reset their password by providing their email address.
 *
 * @param {Function} setCurrentView - A function to update the current view in the authentication flow (e.g., navigate to the reset password view).
 * @returns {JSX.Element} The JSX representation of the forgot password screen.
 */

export default function EnterOTP({ setCurrentView }) {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const [otp, setOtp] = useState(new Array(6).fill(""));

  const navigate = useNavigate();

  const { username, email } = useParams();

  const submitData = (e) => {
    e.preventDefault();
    const data = {
      username: username,
      verificationCode: otp.join(""),
    };
    dispatch(authenticationSliceActions.loadingHandler({ loading: true }));
    setLoading(true);
    // dispatch(authenticationSliceActions.loadingHandler({ loading: true }))
    dispatch(otpVerifyAsync(data)).then((res) => {
      if (!res.error) {
        // dispatch(authenticationSliceActions.loadingHandler({ loading: false }));
        dispatch(authenticationSliceActions.loadingHandler({ loading: true }));
        BackendService.addUsers(email)
          .then((res) => {
            dispatch(authenticationSliceActions.loadingHandler({ loading: false }));

            setLoading(false);
            dispatch(
              notificationSliceActions.setNotification({
                open: true,
                severity: "success",
                message: "Account created successfully",
              })
            );
            navigate(`/`);
          })
          .catch(() => {
            dispatch(authenticationSliceActions.loadingHandler({ loading: false }));
            setLoading(false);
            dispatch(
              notificationSliceActions.setNotification({
                open: true,
                severity: "error",
                message: res?.payload?.message
                  ? res?.payload?.message
                  : "An error occured",
              })
            );
          });
      } else {
        setLoading(false);

        dispatch(authenticationSliceActions.loadingHandler({ loading: false }));
        dispatch(
          notificationSliceActions.setNotification({
            open: true,
            severity: "error",
            message: res?.payload?.message
              ? res?.payload?.message
              : "An error occured",
          })
        );
      }
    });
  };

  const backHandler = () => {
    navigate("/");
  };

  const handleChange = (newValue) => {
    setOtp(newValue);
  };

  return (
    <Box style={{ backgroundColor: "white" }} sx={{ mt: 5 }}>
      <Backdrop
        sx={(theme) => ({ color: "#fff", zIndex: theme.zIndex.drawer + 1 })}
        open={loading}
      >
        <CircularProgress color="#1b3764" />
      </Backdrop>
      <form id="reset-password-form">
        <Grid2 container textAlign="left">
          {/* <Grid2 item xs={12}>
  <Typography
    variant="h6"
    fontWeight={600}
    textAlign="center"
    gutterBottom
  >
    Reset Your Password
  </Typography>
</Grid2> */}

          <Grid2 item xs={12}>
            <Box style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <Box onClick={backHandler} className={classes.backBtnContainer}>
                <span
                  style={{ color: "white" }}
                  class="material-symbols-outlined"
                >
                  arrow_back
                </span>
              </Box>
              <Box>
                <img style={{ width: "140px", marginTop: "16px" }} src={Logo} />
              </Box>
            </Box>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                mt: 1,
                color: "black",
                fontSize: "20px",
                fontWeight: "600",
              }}
            >
              OTP Verification
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              // textAlign="center"
              sx={{ maxWidth: 360, mx: "auto", mt: 1 }}
            >
              Please enter the 6-digit OTP sent to your email
            </Typography>
          </Grid2>
          <Grid2
            item
            size={12}
            marginBottom={2}
            className={classes.fieldContainer}
            sx={{ marginTop: "5%" }}
          >
            {/* <InputLabel
              sx={{ textAlign: "left", color: "#333333", fontWeight: "500" }}
            >
               <span className={classes.required}>*</span>
            </InputLabel> */}
            <OtpInput setOtp={setOtp} otp={otp} />
            {/* <TextField
              id="login-email"
              autoComplete="off"
              placeholder={"Enter Email"}
              onChange={formik.handleChange}
              value={formik?.values.email}
              name={"email"}
              sx={{ width: "100%" }}
              size="small"
            /> */}
          </Grid2>
          <Grid2 item size={12} sx={{ marginTop: "5%" }}>
            <Button
              onClick={submitData}
              disabled={loading}
              type="submit"
              sx={{
                width: "100%",
                backgroundColor: "#1a3864",
                textTransform: "none",
              }}
              variant="contained"
            >
              {loading ? <CircularProgress color="#1b3764" /> : " Verify OTP"}
            </Button>
          </Grid2>
        </Grid2>
      </form>
    </Box>
  );
}
