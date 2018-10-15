<template>
  <div>
    <div class="loading-block" id="title"></div>
    <div class="loading-block" id="main-block"></div>
  </div>
</template>

<script>

</script>

<style scoped lang="scss">
@import '@/GlobalVars.scss';

  .loading-block {
    background: $gray;
    border-radius: 10px;
  }
  #title {
    height: 40px;
    margin: 50px 5vw 0px 5vw;
    width: 30vw;
  }
  #main-block {
    height: 100px;
    margin: 50px 5vw 0px 5vw;
    width: 90vw;
  }
</style>