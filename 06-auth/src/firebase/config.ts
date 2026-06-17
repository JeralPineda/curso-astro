// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.PUBLIC_FIREBASE_API_KEY,
  authDomain: "astro-authentication-f8eee.firebaseapp.com",
  projectId: "astro-authentication-f8eee",
  storageBucket: "astro-authentication-f8eee.firebasestorage.app",
  messagingSenderId: "483098524920",
  appId: "1:483098524920:web:34d5cd407b7ff249844f0d",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
auth.languageCode = "es";

export const firebase = {
  app,
  auth,
};
