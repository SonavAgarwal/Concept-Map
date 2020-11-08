class Connection {
    constructor (card1, card2, text, shift, number) {
        this.card1 = card1;
        this.card2 = card2;
        this.text = text;
        this.elem = document.createElement("div");
        this.connectionElement = document.createElement("p");
        this.shift = shift;
        this.number = number;
        
        //drawing connection
        this.elemId = "connection" + this.number;
        this.elem.id = this.elemId;
        $(this.elem).addClass("lineDiv");

        this.pos1 = $(card1.elem).position();
        this.pos2 = $(card2.elem).position();
        // this.pos2 = $("#card" + this.card2).position();


        this.width = Math.sqrt(Math.pow(this.pos1.left - this.pos2.left, 2) + Math.pow(this.pos1.top - this.pos2.top, 2));
        $(this.elem)
            .css('left', this.pos1.left + this.shift)
            .css('top', this.pos1.top + this.shift)
            .css('width', this.width)
            .css('transform', "rotate(" + Math.atan2(this.pos2.top - this.pos1.top, this.pos2.left - this.pos1.left) + "rad)");
        $("#mapContainer").append(this.elem);

        //writing connection
        this.connectionId = "text" + this.elemId;
        this.connectionElement.id = this.connectionId;
        $(this.connectionElement).addClass("textConnection");
        $(this.connectionElement).html(this.connectionElementText());
        $("#connectionsContainer").append(this.connectionElement);

        //select newly created connections
        $(".lineDiv").removeClass("highlighted");
        $(".textConnection").removeClass("highlightedTextConnection");
        $(this.elem).addClass("highlighted");
        $(this.connectionElement).addClass("highlightedTextConnection");
        $("#descriptionEnter").val(this.renderedDescription());
        selectedConnectionNumber = this.number;

        //listeners
        $(this.elem).click(function() {
            selectedConnectionNumber = connections[this.id.substring(10)].number;
            $(".lineDiv").removeClass("highlighted");
            $(this).addClass("highlighted");
            $(".textConnection").removeClass("highlightedTextConnection");
            $("#text" + $(this).attr('id')).addClass("highlightedTextConnection")[0].scrollIntoView();
            $("#descriptionEnter").val(connections[this.id.substring(10)].renderedDescription());
        });

        $(this.connectionElement).click(function() {
            selectedConnectionNumber = connections[this.id.substring(14)].number;
            var id = $(this).attr('id').substring(4);
            $(".lineDiv").removeClass("highlighted");
            $(".textConnection").removeClass("highlightedTextConnection");
            $(this).addClass("highlightedTextConnection")[0].scrollIntoView();
            $("#" + id).addClass("highlighted");
            $("#descriptionEnter").val(connections[this.id.substring(14)].renderedDescription());
        });
    }

    update(shift) {
        this.shift = shift;
        this.pos1 = $(this.card1.elem).position();
        this.pos2 = $(this.card2.elem).position();

        this.width = Math.sqrt(Math.pow(this.pos1.left - this.pos2.left, 2) + Math.pow(this.pos1.top - this.pos2.top, 2));

        //updating
        $(this.elem)
            .css('left', this.pos1.left + this.shift)
            .css('top', this.pos1.top + this.shift)
            .css('width', this.width)
            .css('transform', "rotate(" + Math.atan2(this.pos2.top - this.pos1.top, this.pos2.left - this.pos1.left) + "rad)");

    }

    connection() {
        if (this.card1.number > this.card2.number) {
            return [this.card2.number, this.card1.number];
        } else {
            return [this.card1.number, this.card2.number];
        }
    }

    description() {
        return this.text;
    }

    renderedDescription() {
        if (this.text == "description") return "";
        return this.text;
    }

    connectionElementText() {
        return this.card1.text + " & " + this.card2.text;
    }

    remove() {
        $(this.elem).remove();
        $(this.connectionElement).remove();
    }

    hasCardNumber(n) {
        if (n == this.card1.number || n == this.card2.number) return true;
        return false;
    }

    cardNumberOtherThan(n) {
        if (n == this.card1.number) return this.card2.number;
        if (n == this.card2.number) return this.card1.number;
        return -1;
    }

    setText(newText) {
        this.text = newText;
    }

    updateNumber(newNum) {
        this.number = newNum; 
        this.elemId = "connection" + this.number;
        this.elem.id = this.elemId;
        this.connectionId = "text" + this.elemId;
        this.connectionElement.id = this.connectionId;
    }
}

class Card {
    constructor (divisions, number, text) {
        this.divisions = divisions;

        this.angle = number * Math.PI * 2 / divisions;
        this.number = number;
        this.text = text;


        this.elem = document.createElement("div");
        this.elem.classList += " card";
        this.elem.innerHTML = this.text;
        this.elem.id = "card" + this.number;


        // var offset = -0.5 * width - 1;

        this.elem.style.top = (Math.sin(this.angle) * 0.9 * 38 + 0.9 * 50) + (-0.5 * width - 1) + "vh";
        this.elem.style.left = (Math.cos(this.angle) * 0.9 * 38 + 0.9 * 50) + (-0.5 * width - 1) + "vh";

        dragElement(this.elem);

        $("#mapContainer").append(this.elem);
    }

    update(length, number) {
        this.divisions = length;
        this.number = number;
        this.angle = this.number * Math.PI * 2 / this.divisions;

        this.elem.style.top = Math.sin(this.angle) * 0.9 * 38 + 0.9 * 50 + "vh";
        this.elem.style.left = Math.cos(this.angle) * 0.9 * 38 + 0.9 * 50 + "vh";
    }

    remove() {
        $(this.elem).remove();
    }

    getName() {
        return this.text;
    }

    updateNumber(newNum) {
        this.number = newNum;
        this.elem.id = "card" + this.number;
    }
}
