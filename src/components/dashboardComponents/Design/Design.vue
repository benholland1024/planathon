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

          <div class="color-info">{{color.hex}}</div>
          <div class="color-info">rgba({{color.rgba.r}},{{color.rgba.g}},{{color.rgba.b}},{{color.rgba.a}})</div>

          <div class="color-disp"  @click="colorPickerDisp = index"
            :style="{
                background: color.hex
              }"></div>

          <img src="@/assets/trash.png" class="delete-icon"
            @click="deleteColor(index)">
        </div>
        <button id="color-add-modal" class="hover-shine"
          @click="addColor()">+</button>
      </div>
      <div class="hamburger-dark-widget">
        
        <div class="sample-color" 
          :style=" {
            background: tempColor.hex
            }"></div>
        <button @click="" class="color-save-button">Save</button>
        <chrome v-model="tempColor" 
            class="color-picker" />
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
      tempColor: {
        hex: '#194d33',
        hsl: { h: 150, s: 0.5, l: 0.2, a: 1 },
        hsv: { h: 150, s: 0.66, v: 0.30, a: 1 },
        rgba: { r: 25, g: 77, b: 51, a: 1 },
        a: 1
      }
    }
  },
  methods: {
    deleteColor(index) {

    },
    addColor() {
      var colorId = this.$store.getters['tasks/dbRef'].doc().id;

      this.$store.dispatch('colors/insert', {
        id: colorId,
        hex: '#194d33',
        hsl: { h: 150, s: 0.5, l: 0.2, a: 1 },
        hsv: { h: 150, s: 0.66, v: 0.30, a: 1 },
        rgba: { r: 25, g: 77, b: 51, a: 1 },
        a: 1,
        hackathon: this.$route.params.hackathonId,
      })
      .catch(err => {
        console.error("Oops: ", err)
      })
    }
  },
  computed: {
    designTasks() {
      return this.$parent.tasks.filter(task => {
        return task.tags.includes("design");
      })
    },
    colors() {
      return this.$store.getters['colors/hackathonColors'](this.$route.params.hackathonId)
    },
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
  cursor: pointer;
}
.delete-icon {
  width: 15px;
  height: 15px;
  opacity: .5;
}

#color-add-modal {
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

.sample-color {
  position: absolute;
  width: 25%;
  right: 10%;
  height: 100px;
  top: 10%;
}

.color-save-button {
  position: absolute;
  width: 25%;
  right: 10%;
  height: 40px;
  bottom: 25%;
  
  padding: 10px 20px;
  background: $gray;
  color: $lighter-gray;
  font-size: 18px;
  font-weight: bolder;
  display: block;
  border: none;
  box-shadow: $box-shading;
  cursor: pointer;
}

</style>

<style>
.color-picker {
  transform: scale(.8);
}
</style>