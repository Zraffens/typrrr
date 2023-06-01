<template>
  <div><Navbar /> <router-view /></div>
</template>

<script lang="ts">
import Navbar from "./components/Navbar.vue";
import { User } from "./types";
import { VueElement } from "@vue/runtime-dom";
import axiosInstance from "./axios";
import { Options, Vue } from "vue-class-component";
import { mapGetters } from "vuex";
import { mapState } from "vuex";
import { mapActions } from "vuex";

@Options({
  data() {
    return {
      userDetails: {},
      races: localStorage.getItem("races_completed"),
      avgSpeed: localStorage.getItem("average_speed"),
      best: localStorage.getItem("best")
    };
  },
  components: {
    Navbar,
  },
  async created() {
    let userDetails: any = {};
    axiosInstance
      .get("http://localhost:8000/users/profile/")
      .then((res) => {
        for (const key in res.data) {
          localStorage.setItem(key, res.data[key]);
          userDetails[key] = res.data[key];
        }
        this.userDetails = userDetails;
        console.log(userDetails);
        this.createdFunc({ details: userDetails });
        console.log("abhinav", this.userInfo);
        this.$store.dispatch("createdFunc", { userDetails });
        console.log(this.$store.getters.getUserDetails);
        localStorage.setItem("loggedIn", "true");
        localStorage.setItem("username", userDetails.username)
        localStorage.setItem("email", userDetails.email)
        localStorage.setItem("races_completed", userDetails.races_completed)
        localStorage.setItem("average_speed", userDetails.average_speed)
        localStorage.setItem("best_speed", userDetails.best_speed)
      })
      .catch((err) => {
          localStorage.setItem("username", "Guest");
          const races = localStorage.getItem("races_completed")
            ? localStorage.getItem("races_completed")
            : 0;
          const userInfo = {
            username: "Guest",
            races_completed: +this.races,
            average_speed: +this.avgSpeed,
            best: +this.best
          };
          this.createdFunc({ details: userInfo });
      });
  },
  computed: {
    ...mapState(["userInfo"]),
  },
  methods: {
    ...mapActions(["createdFunc"]),
  },
})
export default class App extends Vue {}
</script>

<style>
@import url("./assets/css/main.css");

.written {
  color: #42b983;
}

.wrong {
  color: red;
}
</style>
