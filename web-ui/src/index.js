import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import store from "./store";
import "./css/main.css";

import { StoreProvider } from "easy-peasy";

ReactDOM.render(
    <React.StrictMode>
        <StoreProvider store={store}>
            <App />
        </StoreProvider>
    </React.StrictMode>,
    document.getElementById("root")
);
