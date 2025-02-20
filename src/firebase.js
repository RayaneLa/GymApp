// firebase.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';



const firebaseConfig = {
    apiKey: "AIzaSyBzAw2gMRd2KVySJu0v5G3LiDfftejfu4E",
    authDomain: "sytra-studio.firebaseapp.com",
    projectId: "sytra-studio",
    storageBucket: "sytra-studio.firebasestorage.app",
    messagingSenderId: "696404614526",
    appId: "1:696404614526:web:426626b0ab6004bc4ca72f",
    measurementId: "G-3Z47DDR8ZH"
  };

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };
