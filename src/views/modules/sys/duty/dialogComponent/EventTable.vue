<template lang="">
  <el-table
    :data="tableData"
    border
    style="width: 100%"
    highlight-current-row
    row-key="id"
    @row-click="handleClick"
  >
    <el-table-column
      prop="eventCode"
      label="事件编号"
      align="center"
    />
    <el-table-column
      prop="title"
      label="事件标题"
      show-overflow-tooltip
      width="180"
      align="center"
    />
    <el-table-column
      prop="caseClass"
      label="事件类型"
      align="center"
    />
    <el-table-column
      prop="occurTime"
      label="事发时间"
      align="center"
    />
    <el-table-column
      prop="area"
      label="所属区域"
      align="center"
    />
    <el-table-column
      prop="eventLevel"
      label="事件等级"
      align="center"
    />
    <el-table-column
      prop="receiveOperator"
      label="接报人"
      align="center"
    />
  </el-table>
</template>
<script>
export default {
  name: 'EventTable',
  props: {
    tableData: {
      type: Array,
      default: () => ([]),
    },
    handleClick: {
      type: Function,
      default: () => null,
    },
  },
  data() {
    return {

    };
  },
};
</script>
<style lang="scss">

</style>
