import React from "react";
import ReactDOM from "react-dom";
import "./css/main.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import store from "./store";

import { StoreProvider } from "easy-peasy";

ReactDOM.render(
    <React.StrictMode>
        <StoreProvider store={store}>
            <App />
        </StoreProvider>
    </React.StrictMode>,
    document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
