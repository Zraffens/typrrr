<template>
  <div class="home align-center">
    <h1 class="intro">Start typing now!</h1>
    <router-link to="/race" class="button enlarge">Enter a typing race!</router-link>
    <hr>
    <div class="user-details">
      <h2 class="details-heading">Guest's typing stats</h2>
      <h3 class="stat">Average Speed: 0wpm</h3>
      <h3 class="stat">Best Race: 0wpm</h3>
      <h3 class="stat">Races Completed: 0</h3>
    </div>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import TypingField from "@/components/TypingField.vue"; // @ is an alias to /src

@Options({
  components: {
    TypingField,
  },
})
export default class Home extends Vue {}
</script>

<style scoped>
.home {
  margin-top: 2em;
}

h1 {
  margin: 1em;
}

.button {
  font-size: 2em;
  border-radius: 5px;
  border: none;
  background: #42b983;
  color: white;
  padding: 0.5em 2em;
  height: auto;
}

.button:hover {
  background: #0fa0ce;
}

</style>
