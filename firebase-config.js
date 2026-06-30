// Firebase Configuration
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAu6oOhESDSb1cImFoJJRS6RxXwB4L-2vQ",
  authDomain: "organizador-viagem.firebaseapp.com",
  projectId: "organizador-viagem",
  storageBucket: "organizador-viagem.firebasestorage.app",
  messagingSenderId: "972761364578",
  appId: "1:972761364578:web:c5beec2ef50360a1f7f93b"
};

const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth(firebaseApp);
const db = getFirestore(firebaseApp);

export { auth, db };
