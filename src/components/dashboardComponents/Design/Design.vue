<template>
  <div class="widget-holder">
    <tasks :hackathonId="$route.params.hackathonId"
           :hackathonTasks="this.designTasks"
           :hackathonDate="$parent.hackathon.date">

    </tasks>
    <div class="vertical-widget-holder">
      <div class="hamburger-dark-widget">
        <h3>Color Palette:</h3>
        <div class="color-widget" v-for="(color, index) in colors"
          :key="index">

          <div class="color-info">#123123</div>
          <div class="color-info">{{index}}</div>
          
          <chrome v-model="colors[index]" v-if="colorPickerDisp == index"/>

          <div class="color-disp"  @click="colorPickerDisp = index"
            :style="{
                background: color.hex
              }"></div>

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
import { Chrome } from 'vue-color';


export default {
  name: 'design',
  components: {
    Tasks,
    Chrome
  },
  data() {
    return {
      colorPickerDisp: -1,
      colors: [
        {
          hex: '#194d33',
          hsl: { h: 150, s: 0.5, l: 0.2, a: 1 },
          hsv: { h: 150, s: 0.66, v: 0.30, a: 1 },
          rgba: { r: 25, g: 77, b: 51, a: 1 },
          a: 1
        }
      ]
    }
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
    // display: none;
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
}
.delete-icon {
  width: 15px;
  height: 15px;
  opacity: .5;
}

</style>