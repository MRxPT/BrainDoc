import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAfufyyCql6axfCnHRAe2vyvGWs1nRcbAw",
  authDomain: "braindoc-4b6d8.firebaseapp.com",
  projectId: "braindoc-4b6d8",
  storageBucket: "braindoc-4b6d8.firebasestorage.app",
  messagingSenderId: "732255998166",
  appId: "1:732255998166:web:c009be831ce4cf1975f977",
  measurementId: "G-THJ0NX9DFH"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
