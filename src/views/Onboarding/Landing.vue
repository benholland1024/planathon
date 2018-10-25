<template>
<loading v-if="$parent.loadingUser">
</loading>
<div id="landing" v-else-if="!$parent.user">
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
    Below is a list of the organization. Click on any of them to see their details!
  </div>

  <div id="orgList">
    <div class="material-button-large orange-gradient new-org"
          @click="selectOrg(org, orgIndex)" v-for="(org, orgIndex) in $parent.userOrgs"
          :key="orgIndex" :class="{
            'expanded-org': selectedOrg === orgIndex
          }">
          <div @click="deleteOrg(org)">x</div>
      <span>{{org.name}}</span>
      <div style="text-align: left;" v-if="org.hackathons">
        <h4 style="margin-left: -10px;">Hackathons:</h4>
        <router-link tag="div" :to="'/dashboard/' + hackathon.id" v-for="hackathon in org.hackathons"
                    :key="hackathon.id" class="hackathon-item">
          {{ hackathon.name }}
        </router-link>
        <div class="hackathon-item" style="text-decoration: underline">
          + New Hackathon
        </div>
      </div>
    </div>

    <div class="material-button-large orange-gradient new-org"
          @click="selectOrgInput()">
      <span v-if="!orgInput">
        + New Organization
      </span>
      <input v-else v-model="orgName" @keyup.enter="addNewOrg()" ref="newOrg">
    </div>

    <div class="material-button-large orange-gradient new-org" 
          @click="selectHackathonInput()">
      <span v-if="!hackathonInput">
        + New Hackathon
      </span>
      <input v-else v-model="hackathonName" @keyup.enter="addNewHackathon()" ref="newHackathon">
    </div>
  </div>

</div>
</template>

<script>
import LineGraph from '@/components/Charts/LineGraph.js';
import PolarGraph from '@/components/Charts/PolarGraph.js';
import Loading from '@/components/Loading.vue';

export default {
  name: 'Landing',
  data() {
    return {
      orgInput: false,
      orgName: '',
      hackathonInput: false,
      hackathonName: '',

      selectedOrg: '',
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

        var updateOrgObj = {
          id: docRef.id
        }

        this.$parent.db.collection('orgs').doc(docRef.id).update(updateOrgObj)
        .then(() => {
          console.log(" Id added to org! Nice!")
        }).catch(err => {
          console.error("error: ", err);
        })

        // Setting up an object to update the user's list of orgs
        var updateObj = {
          orgs: {}
        }
        if (this.$parent.user.orgs) {
          updateObj.orgs = this.$parent.user.orgs;
        }
        updateObj.orgs[docRef.id] = {
          role: 'admin'
        }
        this.$parent.db.collection('users').doc(this.$parent.user.id).update(updateObj)
        .then(() => {
          console.log("Org added to user orgs! Nice!")
        }).catch(err => {
          console.error("error: ", err);
        })

        this.$parent.db.collection('users').doc(this.$parent.user.id).get()
        .then((response) => {
          var doc = response.data();
          for (var org in doc.orgs) {
            updateObj.orgs[org] = {role: doc.orgs[org].role};
          }
          updateObj.orgs[docRef.id] = {
            role: 'admin'
          }
          this.$parent.db.collection('users').doc(this.$parent.user.id).update(updateObj)
          .then(() => {
            this.$parent.db.collection('orgs').doc(docRef.id).get()
            .then((res) => {
              this.$parent.userOrgs.push(res.data());
            })

          }).catch(err => {
            console.error("error: ", err);
          })

        })

      }).catch((err) => {
        console.error("Error submitting your org: ", err);
      })
    },
    selectOrg(org, index) {
      console.log(org, index)
      this.selectedOrg = index;
      this.$parent.org = org;
    },
    selectHackathonInput() {
      this.hackathonInput = true;
      var vm = this;
      setTimeout(() => {
        vm.$refs.newHackathon.focus();
      }, 200);
    },
    addNewHackathon() {
      console.log(this.hackathonName);
      if (!this.$parent.user.id) {
        console.error("We couldn't find your userID! This shouldn't be possible.");
        return;
      }
      this.$parent.db.collection('hackathons').add({
        name: this.hackathonName,
        timeline: [
          {
            description: "Design and order t-shirts for the event.",
            tags: ["finance", "design"],
            title: "Swag: T-shirts"
          },
          {
            description: "Remind sponsors why you're worth it.",
            tags: ["promotion"],
            title: "Second Wave of Sponsor Emails"
          }
        ]
      }).then((docRef) => {

        var updateHackObj = {
          id: docRef.id
        }

        this.$parent.db.collection('hackathons').doc(docRef.id).update(updateHackObj)
        .then(() => {
          console.log(" Id added to hackathon! Nice!")
        }).catch(err => {
          console.error("error: ", err);
        })

        // Setting up an object to update the user's list of orgs
        // A codepen explaining what's happening here:
        //    https://codepen.io/bhollan5/pen/cf1fc208dea42754f87578a92f47121d?editors=0011
        var updateObj = {
          hackathons: {}
        }
        if (this.$parent.org.hackathons) {
          updateObj.hackathons = this.$parent.org.hackathons;
        }
        updateObj.hackathons[docRef.id] = {
          id: docRef.id
        }
        console.log("org.id:")
        console.log(this.$parent.org)
        this.$parent.db.collection('orgs').doc(this.$parent.org.id).update(updateObj)
        .then(() => {
          console.log("Org added to user orgs! Nice!")
        }).catch(err => {
          console.error("error: ", err);
        })

      }).catch((err) => {
        console.error("Error submitting your org: ", err);
      })
    },
    deleteOrg(org) {
      //Getting list of hackathons from org
      this.$parent.db.collection('orgs').doc(org.id).get()
      .then((response) => {
        
        //If org has hackathons, delete all of them from firebase
        if (response.data().hackathons != undefined)
          for (var id in response.data().hackathons) {
            this.$parent.db.collection('hackathons').doc(id).delete()
            .then(() => {
              console.log(id, "deleted successfully");
            });
          }
        
        //Removing org from user data
        var newUserOrgs = {
          orgs: {}
        };
        this.$parent.db.collection('users').doc(this.$parent.user.id).get()
        .then((user) => {
          for (var orgId in user.data().orgs)
            if (org.id != orgId)
              newUserOrgs.orgs[orgId] = {role: user.data().orgs[orgId].role};
            //Update user orgs with new org list
          this.$parent.db.collection('users').doc(this.$parent.user.id).update(newUserOrgs);
        })
         
        //Deleting org from firebase
        this.$parent.db.collection('orgs').doc(org.id).delete()
        .then(() => {
          console.log("Org deleted successfully");
        }).catch((err) => {
          console.log("Error: ", err);
        });
      }).catch((err) => {
        console.log("Cannot get org", err);
      });
       //Find the index of the org in userOrgs to auto refresh the page
      for (var i in this.$parent.userOrgs)
        if (this.$parent.userOrgs[i].id == org.id) {
          this.$parent.userOrgs.splice(i, 1);
          break;
        }
    },
  },
  components: {
    LineGraph,
    PolarGraph,
    Loading,
  }
};
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
</style>
