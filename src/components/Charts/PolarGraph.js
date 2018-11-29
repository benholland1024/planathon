import { Doughnut } from 'vue-chartjs'

var data = {
  labels: ['Vegetarian', 'Vegan', 'Kosher', 'Gluten Free', 'Allergies/Other'],
  datasets: [
    {
      data: [18, 14, 6, 8, 12],
      backgroundColor: ['#FFE16E', '#FF9A6E', '#FF6EE0', '#BA68FF', '#7A8FFF'],
      borderColor: ['rgba(0,0,0,0)', 'rgba(0,0,0,0)', 'rgba(0,0,0,0)', 'rgba(0,0,0,0)', 'rgba(0,0,0,0)',]
    },
  ],
}

export default {
  extends: Doughnut,
  mounted () {
    // Overwriting base render method with actual data.
    this.renderChart(data,)
  }
}