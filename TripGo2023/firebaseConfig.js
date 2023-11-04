// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

import {onAuthStateChanged , getAuth,createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail  } from 'firebase/auth';
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import {arrayUnion,getFirestore,doc, setDoc,collection, addDoc,getDoc, query, orderBy, limit, getDocs, updateDoc,serverTimestamp,deleteDoc,runTransaction,where,Timestamp,onSnapshot } from 'firebase/firestore'


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
      
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestoreDB = getFirestore(app);
const firebaseAuth = getAuth(app);
const storage = getStorage(app);

export {updateDoc,arrayUnion,uploadBytes,getDownloadURL,ref,firestoreDB,firebaseAuth,onAuthStateChanged,signInWithEmailAndPassword,createUserWithEmailAndPassword,setDoc,getDoc,addDoc,doc,serverTimestamp,collection, orderBy, limit,where,query,Timestamp,getDocs,onSnapshot,deleteDoc,storage };