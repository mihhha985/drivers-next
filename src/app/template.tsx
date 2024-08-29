"use client"
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getFirestore } from "firebase/firestore";


// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAvOyTBrSkFy0e4Tjn3WGGxEtuvoy6oZRA",
  authDomain: "spectex-87002.firebaseapp.com",
  databaseURL: "https://spectex-87002-default-rtdb.firebaseio.com",
  projectId: "spectex-87002",
  storageBucket: "spectex-87002.appspot.com",
  messagingSenderId: "98313380306",
  appId: "1:98313380306:web:5b20c5e0034cdae6e3e80b",
  measurementId: "G-E8EE48EEJ0"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const database = getDatabase(app);


export default function Template({children}: {children: React.ReactNode}) {
	return (
		<>{children}</>
	)
}	

