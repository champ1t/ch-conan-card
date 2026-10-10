import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

export const FIREBASE_CONFIG = {
  apiKey: "AIzaSyDkCUgcJuUTckh-DY8tZdHJC3Q8dfMZIrM",
  authDomain: "conancard-3f557.firebaseapp.com",
  projectId: "conancard-3f557",
  storageBucket: "conancard-3f557.firebasestorage.app",
  messagingSenderId: "392366729984",
  appId: "1:392366729984:web:b6551fa0f8aca390efe1e5"
};

// Initialize Firebase
const app = initializeApp(FIREBASE_CONFIG);
export const auth = getAuth(app);
export const db = getFirestore(app);

// Firestore collection names (separate from drop system)
export const COLLECTIONS = {
  PRODUCTS:   'cl_products',
  ORDERS:     'cl_orders',
  LIVE:       'cl_live',
  HIGHLIGHTS: 'cl_highlights',
  CONFIG:     'cl_config',
  ADMINS:     'admins', // Used for role checking
};
