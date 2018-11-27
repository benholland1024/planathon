<template>
<div id="new-hackathon">
    <h1>Let's Plan A Hackathon!</h1>
    <div>
      <div>Your hackathon name:</div>
      <div class="description"><i>Example: Kent Hack Enough 2018</i></div>
      <input v-model="name"><br><br>

      <div>Anticipated date for your hackathon:</div>
      <div style="opacity:.5;margin-bottom: 15px;"><i>You can always change this.</i></div>
      <date-picker lang="en" v-model="date" :not-before="today"></date-picker><br><br>

      <div>Estimated guess for your hackathon's attendance:</div>
      <div class="description"><i>If you don't know, just guess! </i></div>
      <input type="number" v-model="attendance"><br><br><br>

      <button class="material-button-large hover-shine" @click="addNewTasks()">LET'S GO!</button>
    </div>
</div>
</template>

<script>
import DatePicker from 'vue2-datepicker';

export default {
  data() {
    return {
      name: '',
      date: new Date(),
      attendance: 100,
      orgId: this.$route.params.orgId,
      hackathonId: '',

      today: new Date()
    }
  },
  components: {
    DatePicker
  },
  computed: {
    orgs() {
      return this.$store.getters['orgs/storeRef']
    },
  },
  methods: {
    addNewTasks() {

      if (!this.name) {
        this.$parent.messages.push("Your hackathon must have a name!");
        return;
      }

      // Make sure the user is logged in
      if (!this.$parent.userId) {
        console.error("We couldn't find your userID! This shouldn't be possible.");
        return;
      }

      // Initialize an array that will keep track of tasks of the new
      // hackathon's timeline
      var taskList = [];

      this.hackathonId = this.$store.getters['hackathons/dbRef'].doc().id

      // Create a new task and add it to the tasks collection
      const taskId1 = this.$store.getters['tasks/dbRef'].doc().id;
      taskList.push(taskId1)
      this.$store.dispatch('tasks/set', {
        id: taskId1,
        progress: "not started",
        dependencies: [],
        hackathon: this.hackathonId,
        title: "Swag: T-shirts",
        description: "Design and order t-shirts for the event.",
        tags: ["finance", "design"],
        daysBefore: 90,
      }).catch(err => {
        console.error("Error initializing task: ", err)
      })

      // Repeat process
      const taskId2 = this.$store.getters['tasks/dbRef'].doc().id;
      taskList.push(taskId2)
      this.$store.dispatch('tasks/set', {
        id: taskId2,
        progress: "not started",
        dependencies: [taskId1],
        hackathon: this.hackathonId,
        title: "Second wave of sponsor emails",
        description: "Remind sponsors why you're worth it.",
        tags: ["promotion"],
        daysBefore: 60,
      }).catch(err => {
        console.error("Error initializing task: ", err)
      })
      this.addNewHackathon(taskList);
    },
    addNewHackathon(taskList) {
      // Make sure the user is logged in
      if (!this.$parent.userId) {
        console.error("We couldn't find your userID! This shouldn't be possible.");
        return;
      }

      // Create a new hackathon and add it to the hackathons collection
      this.$store.dispatch('hackathons/insert', {
        id: this.hackathonId,
        name: this.name,
        org: this.orgId,
        date: this.date,
        attendance: this.attendance,
        timeline: taskList
      })

      // Setting up an object to update the org's list of hackathons
      var updateObj = {
        hackathons: {}
      }
      if (this.orgs[this.orgId].hackathons) {
        updateObj.hackathons = this.orgs[this.orgId].hackathons;
      }
      updateObj.hackathons[this.hackathonId] = {
        id: this.hackathonId,
        name: this.name,
        date: this.date,
        attendance: this.attendance,
        timeline: taskList
      }

      // Updating org list and resetting org data for reloading
      this.$store.dispatch('orgs/set', {[`${this.orgId}`]: {hackathons: updateObj.hackathons}})
      .then(() => {

        //this.$parent.loadOrgs();
        this.hackathonInput = false;
        this.hackathonName = '';
        this.$router.push({
          name: 'dashboard',
          params: {
            hackathonId: this.hackathonId
          }
        })
      })
    },
  }
}
</script>

<style lang="scss" scoped>
@import '@/GlobalVars.scss';

#new-hackathon {
  text-align: left;
  padding: 0px 10%;
}

h1 {
  color: $light-blue;
  text-shadow: 4px 4px 0px black;
}

.description {
  opacity:.5;
  margin-bottom: 15px;
}

input {
  background: rgba(0,0,0,.2);
  border: solid 2px gray;
  color: white;
  padding: 10px 20px;
  font-size: 20px;
}
</style>
