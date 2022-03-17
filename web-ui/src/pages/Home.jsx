import { useStoreState } from "easy-peasy";
import { useNavigate } from "react-router-dom";

const Home = () => {
    const navigate = useNavigate();
    const userAuthorised = useStoreState(state => state.userAuthorised);
    return (
        <div className="home">
            <div className="home_left">
                <div className="home_left-content">
                    <h1 className="text-danger">Welcome To ACME Fast Foods</h1>
                    <hr />
                    <p>
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Optio provident odit molestias dolor, quo, cumque rerum quod deleniti ea
                        repellat beatae unde, a reprehenderit! Nobis eveniet, doloribus voluptatum ipsum consequatur dignissimos nihil aliquid, obcaecati maxime
                        nemo, totam quibusdam odio saepe accusantium reiciendis impedit necessitatibus! Assumenda sint dolorum sapiente? Reprehenderit,
                        consectetur.
                    </p>
                    <p className="my-4">
                        Lorem ipsum dolor sit amet consectetur, adipisicing elit. Omnis nesciunt blanditiis voluptatibus temporibus eaque in ratione neque
                        aspernatur unde eos?
                    </p>
                    {userAuthorised ? (
                        <button className="btn btn-danger" onClick={() => navigate("/dashboard")}>
                            Continue
                        </button>
                    ) : (
                        <button className="btn btn-danger" onClick={() => navigate("/login")}>
                            Login
                        </button>
                    )}
                </div>
            </div>
            <div className="home_right d-none d-lg-flex">
                <div className="home_right-poster"></div>
                <div className="home_right-bg"></div>
            </div>
        </div>
    );
};

export default Home;
