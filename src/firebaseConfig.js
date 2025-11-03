import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyBSr-7EQcKC-UkKe3AqPPnPcnl7CESMYKY",
  authDomain: "my-notes-app-986e0.firebaseapp.com",
  projectId: "my-notes-app-986e0",
  storageBucket: "my-notes-app-986e0.firebasestorage.app",
  messagingSenderId: "860619420747",
  appId: "1:860619420747:web:d2f771186bd727b3e7c9ce"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
