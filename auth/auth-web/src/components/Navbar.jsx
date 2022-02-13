import { Link } from "react-router-dom";
import axios from "axios";

const Navbar = ({ userData, setUserData }) => {
    const signOut = async () => {
        await axios.post("/api/auth/signout");
        setUserData(false);
    };
    return (
        <div className="navbar">
            <span className="logo">
                <Link className="link" to="/">
                    Microservice Authentication
                </Link>
            </span>
            {userData.session && (
                <button className="link-button" onClick={signOut}>
                    Sign Out
                </button>
            )}
        </div>
    );
};

export default Navbar;
