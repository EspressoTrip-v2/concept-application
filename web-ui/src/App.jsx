import "./app.css";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import Home from "./pages/Home";
import Login from "./pages/Login";

import { useStoreRehydrated } from "easy-peasy";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Protected from "./helpers/Protected";
toast.configure();

const App = () => {
    const isRehydrated = useStoreRehydrated();

    return (
        <BrowserRouter>
            <Navbar />
            {isRehydrated ? (
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route element={<Protected />} path="/">
                        <Route path="/dashboard" element={<Dashboard />} />
                    </Route>
                </Routes>
            ) : (
                <div>Loading...</div>
            )}
        </BrowserRouter>
    );
};

export default App;
