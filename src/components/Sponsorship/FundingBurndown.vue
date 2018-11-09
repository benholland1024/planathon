<template>
<div>
    <div id="burndown"></div>
    {{ sponsorList }}
</div>
</template>

<script lang="ts">
import Vue from 'vue';
import vis from 'vis';
import firebase from 'firebase';


export default Vue.extend({
    data() {
        return {
            container: {},
        }
    },
    props: {
        hackathonId: {
            type: String,
            required: true
        }
    },
    computed: {
        async hackathon() {
            let hackathons = await this.$store.getters['hackathons/storeRef']
            return hackathons[this.hackathonId]
        },
        async sponsorList() {
            let sponsors = await this.$store.getters['sponsors/hackathonSponsors'](
                (await this.hackathon).id
            );
            return sponsors;
        },
    },
    mounted() {
        this.container = document.getElementById('burndown');
        this.renderChart();
    },
    methods: {
        renderChart: async function() {
            let rawPoints = await this.sponsorList
            
            let rawStartDate = new Date(0);
                rawStartDate.setUTCSeconds((await this.hackathon).created_at.seconds);
            let rawEndDate = new Date(0);
                rawEndDate.setUTCSeconds((await this.hackathon).date.seconds);

            let startDate = rawStartDate.toISOString().substring(0, 10);
            let endDate = rawEndDate.toISOString().substring(0,10);

            let runningPoints = 0
            let dataPoints = rawPoints
                .filter( x => x.sponsored.amount > 0)
                .reverse()
                .map( x => {
                    console.log(x.sponsored.amount)
                    runningPoints = runningPoints + Number.parseInt(x.sponsored.amount)
                    return {
                        x: x.sponsored.dateCommitted,
                        y: runningPoints
                    }
                })

            console.log(dataPoints)

            let dataset = new vis.DataSet(dataPoints);
            let options = {
                start: startDate,
                end: endDate,
                zoomable: false,
                moveable: false
            };

            let burndownChart = new vis.Graph2d(this.container, dataset, options);   
        },
    }
})
</script>

<style>

</style>
