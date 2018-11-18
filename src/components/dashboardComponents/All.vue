<template>
  <div class="widget-holder">
    <tasks :hackathonId="$route.params.hackathonId"
           :hackathonTasks="$parent.tasks"
           :hackathonDate="$parent.hackathon.date">

    </tasks>
    <div class="dark-widget">
      <network :nodes="$parent.tasks"
               :edges="edges">
      </network>
    </div>
  </div>
</template>

<script>
import Tasks from '@/components/dashboardComponents/tasks.vue';
import Network from '@/components/Visualization/network.vue';

export default {
  name: 'all',
  components: {
    Tasks,
    Network
  },
  computed: {
    edges() {
      var edgesArray = [];
      this.$parent.tasks.forEach(task => {
        task.dependencies.forEach(dependency => {
          edgesArray.push({
            to: task.id,
            from: dependency
          });
        })
      })
      return edgesArray;
    }
  }
}
</script>
