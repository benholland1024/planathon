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

      <div class="week-node" v-for="week in Math.ceil((simplifiedTasks.length / 7))">
        <div v-for="day in simplifiedTasks.slice((week - 1) * 7, week * 7)" class="day-node"
          v-tooltip="getMonthFromDate(day.date) + ' ' + day.date.getDate()">
          <div v-for="task in day.tasks"
            v-tooltip="task.tags">
          </div>

          <div v-show="day.tasks.length != 0">
            <!-- We will probably want to make a square component eventually
                 that can handle an array of tasks for the day.
                 tags is hard coded here. -->
            <task-circle-display :tags="tags">
            </task-circle-display>
          </div>

        </div>
      </div>

    </div>
  </div>
</template>

<script>
import TaskCircleDisplay from '@/components/dashboardComponents/taskModals/taskCircleDisplay.vue';
import {dateObjFromDaysBefore, getMonthFromDate} from '@/utils';

export default {
  name: 'calendar',
  data() {
    return {
      tags: ["finance"]
    }
  },
  components: {
    TaskCircleDisplay
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
          v[daysInCalendar-(task.daysBefore-2+(this.today.getDay() % 7))].tasks.push(task);
        }
      })

      v[this.today.getDay() % 7].tasks.push({
        id: 'today'
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
