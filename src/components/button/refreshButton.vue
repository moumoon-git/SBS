<template>
  <el-button type="primary" icon="el-icon-refresh" @click="handleRefresh">更新分组</el-button>
</template>

<script>
  export default {
    name: "refreshButton",
    methods:{
      handleRefresh(){
        this.$emit("handleUpdateGroup");
      }
    }
  }
</script>

<style scoped>
  @import "../../assets/css/icon.css";

</style>
