<!--@author：llp-->
<template>
  <el-row>
    <!--表格-->
    <el-col>
      <div class="tableContainer">
        <el-row>
          <el-table ref="singleTable" :data="tableData" highlight-current-row
                    :header-cell-style="{background:'#E6E6E6',color:'#606266'}"
                    @row-click="handleRowClick"
                    max-height="586px"
                    style="height: 614px;">
            <el-table-column type="index" min-width="50" :resizable="false"></el-table-column>
            <el-table-column min-width="160" v-for="(item,key) in tableColumn" :key="key" :label="item.label"
                             :prop="item.prop"
                             :width="item.width" :resizable="false"></el-table-column>
          </el-table>
        </el-row>
        <!--分页-->
        <!--<el-row>-->
          <!--<el-pagination class="pagination" :page-size="pageSize" :page-sizes="[10,20,30,40]" :total="total"-->
                         <!--:current-page="currentPage"-->
                         <!--layout="total, prev, pager, next, sizes, jumper"></el-pagination>-->
        <!--</el-row>-->
      </div>
    </el-col>
  </el-row>
</template>

<script>
  export default {
    name: "faxTable",
    data() {
      return {
        tableColumn: [
          {
            prop: "faxSendTime",
            label: "发送时间"
          }, {
            prop: "faxName",
            label: "传真标题"
          }],//表头
        tableData: [],//表格数据
        total: 0,//数据总数
        pageSize: 10,//总页数
        currentPage: 1,//当前页数
      }
    },
    mounted(){
      this.getTableData()
    },
    methods: {
      //获取表格内的数据
      getTableData(){
        let data={};
        this.$api.searchFaxQueue(data).then(res=>{
          if(res.errorcode!=0){
            this.$message({
              message:res.msg,
              type:"error"
            });
            return;
          }
          this.tableData = res.data;
        })
      },
      //行点击的方法
      handleRowClick(row){
        this.$emit('handleRowClick',row);
      }
    }
  }
</script>

<style scoped>
  >>> .el-table::before {
    height: 0;
  }

  .pagination {
    margin-top: 16px;
    padding: 0;
  }

  >>> .el-pagination__jump {
    margin-left: 0;
  }

  .tableContainer {
    height: 664px;
    margin-right: 16px;
    padding: 6px;
    border: 1px solid rgba(211, 215, 219, 1);
  }
</style>
