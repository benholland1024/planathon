<template>
  <div class="widget-holder">
    <tasks :hackathonId="$route.params.hackathonId"
           :hackathonTasks="this.generalTasks"
           :hackathonDate="$parent.hackathon.date">

    </tasks>
    <div class="dark-widget">
      <br><br>  
      <div v-if="$parent.hackathon.attendance">
        Projected Attendees: <b>{{$parent.hackathon.attendance}}</b>
      </div>
      <div>Projected Attendee Dietary Restrictions:</div>
      <polar-graph class="polar-graph"></polar-graph>
    </div>
  </div>
</template>

<script>
import Tasks from '@/components/dashboardComponents/tasks.vue';
import PolarGraph from '@/components/Charts/PolarGraph.js';

export default {
  name: 'general',
  components: {
    Tasks,
    PolarGraph
  },
  computed: {
    generalTasks() {
      return this.$parent.tasks.filter(task => {
        return task.tags.includes("general");
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.polar-graph {
  width: 70%;
  margin: 0 auto;
  margin-top: 50px;
}

.dark-widget {
  overflow: scroll;
}
</style>