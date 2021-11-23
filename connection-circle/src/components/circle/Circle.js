import React, { useEffect, useRef, useState } from "react";
import { Item, Menu, Separator, useContextMenu } from "react-contexify";
import Draggable from "react-draggable";
import { circleSize } from "../../config";
import LinkIcon from "../../images/Link.png";

function Circle(props) {
    const element = useRef();

    const [dragData, setDragData] = useState({});

    function getCircleContent() {
        switch (props.data?.type) {
            case "text":
                return (
                    <div
                        className='circle light-shadow hover-shadow'
                        style={{
                            borderColor: `${props.data.color}`,
                        }}>
                        <div className='circle-text'>{props.data.content}</div>
                    </div>
                );
                break;
            case "image":
                return (
                    <div
                        className='circle light-shadow hover-shadow circle-image '
                        style={{
                            border: `0.3rem solid ${props.data.color}`,
                            backgroundImage: `url(${props.data.content}), url(${LinkIcon})`,
                        }}>
                        {/* <img
                            className="circle-image"
                            src={props.data.content}
                        ></img> */}
                        <a href={props.data?.content} target='_blank' className={"circle-open-button no-cursor"}>
                            Link
                        </a>
                    </div>
                );
                break;
            default:
                return <div></div>;
                break;
        }
    }

    useEffect(
        function () {
            setDragData({ x: props.data?.x, y: props.data?.y });
        },
        [props.data?.x, props.data?.y]
    );

    return (
        <Draggable
            key={props.key}
            bounds={"parent"}
            onDrag={function (mouseEvent, dragPosition) {
                setDragData(dragPosition);
                props.updateCircle(props.data.id, {
                    ...props.data,
                    x: dragPosition.x,
                    y: dragPosition.y,
                });
            }}
            position={{
                x: props.data?.x,
                y: props.data?.y,
            }}>
            <div
                key={props.key}
                ref={element}
                onClick={function (e) {
                    props.handleClick(e, props.data?.id);
                }}
                className='circle-wrapper'
                onContextMenuCapture={function (e) {
                    props.showContextMenu(e, "circle", props.data?.id);
                }}
                style={{ filter: props.disabled ? "brightness(70%)" : "none" }}>
                {getCircleContent()}
            </div>
        </Draggable>
    );
}

export default Circle;
