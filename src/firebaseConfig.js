import { initializeApp } from "firebase/app"
import { getFirestore } from "firebase/firestore"
import { getStorage } from "firebase/storage"
import { getAuth } from "firebase/auth"


const firebaseConfig = {
    apiKey: "AIzaSyBnj5bdAdR0bpRw2UJpc5jLFxNIVwb4KIo",
    authDomain: "profile-project-9c9be.firebaseapp.com",
    projectId: "profile-project-9c9be",
    storageBucket: "profile-project-9c9be.appspot.com",
    messagingSenderId: "560252469380",
    appId: "1:560252469380:web:e2419d6e5e8c67b03242d1"
};

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)
const storage = getStorage(app)
const auth = getAuth(app)
export { db, storage, auth }