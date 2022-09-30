<!--
 * @Author: your name
 * @Date: 2021-08-18 16:02:52
 * @LastEditTime: 2021-08-18 16:09:13
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \project-nanhai\src\views\modules\riskInvestigation\statisticAnalysis\eventInformation\eventList\eventTable.vue
-->
<template>
  <div>
    <el-table
      :data="tableData"
      :header-cell-style="{background:'rgba(249,252,255,1)',color:'#black'}"
      style="width: 100%">
      <el-table-column
        v-if="changeStatus.occurDate"
        prop="occurDate"
        label="日期"
        width="130">
      </el-table-column>
      <el-table-column
        v-if="changeStatus.reportTime"
        prop="reportTime"
        label="接报时间"
        width="130"
        align="center">
      </el-table-column>
      <el-table-column
        v-if="changeStatus.reason"
        prop="reason"
        label="事件内容"
        align="center"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        v-if="changeStatus.reportDescription"
        prop="reportDescription"
        label="事件报文"
        align="center"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        v-if="changeStatus.occurTime"
        prop="occurTime"
        label="发生时间"
        width="130"
        align="center">
      </el-table-column>
      <el-table-column
        v-if="changeStatus.fineTime"
        prop="fineTime"
        label="处置完成时间"
        width="130"
        align="center">
      </el-table-column>
      <el-table-column
        v-if="changeStatus.caseClassName"
        prop="caseClassName"
        label="类别"
        width="80"
        >
      </el-table-column>
      <el-table-column
        v-if="changeStatus.isInWorkHours"
        prop="isInWorkHours"
        label="是否8小时工作时间内"
        width="90"
        align="center">
      </el-table-column>
      <el-table-column
        v-if="changeStatus.isInNightHours"
        prop="isInNightHours"
        label="是否在深夜21-07时间"
        width="90"
        align="center">
      </el-table-column>
      <el-table-column
        v-if="changeStatus.isReportToDistrict"
        prop="isReportToDistrict"
        label="上报区领导"
        width="90"
        align="center">
      </el-table-column>
      <el-table-column
        v-if="changeStatus.isReportToCity"
        prop="isReportToCity"
        label="报市政府"
        width="80"
        align="center">
      </el-table-column>
      <el-table-column
        v-if="changeStatus.deathCount"
        prop="deathCount"
        label="亡人数"
        width="80"
        align="center">
      </el-table-column>
      <el-table-column
        v-if="changeStatus.injuredCount"
        prop="injuredCount"
        label="伤人数"
        width="80"
        align="center">
      </el-table-column>
      <el-table-column
        v-if="changeStatus.receiveOperator"
        prop="receiveOperator"
        label="经办"
        width="80"
        >
      </el-table-column>
      <el-table-column
        v-if="changeStatus.cityOperationClass"
        prop="cityOperationClass"
        label="城市运行细分类"
        width="80"
        align="center">
      </el-table-column>
      <el-table-column
        v-if="changeStatus.area"
        prop="area"
        label="属地"
        width="80"
        >
      </el-table-column>
    </el-table>
    <!-- 分页器 -->
    <el-pagination
      :current-page.sync="currentPage"
      :page-sizes="[20, 40, 60, 80, 100]"
      :page-size="pageSize"
      :total="total"
      layout="total, prev, pager, next, jumper"
      @current-change="currentPageChange"
      @size-change="pageSizeChange"
      background
      style="text-align: right;background: white;padding:8px 5px">
    </el-pagination>
  </div>
</template>

<script>
export default {
  name: 'EventTable',
  props: {
    checkedCol: {
      default: [
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
      ]
    },
    tableData: { // 表格数据
      default: []
    },
    total: { // 总条数
      default: 0
    }
  },
  computed: {
    // 日期 occurDate
    // 接报时间 reportTime
    // 事件内容 reason
    // 事件报文 reportDescription
    // 发生时间 occurTime
    // 完成时间 fineTime
    // 类别 caseClassName
    // 8小时内 isInWorkHours
    // 深夜时间内 isInNightHours
    // 上报区领导 isReportToDistrict
    // 上报市政府 isReportToCity
    // 死亡人数 deathCount
    // 受伤人数 injuredCount
    // 经办 receiveOperator
    // 城市运行 cityOperationClass
    // 属地 area
    changeStatus: function() {
      let data = {
        occurDate: this.checkedCol.filter(item=>item === 'occurDate').length > 0 ? true : false,
        reportTime: this.checkedCol.filter(item=>item === 'reportTime').length > 0 ? true : false,
        reason: this.checkedCol.filter(item=>item === 'reason').length > 0 ? true : false,
        reportDescription: this.checkedCol.filter(item=>item === 'reportDescription').length > 0 ? true : false,
        occurTime: this.checkedCol.filter(item=>item === 'occurTime').length > 0 ? true : false,
        fineTime: this.checkedCol.filter(item=>item === 'fineTime').length > 0 ? true : false,
        caseClassName: this.checkedCol.filter(item=>item === 'caseClassName').length > 0 ? true : false,
        isInWorkHours: this.checkedCol.filter(item=>item === 'isInWorkHours').length > 0 ? true : false,
        isInNightHours: this.checkedCol.filter(item=>item === 'isInNightHours').length > 0 ? true : false,
        isReportToDistrict: this.checkedCol.filter(item=>item === 'isReportToDistrict').length > 0 ? true : false,
        isReportToCity: this.checkedCol.filter(item=>item === 'isReportToCity').length > 0 ? true : false,
        deathCount: this.checkedCol.filter(item=>item === 'deathCount').length > 0 ? true : false,
        injuredCount: this.checkedCol.filter(item=>item === 'injuredCount').length > 0 ? true : false,
        receiveOperator: this.checkedCol.filter(item=>item === 'receiveOperator').length > 0 ? true : false,
        cityOperationClass: this.checkedCol.filter(item=>item === 'cityOperationClass').length > 0 ? true : false,
        area: this.checkedCol.filter(item=>item === 'area').length > 0 ? true : false,
      }
      console.log(data);
      return data ;
    }
  },
  data() {
    return {
      // tableData: [],
      // total: 0, //数据总数
      pageSize: 20, //每页条数
      currentPage: 1, //当前页数
    }
  },
  methods: {
    currentPageChange(curentPage) {
      this.$emit('currentPageChange', curentPage);
    },
    pageSizeChange(pageSize) {
      this.$emit('pageSizeChange', pageSize);

    }
  }
}
</script>

<style>

</style>
