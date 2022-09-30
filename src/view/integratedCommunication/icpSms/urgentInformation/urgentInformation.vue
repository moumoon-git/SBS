<!--@author：llp-->
<template>
  <div>
    <el-row style="margin:0 30px">
      <div class="searchBar">
        <table-button-group ref="tableButtonGroup" style="float: left" @handleEdit="handleEdit"
                            @handleDelete="handleDelete"></table-button-group>
      </div>
    </el-row>
    <el-row>
      <el-col :span="14">
        <div class="contentStyle">
          <el-main>
            <div class="tableContainer">
              <el-table ref="singleTable" :data="tableData" highlight-current-row
                        max-height="586px" :header-cell-style="{background:'#E6E6E6',color:'#606266'}"
                        @row-click="handleRowClick"
              >
                <el-table-column type="index" min-width="50" :resizable="false"></el-table-column>
                <el-table-column min-width="160" v-for="(item,key) in tableColumn" :key="key" :label="item.label"
                                 :prop="item.prop"
                                 :width="item.width" :resizable="false"></el-table-column>
                <!--<el-table-column-->
                <!--type="selection"-->
                <!--width="55">-->
                <!--</el-table-column>-->
              </el-table>
              <!--&lt;!&ndash;分页&ndash;&gt;-->
              <!--<el-row>-->
              <!--<el-pagination class="pagination" :page-size="pageSize" :page-sizes="[10,20,30,40]" :total="total"-->
              <!--:current-page="currentPage"-->
              <!--layout="total, prev, pager, next, sizes, jumper"></el-pagination>-->
              <!--</el-row>-->
            </div>
          </el-main>
        </div>
      </el-col>
      <el-col :span="10">
        <reminder-msg-details ref="ReminderMsgDetails"></reminder-msg-details>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import TableButtonGroup from "../../../../components/button/tableButtonGroup";
  import ReminderMsgDetails from "@/view/integratedCommunication/icpSms/urgentInformation/reminderMsgDetails";

  export default {
    name: "urgentInformation",
    components: {ReminderMsgDetails, TableButtonGroup},
    data() {
      return {
        tableColumn: [
          {
            prop: "pdate",
            label: "催报时间"
          }, {
            prop: "content",
            label: "内容"
          }],//表头
        tableData: [],//表格数据
        total: 0,//数据总数
        pageSize: 10,//总页数
        currentPage: 1,//当前页数
        promptSmsQueueId: '',//催报信息id
        rowData: []//选中行数据
      }
    },
    created() {
      this.$nextTick(() => {
        this.$refs.tableButtonGroup.sortIsShow = false;
        this.$refs.tableButtonGroup.addIsShow = false;
        this.$refs.tableButtonGroup.batchJoinIsShow = false;
      })
    },
    mounted() {
      this.getTableData()
    },
    methods: {
      getTableData() {
        let data = {};
        this.$api.promptSmsQueue(data).then(res => {
          if (res.errorcode != 0) {
            this.$message({
              message: res.msg,
              type: "error"
            });
            return;
          }
          this.tableData = res.data;
        });
      },
      handleRowClick(row) {
        this.rowData = row;
        this.promptSmsQueueId = row.id;
        let postData = {
          id: row.id,
          reEdit: false
        };
        this.$api.promptSmsQueue(postData).then(res => {
          this.$nextTick(() => {
            this.$refs.ReminderMsgDetails.showData(res.data);
          })
        });
      },
      handleEdit() {
        if (this.promptSmsQueueId == '' || this.promptSmsQueueId == null) {
          this.$message({
            message: '请选中表格任意行进行修改',
            type: 'warning'
          });
          return;
        }
        this.$emit('editUrgentMsg',this.rowData);
      },
      handleDelete() {
        if (this.promptSmsQueueId == '') {
          this.$message({
            message: '请选中表格任意行进行删除',
            type: 'warning'
          });
          return;
        }
        this.$confirm('确认删除当前信息?', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let data = {id: this.promptSmsQueueId};
          this.$api.removePromptSmsQueue(data).then(res => {
            if (res.errorcode != 0) {
              this.$message({
                message: res.msg,
                type: "error"
              });
              return;
            }
            this.$message({
              message: "删除成功",
              type: "success"
            });
            this.getTableData();
            this.$nextTick(() => {
              this.$refs.ReminderMsgDetails.showData(null);
            })
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      }
    }
  }
</script>

<style scoped>
  .searchBar {
    height: 40px;
    line-height: 40px;
    margin: 10px 0;
    background: rgba(255, 255, 255, 1);
    border-radius: 3px;
  }

  .contentStyle {
    margin-left: 30px;
    height: 790px;
    background-color: white;
    border: 1px solid rgba(219, 219, 219, 1);
    border-radius: 3px;
  }

  .tableContainer {
    padding: 6px;
    border: 1px solid rgba(211, 215, 219, 1);
  }

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

  .msgDetail {
    height: 19px;
    font-size: 20px;
    font-family: Microsoft YaHei, sans-serif;
    font-weight: 400;
    color: rgba(50, 50, 50, 1);
  }


</style>
