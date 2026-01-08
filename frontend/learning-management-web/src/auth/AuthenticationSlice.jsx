import { createSlice } from "@reduxjs/toolkit";

// Redux slice for Cognito
const authenticationSlice = createSlice({
  name: "authentication",
  initialState: {
    token: null,
    isAuthenticated: false,
    loading: false,
  },
  reducers: {
    setToken: (state, action) => {
      state.token = action.payload;
      state.isAuthenticated = true;
    },

    removeToken:(state,) => {
      state.token = null;
      state.isAuthenticated = false;
    },
    loadingHandler: (state, action) => {
      state.loading = action.payload.loading;
    },
  },
});

export const authenticationSliceActions = authenticationSlice.actions;
export default authenticationSlice.reducer;
