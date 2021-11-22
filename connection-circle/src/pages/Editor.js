import React, { useEffect, useRef, useState } from "react";
import { TransformComponent, TransformWrapper } from "react-zoom-pan-pinch";
import Circle from "../components/circle/Circle";
import Connection from "../components/circle/Connection";
import testingdata from "../testingdata";
import uniqid from "uniqid";
import ConnectionTitle from "../components/circle/ConnectionTitle";
import isUrl from "is-url";
import { Item, Menu, Separator, useContextMenu } from "react-contexify";

function useForceUpdate() {
    const [value, setValue] = useState(0); // integer state
    return () => setValue((value) => value + 1); // update the state to force render
}

function Editor(props) {
    const forceUpdate = useForceUpdate();

    const { show } = useContextMenu({
        id: "circle-menu-id",
    });
    function handleContextMenu(event) {
        if (event) {
            console.log(event);
            event.preventDefault();
            show({
                event,
                props: {
                    key: "value",
                },
            });
        }
    }

    const newCardInput = useRef();

    const data = testingdata;
    console.log(data);

    const [circleData, setCircleData] = useState([]);
    const [circleDataMap, setCircleDataMap] = useState({});
    const [connectionData, setConnectionData] = useState([]);
    const [connectionDataMap, setConnectionDataMap] = useState({});

    const [selectedConnection, setSelectedConnection] =
        useState("con-alsdjfwie");

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

            console.log("SETTING THING");
            console.log(circleDataMapTemp);
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

    return (
        <div className="editor">
            <div className="editor-canvas-wrapper">
                <TransformWrapper
                    panning={{ excluded: ["circle", "circle-text"] }}
                    maxScale={3}
                >
                    <TransformComponent
                        wrapperStyle={{ width: "100%" }}
                        contentStyle={{ width: "100%" }}
                    >
                        <div class="editor-canvas">
                            {circleData.map((circle) => (
                                <Circle
                                    data={circle}
                                    updateCircle={updateCircle}
                                    showContextMenu={handleContextMenu}
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
                            console.log(newCardInput.current.value);
                            newCardInput.current.value = "";
                        }}
                    >
                        <input
                            ref={newCardInput}
                            className="input"
                            placeholder={"Add a card..."}
                        ></input>
                    </form>
                </div>
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
                <div
                    className="card light-shadow connection-text-card"
                    onContextMenu={show}
                >
                    {connectionDataMap[selectedConnection]?.text}
                </div>
                <button
                    onClick={function () {
                        console.log(circleData);
                        console.log(circleDataMap);
                    }}
                >
                    click
                </button>
            </div>
            <Menu id={"circle-menu-id"}>
                <Item
                    onClick={function () {
                        console.log("hey");
                    }}
                >
                    Item 1
                </Item>
                <Item
                    onClick={function () {
                        console.log("hey");
                    }}
                >
                    Item 2
                </Item>
                <Separator />
                <Item disabled>Disabled</Item>
                <Separator />
            </Menu>
        </div>
    );
}

export default Editor;
