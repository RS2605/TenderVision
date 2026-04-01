import { initializeApp, getApps } from "firebase/app";
import { getFirestore, doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";

// MSME Profile Schema definition
export interface MSMEProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  industry: string; // Default placeholder
  revenueKeywords: string[]; // Default placeholder
  createdAt: any;
  lastLoginAt: any;
}

const firebaseConfig = {
  apiKey: "AIzaSyDV08VqolVqhXKuqIHE8H8IN0rA6VrNqMk",
  authDomain: "tendervision-28349.firebaseapp.com",
  projectId: "tendervision-28349",
  storageBucket: "tendervision-28349.firebasestorage.app",
  messagingSenderId: "958510782411",
  appId: "1:958510782411:web:837d6bc7d0df0e859e884e",
  measurementId: "G-FBLBDZ7PFF"
};

// Initialize
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const db = getFirestore(app);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

// Google Auth Function logic
export async function loginWithGoogle() {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    
    // Save to Firestore automatically upon login
    const userRef = doc(db, "msme_profiles", user.uid);
    const snap = await getDoc(userRef);
    
    if (!snap.exists()) {
      const newProfile: MSMEProfile = {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        industry: "Unspecified MSME Sector",
        revenueKeywords: ["SME", "< 50M Turnover", "Startup"],
        createdAt: serverTimestamp(),
        lastLoginAt: serverTimestamp(),
      };
      await setDoc(userRef, newProfile);
    } else {
      await setDoc(userRef, { lastLoginAt: serverTimestamp() }, { merge: true });
    }
    
    return user;
  } catch (error) {
    console.error("Google Login Error:", error);
    throw error;
  }
}

export async function logout() {
  return signOut(auth);
}

export { app, db, auth };
