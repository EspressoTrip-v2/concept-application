import { useStoreState, useStoreActions } from "easy-peasy";
import { useEffect, useLayoutEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import getUser from "../helpers";

const Dashboard = () => {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const setUserAuthorised = useStoreActions(actions => actions.setUserAuthorised);
    const userAuthorised = useStoreState(state => state.userAuthorised);

    const setUser = useStoreActions(actions => actions.setUser);
    const user = useStoreState(state => state.user);

    const userStatus = async () => {
        const result = await getUser();
        await setUserAuthorised(result.status);
        await setUser(result.data.data);
        return result;
    };

    useLayoutEffect(() => {
        setLoading(true);
        userStatus();
        if (!userAuthorised) {
            navigate("/login");
        }
        setLoading(false);
    }, [userAuthorised]);

    useEffect(() => {
        setLoading(true);
        userStatus();
        if (!userAuthorised) {
            navigate("/login");
        }
        setLoading(false);
    }, []);

    return (
        <div className="container mt-3">
            <div className="row">Dashboard</div>
        </div>
    );
};

export default Dashboard;
