import React from "react";
import Draggable from "react-draggable";

function Circle(props) {
    return (
        <Draggable>
            <div className="circle light-shadow"></div>
        </Draggable>
    );
}

export default Circle;
