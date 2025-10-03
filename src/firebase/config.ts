// This file is designed to read Firebase configuration from environment variables.
// This is the standard and secure way to handle configuration for different environments
// like development, staging, and production, especially when deploying to services like Netlify.

// Ensure that the following environment variables are set in your deployment environment (e.g., Netlify)
// and in a local .env.local file for development.

export const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// This function checks if all the required Firebase environment variables are present.
// It helps prevent runtime errors due to missing configuration.
export function isFirebaseConfigured() {
  return (
    firebaseConfig.apiKey &&
    firebaseConfig.authDomain &&
    firebaseConfig.projectId &&
    firebaseConfig.appId
  );
}
