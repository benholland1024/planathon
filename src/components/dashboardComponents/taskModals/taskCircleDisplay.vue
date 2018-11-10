<template>
<div style="display: flex;position: absolute;">
<div class="task-circle" v-for="tag in tags"
  :class="[tag]">
</div>
</div>
</template>

<script>
export default {
  props: {
    tags: {
      type: Array,
      required: true
    }
  }
}
</script>

<style lang="scss" scoped>
.task-circle {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  margin-right: 5px;
}
</style>
