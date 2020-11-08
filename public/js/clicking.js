//drag to connect
var connectStartElement = null;
var connectEndElement = null;
var grayedCards = [];

// delete functionality
$("#contextMenu").hide();
var rightClicked;
var textConnectionRightClicked;

$("#mapContainer").bind("contextmenu", function (e) {
    e.preventDefault();

    rightClicked = e.target;

    var rc = $(rightClicked);
    if (rc.hasClass("card")) {
        $("#contextConnect").show();
    } else {
        $("#contextConnect").hide();
    }
    
    // Show contextmenu
    $("#contextMenu").toggle(100).
    css({
        top: e.pageY + "px",
        left: e.pageX + "px"
    });
});

$("#connectionsContainer").bind("contextmenu", function (e) {
    e.preventDefault();

    textConnectionRightClicked = e.target;
    $("#contextConnect").hide();
    
    // Show contextmenu
    $("#contextMenu").toggle(100).
    css({
        top: e.pageY + "px",
        left: e.pageX + "px"
    });
});

// If the document is clicked somewhere
$(document).bind("mousedown", function (e) {

    if (connectStartElement != null) {
        connectEndElement = e.target;
        if (connectEndElement.classList.contains("card")) {

            var startCardNum = parseInt(connectStartElement.id.substring(4));
            var endCardNum = parseInt(connectEndElement.id.substring(4));

            if (grayedCards.includes(endCardNum)) {
                return;
            } else {
                createConnection(startCardNum, endCardNum);
                exitConnectionCreate();
            }
        }
    } else {
        connectStartElement = null;
        connectEndElement = null;
        $(".card").fadeTo(300, 1);
        $(".lineDiv").fadeTo(300, 1);
        grayedCards.length = 0;
    }


    // If the clicked element is not the menu
    if (!$(e.target).parent().is($("#contextMenu"))) {
        rightClicked = null;
        textConnectionRightClicked = null;
        connectStartElement = null;
        $("#contextMenu").hide(100);
    }
});

function deleteRightClicked() {

    connectStartElement = null;

    if (rightClicked != null && rightClicked.classList.contains("lineDiv")) {
        for (var i = 0; i < connections.length; i++) {
            if (connections[i].elem == rightClicked) {
                connections[i].remove();
                connections.splice(i, 1);
            }
        }
    } else if (rightClicked != null && rightClicked.classList.contains("card")) {

        var cardNum = rightClicked.id.substring(4);

        for (var i = 0; i < cards.length; i++) {
            if (cards[i].elem == rightClicked) {
                cards[i].remove();
                cards.splice(i, 1);
                i--;
            }
        }

        connections = connections.filter(function(con) {
            if (con.hasCardNumber(cardNum)) {
                con.remove();
                return false;
            }
            return true;
        });
    }
    
    console.log(textConnectionRightClicked)
    if (textConnectionRightClicked != null && textConnectionRightClicked.classList.contains("textConnection")) {
        for (var i = 0; i < connections.length; i++) {
            if (connections[i].connectionElement == textConnectionRightClicked) {
                connections[i].remove();
                connections.splice(i, 1);
            }
        }
    }

    update();
    $("#contextMenu").hide(100);
}


function connectRightClicked() {
    if (rightClicked.classList.contains("card")) {
        $(rightClicked).fadeTo(300, 0.3);
        var cardNum = rightClicked.id.substring(4);
        grayedCards.push(parseInt(cardNum));
        connectStartElement = rightClicked;
        connections.forEach(con => {
            if (con.hasCardNumber(cardNum)) {
                $("#card" + con.cardNumberOtherThan(cardNum)).fadeTo(300, 0.3);
                $(con.elem).hide();
                grayedCards.push(con.cardNumberOtherThan(cardNum));
            }
        })

        if (grayedCards.length == cards.length) exitConnectionCreate();
    }

    $("#contextMenu").hide(100);
}

function exitConnectionCreate() {
    connectStartElement = null;
    connectEndElement = null;
    $(".card").fadeTo(300, 1);
    $(".lineDiv").fadeTo(300, 1);
    grayedCards.length = 0;
}

