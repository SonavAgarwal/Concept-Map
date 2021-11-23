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
import { useDocumentData } from "react-firebase-hooks/firestore";

import { getConfig } from "@testing-library/dom";
import { doc, updateDoc } from "@firebase/firestore";
import { auth, firestore } from "../firebase";
import { useParams } from "react-router";
import Navbar from "../components/Navbar";
import { useAuthState } from "react-firebase-hooks/auth";

function useForceUpdate() {
    const [value, setValue] = useState(0); // integer state
    return () => setValue((value) => value + 1); // update the state to force render
}

function Editor(props) {
    const forceUpdate = useForceUpdate();

    const params = useParams();
    const [user, userLoading] = useAuthState(auth);
    const [data, loading, error] = useDocumentData(
        doc(firestore, `users/${params.uid}/maps/${params.mapID}`)
    );

    console.log(error);

    const [saved, setSaved] = useState(true);

    console.log(data);

    const { show } = useContextMenu({
        id: "circle-menu-id",
    });
    function handleContextMenu(event, itemType, itemID) {
        event.preventDefault();
        if (itemType == "circle") {
            setClickedCircle(itemID);
        } else if (itemType == "connection") {
            setClickedConnection(itemID);
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
        unavailableCirclesTemp.push(clickedCircle);
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
        setSaved(false);
    }

    function exitConnectCircle() {
        setUnavailableCircles([]);
        setClickedCircle("");
        setIsDrawingConnection(false);
    }

    const newCardInput = useRef();

    const [circleData, setCircleData] = useState([]);
    const [circleDataMap, setCircleDataMap] = useState({});
    const [connectionData, setConnectionData] = useState([]);
    const [connectionDataMap, setConnectionDataMap] = useState({});

    const [selectedConnection, setSelectedConnection] = useState("");

    const [clickedConnection, setClickedConnection] = useState("");
    const [clickedCircle, setClickedCircle] = useState("");
    const [isDrawingConnection, setIsDrawingConnection] = useState(false);
    const [unavailableCircles, setUnavailableCircles] = useState([]);

    const [connectionTextInput, setConnectionTextInput] = useState("");

    const [currentScale, setCurrentScale] = useState(1);

    useEffect(
        function () {
            if (loading) return;
            if (error) return;
            processInitialData(data);
            // if (props.data) {
            //     processInitialData(props.data);
            // } else {
            // }
        },
        [data]
    );

    function processInitialData(dataToUse) {
        let circleDataTemp = [];
        let circleDataMapTemp = {};
        for (let circle of dataToUse.circles) {
            let workingCopy = { ...circle };
            circleDataTemp.push(workingCopy);
            circleDataMapTemp[circle.id] = workingCopy;
        }

        setCircleData(circleDataTemp);
        setCircleDataMap(circleDataMapTemp);

        let connectionDataTemp = [];
        let connectionDataMapTemp = {};
        for (let connection of dataToUse.connections) {
            let workingCopy = { ...connection };
            connectionDataTemp.push(workingCopy);
            connectionDataMapTemp[connection.id] = workingCopy;
        }

        setConnectionData(connectionDataTemp);
        setConnectionDataMap(connectionDataMapTemp);
    }

    function updateCircle(circleID, newData) {
        let targetObject = circleDataMap[circleID];
        Object.assign(targetObject, newData);
        forceUpdate();

        setSaved(false);
    }

    function addCircle(type, content) {
        let id = "cir-" + uniqid();
        let newCircleData = {
            id: id,
            type: type,
            content: content,
            color: "#FFFFFF",
            x: 50,
            y: 50,
        };

        setCircleData([...circleData, newCircleData]);
        circleDataMap[id] = newCircleData;

        forceUpdate();
        setSaved(false);
    }

    function selectConnection(connectionID) {
        setSelectedConnection(connectionID);
    }

    useEffect(
        function () {
            document
                .getElementById(selectedConnection + "-title")
                ?.firstChild?.scrollIntoView();
        },
        [selectConnection]
    );

    useEffect(
        function () {
            let connectionObject = connectionDataMap[selectedConnection];
            if (connectionObject) {
                connectionObject.text = connectionTextInput;
                setSaved(false);
            }
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

    function deleteClickedCircle() {
        if (!clickedCircle) return;
        let circle = circleDataMap[clickedCircle];
        let newCircles = circleData.filter((cir) => cir.id != clickedCircle);

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
        setSaved(false);
    }

    function deleteClickedConnection() {
        console.log("deleting");
        if (!clickedConnection) return;

        console.log("deleting connectino");

        delete connectionDataMap[clickedConnection];
        setConnectionData(
            connectionData.filter((con) => con.id != clickedConnection)
        );

        setClickedConnection("");
        forceUpdate();
        setSaved(false);
    }

    function saveMap() {
        let newData = {
            circles: circleData,
            connections: connectionData,
        };
        updateDoc(
            doc(firestore, `users/${user.uid}/maps/${params.mapID}`),
            newData
        ).then(function (result) {
            setSaved(true);
        });
    }
    if (error && !props.data) {
        return (
            <div className="no-permission">
                <p>no permission sorry</p>
            </div>
        );
    }

    return (
        <>
            {!props.data && (
                <Navbar>
                    <button
                        onClick={saveMap}
                        style={{
                            opacity: saved ? "0.5 !important" : "1 !important",
                        }}
                        disabled={saved}
                    >
                        {saved ? "Saved" : "Save"}
                    </button>
                </Navbar>
            )}
            <div
                className="editor"
                style={{ transform: `scale(${props.scale ? props.scale : 1})` }}
            >
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
                        // try {
                        //     if (
                        //         clickedConnection &&
                        //         !e?.target?.className?.includes("connection")
                        //     ) {
                        //         exitConnectCircle();
                        //     }
                        // } catch {}
                    }}
                >
                    <TransformWrapper
                        panning={{ excluded: ["circle", "circle-text"] }}
                        minScale={1}
                        initialScale={1}
                        maxScale={1}
                        initialPositionX={0}
                        initialPositionY={0}
                        onZoom={function (transform) {
                            console.log(transform.state.scale);
                            setCurrentScale(transform.state.scale);
                        }}
                        // limitToBounds={false}
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
                                        currentScale={currentScale}
                                    />
                                ))}
                                {connectionData.map((connection) => (
                                    <Connection
                                        data={connection}
                                        circleData={circleDataMap}
                                        selected={
                                            selectedConnection == connection.id
                                        }
                                        showContextMenu={handleContextMenu}
                                        selectConnection={selectConnection}
                                    />
                                ))}
                            </div>
                        </TransformComponent>
                    </TransformWrapper>
                </div>
                {!props.data && (
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
                                        selected={
                                            selectedConnection == connection.id
                                        }
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
                )}
                <Menu animation={"scale"} id={"circle-menu-id"}>
                    {clickedCircle && (
                        <>
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
                                        let circle =
                                            circleDataMap[clickedCircle];
                                        if (!circle) return;
                                        updateCircle(circle.id, {
                                            color: color.hex,
                                        });
                                        setClickedCircle("");
                                        forceUpdate();
                                    }}
                                ></CirclePicker>
                            </div>
                            <Separator />
                        </>
                    )}
                    <Item
                        onClick={function () {
                            if (clickedCircle) {
                                deleteClickedCircle();
                            } else if (clickedConnection) {
                                deleteClickedConnection();
                            }
                        }}
                    >
                        Delete
                    </Item>
                </Menu>
            </div>
        </>
    );
}

export default Editor;
