// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDKYfTuzYrf3kUuKTDYXAEFJFE4-M9WUZo",
  authDomain: "remote-jobs-c30c5.firebaseapp.com",
  projectId: "remote-jobs-c30c5",
  storageBucket: "remote-jobs-c30c5.firebasestorage.app",
  messagingSenderId: "1088169085291",
  appId: "1:1088169085291:web:dc0a492cd6a6871964a42e",
  measurementId: "G-VM25BVZFFV"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Analytics only in browser environment
let analytics;
if (typeof window !== 'undefined') {
  isSupported().then(supported => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  });
}

// Initialize Firestore
export const db = getFirestore(app);

// Initialize Storage
export const storage = getStorage(app);

export { app, analytics };

