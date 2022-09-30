<!--@author：llp-->
<template>
  <div>
    <el-row>
      <div class="navsBar" style="height: 80px">
        <table-button-group ref="tableButtonGroup" @handleDelete="handleDelete"
                          ></table-button-group>
      </div>
    </el-row>
    <el-row>
      <el-col :span="17" class="tableContainer">
        <el-main style="margin-top:16px;margin-left:16px">
          <p class="faxTitle">传真详情</p>
          <fax-table ref="FaxTable" class="table" :tableColumn="tableColumn"
                     @handleRowClick="handleRowClick"
                     :tableData="tableData"></fax-table>
        </el-main>
      </el-col>
      <el-col :span="6">
        <fax-details ref="FaxDetails"></fax-details>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import TableButtonGroup from "@/yz_components/button/tableButtonGroup";
  import FaxTable from "@/view/yz_integratedCommunication/icpFax/pendingFax/faxTable";
  import FaxDetails from "@/view/yz_integratedCommunication/icpFax/pendingFax/faxDetails";

  export default {
    name: "pendingFax",
    components: {FaxDetails, FaxTable, TableButtonGroup},
    data() {
      return {
        tableColumn: [],//表头
        tableData: [],//表格数据
        rowData: [],//选中的行数据
        HWICP_Version:window.g.HWICP_Version//华为icp版本
      }
    },
    mounted() {
      this.$nextTick(() => {
        this.$refs.tableButtonGroup.sortIsShow = false;
        this.$refs.tableButtonGroup.addIsShow = false;
        this.$refs.tableButtonGroup.batchJoinIsShow = false;
        this.$refs.tableButtonGroup.editIsShow = false;
      })
    },
    methods: {
      //表格行内点击的方法
      handleRowClick(row) {
        this.$nextTick(() => {
          this.rowData = row;
          this.$refs.FaxDetails.showData(row);
        })
      },
      //删除待发传真的方法
      handleDelete() {
        if (this.rowData == '' || this.rowData == null) {
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
          let data = {fileName: this.rowData.faxFile};
          this.$api.removeFaxQueue(data).then(res => {
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

            //刷新表格内容
            this.$nextTick(() => {
              this.$refs.FaxTable.getTableData();
              this.$refs.FaxDetails.showData(null);
            });
            this.rowData = null;
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
  .navsBar {
    margin: 0 30px;
    padding-left: 30px;
    background-color: white;
    display: flex;
    align-items: center;
    border: 1px solid rgba(219, 219, 219, 1);
    box-sizing: border-box;
    border-radius: 3px;
  }

  .tableContainer {
    margin-top: 16px;
    margin-left: 30px;
    height: 792px;
    background: rgba(255, 255, 255, 1);
    border: 1px solid rgba(219, 219, 219, 1);
    border-radius: 3px;
  }

  .faxTitle {
    width: 80px;
    height: 20px;
    font-size: 20px;
    font-family: Microsoft YaHei, sans-serif;
    font-weight: 400;
    color: rgba(50, 50, 50, 1);
  }

  >>> .el-main {
    padding: 0;
  }

</style>
