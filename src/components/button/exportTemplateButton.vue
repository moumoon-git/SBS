<template>
  <el-button type="primary" icon="el-icon-document" @click="handleExport">模板</el-button>
</template>

<script>
  export default {
    name: "exportTemplateButton",
    methods: {
      handleExport() {
          this.$emit('handleExport');
      }
    }
  }
</script>

<style scoped>

</style>
