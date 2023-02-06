<template>
  <div id="line-container">
    <canvas id="line-chart" width="400" height="400"></canvas>
    {{ words }} {{ speed }}
  </div>
</template>

<script lang="ts">
import { VueElement } from "@vue/runtime-dom";
import { Options, Vue } from "vue-class-component";
import { Chart, registerables } from "chart.js";
Chart.register(...registerables);

@Options({
  props: {
    times: Array,
    words: Array,
  },
  computed: {
    speed() {
      const speedList = [];
      for (const i in this.words) {
        speedList.push((this.words[i] / 5) * 60);
      }
      return speedList;
    },
  },
  mounted() {
    const ctx = <HTMLCanvasElement>document.getElementById("line-chart");
    const labels = this.times;
    const data = {
      labels: labels,
      datasets: [
        {
          label: "My First Dataset",
          data: this.speed,
          fill: false,
          borderColor: "rgb(75, 192, 192)",
          tension: 0.1,
        },
      ],
    };
    const config = {
      type: "line",
      data: data,
    };
    const stackedLine = new Chart(ctx, {
    type: 'line',
    data: this.speed,
    options: {
        scales: {
            y: {
                stacked: true
            }
        }
    }
});
  },
})
export default class DataLine extends Vue {}
</script>

<style>
#chart-container {
  width: 50vw;
  background: #222;
  padding: 2em;
  margin: 2em auto 2em auto;
}
</style>
