import { Box, Button, Grid2, Typography } from "@mui/material";
import classes from "./Auth.module.css";
import { useNavigate } from "react-router-dom";

/**
 * A functional component that displays a success message after account setup.
 * Provides the user with a button to navigate back to the login or home page.
 *
 * @component
 * @returns {JSX.Element} The JSX representation of the account setup success screen.
 */
export default function AccountSetupSuccess() {
  const navigate = useNavigate();
  const loginRedircect = () => {
    navigate("/");
  };
  
  return (
    <Grid2 container textAlign="left">
      <Box
        className={classes.fieldContainer}
        id="verifyPassword-fieldContainer-1"
      >
        <Box
          className={classes.accountSuccessContainer}
          id="verifyPassword-headerContainer"
        >
          <Typography id="verifyPassword-otpInstruction">
            Your account has been successfully set up!
            <br />
            Please log in to continue.
          </Typography>
        </Box>
      </Box>
      <Grid2 item size={12} sx={{ marginTop: "5%" }}>
        <Button
          onClick={loginRedircect}
          type="submit"
          sx={{
            width: "100%",
            backgroundColor: "#1a3864",
            textTransform: "none",
          }}
          variant="contained"
        >
          Login
        </Button>
      </Grid2>
    </Grid2>
  );
}
