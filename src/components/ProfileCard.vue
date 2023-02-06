<template>
  <div>
    <div class="profile-logo profile-card"></div>
    <div class="stats" v-if="loaded">
      <p class="username">{{ userInfo.details.username }}</p>
      <p class="races">Races: {{ races }}</p>
      <div class="avg-speed">
        Average Speed: {{ userInfo.details.average_speed }}wpm
      </div>
    </div>
    <div v-else>loading</div>
  </div>
</template>

<script lang="ts">
import { VueElement } from "@vue/runtime-dom";
import { Options, Vue } from "vue-class-component";
import { mapState } from "vuex";
import axiosInstance from "../axios";

@Options({
  computed: {
    userInfo() {
      return this.$store.getters.getUserInfo;
    },
    computedRaces() {
      return this.$store.getters.getRaces;
    },
  },
  data() {
    return {
      loggedIn: localStorage.getItem("loggedIn") == "true" ? true : false,
      loaded: false,
      races: 0,
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
    computedRaces() {
      this.races = this.$store.getters.getRaces;
    },
  },
})
export default class ProfileCard extends Vue {}
</script>

<style></style>
