import firebase from "firebase/compat/app"
import "firebase/compat/auth"
import "firebase/compat/firestore"
import "firebase/compat/storage"

const app = firebase.initializeApp({
  apiKey: "AIzaSyAvygd6WfFB0fSy5y5PK1njDQSmWX7SrGo",
  authDomain: "my-dropbox1.firebaseapp.com",
  projectId: "my-dropbox1",
  storageBucket: "my-dropbox1.appspot.com",
  messagingSenderId: "939957524772",
  appId: "1:939957524772:web:7b58492ba37cad1a80fbb1",
  measurementId: "G-G44BYHGW2G"
})

const firestore = app.firestore()


export const database = {
  folders: firestore.collection("folders"),
  files: firestore.collection("files"),
  formatDoc: doc => {
    return { id: doc.id, ...doc.data() }
  },
  getCurrentTimestamp: firebase.firestore.FieldValue.serverTimestamp,
}
export const storage = app.storage()
export const auth = app.auth()
export default app