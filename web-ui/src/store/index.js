import { createStore, action } from 'easy-peasy';

const store = createStore({
  userSessionCookie: null,
  updateUserSessionCookie: action((state, payload) => {
    state.userSessionCookie = payload;
  }),
});

export default store;
