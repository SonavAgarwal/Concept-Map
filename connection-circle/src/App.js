import logo from "./logo.svg";
import "./App.css";
import "./reset.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useNavigate } from "react-router";

import Home from "./pages/Home";
import Auth from "./pages/Auth";
import Editor from "./pages/Editor";
import Navbar from "./components/Navbar";

import app from "firebase/app";
import { useEffect } from "react";
import { auth } from "./firebase";
import { useAuthState } from "react-firebase-hooks/auth";

function AppWrapper() {
    return <App></App>;
}

function App(props) {
    // const [user, loading, error] = useAuthState(auth);
    // const navigate = useNavigate();
    // useEffect(
    //     function () {
    //         if (user) {
    //             // useNavigate("/home")
    //         } else {
    //             navigate("/auth");
    //         }
    //     },
    //     [user]
    // );
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/">
                    <Route index element={<Home />} />
                    <Route path="home" element={<Home />} />
                    <Route path="auth" element={<Auth />} />
                    <Route path="map/:uid/:mapID" element={<Editor />} />
                    <Route path="*" element={<RedirectHome />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

function RedirectHome() {
    const navigate = useNavigate();

    return (
        <div className="no-permission">
            <p>Error 404</p>
            <button
                onClick={function () {
                    navigate(-1);
                }}
            >
                Go Back.
            </button>
        </div>
    );
}

export default AppWrapper;
