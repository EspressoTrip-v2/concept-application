import { useStoreState } from "../store";
import { Outlet } from "react-router";
import Login from "../pages/Login";

const useAuth = () => {
    const userAuthorised = useStoreState(state => state.empAuthorised);
    return userAuthorised;
};

const Protected = () => {
    const isAuthorised = useAuth();

    return isAuthorised ? <Outlet /> : <Login />;
};

export default Protected;
