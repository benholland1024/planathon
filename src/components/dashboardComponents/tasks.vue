<template>
  <div class="dark-widget">
    <div class="task-widget" v-for="(task, index) in hackathonTasks">

      <div class="icon-opts">
        <img src="@/assets/edit.png" @click="showEditModal = index">
        <img src="@/assets/trash.png" @click="showDeleteModal = index">
      </div>
      
      <task-circle-display :tags="task.tags"></task-circle-display>
      <h3>{{ task.title }}</h3>
      <h4>{{ task.description }}</h4>

      <task-edit-modal :task="task" v-if="showEditModal == index" @close="showEditModal = -1">
      </task-edit-modal>
      <task-delete-modal :taskId="task.id" :hackathonId="hackathonId"
            v-if="showDeleteModal == index" @close="showDeleteModal = -1">
      </task-delete-modal>

    </div>
    <button id="show-add-modal" class="hover-shine" 
      @click="showAddModal = true">+ Add Task</button>
    <task-add-modal :hackathonId="hackathonId" v-if="showAddModal == true"
          @close="showAddModal = false">
    </task-add-modal>
  </div>
</template>

<script>
import TaskEditModal from '@/components/dashboardComponents/taskModals/taskEditModal.vue';
import TaskAddModal from '@/components/dashboardComponents/taskModals/taskAddModal.vue';
import TaskDeleteModal from '@/components/dashboardComponents/taskModals/taskDeleteModal.vue';

import TaskCircleDisplay from '@/components/dashboardComponents/taskModals/taskCircleDisplay.vue';

export default {
  data() {
    return {
      showEditModal: -1,
      showDeleteModal: -1,
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
    TaskAddModal,
    TaskDeleteModal,
    TaskCircleDisplay
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
  height: calc(500px - 50px);
  margin-top: 25px;
  overflow-y: scroll;
  padding-bottom: 50px;
}

.task-widget {
  background-color: $gray;
  width: 80%;
  min-height: 75px;
  margin: 15px 5%;
  padding: 10px 5%;
  text-align: left;
  position: relative;
  box-shadow: $box-shading;
}



h3, h4 {
  margin: 0;
}

h4 {
  opacity: .5;
}

.icon-opts {
  position: absolute;
  right: 10px;
  display: flex;
  img {
    width: 15px;
    height: 15px;
    margin-left: 10px;
    cursor: pointer;
  }
  img:hover {
    filter: brightness(150);
  }
}

#show-add-modal {
  padding: 10px 20px;
  background: $gray;
  color: $lighter-gray;
  font-size: 18px;
  font-weight: bolder;
  margin-right: 5%;
  margin-top: 15px;
  margin-left: auto;
  display: block;
  border: none;
  box-shadow: $box-shading;
  cursor: pointer;
}

</style>
