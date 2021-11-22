import React, { useRef, useState } from "react";
import Draggable from "react-draggable";

function Circle(props) {
    const element = useRef();
    console.log(props.data);

    const [dragData, setDragData] = useState({});

    function getCircleContent() {
        switch (props.data.type) {
            case "text":
                return (
                    <div
                        ref={element}
                        className="circle light-shadow hover-shadow"
                        style={{ border: `0.3rem solid ${props.data.color}` }}
                    >
                        <div contentEditable className="circle-text">
                            {props.data.content}
                        </div>
                    </div>
                );
                break;
            case "image":
                return (
                    <div
                        ref={element}
                        className="circle light-shadow hover-shadow circle-image "
                        style={{
                            border: `0.3rem solid ${props.data.color}`,
                            backgroundImage: `url(${props.data.content})`,
                        }}
                    >
                        {/* <img
                            className="circle-image"
                            src={props.data.content}
                        ></img> */}
                    </div>
                );
        }
    }

    return (
        <Draggable
            bounds={"parent"}
            onDrag={function (mouseEvent, dragPosition) {
                console.log(dragPosition.x);
                console.log(dragPosition.y);
                setDragData(dragPosition);
                props.updateCircle(props.data.id, {
                    ...props.data,
                    x: dragPosition.x,
                    y: dragPosition.y,
                });
                // console.log(element.current);
                // console.log(element.current.style);
                // console.log(element.current.style.transform);
                // console.log(element.current.style.left);
            }}
            defaultPosition={{ x: props.data.x, y: props.data.y }}
        >
            {getCircleContent()}
        </Draggable>
    );
}

export default Circle;
