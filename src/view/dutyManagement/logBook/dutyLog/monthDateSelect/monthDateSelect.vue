<template>
    <div>
      <el-date-picker
        disabled
        v-model="value"
        type="month"
        placeholder="月份:">
      </el-date-picker>
    </div>
</template>

<script>

    export default {
        name: "dateSelect",
        data() {
          return {
            value: '',
          };
        }
    }
</script>

<style scoped>

</style>
