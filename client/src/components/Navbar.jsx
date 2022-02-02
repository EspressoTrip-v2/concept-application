import { Link } from "react-router-dom";

const Navbar = ({ user }) => {
    return (
        <div className="navbar">
            <span className="logo">
                <Link className="link" to="/">
                    Microservice Authentication
                </Link>
            </span>
            {user ? (
                <Link className="link" to="/">
                    Sign Out
                </Link>
            ) : (
                <Link className="link" to="login">
                    Sign In
                </Link>
            )}
        </div>
    );
};

export default Navbar;
