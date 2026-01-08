import { createSlice } from "@reduxjs/toolkit";


/**
 * Redux slice for managing notification state, including open status, severity, message, and loading state.
 */
const notificationSlice = createSlice({
  name: "notification",
  initialState: {
    open: false,
    severity: "",
    message: "",
    loading:false
  },
  reducers: {
    setNotification(state, action) {
      const notification = action.payload;
      state.open = notification.open;
      state.severity = notification.severity;
      state.message = notification.message;
    },

    closeNotification(state) {
      state.open = false;
      state.severity = "";
      state.message = "";
    },

    handleLoading(state,action)
    {
      state.loading=action.payload.loading
    }
  },
});

export const notificationSliceActions = notificationSlice.actions;
export default notificationSlice.reducer;
