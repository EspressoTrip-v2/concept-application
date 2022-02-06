const Home = ({ cookie }) => {
    return (
        <div className="home">
            <div className="wrapper-home">
                <div className="home-container">
                    <div className="home-internal">
                        <h3>Please copy and paste the below cookie into Postman to simulate request to the other microservices:</h3>
                        <div className="cookie">
                            <h3>session:</h3>
                            <p>{cookie}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;
