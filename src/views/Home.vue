<template>
  <div class="home align-center">
    <h1 class="intro">Start typing now!</h1>
    <router-link to="/race" class="button enlarge"
      >Enter a typing race!</router-link
    >
    <hr />
    <div class="user-details">
      <h2 class="details-heading">{{ username }}'s typing stats</h2>
      <h3 class="stat">Average Speed: {{ avgSpeed }}wpm</h3>
      <h3 class="stat">Best Race: 0wpm</h3>
      <h3 class="stat">Races Completed: {{ races }}</h3>
      <DataChart :chartData="JSON.parse(keyData)" />
      {{keyData}}
    </div>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import axiosInstance from "../axios";
import TypingField from "@/components/TypingField.vue"; // @ is an alias to /src
import DataChart from "../components/DataChart.vue"

@Options({
  components: {
    TypingField,
    DataChart
  },
  data() {
    return {
      id: localStorage.getItem("id"),
      username: localStorage.getItem('username'),
      races: localStorage.getItem('races_completed'),
      avgSpeed: localStorage.getItem('average_speed'),
      keyData: localStorage.getItem('key_data')
    }
    }
  },
    
)
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
  font-size: 2.5em;
  padding: 0.5em 2em;
  height: auto;
}

.button:hover {
  background: #0fa0ce;
}
</style>
