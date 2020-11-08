$("#descriptionEnter").on('input',function(e){
    console.log($(this).val());
    console.log("selected" + selectedConnectionNumber)
    console.log(connections)
    connections[selectedConnectionNumber].setText($(this).val());
    $("#saveButton").html("Save");
});

// window.setInterval(function () {
//     console.log("selected" + selectedConnectionNumber)
// }, 100);