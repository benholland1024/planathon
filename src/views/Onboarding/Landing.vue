<template>
<div id="landing">
  <div id="promo-container">
    <bar-graph class="small-graph"></bar-graph>
  </div>
  <div id="call-to-action">
    <p class="light-blue title">Organize Your Hackathon</p>
    <p class="light-pink bold title">Like A Pro.</p>
    <p style="opacity: .5;font-size:20px;">Running a hackathon is a herculean task. Organize your todo list, keep track of financial and development progress, see tips on running hackathons by people like you, and much more. </p>
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
    width: 45vw;
    height: 70vh;
    box-shadow: $box-shading;
  }
  #call-to-action {
    padding-top: 10vh;
    padding-right: 5vw;
    width: 40vw;
    height: 60vh;
    text-align: right;
    p:not(.under-button) {
      margin: 0px;
      margin-bottom: 10px;
      text-shadow: 2px 2px 5px rgba(0,0,0,.5);
    }
    .title {
      font-size: 50px;
    }
  }
  #get-started {
    text-align: center;
    margin-top: 50px;
    
  }
  
  .small-graph {
    width: 45%;
    padding: 1%;
  }
</style>