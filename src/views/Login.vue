<template>
  <div class="align-center">
    <div v-if="registered" class="registered"><h5>Successfully registered! You can login with your credentials below</h5></div>
    <h1 class="intro">Login</h1>
    <form class="register-form" @submit="submit($event)">
      <label for="username">Username</label>
      <input type="text" v-model="username" name="username" id="username" />
      <label for="password">Password</label>
      <input type="password" v-model="password" name="password" id="password" />
      <input type="submit" value="Submit" class="btn" />
    </form>
    <router-link class="register" to="/register"><button class="btn">Not a User? Register</button></router-link>
  </div>
</template>

<script lang="ts">
import axiosInstance from "../axios";
import { HeaderProperties } from "../types";
import { defineComponent } from "vue";
import { mapActions } from "vuex";
import router from "@/router";

export default defineComponent({
  data() {
    return {
      username: "",
      password: "",
      registered: false
    };
  },
  mounted() {
    this.registered = Boolean(this.$route.query.registered);
  },
  methods: {
    submit(e: Event) {
      e.preventDefault();

      axiosInstance
        .post("/token/", {
          username: this.username,
          password: this.password,
        })
        .then((res) => {
          localStorage.setItem("access_token", res.data.access);
          localStorage.setItem("refresh_token", res.data.refresh);
          axiosInstance.defaults.headers = {
            Authorization: "JWT " + localStorage.getItem("access_token"),
          } as HeaderProperties;
          // this.createdFunc({ details: userInfo });
          console.log(res);
          router.push({name: 'Home'})
          const userDetails: any = {}
          axiosInstance
            .get("https://typrrr-backend.vercel.app/users/profile/")
            .then((res) => {
              for (const key in res.data) {
                localStorage.setItem(key, res.data[key]);
                userDetails[key] = res.data[key];
              }
              this.createdFunc({ details: userDetails });
            })
            .catch((err) => {
              // Handle error
            });
        });
    },
    ...mapActions(["createdFunc"]),
  },
});

</script>

<style>
h1 {
  margin: 0.5em auto;
}
  input[type='text'], input[type='password'], input[type='email'] {
    width: 50%;
    display: block;
    margin: 1em auto;
  }
  input {
    margin: 1em;
  }
  .register {
    color: white !important;; 
  }
  h5 {
    margin: 1em auto;
  }

</style>
