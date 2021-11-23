import React, { useEffect, useRef, useState } from "react";
import { Item, Menu, Separator, useContextMenu } from "react-contexify";
import Draggable from "react-draggable";
import { circleSize } from "../../config";

const tempLinkIcon =
    'url("data:image/svg+xml;base64,PHN2ZyBoZWlnaHQ9JzMwMHB4JyB3aWR0aD0nMzAwcHgnICBmaWxsPSIjMDAwMDAwIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB2ZXJzaW9uPSIxLjEiIHg9IjBweCIgeT0iMHB4IiB2aWV3Qm94PSIwIDAgMTAyNCAxMDI0IiBzdHlsZT0iZW5hYmxlLWJhY2tncm91bmQ6bmV3IDAgMCAxMDI0IDEwMjQ7IiB4bWw6c3BhY2U9InByZXNlcnZlIj48Zz48Zz48Zz48cGF0aCBkPSJNODY5LjUsNTI3LjRjMCwyNy43LDAsNTUuMywwLDgzYzAsNDEuOCwwLDgzLjYsMCwxMjUuNGMwLDEzLjksMC40LDI3LjgtMS40LDQxLjZjMC41LTMuNSwxLTcuMSwxLjQtMTAuNiAgICAgYy0xLjksMTMuNC01LjQsMjYuMy0xMC42LDM4LjhjMS4zLTMuMiwyLjctNi40LDQtOS42Yy01LjIsMTIuMS0xMS44LDIzLjUtMTkuOCwzMy45YzIuMS0yLjcsNC4yLTUuNCw2LjMtOC4xICAgICBjLTgsMTAuMy0xNy4zLDE5LjYtMjcuNiwyNy42YzIuNy0yLjEsNS40LTQuMiw4LjEtNi4zYy0xMC41LDgtMjEuOCwxNC43LTMzLjksMTkuOGMzLjItMS4zLDYuNC0yLjcsOS42LTQgICAgIGMtMTIuNCw1LjItMjUuNCw4LjctMzguOCwxMC42YzMuNS0wLjUsNy4xLTEsMTAuNi0xLjRjLTIwLjksMi43LTQyLjcsMS40LTYzLjcsMS40Yy0zOS45LDAtNzkuNywwLTExOS42LDAgICAgIGMtNDguOSwwLTk3LjksMC0xNDYuOCwwYy00MS43LDAtODMuNSwwLTEyNS4yLDBjLTE4LjIsMC0zNi40LDAuMS01NC41LDBjLTcsMC0xMy45LTAuNS0yMC44LTEuNGMzLjUsMC41LDcuMSwxLDEwLjYsMS40ICAgICBjLTEzLjQtMS45LTI2LjMtNS40LTM4LjgtMTAuNmMzLjIsMS4zLDYuNCwyLjcsOS42LDRjLTEyLjEtNS4yLTIzLjUtMTEuOC0zMy45LTE5LjhjMi43LDIuMSw1LjQsNC4yLDguMSw2LjMgICAgIGMtMTAuMy04LTE5LjYtMTcuMy0yNy42LTI3LjZjMi4xLDIuNyw0LjIsNS40LDYuMyw4LjFjLTgtMTAuNS0xNC43LTIxLjgtMTkuOC0zMy45YzEuMywzLjIsMi43LDYuNCw0LDkuNiAgICAgYy01LjItMTIuNC04LjctMjUuNC0xMC42LTM4LjhjMC41LDMuNSwxLDcuMSwxLjQsMTAuNmMtMi43LTIwLjktMS40LTQyLjctMS40LTYzLjdjMC0zOS45LDAtNzkuNywwLTExOS42YzAtNDguOSwwLTk3LjksMC0xNDYuOCAgICAgYzAtNDEuNywwLTgzLjUsMC0xMjUuMmMwLTE4LjItMC4xLTM2LjQsMC01NC41YzAtNywwLjUtMTMuOSwxLjQtMjAuOGMtMC41LDMuNS0xLDcuMS0xLjQsMTAuNmMxLjktMTMuNCw1LjQtMjYuMywxMC42LTM4LjggICAgIGMtMS4zLDMuMi0yLjcsNi40LTQsOS42YzUuMi0xMi4xLDExLjgtMjMuNSwxOS44LTMzLjljLTIuMSwyLjctNC4yLDUuNC02LjMsOC4xYzgtMTAuMywxNy4zLTE5LjYsMjcuNi0yNy42ICAgICBjLTIuNywyLjEtNS40LDQuMi04LjEsNi4zYzEwLjUtOCwyMS44LTE0LjcsMzMuOS0xOS44Yy0zLjIsMS4zLTYuNCwyLjctOS42LDRjMTIuNC01LjIsMjUuNC04LjcsMzguOC0xMC42ICAgICBjLTMuNSwwLjUtNy4xLDEtMTAuNiwxLjRjMTIuMS0xLjYsMjQuMy0xLjQsMzYuNS0xLjRjMTcuNywwLDM1LjQsMCw1My4xLDBjNDMuMiwwLDg2LjUsMCwxMjkuNywwYzEwLjIsMCwyMC41LDAsMzAuNywwICAgICBjMjAuOSwwLDQxLTE4LjQsNDAtNDBjLTEtMjEuNy0xNy42LTQwLTQwLTQwYy0yNS4zLDAtNTAuNiwwLTc1LjgsMGMtNDAuOSwwLTgxLjgsMC0xMjIuNywwYy05LjksMC0xOS45LDAtMjkuOCwwICAgICBjLTMxLDAtNjAuNyw3LjQtODguNCwyMUMxMTUuNiwxMjcuMSw3NC44LDE5Ni4zLDc0LjUsMjY3LjRjLTAuMSwxNCwwLDI4LDAsNDIuMWMwLDM0LjQsMCw2OC44LDAsMTAzLjJjMCw0My4zLDAsODYuNSwwLDEyOS44ICAgICBjMCw0MC42LDAsODEuMiwwLDEyMS44YzAsMjYuNCwwLDUyLjksMCw3OS4zYzAsNC4zLDAsOC42LDAsMTNjMC4xLDMzLjYsOC45LDY3LjEsMjUuNyw5Ni4zYzM0LjEsNTkuNCw5OS4xLDk2LjQsMTY3LjQsOTYuNyAgICAgYzE1LjUsMC4xLDMxLDAsNDYuNSwwYzM1LjIsMCw3MC40LDAsMTA1LjYsMGM0My40LDAsODYuOCwwLDEzMC4yLDBjNDAuMSwwLDgwLjIsMCwxMjAuMywwYzI1LjMsMCw1MC42LDAsNzUuOSwwICAgICBjNC40LDAsOC45LDAuMSwxMy4zLDBjMzUuNy0wLjcsNzItMTEsMTAxLjgtMzAuOGMyOS0xOS4yLDU0LTQ1LjgsNjguNy03Ny41YzEyLjYtMjcuMiwxOS42LTU1LjcsMTkuNi04NS44YzAtMjkuNywwLTU5LjMsMC04OSAgICAgYzAtMzkuNCwwLTc4LjcsMC0xMTguMWMwLTcsMC0xMy45LDAtMjAuOWMwLTIwLjktMTguNC00MS00MC00MEM4ODcuOCw0ODguNCw4NjkuNSw1MDUsODY5LjUsNTI3LjRMODY5LjUsNTI3LjR6Ij48L3BhdGg+PC9nPjwvZz48Zz48Zz48cGF0aCBkPSJNNjg3LjUsMTU0LjVjMjUsMCw1MC4xLDAsNzUuMSwwYzM5LjksMCw3OS43LDAsMTE5LjYsMGM5LjEsMCwxOC4yLDAsMjcuMywwYzIwLjksMCw0MS0xOC40LDQwLTQwICAgICBjLTEtMjEuNy0xNy42LTQwLTQwLTQwYy0yNSwwLTUwLjEsMC03NS4xLDBjLTM5LjksMC03OS43LDAtMTE5LjYsMGMtOS4xLDAtMTguMiwwLTI3LjMsMGMtMjAuOSwwLTQxLDE4LjQtNDAsNDAgICAgIEM2NDguNSwxMzYuMiw2NjUuMSwxNTQuNSw2ODcuNSwxNTQuNUw2ODcuNSwxNTQuNXoiPjwvcGF0aD48L2c+PC9nPjxnPjxnPjxwYXRoIGQ9Ik05NDkuNSwzMzYuNWMwLTI1LDAtNTAuMSwwLTc1LjFjMC0zOS45LDAtNzkuNywwLTExOS42YzAtOS4xLDAtMTguMiwwLTI3LjNjMC0yMC45LTE4LjQtNDEtNDAtNDAgICAgIGMtMjEuNywxLTQwLDE3LjYtNDAsNDBjMCwyNSwwLDUwLjEsMCw3NS4xYzAsMzkuOSwwLDc5LjcsMCwxMTkuNmMwLDkuMSwwLDE4LjIsMCwyNy4zYzAsMjAuOSwxOC40LDQxLDQwLDQwICAgICBDOTMxLjIsMzc1LjUsOTQ5LjUsMzU4LjksOTQ5LjUsMzM2LjVMOTQ5LjUsMzM2LjV6Ij48L3BhdGg+PC9nPjwvZz48Zz48Zz48cGF0aCBkPSJNNTQxLjEsNTM5LjVjMTMuMi0xMy4yLDI2LjUtMjYuNSwzOS43LTM5LjdjMzEuNS0zMS41LDYzLjEtNjMuMSw5NC42LTk0LjYgICAgIGMzOC4xLTM4LjEsNzYuMi03Ni4yLDExNC40LTExNC40YzMzLjEtMzMuMSw2Ni4xLTY2LjEsOTkuMi05OS4yYzE2LTE2LDMyLjMtMzEuOSw0OC4xLTQ4LjFjMC4yLTAuMiwwLjQtMC40LDAuNy0wLjcgICAgIGMxNC44LTE0LjgsMTUuOS00MiwwLTU2LjZjLTE2LTE0LjctNDAuOC0xNS44LTU2LjYsMGMtMTMuMiwxMy4yLTI2LjUsMjYuNS0zOS43LDM5LjdjLTMxLjUsMzEuNS02My4xLDYzLjEtOTQuNiw5NC42ICAgICBjLTM4LjEsMzguMS03Ni4yLDc2LjItMTE0LjQsMTE0LjRjLTMzLjEsMzMuMS02Ni4xLDY2LjEtOTkuMiw5OS4yYy0xNiwxNi0zMi4zLDMxLjktNDguMSw0OC4xYy0wLjIsMC4yLTAuNCwwLjQtMC43LDAuNyAgICAgYy0xNC44LDE0LjgtMTUuOSw0MiwwLDU2LjZDNTAwLjUsNTU0LjEsNTI1LjMsNTU1LjMsNTQxLjEsNTM5LjVMNTQxLjEsNTM5LjV6Ij48L3BhdGg+PC9nPjwvZz48L2c+PC9zdmc+")';

function Circle(props) {
    const element = useRef();

    const [dragData, setDragData] = useState({});

    function getCircleContent() {
        switch (props.data?.type) {
            case "text":
                return (
                    <div
                        className="circle light-shadow hover-shadow"
                        style={{
                            borderColor: `${props.data.color}`,
                        }}
                    >
                        <div className="circle-text">{props.data.content}</div>
                    </div>
                );
                break;
            case "image":
                return (
                    <div
                        className="circle light-shadow hover-shadow circle-image "
                        style={{
                            border: `0.3rem solid ${props.data.color}`,
                            backgroundImage: `url(${props.data.content}), ${tempLinkIcon}`,
                        }}
                    >
                        {/* <img
                            className="circle-image"
                            src={props.data.content}
                        ></img> */}
                        <a
                            href={props.data?.content}
                            target="_blank"
                            className={"circle-open-button no-cursor"}
                        >
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
            }}
        >
            <div
                key={props.key}
                ref={element}
                onClick={function (e) {
                    props.handleClick(e, props.data?.id);
                }}
                className="circle-wrapper"
                onContextMenuCapture={function (e) {
                    props.showContextMenu(e, "circle", props.data?.id);
                }}
                style={{ filter: props.disabled ? "brightness(70%)" : "none" }}
            >
                {getCircleContent()}
            </div>
        </Draggable>
    );
}

export default Circle;
