import { signOut } from "@firebase/auth";
import React, { useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router";
import { Link } from "react-router-dom";
import { auth } from "../firebase";
import CircleLogo from "../images/CircleLogo.png";

function Navbar(props) {
    const navigate = useNavigate();
    const [user, userLoading] = useAuthState(auth);

    // useEffect(
    //     function () {
    //         if (!userLoading && !user) {
    //             navigate("/auth");
    //         }
    //     },
    //     [user, userLoading]
    // );

    return (
        <div className='navbar light-shadow'>
            <div className='navbar-logo-section'>
                <Link to='/home'>
                    <img src={CircleLogo}></img>
                </Link>
                <h1>{props.title}</h1>
            </div>
            <div className='navbar-middle-section'></div>
            <div className='navbar-button-section'>
                {props.children}
                <img src={user?.photoURL} className='navbar-pfp' />
                <button
                    onClick={function () {
                        if (user) {
                            signOut(auth);
                            navigate(0);
                        } else {
                            navigate("/auth");
                        }
                    }}>
                    {user ? "Sign Out" : "Sign In"}
                </button>
            </div>
        </div>
    );
}

export default Navbar;
