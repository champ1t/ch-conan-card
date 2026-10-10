import { auth, db, COLLECTIONS } from '../config/firebase.js';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signInAnonymously, 
  signOut as firebaseSignOut,
  onAuthStateChanged,
  sendPasswordResetEmail
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// Global auth state
export let currentUser = null;
export let isAdmin = false;

// Listeners
const authListeners = new Set();
let isInitialized = false;
let initResolver = null;
export const authReady = new Promise(resolve => { initResolver = resolve; });

// Start listening to Auth state
onAuthStateChanged(auth, async (user) => {
  currentUser = user;
  isAdmin = false;
  
  if (user) {
    // Check if user is an admin by looking for their UID in the admins collection
    try {
      const adminDoc = await getDoc(doc(db, COLLECTIONS.ADMINS, user.uid));
      isAdmin = adminDoc.exists();
    } catch (err) {
      console.error("[Auth] Admin check failed:", err);
    }
  }

  // Notify listeners
  authListeners.forEach(fn => fn({ user, isAdmin }));
  
  if (!isInitialized) {
    isInitialized = true;
    initResolver();
  }
});

// Subscribe to auth changes
export function subscribeAuth(callback) {
  authListeners.add(callback);
  if (isInitialized) callback({ user: currentUser, isAdmin });
  return () => authListeners.delete(callback);
}

// Actions
export async function login(email, password) {
  return signInWithEmailAndPassword(auth, email, password);
}

export async function signup(email, password) {
  return createUserWithEmailAndPassword(auth, email, password);
}

export async function loginGuest() {
  return signInAnonymously(auth);
}

export async function logout() {
  return firebaseSignOut(auth);
}

export async function resetPassword(email) {
  return sendPasswordResetEmail(auth, email);
}
