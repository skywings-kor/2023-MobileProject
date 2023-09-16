import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

import {onAuthStateChanged , getAuth,createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail,signOut } from 'firebase/auth';
import {getFirestore,doc, setDoc,collection, addDoc,getDoc, query, orderBy, limit, getDocs, updateDoc,serverTimestamp,deleteDoc,runTransaction,where,Timestamp,onSnapshot } from 'firebase/firestore'

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyDRtgspfXsEXs2Fzk80Wd6cZOA2KSWjFAQ",
    authDomain: "mobileproject-f79d3.firebaseapp.com",
    projectId: "mobileproject-f79d3",
    storageBucket: "mobileproject-f79d3.appspot.com",
    messagingSenderId: "280312426206",
    appId: "1:280312426206:web:8bbe883f519207bb671c4f"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestoreDB = getFirestore(app);
const firebaseAuth = getAuth(app);

export {signOut,firestoreDB,firebaseAuth,signInWithEmailAndPassword,createUserWithEmailAndPassword,setDoc,getDoc,addDoc,doc,serverTimestamp,collection, orderBy, limit,where,query,Timestamp,getDocs,onSnapshot,deleteDoc, onAuthStateChanged };