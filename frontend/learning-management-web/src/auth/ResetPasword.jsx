import React, { useEffect, useState } from "react";
// import PatientCard from "../components/PatientCard";
import { useFormik } from "formik";
import { useNavigate, useSearchParams } from "react-router-dom";
import * as Yup from "yup";
import { Box, Snackbar, Alert, Typography } from "@mui/material";
// import AppLogo from "../assets/logo/app-logo-color.png";
import classes from "./Auth.module.css";
import BackendService from "../service/BackendService";
import PasswordSetupCard from "./PasswordSetupCard";
import { useDispatch } from "react-redux";
import { notificationSliceActions } from "../service/NotificationSlice";
import { authenticationSliceActions } from "./AuthenticationSlice";

/**
 * A functional component that handles the password reset process for users.
 * It retrieves the email from localStorage and the token from the URL search parameters
 * to verify the reset request. If valid, users can reset their password.
 * 
 * The component uses React Router's `useNavigate` for navigation and Redux's `useDispatch` 
 * for managing application state.
 * 
 * @returns {JSX.Element} The JSX representation of the password reset UI.
 */

const ResetPasword = () => {
  let email = localStorage.getItem("email");
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (email) {
      localStorage.removeItem("email");
      localStorage.removeItem("timerValue");
      localStorage.removeItem("token");

      localStorage.setItem("hasAlreadyRun", "true");
      window.location.reload();
    }
  }, [email]);
  const registrySchema = Yup.object().shape({
    password: Yup.string().required("Password is required"),

    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), null], "Passwords must match")
      .required("Confirm Password is required"),
  });

  const formik = useFormik({
    initialValues: {
      password: "",
      confirmPassword: "",
    },
    validationSchema: registrySchema,

    onSubmit: async (values) => {
      const data={
        password:values.password,
        confirmPassword:values.confirmPassword,
        token:token
      }
      dispatch(authenticationSliceActions.loadingHandler({ loading: true }));
      BackendService.resetPassword(data)
        .then((res) => {
          dispatch(
            authenticationSliceActions.loadingHandler({ loading: false })
          );
          dispatch(
            notificationSliceActions.setNotification({
              open: true,
              severity: "success",
              message: "Password changed successfully",
            })
          );
          navigate("/");
        })
        .catch((err) => {
          dispatch(
            authenticationSliceActions.loadingHandler({ loading: false })
          );
          dispatch(
            notificationSliceActions.setNotification({
              open: true,
              severity: "error",
              message: err?.response?.data?.message
                ? err?.response?.data?.message
                : "An error occured",
            })
          );
        });
    },
    validateOnChange: false,
    enableReinitialize: true,
  });

  return (
    <div style={{backgroundColor:'white'}} className={classes.registrtyContainer}>
      {/* <PatientCard> */}
        <Box>
          <Box className={classes.logoContainer}>
            <img className={classes.logo} src={"AppLogo"} alt="App Logo" />
          </Box>
          <Typography
            style={{
              fontSize: "20px",
              fontWeight: "500",
              marginTop: "4px",
              marginBottom: "4px",
              textAlign: "center",
            }}>
            Create New Password
          </Typography>
          <form onSubmit={formik.handleSubmit}>
            <PasswordSetupCard formik={formik} />
          </form>
        </Box>
      {/* </PatientCard> */}
    </div>
  );
};

export default ResetPasword;
