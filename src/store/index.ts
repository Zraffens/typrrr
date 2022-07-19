import { createStore } from 'vuex'

export default createStore({
  state: {
    userDetails: {
      id: 0,
      username: "",
      email: "",
      created: "",
      races_completed: 0,
      average_speed: 0,
      races_won: 0
  }
  },
  mutations: {
    created(state, {details}) {
      state.userDetails = details;
    }
    ,
    completeRace(state, {speed}) {
      state.userDetails.races_completed++;
      state.userDetails.average_speed = (state.userDetails.average_speed * state.userDetails.races_completed + speed) / (state.userDetails.races_completed + 1)
    }
  },
  actions: {
    createdFunc: function ({commit}, payload) {
      return commit("created", {details: payload})
    }
  },
  modules: {
  },
  getters: {
    getId: function (state) {
      console.log(state.userDetails)
      return state.userDetails.id;
    },
    getUsername: function (state) {
      return state.userDetails.username;
    },
    getRaces: function (state) {
      return state.userDetails.races_completed;
    },
    getAvgSpeed: function (state) {
      return state.userDetails.average_speed;
    },
  }
})
