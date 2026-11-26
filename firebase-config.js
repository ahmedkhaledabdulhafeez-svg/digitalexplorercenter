import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyB8rfBmFat5DyknqMXwasZ07AdYtZsN1DY",
  authDomain: "digital-explorer-center.firebaseapp.com",
  projectId: "digital-explorer-center",
  storageBucket: "digital-explorer-center.firebasestorage.app",
  messagingSenderId: "232804283052",
  appId: "1:232804283052:web:a1e0faac8de298551aa509",
  measurementId: "G-Z3D714EKPF"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
