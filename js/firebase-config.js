

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js";

const firebaseConfig = {
  apiKey: "AIzaSyCiJa7P5IDrTpCWP10RgW81WFulcqIBR4U",
  authDomain: "afri-d548a.firebaseapp.com",
  projectId: "afri-d548a",
  storageBucket: "afri-d548a.appspot.com",
  messagingSenderId: "367284086998",
  appId: "1:367284086998:web:21fe5c619b5c7d3d0c0177"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const storage = getStorage(app);
