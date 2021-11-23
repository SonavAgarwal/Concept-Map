import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useDocumentData } from "react-firebase-hooks/firestore";
import { auth, firestore } from "../../firebase";
import Circle from "./Circle";
import Connection from "./Connection";

function MapViewer(props) {
    useEffect(
        function () {
            processInitialData(props.data);
        },
        [props.data]
    );

    const [circleData, setCircleData] = useState([]);
    const [circleDataMap, setCircleDataMap] = useState({});
    const [connectionData, setConnectionData] = useState([]);
    const [connectionDataMap, setConnectionDataMap] = useState({});

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
    return (
        <div
            style={{
                transform: `scale(${props.scale ? props.scale : 1})`,
                pointerEvents: "none",
                position: "absolute",
            }}>
            {circleData.map((circle, index) => (
                <Circle key={index.toString()} data={circle} />
            ))}
            {connectionData.map((connection) => (
                <Connection data={connection} circleData={circleDataMap} />
            ))}
            <div style={{ width: "100vw", height: "100vh", position: "absolute", zIndex: 200, pointerEvents: "all" }}></div>
        </div>
    );
}

export default MapViewer;
