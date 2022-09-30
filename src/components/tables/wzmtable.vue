<!--@author：wzm-->
<template>
  <el-table
    height="585"
    ref="singleTable"
    :data="tableData"
    :header-cell-style="{ background: '#E6E6E6', color: '#606266' }"
    @row-click="handleCurrentChange"
    @cell-click="cellClick"
    @cell-dblclick="handleCellClick"
    :cell-style="cellStyle"
    class="widthClass"
    :stripe="true"
    :border="true"
  >
    <el-table-column
      min-width="80"
      v-for="(item, key) in tableColumn"
      :key="key"
      :label="item.label"
      :prop="item.prop"
      :width="item.width"
      :resizable="true"
      :formatter="item.formatter"
      :show-overflow-tooltip="true"
    >
      <template slot-scope="scope">
        <div v-if="scope.row[item.prop] && scope.row[item.prop].length > 0">
          {{ scope.row[item.prop] }}
          <i
            class="el-icon-close delPerson"
            @click.stop="personDelete()"
            v-if="checkShift == item.prop && date == scope.row['day']"
          ></i>
        </div> </template
    ></el-table-column>
  </el-table>
</template>

<script>
export default {
  name: "tables",
  props: ["tableColumn", "tableData"],
  data() {
    return {
      name: "", //选中的人
      row: "", //行索引
      column: "", //列索引
      date: "", //选中的日期
      checkShift: "", // 选中的班次
    };
  },
  methods: {
    handleCurrentChange(row) {
      // this.$emit("handleCurrentChange",row);
    },
    handleCellClick(row, column, cell, event, name) {
      // 获取选中单元格的值
      this.$emit("handleCellClick", row[column.property]);
      console.log(row[column.property]);
      this.name = row[column.property];
      console.log("row: ", row);
      this.date = row.day;
      this.checkShift = column.property;
      if (column.label != "日期") {
        this.row = row;
        this.column = column;
        //回调方法
        this.$emit("handleCellClick", cell, name);
      } else {
        this.$message({
          message: "请双击除日期外的单元格进行修改!",
          type: "warning",
        });
      }
    },
    cellStyle({ row, column, rowIndex, columnIndex }) {
      if (row === this.row && column === this.column) {
        //指定坐标
        return "background:rgb(74, 159, 255);color:#fff";
      } else if (rowIndex === "" && columnIndex === "") {
        return "";
      } else {
        return "";
      }
    },
    handleDial() {},
    cellClick(row, column, cell, event) {
      /* console.log(row[column.property],column.property);
         var a = 0;b=1;
         this.cellStyle({ row, column,a,b})*/
      //this.$emit("cellClick",row[column.property]);
      this.name = row[column.property];
      this.checkShift = column.property;
      this.date = row.day;
      if (column.label != "日期") {
        this.row = row;
        this.column = column;
        //回调方法
        this.$emit("cellClick", row, column, cell, event);
      }
    },
    personDelete() {
      this.$emit("personDelete", this.checkShift, this.date);
    },
  },
};
</script>

<style scoped>
>>> .el-table__body tr.current-row > td {
  color: rgb(74, 159, 255);
}

>>> .el-table--enable-row-hover .el-table__body tr.hover > td {
  background-color: rgb(0, 119, 255) !important;
}
.widthClass {
  min-height: 450px;
  overflow: auto;
  margin: 10px 0;
  font-size: 14px;
}

.delPerson {
  position: absolute;
  top: 5px;
  right: 5px;
  cursor: pointer;
}

.el-table >>> .cell {
  white-space: pre-line;
  text-align: center;
}
</style>
