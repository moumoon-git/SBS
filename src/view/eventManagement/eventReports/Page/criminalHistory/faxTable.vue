<template>
  <el-scrollbar class="widthClass">
    <el-table   :data="tableData"
                :header-cell-style="{background:'#E6E6E6',color:'#606266'}"
                @row-click="handleCurrentChange"
                :stripe="true"
                :border="false"
                highlight-current-row
    >
      <el-table-column min-width="80" v-for="(item,key) in tableColumn" :key="key" :label="item.label" :prop="item.prop"
                       :width="item.width" :resizable="true"
                       :formatter="item.formatter"
                       :show-overflow-tooltip="true"
      ></el-table-column>
      <el-table-column label="操作"  :resizable="false" min-width="80" fixed="right" >
        <template slot-scope="scope">
<!--          <el-button v-if="examine" type="success" size="mini" @click="downloadCheck(scope.row)">查看</el-button>-->
          <el-button v-if="examine" type="primary" size="mini" @click="handleCheck(scope.row)">下载</el-button>
          <el-button v-if="guess" type="info" size="mini">暂无附件</el-button>
        </template>
      </el-table-column>
    </el-table>
  </el-scrollbar>
</template>

<script>
    export default {
        name: "faxTable",
        props: ["tableColumn", "tableData"],
        data(){
          return{
            row:"",//行索引
            column:"",//列索引
            examine:false,//附件按钮
            guess:false
          }
        },
        methods: {
          handleCheck(row){
            this.$emit("handleCheck",row);
          },
          downloadCheck(row){
            this.$emit("downloadCheck",row);
          },
          handleCurrentChange(row) {
            this.$emit("handleCurrentChange",row);
          },
          handleUpdate(row){
            this.$emit("handleUpdate",row);
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
    height: 250px;
    /*max-height: 450px;*/
    overflow-y: auto;
    font-size: 14px;
  }
</style>
