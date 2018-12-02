<template>
  <transition name="modal">
    <div class="popup-background">
      <div class="popup-wrapper" @click="$parent.showOrgModal = false">
        <div class="popup-table purple-gradient" style="align: center" @click.stop>
          <h2>Manage Organization</h2>
          <p>Search for a user by email, or enter a new email to invite someone to your team!</p>

          <input type="text" v-model="collabSearch" v-on:input="getSearchResults" class="auth-textbox">
          </input><br><br>
          <div style="display: flex;justify-content:space-around;">
            <div>
              <p>Admins:</p>
              <select v-if="collabSearch == ''" v-model="adminSelect" class="auth-textbox" multiple>
                <option v-for="admin in adminObjs" :value="admin">{{admin.email}}</option>
              </select>
              <select v-if="!collabSearch == ''" v-model="adminSelect" class="auth-textbox" multiple>
                <option v-for="admin in adminResults" :value="admin">{{admin.email}}</option>
              </select>
            </div>
            <div>
              <p>Collaborators:</p>
              <select v-if="collabSearch == ''" v-model="collabSelect" class="auth-textbox" multiple>
                <option v-for="collab in collabObjs" :value="collab">{{collab.email}}</option>
              </select>
              <select v-if="!collabSearch == ''" v-model="collabSelect" class="auth-textbox" multiple>
                <option v-for="collab in collabResults" :value="collab">{{collab.email}}</option>
              </select>
            </div>
          </div>
          <br><br>
          <div style="display: flex;justify-content: space-between">
            <button class="material-button-large" @click="getNewCollabId()">Add Collaborator</button>
            <button class="material-button-large" @click="removeCollaborator()">Remove Collaborator</button>
          </div>
          <br>
          <div style="display: flex;justify-content: space-between">
            <button class="material-button-large" @click="promoteCollab()">Promote Collaborator</button>
            <button class="material-button-large" @click="demoteAdmin()">Demote Admin</button>
          </div>
          <br>
          <div style="display: flex;justify-content: space-between">
            <button class="material-button-large delete-button" @click="deleteOrg()">Delete Organization</button>
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
        adminIds: [],
        collabObjs: [],
        adminObjs: [],
        collabSearch: '',
        collabResults: [],
        collabSelect: [],
        adminResults: [],
        adminSelect: []
      }
    },
    props: {
      orgId: {
        type: String,
        required: true
      }
    },
    mounted() {
      // Get the collaborator and admin id's
      this.collabIds = this.orgs[`${this.orgId}`].collaborators;
      this.adminIds = this.orgs[`${this.orgId}`].admins;

      // Get the collaborator objects
      for (var collabId in this.collabIds) {

        this.collabObjs.push({
          id: this.users[`${this.collabIds[collabId]}`].id,
          email: this.users[`${this.collabIds[collabId]}`].email
        });
      }

      // Get the admin objects
      for (var adminId in this.adminIds) {

        this.adminObjs.push({
          id: this.users[`${this.adminIds[adminId]}`].id,
          email: this.users[`${this.adminIds[adminId]}`].email
        });
      }
    },
    methods: {
      promoteCollab() {
        // Make sure the user is an org admin
        if (!this.currentUser.orgs[this.orgId].role == "admin") {
          var errMsg = "You must be an organization admin to promote a collaborator.";
          this.$parent.$parent.messages.push(errMsg);
          return;
        }

        // initialize vars to keep track of new collab/admin lists
        var newAdminIds = this.adminIds;
        var newAdminObjs = this.adminObjs;
        var newCollabIds = this.collabIds;
        var newCollabObjs = this.collabObjs;

        // since users can promote more than one collab at one, loop through selected collabs
        this.collabSelect.forEach(collab => {

          // add id to org admins list
          newAdminIds.push(collab.id);
          newAdminObjs.push({
            id: collab.id,
            email: collab.email
          });

          // remove id from org collabs list
          var indexOfCollab = newCollabIds.indexOf(collab.id);
          if (indexOfCollab !== -1) {
            newCollabIds.splice(indexOfCollab, 1);
          }
          indexOfCollab = newCollabObjs.findIndex((currentObj) => {
            return (currentObj.id == collab.id);
          });
          if (indexOfCollab !== -1) {
            newCollabObjs.splice(indexOfCollab, 1);
          }

          var updateObj = {
            orgs: {}
          }
          if (collab.orgs) {
            updateObj.orgs = collab.orgs;
          }
          updateObj.orgs[this.orgId] = {
            role: "admin"
          }

          // update user role to admin
          this.$store.dispatch('users/set', {[`${collab.id}`]: {
            orgs: updateObj.orgs
          }}).catch(err => {
            var errMsg = "Error promoting collaborator: " + err;
            this.$parent.$parent.messages.push(errMsg);
          })
        });

        // make one call to update org collabs/admins once lists have been updated
        this.$store.dispatch('orgs/set', {[`${this.orgId}`]: {
          collaborators: newCollabIds,
          admins: newAdminIds
        }}).then(() => {
          this.collabIds = newCollabIds;
          this.collabObjs = newCollabObjs;
          this.adminIds = newAdminIds;
          this.adminObjs = newAdminObjs;
        }).catch(err => {
          var errMsg = "Error updating organization collaborators and admins: " + err;
          this.$parent.$parent.messages.push(errMsg);
        });

      },
      demoteAdmin() {
        // Make sure the user is an org admin
        if (!this.currentUser.orgs[this.orgId].role == "admin") {
          var errMsg = "You must be an organization admin to demote an admin.";
          this.$parent.$parent.messages.push(errMsg);
          return;
        }

        // initialize vars to keep track of new collab/admin lists
        var newAdminIds = this.adminIds;
        var newAdminObjs = this.adminObjs;
        var newCollabIds = this.collabIds;
        var newCollabObjs = this.collabObjs;

        // since users can promote more than one collab at one, loop through selected collabs
        this.adminSelect.forEach(admin => {

          // add id to org collabs list
          newCollabIds.push(admin.id);
          newCollabObjs.push({
            id: admin.id,
            email: admin.email
          });

          // remove id from org admins list
          var indexOfAdmin = newAdminIds.indexOf(admin.id);
          if (indexOfAdmin !== -1) newAdminIds.splice(indexOfAdmin, 1);
          indexOfAdmin = newAdminObjs.findIndex((currentObj) => {
            return currentObj.id == admin.id;
          });
          if (indexOfAdmin !== -1) newAdminObjs.splice(indexOfAdmin, 1);

          // update org collabs/admins once lists have been updated
          this.$store.dispatch('orgs/set', {[`${this.orgId}`]: {
            collaborators: newCollabIds,
            admins: newAdminIds
          }}).then(() => {
            this.collabIds = newCollabIds;
            this.collabObjs = newCollabObjs;
            this.adminIds = newAdminIds;
            this.adminObjs = newAdminObjs;
          }).catch(err => {
            var errMsg = "Error updating organization collaborators and admins: " + err;
            this.$parent.$parent.messages.push(errMsg);
          });

          var updateObj = {
            orgs: {}
          }
          if (admin.orgs) {
            updateObj.orgs = admin.orgs;
          }
          updateObj.orgs[this.orgId] = {
            role: "collaborator"
          }

          // update user role to collab
          this.$store.dispatch('users/set', {[`${admin.id}`]: {
            orgs: updateObj.orgs
          }}).catch(err => {
            var errMsg = "Error demoting admin: " + err;
            this.$parent.$parent.messages.push(errMsg);
          })
        });

      },
      removeCollaborator() {
        // Make sure the user is an org admin
        if (!this.currentUser.orgs[this.orgId].role == "admin") {
          var errMsg = "You must be an organization admin to delete an organization.";
          this.$parent.$parent.messages.push(errMsg);
          return;
        }

        var newCollabIds = this.collabIds;
        var newCollabObjs = this.collabObjs;

        this.collabSelect.forEach(collab => {

          // remove id from org collabs list
          var indexOfCollab = newCollabIds.indexOf(collab.id);
          if (indexOfCollab !== -1) newCollabIds.splice(indexOfCollab, 1);
          indexOfCollab = newCollabObjs.indexOf(collab.id);
          if (indexOfCollab !== -1) newCollabObjs.splice(indexOfCollab, 1);

          // remove org from user orgs
          this.$store.dispatch('users/delete', `${collab.id}.orgs.${this.orgId}`
          ).catch(err => {
            console.error("Error removing org from collaborator's orgs", err)
          })

          // make one call after the org collabs list is updated
          this.$store.dispatch('orgs/set', {[`${this.orgId}`]: {
            collaborators: newCollabIds
          }}).then(() => {
            this.collabIds = newCollabIds;
            this.collabObjs = newCollabObjs;
            console.log("updating vars");
          }).catch(err => {
            console.error("Error removing collaborator from org ", err)
          })

        })

      },
      addCollaborator(newCollabId) {
        // Will need some sort of if statement here (if no results found...)
        var newCollab = this.users[`${newCollabId}`];

        // Checks to see if user is already collab
        if (this.collabIds.includes(newCollab.id)) {
          console.error("User is already a collaborator of this organization");
          return;
        }

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
        // Make sure the user is an org admin
        if (!this.currentUser.orgs[this.orgId].role == "admin") {
          var errMsg = "You must be an organization admin to delete an organization.";
          this.$parent.$parent.messages.push(errMsg);
          return;
        }

        // Try to find the account matching the email
        this.$store.dispatch('users/fetch', {whereFilters: [['email', '==', this.collabSearch]]})
        .then((querySnapshot) => {
          // If no associated account is found, create error message
          if (querySnapshot.empty == true ||  !querySnapshot.docs) {
            var errMsg = "There is no account associated with " + this.collabSearch + ". Please try again after an account has been made.";
              this.$parent.$parent.messages.push(errMsg);
          }
          // Otherwise, call the addCollaborator function with the associated id
          else {
            this.collabSearch = '';
            this.addCollaborator(querySnapshot.docs[0].id);
          }
        })
      },
      deleteOrg(org) {
        // Make sure the user is an org admin
        if (!this.currentUser.orgs[this.orgId].role == "admin") {
          var errMsg = "You must be an organization admin to delete an organization.";
          this.$parent.$parent.messages.push(errMsg);
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
        this.$store.dispatch('users/delete', `${this.currentUser.id}.orgs.${this.orgId}`)

        //Deleting org from firebase
        this.$store.dispatch('orgs/delete', this.orgId)
        .then(() => {
          console.log("Org deleted successfully")
          this.$emit('close');
        }).catch(err => {
          console.error("Cannot delete org: ", err)
        })
      },
      getSearchResults() {
        this.collabResults = this.collabObjs.filter((collabObj) => {
          return collabObj.email.toLowerCase().includes(this.collabSearch.toLowerCase());
        })
        this.adminResults = this.adminObjs.filter((adminObj) => {
          return adminObj.email.toLowerCase().includes(this.collabSearch.toLowerCase());
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

  .material-button-large {
    background: $gray;
    color: white;
    font-size: 16px;
    width: 40%;
  }
  .delete-button {
    background: $red;
  }

  .popup-table {
    min-width: 50%;
  }

  .task-options {
    display: flex;
    justify-content: space-between;
  }
  .auth-textbox {
    width: 225px;
  }

</style>
