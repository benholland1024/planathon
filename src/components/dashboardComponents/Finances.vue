<template>
  <div class="widget-holder">
    <tasks :hackathonId="$route.params.hackathonId"
           :hackathonTasks="this.financeTasks"
           :hackathonDate="$parent.hackathon.date">

    </tasks>
    <div class="dark-widget">
    </div>
  </div>
</template>

<script>
import Tasks from '@/components/dashboardComponents/tasks.vue';

export default {
  name: 'finances',
  components: {
    Tasks
  },
  computed: {
    financeTasks() {
      return this.$parent.tasks.filter(task => {
        if (task.tags.includes("finance") || task.tags.includes("sponsors"))
          return true;
        else 
          return false;
      })
    }
  }
}
</script>
