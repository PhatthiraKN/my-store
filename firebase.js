import { initializeApp } from
"https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";

import {
    getFirestore,
    collection,
    getDocs,
    addDoc,
    updateDoc,
    doc
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";


// ข้อมูล Firebase ของโปรเจกต์เรา
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD-QrLBX7XgLtrU554NUI8JFMgfK5A5Dzg",
  authDomain: "mysrotesmoothie.firebaseapp.com",
  projectId: "mysrotesmoothie",
  storageBucket: "mysrotesmoothie.firebasestorage.app",
  messagingSenderId: "67455281457",
  appId: "1:67455281457:web:465648b60b29ab2e5de810",
  measurementId: "G-K1QSEEPKE3"
};


// เริ่มต้น Firebase
const app = initializeApp(firebaseConfig);


// เชื่อมต่อ Firestore
const db = getFirestore(app);


// ส่งออกให้ script.js ใช้
export {
    db,
    collection,
    getDocs,
    addDoc,
    updateDoc,
    doc
};