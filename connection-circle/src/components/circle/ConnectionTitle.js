import React from "react";
import isUrl from "is-url";

function ConnectionTitle(props) {
    function getText() {
        let c1 = props.circleData[props.data?.circles[0]]?.content;
        let c2 = props.circleData[props.data?.circles[1]]?.content;

        if (isUrl(c1)) c1 = "Image";
        if (isUrl(c2)) c2 = "Image";

        return c1 + " & " + c2;
    }

    return (
        <div
            id={props.data?.id + "-title"}
            className={
                "connection-title " +
                (props.selected ? "connection-title-selected" : "")
            }
            onClick={function () {
                props.selectConnection(props.data?.id);
            }}
        >
            <div className="connection-title-top"></div>
            {getText()}
        </div>
    );
}

export default ConnectionTitle;
