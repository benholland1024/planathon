<template>
  <transition name="modal">
    <div class="popup-background">
      <div class="popup-wrapper">
        <div class="popup-table purple-gradient" style="align: center">
          <h2>Manage Organization</h2>
          <p>{{orgId}}</p>
          <button class="material-button-large" @click="deleteOrg()">Delete Organization</button><br><br>
          <button class="material-button-large" @click="$emit('close')">Close</button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
  export default {
    data() {
      return {
        showCollabsModal: false
      }
    },
    props: {
      orgId: {
        type: String,
        required: true
      }
    },
    mounted() {

    },
    methods: {
      deleteOrg(org) {
        // Confirming they actually want to delete
        if (!confirm('Are you sure you want to delete this org? This can\'t be undone!')) {
          return;
        }

        //Getting list of hackathons from org
        this.$parent.$parent.db.collection('orgs').doc(this.orgId).get()
        .then((response) => {

          //If org has hackathons, delete all of them from firebase
          if (response.data().hackathons != undefined)
            for (var id in response.data().hackathons) {
              this.$parent.$parent.db.collection('hackathons').doc(id).delete()
              .then(() => {
                console.log(id, "deleted successfully");
              });
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
        for (var i in this.$parent.$parent.userOrgs)
          if (this.$parent.$parent.userOrgs[i].id == this.orgId) {
            this.$parent.$parent.userOrgs.splice(i, 1);
            break;
          }
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
