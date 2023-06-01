<template>
  <div class="flex">
    <img class="profile-logo profile-card" src="../assets/img/guest.png" alt="">
    <div class="stats" v-if="loaded">
      <p class="username">{{ username }}</p>
      <p class="races">Races: {{ races }}</p>
      <div class="avg-speed">
        Average Speed: {{ Math.round(avgspeed) }}wpm
      </div>
    </div>
    <div v-else>loading...</div>
  </div>
</template>

<script lang="ts">
import { VueElement } from "@vue/runtime-dom";
import { Options, Vue } from "vue-class-component";
import { mapState } from "vuex";
import axiosInstance from "../axios";

@Options({
  computed: {
  },
  data() {
    return {
      loggedIn: localStorage.getItem("loggedIn") == "true" ? true : false,
      loaded: false,
      races: localStorage.getItem("races_completed"),
      best: localStorage.getItem("best_speed"),
      avgspeed: localStorage.getItem("average_speed"),
      username: localStorage.getItem("username")
    };
  },
  mounted() {
    document.onreadystatechange = () => {
      if (document.readyState == "complete") {
        this.loaded = true;
      }
    };
  },

  watch: {
  },
})
export default class ProfileCard extends Vue {}
</script>

<style></style>
