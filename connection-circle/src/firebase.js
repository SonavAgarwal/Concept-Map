import { getAuth } from "@firebase/auth";
import { getFirestore } from "@firebase/firestore";
import { initializeApp } from "firebase/app";
// import { Auth } from "firebase/auth";
import firebaseConfig from "./firebaseConfig";

// Initialize Firebase with a "default" Firebase project
const firebase = initializeApp(firebaseConfig);

// export default firebase;

const firestore = getFirestore(firebase);
export { firestore };
const auth = getAuth();
export { auth };
