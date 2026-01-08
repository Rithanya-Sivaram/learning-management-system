import React, { useEffect, useState } from "react";
// import PatientCard from "../components/PatientCard";
import { useFormik } from "formik";
import { useNavigate, useSearchParams } from "react-router-dom";
import * as Yup from "yup";
import {
  Box,
  Snackbar,
  Alert,
} from "@mui/material";
// import AppLogo from "../assets/logo/app-logo-color.png";

import classes from "./Auth.module.css";
import BackendService from "../service/BackendService";
import PasswordSetupCard from "./PasswordSetupCard";

/**
 * A functional component that handles user registration functionality.
 * It allows users to create a new account by providing necessary information such as 
 * email, username, and password.
 * 
 * The component typically integrates with form handling libraries (e.g., Formik) for input validation 
 * and sends the registration data to an API or backend service for processing.
 * 
 * @returns {JSX.Element} The JSX representation of the user registration form.
 */

const RegistryUser = () => {
  let email = localStorage.getItem("email");
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const navigate = useNavigate();

  const [openNotification, setOpneNotifiaction] = useState(false);
  const [severity, setSeverity] = useState();
  const [message, setMessage] = useState();

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
      BackendService?.registerUser(values, token)
        .then((res) => {
          navigate("/");
        })
        .catch((err) => {
          setSeverity("error");
          setOpneNotifiaction(true);
          setMessage("Failed to setup password");
        });
    },
    validateOnChange: false,
    enableReinitialize: true,
  });

  return (
    <div className={classes.registrtyContainer}>
      <Snackbar
        autoHideDuration={3000}
        id="snackbar"
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={openNotification}
        onClose={() => setOpneNotifiaction(false)}>
        <Alert
          id="alert"
          onClose={() => setOpneNotifiaction(false)}
          severity={severity}>
          {message}
        </Alert>
      </Snackbar>
      <PatientCard>
        <Box>
          <Box className={classes.logoContainer}>
            <img className={classes.logo} src={"AppLogo"} alt="App Logo" />
          </Box>
          <form onSubmit={formik.handleSubmit}>
            <PasswordSetupCard formik={formik} />
          </form>
        </Box>
      </PatientCard>
    </div>
  );
};

export default RegistryUser;
