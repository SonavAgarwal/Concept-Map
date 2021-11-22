import React, { useEffect, useRef, useState } from "react";
import { TransformComponent, TransformWrapper } from "react-zoom-pan-pinch";
import Circle from "../components/circle/Circle";
import Connection from "../components/circle/Connection";
import testingdata from "../testingdata";

function useForceUpdate() {
    const [value, setValue] = useState(0); // integer state
    return () => setValue((value) => value + 1); // update the state to force render
}

function Editor(props) {
    const forceUpdate = useForceUpdate();

    const newCardInput = useRef();

    const data = testingdata;
    console.log(data);

    const [circleData, setCircleData] = useState([]);
    const [circleDataMap, setCircleDataMap] = useState({});

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
                                />
                            ))}
                            {data.connections.map((connection) => (
                                <Connection
                                    data={connection}
                                    circleData={circleDataMap}
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
                    akjsdfn sdajf n
                    <button
                        onClick={function () {
                            console.log(circleData);
                        }}
                    >
                        click
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Editor;
