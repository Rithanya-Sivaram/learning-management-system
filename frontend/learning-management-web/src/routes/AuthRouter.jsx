import { Routes, Route } from "react-router-dom";
import AuthHome from "../auth/AuthHome";
import RegistryUser from "../auth/RegistryUser";
import ResetPasword from "../auth/ResetPasword";
import { useDispatch, useSelector } from "react-redux";
import { notificationSliceActions } from "../service/NotificationSlice";
import { Alert, Backdrop, CircularProgress, Snackbar } from "@mui/material";
import ForgotPassword from "../auth/ForgotPassword";
import Login from "../auth/Login";
import VerifyAndResetAccount from "../auth/VerifyAndResetAccount";
import SuccessScreen from "../auth/AccountSetupSuccess";
import PasswordResetSuccess from "../auth/PasswordResetSuccess";
import SignUp from "../auth/SignUp";
import EnterOTP from "../auth/EnterOtp";
// import usePageTitle from "../hooks/usePageTitle";

/**
 * The AuthRouter component handles authentication-related routing and displays notifications
 * based on the current state of authentication and notification slices in Redux.
 * It listens to Redux state changes and conditionally renders or dispatches actions accordingly.
 *
 * @returns {JSX.Element} - The AuthRouter component
 */
export default function AuthRouter() {
  const dispatch = useDispatch();
//   usePageTitle("Patient App")
  const openNotificationState = useSelector((state) => state.notification.open);
  const notificationSeverityState = useSelector(
    (state) => state.notification.severity
  );
  const message = useSelector((state) => state.notification.message);
  const loading=useSelector((state)=>state.authentication.loading)
  return (
    <>
      <Snackbar
        autoHideDuration={3000}
        id="snackbar"
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={openNotificationState}
        onClose={() => dispatch(notificationSliceActions.closeNotification())}
      >
        <Alert
          id="alert"
          onClose={() => dispatch(notificationSliceActions.closeNotification())}
          severity={notificationSeverityState}
        >
          {message}
        </Alert>
      </Snackbar>
      <Backdrop
        sx={(theme) => ({ color: "#1b3764", zIndex: theme.zIndex.drawer + 1 })}
        open={loading}
      >
        <CircularProgress color="#1b3764
" />
      </Backdrop>
      <Routes>
        <Route path="/" element={<AuthHome />}>
          <Route index element={<Login />} />
          <Route path="/sign-up" element={<SignUp />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          {/* <Route path="/verify-otps/:email" element={<EnterOTP />} /> */}
          <Route
            path="/setup-account/:email"
            element={<VerifyAndResetAccount />}
          />
          <Route path="/account-setup-success" element={<SuccessScreen />} />
          <Route
            path="/password-reset-setup-success"
            element={<PasswordResetSuccess />}
          />
          <Route
            path="/verify-otp/:email"
            element={<VerifyAndResetAccount />}
          />
          <Route path="*" element={<Login />} />
          <Route path="/enter-otp/:username/:email" element={<EnterOTP />} />
        </Route>
        <Route path="/*" element={<AuthHome />} />
        <Route path="/registerUser" element={<RegistryUser />} />
        <Route path="/resetPassword" element={<ResetPasword />} />
      </Routes>
    </>
  );
}
