<template>
  <transition name="error-modal">
    <div class="error-popup-background">
      <div class="error-popup-wrapper">
        <div class="error-popup-table blue-gradient" style="align: center" @click.stop>
          <h2>Uh oh, you seem to have lost Internet connection</h2>
          <p>Would you like to download your org's data as a failsafe?</p>

            <button class="material-button-large" @click="downloadOrgs()">Download</button>
            <button class="material-button-large" @click="$emit('close')">Close</button>

        </div>
      </div>
    </div>
  </transition>
</template>

<script>
  export default {
    props: {
      connected: {
        type: Boolean,
        required: true
      }
    },
    data() {
      return {
        orgs: []
      }
    },
    methods: {
      downloadOrgs() {
        // Gets list of org where the user is an admin
        this.$store.dispatch('orgs/fetch', {whereFilters: [["admins", "array-contains", this.user.id]]})
        .then((querySnapshot) => {
          if (querySnapshot.empty == false)
            querySnapshot.docs.forEach((doc) => {
              this.orgs.push(doc.data())
            })
        })

        // Gets list of orgs where the user is a collaborator
        this.$store.dispatch('orgs/fetch', {whereFilters: [["collaborators", "array-contains", this.user.id]]})
        .then((querySnapshot) => {
          if (querySnapshot.empty == false)
            querySnapshot.docs.forEach((doc) => {
              this.orgs.push(doc.data())
            })
        })
        // Error message if the user is not a part of any org
        .then(() => {
          if (this.orgs.length == 0)
            this.$parent.messages.push("You have no organizations to download")

          // Create and download a json of the orgs
          else {
            console.log(this.orgs)
            var element = document.createElement('a');
            element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(JSON.stringify(this.orgs)));
            element.setAttribute('download', 'PlanathonOrgs.json');
            element.style.display = 'none';
            document.body.appendChild(element);
            element.click();
            document.body.removeChild(element);
          }
        })
      }
    },
    computed: {
      user() {
        return this.$store.getters['users/storeRef'][`${this.$parent.userId}`]
      }
    }
  };
</script>

<style scoped lang="scss">
@import '@/GlobalVars.scss';

  .material-button-large {
    background: $gray;
    color: white;
  }

</style>
