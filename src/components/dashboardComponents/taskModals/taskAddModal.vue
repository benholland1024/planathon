<template>
  <transition name="modal">
    <div class="popup-background">
      <div class="popup-wrapper">
        <div class="popup-table purple-gradient" style="align: center">
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
                <p>Tags:</p>
                <input type="checkbox" v-model="promotion">
                <label for="checkbox">  Promotion</label><br>
                <input type="checkbox" v-model="general">
                <label for="checkbox">  General</label><br>
                <input type="checkbox" v-model="dev">
                <label for="checkbox">  Dev</label><br>
                <input type="checkbox" v-model="finance">
                <label for="checkbox">  Finance</label><br>
                <input type="checkbox" v-model="design">
                <label for="checkbox">  Design</label><br>
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
  export default {
    data() {
      return {
        showAddModal: false,
        taskTitle: '',
        taskDesc: '',
        promotion: false,
        general: false,
        design: false,
        dev: false,
        finance: false
      }
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
        if (this.promotion) {
          updatedTags.push("promotion");
        }
        if (this.finance) {
          updatedTags.push("finance");
        }
        if (this.general) {
          updatedTags.push("general");
        }
        if (this.dev) {
          updatedTags.push("development");
        }
        if (this.design) {
          updatedTags.push("design");
        }

        // Create and add the new task
        this.$parent.$parent.$parent.$parent.db.collection('tasks').add({
          title: this.taskTitle,
          description: this.taskDesc,
          tags: updatedTags,
          hackathon: this.hackathonId
        })
        .then((docRef) => {
          console.log("Task saved! Nice!")

          // This is used to update the new task to hold it's id
          var updateTaskObj = {
            id: docRef.id
          }

          // Update the new task
          this.$parent.$parent.$parent.$parent.db.collection('tasks').doc(docRef.id).update(updateTaskObj)
          .then(() => {
            console.log(" Id added to task! Nice!")
          }).catch(err => {
            console.error("error: ", err);
          })

          // This is used to update the hackathon to include the new task
          var newTimeline = this.timeline;
          newTimeline.push(docRef.id);
          var updateHackObj = {
            timeline: newTimeline
          }

          this.$parent.$parent.$parent.$parent.db.collection('hackathons').doc(this.hackathonId).update(updateHackObj)
          .then(() => {
            console.log(" Id added to task! Nice!")
          }).catch(err => {
            console.error("error: ", err);
          })

        }).catch(err => {
          console.error("error: ", err);
        })
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
