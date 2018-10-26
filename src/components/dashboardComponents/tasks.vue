<template>
  <div class="dark-widget">
    <div class="task-widget" v-for="(task, index) in hackathonTasks">
      <div style="display: flex">
        <div class="task-circle" v-for="tag in task.tags"
          :class="[tag]">
        </div>
      </div>
      <h3>{{ task.title }}</h3>
      <h4>{{ task.description }}</h4>
      <button id="show-edit-modal" @click="showEditModal = index">Edit Task</button>
      <task-edit-modal :task="task" v-if="showEditModal == index" @close="showEditModal = -1">
      </task-edit-modal>
    </div>
    <button id="show-add-modal" @click="showAddModal = true">Add Task</button>
    <task-add-modal :timeline="timeline" :hackathonId="hackathonId" v-if="showAddModal == true" @close="showAddModal = false">
    </task-add-modal>
  </div>
</template>

<script>
import TaskEditModal from '@/components/dashboardComponents/taskEditModal.vue';
import TaskAddModal from '@/components/dashboardComponents/taskAddModal.vue';

export default {
  data() {
    return {
      showEditModal: -1,
      showAddModal: false
    }
  },
  props: {
    timeline: {
      type: Array,
      required: true
    },
    hackathonTasks: {
      type: Array,
      required: true
    },
    hackathonId: {
      type: String,
      required: true
    }
  },
  components: {
    TaskEditModal,
    TaskAddModal
  },
  mounted() {

  }
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
