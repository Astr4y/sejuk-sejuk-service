// src/firebase/config.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyC7oA1ljdMkyoLx-VfJdTLJbjkszRrJOQU",
  authDomain: "sejuk-sejuk-service-1.firebaseapp.com",
  projectId: "sejuk-sejuk-service-1",
  storageBucket: "sejuk-sejuk-service-1.firebasestorage.app",
  messagingSenderId: "120978063947",
  appId: "1:120978063947:web:5e86b1612c906b1de8c3ce",
  measurementId: "G-MWVW0CYDB7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export services
export const db = getFirestore(app);
export const storage = getStorage(app);
export const auth = getAuth(app);

export default app;