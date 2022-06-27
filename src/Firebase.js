import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyA7h8BZJUTp1J1lEy-AFJCGFIrnkomD55k",
    authDomain: "item-manager-707c2.firebaseapp.com",
    projectId: "item-manager-707c2",
    storageBucket: "item-manager-707c2.appspot.com",
    messagingSenderId: "858332584629",
    appId: "1:858332584629:web:5ae15d447d5510384b7cfc"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);


