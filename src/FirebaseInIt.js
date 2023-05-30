// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC4UjDli96J5OnV5myhRK11YC2A8tdFMhs",
  authDomain: "react-blog-app-1a0c7.firebaseapp.com",
  projectId: "react-blog-app-1a0c7",
  storageBucket: "react-blog-app-1a0c7.appspot.com",
  messagingSenderId: "603914036208",
  appId: "1:603914036208:web:fa92f67c93859f12c8f335"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);