<!--@author：llp-->
<template>
  <div>
    <div class="box-card">
      <el-row style="margin:24px 24px 12px 24px">
        <el-col class="recipientInformation">
          收信人信息
        </el-col>
      </el-row>
      <el-row style="margin:0 24px 0 24px">
        <el-col class="tableContainer">
          <el-table ref="singleTable" :data="tableData" highlight-current-row
                    :header-cell-style="{background:'#E6E6E6',color:'#606266'}"
                    max-height="492px"
          >
            <el-table-column min-width="50" v-for="(item,key) in tableColumn" :key="key" :label="item.label"
                             :prop="item.prop"
                             :width="item.width" :resizable="false"></el-table-column>
          </el-table>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
  export default {
    name: "faxDetails",
    data() {
      return {
        tableData: [],//表格数据
        tableColumn: [
          {
            prop: "name",
            label: "收信人",
          }, {
            prop: "faxNumber",
            label: "号码"
          }]//表头信息
      }
    }, methods: {
      //展示收信息人的信息
      showData(row) {
        let data = {fileName: row.faxFile};
        this.$api.searchFaxQueue(data).then(res => {
          if (res.errorcode != 0) {
            this.$message({
              message: res.msg,
              type: "error"
            });
            return;
          }
          this.tableData = res.data;
        })
      }
    }
  }
</script>

<style scoped>
  .box-card {
    height: 792px;
    margin-top: 16px;
    margin-left: 8px;
    background: rgba(255, 255, 255, 1);
    border: 1px solid rgba(219, 219, 219, 1);
    border-radius: 3px;
  }

  .recipientInformation {
    text-align: left;
    height: 21px;
    font-size: 20px;
    font-family: Microsoft YaHei, sans-serif;
    font-weight: bold;
    color: rgba(50, 50, 50, 1);
  }

  .tableContainer {
    height: 694px;
    margin-right: 16px;
    padding: 6px;
    border: 1px solid rgba(211, 215, 219, 1);
  }


</style>
