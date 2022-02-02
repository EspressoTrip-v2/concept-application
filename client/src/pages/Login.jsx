import Google from "../img/google.png";
import Facebook from "../img/facebook.png";
import Github from "../img/github.png";

const Login = () => {
    const google = () => {
        window.open("https://concept.dev/api/user/google", "_self");
    };

    const github = () => {
        window.open("https://concept.dev/api/user/github", "_self");
    };

    const facebook = () => {
        window.open("https://concept.dev/api/user/facebook", "_self");
    };

    return (
        <div className="login">
            <div className="wrapper">
                <div className="left">
                    <div className="loginButton google" onClick={google}>
                        <img src={Google} alt="" className="icon" />
                        Google
                    </div>
                    <div className="loginButton facebook" onClick={facebook}>
                        <img src={Facebook} alt="" className="icon" />
                        Facebook
                    </div>
                    <div className="loginButton github" onClick={github}>
                        <img src={Github} alt="" className="icon" />
                        Github
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
