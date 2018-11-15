<template>
  <div id="app" class="full-page">
    <menu-bar :user="user"></menu-bar>
    <router-view/>
  </div>
</template>

<script>
import config from '@/config/config.js';
import firebase from 'firebase/app';
import 'firebase/firestore';
import VueFire from 'vuefire';
import Vue from 'vue';

// Fancy switches for textboxes 😛
import ToggleButton from 'vue-js-toggle-button'
Vue.use(ToggleButton)

// Tooltip popups
import VTooltip from 'v-tooltip'
Vue.use(VTooltip);

import MenuBar from '@/components/MenuBars/LandingMenuBar.vue';

firebase.initializeApp(config);
var db = firebase.firestore();
const settings = {/* your settings... */ timestampsInSnapshots: true};
db.settings(settings);

export default {
  data() {
    return {
      userId: '',
      db: db,
      user: null,
      loadingUser: true,
      org: null,
      hackathon: null
    }
  },
  components: {
    MenuBar
  },
  methods: {
    loadOrgs() {
      // Getting the data from each of the orgs based on the org's ID
      // (which was stored in the User's table)
      for (let id in this.currentUser.orgs) {
        this.org = this.orgs[`${id}`]
        //this.userOrgs.push(this.orgs[`${id}`])
        for (var i in this.orgs[`${id}`].hackathons) {
          this.loadHackathon(this.userOrgs.length -1, this.orgs[`${id}`].hackathons[i].id);
        }
      }
    },
    loadHackathon(orgId, hackathonId) {
      console.log(orgId, hackathonId);
      this.userOrgs[orgId].hackathons[hackathonId] = this.hackathons[`${hackathonId}`]
    },
    logout() {
      firebase.auth().signOut().then(() => {
        location.reload()
      })
      .catch((err) => {
        throw err;
      });
      this.user = null;
    },
  },
  mounted() {

    firebase.auth().onAuthStateChanged((user) => {
      // This if statement will be true if the user is logged in
      // when the page loads! :)
      if (user){
        this.userId = user.uid;
        this.user = true;
        setTimeout(() => {
          //this.loadOrgs();
          // this.user = this.currentUser;
        }, 1000)
        this.loggedIn = true;
        this.loginModule = false;
        this.loadingUser = false;
      } else {
        this.loadingUser = false;
      }
    });

  },
  computed: {
    users() {
      return this.$store.getters['users/storeRef']
    },
    currentUser() {
      return this.users[`${this.userId}`]
    },
    orgs() {
      return this.$store.getters['orgs/storeRef']
    },
    userOrgs() {
      return this.$store.getters['orgs/userOrgs'](this.userId)
    },
    hackathons() {
      return this.$store.getters['hackathons/storeRef']
    },
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

  .all {
    // experimented with making this green
    // background-color: #49BFB0;
    background-color: white;
  }
  .finance {
    background-color: $yellow;
  }
  .sponsors {
    background-color: $orange;
  }
  .promotion {
    background-color: $pink;
  }
  .design {
    background-color: $purple;
  }
  .general {
    background-color: $blue;
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

  }
  .hover-shine {
    position: relative;
    overflow: hidden;
    transition: 200ms ease all;
    &:before {
      content: '';
      position: absolute;
      top: -40%;
      right: 150%;
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
  .orange-gradient {
    background: $orange-gradient;
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


/*  --------------- */
/*  POPUP STYLING: */
/*  --------------- */

  .popup-background {
    position: fixed;
    z-index: 9998;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, .5);
    display: table;
    transition: opacity .4s ease;
  }

  .popup-wrapper {
    display: table-cell;
    vertical-align: middle;
  }

  .popup-table{
    width: 400px;
    margin: 0 auto;
    padding: 20px;
    margin-top: 30px;
    box-shadow: $box-shading;
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

  /*Tooltip stuff: */
  .tooltip {
  display: block !important;
  z-index: 10000;

  .tooltip-inner {
    background: black;
    color: white;
    border-radius: 16px;
    padding: 5px 10px 4px;
  }

  .tooltip-arrow {
    width: 0;
    height: 0;
    border-style: solid;
    position: absolute;
    margin: 5px;
    border-color: black;
    z-index: 1;
  }

  &[x-placement^="top"] {
    margin-bottom: 5px;

    .tooltip-arrow {
      border-width: 5px 5px 0 5px;
      border-left-color: transparent !important;
      border-right-color: transparent !important;
      border-bottom-color: transparent !important;
      bottom: -5px;
      left: calc(50% - 5px);
      margin-top: 0;
      margin-bottom: 0;
    }
  }

  &[x-placement^="bottom"] {
    margin-top: 5px;

    .tooltip-arrow {
      border-width: 0 5px 5px 5px;
      border-left-color: transparent !important;
      border-right-color: transparent !important;
      border-top-color: transparent !important;
      top: -5px;
      left: calc(50% - 5px);
      margin-top: 0;
      margin-bottom: 0;
    }
  }

  &[x-placement^="right"] {
    margin-left: 5px;

    .tooltip-arrow {
      border-width: 5px 5px 5px 0;
      border-left-color: transparent !important;
      border-top-color: transparent !important;
      border-bottom-color: transparent !important;
      left: -5px;
      top: calc(50% - 5px);
      margin-left: 0;
      margin-right: 0;
    }
  }

  &[x-placement^="left"] {
    margin-right: 5px;

    .tooltip-arrow {
      border-width: 5px 0 5px 5px;
      border-top-color: transparent !important;
      border-right-color: transparent !important;
      border-bottom-color: transparent !important;
      right: -5px;
      top: calc(50% - 5px);
      margin-left: 0;
      margin-right: 0;
    }
  }

  &.popover {
    $color: #f9f9f9;

    .popover-inner {
      background: $color;
      color: black;
      padding: 24px;
      border-radius: 5px;
      box-shadow: 0 5px 30px rgba(black, .1);
    }

    .popover-arrow {
      border-color: $color;
    }
  }

  &[aria-hidden='true'] {
    visibility: hidden;
    opacity: 0;
    transition: opacity .15s, visibility .15s;
  }

  &[aria-hidden='false'] {
    visibility: visible;
    opacity: 1;
    transition: opacity .15s;
  }
}

</style>
