// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyABxzbGrhnKJirE5Xx_BfXj9J3z8qZgfSY",
  authDomain: "my-expo-app-bb45c.firebaseapp.com",
  projectId: "my-expo-app-bb45c",
  storageBucket: "my-expo-app-bb45c.firebasestorage.app",
  messagingSenderId: "815959567920",
  appId: "1:815959567920:web:c83106a1dac32d4b3bc7f5",
  measurementId: "G-HDDL36CH4Y"
};

// Initialize Firebase
export const FIREBASE_APP = initializeApp(firebaseConfig);
export const FIREBASE_AUTH = getAuth(FIREBASE_APP);
const analytics = getAnalytics(FIREBASE_APP);