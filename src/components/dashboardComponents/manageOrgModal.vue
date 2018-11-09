<template>
  <transition name="modal">
    <div class="popup-background">
      <div class="popup-wrapper" @click="$parent.showOrgModal = false">
        <div class="popup-table purple-gradient" style="align: center" @click.stop>
          <h2>Manage Organization</h2>
          <h3>Collaborators:</h3>
          <input type="text" v-model="collabSearch" v-on:input="getSearchResults">
        </input><br><br>
          <select v-if="collabSearch == ''" v-model="collabSelect" multiple>
            <option v-for="collab in collabObjs">{{collab.email}}</option>
          </select>
          <select v-if="!collabSearch == ''" v-model="collabSelect" multiple>
            <option v-for="collab in collabResults">{{collab.email}}</option>
          </select>
          <br><br>
          <div style="display: flex" justify-content>
            <button class="material-button-large" @click="getNewCollabId()">Add Collaborator</button>
            <button class="material-button-large" @click="getCollabIdToRemove()">Remove Collaborator</button>
          </div>
          <br>
          <div style="display: flex">
            <button class="material-button-large" @click="deleteOrg()">Delete Organization</button>
            <button class="material-button-large" @click="$emit('close')">Close</button>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
  export default {
    data() {
      return {
        showOrgModal: false,
        hackathonId: '',
        collabIds: [],
        collabObjs: [],
        collabSearch: '',
        collabResults: [],
        collabSelect: []
      }
    },
    props: {
      orgId: {
        type: String,
        required: true
      }
    },
    mounted() {
      // Get the collaborator id's
      this.collabIds = this.orgs[`${this.orgId}`].collaborators;

      // Get the collaborator objects
      for (var collabId in this.collabIds) {
        this.collabObjs.push({
          id: this.users[`${this.collabIds[collabId]}`].id,
          email: this.users[`${this.collabIds[collabId]}`].email
        });
      }
    },
    methods: {
      getCollabIdToRemove() {
        // Make sure the user is an org collaborator
        if (!this.collabIds.includes(this.$parent.$parent.userId)) {
          console.error("You must be an organization collaborator to remove collaborators.");
          return;
        }

        // Get the id(s) of the selected collab(s) and call removeCollaborator for each
        this.collabSelect.forEach((element) => {

          // Try to find the account matching the email (collabSelect will contain emails)
          this.$store.dispatch('users/fetch', {whereFilters: [['email', '==', element]]})
          .then(querySnapshot => {
            if (querySnapshot.empty == true) {
              console.log("There is no account associated with this email.");
              console.log("Please try again after an account has been made");
            }
            else {
              this.removeCollaborator(querySnapshot.docs[0].id)
            }
          })
        })
      },
      removeCollaborator(collabIdToRemove) {
        // TODO: check if there is at least one collab in an org
        // Get the user object for the collaborator being removed
        var collabToRemove = this.users[`${collabIdToRemove}`]

        // Remove the org from the user's orgs
        var newOrgList = collabToRemove.orgs;
        delete newOrgList[this.orgId];
        console.log(collabIdToRemove, this.orgId, newOrgList)

        this.$store.dispatch('users/set', {[`${collabIdToRemove}`]: {
          orgs: newOrgList
        }}).catch(err => {
          console.error("Error removing org from collaborator's orgs", err)
        })

        // Remove the collaborator from the org's collaborators
        var newCollabList = this.collabIds;
        var indexOfCollab = newCollabList.indexOf(collabIdToRemove);
        if (indexOfCollab !== -1) newCollabList.splice(indexOfCollab, 1);

        this.$store.dispatch('orgs/set', {[`${this.orgId}`]: {
          collaborators: newCollabList
        }}).catch(err => {
          console.error("Error removing collaborator from org ", err)
        })
      },
      addCollaborator(newCollabId) {
        // TODO: add check to see if user is already a collab
        // Will need some sort of if statement here (if no results found...)
        var newCollab = this.users[`${newCollabId}`];

        // Used to update the new collaborator's list of orgs
        var updateUserObj = {
          orgs: {}
        }
        if (newCollab.orgs) {
          updateUserObj.orgs = newCollab.orgs;
        }
        updateUserObj.orgs[this.orgId] = {
          role: 'collaborator'
        }

        this.$store.dispatch('users/set', {[`${newCollab.id}`]: {
          orgs: updateUserObj.orgs
        }}).catch(err => {
          console.error("Error adding org to new collab's orgs ", err)
        })

        // Used to update the org's list of collaborators
        var newCollabList = this.collabIds;
        newCollabList.push(newCollab.id);

        this.$store.dispatch('orgs/set', {[`${this.orgId}`]: {
          collaborators: newCollabList
        }}).then(() => {
          this.collabObjs.push(newCollab)
        }).catch(err => {
          console.error("Error adding collaborator to org ", err)
        })
      },
      getNewCollabId() {
        // Make sure the user is an org collaborator
        if (!this.collabIds.includes(this.$parent.$parent.userId)) {
          console.error("You must be an organization collaborator to add collaborators.");
          return;
        }

        // Try to find the account matching the email
        this.$store.dispatch('users/fetch', {whereFilters: [['email', '==', this.collabSearch]]})
        .then((querySnapshot) => {
          if (querySnapshot.empty == true) {
            console.log("There is no account associated with this email.")
            console.log("Please try again after an account has been made.")
          }
          else {
            this.addCollaborator(querySnapshot.docs[0].id);
          }
        })
      },
      deleteOrg(org) {
        // Make sure the user is an org collaborator
        if (!this.collabIds.includes(this.$parent.$parent.userId)) {
          console.error("You must be an organization collaborator to delete the organization.");
          return;
        }

        // Confirming they actually want to delete
        if (!confirm('Are you sure you want to delete this org? This can\'t be undone!')) {
          return;
        }

        //Getting list of hackathons from org
        //If org has hackathons/tasks, delete all of them from firebase
        if (this.orgs[`${this.orgId}`].hackathons != undefined) {
          for (var id in this.orgs[`${this.orgId}`].hackathons) {
            this.hackathonId = id;
            let localTasks = this.hackathonTasks

            for (var taskId in localTasks) 
              this.$store.dispatch('tasks/delete', localTasks[taskId].id)
            
            this.$store.dispatch('hackathons/delete', this.hackathonId)
          }
        }

        //Removing org from user data
        var newUserOrgs = {
          orgs: {}
        };
        for (var orgDelete in this.currentUser.orgs){
          console.warn(orgDelete)
          if (this.orgId != orgDelete)
            newUserOrgs.orgs[orgDelete] = {role: this.currentUser.orgs[orgDelete].role};
        }
        this.$store.dispatch('users/set', {[`${this.currentUser.id}`]: {
          orgs: newUserOrgs.orgs
        }})
        //Deleting org from firebase
        this.$store.dispatch('orgs/delete', this.orgId)
        .then(() => {
          console.log("Org deleted successfully")
        }).catch(err => {
          console.error("Cannot delete org: ", err)
        })
      },
      getSearchResults() {
        this.collabResults = this.collabObjs.filter((collabObj) => {
          return collabObj.email.toLowerCase().includes(this.collabSearch.toLowerCase());
        })
      }
    },
    computed: {
      users() {
        return this.$store.getters['users/storeRef']
      },
      currentUser() {
        return this.users[`${this.$parent.$parent.userId}`]
      },
      orgs() {
        return this.$store.getters['orgs/storeRef']
      },
      tasks() {
        return this.$store.getters['tasks/storeRef']
      },
      hackathonTasks() {
        return this.$store.getters['tasks/hackathonTasks'](this.hackathonId)
      },
      hackathons() {
        return this.$store.getters['hackathons/storeRef']
      }
    }
  }
</script>

<style scoped lang="scss">
@import '@/GlobalVars.scss';

/*  Note that this only applies to this page's material button: */
  .material-button-large {
    background: $gray;
    color: white;
  }
</style>
