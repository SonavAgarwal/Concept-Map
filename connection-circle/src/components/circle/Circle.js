import React, { useEffect, useRef, useState } from "react";
import { Item, Menu, Separator, useContextMenu } from "react-contexify";
import Draggable from "react-draggable";
import { circleSize } from "../../config";
import LinkIcon from "../../images/Link.png";

function Circle(props) {
    const element = useRef();

    const [dragData, setDragData] = useState({});
    const [editing, setEditing] = useState(false);
    const [content, setContent] = useState(props?.data?.content);

    function getCircleContent(props2) {
        switch (props.data?.type) {
            case "text":
                return (
                    <div
                        className='circle light-shadow hover-shadow'
                        style={{
                            borderColor: `${props.data.color}`,
                            overflow: editing ? "visible" : undefined,
                        }}>
                        {getCircleText()}
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

    function getCircleText(props2) {
        if (editing) {
            return (
                <form
                    onSubmit={function (e) {
                        e.preventDefault();
                        props.updateCircle(props.data.id, {
                            content: content,
                        });
                        setEditing(false);
                    }}>
                    <input
                        autoFocus
                        key={"circle-text-form"}
                        className='circle-text'
                        style={{ padding: "calc(var(--margin) / 1)" }}
                        onBlur={function () {
                            props.updateCircle(props.data.id, {
                                content: content,
                            });
                            setEditing(false);
                        }}
                        onFocus={function (e) {
                            e.target.select();
                        }}
                        onChange={function (e) {
                            setContent(e.target.value);
                        }}
                        onClick={function (e) {
                            e.target.select();
                        }}
                        value={content}
                    />
                </form>
            );
        }
        return <div className='circle-text'>{props.data.content}</div>;
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
                    // ...props.data,
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
                    if (e.detail === 2) {
                        setEditing(true);
                    } else if (e.detail === 1) {
                        props.handleClick(e, props.data?.id);
                    }
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
