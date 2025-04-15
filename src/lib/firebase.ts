
import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  setPersistence, 
  browserLocalPersistence, 
  browserSessionPersistence 
} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBRpzQvXXXXXXXXXXXXXXXXXXXXXXXXXXX", // Replace with your Firebase API key
  authDomain: "codegen-app.firebaseapp.com", // Replace with your Firebase auth domain
  projectId: "codegen-app", // Replace with your Firebase project ID
  storageBucket: "codegen-app.appspot.com", // Replace with your Firebase storage bucket
  messagingSenderId: "XXXXXXXXXXXX", // Replace with your Firebase messaging sender ID
  appId: "1:XXXXXXXXXXXX:web:XXXXXXXXXXXX" // Replace with your Firebase app ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth, setPersistence, browserLocalPersistence, browserSessionPersistence };
