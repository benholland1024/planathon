import { Line } from 'vue-chartjs'

var data = {
  labels: ['January', 'February', 'March', 'April', 'May', 'June'],
  datasets: [
    {
      label: 'Last Year',
      borderColor: '#FF6EE0',
      data: [500, 500, 2250, 3000, 5000, 7000]
    },
    {
      label: 'Current',
      borderColor: '#BA68FF',
      data: [250, 500, 1500, 3500, 6500, 10000]
    }
  ]
}

export default {
  extends: Line,
  mounted () {
    // Overwriting base render method with actual data.
    this.renderChart(data, {})
  }
}