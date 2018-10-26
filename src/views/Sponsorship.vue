<template>
  <div id="sponsorship-dashboard" v-if="$parent.user">

    <!-- Sponsor List. -->
    <div class="dark-widget">
        <input type="text" v-bind="filterText" />
    </div>

    <!-- Funding burndown. -->
    <div class="dark-widget">
    </div>

    <!-- Contact timelines. -->
    <div class="dark-widget">
    </div>

  </div>
</template>

<script>
export default {
  data() {
    return {
      hackathonId: this.$route.params.hackathonId,
      timeline: [],
      hackathonTasks: [],
      filterText: ''
    }
  },
  mounted() {

  },
  methods: {
      
  },
  computed: {
    filteredList() {
      return this.postList.filter(post => {
        return post.title.toLowerCase().includes(this.search.toLowerCase())
      })
    }
  },
  components: {

  }
}
</script>

<style scoped lang="scss">
@import '@/GlobalVars.scss';

.dark-widget {
  background-color: $dark-gray;
  width: 40%;
  height: 500px;
  margin-top: 25px;
}

h3, h4 {
  margin: 0;
}

h4 {
  opacity: .5;
}

</style>
