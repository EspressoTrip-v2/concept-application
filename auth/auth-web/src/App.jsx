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
            const result = await axios.get("https://acmefast.dev/api/auth/login-success");
            console.log(result);
            if (result.data.session) setUserData(result.data);
        };
        getUser();
    }, []);

    return (
        <BrowserRouter>
            <div>
                <Navbar userData={userData} setUserData={setUserData} />
                <Routes>
                    <Route path="/" element={userData.session ? <Home session={userData.session} /> : <Navigate to="/login" />} />
                    <Route path="/login" element={userData.session ? <Navigate to="/" /> : <Login  />} />
                </Routes>
            </div>
        </BrowserRouter>
    );
};

export default App;
