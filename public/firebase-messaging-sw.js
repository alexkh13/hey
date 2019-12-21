// Give the service worker access to Firebase Messaging.
// Note that you can only use Firebase Messaging here, other Firebase libraries
// are not available in the service worker.
importScripts('https://www.gstatic.com/firebasejs/7.6.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/7.6.0/firebase-messaging.js');

// Initialize the Firebase app in the service worker by passing in the
// messagingSenderId.
firebase.initializeApp({
  apiKey: "AIzaSyAv_iqx8Kri7G__NX4R9qBOmkyBwMTAEfs",
  authDomain: "hey-x.firebaseapp.com",
  databaseURL: "https://hey-x.firebaseio.com",
  projectId: "hey--x",
  storageBucket: "hey--x.appspot.com",
  messagingSenderId: "153383323733",
  appId: "1:153383323733:web:de8a615e58f74eaf",
  measurementId: "G-HRJR0RSJ28"
});

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const messaging = firebase.messaging();