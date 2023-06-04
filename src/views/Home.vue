<template>
  <div class="home align-center">
    <h1 class="intro">Start typing now!</h1>
    <router-link to="/race" class="button enlarge"
      >Enter a typing race!</router-link
    >
    <hr />
    <div class="user-details">
      <h2 class="details-heading">{{ userInfo.username || 'Guest' }}'s typing stats</h2>
      <h3 class="stat">Average Speed: {{ Math.round(userInfo.average_speed) }} wpm</h3>
      <h3 class="stat">Best Speed: {{ userInfo.best_speed || 0 }} wpm</h3>
      <h3 class="stat">Races Completed: {{ userInfo.races_completed }}</h3>
      <DataChart v-if="Object.keys(filteredKeyData).length" :chartData="filteredKeyData" />
    </div>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import axiosInstance from "../axios";
import TypingField from "@/components/TypingField.vue"; // @ is an alias to /src
import DataChart from "../components/DataChart.vue";
import { mapGetters } from 'vuex';

@Options({
  components: {
    TypingField,
    DataChart,
  },
  data() {
    return {
      keyData: localStorage.getItem("key_data"),
    };
  },
  computed: {
    filteredKeyData: function () {
      console.log(this.username)
      console.log('asdf', this.keyData)
      if (!this.keyData) {
        return {}
      }
      const keyData: {a: number} = JSON.parse(this.keyData)
      // console.log(Object.entries(keyData))
      const sortedKeys = Object.entries(keyData).sort((a, b) => {
        return b[1] - a[1];
      });
      const sliced = sortedKeys.slice(0, 10)
      const obj: { [key: string]: number } = sliced.reduce((acc, [key, value]) => {
        acc[key] = value;
        return acc;
      }, {} as { [key: string]: number });
      return obj 
    },
    ...mapGetters(['getUserInfo']),
    userInfo() {
      console.log('userinfo', this.getUserInfo)
      return this.getUserInfo;
    }
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
  font-size: 2.5em;
  padding: 0.5em 2em;
  height: auto;
}

.button:hover {
  background: #0fa0ce;
}
</style>
