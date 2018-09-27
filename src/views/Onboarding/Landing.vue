<template>
<div id="landing">
  <div id="promo-container">
    <bar-graph></bar-graph>
  </div>
  <div id="call-to-action">
    <p class="light-blue">Organize Your Hackathon</p>
    <p class="light-pink bold">Like A Pro.</p>
    <div id="get-started">
      <button class="material-button-large purple-gradient" >
        GET STARTED
      </button>
      <p class="under-button purple">Or, find your team!</p>
    </div>
  </div>
</div>
</template>

<script>
import BarGraph from '@/components/BarGraph.js';
export default {
  data() {
    return {
      
    }
  },
  components: {
    BarGraph
  }
}
</script>

<style scoped lang="scss">
@import '@/GlobalVars.scss';

  #landing {
    padding: 50px;
    display: flex;
    justify-content: space-between;
  }
  #promo-container {
    background: $dark-gray;
    width: 40vw;
    height: 70vh;
    box-shadow: $box-shading;
  }
  #call-to-action {
    padding-top: 10vh;
    padding-right: 5vw;
    width: 35vw;
    height: 60vh;
    text-align: right;
    p:not(.under-button) {
      font-size: 50px;
      margin: 0px;
      margin-bottom: 10px;
      text-shadow: 2px 2px 5px rgba(0,0,0,1);
    }
  }
  #get-started {
    text-align: center;
    margin-top: 200px;
  }
</style>