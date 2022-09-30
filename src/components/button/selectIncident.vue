<template>
  <el-button type="primary"  @click="selectIncident">选择事件</el-button>
</template>

<script>
    export default {
        name: "selectIncident",
        methods:{
          selectIncident() {
            this.$emit("selectIncident")
          }
        }
    }
</script>

<style scoped>
  @import "../../assets/css/icon.css";
</style>
