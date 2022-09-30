<template id="tableList">
<el-table :data="tableData" :header-cell-style="headerColor" :cell-style="cellStyle" stripe height="320px">
  <el-table-column  min-width="60"  v-for="(title,i) in titles" :key="i" :prop="title.prop"
                   :label="title.label" :class-name="title.prop" align='center' show-overflow-tooltip>
  </el-table-column>
</el-table>
</template>
<script>
export default {
  name: 'tableList',
  props: ['tableData', 'titles'],
  data() {
    return {

    }
  },
  methods: {
    headerColor(row, rowIndex) {
      return 'background:	rgb(230, 230, 230);color:rgb(96, 98, 102)';
    },
    cellStyle(row, column, rowIndex, columnIndex) {
      if (row.column.className == 'status' && row.row.status == '成功') {
        return 'color:rgba(16,217,176,1)'
      } else if (row.column.className == 'status' && row.row.status == '失败') {
        return 'color:rgba(255,147,117,1)'
      }
    },

  }
}
</script>
<style scoped>
.el-button {
  display: block;
  margin: 5px auto !important;
}

.page img {
  width: 100%;
}
.el-table th>.cell {
  text-align: center;
}

.el-table .cell {
  white-space: pre-line !important;
}
</style>

