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

      <span>{{org.name}}</span>
      <div style="text-align: left;" v-if="org.hackathons">
        <h4 style="margin-left: -10px;">Hackathons:</h4>
        <router-link tag="div" :to="'/dashboard/' + hackathon.id" v-for="hackathon in org.hackathons"
                    :key="hackathon.id" class="hackathon-item">
          {{ hackathon.name }}
        </router-link>
      </div>
      <div v-else>
        <h4>No hackathons yet!</h4>
      </div>
      <div class="hackathon-item new-hackathon-opt opt" @click="hackathonInput = true">
        <span v-if="!hackathonInput">
          + New Hackathon
        </span>
        <input v-else v-model="hackathonName" @keyup.enter="addNewTasks()" ref="newHackathon">
      </div>

      <!-- manageOrgModal -->
      <div class="hackathon-item new-hackathon-opt opt" @click="showOrgModal = true">Manage Organization</div>
      <manage-org-modal :orgId="org.id" v-if="showOrgModal == true" @close="showOrgModal = false">
      </manage-org-modal>

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
import Loading from '@/components/Loading.vue';
import ManageOrgModal from '@/components/dashboardComponents/manageOrgModal.vue'
import graph2d from '@/components/Visualization/graph2d.vue';
import vis from 'vis';
import 'vis/dist/vis.min.css';
import ManageCollabsModal from '@/components/dashboardComponents/manageCollabsModal.vue'

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
      if (!this.$parent.user.id) {
        console.error("We couldn't find your userID! This shouldn't be possible.");
        return;
      }

      //Check to see if org name is already in use
      this.$parent.db.collection('orgs').where("name", "==", this.orgName).get()
      .then((data) => {
        if (data.empty == true) {

          // Create a new org and add it to the orgs collection
          var collabsList = [];
          collabsList.push(this.$parent.user.id);
          this.$parent.db.collection('orgs').add({
            name: this.orgName,
            collaborators: collabsList
          }).then((docRef) => {

            // This is used to update the new org, so it holds it's id
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
        }
        else {
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
      if (!this.$parent.user.id) {
        console.error("We couldn't find your userID! This shouldn't be possible.");
        return;
      }

      // Create a new hackathon and add it to the hackathons collection
      this.$parent.db.collection('hackathons').add({
        name: this.hackathonName,
        timeline: taskList
      }).then((docRef) => {

        // Add the hackathon id to the tasks
        taskList.forEach((taskElem) => {
          var updateTEObj = {
            hackathon: docRef.id
          }

          this.$parent.db.collection('tasks').doc(taskElem).update(updateTEObj)
          .then(() => {
            console.log("Added hackathon id to task! Nice!")
          }).catch(err => {
            console.error("error: ", err);
          })
        })

        // This is used to update the new hackathon so it holds it's id
        var updateHackObj = {
          id: docRef.id
        }

        this.$parent.db.collection('hackathons').doc(docRef.id).update(updateHackObj)
        .then(() => {
          console.log(" Id added to hackathon! Nice!")
        }).catch(err => {
          console.error("error: ", err);
        })

        // Setting up an object to update the org's list of hackathons
        var updateObj = {
          hackathons: {}
        }
        if (this.$parent.org.hackathons) {
          updateObj.hackathons = this.$parent.org.hackathons;
        }
        updateObj.hackathons[docRef.id] = {
          id: docRef.id
        }

        this.$parent.db.collection('orgs').doc(this.$parent.org.id).update(updateObj)
        .then(() => {
          console.log("Org added to user orgs! Nice!")

          //Updating hackathon list
          while (this.$parent.userOrgs[0]) {
            this.$parent.userOrgs.pop();
          }
          this.$parent.loadOrgs();
          this.hackathonInput = false;
          this.hackathonName = '';
        }).catch(err => {
          console.error("error: ", err);
        })
      }).catch((err) => {
        console.error("Error submitting your org: ", err);
      })
    },
    addNewTasks() {
      // Make sure the user is logged in
      if (!this.$parent.user.id) {
        console.error("We couldn't find your userID! This shouldn't be possible.");
        return;
      }

      // Initialize an array that will keep track of tasks for the new
      // hackathon's timeline
      var taskList = [];

      // Create a new task and add it to the tasks collection
      this.$parent.db.collection('tasks').add({
        title: "Swag: T-shirts",
        description: "Design and order t-shirts for the event.",
        tags: ["finance", "design"]
      }).then((docRef) => {

        // Push the new task id to the taskList
        taskList.push(docRef.id);

        // This is used to update the new task so it holds it's id
        var updateTaskObj = {
         id: docRef.id
        }

        this.$parent.db.collection('tasks').doc(docRef.id).update(updateTaskObj)
        .then(() => {
         console.log(" Id added to task! Nice!")
        }).catch(err => {
         console.error("error: ", err);
        })
      }).catch((err) => {
       console.error("Error initializing hackathon tasks: ", err);
      })

      // Repeat/add a second task (same process as above)
      this.$parent.db.collection('tasks').add({
        title: "Second Wave of Sponsor Emails",
        description: "Remind sponsors why you're worth it.",
        tags: ["promotion"]
      }).then((docRef) => {
        taskList.push(docRef.id);

        // This is the only spot where taskList was correctly passed
        this.addNewHackathon(taskList);

        var updateTaskObj = {
          id: docRef.id
        }
        this.$parent.db.collection('tasks').doc(docRef.id).update(updateTaskObj)
        .then(() => {
          console.log(" Id added to task! Nice!")
        }).catch(err => {
          console.error("error: ", err);
        })
      }).catch((err) => {
        console.error("Error initializing hackathon tasks: ", err);
      })
    }
  },
  components: {
    Loading,
    ManageOrgModal,
    graph2d
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
  }
  .new-hackathon-opt {
    background: $blue;
  }
  .delete-opt {
    background: $pink;
  }
</style>
