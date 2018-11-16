<template>
<div style="display: flex;position: absolute;">
<div class="task-square" v-for="tag in tags"
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
.task-square {
  width: 10px;
  height: 10px;
  margin-right: 5px;
}

</style>
