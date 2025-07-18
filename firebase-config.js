
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDihdO3cvkJR6cOI3LEd5mQk6XIPei4VKo",
  authDomain: "droptechify-23f52.firebaseapp.com",
  projectId: "droptechify-23f52",
  storageBucket: "droptechify-23f52.firebasestorage.app",
  messagingSenderId: "840387125367",
  appId: "1:840387125367:web:3ed4fe06b799b597afa672",
  measurementId: "G-CPG0ZH4JKF"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { db, storage, collection, addDoc, getDocs, deleteDoc, doc, ref, uploadBytes, getDownloadURL };
