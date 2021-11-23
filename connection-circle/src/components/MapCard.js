import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import Editor from "../pages/Editor";
import MapViewer from "./circle/MapViewer";
import sizeof from "firestore-size";
import { deleteDoc, doc } from "@firebase/firestore";
import { firestore } from "../firebase";

function MapCard(props) {
    console.log("Size of " + props.data?.name + ": " + sizeof(props.data));

    const { innerWidth: width, innerHeight: height } = window;
    const [viewerScale, setViewerScale] = useState(1);
    const viewerDiv = useRef();
    useEffect(
        function () {
            setViewerScale(Math.max(viewerDiv.current.offsetWidth / width, viewerDiv.current.offsetHeight / height));
        },
        [viewerDiv]
    );
    return (
        <div className='card map-card light-shadow'>
            <div style={{ flex: 1 }}>
                <h1 className='map-card-name'>{props.data?.name}</h1>
                <p className='map-card-description'>{props.data?.description}</p>
                <Link className='primary-button link-button light-shadow' to={`/map/${props.uid}/${props.data?.mapID}`}>
                    Open
                </Link>
                <button
                    onClick={function () {
                        if (window.confirm("Are you sure you want to delete this map?")) {
                            deleteDoc(doc(firestore, `users/${props.data?.owner}/maps/${props.data.mapID}`));
                        }
                    }}>
                    Delete
                </button>
            </div>
            <div className='map-viewer-wrapper' ref={viewerDiv}>
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
    const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions());

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
