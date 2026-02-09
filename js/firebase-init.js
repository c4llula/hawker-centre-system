const firebaseConfig = {
  apiKey: "AIzaSyBsn3nzbTWFP0f2k7XTmFsRxdAjd0vhDKA",
  authDomain: "fed-assignment-33cc7.firebaseapp.com",
  databaseURL:
    "https://fed-assignment-33cc7-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "fed-assignment-33cc7",
  storageBucket: "fed-assignment-33cc7.firebasestorage.app",
  messagingSenderId: "6435796920",
  appId: "1:6435796920:web:5f521b0e023e8882a7014d",
};

firebase.initializeApp(firebaseConfig);

// Create the 'db' variable so all your other JS files can use it
const db = firebase.firestore();

console.log("Firebase is connected and ready!");
