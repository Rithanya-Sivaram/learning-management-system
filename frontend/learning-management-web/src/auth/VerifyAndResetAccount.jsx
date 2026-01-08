import React, { useEffect, useState } from "react";
import Classes from "./Auth.module.css";
import {
  TextField,
  Typography,
  Box,
  Button,
  InputAdornment,
  CircularProgress,
  Grid2,
  InputLabel,
} from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  cognitoSliceActions,
  confirmPasswordAsync,
  resendOTPAsync,
} from "./CognitiSlice";
import classes from "./Auth.module.css";
import { useLocation } from "react-router-dom";
import { CognitoUser, AuthenticationDetails } from "amazon-cognito-identity-js";
import { UserPool } from "./CognitiSlice";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { notificationSliceActions } from "../service/NotificationSlice";
import BackendService from "../service/BackendService";
import Logo from "../assets/img/BreezewareLogoSvg.svg"

// import { updateNotification } from "../utils/util";

const VerifyAndResetAccount = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  const resendOtpError = useSelector((state) => state?.cognito?.resendOtpError);
  const errorMessgaeRestPassword = useSelector(
    (state) => state?.cognito?.errorMessgaeRestPassword
  );
  const [loading, setLoading] = useState(false);
  const { email } = useParams();
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const otpSchema = Yup.object().shape({
    otp: Yup.string()
      .required("OTP is required")
      .min(6, "OTP must be at least 6 characters")
      .max(8, "OTP must be at most 8 characters"),
    newPassword: Yup.string()
      .required("Password is required")
      .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
      .matches(/\d/, "Password must contain at least one number")
      .min(8, "Password must be at least 8 characters long"),

    confirmPassword: Yup.string()
      .required("Confirm password is required")
      .oneOf([Yup.ref("newPassword"), null], "Passwords must match"),
  });
  const handleUpdatePasswordNotification = () => {
    if (errorMessgaeRestPassword !== null) {
      //   updateNotification(dispatch, errorMessgaeRestPassword, "error");
      dispatch(cognitoSliceActions.resetState());
    }
  };
  useEffect(() => {
    if (errorMessgaeRestPassword !== null) {
      handleUpdatePasswordNotification();
    }
  }, [errorMessgaeRestPassword]);

  useEffect(() => {
    dispatch(cognitoSliceActions.userLogout());
  }, []);

  /**
   * Handles AWS Cognito account setup for invited users.
   * Authenticates the user using the temporary password and then completes
   * the new password challenge to finalize the account setup.
   *
   * @param {string} username - The invited user's username (usually email).
   * @param {string} tempPassword - The temporary password provided in the invitation.
   * @param {string} newPassword - The new password the user wants to set.
   */
  const handleSetup = (username, tempPassword, newPassword) => {
    const user = new CognitoUser({
      Username: username,
      Pool: UserPool,
    });

    const authDetails = new AuthenticationDetails({
      Username: username,
      Password: tempPassword,
    });

    user.authenticateUser(authDetails, {
      onSuccess: () => {},
      onFailure: (err) => {
        setLoading(false);
        dispatch(
          notificationSliceActions.setNotification({
            open: true,
            severity: "error",
            message: err.message ? err.message : "An error occured",
          })
        );
      },

      newPasswordRequired: (userAttributes) => {
        delete userAttributes.email;
        delete userAttributes.phone_number;
        delete userAttributes.email_verified;
        delete userAttributes.phone_number_verified;

        user.completeNewPasswordChallenge(newPassword, userAttributes, {
          onSuccess: (session) => {
            BackendService.confirmLoginUser(session?.idToken?.payload?.sub)
              .then(() => {
                setLoading(false);
                dispatch(
                  notificationSliceActions.setNotification({
                    open: true,
                    severity: "success",
                    message: "Account setup completed  successfully",
                  })
                );
                navigate("/account-setup-success");
              })
              .catch((err) => {
                dispatch(
                  notificationSliceActions.setNotification({
                    open: true,
                    severity: "error",
                    message:
                      err.message || err.details[0] || "An error occured",
                  })
                );
              });
          },
          onFailure: (err) => {
            setLoading(false);
            dispatch(
              notificationSliceActions.setNotification({
                open: true,
                severity: "error",
                message: err.message ? err.message : "An error occured",
              })
            );
          },
        });
      },
    });
  };

  const formik = useFormik({
    initialValues: {
      otp: "",
    },
    validationSchema: otpSchema,
    onSubmit: async (values) => {
      setLoading(true);
      const verificationCode = values.otp;
      const newPassword = values.confirmPassword;

      (!location?.pathname?.includes("setup-account")
        ? dispatch(
            confirmPasswordAsync({ email, verificationCode, newPassword })
          )
        : handleSetup(email, verificationCode, newPassword)
      )

        .then((res) => {
          setLoading(false);
          if (res?.error) {
            // setPasswordFailed(res.payload.messagae);
            dispatch(
              notificationSliceActions.setNotification({
                open: true,
                severity: "error",
                message: res?.payload?.message
                  ? res?.payload?.message
                  : "An error occured",
              })
            );
            handleUpdatePasswordNotification();
          } else {
            dispatch(
              notificationSliceActions.setNotification({
                open: true,
                severity: "success",
                message: "Password reset successfully",
              })
            );
            // updateNotification(
            //   dispatch,
            //   "Password reset successfully",
            //   "success"
            // );
            navigate("/password-reset-setup-success");
          }
        })
        .catch((err) => {
          setLoading(false);
        });
    },
    validateOnChange: false,
    enableReinitialize: true,
  });

  const handleUpdateNotification = () => {
    if (resendOtpError !== null) {
      dispatch(cognitoSliceActions.resetState());
    }
  };

  useEffect(() => {
    if (resendOtpError !== null) {
      handleUpdateNotification();
    }
  }, [resendOtpError]);

  /**
   * Handles the resend OTP (One-Time Password) process.
   * Dispatches the resendOTPAsync action with the user's email.
   * Based on the result, it shows success or error notifications.
   */
  const handleResendOtp = () => {
    dispatch(resendOTPAsync({ email })).then((res) => {
      if (res?.error) {
        handleUpdateNotification();
        dispatch(
          notificationSliceActions.setNotification({
            open: true,
            severity: "error",
            message: res?.payload?.message
              ? res?.payload?.message
              : "An error occured",
          })
        );
      } else {
        dispatch(
          notificationSliceActions.setNotification({
            open: true,
            severity: "success",
            message: "OTP has been resent successfully",
          })
        );
      }
    });
  };

  /**
   * Toggles the visibility of the "New Password" input field.
   * When triggered, it switches between password and text type to show/hide the password.
   */
  const handleClickNewShowPassword = () => {
    setShowNewPassword((prev) => !prev);
  };

  /**
   * Toggles the visibility of the "Confirm Password" input field.
   * This helps users verify the password they are typing.
   */
  const handleClickConfirmShowPassword = () => {
    setShowConfirmPassword((prev) => !prev);
  };

  const backHandler = () => {
    navigate("/forgot-password");
  };

  return (
    <div
      style={{ marginTop: "12px",backgroundColor:'white' }}
      //   className={Classes.authscreenContainer}
      id="verifyPassword-authscreenContainer"
    >
      <form onSubmit={formik.handleSubmit} id="verifyPassword-form">
        <Box
          //   className={Classes.formContainer}
          id="verifyPassword-formContainer"
        >
          <Box style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <Box
              style={{ marginBottom: "8px" }}
              onClick={backHandler}
              className={classes.backBtnContainer}
            >
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
          <Box
            className={Classes.fieldContainer}
            id="verifyPassword-fieldContainer-1"
          >
            <Box
              style={{
                display: "flex",
                flexDirection: "column",
              }}
              id="verifyPassword-headerContainer"
            >
              <Typography id="verifyPassword-otpInstruction">
                Enter the verification code sent to your email, then set and
                confirm your new password to complete the process
              </Typography>
            </Box>
          </Box>
          <Grid2
            item
            size={12}
            marginBottom={2}
            className={Classes.fieldContainer}
            sx={{ marginTop: "5%" }}
          >
            <InputLabel sx={{ textAlign: "left" }}>
              Verification Code <span className="error">*</span>
            </InputLabel>
            <TextField
              autoComplete="off"
              placeholder={"eg: 123456"}
              onChange={formik.handleChange}
              name="otp"
              sx={{ width: "100%" }}
              size="small"
            />
            {formik.errors.otp && (
              <Typography
                sx={{ textAlign: "left" }}
                className="error"
                id="verifyPassword-otpError"
              >
                {formik.errors.otp}
              </Typography>
            )}
          </Grid2>
          {!location?.pathname?.includes("setup-account") && (
            <Box
              className={Classes.otpFieldConteiner}
              id="verifyPassword-resendOtpContainer"
            >
              <Typography id="verifyPassword-otpResendText">
                Haven't received the code?
              </Typography>
              <Typography
                onClick={handleResendOtp}
                className={Classes.resendCode}
                id="verifyPassword-resendOtpLink"
              >
                Resend Code
              </Typography>
            </Box>
          )}

          <Grid2
            item
            size={12}
            marginBottom={2}
            className={Classes.fieldContainer}
            sx={{ marginTop: "5%" }}
          >
            <InputLabel sx={{ textAlign: "left" }}>
              New Password <span className="error">*</span>
            </InputLabel>
            <TextField
              placeholder={"eg: **********"}
              autoComplete="off"
              type={showNewPassword ? "text" : "password"}
              onChange={formik.handleChange}
              name="newPassword"
              sx={{ width: "100%" }}
              size="small"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        cursor: "pointer",
                      }}
                      onClick={handleClickNewShowPassword}
                      edge="end"
                      id="verifyPassword-toggleNewPasswordVisibility"
                    >
                      {!showNewPassword ? <VisibilityOff /> : <Visibility />}
                    </div>
                  </InputAdornment>
                ),
              }}
            />
            {formik.errors.newPassword && (
              <Typography
                sx={{ textAlign: "left" }}
                className="error"
                id="verifyPassword-otpError"
              >
                {formik.errors.newPassword}
              </Typography>
            )}
          </Grid2>
          <Grid2
            item
            size={12}
            marginBottom={2}
            className={Classes.fieldContainer}
            sx={{ marginTop: "5%" }}
          >
            <InputLabel sx={{ textAlign: "left" }}>
              Confirm Password <span className="error">*</span>
            </InputLabel>
            <TextField
              placeholder={"eg: **********"}
              autoComplete="off"
              type={showConfirmPassword ? "text" : "password"}
              onChange={formik.handleChange}
              name="confirmPassword"
              sx={{ width: "100%" }}
              size="small"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        cursor: "pointer",
                      }}
                      onClick={handleClickConfirmShowPassword}
                      edge="end"
                      id="verifyPassword-toggleNewPasswordVisibility"
                    >
                      {!showConfirmPassword ? (
                        <VisibilityOff />
                      ) : (
                        <Visibility />
                      )}
                    </div>
                  </InputAdornment>
                ),
              }}
            />
            {formik.errors?.confirmPassword && !formik.errors.newPassword && (
              <Typography
                sx={{ textAlign: "left" }}
                className="error"
                id="verifyPassword-otpError"
              >
                {formik.errors.confirmPassword}
              </Typography>
            )}
          </Grid2>

          <Box
            className={Classes.fieldContainer}
            id="verifyPassword-submitButtonContainer"
          >
            <Button
              style={{ textTransform: "none" }}
              type="submit"
              className={Classes.submitButton}
              id="verifyPassword-submitButton"
              disabled={loading}
            >
              {loading ? (
                <CircularProgress
                  size={24}
                  color="#1b3764"
                  id="verifyPassword-loadingSpinner"
                />
              ) : location?.pathname?.includes("setup-account") ? (
                "Create Password"
              ) : (
                "Reset Password"
              )}
            </Button>
          </Box>
        </Box>
      </form>
    </div>
  );
};

export default VerifyAndResetAccount;
