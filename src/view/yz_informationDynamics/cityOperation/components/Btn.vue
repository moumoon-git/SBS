<template>
  <div>
    <el-button type="primary" @click="save" :disabled="disabled">保存</el-button>
    <el-button type="primary" style="display: none">导出</el-button>
  </div>
</template>

<script>
  export default {
    name: "btn",
    props: {
      type: {
        type: Number,
        default: 0,
      },
      disabled: {
        type: Boolean,
        default: false
      }
    },
    data(){
      return{

      }
    },
    methods: {
      save(){
        this.$emit('save',this.type)
      }
    }
  }
</script>

<style scoped>

</style>
