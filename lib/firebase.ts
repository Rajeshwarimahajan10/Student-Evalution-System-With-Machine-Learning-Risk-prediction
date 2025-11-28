import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBbGkFNgh5bZSD2l96C0k7LEE_EJojhMpc",
  authDomain: "student-evaluation-system10.firebaseapp.com",
  projectId: "student-evaluation-system10",
  storageBucket: "student-evaluation-system10.appspot.com",
  messagingSenderId: "50828787551",
  appId: "1:50828787551:web:7abf0983ac61f9b92d80ea",
  measurementId: "G-VZ05JK8YFM"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

export default app;
