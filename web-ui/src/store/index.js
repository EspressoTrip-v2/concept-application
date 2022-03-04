import { createStore, action } from 'easy-peasy';

const store = createStore({
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
});

export default store;
