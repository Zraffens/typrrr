<template>
  <div class="navbar">
    <div class="flex container parent">
      <ul class="small-links">
        <li class="enlarge">
          <router-link to="/login" v-if="!loggedIn"
            ><span>Login</span></router-link
          >
          <span class="logout" v-else @click="showFloatingBox = true"
            >Logout</span
          >
        </li>
        <li class="enlarge"><router-link to="/blog">Blog</router-link></li>
        <li class="enlarge"><router-link to="/about">About</router-link></li>
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

    <!-- Floating Box -->
    <div class="floating-box-parent" v-if="showFloatingBox">
        <div class="floating-box">
          <p>Are you sure you want to logout?</p>
          <button @click="logout">Logout</button>
          <button @click="showFloatingBox = false">Cancel</button>
        </div>
      </div>
  </div>
</template>

<script lang="ts">
import { VueElement } from "@vue/runtime-dom";
import { Options, Vue } from "vue-class-component";
import { mapState } from "vuex";
import { mapActions } from "vuex";
import axiosInstance from "../axios";
import ProfileCard from "./ProfileCard.vue";
import LoadingProfile from "./LoadingProfile.vue";

@Options({
  data() {
    return {
      loggedIn: localStorage.getItem("loggedIn") == "true" ? true : false,
      showFloatingBox: false,
    };
  },
  components: {
    ProfileCard,
    LoadingProfile,
  },
  methods: {
    logout() {
      // Your logout logic
      // ...

      // Clear any user-related information stored in your frontend
      // For example, clear access token and refresh token from local storage
      localStorage.clear();
      this.showFloatingBox = false;

      // Redirect the user to the login page or any other appropriate page
      // You can use Vue Router to navigate to the desired route
      this.$router.push("/login");
      this.$store.dispatch("reset");
    },
    ...mapActions(["createdFunc"]),
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
  position: relative;
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
  background: url(../assets/img/guest.png) !important;
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
.floating-box-parent {
  position: relative;
}
.floating-box {
  position: absolute;
  background-color: #222222;
  padding: 1em;
  border: 1px solid #ccc;
  top: calc(100% + 10px); /* Position below the navbar with 10px spacing */
  left: 20%; /* Center the box horizontally */
  transform: translateX(-20%); /* Adjust for center alignment */
  z-index: 999;
}
.floating-box button {
  margin: 0 1em;
}
@media screen and (max-width: 768px) {
  .profile-logo {
    height: 30px;
  }
}
</style>
