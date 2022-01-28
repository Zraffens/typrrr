<template>
  <div><Navbar /> <router-view /></div>
</template>

<script lang="ts">
import Navbar from "./components/Navbar.vue";
import { VueElement } from "@vue/runtime-dom";
import { Options, Vue } from "vue-class-component";

@Options({
  data() {
    return {};
  },
  components: {
    Navbar,
  },
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
