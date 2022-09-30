<!--
 * @Author: your name
 * @Date: 2021-08-18 16:03:12
 * @LastEditTime: 2021-08-20 11:40:16
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \project-nanhai\src\views\modules\riskInvestigation\statisticAnalysis\eventInformation\eventList\eventList.vue
-->
<template>
  <div class="container">
    <filter-condition :show-button="isShowButton" @getData="getData" @exportToExcel="exportToExcel"></filter-condition>
    <event-filter-condition
     @change="handleConditionChange" />
    <event-table
     :table-data="tableData"
     :checked-col="checkedCol"
     :total="total"
     @pageSizeChange="pageSizeChange"
     @currentPageChange="currentPageChange"></event-table>
  </div>
</template>

<script>
import EventFilterCondition from './eventFilterCondition'
import EventTable from './eventTable'
import filterCondition from '../filterCondition'
import axios from 'axios'
import Cookies from "js-cookie";
const downLoadFile = require('@/utils/downloadFile.js').default;
export default {
  name: 'eventList',
  components: {
    EventFilterCondition,
    EventTable,
    filterCondition
  },
  data() {
    return {
      isShowButton: true,
      checkedCol: 
      [
       'occurDate',
       'receiveOperator',
       'reason',
       'reportDescription',
       'isReportToDistrict',
       'isReportToCity',
       'occurTime', 
       'fineTime',
       'reportTime', 
       'deathCount', 
       'injuredCount', 
       'isInWorkHours', 
       'isInNightHours', 
       'caseClassName', 
       'cityOperationClass', 
       'area'
      ],
      pageSize: 20,
      currentPage: 1,
      tableData: [],
      total: 0,
      totalPages: 0,
      startTime: '',
      endTime: ''
    }
  },
  mounted() {
  },
  methods: {
    // 条件勾选
    handleConditionChange(data) {
      // console.log('选中的值', data)
      this.checkedCol = data;
    },
    // 获取表格数据
    getSjsEventList() {
      let data = {
        startTime: this.startTime,
        endTime: this.endTime,
        page: this.currentPage,
        size: this.pageSize
      }
      this.$api.getSjsEventList(data).then(res => {
        if (res.errorcode === 0) {
          console.log('表格数据：', res.data);
          this.tableData = res.data.data;
          this.total = res.data.totalElements;
        }
      }).catch(() => {})
    },
    // 绑定数据
    getData(date) {
      this.currentPage = 1
      this.pageSize = 20
      this.startTime = date.startTime
      this.endTime = date.endTime
      console.log('时间参数：', date)
      this.getSjsEventList()
    },
    // 导出表格
    exportToExcel(data) {
      data.columnNames = this.checkedCol
      axios({
        method: "post",
        url: window.g.ApiUrl + "/eos/statistics/eventStatController/exportSjsEventListToExcel",
        responseType: 'arraybuffer',
        data,
        headers:{
        'token': Cookies.get('token')
        }
      })
      .then(res => {
        var elink = document.createElement('a');
        elink.download = "事件分析报告.xlsx";
        elink.style.display = 'none';
        var blob = new Blob([res.data], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
        
        elink.href = URL.createObjectURL(blob);
        document.body.appendChild(elink);
        elink.click();
        document.body.removeChild(elink);
      }).catch(() => {})
    },
    // pageSize： 页数
    pageSizeChange(pageSize) {
      console.log('页数改变', pageSize)
      this.pageSize = pageSize
      this.getSjsEventList()
    },
    // currentPage: 当前页
    currentPageChange(currentPage) {
      console.log('当前页改变', currentPage)
      this.currentPage = currentPage
      this.getSjsEventList()
    }
  }
}
</script>

<style>
.container {
  margin: 20px 0px;
  -webkit-box-flex: 1;
  -ms-flex: 1;
  flex: 1;
  background: white;
  -webkit-box-shadow: 0px 3px 10px 2px rgba(54, 121, 225, 0.09);
  box-shadow: 0px 3px 10px 2px rgba(54, 121, 225, 0.09);
  border-radius: 3px;
  height: calc(100vh - 100px);
}
</style>