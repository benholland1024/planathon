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
        <div v-for="tasks in simplifiedTasks.slice((week - 1) * 7, week * 7)" class="day-node">

          <div v-show="tasks.length != 0">
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
  computed: {
    simplifiedTasks() {
      var v = [];
      for (var i = 0; i != this.daysCountDown + (this.today.getDay() % 7) + (7 - (this.hackathonDate.toDate().getDay() % 7)); i++) {
        v[i] = [];
      }
      this.tasks.forEach(task => {
        v[task.daysBefore-1+(this.today.getDay() % 7)].push(task);
      })
      console.log(v)
      return v;
    }
  }
}
</script>
