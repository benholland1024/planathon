<template>
<div id="nav">
  <div id="nav-left">
    <router-link to="/" tag="h1" class="link">
      <span class="light-yellow">Hack</span>
      <span class="light-purple">Map</span>
    </router-link>
    <router-link to="/about" tag="h2" class="link light-blue faded-link">
      About
    </router-link>
    <router-link to="/" tag="h2" class="link light-purple faded-link">
      Features
    </router-link>
  </div>
  <div id="nav-right">
    <router-link to="/login" tag="h2" class="link light-pink faded-link"
                 v-if="!user">
      Log In
    </router-link>
    <h2 class="link light-pink faded-link" 
        @click="$parent.logout()"
        v-else>
      Log Out
    </h2>
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