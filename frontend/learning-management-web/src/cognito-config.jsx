const VITE_COGNITO_USER_POOL_ID = import.meta.env.VITE_COGNITO_USER_POOL_ID;
const VITE_COGNITO_CLIENT_ID = import.meta.env.VITE_COGNITO_CLIENT_ID;

export const cognitoConfig = {
  userPoolId: VITE_COGNITO_USER_POOL_ID, // Replace with your Cognito User Pool ID
  clientId: VITE_COGNITO_CLIENT_ID, // Replace with your Cognito App Client ID
};
