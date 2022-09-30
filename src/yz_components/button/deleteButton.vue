<template>
  <el-button type="primary" icon="el-icon-close" @click="handleDelete">删除</el-button>
</template>

<script>
    export default {
      name: "deleteButton",
      methods:{
        handleDelete(){
          this.$emit("handleDelete");
        }
      }
    }
</script>

<style scoped>
  @import "../../assets/css/icon.css";

</style>
