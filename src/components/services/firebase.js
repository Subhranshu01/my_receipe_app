// src/services/firebase.js
// src/services/firebase.js
// src/services/firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore,collection } from 'firebase/firestore';
import firebaseConfig from "../../configuration"

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize and export Firebase services
export const auth = getAuth(app);
export const firestore = getFirestore(app);
export {collection}
