import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import AppRouter from "./routes/AppRouter";
import AuthRouter from "./routes/AuthRouter";
import { useEffect } from "react";
import { getSessionAsync } from "./auth/CognitiSlice";
import { Backdrop, CircularProgress } from "@mui/material";

function App() {
  const dispatch = useDispatch();
  const authDetails = useSelector((state) => state?.cognito?.user);

  const loading = useSelector((state) => state?.cognito?.loading);

  const isAuthenticated = useSelector(
    (state) => state?.cognito?.isAuthenticated
  );
  const token = useSelector((state) => state?.cognito?.token);

  if (token) {
    axios.interceptors.request.use((config) => {
      config.headers.Authorization = "Bearer " + token;
      return config;
    });
  }
  useEffect(() => {
    dispatch(getSessionAsync());
  }, [isAuthenticated, token]);

  

  return loading ? (
    <Backdrop
      sx={(theme) => ({ color: "#fff", zIndex: theme.zIndex.drawer + 1 })}
      open={true}
    >
      <CircularProgress sx={{ color: "#1b3764" }} />
    </Backdrop>
  ) : authDetails?.accessToken?.jwtToken || isAuthenticated ? (
    <AppRouter />
  ) : (
    <AuthRouter />
  );
}

export default App;
