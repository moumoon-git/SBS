<template>
  <el-table ref="multipleTable" :data="tableData" tooltip-effect="dark" style="width: 100%"
            @selection-change="handleSelectionChange"
            @row-click="handleCurrentChange" :row-style="rowStyle"
            @select="select"
            :row-class-name="rowClassName"
            :border="true"
            show-overflow-tooltip
            :header-cell-style="{background:'#E6E6E6',color:'#606266'}"

  >
    <el-table-column type="selection" width="55" >

    </el-table-column>
    <el-table-column min-width="60" v-for="(item,key) in tableColumn" :key="key" :label="item.label" :prop="item.prop"
                      :resizable="true"
                     :formatter="item.formatter"
                     show-overflow-tooltip>
    </el-table-column>
    <el-table-column label="操作" width="80" :resizable="false" min-width="80" fixed="right">
      <template slot-scope="scope">
        <el-button type="danger" size="mini" @click="handleDelete(scope.row.id)">删除</el-button>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
    export default {
        name: "batchTable",
        props: ["tableColumn", "tableData"],
        data(){
          return{
            multipleSelection: [],
            selectionRow: []
          }
        },
        computed: {
          bottomSelectionRow() {
            if (this.selectionRow.length == 0) return null;
            return this.selectionRow.reduce((start, end) => {
              return start.rowIndex > end.rowIndex ? start : end;
            });
          },
          topSelectionRow() {
            if (this.selectionRow.length == 0) return null;
            return this.selectionRow.reduce((start, end) => {
              return start.rowIndex < end.rowIndex ? start : end;
            });
          }
        },
        mounted() {
          window.addEventListener("keydown", this.keyDown, false);
          window.addEventListener("keyup", this.keyUp, false);
        },
        beforeDestroy() {
          window.removeEventListener("keydown", this.keyDown);
          window.removeEventListener("keyup", this.keyUp);
        },
        methods: {
          clore(){
            this.$refs.multipleTable.clearSelection()
          },
          handleDelete(id) {
            this.$confirm('确认删除该数据？', '提示', {
              type: 'warning',
              confirmButtonText: '确定',
              cancelButtonText: '取消'
            }).then(() => {
              this.$emit('delete', id);
            }).catch(() => {
              this.$message({
                type: 'info',
                message: '已取消删除'
              })
            })
          },
          handleCurrentChange(row) {
            let refsElTable = this.$refs.multipleTable;
            if (this.CtrlDown) {
              refsElTable.toggleRowSelection(row);
              return;
            }
            if (
              this.shiftOrAltDown &&
              this.selectionRow.length > 0
            ) {
              let topAndBottom = this.getTopAndBottom(row, this.bottomSelectionRow, this.topSelectionRow);
              refsElTable.clearSelection();
              for (let index = topAndBottom.top; index <= topAndBottom.bottom; index++) {
                refsElTable.toggleRowSelection(this.tableData[index], true);
              }
            } else {
              let findRow = this.selectionRow.find(c => c.rowIndex == row.rowIndex);
              if (findRow && this.selectionRow.length == 1) {
                refsElTable.toggleRowSelection(row, false);
                return;
              }
              refsElTable.clearSelection();
              refsElTable.toggleRowSelection(row);
            }
            this.$emit('handleCurrentChange',row)
          },
          rowStyle({row, rowIndex}) {
            Object.defineProperty(row, 'rowIndex', {
              value: rowIndex,
              writable: true,
              enumerable: false
            })
          },
          rowClassName({row}) {
            let rowName = "",
              findRow = this.selectionRow.find(c => c.rowIndex === row.rowIndex);
            if (findRow) {
              rowName = "current-row ";
            }
            return rowName;
          },
          handleSelectionChange(val) {
            this.$emit('handleSelectionChange',val)
          },
          select(selection, row){//用户手动勾选的数据
            this.$emit('select',selection, row)
          },
          keyDown(event) {
            let key = event.keyCode;
            if (key == 17) this.CtrlDown = true;
            if (key == 16 || key == 18) this.shiftOrAltDown = true;
          },
          keyUp(event) {
            let key = event.keyCode;
            if (key == 17) this.CtrlDown = false;
            if (key == 16 || key == 18) this.shiftOrAltDown = false;
          },
          getTopAndBottom(row, bottom, top) {
            let n = row.rowIndex,
              mx = bottom.rowIndex,
              mi = top.rowIndex;
            if (n > mx) {
              return {
                top: mi,
                bottom: n
              };
            } else if (n < mx && n > mi) {
              return {
                top: mi,
                bottom: n
              };
            } else if (n < mi) {
              return {
                top: n,
                bottom: mx
              };
            } else if (n == mi || n == mx) {
              return {
                top: mi,
                bottom: mx
              };
            }
          }
      }
    }
</script>

<style scoped>
  .el-table>>>.el-table__fixed-right {
    height: 100%;
  }
</style>
