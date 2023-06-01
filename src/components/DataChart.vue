<template>
  <div id="chart-container">
    <canvas id="dataChart" width="400" height="400"></canvas>
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
    // console.log(typeof JSON.parse(this.chartData))
    // const keys = Object.values(this.chartData)
    // const values = this.values
    // let keys = []
    console.log('data', this.chartData)
    console.log(Boolean(this.chartData))
    // console.log(keys, values)
    var data = {
      labels: this.keys,
      datasets: [{
        label: 'Errors',
        data: this.values,
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40', '#8B4513', '#FF6384', '#32CD32', '#FF69B4'],
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1
      }]
    };

    // Configuration options
    var options = {
      responsive: true,
      scales: {
        y: {
          suggestedMax: 3,
          color: '#000000',
          ticks: {
          stepSize: 1,
            color: '#faecd0',
            fontSize: 30
          },
          beginAtZero: true
        }, 
        x: {
          color: '#000000',
          ticks: {
            color: '#faecd0',
          },
          beginAtZero: true
        }
      }
    };

    // Create the chart
    var ctx = document.getElementById('dataChart') as HTMLCanvasElement;
    var myChart = new Chart(ctx, {
      type: 'bar',
      data: data,
      options: options
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
canvas {
  background: #323437;
}
</style>
