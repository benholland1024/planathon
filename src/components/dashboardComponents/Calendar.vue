<template>
  <div id="calendar">
    <div id="day-labels">
      <span>S</span>
      <span>M</span>
      <span>T</span>
      <span>W</span>
      <span>R</span>
      <span>F</span>
      <span>S</span>
    </div>

    <div id="day-nodes">
      <div class="week-node" v-for="(week, weekIndex) in Math.ceil((simplifiedTasks.length / 7))">
        <div v-for="(day, dayIndex) in simplifiedTasks.slice((week - 1) * 7, week * 7)" class="day-node"
          v-tooltip="getMonthFromDate(day.date) + ' ' + day.date.getDate()">
          <div v-for="task in day.tasks"
            v-tooltip="task.tags">
          </div>

          <div v-show="day.tasks.length != 0">
            <task-square-display :tags="tags">
            </task-square-display>

          </div>

          <div class="strike-through" v-show="weekIndex == 0 && dayIndex < (today.getDay() % 7)">
          </div>
          <div class="day-of"
            v-show="weekIndex == Math.ceil(simplifiedTasks.length / 7)-1
              && dayIndex == (hackathonDate.toDate().getDay() % 7)">
              *
          </div>

        </div>
      </div>
    </div>

  </div>
</template>

<script>
import TaskSquareDisplay from '@/components/dashboardComponents/taskModals/taskSquareDisplay.vue';
import {dateObjFromDaysBefore, getMonthFromDate} from '@/utils';

export default {
  name: 'calendar',
  data() {
    return {
      tags: ["finance"]
    }
  },
  components: {
    TaskSquareDisplay
  },
  props: {
    daysCountDown: {
      type: Number,
      required: true
    },
    tasks: {
      type: Array,
      required: true
    },
    hackathonDate: {
      type: Object,
      required: true
    },
    today: {
      type: Date,
      required: true
    }
  },
  methods: {
    getMonthFromDate(date) {
      return getMonthFromDate(date);
    }
  },
  computed: {
    simplifiedTasks() {
      // Our empty array - will ultimately store all of our days
      var v = [];

      // Days between today and the hackathon date
      var daysInCalendar = this.daysCountDown;

      // We want our calendar to start on monday, so now we add the days between
      // today and monday
      daysInCalendar += (this.today.getDay() % 7);

      // Now, we add the days AFTER the hackathon, to end on a Friday.
      var daysAtEnd = (7 - (this.hackathonDate.toDate().getDay() % 7));
      daysInCalendar += daysAtEnd;

      for (var i = 0; i != daysInCalendar; i++) {
        v[i] = {
          tasks: [],
          date: dateObjFromDaysBefore(daysInCalendar - i - daysAtEnd, this.hackathonDate.toDate())
        };
      }
      this.tasks.forEach(task => {
        if (task.tags.includes( this.$route.name ) || this.$route.name == "all") {
          if (task.daysBefore <= daysInCalendar) {
            v[daysInCalendar-(task.daysBefore-2+(this.today.getDay() % 7))].tasks.push(task);
          }
        }
      })

      if (this.$route.name != 'all') {
        this.tags = [this.$route.name];
      }
      else {
        this.tags = ['all'];
      }

      return v;
    }
  }
}
</script>

<style lang="scss" scoped>

.strike-through {
  position: relative;
  overflow: hidden;
  width: 3px;
  height: 20px;
  transform: rotate(45deg);
  background: black;
  top: -4.1px;
  right: -3px;
}

.day-of {
  color: white;
  font-weight: bold;
  font-size: 20px;
  position: relative;
  top: -5px;
  right: 1.1px;
}

</style>
