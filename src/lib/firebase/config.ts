// Import the functions you need from the SDKs you need

import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore/lite";

// TODO: Add SDKs for Firebase products that you want to use

// https://firebase.google.com/docs/web/setup#available-libraries


// Your web app's Firebase configuration

const firebaseConfig = {

    apiKey: "AIzaSyDrKVRHUZ2mVsDoLZNrojfpXCSpGkzo8Mc",

    authDomain: "abvoter.firebaseapp.com",

    projectId: "abvoter",

    storageBucket: "abvoter.firebasestorage.app",

    messagingSenderId: "673228679545",

    appId: "1:673228679545:web:57e9f305b1da5c747267a8"

};


// Initialize Firebase

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);