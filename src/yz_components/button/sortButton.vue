<template>
  <el-button type="primary" icon="el-icon-sort" @click="sort">排序</el-button>
</template>

<script>
  export default {
    name: "sortButton",
    methods:{
        sort(){
        this.$emit("sortButton");
      }
    }
  }
</script>

<style scoped>
  @import "../../assets/css/icon.css";

</style>
