// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBhlpZHe3zkHLhJdY5RTIZhpaoKOBnPqCc",
  authDomain: "estancia-19eba.firebaseapp.com",
  projectId: "estancia-19eba",
  storageBucket: "estancia-19eba.appspot.com",
  messagingSenderId: "652798424406",
  appId: "1:652798424406:web:94cc7447ef0e5428add2f7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth
const auth = getAuth(app);

export { app, auth };
