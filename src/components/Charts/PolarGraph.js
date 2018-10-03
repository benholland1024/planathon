import { PolarArea } from 'vue-chartjs'

var data = {
  labels: ['Vegetarian', 'Vegan', 'Kosher', 'Gluten Free', 'Allergies/Other'],
  datasets: [
    {
      data: [18, 14, 6, 8, 12]
    },
  ]
}

export default {
  extends: PolarArea,
  mounted () {
    // Overwriting base render method with actual data.
    this.renderChart(data, {
      backgroundColor: ['rgba(200,0,0,1)', 'blue', 'green', 'pink', 'orange']
    })
  }
}