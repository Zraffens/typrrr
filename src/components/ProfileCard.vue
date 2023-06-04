<template>
  <div class="flex">
    <img class="profile-logo profile-card" src="../assets/img/guest.png" alt="">
    <div class="stats" v-if="loaded">
      <p class="username">{{ userInfo.username || "Guest" }}</p>
      <p class="races">Races: {{ userInfo.races_completed }}</p>
      <div class="avg-speed">
        Average Speed: {{ Math.round(userInfo.average_speed) }}wpm
      </div>
    </div>
    <div v-else>loading...</div>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import { mapGetters } from 'vuex';
import axiosInstance from "../axios";

@Options({
  computed: {
    ...mapGetters(['getUserInfo']),
    userInfo() {
      console.log('userinfo', this.getUserInfo)
      return this.getUserInfo;
    }
  },
  data() {
    return {
      loggedIn: localStorage.getItem("loggedIn") == "true" ? true : false,
      loaded: false,
    };
  },
  mounted() {
    document.onreadystatechange = () => {
      if (document.readyState == "complete") {
        this.loaded = true;
      }
    };
  },
})
export default class ProfileCard extends Vue {}
</script>
