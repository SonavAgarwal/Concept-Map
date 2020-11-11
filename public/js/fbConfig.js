
// Web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
var firebaseConfig = {
    apiKey: "AIzaSyCLQzYifd7hzu6Boqfo-fTQw-js5QjWOXs",
    authDomain: "connection-circle.firebaseapp.com",
    databaseURL: "https://connection-circle.firebaseio.com",
    projectId: "connection-circle",
    storageBucket: "connection-circle.appspot.com",
    messagingSenderId: "183274555302",
    appId: "1:183274555302:web:8c42696e72fbbb34eeb167",
    measurementId: "G-F5GHSFE1CB"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
// firebase.analytics();

function signout() {
    firebase.auth().signOut().then(function() {
        window.location.href = "/signin.html";
      }).catch(function(error) {
        // An error happened.
      });
}