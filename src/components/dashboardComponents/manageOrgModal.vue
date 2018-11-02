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
        // Get the user object for the collaborator being removed
        // this.$parent.$parent.db.collection('users').doc(collabIdToRemove).get()
        // .then((result) => {
        //   var collabToRemove = result.data();

        //   // Remove the org from the user's orgs
        //   var newOrgList = collabToRemove.orgs;
        //   delete newOrgList[this.orgId];

        //   var updateUserObj = {
        //     orgs: newOrgList
        //   }

        //   this.$parent.$parent.db.collection('users').doc(collabToRemove.id).update(updateUserObj)
        //   .then(() => {
        //     console.log("Org removed from collaborator's orgs! Nice!")
        //   }).catch(err => {
        //     console.error("Error removing org from collaborator's orgs", err);
        //   })
        var collabToRemove = this.users[`${collabIdToRemove}`]

        // Remove the org from the user's orgs
        var newOrgList = collabToRemove.orgs;
        delete newOrgList[this.orgId];

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

        // var updateOrgObj = {
        //   collaborators: newCollabList
        // }

        // this.$parent.$parent.db.collection('orgs').doc(this.orgId).update(updateOrgObj)
        // .then(() => {
        //   console.log("collaborator removed from org! Nice!")
        // }).catch(err => {
        //   console.error("Error removing collaborator from org", err);
        // })

      },
      addCollaborator(newCollabId) {
        // Will need some sort of if statement here (if no results found...)
        this.$parent.$parent.db.collection('users').doc(newCollabId).get()
        .then((result) => {
          var newCollab = result.data();

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
          this.$parent.$parent.db.collection('users').doc(newCollab.id).update(updateUserObj)
          .then(() => {
            console.log("Org added to new collaborator's orgs! Nice!")
          }).catch(err => {
            console.error("Error adding org to new collaborator's orgs", err);
          })

          // Used to update the org's list of collaborators
          var newCollabList = this.collabIds;
          newCollabList.push(newCollab.id);
          var updateOrgObj = {
            collaborators: newCollabList
          }

          this.$parent.$parent.db.collection('orgs').doc(this.orgId).update(updateOrgObj)
          .then(() => {
            console.log("Collaborator added to org! Nice!")
            this.collabObjs.push(newCollab);
          }).catch(err => {
            console.error("Error adding collaborator to org", err);
          })
        })
      },
      getNewCollabId() {
        // Make sure the user is an org collaborator
        if (!this.collabIds.includes(this.$parent.$parent.user.id)) {
          console.error("You must be an organization collaborator to add collaborators.");
          return;
        }

        // Try to find the account matching the email
        this.$parent.$parent.db.collection('users').where("email", "==", this.collabSearch).get()
        .then((data) => {
          if (data.empty == true) {
            console.log("There is no account associated with this email.")
            console.log("Please try again after an account has been made.");
          }
          else {
            this.addCollaborator(data.docs[0].id);
          }
        })
      },
      deleteOrg(org) {
        // Make sure the user is an org collaborator
        if (!collabIds.includes(this.$parent.$parent.user.id)) {
          console.error("You must be an organization collaborator to delete the organization.");
          return;
        }

        // Confirming they actually want to delete
        if (!confirm('Are you sure you want to delete this org? This can\'t be undone!')) {
          return;
        }

        //Getting list of hackathons from org
        this.$parent.$parent.db.collection('orgs').doc(this.orgId).get()
        .then((response) => {

          //If org has hackathons, delete all of them from firebase
          if (response.data().hackathons != undefined) {
            for (var id in response.data().hackathons) {
              this.$parent.$parent.db.collection('hackathons').doc(id).delete()
              .then(() => {
                console.log(id, "deleted successfully");
              });
            }
          }

          //Removing org from user data
          var newUserOrgs = {
            orgs: {}
          };
          this.$parent.$parent.db.collection('users').doc(this.$parent.$parent.user.id).get()
          .then((user) => {
            for (var orgId in user.data().orgs)
              if (this.orgId != orgId)
                newUserOrgs.orgs[orgId] = {role: user.data().orgs[orgId].role};
              //Update user orgs with new org list
            this.$parent.$parent.db.collection('users').doc(this.$parent.$parent.user.id).update(newUserOrgs);
          })

          //Deleting org from firebase
          this.$parent.$parent.db.collection('orgs').doc(this.orgId).delete()
          .then(() => {
            console.log("Org deleted successfully");
          }).catch((err) => {
            console.log("Error: ", err);
          });
        }).catch((err) => {
          console.log("Cannot get org", err);
        });

         //Find the index of the org in userOrgs to auto refresh the page
        for (var i in this.$parent.$parent.userOrgs) {
          if (this.$parent.$parent.userOrgs[i].id == this.orgId) {
            this.$parent.$parent.userOrgs.splice(i, 1);
            break;
          }
        }
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
      orgs() {
        return this.$store.getters['orgs/storeRef']
      },
      tasks() {
        return this.$store.getters['tasks/storeRef']
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
