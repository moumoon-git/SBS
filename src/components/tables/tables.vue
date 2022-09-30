<!--@author：yf-->
<template>
  <el-table
    ref="singleTable"
    :data="tableData"
    :header-cell-style="{background:'#E6E6E6',color:'#606266'}"
    @row-click="handleCurrentChange"
    @row-dblclick="handleRowDbClick"
    class="widthClass"
    stripe
    border
    highlight-current-row
    :height="height"
    @selection-change="myHandleSelectionChange"
    v-loading="myLoading"
  >
    <el-table-column type="selection" width="55" v-if="isSelection"></el-table-column>
    <el-table-column
      min-width="80"
      v-for="(item,key) in tableColumn"
      :key="key"
      :label="item.label"
      :prop="item.prop"
      :width="item.width"
      :resizable="true"
      :formatter="item.formatter"
      :show-overflow-tooltip="true"
    ></el-table-column>
  </el-table>
</template>

<script>
export default {
  props: {
    //表格表头
    tableColumn: {
      type: Array,
      default: []
    },
     //数据
    tableData: {
      type: Array,
      default: []
    },
    //是否显示多选
    isSelection: {
      type: Boolean,
      default: false
    },
    myLoading: {
      type: Boolean,
      default: false
    },
    height: {
      type: Number,
      default: 450
    }
  },
  data() {
    return {
      row: "", //行索引
      column: "" //列索引
    };
  },
  methods: {
    //多选返回
    myHandleSelectionChange(row) {
      this.$emit("selection-change", row);
    },
    handleCurrentChange(row) {
      this.$emit("handleCurrentChange", row);
    },
    handleCellClick(row, column, cell) {
      // 获取选中单元格的值
      // console.log(row[column.property])
      if (column.label != "日期") {
        this.row = row;
        this.column = column;
        //回调方法
        this.$emit("handleCellClick", cell);
      } else {
        this.$message({
          message: "请双击除日期外的单元格进行修改!",
          type: "warning"
        });
      }
    },
    handleRowDbClick(row) {
      this.$emit("handleRowDbClick", row);
    },
    tableLight(row) {
      this.$refs.singleTable.setCurrentRow(row, true); //设置高亮第几行，传递第一行可高亮第一行
    }
  }
};
</script>

<style scoped>
>>> .el-table__body tr.current-row > td {
  color: #479dff;
}

>>> .el-table--enable-row-hover .el-table__body tr.hover > td {
  background-color: #e3f0ff !important;
}
.widthClass {
  min-height: 450px;
  max-height: 600px;
  overflow: auto;
  margin: 10px 0;
  font-size: 14px;
}
>>> .el-table td {
  padding: 0;
}

element.style {
  background: rgb(230, 230, 230);
  color: rgb(96, 98, 102);
}
.el-table td,
.el-table th.is-leaf {
  border-bottom: 1px solid #ebeef5;
}
.el-table--border th,
.el-table__fixed-right-patch {
  border-bottom: 1px solid #ebeef5;
}
.el-table--border td,
.el-table--border th,
.el-table__body-wrapper .el-table--border.is-scrolling-left ~ .el-table__fixed {
  border-right: 1px solid #ebeef5;
}
.el-table th {
  white-space: nowrap;
  overflow: hidden;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}
.el-table td,
.el-table th {
  padding: 12px 0;
  min-width: 0;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  text-overflow: ellipsis;
  vertical-align: middle;
  position: relative;
  text-align: left;
}
.el-table th,
.el-table tr {
  background-color: #fff;
}
.el-pager,
.el-table th {
  -moz-user-select: none;
  -ms-user-select: none;
}
user agent stylesheet th {
  font-weight: bold;
  text-align: -internal-center;
}
user agent stylesheet td,
th {
  display: table-cell;
  vertical-align: inherit;
}
.el-table thead {
  color: #909399;
  font-weight: 500;
}
.el-table__body,
.el-table__footer,
.el-table__header {
  table-layout: fixed;
  border-collapse: separate;
}
user agent stylesheet table {
  display: table;
  border-collapse: separate;
  border-spacing: 2px;
  border-color: grey;
}
.widthClass[data-v-13a34c22] {
  min-height: 450px;
  max-height: 600px;
  overflow: auto;
  margin: 10px 0;
  font-size: 14px;
}
.el-table {
  position: relative;
  overflow: hidden;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  -webkit-box-flex: 1;
  -ms-flex: 1;
  flex: 1;
  width: 100%;
  max-width: 100%;
  font-size: 14px;
  color: #606266;
}
.el-dialog__body {
  padding: 30px 20px;
  color: #606266;
  font-size: 14px;
  word-break: break-all;
}
.contentStyle div {
  line-height: 20px;
}
</style>
