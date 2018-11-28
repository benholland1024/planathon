<template>
    <div>
        <div id="theGraph"><pieChart></pieChart ></div>
    </div>
</template>

<script>
    import pieChart from '@/components/Visualization/pieChart.vue';
    export default {
        data(){return {}},
        components: {
            pieChart
        },
    }
</script>

<style scoped lang="scss">
@import '@/GlobalVars.scss';
#theGraph{
    height: 500px;
}
</style>