import firebase from 'firebase'

const firebaseConfig = {
    apiKey: "AIzaSyCFcUuRwkq1OI4rpAu2TxkT0-tFjAZcH14",
    authDomain: "contentvalue-8195c.firebaseapp.com",
    databaseURL: "https://contentvalue-8195c.firebaseio.com",
    projectId: "contentvalue-8195c",
    storageBucket: "contentvalue-8195c.appspot.com",
    messagingSenderId: "728458472522",
    appId: "1:728458472522:web:0c543c90b7d6d3fc5a4ab3",
    measurementId: "G-M5P1G7F2DH"
}

firebase.initializeApp(firebaseConfig);

export default firebase;