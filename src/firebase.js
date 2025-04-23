// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, get, child } from 'firebase/database';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAQDu34LHjRyc6HGcSa9fAbnSgfHczh5Ow",
  authDomain: "frenchwordbank.firebaseapp.com",
  databaseURL: "https://frenchwordbank-default-rtdb.firebaseio.com",
  projectId: "frenchwordbank",
  storageBucket: "frenchwordbank.firebasestorage.app",
  messagingSenderId: "714458570953",
  appId: "1:714458570953:web:9ed8460c6dca27d5176d18",
  measurementId: "G-CP5B6SLZC6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export { database, ref, set, get, child };