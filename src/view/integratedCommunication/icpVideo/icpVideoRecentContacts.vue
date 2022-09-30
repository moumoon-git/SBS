<!--@author：llp-->
<template>
  <div>
    <el-row>
      <!--表格-->
      <el-col>
        <div class="tableContainer">
          <el-row>
            <el-table ref="singleTable" :data="tableData" highlight-current-row
                      :header-cell-style="{background:'#E6E6E6',color:'#606266'}"
                      style="height: 614px;" max-height="586px"
            >
              <el-table-column type="index" min-width="50" :resizable="false"></el-table-column>
              <el-table-column min-width="160" v-for="(item,key) in tableColumn" :key="key" :label="item.label"
                               :prop="item.prop"
                               :width="item.width" :resizable="false"></el-table-column>
              <el-table-column label="操作" :resizable="false">
                <template slot-scope="scope" >
                  <el-button type="info" size="mini" @click="addMsgPhone(scope.row)">添加</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-row>
          <!--分页-->
          <el-row>
            <el-pagination class="pagination" :page-size="pageSize" :page-sizes="[10,20,30,40]" :total="total"
                           :current-page="currentPage"
                           @current-change="handCurrentChange"
                           layout="total, prev, pager, next, sizes, jumper"></el-pagination>
          </el-row>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  export default {
    name: "icpVideoRecentContacts",
    data() {
      return {
        tableColumn: [
          {
            prop: "name",
            label: "姓名"
          }, {
            prop: "workUnit",
            label: "单位"
          }, {
            prop: "position",
            label: "职位"
          },
          {
            prop: "direct",
            label: "状态"
          }, {
            prop: "startTime",
            label: "通话时间"
          }, {
            prop: "mobile",
            label: "联系号码"
          }],//表头
        tableData: [],//表格数据
        total: 20,//数据总数
        pageSize: 20,//总页数
        currentPage: 1,//当前页数
      }
    },
    mounted() {
      this.getRecentContactorData();
    },
    methods: {
      //获取最近联系人数据
      getRecentContactorData() {
        this.$api.getRecentContactorList().then(res => {
          if (res.errorcode != 0) {
            this.$message({
              message: res.msg,
              error: "error"
            });
            return;
          }
          this.tableData = res.data.data;
        })
      },
      //改变页数查询
      handCurrentChange(val) {
        this.currentPage = val;
        this.getRecentContactorData();
      },
      /**
       * @lastEditor: hexinting
       * @lastEditTime: 2020-9-15
       * @description: 点击行触发
       */
      addMsgPhone(row){
        if (row.mobile ==''|| row.mobile ==null){
          this.$message.warning("当前联系人号码为空");
          return;
        }
        if (row.mobile == '未知') {
          this.$message.warning("号码格式错误");
          return;
        }
        this.$emit("handleSelectionChange",row)
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
