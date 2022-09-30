<!--@author：llp-->
<template>
  <div>
    <div class="box-card">
      <div class="smsListBox">
        <p class="recipientInformation">收信人信息</p>
        <el-table ref="singleTable" :data="tableData" highlight-current-row
                  :header-cell-style="{background:'#E6E6E6',color:'#606266'}"
                  max-height="492px"
        >
          <el-table-column min-width="50" v-for="(item,key) in tableColumn" :key="key" :label="item.label"
                           :prop="item.prop"
                           :formatter="item.formatter"
                           :width="item.width" :resizable="false"></el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "smsDetails",
    data() {
      return {
        tableData: [],//表格数据
        tableColumn: [
          {
            prop: "name",
            label: "收信人",
          }, {
            prop: "smsTo",
            label: "号码"
          }, {
            prop: "type",
            label: "状态",
            formatter: this.typeFormatter
          }]//表头信息
      }
    },
    methods: {
      typeFormatter: function (row, column, cellVal) {
          return "待发送"
      },
      showData(data) {
        this.tableData =[];
        this.tableData=data
      }
    }

  }
</script>

<style scoped>
  .box-card {
    height: 792px;
    background: rgba(255, 255, 255, 1);
    border: 1px solid rgba(219, 219, 219, 1);
    border-radius: 3px;
  }

  .smsListBox {
    margin: 32px;
  }

  .recipientInformation {
    width: 100px;
    height: 19px;
    font-size: 20px;
    font-family: Microsoft YaHei, sans-serif;
    font-weight: 400;
    color: rgba(50, 50, 50, 1);
  }

</style>
