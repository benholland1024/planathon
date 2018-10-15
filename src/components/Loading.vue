<template>
  <div>
    <div class="loading-block" id="title"></div>
    <div class="loading-block" id="main-block"></div>
    <div class="loading-block-container">
      <div class="loading-block half"></div>
      <div class="loading-block half"></div>
    </div>
  </div>
</template>

<script>

</script>

<style scoped lang="scss">
@import '@/GlobalVars.scss';

  .loading-block {
    background: $gray;
    border-radius: 10px;
    opacity: .5;
  }
  #title {
    height: 40px;
    margin: 20px 5vw 0px 5vw;
    width: 30vw;
  }
  #main-block {
    height: 100px;
    margin: 20px 5vw 0px 5vw;
    width: 90vw;
  }
  .loading-block-container {
    margin: 20px 5vw 0px 5vw;
    width: 90vw;
    display: flex;
    justify-content: space-between;
  }
  .half {
    width: 40vw;
    height: 80px;
  }
</style>