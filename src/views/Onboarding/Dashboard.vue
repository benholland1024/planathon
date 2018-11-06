<template>
  <div id="dashboard" v-if="$parent.user && this.hackathon">

  <div id="dash-nav">
    <div style="text-align:left">
      <h2>{{ hackathon.name }} - {{daysCountDown}} Days Left</h2>
      <h4>Keep up the good work!</h4>
    </div>
    <div style="display: flex;align-items: center;">
      <div style="text-align: right;margin-right:20px;">
        <h3>Ben Holland</h3>
        <h4>King of Promotional Material</h4>
      </div>
      <router-link :to="{ name: 'home' }">
      <img src="@/assets/logout.png" style="width: 25px; height: 25px;
      filter:brightness(1000);cursor:pointer;">
      </router-link>
    </div>
  </div>

    <div id="catagory-tabs">
      <div class="light-gray">Update me on: </div>
        <router-link class="catagory-tab yellow" tag="div"
          :to="{ name: 'finances', params: {
            hackathon: hackathon
          } }"
          active-class="underlined"
          >Finances
        </router-link>
        <router-link class="catagory-tab orange" tag="div"
          :to="{ name: 'sponsors', params: {
            hackathon: hackathon
          } }"
          active-class="underlined"
          >Sponsors
        </router-link>
        <router-link class="catagory-tab pink" tag="div"
          :to="{ name: 'promotion', params: {
            hackathon: hackathon
          } }"
          active-class="underlined"
          >Promotion
        </router-link>
        <router-link class="catagory-tab purple" tag="div"
          :to="{ name: 'design', params: {
            hackathon: hackathon
          } }"
          active-class="underlined"
          >Design
        </router-link>
        <router-link class="catagory-tab blue" tag="div"
          :to="{ name: 'general', params: {
            hackathon: hackathon
          } }"
          active-class="underlined"
          >General Logistics
        </router-link>
        <router-link class="catagory-tab" tag="div"
          :to="{ name: 'all', params: {
            hackathon: hackathon
          } }"
          active-class="underlined"
          >All
        </router-link>
    </div>

  <!--Calendar on the side -- TODO: Abstract to a component?-->
    <div id="calendar">
      <div id="day-labels">
        <span>M</span>
        <span>T</span>
        <span>W</span>
        <span>R</span>
        <span>F</span>
        <span>S</span>
        <span>S</span>
      </div>
      <div id="day-nodes">
        <div class="week-node" v-for="week in 35">
          <div v-for="i in 7" class="day-node">
          </div>
        </div>
      </div>
    </div>

    <router-view></router-view>

  </div>
  <div v-else>
    <div id="calendar"></div>
  </div>

  <div id="dashboard" v-else-if="$parent.user">
    <h1>Loading...</h1>
  </div>
</template>

<script>
import LineGraph from '@/components/Charts/LineGraph.js';
import PolarGraph from '@/components/Charts/PolarGraph.js';
import Tasks from '@/components/dashboardComponents/tasks.vue';

import { dateDiffInDays } from '@/utils.js';

export default {
  name: 'dashboard',
  data() {
    return {
      timeline: [],
      today: new Date(),
    }
  },
  mounted() {

  },
  components: {
    LineGraph,
    PolarGraph,
    Tasks
  },
  computed: {
    tasks() {
      return this.$store.getters['tasks/hackathonTasks'](this.hackathon.id)
    },
    task() {
      return this.tasks[`${this.taskId}`]
    },
    hackathons() {
      return this.$store.getters['hackathons/storeRef']
    },
    hackathon() {
      return this.hackathons[`${this.$route.params.hackathonId}`]
    },

    // Calculating data for the sidebar calendar: 
    weeklyCalendar() {
      return []
    },
    daysCountDown() {
      if (typeof this.today.getMonth !== 'function') {
        return false;
      }
      if (typeof this.hackathon.date.toDate().getMonth !== 'function') {
        return false;
      }
      return dateDiffInDays(this.today, this.hackathon.date.toDate())
    }
  }
}
</script>

<style lang="scss">
@import '@/GlobalVars.scss';

#dashboard {
  
  width: calc(100% - 180px);
  margin-right: 0px;
  margin-left: auto;
}
.widget-holder {
  display: flex;
  justify-content: space-evenly;
}

#dash-nav {
    padding: 30px;
    background: $dark-gray;
    display: flex;
    justify-content: space-between;

    a {
      font-weight: bold;
      color: white;
    }
    h1, h2, h3, h4, h5 {
      margin: 0px;
      padding: 0px;
    }
  }

.dark-widget {
  background-color: $dark-gray;
  width: 40%;
  height: 500px;
  margin-top: 25px;
}

.task-widget {
  background-color: $gray;
  width: 80%;
  min-height: 75px;
  margin: 15px 5%;
  padding: 10px 5%;
  text-align: left;
}

.task-circle {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  margin-right: 5px;
}



#calendar {
  width: 180px;
  height: 100%;
  position: absolute;
  background: $gray;
  left: 0px;
  top: 0px;
  display: grid;
  grid-template-columns: 20% 80%;
  grid-template-rows: 5% 95%;
  font-family: courier;
}
#day-labels {
  grid-column: 2/3;
  grid-row: 1/2;
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding-right: 5px;
}
#day-nodes {
  grid-column: 2/3;
  grid-row: 2/3;
  display: flex;
  flex-direction: column;
  overflow-y: scroll;
  padding-right: 5px;
}
.day-node {
  width: 10px;
  height: 10px;
  background: $lighter-gray;
}
.week-node {
  display: flex;
  justify-content: space-around;
  margin-bottom: 10px;
  display: flex;
}

#catagory-tabs {
  width: 100%;
  height: 50px;
  background: $gray;
  display: flex;
  align-items: center;
  div {
    margin-left: 20px;
  }
}

.light-gray {
  color: $lighter-gray;
}

.catagory-tab {
  font-weight: bolder;
  font-size: 18px;
  cursor: pointer;
}
.underlined {
  text-decoration: underline;
}
</style>

<style lang="scss" scoped>
h3, h4 {
  margin: 0;
}

h4 {
  opacity: .5;
}
</style>