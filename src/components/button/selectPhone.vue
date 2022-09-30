<template>
  <el-button type="primary"  @click="selectPhone">选择电话</el-button>
</template>

<script>
    export default {
        name: "selectPhone",
        methods:{
          selectPhone() {
            this.$emit("selectPhone")
          }
        }
    }
</script>

<style scoped>
  @import "../../assets/css/icon.css";
</style>
