import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import reportWebVitals from "./reportWebVitals";

const AppShell = React.lazy(() => import("app_shell/AppShell"));

ReactDOM.render(
  <React.StrictMode>
    <React.Suspense fallback="Loading app shell">
      <AppShell />
    </React.Suspense>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
