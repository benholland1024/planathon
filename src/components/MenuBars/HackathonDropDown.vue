<template>
<div id="hackathon-drop-down">
  <div id="hackathon">
    <router-link to="/about" tag="h2" class="link light-blue faded-link">
      About
    </router-link>
  </div>
</div>
</template>

<script>
export default {
  props: {
    user: {
      required: true
    }
  }
}
</script>

<style scoped>
h1, h2 {
    padding: 0px;
    margin: 0px;
  }
</style>
