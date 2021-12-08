import React, { useEffect } from "react";
import { signInWithRedirect, GoogleAuthProvider } from "firebase/auth";
import { auth, firestore } from "../firebase";
import { useNavigate } from "react-router";
import { useAuthState } from "react-firebase-hooks/auth";
import Editor from "./Editor";
import { useDocumentData } from "react-firebase-hooks/firestore";
import { doc } from "@firebase/firestore";
import CircleLogo from "../images/CircleLogo.png";

function Auth(props) {
    const navigate = useNavigate();
    const [user, loading, error] = useAuthState(auth);
    const [docData, loadingDoc] = useDocumentData(
        doc(
            firestore,
            `users/FM8k76VLdwb3C34w2x7qOH0jk923/maps/fO7gfPWBL4kApef8Ekqe`
        )
    );

    useEffect(
        function () {
            if (!loading && user) navigate("/home");
        },
        [user]
    );

    return (
        <div style={{ display: "flex" }}>
            <div style={{ flex: 1 }}>
                <Editor hideNav={true} viewer={true} data={docData}></Editor>
            </div>
            <div style={{ width: "20rem" }}>
                <div
                    className="card light-shadow"
                    style={{
                        display: "flex",
                        alignItems: "center",
                        flexDirection: "column",
                    }}
                >
                    <img
                        style={{
                            height: "15rem",
                            paddingLeft: "2.5rem",
                            paddingRight: "2.5rem",
                            userSelect: "none",
                        }}
                        src={CircleLogo}
                    />
                    <h1
                        style={{
                            textAlign: "center",
                            marginBottom: "1rem",
                            marginTop: "1rem",
                            userSelect: "none",
                        }}
                    >
                        Connection Circle
                    </h1>
                    <button
                        onClick={function () {
                            signInWithRedirect(
                                auth,
                                new GoogleAuthProvider()
                            ).then(function (result) {
                                navigate("/home");
                            });
                        }}
                    >
                        Sign In With Google
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Auth;
