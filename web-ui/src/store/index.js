import { createStore, action, persist } from "easy-peasy";

const store = createStore(
    persist(
        {
            userAuthorised: null,
            user: {},
            setUserAuthorised: action((state, payload) => {
                state.userAuthorised = payload;
            }),
            loading: false,
            setLoading: action((state, payload) => {
                state.loading = payload;
            }),
            setUser: action((state, payload) => {
                state.user = payload;
            }),
        },
        {
            allow: ["userAuthorised", "user"],
        }
    )
);

export default store;
