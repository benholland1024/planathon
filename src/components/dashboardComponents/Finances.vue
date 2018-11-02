<template>
  <div class="widget-holder">
    <tasks :timeline="$parent.timeline"
            :hackathonId="$route.params.hackathonId"
            :hackathonTasks="$parent.tasks">
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
  }
}
</script>