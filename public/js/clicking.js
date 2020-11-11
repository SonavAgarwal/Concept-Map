//drag to connect
var connectStartElement = null;
var connectEndElement = null;
var switchElement1 = null;
var switchElement2 = null;
var grayedCards = [];

// delete functionality
$("#contextMenu").hide();
var rightClicked;
var textConnectionRightClicked;

$("#mapContainer").bind("contextmenu", function (e) {
    if (viewer) return;
    e.preventDefault();

    rightClicked = e.target;

    var rc = $(rightClicked);
    if (rc.hasClass("card")) {
        $("#contextConnect").show();
        $("#contextSwitch").show();
        $("#contextColors").show();
    } else {
        $("#contextConnect").hide();
        $("#contextSwitch").hide();
        $("#contextColors").hide();
    }
    
    // Show contextmenu
    $("#contextMenu").toggle(100).
    css({
        top: e.pageY + "px",
        left: e.pageX + "px"
    });
});

$("#connectionsContainer").bind("contextmenu", function (e) {
    if (viewer) return;
    e.preventDefault();

    textConnectionRightClicked = e.target;
    $("#contextConnect").hide();
    $("#contextSwitch").hide();
    $("#contextColors").hide();
    
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
        exitConnectionCreate();
    }

    if (switchElement1 != null) {
        switchElement2 = e.target;
        if (switchElement2.classList.contains("card") && switchElement1 != switchElement2) {

            var startCardNum = parseInt(switchElement1.id.substring(4));
            var endCardNum = parseInt(switchElement2.id.substring(4));

            switchCardNums(startCardNum, endCardNum);
        }
        switchElement1 = null;
        switchElement2 = null;
        $(".card").fadeTo(300, 1);
    } else {
        switchElement1 = null;
        switchElement2 = null;
        $(".card").fadeTo(300, 1);
    }


    // If the clicked element is not the menu    !$(e.target).parent().is($("#contextMenu"))
    if (!$("#contextMenu").has(e.target).length) {
        rightClicked = null;
        textConnectionRightClicked = null;
        connectStartElement = null;
        $("#contextMenu").hide(100);
    }
});

function switchCardNums(cardNum1, cardNum2) {
    var temp = cards[cardNum1];
    cards[cardNum1] = cards[cardNum2];
    cards[cardNum2] = temp;

    updateNumbers();

    // connections.forEach(con => {
    //     con.replaceCard(cardNum1, cardNum2);
    //     con.replaceCard(cardNum2, cardNum1);
    // })

    update();
}

function deleteRightClicked() {

    connectStartElement = null;

    if (rightClicked != null && rightClicked.classList.contains("lineDiv")) {
        for (var i = 0; i < connections.length; i++) {
            if (connections[i].elem == rightClicked) {
                connections[i].remove();
                connections.splice(i, 1);
            }
        }

        updateNumbers();
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

        updateNumbers();
    }
    
    if (textConnectionRightClicked != null && textConnectionRightClicked.classList.contains("textConnection")) {
        for (var i = 0; i < connections.length; i++) {
            if (connections[i].connectionElement == textConnectionRightClicked) {
                connections[i].remove();
                connections.splice(i, 1);
            }
        }

        updateNumbers();
    }
    

    update();
    $("#contextMenu").hide(100);
}

function updateNumbers() {
    for (var i = 0; i < cards.length; i++) {
        cards[i].updateNumber(i);
    }

    for (var i = 0; i < connections.length; i++) {
        connections[i].updateNumber(i);
    }
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

function colorRightClicked(colorString) {

    var cardNum = rightClicked.id.substring(4);

    for (var i = 0; i < cards.length; i++) {
        if (cards[i].elem == rightClicked) {
            cards[i].setColor(colorString);
            break;
        }
    }
    
    $("#saveButton").html("Save");
    $("#contextMenu").hide(100);
}

function switchRightClicked() {
    if (rightClicked.classList.contains("card")) {
        $(rightClicked).fadeTo(300, 0.3);
        switchElement1 = rightClicked;
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

