import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import {
  Grid2,
  TextField,
  Button,
  Typography,
  InputLabel,
  InputAdornment,
  Alert,
  CircularProgress,
} from "@mui/material";
import Classes from "./Auth.module.css";
import { authenticationSliceActions } from "./AuthenticationSlice";
import { userLoginAsync } from "./CognitiSlice";
import { useNavigate, Link } from "react-router-dom";
import { notificationSliceActions } from "../service/NotificationSlice";
import Logo from "../assets/img/BreezewareLogoSvg.svg";

/**
 * A functional component for handling the user login process.
 * It allows users to enter their credentials (username and password) to authenticate and access the application.
 *
 * @param {Function} setCurrentView - A function to update the current view in the authentication flow (e.g., navigate to the forgot password view or main app).
 * @returns {JSX.Element} The JSX representation of the login screen.
 */

export default function Login({ setCurrentView }) {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const loading = useSelector((state) => state.authentication.loading);
  /**
   * Defines the validation schema for login form using Yup.
   * Ensures that the email and password fields meet specific criteria.
   */
  const loginSchema = Yup.object().shape({
    email: Yup.string()
      .required("Email is required")
      .email("Enter valid email"),
    password: Yup.string().required("Password is required"),
  });

  const formik = useFormik({
    initialValues: {},
    validationSchema: loginSchema,
    onSubmit: async (values) => {
      dispatch(authenticationSliceActions.loadingHandler({ loading: true }));
      dispatch(
        userLoginAsync({ email: values.email, password: values.password })
      ).then((res) => {
        if (!res.error) {
          dispatch(
            authenticationSliceActions.loadingHandler({ loading: false })
          );
          navigate("/");
        } else {
          dispatch(
            authenticationSliceActions.loadingHandler({ loading: false })
          );
          dispatch(
            notificationSliceActions.setNotification({
              open: true,
              severity: "error",
              message: res?.error?.message
                ? res?.error?.message
                : "An error occured",
            })
          );
        }
      });
    },
    validateOnChange: false,
    enableReinitialize: true,
  });

  /**
   * Toggles the visibility of the password input field.
   * When called, it switches the state of `showPassword` between `true` and `false`.
   */
  const handleClickShowPassword = () => {
    setShowPassword((prev) => !prev);
  };
  return (
    <form style={{backgroundColor:'white'}} id="login-form" onSubmit={formik.handleSubmit} autoComplete="off">
      <img style={{ width: "140px" }} src={Logo} />
      <Grid2 item size={12} sx={{ marginBottom: 2 }}>
        <Typography variant="h5" sx={{ fontWeight: "bold" }}>
          Welcome Back!
        </Typography>
        <Typography variant="body2" sx={{ color: "gray" }}>
          Sign in to access your LMS dashboard
        </Typography>
      </Grid2>

      {/* Existing Email Field */}
      <Grid2
        item
        size={12}
        marginBottom={2}
        className={Classes.fieldContainer}
        sx={{ marginTop: "2%" }}
      >
        <InputLabel sx={{ textAlign: "left" }}>
          Username (Email) <span className="error">*</span>
        </InputLabel>
        <TextField
          id="login-email"
          autoComplete="off"
          placeholder={"eg: johndoe01@gmail.com"}
          onChange={formik?.handleChange}
          value={formik?.values?.email}
          name={"email"}
          sx={{ width: "100%" }}
          size="small"
        />
        {formik?.errors?.email && (
          <Typography
            sx={{ textAlign: "left" }}
            id="login-email-error"
            className="error"
          >
            {formik?.errors?.email}
          </Typography>
        )}
      </Grid2>

      {/* Existing Password Field */}
      <Grid2 item size={12} className={Classes.fieldContainer}>
        <InputLabel sx={{ textAlign: "left" }}>
          Password <span className="error">*</span>
        </InputLabel>
        <TextField
          id="login-password"
          placeholder={"eg: **********"}
          autoComplete="off"
          type={showPassword ? "text" : "password"}
          onChange={formik.handleChange}
          name="password"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <div
                  className={Classes.paswordIcon}
                  onClick={handleClickShowPassword}
                  edge="end"
                >
                  {!showPassword ? <VisibilityOff /> : <Visibility />}
                </div>
              </InputAdornment>
            ),
          }}
          sx={{ width: "100%" }}
          size="small"
        />
        {formik?.errors?.password && (
          <Typography
            sx={{ textAlign: "left" }}
            id="login-password-error"
            className="error"
          >
            {formik?.errors?.password}
          </Typography>
        )}
      </Grid2>

      {/* Forgot Password Link */}
      <Grid2 item size={12} sx={{ marginTop: "2%", textAlign: "end" }}>
        <Link to="/forgot-password" style={{ textDecoration: "none" }}>
          <Typography
            sx={{
              cursor: "pointer",
              color: "#1a3864",
              textDecoration: "underline",
            }}
          >
            Forgot Password?
          </Typography>
        </Link>
      </Grid2>

      {/* Login Button */}
      <Grid2 item size={12} sx={{ marginTop: "2%" }}>
        <Button
          type="submit"
          sx={{
            width: "100%",
            backgroundColor: "#1a3864",
            textTransform: "none",
          }}
          variant="contained"
        >
          {loading ? (
            <CircularProgress
              size={24}
              color="#1b3764"
              id="login-loadingSpinner"
            />
          ) : (
            "Login"
          )}
        </Button>
      </Grid2>

      {/* Signup Note */}
      <Grid2 item size={12} sx={{ marginTop: "2%", textAlign: "center" }}>
        <Typography style={{color:'black'}} variant="body2">
          Don’t have an account?{" "}
          <Link
            to="/sign-up"
            style={{ textDecoration: "none", color: "#1a3864" }}
          >
            Signup as a learner
          </Link>
        </Typography>
      </Grid2>

      {/* Error Alert */}
      {error && (
        <Grid2 item size={12} sx={{ marginTop: "2%" }}>
          <Alert severity="error">{error}</Alert>
        </Grid2>
      )}
    </form>
  );
}
