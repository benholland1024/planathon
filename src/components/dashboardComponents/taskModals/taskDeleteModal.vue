<template>
  <transition name="modal">
    <div class="popup-background">
      <div class="popup-wrapper">
        <div class="popup-table purple-gradient" style="align: center">
          <h2>Delete Task</h2>
          <p>Are you sure you want to delete this task?</p>
          <div style="display:flex;flex-flow: row wrap;">
            <button class="material-button-large" style="margin-right: 15px;" @click="deleteTask()">Delete</button><br><br>
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
        showDeleteModal: false
      }
    },
    props: {
      taskId: {
        type: String,
        required: true
      },
      hackathonId: {
        type: String,
        required: true
      },
      timeline: {
        type: Array,
        required: true
      }
    },
    mounted() {

    },
    methods: {
      deleteTask() {

        // Delete the task from the tasks collection
        this.$parent.$parent.$parent.db.collection('tasks').doc(this.taskId).delete()
        .then(() => {
         console.log("Task was deleted from tasks collection! Nice!")
        }).catch(err => {
         console.error("error: ", err);
        })

        var indexOfTask = this.timeline.indexOf(this.taskId);
        if (indexOfTask !== -1) this.timeline.splice(indexOfTask, 1);

        var updateHackObj = {
          timeline: this.timeline
        }

        // Delete the task from the hackathon's timeline
        this.$parent.$parent.$parent.db.collection('hackathons').doc(this.hackathonId).update(updateHackObj)
        .then(() => {
         console.log("Task was deleted from hackathon's timeline! Nice!")
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
