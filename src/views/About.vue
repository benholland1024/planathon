<template>
  <div class="about">
    <h1>This is an about page - there's nothing here yet!</h1>
    <div v-for="user in users">
      {{user.id}}
    </div>
    <div v-for="org in orgs">
      {{org.id}}
    </div>
  </div>
</template>


<script>

export default {
  data() {
    return {

    }
  },
  computed: {
    users() {
      return this.$store.getters['users/storeRef']
    },
    orgs() {
      return this.$store.getters['orgs/storeRef']
    }
  }
}
</script>
