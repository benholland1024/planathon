<template>
  <transition name="error-modal">
    <div class="error-popup-background">
      <div class="error-popup-wrapper">
        <div class="error-popup-table blue-gradient" style="align: center" @click.stop>
          <h2>Uh oh, there seems to have been an error</h2>
          <p>{{message}}</p>

            <button class="material-button-large" @click="$emit('close')">Close</button>

        </div>
      </div>
    </div>
  </transition>
</template>

<script>
  export default {
    props: {
      message: {
        type: String,
        required: true
      }
    },
  }
</script>

<style scoped lang="scss">
@import '@/GlobalVars.scss';

  .material-button-large {
    background: $gray;
    color: white;
  }

</style>
