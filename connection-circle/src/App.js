import logo from "./logo.svg";
import "./App.css";
import "./reset.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Auth from "./pages/Auth";
import Editor from "./pages/Editor";
import Navbar from "./components/Navbar";

function App() {
    return (
        <BrowserRouter>
            <Navbar />
            <Routes>
                <Route path="/">
                    <Route index element={<Home />} />
                    <Route path="auth" element={<Auth />} />
                    <Route path="circle/:circleID" element={<Editor />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
