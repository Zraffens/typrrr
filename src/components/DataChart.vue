<template>
  <div id="chart-container">
    <canvas id="data-chart" width="400" height="400"></canvas>
  </div>
</template>

<script lang="ts">
import { VueElement } from "@vue/runtime-dom";
import { Options, Vue } from "vue-class-component";
import { Chart, registerables } from "chart.js";
Chart.register(...registerables);

@Options({
  props: {
    chartData: Object,
  },
  data() {
    return {
      keys: Object.keys(this.chartData),
      values: Object.values(this.chartData)
    };
  },
  mounted() {
    const ctx = <HTMLCanvasElement>document.getElementById("data-chart");
    const keys = this.keys
    const values = this.values
    const myChart: Chart = new Chart(ctx, {
      type: "bar",
      data: {
        labels: keys,
        datasets: [
          {
            label: "Missed Keys",
            data: values,
            backgroundColor: [
              "rgba(255, 99, 132, 0.2)",
              "rgba(54, 162, 235, 0.2)",
              "rgba(255, 206, 86, 0.2)",
              "rgba(75, 192, 192, 0.2)",
              "rgba(153, 102, 255, 0.2)",
              "rgba(255, 159, 64, 0.2)",
            ],
            borderColor: [
              "rgba(255, 99, 132, 1)",
              "rgba(54, 162, 235, 1)",
              "rgba(255, 206, 86, 1)",
              "rgba(75, 192, 192, 1)",
              "rgba(153, 102, 255, 1)",
              "rgba(255, 159, 64, 1)",
            ],
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        scales: {
          y: {
            ticks: {
              stepSize: 0.5
            },
            beginAtZero: true,
          },
        },
      },
    });
  },
})
export default class DataChart extends Vue {}
</script>

<style>
#chart-container {
  width: 30vw;
  background: #222;
  padding: 2em;
  margin: 2em auto 2em auto;
} 
</style>
