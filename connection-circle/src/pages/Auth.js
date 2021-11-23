import React, { useEffect } from "react";
import { signInWithRedirect, GoogleAuthProvider } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate } from "react-router";
import { useAuthState } from "react-firebase-hooks/auth";

function Auth(props) {
    const navigate = useNavigate();
    const [user, loading, error] = useAuthState(auth);

    useEffect(
        function () {
            if (user) navigate("/home");
        },
        [user]
    );

    return (
        <div>
            <button
                onClick={function () {
                    signInWithRedirect(auth, new GoogleAuthProvider()).then(
                        function (result) {
                            navigate("/home");
                        }
                    );
                }}
            >
                Sign In With Google
            </button>
        </div>
    );
}

export default Auth;
