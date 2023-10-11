import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'


const firebaseConfig = {
  apiKey: "AIzaSyB1C0-x0fRj5hPwh7BPe61QGb3yEKhEFNg",
  authDomain: "todo-app-6e549.firebaseapp.com",
  databaseURL: "https://todo-app-6e549-default-rtdb.firebaseio.com",
  projectId: "todo-app-6e549",
  storageBucket: "todo-app-6e549.appspot.com",
  messagingSenderId: "144297731144",
  appId: "1:144297731144:web:f84c7a49d42d6ee32fa47d",
  measurementId: "G-FV8WKEZJ4K"
}

const firebaseApp = initializeApp(firebaseConfig);

const db = getFirestore(firebaseApp);
const auth = getAuth(firebaseApp)

export { db, auth };