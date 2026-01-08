import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  CognitoUser,
  CognitoUserPool,
  AuthenticationDetails,
} from "amazon-cognito-identity-js";
import { cognitoConfig } from "../cognito-config";
import axios from "axios";
// import { useNavigate } from "react-router";
import { CognitoIdentityProviderClient, AdminCreateUserCommand } from "@aws-sdk/client-cognito-identity-provider";


// Initialize Cognito User Pool
export const UserPool = new CognitoUserPool({
  UserPoolId: cognitoConfig.userPoolId,
  ClientId: cognitoConfig.clientId,
});
// let errPasword;

const user = UserPool.getCurrentUser();

user?.getSession((err, session) => {
  if (err) {
   
    return;
  }

  // const idToken = session.getIdToken().getJwtToken();
  const payload = session.getIdToken().decodePayload();
// This is an array of group names, or undefined if user is not in any group
});

export const userLoginAsync = createAsyncThunk(
  "cognito/userLogin",
  async ({ email, password },) => {
    const user = new CognitoUser({
      Username: email,
      Pool: UserPool,
    });
    const authDetails = new AuthenticationDetails({
      Username: email,
      Password: password,
    });

    return new Promise((resolve, reject) => {
      user.authenticateUser(authDetails, {
        onSuccess: (data) => {
          const idToken = data.getIdToken();                // get ID token
          const payload = idToken.decodePayload();         // decode JWT payload
          const groups = payload["cognito:groups"] || [];  // get groups array

          resolve({
            token: idToken.getJwtToken(),
            user: data,
            groups: groups,                                 // save groups
          });
        },
        onFailure: (err) => {
          reject({ message: err.message });
        },
        newPasswordRequired: () => {
          reject({ message: "New Password Required" });
        },
      });
    });
  }
);


// Helper function to fetch user attributes
const getUserAttributes = (currentUser) => {
  return new Promise((resolve, reject) => {
    currentUser.getUserAttributes((err, attributes) => {
      if (err) {
        reject(err);
      } else {
        const results = {};
        attributes.forEach((attribute) => {
          results[attribute.Name] = attribute.Value;
        });
        resolve(results);
      }
    });
  });
};

// Async thunk for getting session
export const getSessionAsync = createAsyncThunk(
  "auth/getSession",
  async (_, { rejectWithValue }) => {
    const user = UserPool.getCurrentUser();
    if (!user) {
      return rejectWithValue({ message: "No current user found" });
    }

    return new Promise((resolve, reject) => {
      user.getSession(async (err, session) => {
        if (err) {
          reject(rejectWithValue(err));
        } else {
          const currentTime = Math.floor(Date.now() / 1000);
          const tokenExpiry = session.getIdToken().getExpiration();

          // Check if the token is expired
          if (tokenExpiry <= currentTime) {
            return rejectWithValue({ message: "Session expired" });
          }

          try {
            const attributes = await getUserAttributes(user);
            const idToken = session.getIdToken();             // get ID token
            const payload = idToken.decodePayload();          // decode payload
            const groups = payload["cognito:groups"] || [];   // extract groups

            const token = idToken.getJwtToken();

            // Set Authorization header globally
            axios.defaults.headers.common.Authorization = token;

            resolve({
              isAuthenticated: true,
              user: attributes,
              headers: { Authorization: token },
              groups: groups,  // add groups here
            });
          } catch (error) {
            reject(rejectWithValue(error));
          }
        }
      });
    });
  }
);

export const forgotPasswordAsync = createAsyncThunk(
  "auth/forgotPassword",
  async (email, { rejectWithValue }) => {
    // Create the user instance based on email
    const user = new CognitoUser({
      Username: email,
      Pool: UserPool,
    });

    return new Promise((resolve, reject) => {
      // Call forgotPassword on the CognitoUser instance
      user.forgotPassword({
        onSuccess: (data) => {
          resolve(data); // Resolve to notify the user that the code has been sent
        },
        onFailure: (err) => {
          reject(rejectWithValue(err)); // Reject with error message
        },
      });
    });
  }
);

export const confirmPasswordAsync = createAsyncThunk(
  "auth/confirmPassword",
  async ({ email, verificationCode, newPassword }, { rejectWithValue }) => {
    
    const user = new CognitoUser({
      Username: email,
      Pool: UserPool,
    });

    return new Promise((resolve, reject) => {
      user.confirmPassword(verificationCode, newPassword, {
        onSuccess: (data) => {
          resolve(data); 
        },
        onFailure: (err) => {
          
          reject(rejectWithValue(err));
        },
      });
    });
  }
);
export const otpVerifyAsync = createAsyncThunk(
  "auth/otpVerify",
  async ({ username, verificationCode }, { rejectWithValue }) => {
    const user = new CognitoUser({
      Username: username, // pass actual username from signup
      Pool: UserPool,
    });

    return new Promise((resolve, reject) => {
      user.confirmRegistration(
        verificationCode,
        true, // forceAliasCreation
        (err, result) => {
          if (err) {
            reject(rejectWithValue(err));
          } else {
            resolve(result);
          }
        }
      );
    });
  }
);




export const resendOTPAsync = createAsyncThunk(
  "auth/resendOTP",
  async ({ email }, { rejectWithValue }) => {
    const user = new CognitoUser({
      Username: email,
      Pool: UserPool,
    });

    return new Promise((resolve, reject) => {
      user.forgotPassword({
        onSuccess: (data) => {
          resolve(data);
        },
        onFailure: (err) => {
          reject(rejectWithValue(err?.message || "Failed to send OTP"));
        },
        inputVerificationCode: () => {
          resolve("OTP sent successfully");
        },
      });
    });
  }
);


export const userSignUpAsync = createAsyncThunk(
  "user/register",
  async (data, { rejectWithValue }) => {
    return new Promise((resolve, reject) => {
      // Generate a username from the email by taking the part before '@'
      // and appending a random number to ensure uniqueness
      const baseUsername = data.email.split("@")[0];
      const randomSuffix = Math.floor(Math.random() * 10000);
      const username = data.email;

      UserPool.signUp(
        username, // Use the generated username here
        data.newPassword,
        [
          { Name: "email", Value: data.email },
          { Name: "name", Value: `${data.firstName} ${data.lastName}` },
          { Name: "given_name", Value: data.firstName },
          { Name: "family_name", Value: data.lastName },
        ],
        null,
        (err, result) => {
          if (err) {
            reject(rejectWithValue(err));
          } else {
            resolve(result);
          }
        }
      );
    });
  }
);


export const confirmUserAsync = createAsyncThunk(
  "user/confirm",
  async (data,) => { 

       
    return new Promise((resolve, reject) => {
      const user = new CognitoUser({
        Username: data.email,
        Pool: UserPool,
      });

      user.confirmRegistration(
        data?.verificationCode,
        true,
        function (err) {
          if (err) {
      
            
            reject(err);
          } else {
            resolve();
          }
        }
      );
    });
  }
);

// Redux slice for Cognito
const cognitoSlice = createSlice({
  name: "cognito",
  initialState: {
    token: null,
    isAuthenticated: false,
    isInitialized: false,
    user: null,
    error: null,
    loading: false,
    authNotification: null,
    openAuthNotification: false,
    authNotificationSeverity: "",
    errorMessgaeForgotPassword: null,
    errorMessgaeRestPassword: null,
    resendOtpError: null,
    loginError: null,
    newPasswordRequired: false,
    otpVerify:false,
    logout:false,    userGroups: [],
  },
  reducers: {
    userLogout: (state) => {
      const user = UserPool.getCurrentUser();
      if (user) {
        user.signOut();
        state.token = null;
        state.isAuthenticated = false;
        state.user = null;
       
      }
    },
    resetState: (state,) => {
      state.error = null;
      state.loading = false;
      state.errorMessgaeForgotPassword = null;
      state.errorMessgaeRestPassword = null;
      state.loginError = null;
    },
    handleUpdateNotification: (state, action) => {
      state.authNotification = action.payload.authNotification;
      state.openAuthNotification = action.payload.openAuthNotification;
      state.authNotificationSeverity = action.payload.authNotificationSeverity;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(userLoginAsync.fulfilled, (state, action) => {
       
        
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.user = action.payload;
        state.loginError = null;
        state.loading = false;
        state.logout = false;
        state.userGroups = action.payload.groups || [];
      })
      .addCase(userLoginAsync.rejected, (state, action) => {
        if (action.error.message === "New Password Required") {
          state.newPasswordRequired = true;
        } else {
          state.loginError = action.error.message
            ? action.error.message
            : "An error occurred.";
          state.loading = false;
        }
      })
      .addCase(getSessionAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getSessionAsync.fulfilled, (state, action) => {
   
        
        state.token = action.payload.headers.Authorization;
        state.loading = false;
        state.isAuthenticated = action.payload.isAuthenticated;
        state.user = action.payload.user;
        state.userGroups = action.payload.groups || [];
      })
      .addCase(getSessionAsync.rejected, (state, action) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.error = action.payload || action.error.message;
      })
      .addCase(confirmPasswordAsync.pending, (state) => {
        state.loading = true;
        state.errorMessgaeRestPassword = null;
        state.successMessage = null;
      })
      .addCase(confirmPasswordAsync.fulfilled, (state) => {
        state.loading = false;
        state.successMessage = "Password has been successfully reset."; // Set success message
      })
      .addCase(confirmPasswordAsync.rejected, (state, action) => {
        state.loading = false;
        state.errorMessgaeRestPassword = action.payload.message
          ? action.payload.message
          : action.error.message;
      })
      .addCase(forgotPasswordAsync.pending, (state) => {
        state.loading = true;
        state.errorMessgaeForgotPassword = null;
        state.successMessage = null;
      })
      .addCase(forgotPasswordAsync.fulfilled, (state, ) => {
        state.loading = false;
        state.successMessage = "Password has been successfully reset."; // Set success message
      })
      .addCase(forgotPasswordAsync.rejected, (state, action) => {
        state.loading = false;
        state.errorMessgaeForgotPassword = action.payload.message
          ? action.payload.message
          : action.error.message;
      })

      .addCase(otpVerifyAsync.pending, (state) => {
        state.loading = true;
        state.errorMessgaeForgotPassword = null;
        state.successMessage = null;
      })
      .addCase(otpVerifyAsync.fulfilled, (state,) => {
        state.loading = false;
        state.successMessage = "Otp Verified successfully."; // Set success message
      })
      .addCase(otpVerifyAsync.rejected, (state, action) => {
        state.loading = false;
        state.errorMessgaeForgotPassword = action.payload.message
          ? action.payload.message
          : action.error.message;
      })
      .addCase(resendOTPAsync.pending, (state) => {
        state.loading = true;
        state.resendOtpError = null;
        state.successMessage = null;
      })
      .addCase(resendOTPAsync.fulfilled, (state, ) => {
        state.loading = false;
        state.successMessage = "Password has been successfully reset."; // Set success message
      })
      .addCase(resendOTPAsync.rejected, (state, action) => {
        state.loading = false;
        state.resendOtpError = action.payload.message
          ? action.payload.message
          : action.payload
          ? action.payload
          : action.error.message;
      });
  },
});

export const cognitoSliceActions = cognitoSlice.actions;
export default cognitoSlice.reducer;
