// CommitChart.js
import { Bar } from 'vue-chartjs'

var data = {
  labels: ['January', 'February', 'March', 'April'],
  datasets: [
    {
      label: 'GitHub Commits',
      backgroundColor: '#f87979',
      data: [40, 20, 24, 28]
    }
  ]
}

export default {
  extends: Bar,
  mounted () {
    // Overwriting base render method with actual data.
    this.renderChart(data, {})
  }
}