<template>
  <div class="about">
    <h1>This is an about page - there's nothing here yet!</h1>
    <div v-for="user in users">
      {{user.id}}
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
    }
  }
}
</script>