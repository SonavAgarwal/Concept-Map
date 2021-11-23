import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import Editor from "../pages/Editor";
import MapViewer from "./circle/MapViewer";

function MapCard(props) {
    const { innerWidth: width, innerHeight: height } = window;
    const [viewerScale, setViewerScale] = useState(1);
    const viewerDiv = useRef();
    useEffect(
        function () {
            console.log(viewerDiv.current.offsetWidth);

            setViewerScale(
                Math.max(
                    viewerDiv.current.offsetWidth / width,
                    viewerDiv.current.offsetHeight / height
                )
            );
        },
        [viewerDiv]
    );
    return (
        <div className="card map-card light-shadow">
            <div style={{ flex: 1 }}>
                <h1 className="map-card-name">{props.data?.name}</h1>
                <p className="map-card-description">
                    {props.data?.description}
                </p>
                <Link
                    className="primary-button link-button light-shadow"
                    to={`/map/${props.uid}/${props.data?.mapID}`}
                >
                    Open
                </Link>
            </div>
            <div
                style={{
                    flex: 1,
                    overflow: "hidden",
                    maxHeight: "10rem",
                    // display: "flex",
                    // justifyContent: "center",
                    // alignItems: "center",
                }}
                ref={viewerDiv}
            >
                <MapViewer scale={viewerScale} data={props.data}></MapViewer>
            </div>
        </div>
    );
}

function getWindowDimensions() {
    const { innerWidth: width, innerHeight: height } = window;
    return {
        width,
        height,
    };
}

function useWindowDimensions() {
    const [windowDimensions, setWindowDimensions] = useState(
        getWindowDimensions()
    );

    useEffect(() => {
        function handleResize() {
            setWindowDimensions(getWindowDimensions());
        }

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return windowDimensions;
}

export default MapCard;
