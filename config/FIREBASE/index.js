import { initializeApp } from 'firebase/app';
import { getDatabase } from "firebase/database";
import { getAuth } from '@firebase/auth';


const firebaseConfig = {
    apiKey: "AIzaSyCu5kQ6eEbxG4juZ8hlgJ4_MIR49qHkA_I",
    authDomain: "stunt-78510.firebaseapp.com",
    databaseURL: "https://stunt-78510-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "stunt-78510",
    storageBucket: "stunt-78510.appspot.com",
    messagingSenderId: "393481847439",
    appId: "1:393481847439:web:a5991e4334855cf68866fa"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const auth = getAuth(app)

export {app, database, auth};

