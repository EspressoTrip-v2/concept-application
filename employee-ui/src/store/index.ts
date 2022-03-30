import { createStore, action, persist, Action, createTypedHooks } from "easy-peasy";

interface IStore {
    empAuthorised: boolean | number | null;
    employee: any;
    loading: boolean;
    setLoading: Action<IStore, boolean>;
    setUser: Action<IStore, any>;
    setEmpAuthorised: Action<IStore, boolean | number | null>;
}

const store = createStore<IStore>(
    persist(
        {
            empAuthorised: null,
            employee: {},
            setEmpAuthorised: action((state, payload) => {
                state.empAuthorised = payload;
            }),
            loading: false,
            setLoading: action((state, payload) => {
                state.loading = payload;
            }),
            setUser: action((state, payload) => {
                state.employee = payload;
            }),
        },
        {
            allow: ["empAuthorised", "employee"],
        }
    )
);

export default store;

const typedHooks = createTypedHooks<IStore>();

export const useStoreActions = typedHooks.useStoreActions;
export const useStoreDispatch = typedHooks.useStoreDispatch;
export const useStoreState = typedHooks.useStoreState;
