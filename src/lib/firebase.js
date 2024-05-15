
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: "reactchat-2eb83.firebaseapp.com",
  projectId: "reactchat-2eb83",
  storageBucket: "reactchat-2eb83.appspot.com",
  messagingSenderId: "1018588048435",
  appId: "1:1018588048435:web:cb894a910d642830ed4746"
};


const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const db = getFirestore();
export const storage = getStorage();