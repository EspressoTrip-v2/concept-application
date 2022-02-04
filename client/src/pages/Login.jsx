import Google from "../img/google.png";
import Facebook from "../img/facebook.png";
import Github from "../img/github.png";

const Login = () => {
    const google = () => {
        window.open("https://concept.dev/api/auth/google", "_self");
    };

    const github = () => {
        window.open("https://concept.dev/api/auth/github", "_self");
    };

    const facebook = () => {
        window.open("https://concept.dev/api/auth/facebook", "_self");
    };

    return (
        <div className="login">
            <h1 className="loginTitle">Login Method</h1>
            <div className="wrapper">
                <div className="left">
                    <button className="loginButton google" onClick={google}>
                        <img src={Google} alt="" className="icon" />
                        Google
                    </button>
                    <button className="loginButtonDisabled facebook" onClick={facebook} disabled>
                        <img src={Facebook} alt="" className="icon" />
                        Facebook
                    </button>
                    <button className="loginButton github" onClick={github}>
                        <img src={Github} alt="" className="icon" />
                        Github
                    </button>
                </div>
                <div className="center">
                    <div className="line" />
                    <div className="or">OR</div>
                </div>
                <form className="right" action='/api/auth/local' method='POST'>
                    <div className="right">
                        <input name='email' type="email" placeholder="Email" />
                        <input name={'password'} type="password" placeholder="Password" />
                        <button className="submit">Login</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;
