<template>
  <div id="app" class="full-page">
    <menu-bar :user="user"></menu-bar>
    <router-view/>
  </div>
</template>

<script>
import config from '@/config/config.js';
import * as firebase from 'firebase';
  
import MenuBar from '@/components/MenuBars/LandingMenuBar.vue';

firebase.initializeApp(config);
var db = firebase.firestore();

export default {
  data() {
    return {
      db: db,
      user: null
    }
  },
  components: {
    MenuBar
  },
  methods: {
    loadUser(id) {
      console.warn("This should ultimately get the user's DB info.");
      this.user = {
        name: 'joe schmoe',
        email: 'joe@schmoe.com',
        id: id
      }
    },
    logout() {
      firebase.auth().signOut();
      this.user = null;
    },
  },
  mounted() {
    
    firebase.auth().onAuthStateChanged((user) => {
      // This if statement will be true if the user is logged in
      // when the page loads! :) 
      if (user){
        this.loadUser(user.uid);
        this.loggedIn = true;
        this.loginModule = false;
      }
    });

  }
}

</script>

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
  
  .dark-gray-widget {
    background: $dark-gray;
    padding: 10px 20px;
    color: white;
    box-shadow: $box-shading;
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
    position: relative;
    overflow: hidden;
    transition: 200ms ease all;


    &:before {
      content: '';
      position: absolute;
      top: -40%;
      right: 110%;
      width: 30px;
      height: 200%;
      background: rgba(white, .3);
      transform: rotate(20deg);
    }

    &:hover {

      &:before {
        right: -50%;
        transition: 1s ease all;
      }
    }

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
  
/*  ------------- */
/*  AUTH STYLING: */
/*  ------------- */

  .auth-widget {
    width: 400px;
    margin: 0 auto;
    padding: 20px;
    margin-top: 30px;
    box-shadow: $box-shading;
  }
  
  .err-text {
    color: white;
    text-decoration: underline;
    text-decoration-color: $orange;
  }
  
  .inline-link {
    text-decoration: underline;
    cursor: pointer;
  }
  
  .auth-textbox {
    border: solid $light-gray 1px;
    background: rgba(0,0,0,.1);
    padding: 5px;
    color: white;
    font-size: 16px;
  }

</style>

<style scoped lang="scss">
  
</style>
