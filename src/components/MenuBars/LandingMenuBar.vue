<template>
<div id="nav" v-if="!$route.meta.dash">
  <div id="nav-left">
    <router-link to="/" tag="h1" class="link">
      <span class="light-purple">Plan</span>
      <span class="light-yellow">a</span>
      <span class="light-purple">thon</span>
    </router-link>
    <router-link to="/about" tag="h2" class="link light-blue faded-link menu-link">
      About
    </router-link>
    <router-link to="/dne" tag="h2" class="link light-purple faded-link menu-link">
      Features
    </router-link>
  </div>
  <div id="nav-right">
    <h2 class="link light-pink faded-link" v-if="$parent.loadingUser">
      Loading...
    </h2>
    <router-link to="/login" tag="h2" class="link light-pink faded-link"
                 v-else-if="!user">
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

<style scoped lang="scss">

@import '@/GlobalVars.scss';

h1, h2, h3, h4, h5 {
    padding: 0px;
    margin: 0px;
  }
  #nav {
    padding: 30px;
    background: $dark-gray;
    display: flex;
    justify-content: space-between;

    a {
      font-weight: bold;
      color: white;
    }
  }
  #nav-left {
    display: flex;
    justify-content: space-around;
    align-items: center;
    width: 40%;
  }
  #nav-right {
    display: flex;
    justify-content: space-around;
    align-items: center;
    text-align: right;
    width: 15%;
  }

  .menu-link {
    margin-left: 20px;
  }
  
</style>