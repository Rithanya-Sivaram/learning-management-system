import { configureStore } from "@reduxjs/toolkit";
import authenticationReducer from "../auth/AuthenticationSlice";
import notificationReducer from "../service/NotificationSlice";
import cognitoSlice from "../auth/CognitiSlice"


/**
 * Configures and sets up the Redux store for the application.
 * The store is created using `configureStore` from Redux Toolkit and is populated with the necessary reducers and middleware.
 *
 * @returns {Store} - The Redux store with pre-configured reducers and middleware.
 */
const Store = configureStore({
    middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
    reducer: {
        authentication: authenticationReducer,
        notification: notificationReducer,
        cognito:cognitoSlice,
     
    }});

    export default Store;
    