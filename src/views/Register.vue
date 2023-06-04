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
        :class="{ 'border-red': !username && usernameFieldTouched }"
        id="username"
        @input="usernameFieldTouched = true"
      />
      <label for="email">Email</label>
      <input
        type="email"
        :class="{ 'border-red': !email && emailFieldTouched }"
        v-model="email"
        name="email"
        id="email"
        @input="emailFieldTouched = true"
      />
      <label for="password">New Password</label>
      <input
        type="password"
        v-model="password"
        name="password"
        id="password"
        :class="{
          'border-red':
            (!password || password.length < 8) && passwordFieldTouched,
        }"
        @input="passwordFieldTouched = true"
      />
      <label for="verify">Verify Password</label>
      <input
        type="password"
        v-model="verify"
        name="verify"
        id="verify"
        :class="{ 'border-red': !passwordsMatch }"
      />
      <div v-if="!username && usernameFieldTouched" class="error-message">
        Username is required.
      </div>
      <div v-if="usernameExists" class="error-message">
        Username already exists.
      </div>
      <div v-if="!email && emailFieldTouched" class="error-message">
        Email is required.
      </div>
      <div v-if="!passwordsMatch" class="error-message">
        Passwords do not match.
      </div>
      <div
        v-if="(!password || password.length < 8) && passwordFieldTouched"
        class="error-message"
      >
        Password must be at least 8 characters long.
      </div>
      <input
        type="submit"
        value="Submit"
        class="btn"
      />
    </form>
  </div>
</template>

<script lang="ts">
import axiosInstance from "axios";
import { Options, Vue } from "vue-class-component";
import { User } from "../types";
import router from "../router";

@Options({
  components: {},
  data() {
    return {
      username: "",
      email: "",
      password: "",
      verify: "",
      emailFieldTouched: false,
      usernameFieldTouched: false,
      passwordFieldTouched: false,
      usernameExists: false
    };
  },
  computed: {
    submittable() {
      const isEmailValid = this.email;
      const isUsernameValid = this.username;
      const isPasswordValid = this.password && this.password.length >= 8;
      axiosInstance
      return (
        isEmailValid && isUsernameValid && isPasswordValid && this.passwordsMatch
      );
    },
    passwordsMatch() {
      return !(this.password !== this.verify && this.password && this.verify);
    },
  },
  methods: {
    async submit(e: Event) {
      const self = this;
      e.preventDefault();
      await axiosInstance.get("https://typrrr-backend.vercel.app/users/").then((res) => {
        res.data.forEach((i: User) => {
          if (i.username == this.username) {
            this.usernameExists = true;
          }
        });
      });
      console.log(this.submittable)
      if (this.submittable && !this.usernameExists) {
        await axiosInstance
          .post("https://typrrr-backend.vercel.app/users/register/", {
            username: this.username,
            email: this.email,
            password: this.password,
          })
          .then(function (response) {
            console.log(response);
            self.$router.push({ path: "/login", query: { registered: true } });
          })
          .catch(function (error) {
            console.log(error);
          });
      }
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
.border-red {
  border-color: red;
}

.error-message {
  color: red;
  font-size: 14px;
  margin-top: 5px;
}
</style>
