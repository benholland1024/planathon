<template>
  <div class="dark-widget">
    <div class="task-widget" v-for="task in timeline">
      <div style="display: flex">
        <div class="task-circle" v-for="tag in task.tags"
          :class="[tag]">
        </div>
      </div>
      <h3>{{ task.title }}</h3>
      <h4>{{ task.description }}</h4>


      <button id="show-modal" @click="showModal = true">Edit Task</button>
      <task-add-edit-modal :task="task" v-if="showModal" @close="showModal = false">
      </task-add-edit-modal>


    </div>
  </div>
</template>


<script>
import TaskAddEditModal from '@/components/dashboardComponents/taskAddEditModal.vue';

  export default {
    data() {
      return {
        showModal: false,
        tasks: []
      }
    },
    props: {
      timeline: {
        type: Array,
        required: true
      }
    },
    components: {
      TaskAddEditModal
    },
    mounted() {
      this.timeline.forEach((task) => {
        this.$parent.db.collection('tasks').doc(task).get().then((doc) => {
          this.tasks.push(doc.data());
        }).catch((err) => {
          console.error("Error getting the hackathon's tasks: ", err);
        })
      });
    },
  }
</script>

<style scoped lang="scss">
@import '@/GlobalVars.scss';

.dark-widget {
  background-color: $dark-gray;
  width: 40%;
  height: 500px;
  margin-top: 25px;
}

.task-widget {
  background-color: $gray;
  width: 80%;
  min-height: 75px;
  margin: 15px 5%;
  padding: 10px 5%;
  text-align: left;
}

.task-circle {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  margin-right: 5px;
}

h3, h4 {
  margin: 0;
}

h4 {
  opacity: .5;
}

</style>
