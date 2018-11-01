<template>
  <transition name="modal">
    <div class="popup-background">
      <div class="popup-wrapper" @click="$parent.showDeleteModal = -1">
        <!-- We use @click.stop on the next line to prevent showDeleteModal 
        from being changed when clicking on the purple text -->
        <div class="popup-table purple-gradient" style="align: center" @click.stop>
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
      }
    },
    methods: {
      deleteTask() {
        // Delete the task from the tasks collection
        this.$store.dispatch('tasks/delete', `${this.taskId}`)
        .catch(err => {
          console.error("Could not delete task: ", err)
        })

        var indexOfTask = this.hackathon.timeline.indexOf(this.taskId);
        if (indexOfTask !== -1) this.hackathon.timeline.splice(indexOfTask, 1);

        // Delete the task from the hackathon's timeline
        this.$store.dispatch('hackathons/set', {[`${this.hackathonId}`]: {timeline: this.hackathon.timeline}})
        .then(() => {
          this.$emit('close');
        })
        .catch(err => {
          console.error("Could not remove task from hackathon: ", err)
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
