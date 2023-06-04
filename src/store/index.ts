import { createStore } from "vuex";

export default createStore({
  state: {
    userInfo: {
      id: 0,
      username: "",
      email: "",
      created: "",
      races_completed: 0,
      average_speed: 0,
      races_won: 0,
      best_speed: 0
    },
  },
  mutations: {
    created(state, { details }) {
      state.userInfo = details.details;
    },
    completeRace(state, { typingSpeed }) {
      console.log("store", typingSpeed);
      state.userInfo.average_speed =
        (state.userInfo.average_speed * state.userInfo.races_completed +
          typingSpeed) /
        (state.userInfo.races_completed+1);
    },
    reset(state) {
      state.userInfo = {
        id: 0,
        username: "",
        email: "",
        created: "",
        races_completed: 0,
        average_speed: 0,
        races_won: 0,
        best_speed: 0
      };
    },
  },
  actions: {
    createdFunc: function ({ commit }, payload) {
      return commit("created", { details: payload });
    },
    completeRace: function ({ commit }, payload) {
      console.log("actions", payload);
      return commit("completeRace", { typingSpeed: payload });
    },
    reset: function ({ commit }) {
      return commit("reset");
    },
  },
  modules: {},
  getters: {
    getId: function (state) {
      console.log(state.userInfo);
      return state.userInfo.id;
    },
    getUsername: function (state) {
      return state.userInfo.username;
    },
    getRaces: function (state) {
      return +state.userInfo.races_completed;
    },
    getAvgSpeed: function (state) {
      return state.userInfo.average_speed;
    },
    getUserInfo: function (state) {
      return state.userInfo;
    },
  },
});
