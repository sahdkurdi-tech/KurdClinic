import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, addDoc, onSnapshot, query, where, orderBy, updateDoc, doc, serverTimestamp, getDoc, setDoc, getDocs } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyAiQgO7HbCJdg_AlWQ3omDOOtCchI-aXzg",
  authDomain: "kurdclinic-4d7e9.firebaseapp.com",
  projectId: "kurdclinic-4d7e9",
  storageBucket: "kurdclinic-4d7e9.firebasestorage.app",
  messagingSenderId: "789384663545",
  appId: "1:789384663545:web:794856054e749f2524ad28"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// تێبینی گرنگ: کۆدی (setPersistence)ـمان بەتەواوی سڕییەوە!
// فایەربەیس خۆکارانە (Local Persistence) بەکاردەهێنێت، پێویست ناکات ئێمە فەرمانی پێ بدەین. ئەمەش کێشەی دەرچوونی ئۆتۆماتیکی کاتی کردنەوەی چەند تابێک چارەسەر دەکات.

export { db, collection, query, where, onSnapshot, updateDoc, doc, addDoc, serverTimestamp, orderBy, auth, signInWithEmailAndPassword, onAuthStateChanged, signOut, getDoc, setDoc, getDocs };