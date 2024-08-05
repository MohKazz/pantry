// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB0re-hfxoRZBdmTBXmshwFtCmU2YCYylg",
  authDomain: "pantryapplication1.firebaseapp.com",
  projectId: "pantryapplication1",
  storageBucket: "pantryapplication1.appspot.com",
  messagingSenderId: "386018432271",
  appId: "1:386018432271:web:ff8147b3d98f48e4499a7a"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
