

$("#bodyDiv").css("width", $("body").prop("clientWidth"));


function signIn() {
    var provider = new firebase.auth.GoogleAuthProvider();

    firebase.auth().signInWithPopup(provider).then(function(result) {
      // This gives you a Google Access Token. You can use it to access the Google API.
      var token = result.credential.accessToken;
      // The signed-in user info.
      var user = result.user;
      // ...

      if (result.additionalUserInfo.isNewUser) {
        firebase.firestore().collection("users").doc(firebase.auth().currentUser.uid).collection("circles").doc("circlesReference").set({
          circles: {
            "My First Circle": "The very first circle I created!"
          }
        }).then(function() {
          //add doc if needed
          window.location.href = "/home.html";
        });
      } else {
        window.location.href = "/home.html";
      }
    }).catch(function(error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      // The email of the user's account used.
      var email = error.email;
      // The firebase.auth.AuthCredential type that was used.
      var credential = error.credential;
      // ...
    });

    
}

firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      console.log("user")
      window.location.href = "/home.html";
    }
})

// firebase.auth().getRedirectResult().then(function(result) {
//     if (result.credential) {
//       var token = result.credential.accessToken;
//     }
//     var user = result.user;

//     console.log(user);
//     // window.location.href = "/home.html";

//   }).catch(function(error) {
//     // Handle Errors here.
//     var errorCode = error.code;
//     var errorMessage = error.message;
//     // The email of the user's account used.
//     var email = error.email;
//     // The firebase.auth.AuthCredential type that was used.
//     var credential = error.credential;
//     // ...
//   });