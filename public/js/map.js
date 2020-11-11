var cards = [];
var width = 0;
var shift = 0;
var connections = [];
var selectedConnectionNumber = -1;

function setUpMap() {

    $("#backToCircleButton").hide();

    //cards
    cards = names.map(createCardWithIndex);
    
    //connections
    for (var i = 0; i < connectionTexts.length; i++) {
        createConnectionWithDescriptionAndNumber(firstConnectionValues[i], secondConnectionValues[i], connectionTexts[i], i);
    }

    update();
}

function setWidth() {
    width = (130 / cards.length) * 0.92;
    if (width > 15) width = 15;
}

function createCardWithIndex(name, index) {
    var len = cards.length;
    var colorNum = cardColors[index];
    var newCard = new Card(len, index, name, colorNum);
    $("#saveButton").html("Save");
    return newCard;
}

function createCard(name) {
    var len = cards.length;
    var newCard = new Card(len, len, name, 0);
    cards.push(newCard);
    $("#saveButton").html("Save");
    return newCard;
}

function createConnection(startCardNum, endCardNum) {
    var index = connections.length;
    var c = new Connection(cards[startCardNum], cards[endCardNum], "description", shift, index);
    connections.push(c);
    renderDescriptionEnter();
    $("#saveButton").html("Save");
    return c;
}

function createConnectionWithDescriptionAndNumber(startCardNum, endCardNum, description, index) {
    var c = new Connection(cards[startCardNum], cards[endCardNum], description, shift, index);
    connections.push(c);
    renderDescriptionEnter();
    $("#saveButton").html("Save");
    return c;
}

function setConnectionShift() {
    shift = width * 0.01 * window.innerHeight / 2 + 10;
}

function update() {
    setWidth();

    updateCardNums();

    $(".card")
    .css('width', width + "vh")
    .css('height', width + "vh")
    .css('font-size', (width / 5.5) + "vh")
    .css('transform', "translate(" + (-0.5 * width - 1) + "vh, " + (-0.5 * width - 1) + "vh)");


    updateConnections();

    renderDescriptionEnter();
    if (cards.length > 0) $("#editorExplanation").hide();
    $("#saveButton").html("Save");
    $("#backToCircleButton").fadeOut(100);

    // console.log(cards);
    // console.log(connections);
}

function updateCardNums() {
    var i = 0;
    cards.forEach(c => {
        c.update(cards.length, i);
        i++;
    });
}

function renderDescriptionEnter() {
    if (connections.length > 0) $("#descriptionEnter").show();
    else $("#descriptionEnter").hide();
}

function updateConnections() {
    setConnectionShift();
    connections.forEach(con => {
        con.update(shift);
    });
}


//get new card creation
$("#newCardInput").on('keyup', function (e) {
    if (e.key === 'Enter') {
        var newCardName = $(this).val().trim();
        if (names.includes(newCardName)) {
            $(this).effect("shake", {"distance": 10, "times": 2}, 300);
        } else {
            createCard(newCardName);
            names.push(newCardName);
            update();
            $(this).val("");
        }
        
    }
});

//update to look good
window.addEventListener('resize', update);

// from w3 schools
function dragElement(elmnt) {
  var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
  if (document.getElementById(elmnt.id + "header")) {
    // if present, the header is where you move the DIV from:
    document.getElementById(elmnt.id + "header").onmousedown = dragMouseDown;
  } else {
    // otherwise, move the DIV from anywhere inside the DIV:
    elmnt.onmousedown = dragMouseDown;
  }

  function dragMouseDown(e) {
    e = e || window.event;
    e.preventDefault();
    // get the mouse cursor position at startup:
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;
    // call a function whenever the cursor moves:
    document.onmousemove = elementDrag;
  }

  function elementDrag(e) {
    e = e || window.event;
    e.preventDefault();
    // calculate the new cursor position:
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    // set the element's new position:
    elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
    elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";

    if (isOutOfHorizontalBounds(elmnt)) {
        elmnt.style.left = (elmnt.offsetLeft + pos1) + "px";
        $("#mapContainer").css("box-shadow", "0 0 3px rgb(243, 73, 73)");
    }

    if (isOutOfVerticalBounds(elmnt)) {
        elmnt.style.top = (elmnt.offsetTop + pos2) + "px";
        $("#mapContainer").css("box-shadow", "0 0 3px rgb(243, 73, 73)");
    }

    updateConnections();
  }

  function closeDragElement() {
    // stop moving when mouse button is released:
    document.onmouseup = null;
    document.onmousemove = null;
    $("#mapContainer").css("box-shadow", "none");
    $("#backToCircleButton").fadeIn(100);
  }
}


function isOutOfHorizontalBounds(cardElem) {
    var cardBounds = cardElem.getBoundingClientRect();
    var mapBounds = document.getElementById("mapContainer").getBoundingClientRect();

    return cardBounds.right >= mapBounds.right || cardBounds.left <= mapBounds.left;
}

function isOutOfVerticalBounds(cardElem) {
    var cardBounds = cardElem.getBoundingClientRect();
    var mapBounds = document.getElementById("mapContainer").getBoundingClientRect();

    return cardBounds.top <= mapBounds.top || cardBounds.bottom >= mapBounds.bottom;
}