<template>
  <div class="align-center">
    <h1 class="intro">Register to keep track of your records and stats</h1>
    <form class="register-form" @submit="submit($event)">
      <label for="username">Username</label>
      <input type="text" v-model="username" name="username" id="username" />
      <label for="password">Password</label>
      <input type="password" v-model="password" name="password" id="password" />
      <input type="submit" value="Submit" class="btn" />
    </form>
  </div>
</template>

<script lang="ts">
import axiosInstance from "../axios";
import { HeaderProperties } from "../types";
import { defineComponent } from "vue";
import router from "@/router";

export default defineComponent({
  data() {
    return {
      username: "",
      password: "",
    };
  },
  methods: {
    submit(e: Event) {
      e.preventDefault();
      console.log(this.username, this.password);

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
          console.log(res);
          router.push({name: 'Home'})
        });
    },
  },
});
</script>

<style></style>
