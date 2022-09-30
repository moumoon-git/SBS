<template>
  <el-scrollbar>
    <el-table  ref="leadConductorTable" :data="tableData"
               highlight-current-row
               :header-cell-style="{background:'#E6E6E6',color:'#606266'}"
               @row-click="handleCurrentChange"
               @cell-dblclick="handleCellClick"
               class="widthClass"
               :stripe="true"
               :border="true"
               tooltip-effect="dark"
               @selection-change="handleSelectionChange"
               @select="select"

    >
      <el-table-column type="selection"  fixed="left" :resizable="false"></el-table-column>
      <el-table-column min-width="60" v-for="(item,key) in tableColumn" :key="key" :label="item.label" :prop="item.prop"
                       :width="item.width" :resizable="true"
                       :formatter="item.formatter"
                       :show-overflow-tooltip="true">
      </el-table-column>
      <el-table-column label="操作" width="80" :resizable="false" min-width="80" fixed="right">
        <template slot-scope="scope">
          <el-button type="danger" size="mini" @click="handleDelete(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </el-scrollbar>
</template>

<script>
    export default {
        name: "leadConductorTable",
        props: ["tableColumn", "tableData"],
        data(){
          return{
            row:"",//行索引
            column:""//列索引
          }
        },
        methods: {
          handleSelectionChange(val) { //全选
            this.$emit('handleSelectionChange', val)
          },
          select(selection){
            if(selection.length>=1){
              this.$refs.leadConductorTable.clearSelection()
            }
          },
          handleCurrentChange(row) {
            // let refSelTable=this.$refs.singleTable
            // refSelTable.toggleRowSelection(row)
            this.$emit("handleCurrentChange",row);
          },
          handleCellClick(row, column, cell, event){
            this.$emit("handleCellClick",row, column, cell, event);
          },
          handleDial() {

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
          }
        }
    }
</script>

<style scoped>
  >>> .el-table__body tr.current-row > td {
    color: #479DFF;
  }

  >>>.el-table--enable-row-hover .el-table__body tr.hover>td{
    background-color: #E3F0FF !important;
  }
  .widthClass{
    min-height: 250px;
    overflow: auto;
    margin: 10px 0;
    font-size: 14px;
  }

</style>
