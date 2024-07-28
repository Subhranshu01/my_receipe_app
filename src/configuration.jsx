// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD9UoPZ95WwCnhUeOdBcgTm9ct4O-biDgE",
  authDomain: "recipe-sharing-web-app.firebaseapp.com",
  databaseURL: "https://recipe-sharing-web-app-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "recipe-sharing-web-app",
  storageBucket: "recipe-sharing-web-app.appspot.com",
  messagingSenderId: "922476412790",
  appId: "1:922476412790:web:0f4736065cb7dbb5ec4457",
  measurementId: "G-H18MNCWLG2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export default firebaseConfig
export const auth = getAuth(app);

