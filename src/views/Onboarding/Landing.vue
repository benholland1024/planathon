<template>
<loading v-if="$parent.loadingUser">
</loading>

<div id="landing" v-else-if="!$parent.user">
  <div id="promo-container">
    <graph2d v-bind:start="start" v-bind:end="end" v-bind:items="items"></graph2d >
  </div>
  <div id="call-to-action">
    <p class="light-blue title">Organize Your Hackathon</p>
    <p class="light-pink bold title">Like A Pro.</p>
    <p style="opacity: .5;font-size:20px;">Running a hackathon is a herculean task. Organize your todo list, keep track of financial and development progress, see tips on running hackathons by people like you, and much more. </p>
    <div id="get-started">
      <router-link tag="button" class="material-button-large purple-gradient"
                   :to="{name: 'register'}">
        GET STARTED
      </router-link>
      <p class="under-button purple">Or, find your team!</p>
    </div>
  </div>
</div>

<div id="project-choice" v-else>
  <img src="@/assets/low_poly_spike_bg.svg" id="bg-spikes">

  <h1 class="light-blue title" style="margin-bottom:10px;">Welcome Back!</h1>
  <task-circle-display 
  :tags="['finance', 'development', 'promotion', 'design', 'general']">
  </task-circle-display><br>

  <div style="padding-bottom: 50px; z-index: 20;">
    Below is a list of the organization. Click on any of them to see their details!
  </div>

  <div id="orgList">
    <div class="material-button-large orange-gradient new-org "
          @click="selectOrg(org, orgIndex)" v-for="(org, orgIndex) in $parent.userOrgs"
          :key="orgIndex" :class="{
            'expanded-org': selectedOrg === orgIndex,
            'hover-shine': selectedOrg !== orgIndex
          }">

      <span>{{org.name}}</span>
      <div style="text-align: left;" v-if="org.hackathons">
        <h4 style="margin-left: -10px;">Hackathons:</h4>
        <router-link tag="div" :to="'/dashboard/' + hackathon.id" v-for="hackathon in org.hackathons"
                    :key="hackathon.id" class="hackathon-opt opt hover-shine">
          {{ hackathon.name }}
        </router-link>
      </div>
      <div v-else>
        <h4>No hackathons yet!</h4>
      </div>
      <br>
      <div class="new-hackathon-opt opt hover-shine" @click="hackathonInput = true">
        <span v-if="!hackathonInput">
          + New Hackathon
        </span>
        <input v-else v-model="hackathonName" @keyup.enter="addNewTasks()" ref="newHackathon">
      </div>

      <!-- manageOrgModal -->
      <div class="hackathon-item manage-org-opt opt hover-shine" @click="showOrgModal = true">
        Organization Settings
      </div>
      <manage-org-modal :orgId="org.id" v-if="showOrgModal == true" @close="showOrgModal = false">
      </manage-org-modal>

    </div>
    <div class="material-button-large orange-gradient new-org hover-shine"
          @click="selectOrgInput()">
      <span v-if="!orgInput">
        + New Organization
      </span>
      <input v-else v-model="orgName" @keyup.enter="addNewOrg()" ref="newOrg">
    </div>

  </div>

</div>
</template>

<script>
import Loading from '@/components/Loading.vue';
import ManageOrgModal from '@/components/dashboardComponents/manageOrgModal.vue'
import graph2d from '@/components/Visualization/graph2d.vue';

import TaskCircleDisplay from '@/components/dashboardComponents/taskModals/taskCircleDisplay.vue';

import vis from 'vis';
import 'vis/dist/vis.min.css';

export default {
  name: 'Landing',
  data() {
    return {
      start: '2014-06-11',
      end: '2014-06-20',
      items: [
        {x: '2014-06-11', y: 10},
        {x: '2014-06-12', y: 25},
        {x: '2014-06-13', y: 30},
        {x: '2014-06-14', y: 10},
        {x: '2014-06-15', y: 15},
        {x: '2014-06-16', y: 30}
      ],
      orgInput: false,
      orgName: '',
      hackathonInput: false,
      hackathonName: '',
      hackathonId: '',
      selectedOrg: '',
      showOrgModal: false
    }
  },
  methods: {
    selectOrgInput() {
      this.orgInput = true;
      var vm = this;
      setTimeout(() => {
        vm.$refs.newOrg.focus();
      }, 200);
    },
    addNewOrg() {
      // Make sure the user is logged in
      console.log(this.orgName);
      if (!this.$parent.userId) {
        console.error("We couldn't find your userID! This shouldn't be possible.");
        return;
      }

      //Check to see if org name is already in use
      this.$store.dispatch('orgs/fetch', {whereFilters: [['name', '==', this.orgName]]})
      .then(querySnapshot => {
        if (querySnapshot.empty == true) {

          // Create a new org and add it to the orgs collection
          var collabsList = [];
          collabsList.push(this.currentUser.id);
          const orgId = this.$store.getters['orgs/dbRef'].doc().id;
          this.$store.dispatch('orgs/insert', {
            id: orgId,
            name: this.orgName,
            collaborators: collabsList
          }).catch(err => {
            console.error("Problem adding new org: ", err)
          })


          // Setting up an object to update the user's list of orgs
          var updateObj = {
            orgs: {}
          }
          if (this.currentUser.orgs) {
            updateObj.orgs = this.currentUser.orgs;
          }
          updateObj.orgs[orgId] = {
            role: 'admin'
          }

          // Updating user's list of orgs
          this.$store.dispatch('users/set', {[`${this.$parent.userId}`]: {orgs: updateObj.orgs}})
          .catch(err => {
            console.error("Problem updating user org list: ", err)
          })

          // Updating org list populating screen
          this.$parent.userOrgs.push(this.orgs[`${orgId}`]);
          this.orgName = '';
        } else {
          alert("Sorry, organization: " + this.orgName + " is already in use");
        }
      })
    },
    selectOrg(org, index) {
      console.log(org, index)
      this.selectedOrg = index;
      this.$parent.org = org;
    },
    addNewHackathon(taskList) {
      // Make sure the user is logged in
      if (!this.$parent.userId) {
        console.error("We couldn't find your userID! This shouldn't be possible.");
        return;
      }

      // Create a new hackathon and add it to the hackathons collection
      this.$store.dispatch('hackathons/insert', {
        id: this.hackathonId,
        name: this.hackathonName,
        timeline: taskList
      })

      // Setting up an object to update the org's list of hackathons
      var updateObj = {
        hackathons: {}
      }
      if (this.$parent.org.hackathons) {
        updateObj.hackathons = this.$parent.org.hackathons;
      }
      updateObj.hackathons[this.hackathonId] = {
        id: this.hackathonId,
        name: this.hackathonName,
        timeline: taskList
      }

      // Updating org list and resetting org data for reloading
      this.$store.dispatch('orgs/set', {[`${this.$parent.org.id}`]: {hackathons: updateObj.hackathons}})
      .then(() => {
        while (this.$parent.userOrgs[0])
          this.$parent.userOrgs.pop();

        this.$parent.loadOrgs();
        this.hackathonInput = false;
        this.hackathonName = '';
      })
    },
    addNewTasks() {
      // Make sure the user is logged in
      if (!this.$parent.userId) {
        console.error("We couldn't find your userID! This shouldn't be possible.");
        return;
      }

      // Initialize an array that will keep track of tasks of the new
      // hackathon's timeline
      var taskList = [];

      this.hackathonId = this.$store.getters['hackathons/dbRef'].doc().id

      // Create a new task and add it to the tasks collection
      const taskId1 = this.$store.getters['tasks/dbRef'].doc().id;
      taskList.push(taskId1)
      this.$store.dispatch('tasks/set', {
        id: taskId1,
        hackathon: this.hackathonId,
        title: "Swag: T-shirts",
        description: "Design and order t-shirts for the event.",
        tags: ["finance", "design"]
      }).catch(err => {
        console.error("Error initializing task: ", err)
      })

      // Repeat process
      const taskId2 = this.$store.getters['tasks/dbRef'].doc().id;
      taskList.push(taskId2)
      this.$store.dispatch('tasks/set', {
        id: taskId2,
        hackathon: this.hackathonId,
        title: "Second wave of sponsor emails",
        description: "Remind sponsors why you're worth it.",
        tags: ["promotion"]
      }).catch(err => {
        console.error("Error initializing task: ", err)
      })
      this.addNewHackathon(taskList);
      console.log(taskList, taskId1, taskId2)
    }
  },
  components: {
    Loading,
    ManageOrgModal,
    graph2d,
    TaskCircleDisplay,
  },
  computed: {
    users() {
      return this.$store.getters['users/storeRef']
    },
    currentUser() {
      return this.users[`${this.$parent.userId}`]
    },
    orgs() {
      return this.$store.getters['orgs/storeRef']
    },
    hackathons() {
      return this.$store.getters['hackathons/storeRef']
    },
    tasks() {
      return this.$store.getters['tasks/storeRef']
    }
  }
};
</script>

<style scoped lang="scss">
@import '@/GlobalVars.scss';

  #bg-spikes {
    position: absolute;
    z-index: -1;
    width: 50%;
    right: 0px;
    opacity: .9;
  }

  #landing {
    padding: 50px;
    display: flex;
    justify-content: space-between;
    align-items: stretch;
    z-index: 1;
  }
  #project-choice {
    text-align: left;
    padding: 20px 10vw;
    z-index: 10;
    position: relative;
  }
  #promo-container {
    background: $dark-gray;
    width: 45vw;
    flex-grow: 1;
    height: 70vh;
    box-shadow: $box-shading;
    display: flex;
    justify-content: space-between;

    @media screen and (max-width: 1000px) {
      display: none;
    }
  }
  #call-to-action {
    padding-top: 10vh;
    padding-right: 5vw;
    margin-left: 5vw;
    width: 40vw;
    @media screen and (max-width: 1000px) {
      width: 90vw;
    }
    flex-grow: 1;
    height: 60vh;
    text-align: right;
    p:not(.under-button) {
      margin: 0px;
      margin-bottom: 10px;
      text-shadow: 2px 2px 5px rgba(0,0,0,.5);
    }
    .title {
      font-size: 50px;
    }
  }
  #get-started {
    text-align: center;
    margin-top: 50px;

  }

  button {
    margin-top: 20px;

  }

  #orgList {
    display: flex;
    flex-flow: row wrap;
    align-items: flex-start;
  }

  .new-org {
    // max-width: 200px;
    min-width: 150px;
    margin-top: 20px;
    margin-right: 20px;
    text-align: center;
    transition-duration: .5s;
    max-height: 25px;
    overflow-y: hidden;
    position: relative;

    input {
      background: none;
      border: none;
      outline: none;
      font-size: 16px;
      border-bottom: solid white 2px;
      width: 100%;
      color: white;
    }
  }
  
  .expanded-org {
    transition-duration: 1s;
    max-height: 500px;
    background: $purple-gradient;
  }
  .hackathon-item {
    // border: solid 1px black;
    position: relative;
    left: 0px;
    width: 100%;
  }

  .hackathon-opt {
    background: $gray;
  }

  .opt {
    font-size: 15px;
    padding: 5px;
    text-align: center;
    border-radius: 7px;
    box-shadow: $box-shading;
    margin: auto 0;
    margin-top: 15px;
    margin-left: 50%;
    transform: translatex(-50%);
    width: 100%;
  }
  .new-hackathon-opt {
    background: $blue;
  }
  .manage-org-opt {
    background: $blue;
  }
</style>
