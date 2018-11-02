<template>
  <div class="widget-holder">
    <div class="dark-widget">
        <h1>Dev!!</h1>
    </div>
    <div class="dark-widget">
      <sponsor-editor></sponsor-editor>
    </div>
  </div>
</template>

<script>
import Tasks from '@/components/dashboardComponents/tasks.vue';
import SponsorEditor from '@/components/Sponsorship/SponsorEditor.vue';

export default {
  name: 'development',
  components: {
    Tasks,
    SponsorEditor
  }
}
</script>