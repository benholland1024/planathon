<template>
  <div class="widget-holder">
    <div class="dark-widget">
        <h1>General!</h1>
    </div>
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
  }
}
</script>