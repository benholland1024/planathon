<template>
  <div id="dashboard" v-if="$parent.user">
    <tasks :timeline="hackathonTasks">
    </tasks>
    <div class="dark-widget">
    </div>
  </div>
</template>

<script>
import LineGraph from '@/components/Charts/LineGraph.js';
import PolarGraph from '@/components/Charts/PolarGraph.js';
import Tasks from '@/components/dashboardComponents/tasks.vue';

export default {
  data() {
    return {
      hackathonId: this.$route.params.hackathonId,
      timeline: [],
      hackathonTasks: []
    }
  },
  mounted() {
    // Get the timeline for the hackathon
    this.$parent.db.collection('hackathons').doc(this.hackathonId).get().then((doc) => {
      this.timeline = doc.data().timeline;

      // For each task id in the timeline, get the actual task object
      // and put the tasks in hackathonTasks
      this.timeline.forEach((task) => {
        this.$parent.db.collection('tasks').doc(task).get().then((doc) => {
          this.hackathonTasks.push(doc.data());
        }).catch((err) => {
          console.error("Error getting the hackathon's tasks: ", err);
        })
      })
    }).catch((err) => {
      console.error("Error getting the hackathon's timeline: ", err);
    })
  },
  components: {
    LineGraph,
    PolarGraph,
    Tasks
  }
}
</script>

<style scoped lang="scss">
@import '@/GlobalVars.scss';

#dashboard {
  display: flex;
  justify-content: space-evenly;
}

.dark-widget {
  background-color: $dark-gray;
  width: 40%;
  height: 500px;
  margin-top: 25px;
}

.task-widget {
  background-color: $gray;
  width: 80%;
  min-height: 75px;
  margin: 15px 5%;
  padding: 10px 5%;
  text-align: left;
}

.task-circle {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  margin-right: 5px;
}

h3, h4 {
  margin: 0;
}

h4 {
  opacity: .5;
}

</style>
