<template>
  <transition name="modal">
    <div class="popup-background">
      <div class="popup-wrapper" @click="$parent.showEditModal = -1">
        <!-- We use @click.stop on the next line to prevent showEditModal
        from being changed when clicking on the purple text -->
        <div class="popup-table purple-gradient" style="align: center" @click.stop>
          <h2>Edit Task</h2>
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
                <input type="checkbox" v-model="sponsors">
                <label for="checkbox">  Sponsors</label><br>
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
  </transition>
</template>

<script>
  export default {
    data() {
      return {
        showEditModal: false,
        taskTitle: '',
        taskDesc: '',
        promotion: false,
        general: false,
        design: false,
        sponsors: false,
        finance: false
      }
    },
    props: {
      task: {
        type: Object,
        required: true
      }
    },
    mounted() {
      // Initialize variables for editing task tags
      if (this.task.tags.includes("promotion")) {
        this.promotion = true;
      }
      if (this.task.tags.includes("design")) {
        this.design = true;
      }
      if (this.task.tags.includes("general")) {
        this.general = true;
      }
      if (this.task.tags.includes("finance")) {
        this.finance = true;
      }
      if (this.task.tags.includes("sponsors")) {
        this.sponsors = true;
      }

      // These variables are used for reverting changes when cancelling and edit
      this.taskTitle = this.task.title;
      this.taskDesc = this.task.description;
    },
    methods: {
      saveTask() {
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
        if (this.sponsors) {
          updatedTags.push("sponsors");
        }
        if (this.design) {
          updatedTags.push("design");
        }

        this.$store.dispatch('tasks/set', {[`${this.task.id}`]: {
          title: this.taskTitle,
          description: this.taskDesc,
          tags: updatedTags
        }})
        .then(() => {
         this.task.title = this.taskTitle;
         this.task.description = this.taskDesc;
         this.task.tags = updatedTags;
         this.$emit('close');
        }).catch(err => {
          this.$parent.$parent.$parent.$parent.messages.push("Could not edit task: " + err.message);
        })
      }
    },
    computed: {
      tasks() {
        return this.$store.getters['tasks/storeRef']
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
