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
  Box
} from "@mui/material";
import Classes from "./Auth.module.css";
import { userSignUpAsync } from "./CognitiSlice";
import { useNavigate, Link } from "react-router-dom";
import { notificationSliceActions } from "../service/NotificationSlice";
import Logo from "../assets/img/BreezewareLogoSvg.svg"

export default function SignUp() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const signUpSchema = Yup.object().shape({
    firstName: Yup.string().required("First name is required"),
    lastName: Yup.string().required("Last name is required"),
    email: Yup.string()
      .required("Email is required")
      .email("Enter valid email"),
    password: Yup.string().required("Password is required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), null], "Passwords must match")
      .required("Confirm Password is required"),
  });

  const formik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema: signUpSchema,
    onSubmit: async (values) => {
      setLoading(true);
      dispatch(
        notificationSliceActions.setNotification({
          open: false,
          message: "",
          severity: "",
        })
      );
      // dispatch(authenticationSliceActions?.)
      dispatch(
        userSignUpAsync({
          firstName: values.firstName,
          lastName: values.lastName,
          email: values.email,
          newPassword: values.password,
        })
      )?.then((res) => {


        if (!res.error) {
          setLoading(false);
          dispatch(
            notificationSliceActions.setNotification({
              open: true,
              severity: "success",
              message: "Signup successful! Please verify with the OTP sent to your email.",
            })
          );
          navigate(
            `/enter-otp/${res?.payload?.user?.username}/${values?.email}`
          ); // redirect to login after signup
        } else {
          setLoading(false);
          dispatch(
            notificationSliceActions.setNotification({
              open: true,
              severity: "error",
              message: res?.error?.message || "An error occurred",
            })
          );
        }
      });
    },
    validateOnChange: false,
    enableReinitialize: true,
  });

  const handleClickShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  const handleClickShowConfirmPassword = () => {
    setShowConfirmPassword((prev) => !prev);
  };

  return (
    <Grid2
      style={{ width: "100%",backgroundColor:'white'}}
      container
      direction="column"
      alignItems="center"
    >
      {/* Sign Up Header */}
      <Grid2
        item
        size={12}
        sx={{ marginBottom: 2, marginTop: "5%", textAlign: "center" }}
      >
        <Box>
               <img style={{width:'140px',marginTop:'16px'}} src={Logo} />
               </Box>
        <Typography variant="h5" sx={{ fontWeight: "bold" }}>
          Create Account
        </Typography>
        <Typography variant="body2" sx={{ color: "gray" }}>
          Fill the form to get started
        </Typography>
      </Grid2>

      {/* Sign Up Form */}
      <form
        style={{ width: "100%" }}
        id="signup-form"
        onSubmit={formik.handleSubmit}
        autoComplete="off"
      >
        {/* First Name */}
        <Grid2
          style={{ width: "100%" }}
          item
          size={12}
          marginBottom={2}
          className={Classes.fieldContainer}
        >
          <InputLabel sx={{ textAlign: "left" }}>
            First Name <span className="error">*</span>
          </InputLabel>
          <TextField
            id="signup-first-name"
            autoComplete="off"
            placeholder="Enter your first name"
            onChange={formik.handleChange}
            value={formik.values.firstName}
            name="firstName"
            style={{ width: "100%" }}
            size="small"
          />
          {formik.errors.firstName && (
            <Typography sx={{ textAlign: "left" }} className="error">
              {formik.errors.firstName}
            </Typography>
          )}
        </Grid2>

        {/* Last Name */}
        <Grid2
          item
          size={12}
          marginBottom={2}
          className={Classes.fieldContainer}
        >
          <InputLabel sx={{ textAlign: "left" }}>
            Last Name <span className="error">*</span>
          </InputLabel>
          <TextField
            id="signup-last-name"
            autoComplete="off"
            placeholder="Enter your last name"
            onChange={formik.handleChange}
            value={formik.values.lastName}
            name="lastName"
            sx={{ width: "100%" }}
            size="small"
          />
          {formik.errors.lastName && (
            <Typography sx={{ textAlign: "left" }} className="error">
              {formik.errors.lastName}
            </Typography>
          )}
        </Grid2>

        {/* Email */}
        <Grid2
          item
          size={12}
          marginBottom={2}
          className={Classes.fieldContainer}
        >
          <InputLabel sx={{ textAlign: "left" }}>
            Email <span className="error">*</span>
          </InputLabel>
          <TextField
            id="signup-email"
            autoComplete="off"
            placeholder="eg: johndoe01@gmail.com"
            onChange={formik.handleChange}
            value={formik.values.email}
            name="email"
            sx={{ width: "100%" }}
            size="small"
          />
          {formik.errors.email && (
            <Typography sx={{ textAlign: "left" }} className="error">
              {formik.errors.email}
            </Typography>
          )}
        </Grid2>

        {/* Password */}
        <Grid2
          item
          size={12}
          marginBottom={2}
          className={Classes.fieldContainer}
        >
          <InputLabel sx={{ textAlign: "left" }}>
            Password <span className="error">*</span>
          </InputLabel>
          <TextField
            id="signup-password"
            autoComplete="off"
            placeholder="eg: **********"
            type={showPassword ? "text" : "password"}
            onChange={formik.handleChange}
            value={formik.values.password}
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
          {formik.errors.password && (
            <Typography sx={{ textAlign: "left" }} className="error">
              {formik.errors.password}
            </Typography>
          )}
        </Grid2>

        {/* Confirm Password */}
        <Grid2
          item
          size={12}
          marginBottom={2}
          className={Classes.fieldContainer}
        >
          <InputLabel sx={{ textAlign: "left" }}>
            Confirm Password <span className="error">*</span>
          </InputLabel>
          <TextField
            id="signup-confirm-password"
            autoComplete="off"
            placeholder="Re-enter your password"
            type={showConfirmPassword ? "text" : "password"}
            onChange={formik.handleChange}
            value={formik.values.confirmPassword}
            name="confirmPassword"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <div
                    className={Classes.paswordIcon}
                    onClick={handleClickShowConfirmPassword}
                    edge="end"
                  >
                    {!showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                  </div>
                </InputAdornment>
              ),
            }}
            sx={{ width: "100%" }}
            size="small"
          />
          {formik.errors.confirmPassword && (
            <Typography sx={{ textAlign: "left" }} className="error">
              {formik.errors.confirmPassword}
            </Typography>
          )}
        </Grid2>

        {/* Signup Button */}
        <Grid2 item size={12} sx={{ marginTop: "2%" }}>
          <Button
            disabled={loading}
            type="submit"
            sx={{ width: "100%", backgroundColor: "#1a3864" }}
            variant="contained"
          >
            {loading ? (
              <CircularProgress
                size={24}
                color="#1b3764"
                id="signup-loadingSpinner"
              />
            ) : (
              "Sign Up"
            )}
          </Button>
        </Grid2>

        {/* Already have account link */}
        <Grid2 item size={12} sx={{ marginTop: "2%", textAlign: "center" }}>
          <Typography style={{color:'black'}} variant="body2">
            Already have an account?{" "}
            <Link
              to="/login"
              style={{ textDecoration: "none", color: "#1a3864" }}
            >
              Login
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
    </Grid2>
  );
}
