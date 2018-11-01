<template>
  <transition name="modal">
    <div class="popup-background">
      <div class="popup-wrapper"  @click="$parent.showAddModal = false">
        <!-- We use @click.stop on the next line to prevent showAddModal 
        from being changed when clicking on the purple text -->
        <div class="popup-table purple-gradient" style="align: center" @click.stop>
          <h2>Add Task</h2>
            <div style="display: flex">
              <div>
                <p>Title:</p>
                <input v-model="taskTitle" type="text" class="auth-textbox"
                      @keyup.enter=""/><br>
                <p>Description:</p>
                <input v-model="taskDesc" type="text" class="auth-textbox"
                      @keyup.enter=""/>
              </div>

              <div>
                <div class="tag-picker">
                  <input type="checkbox" v-model="tags.promotion">
                  <label for="checkbox">  Promotion</label><br>
                  <input type="checkbox" v-model="tags.general">
                  <label for="checkbox">  General</label><br>
                  <input type="checkbox" v-model="tags.development">
                  <label for="checkbox">  Dev</label><br>
                  <input type="checkbox" v-model="tags.finance">
                  <label for="checkbox">  Finance</label><br>
                  <input type="checkbox" v-model="tags.design">
                  <label for="checkbox">  Design</label><br>
                </div>
                <date-picker v-model="date" :first-day-of-week="1"
                lang="en"></date-picker>
              </div>
              
            </div><br><br>
            <button class="material-button-large" @click="saveTask()">Save</button><br><br>
            <button class="material-button-large" @click="$emit('close')">Close</button>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import DatePicker from 'vue2-datepicker';

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
          development: false,
          finance: false,
        },

        date: new Date()
      }
    },

    components: {
      DatePicker
    },

    props: {
      timeline: {
        type: Array,
        required: true
      },
      hackathonId: {
        type: String,
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
        const tagsToCheck = ['finance', 'development', 'promotion', 'design', 'general'];
        // Iterate through all those tags, push their string to 
        // 'updatedTags' if the corresponding bool is true
        for (var i in tagsToCheck) {
          if (this.tags[tagsToCheck[i]]) {
            updatedTags.push(tagsToCheck[i])
          }
        }
        // updatedTags should now be an array that looks similar to this:
        // ['development', 'promotion', 'design']
        
        // Manually generates a new id in tasks collection
        const taskId = this.$store.getters['tasks/dbRef'].doc().id;

        // Create and add the new task
        this.$store.dispatch('tasks/insert', {
          id: taskId,
          title: this.taskTitle,
          description: this.taskDesc,
          tags: updatedTags,
          hackathon: this.hackathonId
        })
        .catch(err => {
          console.error("Oops: ", err)
        })

        // This is used to update the hackathon to include the new task
        var newTimeline = this.hackathon.timeline;
        newTimeline.push(taskId);

        // Updates the hackathon specified by hackathonId
        const hackathon = this.hackathonId
        this.$store.dispatch('hackathons/set', {[hackathon]: {timeline: newTimeline}})
        .catch(err => {
          console.error("Whoops: ", err)
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

/*  Note that this only applies to this page's material button: */
  .material-button-large {
    background: $gray;
    color: white;
  }
</style>
