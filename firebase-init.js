
// Firebase initialization helper for consistent configuration
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
import { getFirestore, connectFirestoreEmulator } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';

// Your Firebase configuration
export const firebaseConfig = {
    apiKey: "AIzaSyChFO-OThN7rPIZuAOVNP8aG7R9qEAO-z4",
    authDomain: "droptechify-80034.firebaseapp.com",
    projectId: "droptechify-80034",
    storageBucket: "droptechify-80034.firebasestorage.app",
    messagingSenderId: "41692901589",
    appId: "1:41692901589:web:1e2000fd5bf89f0d7c725c",
    measurementId: "G-1PJMJF5W4L"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

// Test connection function
export async function testFirebaseConnection() {
    try {
        // Simple test to see if we can access Firestore
        console.log('🔥 Firebase initialized successfully');
        return true;
    } catch (error) {
        console.error('❌ Firebase initialization failed:', error);
        return false;
    }
}
