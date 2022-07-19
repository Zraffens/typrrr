<template>
  <div><Navbar /> <router-view /></div>
</template>

<script lang="ts">
import Navbar from "./components/Navbar.vue";
import { User } from "./types"
import { VueElement } from "@vue/runtime-dom";
import axiosInstance from "./axios";
import { Options, Vue } from "vue-class-component";
import { mapGetters } from "vuex";

@Options({
  data() {
    return {};
  },
  components: {
    Navbar,
  },
  async created() {
    let userDetails: any = {}
    axiosInstance.get("http://localhost:8000/users/profile/").then((res) => {
      for (const key in res.data) {
        localStorage.setItem(key, res.data[key])
        userDetails[key] = res.data[key]
      }
      console.log(userDetails)
      this.$store.dispatch('createdFunc', {userDetails})
      console.log(this.$store.getters.getUserDetails)
      localStorage.setItem('loggedIn', 'true')
    })
    .catch((err) => {
      if (err.response.status == '401') {
        localStorage.setItem('username', 'Guest')
        // localStorage.setItem('average_speed', '0')
        // localStorage.setItem('races_completed', '0')
        // localStorage.setItem('loggedIn', 'false')
      }
    });
  },
  computed: mapGetters({
    
  })
})
export default class App extends Vue {}
</script>

<style>
@import url("./assets/css/main.css");

.written {
  color: #42b983;
}

.wrong {
  background: red;
  color: white;
}
</style>
