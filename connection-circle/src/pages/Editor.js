import React, { useEffect, useRef, useState } from "react";
import { TransformComponent, TransformWrapper } from "react-zoom-pan-pinch";
import Circle from "../components/circle/Circle";
import Connection from "../components/circle/Connection";
import testingdata from "../testingdata";
import uniqid from "uniqid";
import ConnectionTitle from "../components/circle/ConnectionTitle";
import isUrl from "is-url";
import { Item, Menu, Separator, useContextMenu } from "react-contexify";
import "react-contexify/dist/ReactContexify.css";
import { CirclePicker } from "react-color";
import { getConfig } from "@testing-library/dom";

function useForceUpdate() {
    const [value, setValue] = useState(0); // integer state
    return () => setValue((value) => value + 1); // update the state to force render
}

function Editor(props) {
    const forceUpdate = useForceUpdate();

    const { show } = useContextMenu({
        id: "circle-menu-id",
    });
    function handleContextMenu(event, itemType, itemID) {
        event.preventDefault();
        if (itemType == "circle") {
            setClickedCircle(itemID);
        } else if (itemType == "connection") {
        }
        show(event);
    }

    function startConnectCircle() {
        setIsDrawingConnection(true);
        console.log("starting connections");
        let unavailableCirclesTemp = [];
        for (let connection of connectionData) {
            if (connection.circles.includes(clickedCircle)) {
                unavailableCirclesTemp.push(
                    [...connection.circles].filter(
                        (cirID) => cirID != clickedCircle
                    )[0]
                );
            }
        }
        unavailableCircles.push(clickedCircle);
        setUnavailableCircles(unavailableCirclesTemp);
    }

    function handleCircleClick(event, newClickedCircle) {
        if (clickedCircle && isDrawingConnection) {
            if (!unavailableCircles.includes(newClickedCircle)) {
                createConnection(clickedCircle, newClickedCircle);
            }
        }
    }

    function createConnection(circle1ID, circle2ID) {
        let id = "con-" + uniqid();
        let newConnectionData = {
            id: id,
            circles: [circle1ID, circle2ID],
            text: "",
        };

        setConnectionData([...connectionData, newConnectionData]);
        connectionDataMap[id] = newConnectionData;

        setSelectedConnection(id);

        exitConnectCircle();

        forceUpdate();
    }

    function exitConnectCircle() {
        setUnavailableCircles([]);
        setClickedCircle("");
        setIsDrawingConnection(false);
    }

    const newCardInput = useRef();

    const data = testingdata;

    const [circleData, setCircleData] = useState([]);
    const [circleDataMap, setCircleDataMap] = useState({});
    const [connectionData, setConnectionData] = useState([]);
    const [connectionDataMap, setConnectionDataMap] = useState({});

    const [selectedConnection, setSelectedConnection] = useState("");

    const [clickedCircle, setClickedCircle] = useState("");
    const [isDrawingConnection, setIsDrawingConnection] = useState(false);
    const [unavailableCircles, setUnavailableCircles] = useState([]);

    const [connectionTextInput, setConnectionTextInput] = useState("");

    useEffect(
        function () {
            let circleDataTemp = [];
            let circleDataMapTemp = {};
            for (let circle of data.circles) {
                let workingCopy = { ...circle };
                circleDataTemp.push(workingCopy);
                circleDataMapTemp[circle.id] = workingCopy;
            }

            setCircleData(circleDataTemp);
            setCircleDataMap(circleDataMapTemp);

            let connectionDataTemp = [];
            let connectionDataMapTemp = {};
            for (let connection of data.connections) {
                let workingCopy = { ...connection };
                connectionDataTemp.push(workingCopy);
                connectionDataMapTemp[connection.id] = workingCopy;
            }

            setConnectionData(connectionDataTemp);
            setConnectionDataMap(connectionDataMapTemp);
        },
        [testingdata]
    );

    function updateCircle(circleID, newData) {
        let targetObject = circleDataMap[circleID];
        Object.assign(targetObject, newData);
        forceUpdate();
    }

    function addCircle(type, content) {
        let id = "cir-" + uniqid();
        let newCircleData = {
            id: id,
            type: type,
            content: content,
            color: "#FFFFFF",
            x: 10,
            y: 10,
        };

        setCircleData([...circleData, newCircleData]);
        circleDataMap[id] = newCircleData;

        forceUpdate();
    }

    function selectConnection(connectionID) {
        setSelectedConnection(connectionID);
    }

    useEffect(
        function () {
            document
                .getElementById(selectedConnection + "-title")
                ?.scrollIntoView();
        },
        [selectConnection]
    );

    useEffect(
        function () {
            let connectionObject = connectionDataMap[selectedConnection];
            if (connectionObject) connectionObject.text = connectionTextInput;
            forceUpdate();
        },
        [connectionTextInput]
    );

    useEffect(
        function () {
            setConnectionTextInput(connectionDataMap[selectedConnection]?.text);
        },
        [selectedConnection]
    );

    return (
        <div className="editor">
            <div
                className="editor-canvas-wrapper"
                onClick={function (e) {
                    // exitConnectCircle();
                    try {
                        if (
                            clickedCircle &&
                            !e?.target?.className?.includes("circle")
                        ) {
                            exitConnectCircle();
                        }
                    } catch {}
                }}
            >
                <TransformWrapper
                    panning={{ excluded: ["circle", "circle-text"] }}
                    maxScale={3}
                >
                    <TransformComponent
                        wrapperStyle={{ width: "100%" }}
                        contentStyle={{ width: "100%" }}
                    >
                        <div class="editor-canvas">
                            {circleData.map((circle, index) => (
                                <Circle
                                    key={index.toString()}
                                    data={circle}
                                    updateCircle={updateCircle}
                                    showContextMenu={handleContextMenu}
                                    handleClick={handleCircleClick}
                                    disabled={unavailableCircles.includes(
                                        circle.id
                                    )}
                                />
                            ))}
                            {connectionData.map((connection) => (
                                <Connection
                                    data={connection}
                                    circleData={circleDataMap}
                                    selected={
                                        selectedConnection == connection.id
                                    }
                                    selectConnection={selectConnection}
                                />
                            ))}
                        </div>
                    </TransformComponent>
                </TransformWrapper>
            </div>
            <div className="editor-sidebar">
                <div className="card light-shadow add-circle-card">
                    <form
                        onSubmit={function (e) {
                            e.preventDefault();
                            let type = "text";
                            if (isUrl(newCardInput.current.value))
                                type = "image";
                            addCircle(type, newCardInput.current.value);
                            newCardInput.current.value = "";
                        }}
                    >
                        <input
                            ref={newCardInput}
                            className="input"
                            placeholder={"Add a card..."}
                        ></input>
                    </form>
                    {/* <button
                        onClick={function () {
                            forceUpdate();
                        }}
                    >
                        force update
                    </button>
                    <button
                        onClick={function () {
                            console.log(circleData);
                            console.log(circleDataMap);
                            console.log(connectionData);
                            console.log(connectionDataMap);
                        }}
                    >
                        print
                    </button> */}
                </div>
                {connectionData.length > 0 && (
                    <div className="card light-shadow connections-card">
                        {connectionData.map((connection) => (
                            <ConnectionTitle
                                data={connection}
                                circleData={circleDataMap}
                                selected={selectedConnection == connection.id}
                                selectConnection={selectConnection}
                            />
                        ))}
                    </div>
                )}
                {selectedConnection && (
                    <div className="card light-shadow connection-text-card">
                        <textarea
                            className="connection-text"
                            placeholder="Type connection text here..."
                            value={connectionTextInput}
                            onChange={function (e) {
                                setConnectionTextInput(e.target.value);
                            }}
                        />
                    </div>
                )}
            </div>
            <Menu animation={"scale"} id={"circle-menu-id"}>
                <Item
                    onClick={function () {
                        startConnectCircle();
                    }}
                >
                    Connect
                </Item>
                <Separator />
                <div className="color-picker-wrapper">
                    <CirclePicker
                        onChangeComplete={function (color) {
                            let circle = circleDataMap[clickedCircle];
                            if (!circle) return;
                            updateCircle(circle.id, { color: color.hex });
                            setClickedCircle("");
                            forceUpdate();
                        }}
                    ></CirclePicker>
                </div>
                <Separator />
                <Item
                    onClick={function () {
                        let circle = circleDataMap[clickedCircle];
                        let newCircles = circleData.filter(
                            (cir) => cir.id != clickedCircle
                        );

                        let newConnections = connectionData.filter((con) => {
                            if (con?.circles?.includes(clickedCircle)) {
                                delete connectionDataMap[con.id];
                                return false;
                            }
                            return true;
                        });

                        delete circleDataMap[clickedCircle];

                        setCircleData(newCircles);
                        forceUpdate();

                        setClickedCircle("");
                        setConnectionData(newConnections);
                        forceUpdate();

                        // setTimeout(() => {
                        // }, 100);
                    }}
                >
                    Delete
                </Item>
            </Menu>
        </div>
    );
}

export default Editor;
