<template>
  <div id="line-container" v-if="speed" lazy>
    <canvas id="myChart" width="400" height="400"></canvas>
  </div>
</template>

<script lang="ts">
import { VueElement } from "@vue/runtime-dom";
import { Options, Vue } from "vue-class-component";
import { Chart, registerables } from "chart.js";
Chart.register(...registerables);

@Options({
  props: {
    words: Array,
  },
  computed: {
    speed() {
      const speedList = [];
      for (const i in this.words) {
        speedList.push(Math.round((this.words[i] / 3) * 60));
      }
      return speedList;
    },
    times() {
      const times = [];
      for (let i = 0; i < this.speed.length; i++) {
        times.push(i * 3 + " sec");
      }
      times.shift();
      return times;
    },
  },
  mounted() {
    console.log("speed", this.speed);
    const ctx = <HTMLCanvasElement>document.getElementById("myChart");
    var myChart = new Chart(ctx, {
      type: "line",
      data: {
        labels: this.times,
        datasets: [
          {
            label: "Speed",
            data: this.speed,
            borderColor: "#42b983",
            backgroundColor: "#42b983",
            borderWidth: 1,
          },
        ],
      },
      options: {
        scales: {
          y: {
            ticks: {
              color: "#faecd0",
            },
            beginAtZero: true,
          },
          x: {
            ticks: {
              color: "#faecd0",
            },
            beginAtZero: true,
          },
        },
      },
    });
  },
})
export default class DataLine extends Vue {}
</script>

<style>
#chart-container {
  width: 35vw;
  background: #222;
  padding: 2em;
  margin: 2em auto 2em auto;
}

#line-container {
  width: 35vw;
  background: #222;
  padding: 2em;
  margin: 2em auto 2em auto;
}

</style>
