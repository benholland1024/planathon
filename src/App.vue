<template>
  <div id="app" class="full-page">
    <div id="nav">
      <div id="nav-left">
        <router-link to="/" tag="h1" class="link">
          <span class="light-yellow">Hack</span>
          <span class="light-purple">Map</span>
        </router-link> 
        <router-link to="/" tag="h2" class="link light-blue faded-link">
          About
        </router-link>
        <router-link to="/" tag="h2" class="link light-purple faded-link">
          Features
        </router-link>
      </div>
      <div id="nav-right">
        <router-link to="/" tag="h2" class="link light-pink faded-link">
          Log In
        </router-link>
      </div>
    </div>
    <router-view/>
  </div>
</template>

<style lang="scss">
  
@import '@/GlobalVars.scss';

  .full-page {
    position: absolute;
    left: 0px;
    top: 0px;
    width: 100%;
    min-height: 100%;
  }
  
  .yellow {
    color: $yellow;
  }
  .light-yellow {
    color: $light-yellow
  }
  .orange {
    color: $orange;
  }
  .light-orange {
    color: $light-orange;
  }
  .pink {
    color: $pink;
  }
  .light-pink {
    color: $light-pink;
  }
  .purple {
    color: $purple;
  }
  .light-purple {
    color: $light-purple;
  }
  .blue {
    color: $blue;
  }
  .light-blue {
    color: $light-blue;
  }
  
  .link {
    cursor: pointer;
  }
  .faded-link {
    opacity: .5;
    cursor: pointer;
  }
  .faded-link:hover {
    opacity: 1;
  }
  
  .bold {
    font-weight: bolder;
  }
  
  .material-button-large {
    padding: 15px 50px;
    box-shadow: $box-shading;
    font-weight: bold;
    border: none;
    font-size: 20px;
    cursor: pointer;
  }
  .purple-gradient {
    background: $purple-gradient;
    color: white;
  }
  
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: white;
    background: $light-gray;
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
    align-items: center;
    text-align: right;
  }
</style>

<style scoped lang="scss">
  h1, h2 {
    padding: 0px;
    margin: 0px;
  }
</style>
