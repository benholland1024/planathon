<template>
  <div class="dark-widget">
    <div class="task-widget" v-for="(task, index) in hackathonTasks">

      <div class="icon-opts">
        <img src="@/assets/edit.png" @click="showEditModal = index">
        <img src="@/assets/trash.png" @click="showDeleteModal = index">
      </div>

      <task-circle-display :tags="task.tags"></task-circle-display>
      <!--<h3>{{ dateObjFromDaysBefore(task.daysBefore, hackathonDate.toDate()) }}</h3>-->
      <div class="task-date-container">
        <h3>
          {{dateObjFromDaysBefore(task.daysBefore, hackathonDate.toDate()).getDate()}}
        </h3>
        <h4>
          {{getMonthFromDate(dateObjFromDaysBefore(task.daysBefore, hackathonDate.toDate()))}}
        </h4>
      </div>
      <div class="task-description-container">
        <h3>{{ task.title }}</h3>
        <h4>{{ task.description }}</h4>
      </div>

      <task-edit-modal :task="task" v-if="showEditModal == index" @close="showEditModal = -1">
      </task-edit-modal>
      <task-delete-modal :taskId="task.id" :hackathonId="hackathonId"
            v-if="showDeleteModal == index" @close="showDeleteModal = -1">
      </task-delete-modal>

    </div>
    <button id="show-add-modal" class="hover-shine"
      @click="showAddModal = true">+ Add Task</button>
    <task-add-modal :hackathonId="hackathonId" v-if="showAddModal == true"
                    :hackathonDate="hackathonDate"
          @close="showAddModal = false">
    </task-add-modal>
  </div>
</template>

<script>
import TaskEditModal from '@/components/dashboardComponents/taskModals/taskEditModal.vue';
import TaskAddModal from '@/components/dashboardComponents/taskModals/taskAddModal.vue';
import TaskDeleteModal from '@/components/dashboardComponents/taskModals/taskDeleteModal.vue';

import TaskCircleDisplay from '@/components/dashboardComponents/taskModals/taskCircleDisplay.vue';

import { dateObjFromDaysBefore } from '@/utils.js';
import { getMonthFromDate } from '@/utils.js';

export default {
  data() {
    return {
      showEditModal: -1,
      showDeleteModal: -1,
      showAddModal: false
    }
  },
  methods: {
    dateObjFromDaysBefore(daysBefore, date) {
      // This function is defined in utils.js
      return dateObjFromDaysBefore(daysBefore, date);
    },
    getMonthFromDate(date) {
      return getMonthFromDate(date);
    },
  },
  props: {
    hackathonTasks: {
      type: Array,
      required: true
    },
    hackathonId: {
      type: String,
      required: true
    },
    hackathonDate: {
      type: Object,
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
  display: flex;
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

.task-date-container {
  margin-right: 20px;
  padding-top: 20px;
  opacity: .4;
  text-align: center;
  h3 {
    font-size: 40px;
    margin: 0px;
    padding: 0px;
  }
  h4 {
    margin: 0px;
    padding: 0px;
  }
}
.task-description-container {
  padding-top: 15px;
}

</style>
