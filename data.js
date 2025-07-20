//--------------- INFORMACION BASE DATOS ---------------------------
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAxvHQ52DeFk1g765EFyMsyqEtx95xMibQ",
  authDomain: "proyecto-mes-julio-66023.firebaseapp.com",
  projectId: "proyecto-mes-julio-66023",
  storageBucket: "proyecto-mes-julio-66023.firebasestorage.app",
  messagingSenderId: "963435444575",
  appId: "1:963435444575:web:98dbafd4ea5941bb585eea",
  measurementId: "G-DBW7CRV7S6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);


//--------------- API PARA SUBIR LAS IAMGENES EN IMG BB--------------------
const api_img = "31d404c5b858689b8dc3103bf0ade0c3"
