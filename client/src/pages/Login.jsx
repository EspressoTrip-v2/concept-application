import Google from "../img/google.png";
import Facebook from "../img/facebook.png";
import Github from "../img/github.png";
import { useState } from "react";
import axios from "axios";

const Login = ({ setUserData }) => {
    const [signUp, setSignUp] = useState(false);
    const [input, setInput] = useState({ name: "", email: "", password: "" });

    const google = () => {
        window.open("https://concept.dev/api/auth/connect/google", "_self");
    };

    const github = () => {
        window.open("https://concept.dev/api/auth/connect/github", "_self");
    };

    const handleOnChange = e => {
        const name = e.target.name;
        const value = e.target.value;
        setInput({ ...input, [name]: value });
    };

    const onSubmit = async e => {
        e.preventDefault();
        const user = {
            name: input.name,
            email: input.email,
            password: input.password,
            type: signUp,
        };
        const result = await axios.post("/api/auth/local", user);
        if (result.data.user) setUserData(result.data);
    };

    const signUpOnClick = () => {
        if (signUp) setSignUp(false);
        if (!signUp) setSignUp(true);
    };

    return (
        <div className="login">
            <h1 className="loginTitle">Method</h1>
            <div className="wrapper">
                <div className="left">
                    <button className="loginButton google" onClick={google}>
                        <img src={Google} alt="" className="icon" />
                        Google
                    </button>
                    <button className="loginButtonDisabled facebook" disabled>
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
                <form className="right" onSubmit={onSubmit}>
                    <div className="right">
                        <input name="name" type="text" placeholder="Name" onChange={handleOnChange} />
                        <input name="email" type="email" placeholder="Email" onChange={handleOnChange} />
                        <input name={"password"} type="password" placeholder="Password" onChange={handleOnChange} />

                        {signUp ? <button className="submit">Sign Up</button> : <button className="submit">Sign In</button>}

                        <div className="checkbox">
                            <label className="signType-label">Sign Up</label>
                            <input className="signType" type="checkbox" onChange={signUpOnClick} />
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;
