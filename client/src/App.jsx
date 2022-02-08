import Navbar from "./components/Navbar";
import "./app.css";
import Home from "./pages/Home";
import Login from "./pages/Login";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css'
toast.configure()
const App = () => {
    const [userData, setUserData] = useState(false);

    useEffect(() => {
        const getUser = async () => {
            const result = await axios.get("/api/auth/login-success");
            if (result.data.cookie) setUserData(result.data);
        };
        getUser();
    }, []);

    return (
        <BrowserRouter>
            <div>
                <Navbar userData={userData} setUserData={setUserData} />
                <Routes>
                    <Route path="/" element={userData.cookie ? <Home cookie={userData.cookie} /> : <Navigate to="/login" />} />
                    <Route path="/login" element={userData.cookie ? <Navigate to="/" /> : <Login  />} />
                </Routes>
            </div>
        </BrowserRouter>
    );
};

export default App;
