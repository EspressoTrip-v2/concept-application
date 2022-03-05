import { Link } from "react-router-dom";
import axios from "axios";
import { useStoreState, useStoreActions } from "easy-peasy";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useState } from "react";
const Navbar = () => {
    const navigate = useNavigate();
    const userAuthorised = useStoreState(state => state.userAuthorised);
    const setUserAuthorised = useStoreActions(actions => actions.setUserAuthorised);

    const [loading, setLoading] = useState(false);

    const signOut = async () => {
        setLoading(true);
        const logout = await axios.post("/api/auth/signout");
        if (logout.status === 200) {
            await setUserAuthorised(false);
            await navigate("/login");
        }
        if (logout.status !== 200) {
            toast.error("Error Logging Out. Please Try Again", {
                position: "top-right",
                autoClose: 2500,
                hideProgressBar: true,
                closeOnClick: false,
                pauseOnHover: false,
                draggable: false,
                progress: undefined,
            });
        }
        setLoading(false);
    };
    return (
        <div className="w-100 conatiner">
            <nav className="navbar navbar-expand-lg navbar-light bg-light d-flex justify-content-between align-items-center">
                <div className="container-fluid ">
                    <button
                        className="navbar-toggler"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#navbarSupportedContent"
                        aria-controls="navbarSupportedContent"
                        aria-expanded="false"
                        aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>

                    <div className="collapse navbar-collapse w-100" id="navbarSupportedContent">
                        <ul className="navbar-nav w-100 me-100 mb-2 mb-lg-0 d-flex justify-content-between align-items-center">
                            <li className="nav-item">
                                <Link to="/">
                                    <img src="./assets/acme-pill.svg" width="111px" height="55px" alt="Logo" />
                                </Link>
                            </li>

                            <li>
                                {userAuthorised && (
                                    <button className="btn btn-dark" disabled={loading} onClick={signOut}>
                                        Sign Out
                                    </button>
                                )}
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        </div>
    );
};

export default Navbar;
