// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBWC0YmluIfiLoTTAv8E4k9RXVasCdqYAw",
  authDomain: "niyocf.firebaseapp.com",
  projectId: "niyocf",
  storageBucket: "niyocf.appspot.com", // Corrected from firebasestorage.app to appspot.com
  messagingSenderId: "131154893112",
  appId: "1:131154893112:web:f1027446188371b25dc9cd",
  measurementId: "G-R1XJMG577X",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// You can export the app and analytics if they need to be used elsewhere,
// or just ensure this file is imported once to initialize.
export { app, analytics };
