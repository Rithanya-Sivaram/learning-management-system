import React from "react";
import { Button, Grid2, Typography } from "@mui/material";

/**
 * A functional component that displays a confirmation message after a password reset request.
 * It informs the user that an email has been sent with instructions to reset their password.
 *
 * @param {Function} setCurrentView - A function to update the current view in the authentication flow (e.g., navigate back to the login screen).
 * @returns {JSX.Element} The JSX representation of the password reset confirmation screen.
 */

const PasswordResetConfirmation = ({ setCurrentView }) => {
  return (
    <Grid2 container textAlign="left">
      <Grid2 item size={12} sx={{ marginTop: "5%" }}>
        <Typography fontSize={20} fontWeight={600}>
          Password Reset Request Sent
        </Typography>
      </Grid2>
      <Grid2 item size={12} sx={{ marginTop: "5%" }}>
        <span style={{textAlign:'center',fontSize:'60px',display:'flex',justifyContent:'center',color:'#1a3864',fontWeight:'600'}} class="material-symbols-outlined">check</span>
        <Typography>
          We’ve sent a reset link to your email address. Please check your inbox
          and click the link to reset your password. Thank you!
        </Typography>
      </Grid2>

      <Grid2 item size={12} sx={{ marginTop: "5%" }}>
        <Button
          sx={{ width: "100%" }}
          variant="text"
          onClick={() => setCurrentView("Login")}>
          Back to Login
        </Button>
      </Grid2>
    </Grid2>
  );
};

export default PasswordResetConfirmation;
