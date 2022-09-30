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
      prop="direct"
      label="收/发类型"
      width="120"
      align="center"
    >
      <template slot-scope="scope">
        <span>
          {{ scope.row.direct ? '接收' : '发送' }}
        </span>
      </template>
    </el-table-column>>
    <el-table-column
      prop="content"
      label="短信内容"
      show-overflow-tooltip
      width="400"
    />
    <el-table-column
      prop="contactorName"
      label="收/发人"
      width="150"
      align="center"
    />
    <el-table-column
      prop="phone"
      label="联系号码"
      align="center"
    >
      <template slot-scope="scope">
        <span>
          {{ scope.row.direct ? scope.row.phone : '-' }}
        </span>
      </template>
    </el-table-column>>
    <el-table-column
      prop="sendTime"
      label="收发时间"
      align="center"
    />
  </el-table>
</template>
<script>
export default {
  name: 'MsgTable',
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
