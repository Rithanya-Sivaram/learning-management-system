import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  Box,
  Button,
  CircularProgress,
  Grid2,
  TextField,
  Typography,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import classes from "./Auth.module.css";
import { notificationSliceActions } from "../service/NotificationSlice";
import { authenticationSliceActions } from "./AuthenticationSlice";
import { forgotPasswordAsync } from "./CognitiSlice";
import { useNavigate } from "react-router-dom";
import Logo from "../assets/img/BreezewareLogoSvg.svg"

/**
 * A functional component for handling the forgot password process.
 * It allows users to reset their password by providing their email address.
 *
 * @param {Function} setCurrentView - A function to update the current view in the authentication flow (e.g., navigate to the reset password view).
 * @returns {JSX.Element} The JSX representation of the forgot password screen.
 */

export default function ForgotPassword({ setCurrentView }) {
  const dispatch = useDispatch();

  const loading = useSelector((state) => state.authentication.loading);

  const forgotPasswordSchema = Yup.object().shape({
    email: Yup.string()
      .required("Email is required")
      .email("Enter valid email"),
  });

  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      email: "",
    },
    validationSchema: forgotPasswordSchema,
    onSubmit: async (values) => {
      dispatch(authenticationSliceActions.loadingHandler({ loading: true }));
      // BackendService.forgotPassword(values)
      dispatch(forgotPasswordAsync(values?.email)).then((res) => {
        if (!res.error) {
          dispatch(
            authenticationSliceActions.loadingHandler({ loading: false })
          );

          // setCurrentView("ResetPasword");

          dispatch(
            notificationSliceActions.setNotification({
              open: true,
              severity: "success",
              message: "We've sent a password reset link to your email address",
            })
          );
          navigate(`/verify-otp/${values?.email}`);
        } else {
          dispatch(
            authenticationSliceActions.loadingHandler({ loading: false })
          );
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
    },
    validateOnChange: false,
    enableReinitialize: true,
  });

  const backHandler = () => {
    navigate("/");
  };
  return (
    <Box style={{backgroundColor:'white'}} sx={{ mt: 5 }}>
      <form
        id="reset-password-form"
        onSubmit={formik.handleSubmit}
        autocomplete="off"
      >
        <Grid2 container textAlign="left">
          <Grid2 item xs={12}>
            <Box style={{display:'flex',alignItems:'center',gap:'12px'}}>
            <Box onClick={backHandler} className={classes.backBtnContainer}>
              <span
                style={{ color: "white" }}
                class="material-symbols-outlined"
              >
                arrow_back
              </span>
      
            </Box>
            <Box>
               <img style={{width:'140px',marginTop:'16px'}} src={Logo} />
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
              Forgot Password
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              // textAlign="center"
              sx={{ maxWidth: 360, mx: "auto", mt: 1 }}
            >
              Enter your registered email address. We’ll send you a one-time
              password (OTP) to verify your identity
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
            <TextField
              id="login-email"
              autoComplete="off"
              placeholder={"Enter Email"}
              onChange={formik.handleChange}
              value={formik?.values.email}
              name={"email"}
              sx={{ width: "100%" }}
              size="small"
            />
            {formik.errors?.email && (
              <Typography
                sx={{ textAlign: "left" }}
                id="login-email-error"
                className="error"
              >
                {formik.errors?.email}
              </Typography>
            )}
          </Grid2>
          <Grid2 item size={12} sx={{ marginTop: "5%" }}>
            <Button
              type="submit"
              sx={{
                width: "100%",
                backgroundColor: "#1a3864",
                textTransform: "none",
              }}
              variant="contained"
              disabled={loading}
            >
              {loading ? (
                <CircularProgress
                  size={24}
                  color="#1b3764"
                  id="login-loadingSpinner"
                />
              ) : (
                "Send OTP"
              )}
            </Button>
          </Grid2>
        </Grid2>
      </form>
    </Box>
  );
}
