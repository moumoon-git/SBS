<template>
  <el-button type="primary" icon="el-icon-edit" @click="handleEdit">修改</el-button>
</template>

<script>
  export default {
    name: "editButton",
    methods:{
      handleEdit(){
        this.$emit("handleEdit")
      }
    }
  }
</script>

<style scoped>
  @import "../../assets/css/icon.css";

</style>
