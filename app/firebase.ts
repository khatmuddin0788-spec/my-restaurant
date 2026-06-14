import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBUSGpelEecv52N8mpawpJlnW-V0lVoqZo",
  authDomain: "my-restaurant-44c9f.firebaseapp.com",
  projectId: "my-restaurant-44c9f",
  storageBucket: "my-restaurant-44c9f.firebasestorage.app",
  messagingSenderId: "832916009337",
  appId: "1:832916009337:web:32d55c2b0a2d21294affa8",
  measurementId: "G-JNE6CS2NT3"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
const db = getFirestore(app);
export { db };