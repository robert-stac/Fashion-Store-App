import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import.meta.env.VITE_FIREBASE_API_KEY

const firebaseConfig = {
  apiKey: "AIzaSyBppPnzCowuUDKvj8OlG1Q0kzZQqSIRe7w",
  authDomain: "fashion-store-manager.firebaseapp.com",
  projectId: "fashion-store-manager",
  storageBucket: "fashion-store-manager.firebasestorage.app",
  messagingSenderId: "675074868462",
  appId: "1:675074868462:web:a126d22b27778867061fff",
  measurementId: "G-4JH1LB4YMW"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export the database for use in your Context files
export const db = getFirestore(app);
export const auth = getAuth(app);