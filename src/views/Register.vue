<template>
  <div class="align-center">
    <h1 class="intro">Register to keep track of your records and stats</h1>
    <form class="register-form" @submit="submit($event)">
      <label for="username">Username</label>
      <input
        type="text"
        v-model="username"
        @change="usernameChange"
        name="username"
        id="username"
      />
      <label for="email">Email</label>
      <input type="email" v-model="email" name="email" id="email" />
      <label for="password">New Password</label>
      <input type="password" v-model="password" name="password" id="password" />
      <label for="verify">Verify Password</label>
      <input type="password" v-model="verify" name="verify" id="verify" />
      <input type="submit" value="Submit" class="btn" />
    </form>
  </div>
</template>

<script lang="ts">
import axiosInstance from "axios";
import { Options, Vue } from "vue-class-component";
import { User } from "../types";

@Options({
  components: {},
  data() {
    return {
      username: "",
      email: "",
      password: "",
      verify: "",
    };
  },
  methods: {
    async usernameChange() {
      await axiosInstance.get("http://localhost:8000/users/").then((res) => {
        res.data.forEach((i: User) => {
          if (i.username == this.username) {
            console.log("Username already exists");
          }
        });
      });
    },
    async submit(e: Event) {
      e.preventDefault();
      await axiosInstance
        .post("http://localhost:8000/users/register/", {
          username: this.username,
          email: this.email,
          password: this.password,
        })
        .then(function (response) {
          console.log(response);
        })
        .catch(function (error) {
          console.log(error);
        });
    },
  },
})
export default class Register extends Vue {}
</script>

<style scoped>
.home {
  margin-top: 2em;
}

h1 {
  margin: 1em;
}

.button {
  font-size: 2.5em;
  padding: 0.5em 2em;
  height: auto;
}

.button:hover {
  background: #0fa0ce;
}
</style>
