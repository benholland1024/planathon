<template>
  <transition name="modal">
    <div class="popup-background">
      <div class="popup-wrapper"  @click="$parent.showAddModal = false">
        <!-- We use @click.stop on the next line to prevent showAddModal
        from being changed when clicking on the purple text -->
        <div class="popup-table purple-gradient" style="align: center" @click.stop>
          <h2>Add Task</h2>
            <div class="task-options">
              <div>
                <p>Title:</p>
                <input v-model="taskTitle" type="text" class="auth-textbox"/><br>
                <p>Description:</p>
                <textarea v-model="taskDesc" type="text" class="auth-textbox"/>
              </div>

              <div>
                <p>Catagory:</p>
                <div class="tag-picker">
                  <div class="tag-toggle">
                    <toggle-button v-model="tags.finance"
                      color="#FFE16E"/>
                    <label for="checkbox">  Finance</label>
                  </div>

                  <div class="tag-toggle">
                    <toggle-button v-model="tags.sponsors"
                      color="#FF9A6E"/>
                    <label for="checkbox">  Sponsors</label>
                  </div>

                  <div class="tag-toggle">
                    <toggle-button v-model="tags.promotion"
                      color="#FF6EE0"/>
                    <label for="checkbox">  Promotion</label>
                  </div>

                  <div class="tag-toggle">
                    <toggle-button v-model="tags.design"
                      color="#BA68FF"/>
                    <label for="checkbox">  Design</label>
                  </div>

                  <div class="tag-toggle">
                    <toggle-button v-model="tags.general"
                      color="#7A8FFF"/>
                    <label for="checkbox">  Logistics</label>
                  </div>

                </div>
                <p>Deadline:</p>
                <date-picker v-model="date" :first-day-of-week="1"
                lang="en"></date-picker>
              </div>

            </div><br><br>
            <div>
              <button class="material-button-large" @click="saveTask()">Add</button>
              <button class="material-button-large" @click="$emit('close')">Back</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import DatePicker from 'vue2-datepicker';

import {getDaysBeforeFromDate} from '@/utils.js';

  export default {
    data() {
      return {
        showAddModal: false,
        taskTitle: '',
        taskDesc: '',
        tags: {
          promotion: false,
          general: false,
          design: false,
          sponsors: false,
          finance: false,
        },

        date: new Date()
      }
    },

    components: {
      DatePicker
    },

    props: {
      hackathonId: {
        type: String,
        required: true
      },
      hackathonDate: {
        type: Object,
        required: true
      }
    },

    mounted() {

    },

    methods: {
      saveTask() {

        // Create an array to keep track of task tags
        var updatedTags = [];
        // List of all the tags you have to check:
        const tagsToCheck = ['finance', 'sponsors', 'promotion', 'design', 'general'];
        // Iterate through all those tags, push their string to
        // 'updatedTags' if the corresponding bool is true
        for (var i in tagsToCheck) {
          if (this.tags[tagsToCheck[i]]) {
            updatedTags.push(tagsToCheck[i])
          }
        }
        // updatedTags should now be an array that looks similar to this:
        // ['sponsors', 'promotion', 'design']

        // Manually generates a new id in tasks collection
        const taskId = this.$store.getters['tasks/dbRef'].doc().id;

        // Getting how many days prior to the hackathon the date is:
        var daysBefore = getDaysBeforeFromDate(this.date, this.hackathonDate.toDate());
        console.log("DaysBefore: ", daysBefore);

        // Create and add the new task
        this.$store.dispatch('tasks/insert', {
          id: taskId,
          title: this.taskTitle,
          description: this.taskDesc,
          tags: updatedTags,
          hackathon: this.hackathonId,
          daysBefore
        })
        .catch(err => {
          this.$parent.$parent.$parent.$parent.messages.push("Could create new task: " + err.message);
        })

        // This is used to update the hackathon to include the new task
        var newTimeline = this.hackathon.timeline;
        newTimeline.push(taskId);

        // Updates the hackathon specified by hackathonId
        this.$store.dispatch('hackathons/set', {[`${this.hackathonId}`]: {timeline: newTimeline}})
        .then(() => {
          this.$emit('close')
        })
        .catch(err => {
          this.$parent.$parent.$parent.$parent.messages.push("Could not update hackathon tasks: " + err.message);
        })
      }
    },

    computed: {
      tasks() {
        return this.$store.getters['tasks/storeRef']
      },
      hackathons() {
        return this.$store.getters['hackathons/storeRef']
      },
      hackathon() {
        var id = this.hackathonId;
        return this.hackathons[id]
      }
    }
  }
</script>

<style scoped lang="scss">
@import '@/GlobalVars.scss';

  .material-button-large {
    background: $gray;
    color: white;
    margin: 0px 10px;
  }
  .tag-picker {
    background: $gray;
    border-radius: 10px;
    padding: 10px;
    text-align: right;
  }
  .task-options {
    display: flex;
    justify-content: space-between;
  }
  .popup-table {
    min-width: 450px;
  }
  .auth-textbox {
    resize: none;
  }
</style>

<style>
.mx-calendar-icon {
  display: none;
}
.tag-toggle {
  display: flex;
  justify-content: space-between;
  width: 100%;
}

.v-switch-core {
  transform: scale(.7);
}
</style>
