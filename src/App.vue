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
import { RouteLocationNormalized  } from 'vue-router';

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
    await axiosInstance
      .get("https://typrrr-backend.vercel.app/users/profile/")
      .then((res) => {
        for (const key in res.data) {
          localStorage.setItem(key, res.data[key]);
          userDetails[key] = res.data[key];
        }
        this.userDetails = userDetails;
        console.log('detail', userDetails);
        this.createdFunc({ details: userDetails });
        console.log('getter', this.$store.getters.getUserDetails, this.getUserInfo);
        localStorage.setItem("loggedIn", "true");
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
    ...mapGetters(['getUserInfo']),
  },
  methods: {
    ...mapActions(["createdFunc"]),
  },
  watch: {
        $route: {
            immediate: true,
            handler(to: RouteLocationNormalized , from: RouteLocationNormalized ) {
                document.title = (to.name as string) + ' ' + '| Typrrr' || 'Typrrr';
            }
        }
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
