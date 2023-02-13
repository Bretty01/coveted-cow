import { initializeApp } from 'firebase/app'
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"

const firebaseApp = initializeApp({
    apiKey: "AIzaSyCLr2pTWmkxsEWIewH0gRMV4D7zAwqgzsQ",
    authDomain: "coveted-cow.firebaseapp.com",
    projectId: "coveted-cow",
    storageBucket: "coveted-cow.appspot.com",
    messagingSenderId: "427900494975",
    appId: "1:427900494975:web:2614faf88150baa279cb4a",
    measurementId: "G-KRQ4Z01HFT"
});
const db = getFirestore();
const auth = getAuth(firebaseApp);

export {db,auth}