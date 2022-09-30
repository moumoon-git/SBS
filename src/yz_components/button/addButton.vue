<template>
  <el-button type="primary" icon="el-icon-plus" @click="handleAdd">新增</el-button>
</template>

<script>
  export default {
    name: "addButton",
    methods: {
      handleAdd() {
        this.$emit("handleAdd")
      }
    }
  }
</script>

<style scoped>
  @import "../../assets/css/icon.css";

</style>
