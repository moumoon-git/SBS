<template>
  <el-button type="primary"  @click="selectNote">选择短信</el-button>
</template>

<script>
    export default {
        name: "selectNote",
        methods:{
            selectNote() {
            this.$emit("selectNote")
          }
        }
    }
</script>

<style scoped>
  @import "../../assets/css/icon.css";
</style>
