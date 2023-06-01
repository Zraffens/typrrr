<template>
  <div class="navbar">
    <div class="flex container parent">
      <ul class="small-links">
        <li class="enlarge"><a href="">Blog</a></li>
        <li class="enlarge"><a href="">About</a></li>
      </ul>
      <div class="align-center">
        <h1 id="brand" class="enlarge">
          <router-link :to="{ name: 'Home' }">Typrrr.com</router-link>
        </h1>
      </div>
      <div class="user-info enlarge">
        <div class="flex">
          <Suspense>
            <!-- <ProfileCard /> -->
            <template #fallback><LoadingProfile /></template>
            <template #default><ProfileCard /></template>
          </Suspense>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { VueElement } from "@vue/runtime-dom";
import { Options, Vue } from "vue-class-component";
import { mapState } from "vuex";
import axiosInstance from "../axios";
import ProfileCard from "./ProfileCard.vue";
import LoadingProfile from "./LoadingProfile.vue";

@Options({
  data() {
    return {
      loggedIn: localStorage.getItem("loggedIn") == "true" ? true : false,
    };
  },
  components: {
    ProfileCard,
    LoadingProfile,
  },
})
export default class Navbar extends Vue {}
</script>

<style>
.navbar {
  background: #222222;
  color: white;
  padding: 1em 0 1em 0;
  margin: -0.5em;
}

.flex.parent > div,
.flex.parent > ul {
  flex: 1;
  padding: 0 1em 0 1em;
}

ul {
  margin: 0 !important;
}

.small-links {
  text-align: right;
}

#brand {
  border-left: 1px solid white;
  border-right: 1px solid white;
}

.user-info {
  cursor: pointer;
}

.profile-logo {
  flex: 1;
  /* border-radius: 50%; */
  background: url(../assets/img/guest.png)!important;
  width: 100%;
  height: 55px;
}

.stats {
  flex: 3;
  padding-left: 1.2em;
}

.stats p {
  margin: 0;
}
@media screen and (max-width: 768px) {
  .profile-logo {
    height: 30px;
  }
}
</style>
