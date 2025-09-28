// src/lib/firebase.ts
import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "TODO: Your API key",
  authDomain: "TODO: Your auth domain",
  projectId: "TODO: Your project ID",
  storageBucket: "TODO: Your storage bucket",
  messagingSenderId: "TODO: Your messaging sender ID",
  appId: "TODO: Your app ID"
};

// Initialize Firebase
let app;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
}

const auth = getAuth(app);

export { app, auth };
