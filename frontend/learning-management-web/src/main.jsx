import { StrictMode } from "react";
// import { Buffer } from "buffer"; // Import Buffer
import { createRoot } from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";
import { Provider } from "react-redux";
import { ThemeProvider, CssBaseline } from "@mui/material";
import App from "./App.jsx";
import store from "./store/Store";
// import theme from "./theme";
import "./index.css";


createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <Router>
        {/* <ThemeProvider theme={theme}> */}
          {/* <CssBaseline /> */}
          <App />
        {/* </ThemeProvider> */}
      </Router>
    </Provider>
  </StrictMode>
);
