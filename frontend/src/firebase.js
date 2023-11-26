// Import the functions you need from the SDKs you need
import firebase from 'firebase/app';
import 'firebase/auth';
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAjgE_nGig1OVmHCg5_pWA8XxUvhsHmYcE",
  authDomain: "myrmidons-d557e.firebaseapp.com",
  projectId: "myrmidons-d557e",
  storageBucket: "myrmidons-d557e.appspot.com",
  messagingSenderId: "144452034391",
  appId: "1:144452034391:web:323ce5a4f7e32aefad6812",
  measurementId: "G-HVSYVP6NSD"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export default app;