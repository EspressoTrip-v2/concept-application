import {  toast } from "react-toastify";

const Home = ({ session }) => {
    const copy = () => {
        navigator.clipboard.writeText(session.trim());
        toast.info("Cookie copied",
            {position: "top-right",
                autoClose: 1000,
                hideProgressBar: true,
                closeOnClick: false,
                pauseOnHover: false,
                draggable: false,
                progress: undefined,});
    };
    return (
        <div className="home">
            <div className="wrapper-home">
                <div className="home-container">
                    <div className="home-internal">
                        <h3>Please copy and paste the below cookie into Postman to simulate request to the other microservices:</h3>
                        <div className="cookie">
                            <p>{session}</p>
                        </div>
                        <button className="loginButton copy" onClick={copy}>
                            Copy Cookie
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;
