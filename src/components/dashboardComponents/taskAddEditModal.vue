<template>
  <transition name="modal">
    <div class="popup-background">
      <div class="popup-wrapper">
        <div class="popup-table purple-gradient" style="align: center">
          <h2>Edit Task</h2>
            <div style="display: flex">

              <div>
                <p>Title:</p>
                <input v-model="task.title" type="text" class="auth-textbox"
                      @keyup.enter=""/>
                <br>
                <p>Description:</p>
                <input v-model="task.description" type="text" class="auth-textbox"
                      @keyup.enter=""/>
              </div>

              <div>
                <p>Tags:</p>
                <input type="checkbox" v-model="promotion">
                <label for="checkbox">  Promotion</label><br>
                <input type="checkbox" v-model="marketing">
                <label for="checkbox">  Marketing</label><br>
                <input type="checkbox" v-model="dev">
                <label for="checkbox">  Dev</label><br>
                <input type="checkbox" v-model="finance">
                <label for="checkbox">  Finance</label><br>
                <input type="checkbox" v-model="design">
                <label for="checkbox">  Design</label><br>
              </div>
            </div>



            <br><br>
            <button class="material-button-large" @click="saveTask()">
              Save
            </button><br><br>
            <button class="material-button-large" @click="$emit('close')">
              Close
            </button>



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
        showModal: false,
        promotion: false,
        marketing: false,
        design: false,
        dev: false,
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
      if (this.task.tags.includes("promotion")) {
        this.promotion = true;
      }
      if (this.task.tags.includes("design")) {
        this.design = true;
      }
      if (this.task.tags.includes("marketing")) {
        this.marketing = true;
      }
      if (this.task.tags.includes("finance")) {
        this.finance = true;
      }
      if (this.task.tags.includes("dev")) {
        this.dev = true;
      }
    },
    methods: {
      saveTask() {

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
