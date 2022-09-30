<!--@author：llp-->
<template>
  <div>
    <div class="urgentInformation">
      <el-row style="margin: 20px auto">
        <el-col :span="12">
          <span>间隔:</span>
          <span class="interval">{{reminderMsg.interval}}</span>
          <span>min</span>
        </el-col>
        <el-col :span="12">
          <span>次数:</span>
          <span class="interval">{{reminderMsg.currCount}}</span>
          <span>/{{reminderMsg.count}}</span>
        </el-col>
      </el-row>
      <el-row class="timingTime">
        <el-col :span="8">上次催报时间:</el-col>
        <el-col :span="16">
          <el-col :span="12">{{year}}</el-col>
          <el-col :span="12">{{time}}</el-col>
        </el-col>
      </el-row>
    </div>

    <div class="box-card">
      <div class="smsListBox">
        <p class="recipientInformation">收信人信息</p>
        <el-table ref="singleTable" :data="tableData" highlight-current-row
                  :header-cell-style="{background:'#E6E6E6',color:'#606266'}"
                  max-height="492px"
        >
          <el-table-column min-width="50" v-for="(item,key) in tableColumn" :key="key" :label="item.label"
                           :prop="item.prop"
                           :width="item.width" :resizable="false"></el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "reminderMsgDetails",
    data() {
      return {
        tableData: [],//表格数据
        tableColumn: [
          {
            prop: "contactorName",
            label: "收信人",
          }, {
            prop: "number",
            label: "号码"
          }],//表头信息
        reminderMsg: [],//催报详细信息
        year: '',//上次催报年月日
        time: '',//上次催报时间
      }
    },
    methods: {
      showData(data) {
        if (data != null || data != '') {
          this.tableData = data;
          this.reminderMsg = data[0];
          this.year = this.reminderMsg.pdate.substr(0, 10);
          this.time = this.reminderMsg.pdate.substr(11, 18)
        } else {
          this.tableData = [];
          this.reminderMsg = [];
          this.year = null;
          this.time = null;
        }
      },
    }
  }
</script>

<style scoped>
  .urgentInformation {
    height: 180px;
    margin:0 8px;
    padding: 0 28px;
    background: rgba(255, 255, 255, 1);
    border: 1px solid rgba(219, 219, 219, 1);
    border-radius: 3px;
  }

  .interval {
    width: 14px;
    height: 24px;
    font-size: 30px;
    font-family: Microsoft YaHei, sans-serif;
    font-weight: 400;
    color: rgba(71, 157, 255, 1);
  }

  .timingTime {
    margin-top: 44px;
    height: 12px;
    font-size: 14px;
    font-family: Microsoft YaHei, sans-serif;
    font-weight: 400;
    color: rgba(50, 50, 50, 1);
  }

  .box-card {
    height: 592px;
    margin:16px 8px 0 8px;
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
