var db = firebase.firestore();
var circles = [];
var currentUser;

firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        console.log(user);
        currentUser = firebase.auth().currentUser;
        getProjects();
    } else {
        window.location.href = "/signin.html";
    }
});

function getProjects() {
    db.collection("users").doc(currentUser.uid).collection("circles").doc("circlesReference").get()
    .then(function (doc) {
        console.log(doc.data())
        circles = doc.data();
        console.log(circles)
        renderProjects();
    });
}

function renderProjects() {
    Object.keys(circles).forEach(function (key) {
        var value = circles[key];
        var id = key.replace(/\s+/g, '');
        var href = "/circle.html?" + "uid=" + currentUser.uid + "&name=" + key;
        // var link = $("<a></a>")
        // .attr('href', "/circle.html?" + "uid=" + currentUser.uid + "&name=" + key)
        // .appendTo(document.body).appendTo(document.body);

        $("<div id = '" + id + "'><div class='greenTitleClass'><h1>" + key + "</h1><button class = 'navButton invertedButton squareButton' onclick='openProject(this.value)' value = '" + href + "'><img id = 'openProject' class = 'buttonIcon' src = 'images/openicon.png'></button><button class = 'navButton invertedButton squareButton' onclick='deleteProject(this.value)' value = '" + key + "'><img id = 'trashProject' class = 'buttonIcon' src = 'images/trashicon.png'></button></div><p>" + value + "</p></div>")
        .addClass("projectCard").appendTo(document.body);
        
    });
    // $("<div></div>").attr("height", "10vw").attr("width", "10vw").attr("background-color", "white").appendTo(document.body);
}

$("#createDiv").hide();

$("#createDiv").on("click", function(event){
    if (event.target == document.getElementById("createDiv")) $("#createDiv").fadeOut(300);
  });

function createNew() {
    $("#createDiv").fadeIn(300);

}

function finishCreateNew() {
    if ($("#descriptionInput").val().trim("") == "") {
        $("#descriptionInput").effect("shake", {"distance": 10, "times": 2}, 300);
        return;
    }

    if ($("#nameInput").val().trim("") == "") {
        $("#nameInput").effect("shake", {"distance": 10, "times": 2}, 300);
        return;
    }

    var name = $("#nameInput").val().trim("");
    var description = $("#descriptionInput").val().trim("");

    var object = {};
    object[name] = description;

    db.collection("users").doc(currentUser.uid).collection("circles").doc("circlesReference").set(object, {merge: true})
    .then(function () {
        window.location.href = "/circle.html?" + "uid=" + currentUser.uid + "&name=" + name;
    });
}

function deleteProject(projectName) {

    var confirmation = prompt("Type the name of the project to confirm:");

    if (confirmation != projectName) return;

    db.collection("users").doc(currentUser.uid).collection("circles").doc(projectName).delete().then(function() {
        // console.log("Document successfully deleted!");
    }).catch(function(error) {
        console.error("Error removing document: ", error);
    });

    db.collection("users").doc(currentUser.uid).collection("circles").doc("circlesReference").update({
        [projectName]: firebase.firestore.FieldValue.delete()
    }).then(function() {
        $("#" + projectName.replace(/\s+/g, '')).hide("slow");
    });
}

function openProject(url) {
    window.location.href = url;
}