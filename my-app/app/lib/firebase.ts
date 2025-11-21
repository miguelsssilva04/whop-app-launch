// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBVtQ0cjFcHb2D3MBOE0WtikSjYXV2wK1s",
  authDomain: "whop-app-launch.firebaseapp.com",
  projectId: "whop-app-launch",
  storageBucket: "whop-app-launch.firebasestorage.app",
  messagingSenderId: "322529504390",
  appId: "1:322529504390:web:634f100c6f11741343f507",
  measurementId: "G-VK1KGC4WTK"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);