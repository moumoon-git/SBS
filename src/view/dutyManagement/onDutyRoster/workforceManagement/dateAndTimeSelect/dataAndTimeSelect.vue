<template>
  <div>
    <el-date-picker
      v-model="value"
      type="datetimerange"
      range-separator="-"
      start-placeholder="开始日期"
      end-placeholder="结束日期">
    </el-date-picker>
  </div>
</template>

<script>
    export default {
        name: "dataAndTimeSelect",
        data(){
          return{
            value: '',
          }
        }
    }
</script>

<style scoped>

</style>
