// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDlfMJgxpIMvaOLcNwmkZbbmniB5x2qy8w",
  authDomain: "inventory-management-b8670.firebaseapp.com",
  projectId: "inventory-management-b8670",
  storageBucket: "inventory-management-b8670.appspot.com",
  messagingSenderId: "889266010331",
  appId: "1:889266010331:web:4680a51ef9f0f0ae90f4fe",
  measurementId: "G-R3ZQFVZN5D"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);
const storage = getStorage(app);

export {firestore, storage};