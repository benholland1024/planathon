<template>
<div id="landing" v-if="!$parent.user">
  <div id="promo-container">
    <line-graph class="small-graph"></line-graph>
    <polar-graph class="small-graph" v-if="0"></polar-graph>
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
  <h1 class="light-blue title">Welcome Back!</h1>
  <div class="dark-gray-widget" style="padding-bottom: 50px">
    Below is a list of the organization. Click on any of them to go to that hackathon's dashboard!
  </div>

  <div id="orgList">
    <div class="material-button-large orange-gradient new-org"
          @click="selectOrg(org)" v-for="(org, orgIndex) in $parent.userOrgs"
          :key="orgIndex">
      {{org.name}}
    </div>

    <div class="material-button-large orange-gradient new-org"
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
import LineGraph from '@/components/Charts/LineGraph.js';
import PolarGraph from '@/components/Charts/PolarGraph.js';
export default {
  data() {
    return {
      orgInput: false,
      orgName: ''
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
      console.log(this.orgName);
      if (!this.$parent.user.id) {
        console.error("We couldn't find your userID! This shouldn't be possible.");
        return;
      }
      this.$parent.db.collection('orgs').add({
        name: this.orgName
      }).then((docRef) => {
        
        // Setting up an object to update the user's list of orgs
        var updateObj = {
          orgs: {}
        }
        updateObj.orgs[docRef.id] = {
          role: 'admin'
        }
        this.$parent.db.collection('users').doc(this.$parent.user.id).update(updateObj)
        .then(() => {
          console.log("Nice!")
        }).catch(err => {
          console.error("error: ", err);
        })

      }).catch((err) => {
        console.error("Error submitting your org: ", err);
      })
    },
    selectOrg(org) {
      console.log(org)
    }
  },
  components: {
    LineGraph,
    PolarGraph
  }
}
</script>

<style scoped lang="scss">
@import '@/GlobalVars.scss';

  #landing {
    padding: 50px;
    display: flex;
    justify-content: space-between;
    align-items: stretch;
  }
  #project-choice {
    text-align: left;
    padding: 20px 10vw;
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
  
  .small-graph {
    width: 44%;
    padding: 1%;
  }
  
  button {
    margin-top: 20px;
    
  }

  #orgList {
    display: flex;
  }
  
  .new-org {
    max-width: 200px;
    margin-top: 20px;
    margin-right: 20px;
    
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
</style>