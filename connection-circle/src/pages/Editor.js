import React, { useEffect, useRef, useState } from "react";
import { TransformComponent, TransformWrapper } from "react-zoom-pan-pinch";
import Circle from "../components/circle/Circle";
import Connection from "../components/circle/Connection";
import uniqid from "uniqid";
import ConnectionTitle from "../components/circle/ConnectionTitle";
import isUrl from "is-url";
import { Item, Menu, Separator, useContextMenu } from "react-contexify";
import "react-contexify/dist/ReactContexify.css";
import { CirclePicker } from "react-color";
import { useDocumentData } from "react-firebase-hooks/firestore";
import { doc, updateDoc } from "@firebase/firestore";
import { auth, firestore } from "../firebase";
import { useNavigate, useParams } from "react-router";
import Navbar from "../components/Navbar";
import { useAuthState } from "react-firebase-hooks/auth";
import { useBeforeunload } from "react-beforeunload";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { createPortal } from "react-dom";
import { set } from "react-hook-form";
import { circleColors } from "../config";
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en.json";
import Modal from "react-modal";
import isEmail from "is-email";

const fileDownload = require("js-file-download");
TimeAgo.addDefaultLocale(en);
const timeAgo = new TimeAgo("en-US");

Modal.setAppElement("#root");

//------------------------------------------

const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
};

const useDraggableInPortal = () => {
    const self = useRef({}).current;

    useEffect(() => {
        const div = document.createElement("div");
        div.style.position = "absolute";
        div.style.pointerEvents = "none";
        div.style.top = "0";
        div.style.width = "100%";
        div.style.height = "100%";
        self.elt = div;
        document.body.appendChild(div);
        return () => {
            document.body.removeChild(div);
        };
    }, [self]);

    return (render) =>
        (provided, ...args) => {
            const element = render(provided, ...args);
            if (provided.draggableProps.style.position === "fixed") {
                return createPortal(element, self.elt);
            }
            return element;
        };
};

function useForceUpdate() {
    const [value, setValue] = useState(0); // integer state
    return () => setValue((value) => value + 1); // update the state to force render
}

//------------------------------------------

function Editor(props) {
    const forceUpdate = useForceUpdate();

    const params = useParams();
    const navigate = useNavigate();
    const renderDraggable = useDraggableInPortal();

    const [allowEditing, setAllowEditing] = useState(false);
    const [user, userLoading] = useAuthState(auth);

    const [docData, loading, error] = useDocumentData(doc(firestore, `users/${params.uid}/maps/${params.mapID}`));
    const newCardInput = useRef();

    const [data, setData] = useState({});

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

    const [saved, setSaved] = useState(true);

    const [showShareModal, setShowShareModal] = useState(false);
    const shareEmailInput = useRef();

    // useEffect(
    //     function () {
    //         if (!props.data && (!params.uid || !params.mapID)) navigate("/");
    //     },
    //     [props.viewer, props.data, params.uid, params.mapID]
    // );

    useEffect(
        function () {
            if ((data?.owner != user?.uid && !data?.collaborators?.includes(user?.email)) || props.viewer) {
                setAllowEditing(false);
            } else {
                setAllowEditing(true);
            }
        },
        [props.viewer, data]
    );

    useBeforeunload((event) => {
        if (!saved && allowEditing) return "unsaved changes";
    });

    useEffect(
        function () {
            document.getElementById(selectedConnection + "-title")?.firstChild?.scrollIntoView();
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

    const { show: showConMenu } = useContextMenu({
        id: "circle-menu-id",
    });

    function handleContextMenu(event, itemType, itemID) {
        event.preventDefault();
        if (itemType == "circle") {
            setClickedCircle(itemID);
        } else if (itemType == "connection") {
            setClickedConnection(itemID);
        }
        showConMenu(event);
    }

    function onDragEnd(result) {
        // dropped outside the list
        if (!result.destination) {
            return;
        }

        const items = reorder(connectionData, result.source.index, result.destination.index);

        setConnectionData(items);
        forceUpdate();
        if (result.source.index != result.destination.index) setSaved(false);
    }

    function startConnectCircle() {
        setIsDrawingConnection(true);
        let unavailableCirclesTemp = [];
        for (let connection of connectionData) {
            if (connection.circles.includes(clickedCircle)) {
                unavailableCirclesTemp.push([...connection.circles].filter((cirID) => cirID != clickedCircle)[0]);
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

    useEffect(
        function () {
            if (props.data) {
                processInitialData(props.data);
                setData(props.data);
            } else {
                if (loading) return;
                if (error) return;
                processInitialData(docData);
                setData(docData);
            }
        },
        [props.data, docData]
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

    function switchConnectionDirection(connectionID) {
        let con = connectionDataMap[connectionID];
        if (!con) return;

        con.circles.reverse();
        forceUpdate();
        setSaved(false);
    }

    function toggleConnectionArrow(connectionID) {
        let con = connectionDataMap[connectionID];
        if (!con) return;

        con.arrow = !con.arrow;
        forceUpdate();
        setSaved(false);
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
        if (!clickedConnection) return;

        delete connectionDataMap[clickedConnection];
        setConnectionData(connectionData.filter((con) => con.id != clickedConnection));

        setClickedConnection("");
        forceUpdate();
        setSaved(false);
    }

    function saveMap() {
        let newData = {
            circles: circleData,
            connections: connectionData,
            lastEditTimestamp: new Date(),
        };
        updateDoc(doc(firestore, `users/${params.uid}/maps/${params.mapID}`), newData).then(function (result) {
            setSaved(true);
        });
    }

    function changePrivacy() {
        let newData = {
            public: !data?.public,
            lastEditTimestamp: new Date(),
        };
        updateDoc(doc(firestore, `users/${params.uid}/maps/${params.mapID}`), newData).then(function (result) {
            setSaved(true);
        });
    }

    function openShareModal() {
        setShowShareModal(true);
    }
    function closeShareModal() {
        setShowShareModal(false);
    }

    function addCollaborator() {
        let potentialEmail = shareEmailInput.current.value?.toLowerCase();
        if (isEmail(potentialEmail)) {
            shareEmailInput.current.value = "";
            let newCollaboratorArray = data.collaborators ? data.collaborators : [];
            newCollaboratorArray.push(potentialEmail);
            let newData = { ...data, collaborators: newCollaboratorArray };
            setData(newData);
            forceUpdate();
        } else {
            shareEmailInput.current.classList.add("shakeInvalid");
            setTimeout(() => {
                shareEmailInput.current.classList.remove("shakeInvalid");
            }, 500);
        }
    }

    function removeCollaborator(collaboratorEmail) {
        let newCollaboratorArray = data.collaborators ? data.collaborators : [];
        newCollaboratorArray = newCollaboratorArray.filter((email) => email !== collaboratorEmail);
        let newData = { ...data, collaborators: newCollaboratorArray };
        setData(newData);
        forceUpdate();
    }

    function saveCollaborators() {
        if (!data.collaborators) return;
        let newData = {
            collaborators: data.collaborators,
            circles: circleData,
            connections: connectionData,
            lastEditTimestamp: new Date(),
        };
        updateDoc(doc(firestore, `users/${params.uid}/maps/${params.mapID}`), newData).then(function (result) {
            setSaved(true);
        });
    }

    function downloadJSON() {
        if (!data) return;
        let toDowload = {
            ...data,
            circles: circleData,
            connections: connectionData,
        };
        toDowload = JSON.stringify(toDowload);
        fileDownload(toDowload, `${data?.name ? data?.name : "Map"}.json`);
    }

    function renderContextMenu() {
        return (
            <Menu animation={"scale"} id={"circle-menu-id"}>
                {clickedCircle && (
                    <>
                        <Item
                            onClick={function () {
                                startConnectCircle();
                            }}>
                            Connect
                        </Item>
                        <Separator />
                        <div className='color-picker-wrapper'>
                            <CirclePicker
                                colors={circleColors}
                                onChangeComplete={function (color) {
                                    let circle = circleDataMap[clickedCircle];
                                    if (!circle) return;
                                    updateCircle(circle.id, {
                                        color: color.hex,
                                    });
                                    setClickedCircle("");
                                    forceUpdate();
                                }}></CirclePicker>
                            {/* <CircleButton></CircleButton> */}
                        </div>
                        <Separator />
                    </>
                )}
                {clickedConnection && (
                    <>
                        <Item
                            onClick={function () {
                                switchConnectionDirection(clickedConnection);
                            }}>
                            Flip
                        </Item>
                        <Item
                            onClick={function () {
                                toggleConnectionArrow(clickedConnection);
                            }}>
                            {connectionDataMap[clickedConnection]?.arrow ? "Full Line" : "Arrow"}
                        </Item>
                    </>
                )}
                <Item
                    onClick={function () {
                        if (clickedCircle) {
                            deleteClickedCircle();
                        } else if (clickedConnection) {
                            deleteClickedConnection();
                        }
                    }}>
                    Delete
                </Item>
            </Menu>
        );
    }

    if (Object.keys(data).length === 0) {
        return (
            <div className='no-permission'>
                <p>Sorry, you don't have permission to view this.</p>
                {!user && (
                    <button
                        className='primary-button'
                        onClick={function () {
                            navigate("/auth");
                        }}>
                        Sign in.
                    </button>
                )}
                <button
                    onClick={function () {
                        navigate(-1);
                    }}>
                    Go back.
                </button>
            </div>
        );
    }

    return (
        <>
            {!props.data && !props.hideNav && (
                <Navbar title={data?.name}>
                    {allowEditing && (
                        <>
                            <p className='timestamp-string'>Last edited {timeAgo.format(data?.lastEditTimestamp.toDate(), "twitter-minute-now")}</p>
                            <button
                                onClick={saveMap}
                                style={{
                                    opacity: saved ? "0.5 !important" : "1 !important",
                                }}
                                disabled={saved}>
                                {saved ? "Saved" : "Save"}
                            </button>

                            <button onClick={changePrivacy}>{data?.public ? "Public" : "Private"}</button>
                            <button onClick={openShareModal}>Share</button>
                        </>
                    )}
                    <button onClick={downloadJSON}>{"Download JSON"}</button>
                </Navbar>
            )}
            <div className='editor' style={{ transform: `scale(${props.scale ? props.scale : 1})` }}>
                <div
                    className='editor-canvas-wrapper'
                    onClick={function (e) {
                        try {
                            if (clickedCircle && !e?.target?.className?.includes("circle")) {
                                exitConnectCircle();
                            }
                        } catch {}
                    }}>
                    <TransformWrapper
                        panning={{ excluded: ["circle", "circle-text"] }}
                        minScale={1}
                        initialScale={1}
                        maxScale={2}
                        initialPositionX={0}
                        initialPositionY={0}
                        onZoom={function (transform) {
                            setCurrentScale(transform.state.scale);
                        }}
                        // limitToBounds={false}
                    >
                        <TransformComponent wrapperStyle={{ width: "100%" }} contentStyle={{ width: "100%" }}>
                            <div class='editor-canvas'>
                                {circleData.map((circle, index) => (
                                    <Circle
                                        key={index.toString()}
                                        data={circle}
                                        updateCircle={updateCircle}
                                        showContextMenu={handleContextMenu}
                                        handleClick={handleCircleClick}
                                        disabled={unavailableCircles.includes(circle.id)}
                                        currentScale={currentScale}
                                    />
                                ))}
                                {connectionData.map((connection) => (
                                    <Connection
                                        data={connection}
                                        circleData={circleDataMap}
                                        selected={selectedConnection == connection.id}
                                        showContextMenu={handleContextMenu}
                                        selectConnection={selectConnection}
                                    />
                                ))}
                                {circleData?.length == 0 && <h1 className='instruction-text'>Get started by adding a circle.</h1>}
                            </div>
                        </TransformComponent>
                    </TransformWrapper>
                </div>
                {!props.data && (
                    <div className='editor-sidebar'>
                        <div className='card light-shadow add-circle-card'>
                            <form
                                onSubmit={function (e) {
                                    e.preventDefault();
                                    let type = "text";
                                    if (isUrl(newCardInput.current.value)) type = "image";
                                    addCircle(type, newCardInput.current.value);
                                    newCardInput.current.value = "";
                                }}>
                                <input ref={newCardInput} className='input' placeholder={"Add a card..."}></input>
                            </form>
                        </div>
                        {connectionData.length > 0 && (
                            <div className='card light-shadow connections-card'>
                                <DragDropContext onDragEnd={onDragEnd}>
                                    <Droppable droppableId='droppable'>
                                        {(provided, snapshot) => (
                                            <div {...provided.droppableProps} ref={provided.innerRef}>
                                                {connectionData.map((connection, index) => (
                                                    <Draggable key={connection.id} draggableId={connection.id} index={index} isDragDisabled={!allowEditing}>
                                                        {renderDraggable((provided, snapshot) => (
                                                            <div
                                                                ref={provided.innerRef}
                                                                {...provided.draggableProps}
                                                                {...provided.dragHandleProps}
                                                                className='connection-title-wrapper'
                                                                style={{
                                                                    ...provided.draggableProps.style,
                                                                }}>
                                                                <ConnectionTitle
                                                                    data={connection}
                                                                    circleData={circleDataMap}
                                                                    selected={selectedConnection == connection.id}
                                                                    selectConnection={selectConnection}
                                                                    switchConnectionDirection={switchConnectionDirection}
                                                                />
                                                            </div>
                                                        ))}
                                                    </Draggable>
                                                ))}
                                                {provided.placeholder}
                                            </div>
                                        )}
                                    </Droppable>
                                </DragDropContext>
                            </div>
                        )}
                        {selectedConnection && (
                            <div className='card light-shadow connection-text-card'>
                                <textarea
                                    disabled={!allowEditing}
                                    className='connection-text'
                                    placeholder='Type connection text here...'
                                    value={connectionTextInput}
                                    onChange={function (e) {
                                        setConnectionTextInput(e.target.value);
                                    }}
                                />
                            </div>
                        )}
                    </div>
                )}
                {createPortal(renderContextMenu(), document.body)} {/* context menu*/}
                <Modal isOpen={showShareModal} onRequestClose={closeShareModal} onAfterClose={saveCollaborators} closeTimeoutMS={300}>
                    <div className='share-modal-top'>
                        <h1>Share "{data?.name}"</h1>
                        <form
                            onSubmit={function (e) {
                                e.preventDefault();
                                addCollaborator();
                            }}>
                            <input ref={shareEmailInput} className='input' placeholder='Type an email...' />
                        </form>
                    </div>
                    <div className='share-modal-middle'>
                        {data?.collaborators?.map((email) => {
                            return (
                                <div className='share-modal-email'>
                                    <div>{email}</div>
                                    <button
                                        onClick={function () {
                                            removeCollaborator(email);
                                        }}>
                                        X
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                    <div className='share-modal-bottom'>
                        <button className='share-modal-bottom-button primary-button' onClick={closeShareModal}>
                            Close
                        </button>
                    </div>
                </Modal>
            </div>
        </>
    );
}

export default Editor;
