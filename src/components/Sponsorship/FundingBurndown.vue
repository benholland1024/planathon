<template>
<div>
    <div id="burndown"></div>
</div>
</template>

<script lang="ts">
import Vue from 'vue';
import vis from 'vis';
import firebase from 'firebase';

export default Vue.extend({
    data() {
        return {
            hackathonId: 'jkVV4jCvDWwAzx9OiAHn',
            container: {},
            dataset: null
        }
    },
    mounted() {
        this.container = document.getElementById('burndown');
        this.getSponsorData()
    },
    methods: {
        renderChart: function(dataPoints) {
            if (!this.dataset) {
                this.dataset = new vis.DataSet(dataPoints);
                let options = {
                    start: '2018-05-30', // TODO: Date first sponsor activity happened
                    end: '2018-10-25' // TODO: Funding due date
                };

                let burndownChart = new vis.Graph2d(this.container, this.dataset, options);
            } else {
                this.dataset.clear();
                this.dataset.add(dataPoints);      
            }      
        },
        getSponsorData: async function() {
            try {
                let req = await this.$parent.db
                    .collection('sponsors')
                    .where('hackathonId', '==', this.hackathonId)
                    .orderBy('sponsored.dateCommitted')
                    .get();
                let totalPaid = 0;
                let sponsors = [];
                req.forEach(element => { 
                    let s = element.data()
                    totalPaid += s.amountPaid
                    sponsors.push({
                        x: s.sponsorDate.toDate().toISOString().substring(0, 10),
                        y: totalPaid
                    });
                });
                
                console.log('Point data', sponsors)
                this.renderChart(sponsors)
            } catch (e) {
                console.log(e)
            }
        },
    }
})
</script>

<style>

</style>
