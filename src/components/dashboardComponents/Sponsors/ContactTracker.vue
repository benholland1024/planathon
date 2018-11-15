<template>
<div id="contact-tracker">
    <div id="timeline"></div>
</div>
</template>

<script lang="ts">
import Vue from 'vue'
import vis from 'vis'
import { Sponsor } from './Sponsor';

export default Vue.extend({
    data() {
        return { 
            timelineContainer: {}
        }
    },
    props: {
        sponsor: {
            type: Object,
            required: true
        }
    },
    mounted() {
        this.timelineContainer = document.getElementById('timeline');
        
        let items = new vis.DataSet(this.sponsor.interactions.map(x => {
            return {
                start: x.occurred,
                content: x.notes
            };
        }));

        let contactTimeline = new vis.Timeline(this.timelineContainer, items, {})
    }
})
</script>

<style>
#contact-tracker {
    background-color: black;
}
</style>