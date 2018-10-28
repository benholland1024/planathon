<template>
  <transition name="modal">
    <div class="popup-background">
      <div class="popup-wrapper">
        <div class="popup-table purple-gradient" style="align: center">
          <h2>Manage Organization</h2>
          <h3>Collaborators:</h3>
          <input type="text" v-model="collabSearch" v-on:input="getSearchResults">
        </input><br><br>
          <select v-if="collabSearch == ''" multiple>
            <option v-for="collab in collabObjs">{{collab.email}}</option>
          </select>
          <select v-if="!collabSearch == ''" multiple>
            <option v-for="collab in collabResults">{{collab.email}}</option>
          </select>
          <br><br>
          <div style="display: flex" justify-content>
            <button class="material-button-large" @click="addCollaborator()">Add Collaborator</button>
            <button class="material-button-large" @click="$emit('close')">Remove Collaborator</button>
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
        collabResults: []
      }
    },
    props: {
      orgId: {
        type: String,
        required: true
      }
    },
    mounted() {
      // Get the collaborator ids
      this.$parent.$parent.db.collection('orgs').doc(this.orgId).get()
      .then((docRef) => {
        this.collabIds = docRef.data().collaborators;

        // Get the collaborator objects
        for (var collabId in this.collabIds) {
          this.$parent.$parent.db.collection('users').doc(this.collabIds[collabId]).get()
          .then((docRef) => {
            this.collabObjs.push({
              id: docRef.data().id,
              email: docRef.data().email
            });
          }).catch((err) => {
            console.log("Error getting collaborator objects: ", err);
          });
        }

      }).catch((err) => {
        console.log("Error getting collaborator ids: ", err);
      });
    },
    methods: {
      addCollaborator() {
        // Make sure the user is an org collaborator
        if (!collabIds.includes(this.$parent.$parent.user.id)) {
          console.error("You must be an organization collaborator to add collaborators.");
          return;
        }

        // Needs to be written still

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
