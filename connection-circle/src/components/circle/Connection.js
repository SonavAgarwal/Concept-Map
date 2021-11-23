import React, { useEffect, useState } from "react";
import { circleSize } from "../../config";

function Connection(props) {
    // const [x1, setX1] = useState(0);
    // const [x2, setX2] = useState(0);
    // const [y1, setY1] = useState(0);
    // const [y2, setY2] = useState(0);

    let x1 = props.circleData[props.data.circles[0]]?.x;
    let x2 = props.circleData[props.data.circles[1]]?.x;
    let y1 = props.circleData[props.data.circles[0]]?.y;
    let y2 = props.circleData[props.data.circles[1]]?.y;
    let halfCircle = convertRemToPixels(circleSize * 4);
    console.log("halfCircle");
    console.log(convertRemToPixels(circleSize));
    console.log(halfCircle);
    x1 += halfCircle;
    x2 += halfCircle;
    y1 += halfCircle;
    y2 += halfCircle;

    // useEffect(
    //     function () {
    //         let x1Temp = props.circleData[props.data.circles[0]]?.x;
    //         let x2Temp = props.circleData[props.data.circles[1]]?.x;
    //         let y1Temp = props.circleData[props.data.circles[0]]?.y;
    //         let y2Temp = props.circleData[props.data.circles[1]]?.y;

    //         setX1(x1Temp);
    //         setX2(x2Temp);
    //         setY1(y1Temp);
    //         setY2(y2Temp);
    //     }
    //     // [props.circleData, props.data]
    // );

    function convertRemToPixels(rem) {
        return (
            rem *
            parseFloat(getComputedStyle(document.documentElement).fontSize)
        );
    }

    return (
        <svg
            width={Math.abs(x1 - x2) + Math.min(x1, x2) + 50}
            height={Math.abs(y1 - y2) + Math.min(y1, y2) + 50}
            className="connection-line-svg"
            onClick={function () {
                props.selectConnection(props.data?.id);
            }}
            onContextMenu={function (e) {
                props.showContextMenu(e, "connection", props.data?.id);
            }}
        >
            <line
                className={
                    "connection-line hover-shadow " +
                    (props.selected ? "connection-line-selected" : "")
                }
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
            ></line>
        </svg>
    );
}

export default Connection;
