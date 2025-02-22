// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBW-TMJDDbgmEWI1tRnZM-doAfBCNJmEDE",
  authDomain: "auth-interaccionesuc.firebaseapp.com",
  projectId: "auth-interaccionesuc",
  storageBucket: "auth-interaccionesuc.appspot.com",
  messagingSenderId: "253046035238",
  appId: "1:253046035238:web:1cc6e318b39dce3ab327e7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };