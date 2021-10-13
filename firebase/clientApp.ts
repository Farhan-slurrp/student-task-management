import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: "student-task-management.firebaseapp.com",
  projectId: "student-task-management",
  storageBucket: "student-task-management.appspot.com",
  messagingSenderId: "446478880217",
  appId: "1:446478880217:web:461c7c705ffc84c8765dc8",
  measurementId: "G-BBHJSPCZY9",
};

// Initialize Firebase with a "default" Firebase project
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export default firebase;
