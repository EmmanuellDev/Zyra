// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD83CMFYVBLvyeS8cXmyo23hkZfAmCetK8",
  authDomain: "zyra-frontend.firebaseapp.com",
  databaseURL: "https://zyra-frontend-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "zyra-frontend",
  storageBucket: "zyra-frontend.firebasestorage.app",
  messagingSenderId: "240931543189",
  appId: "1:240931543189:web:1aea784370b631e079a39c",
  measurementId: "G-DE34JMGWYV"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);