import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "your api key ",
  authDomain: "student-evaluation-system10.firebaseapp.com",
  projectId: "student-evaluation-system10",
  storageBucket: "student-evaluation-system10.appspot.com",
  messagingSenderId: "",
  appId: "your app id ",
  measurementId: "G-VZ05JK8YFM"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

export default app;

