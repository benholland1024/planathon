<template>
  <div class="widget-holder">
    <tasks :hackathonId="$route.params.hackathonId"
           :hackathonTasks="this.designTasks"
           :hackathonDate="$parent.hackathon.date">

    </tasks>
    <div class="vertical-widget-holder">
      <div class="hamburger-dark-widget">
        <h3>Color Palette:</h3>
        <div class="color-widget">

          <div class="color-info">#123123</div>
          <div class="color-info">rgba(16,55,46)</div>

          <input type="color" ref="colorDisp"> <!-- Note that this input is actually
          invisible! It gets selected when you click on color-disp -->
          <div class="color-disp"  @click="$refs.colorDisp.click()"></div>

          <img src="@/assets/trash.png" class="delete-icon">
        </div>
      </div>
      <div class="hamburger-dark-widget">
      </div>
    </div>
  </div>
</template>

<script>
import Tasks from '@/components/dashboardComponents/tasks.vue';

export default {
  name: 'design',
  components: {
    Tasks
  },
  computed: {
    designTasks() {
      return this.$parent.tasks.filter(task => {
        return task.tags.includes("design");
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/GlobalVars.scss';

input[type=color] {
    display: none;
  }

.color-widget {
  background-color: $gray;
  width: 80%;
  height: 50px;
  margin: 15px 5%;
  padding: 0px 5%;
  text-align: left;
  position: relative;
  box-shadow: $box-shading;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.color-info {
  opacity: .5;
}
.color-disp {
  width: 20px;
  height: 20px;
  box-shadow: $box-shading;
  background: pink;
}
.delete-icon {
  width: 15px;
  height: 15px;
  opacity: .5;
}

</style>