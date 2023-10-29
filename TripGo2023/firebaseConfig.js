// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {

};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestoreDB = getFirestore(app);
const firebaseAuth = getAuth(app);

export {signOut,firestoreDB,firebaseAuth,signInWithEmailAndPassword,createUserWithEmailAndPassword,setDoc,getDoc,addDoc,doc,serverTimestamp,collection, orderBy, limit,where,query,Timestamp,getDocs,onSnapshot,deleteDoc, onAuthStateChanged };