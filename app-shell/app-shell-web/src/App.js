import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Link,
} from "react-router-dom";

import logo from "./logo.svg";
import "./App.css";

const Division = React.lazy(() => import("division/Division"));
const Employee = React.lazy(() => import("employee/Employee"));
const EmployeeDashboard = React.lazy(() =>
  import("employee_dashboard/EmployeeDashboard")
);
const Task = React.lazy(() => import("task/Task"));

const App = () => (
  <Router>
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <nav className="App-nav">
          <Link to="/division">Division</Link>
          <Link to="/employee">Employee</Link>
          <Link to="/employee-dashboard">Employee Dashboard</Link>
          <Link to="/task">Task</Link>
        </nav>
      </header>
      <Routes>
        <Route
          path="/app-shell"
          element={<Navigate to="/division" replace />}
        />
        <Route path="/">
          <Route index element={<Navigate to="/division" replace />} />
          <Route
            path="division"
            element={
              <React.Suspense fallback="Loading Division">
                <Division />
              </React.Suspense>
            }
          />
          <Route
            path="employee"
            element={
              <React.Suspense fallback="Loading Employee">
                <Employee />
              </React.Suspense>
            }
          />
          <Route
            path="employee-dashboard"
            element={
              <React.Suspense fallback="Loading Employee Dashboard">
                <EmployeeDashboard />
              </React.Suspense>
            }
          />
          <Route
            path="task"
            element={
              <React.Suspense fallback="Loading Task">
                <Task />
              </React.Suspense>
            }
          />
        </Route>
      </Routes>
    </div>
  </Router>
);

export default App;
