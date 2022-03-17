import { Link } from "react-router-dom";
import axios from "axios";
import { useStoreState, useStoreActions } from "easy-peasy";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useState } from "react";

import logo from "../img/acme-pill.svg";

const Navbar = () => {
    const navigate = useNavigate();
    const userAuthorised = useStoreState(state => state.userAuthorised);
    const setUserAuthorised = useStoreActions(actions => actions.setUserAuthorised);
    const setUser = useStoreActions(actions => actions.setUser);

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
    return (
        <div className="navigation">
            <nav className="navigation_desktop">
                <div className="nav_left">
                    <Link to="/">
                        <img src={logo} className="navigation_logo" width="111px" height="55px" alt="ACME" />
                    </Link>
                </div>
                <div className="nav">
                    {userAuthorised && (
                        <button className="btn btn-dark" disabled={loading} onClick={signOut}>
                            Sign Out
                        </button>
                    )}
                </div>
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

{
}
export default Navbar;
