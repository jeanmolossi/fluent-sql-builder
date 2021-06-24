import firebase from "firebase";

export const firebaseConfig = {
  apiKey: "AIzaSyC-v5LIBGGoVjPlTiV0KPh2VyHbmj2n3mo",
  authDomain: "chat-vicente.firebaseapp.com",
  projectId: "chat-vicente",
  storageBucket: "chat-vicente.appspot.com",
  messagingSenderId: "580408033276",
  appId: "1:580408033276:web:53d7e598cc70fd69d5fc79",
  measurementId: "G-J83Z87KX91"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);