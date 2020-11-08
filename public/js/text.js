$("#descriptionEnter").on('input',function(e){
    connections[selectedConnectionNumber].setText($(this).val());
    $("#saveButton").html("Save");
});

// from stack overflow
function downloadConnections() {
    var text = circleName + " Connections:\n";
    for (var i = 0; i < connections.length; i++) {
        text += connections[i].connectionElementText() + ": ";
        text += connections[i].description() + "\n";
    }

    var downloadElement = document.createElement('a');
    downloadElement.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    downloadElement.setAttribute('download', circleName);

    downloadElement.style.display = 'none';
    document.body.appendChild(downloadElement);

    downloadElement.click();

    document.body.removeChild(downloadElement);
}