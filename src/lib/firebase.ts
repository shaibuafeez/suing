import { initializeApp, getApps } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: "AIzaSyB_dNjCChtM9TPUIrO9KzMCyWdeEE2XsEg",
  authDomain: "suing-e7d25.firebaseapp.com",
  projectId: "suing-e7d25",
  storageBucket: "suing-e7d25.firebasestorage.app",
  messagingSenderId: "766499183376",
  appId: "1:766499183376:web:67da031ebe75b7e8e76395",
  measurementId: "G-RV6PSJ8066"
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const db = getFirestore(app);

// Initialize Analytics and check if window is available (client-side only)
let analytics = null;
if (typeof window !== 'undefined') {
  analytics = getAnalytics(app);
}

export { app, db, analytics };
