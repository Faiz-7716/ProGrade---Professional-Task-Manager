// src/lib/firebase.ts
import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  projectId: 'studio-2384447676-2ec49',
  appId: '1:299612523661:web:d3cd9e5e089f219a4b66c4',
  apiKey: 'AIzaSyD_RS2SjXbD_xY33bD0I0AkJbvv2Ill2D4',
  authDomain: 'studio-2384447676-2ec49.firebaseapp.com',
  measurementId: '',
  messagingSenderId: '299612523661',
  storageBucket: 'studio-2384447676-2ec49.appspot.com'
};

// Initialize Firebase
let app;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
}

const auth = getAuth(app);

export { app, auth };
