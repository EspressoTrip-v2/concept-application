import { Link } from "react-router-dom";
import axios from "axios";
import { useStoreState, useStoreActions } from "easy-peasy";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { useState } from "react";

import logo from "../img/acme-pill.svg";

const Navbar = () => {
    const navigate = useNavigate();
    const userAuthorised = useStoreState(state => state.userAuthorised);
    const setUserAuthorised = useStoreActions(actions => actions.setUserAuthorised);
    const setUser = useStoreActions(actions => actions.setUser);
    const { firstName, lastName } = useStoreState(state => state.user);

    const [loading, setLoading] = useState(false);

    const signOut = async () => {
        setLoading(true);
        const logout = await axios.post("/api/auth/signout");
        if (logout.status === 200) {
            await setUserAuthorised(false);
            await setUser({});
            await navigate("/");
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

    const userInitials = () => {
        if (firstName && lastName) {
            let initals = `${firstName.charAt(0)}${lastName.charAt(0)}`;
            return initals.toUpperCase();
        }
    };

    const NAV_ITEMS = [
        {
            name: "Dashboard",
            path: "/dashboard",
        },
    ];

    let pagePath = useLocation();

    const checkCurrPath = () => {
        if (pagePath.pathname === "/dashboard") {
            return "active";
        } else {
            return "";
        }
    };

    return (
        <div className="navigation">
            <nav className="navigation_desktop">
                <Link to="/">
                    <img src={logo} className="navigation_logo" width="111px" height="55px" alt="ACME" />
                </Link>
                {userAuthorised ? (
                    <div className="navigation_right">
                        {NAV_ITEMS.map(item => (
                            <Link to={item.path}>
                                <div key={item.name} className="navigation_right-item">
                                    <span className={`${checkCurrPath()}`}>{item.name}</span>
                                </div>
                            </Link>
                        ))}
                        <Link to="#">
                            <div className="navigation_right-item">
                                <button className="btn btn-dark" disabled={loading} onClick={signOut}>
                                    Sign Out
                                </button>
                            </div>
                        </Link>
                        <Link to="/user">
                            <div className="navigation_right-item">
                                <div className="navigation_right-item--user">{userInitials()}</div>
                            </div>
                        </Link>
                    </div>
                ) : (
                    ""
                )}
            </nav>
            <nav className="navigation_mobile">
                <div className="nav_left">
                    <Link to="/">
                        <img src={logo} width="111px" height="55px" alt="ACME" />
                    </Link>
                </div>
            </nav>
        </div>
    );
};

export default Navbar;
