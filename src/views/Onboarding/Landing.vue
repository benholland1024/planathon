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
  :tags="['finance', 'sponsors', 'promotion', 'design', 'general']">
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
        <div v-for="hackathon in org.hackathons" style="display: flex;flex-direction: column">

          <div class="hackathon-info-container">
            <router-link tag="div" :to="'/dashboard/' + hackathon.id"
                    :key="hackathon.id" class="hackathon-opt opt hover-shine">
              {{ hackathon.name }}
            </router-link>
            <img src="@/assets/trash.png" style="height: 20px;width: 20px;" @click="deleteHackathon(hackathon.id)">
          </div>

        </div>
      </div>
      <div v-else>
        <h4>No hackathons yet!</h4>
      </div>
      <br>
      <router-link tag="div" class="new-hackathon-opt opt hover-shine"
        :to="{ name: 'new-hackathon', params: { orgId: org.id }}">
        <span>
          + New Hackathon
        </span>
      </router-link>

      <!-- manageOrgModal -->
      <div class="hackathon-item manage-org-opt opt hover-shine" @click="showOrgModal = true">
        Organization Settings
      </div>
      <manage-org-modal :orgId="org.id" v-if="showOrgModal == true" @close="showOrgModal = false">
      </manage-org-modal>

      <!-- backup download button --> 

      <div class="hackathon-item backup-opt opt hover-shine" @click="getBackup(org)">
        Download Data Backup
      </div>

    </div>
    <div class="material-button-large orange-gradient new-org hover-shine"
          @click="selectOrgInput()">
      <span v-if="!orgInput" id="newOrgBtn">
        + New Organization
      </span>
      <input v-else v-model="orgName" @keyup.enter="addNewOrg()" ref="newOrg" id="newOrgName">
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
      start: '2016-02-10',
      end: '2016-10-15',
      items: [
        {x: '2016-02-26', y: 400},
        {x: '2016-03-01', y: 1410},
        {x: '2016-03-29', y: 2570},
        {x: '2016-04-02', y: 3220},
        {x: '2016-04-03', y: 6260},
        {x: '2016-06-06', y: 6640},
        {x: '2016-08-22', y: 7230},
        {x: '2016-08-27', y: 9200},
        {x: '2016-08-28', y: 11370},
        {x: '2016-09-04', y: 11790},
        {x: '2016-09-09', y: 13080},
        {x: '2016-09-10', y: 13570},
        {x: '2016-09-11', y: 15620},
        {x: '2016-10-04', y: 16710},
        {x: '2016-10-06', y: 19050},
        {x: '2016-10-12', y: 19730},
      ],
      orgInput: false,
      orgName: '',
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

      // Check to see if the name is blank
      if (this.orgName == '') {
        this.$parent.messages.push("Cannot create organization without a name!");
        return;
      }

      this.orgInput = false;

      // Check to see if org name is already in use
      this.$store.dispatch('orgs/fetch', {whereFilters: [['name', '==', this.orgName]]})
      .then(querySnapshot => {
        if (querySnapshot.empty == true) {

          // Create a new org and add it to the orgs collection
          var adminsList = [];

          adminsList.push(this.$parent.userId);
          const orgId = this.$store.getters['orgs/dbRef'].doc().id;
          this.$store.dispatch('orgs/insert', {
            id: orgId,
            name: this.orgName,
            collaborators: [],
            admins: adminsList
          }).catch(err => {
            console.error("Problem adding new org: ", err)
          })


          // Setting up an object to update the user's list of orgs
          var updateObj = {
            orgs: {}
          }
          if (this.users[this.$parent.userId] && this.users[this.$parent.userId].orgs) {
            updateObj.orgs = this.users[this.$parent.userId].orgs;
          }
          updateObj.orgs[orgId] = {
            role: 'admin'
          }

          // Updating user's list of orgs
          this.$store.dispatch('users/set', {[`${this.$parent.userId}`]: {orgs: updateObj.orgs}})
          .catch(err => {
            console.error("Problem updating user org list: ", err)
          })
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
    async deleteHackathon(id) {
      if (!confirm('Are you sure you want to delete this hackathon? This can\'t be undone!')) {
          return;
        }

      // Remove tasks connected to hackathon
      var deleteTasks = await this.fetchMultipleTasks(id)
      while(deleteTasks.empty == false) {
        deleteTasks.docs.forEach((doc) => {
          this.$store.dispatch('tasks/delete', doc.id)
        })
        deleteTasks = await this.fetchMultipleTasks(id)
      }

      // Update org list
      this.$store.dispatch('orgs/delete', `${this.$parent.org.id}.hackathons.${id}`)

      // Deleting hackathon
      this.$store.dispatch('hackathons/delete', id)
      .catch(err => {
        console.error("Error deleting hackathon: ", err)
      })
    },
    async fetchMultipleTasks(id) {
      var querySnapshot = await this.$store.dispatch('tasks/fetch', {whereFilters: [['hackathon', '==', id]]})
      return querySnapshot 
    },
    getBackup(org) {
      console.log("org:", org)
      const rows = [["name1", "city1", "some other info"], ["name2", "city2", "more info"]];
      let csvContent = "data:text/csv;charset=utf-8,";
      rows.forEach(function(rowArray){
        let row = rowArray.join(",");
        csvContent += row + "\r\n";
      }); 
      var encodedUri = encodeURI(csvContent);
      var link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", "my_data.csv");
      document.body.appendChild(link); // Required for FF

      link.click(); // This will download the data file named "my_data.csv".
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
    min-width: 100px;
    //display: flex;
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
    background: $light-blue;
    color: $gray;
  }
  .manage-org-opt {
    background: $light-pink;
    color: $gray;
  }
  .hackathon-info-container {
    display: flex;
    align-items: center;
    img {
      filter: brightness(10%)
    }
  }
  .backup-opt {
    background: $light-orange;
    color: $gray;
  }
</style>
