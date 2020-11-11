var names = ["hola", "bonjour", "ciao", "hello", "aloha", "nihao", "words", "the monroe doctrine", "hello", "aloha", "nihao", "words", "the monroe doctrine"];
var firstConnectionValues = [[1, 2], [3, 4], [1, 3], [1, 4], [1, 0], [0, 2], [0, 3], [4, 2], [0, 6], [7, 6], [4, 6], [2, 7]];
var secondConnectionValues = [];
var connectionTexts = ["message 1", "message 2", "message 3", "message 4", "message 5", "message 6", "message 7", "message 8", "message 8", "message 8", "message 8", "message 8", "message 8", "message 8", "message 8"];
var cardColors = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
const numToColor = ["white", "indianred", "lightsalmon", "moccasin", "darkseagreen", "steelblue", "plum", "pink"];
const whiteTextColors = [1, 5];

var db = firebase.firestore();
var currentUser;

var viewer = false;
var privacy = true;
var noUser = false;

$("#blocker").hide();

firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
        currentUser = firebase.auth().currentUser;
        getCircleData();
    } else {
        $("#homeButton").html("Sign Up").attr("onclick", "window.location.href = '/signin.html'");
        $("#signOutButton").hide();
        noUser = true;
        getCircleData();
    }
});

var urlParams = new URLSearchParams(window.location.search);
var uid = urlParams.get("uid");
var circleName = urlParams.get("name");

function getCircleData() {
    if (uid == null || circleName == null) {
        block();
        return;
    }
    
    if (noUser == true || currentUser.uid != uid)  {
        viewer = true;
        
        $("#newCardInput").hide();
        $("#saveButton").hide();
        $("#downloadButton").hide();
        $("#privacyButton").hide();
        $('#descriptionEnter').attr('readonly', true);

    }

    if (!viewer) {
        window.onbeforeunload = function(){
            if ($("#saveButton").html() == "Save") return 'Are you sure you want to leave? You may lose unsaved progress.';
        };
    }
    
    console.log("viewer: " + viewer);

    db.collection("users").doc(uid).collection("circles").doc(circleName).get()
    .then(function (doc) {
        if (doc.data() == undefined) {
            if (currentUser.uid != uid) {
                block();
            }
            names.length = 0;
            firstConnectionValues.length = 0;
            secondConnectionValues.length = 0;
            connectionTexts.length = 0;
            cardColors.length = 0;

            privacy = true;
        } else {
            names = doc.data().names;
            firstConnectionValues = doc.data().firstConnectionValues;
            secondConnectionValues = doc.data().secondConnectionValues;
            connectionTexts = doc.data().connectionTexts;
            
            cardColors.length = 0;
            if (doc.data().cardColors == undefined) {
                for (var i = 0; i < names.length; i++) {
                    cardColors.push(0);
                }
            } else {
                cardColors = doc.data().cardColors;
            }

            console.log(doc.data().privacy)
            privacy = doc.data().privacy;
        }
        renderPrivacy();
        setUpMap();
    }).catch(function(e) {
        console.log(e);
        block();
    });

    $("#circleTitle").html(circleName);
    
}

function block() {
    $("#saveButton").hide();
    $("#circleTitle").hide();
    $("#privacyButton").hide();
    $("#downloadButton").hide();
    $("#blocker").fadeIn(100);
}

function saveCircleData() {

    if ($("#saveButton").html() == "Saved") return;

    names.length = 0;
    firstConnectionValues.length = 0;
    secondConnectionValues.length = 0;
    connectionTexts.length = 0;
    cardColors.length = 0;
    
    cards.forEach(card => {
        names.push(card.getName());
        cardColors.push(card.colorNum);
    });

    connections.forEach(con => {
        var conCon = con.connection();
        firstConnectionValues.push(conCon[0]);
        secondConnectionValues.push(conCon[1]);        
        connectionTexts.push(con.description());
    });

    db.collection("users").doc(uid).collection("circles").doc(circleName).set({
        names: names,
        firstConnectionValues: firstConnectionValues,
        secondConnectionValues: secondConnectionValues,
        connectionTexts: connectionTexts,
        cardColors: cardColors,
        privacy: privacy
    }).then(function() {
        $("#saveButton").html("Saved");
    }).catch(function(error) {
        console.log(error);
    });
}

function togglePrivate() {
    if (privacy == true) privacy = false;
    else privacy = true;
    $("#saveButton").html("Save");
    renderPrivacy();
}

function renderPrivacy() {
    if (privacy) {
        $("#privacyImage").attr("src", "/images/privateicon.png");
    } else {
        $("#privacyImage").attr("src", "/images/publicicon.png");
    }
}
