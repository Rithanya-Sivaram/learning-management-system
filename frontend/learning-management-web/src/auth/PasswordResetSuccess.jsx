import { Box, Button, Grid2, Typography } from "@mui/material";
import classes from "./Auth.module.css";
import { useNavigate } from "react-router-dom";
import Logo from "../assets/img/BreezewareLogoSvg.svg";

export default function PasswordResetSuccess({ setCurrentView }) {
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
          <Box style={{display:'flex',alignItems:'center',justifyContent:'center',marginBottom:'12px'}}>
            <img style={{ width: "140px", marginTop: "16px" }} src={Logo} />
          </Box>
          <Typography id="verifyPassword-otpInstruction">
            Your password has been successfully reset!
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
          Back to Login
        </Button>
      </Grid2>
    </Grid2>
  );
}
