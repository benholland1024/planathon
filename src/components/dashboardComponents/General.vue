<template>
  <div class="widget-holder">
    <tasks :hackathonId="$route.params.hackathonId"
           :hackathonTasks="this.generalTasks"
           :hackathonDate="$parent.hackathon.date">

    </tasks>
    <div class="dark-widget">
    </div>
  </div>
</template>

<script>
import Tasks from '@/components/dashboardComponents/tasks.vue';

export default {
  name: 'general',
  components: {
    Tasks
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
