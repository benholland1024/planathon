<template>
<div ref="container"></div>
</template>

<script>
import {GoogleCharts} from 'google-charts';
export default {
    data() { 
        return{
            chart: null,
            container: null
        }},
    mounted(){
        this.container=this.$refs.container;
        GoogleCharts.load(drawChart);
},
methods:{
    drawChart: function() {
            const data = GoogleCharts.api.visualization.arrayToDataTable([
            ['Chart thing', 'Chart amount'],
            ['Lorem ipsum', 60],
            ['Dolor sit', 22],
            ['Sit amet', 18]
        ]);
        const pie_1_chart = new GoogleCharts.api.visualization.PieChart(this.container);
        pie_1_chart.draw(data);
        
    }
}
}
</script>
<style scoped>
div {
    width: 100%;
    height: 100%;
}
</style>