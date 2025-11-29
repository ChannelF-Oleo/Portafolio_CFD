// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDYybqd55WwWSjJ5__FGNTkhSNqDyk1SVE",
  authDomain: "portafolio-cfd.firebaseapp.com",
  projectId: "portafolio-cfd",
  storageBucket: "portafolio-cfd.firebasestorage.app",
  messagingSenderId: "488773298734",
  appId: "1:488773298734:web:d33606301602a3e4794dbf",
  measurementId: "G-5BY29E59CE",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Exportamos las herramientas para usarlas en toda la app
export const auth = getAuth(app); // Para el Login
export const db = getFirestore(app); // Para la Base de Datos
export const storage = getStorage(app); // Para subir fotos
