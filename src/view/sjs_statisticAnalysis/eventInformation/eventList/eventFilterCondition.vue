<!--
 * @Author: your name
 * @Date: 2021-08-18 16:03:33
 * @LastEditTime: 2021-08-18 16:09:15
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \project-nanhai\src\views\modules\riskInvestigation\statisticAnalysis\eventInformation\eventList\eventFilterCondition.vue
-->
<template>
    <div class="condition">
      <div class="check-box-list">
        <div class="title">
          <span>勾选条件</span>
        </div>
        <div class="check-group">
          <el-checkbox-group v-model="checked" @change="handleCheckedCitiesChange">
            <el-checkbox v-for="item in option" :label="item.value" :key="item.value">{{item.name}}</el-checkbox>
          </el-checkbox-group>
        </div>
      </div>
    </div>
</template>

<script>
export default {
  name: 'EventFilterCondition',
  data() {
    return {
      checked: 
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
      ], // 勾选到的值
      option: [
        {
          name: '日期',
          value: 'occurDate'
        },
        {
          name: '接报时间',
          value: 'reportTime'
        },
        {
          name: '事件内容',
          value: 'reason'
        },
        {
          name: '事件报文',
          value: 'reportDescription'
        },
        {
          name: '发生时间',
          value: 'occurTime'
        },
        
        {
          name: '完成时间',
          value: 'fineTime'
        },
        {
          name: '类别',
          value: 'caseClassName'
        },
        {
          name: '8小时内',
          value: 'isInWorkHours'
        },
        {
          name: '深夜时间内',
          value: 'isInNightHours'
        },
        {
          name: '上报区领导',
          value: 'isReportToDistrict'
        },
        {
          name: '上报市政府',
          value: 'isReportToCity'
        },
        {
          name: '死亡人数',
          value: 'deathCount'
        },
        {
          name: '受伤人数',
          value: 'injuredCount'
        },
        {
          name: '经办',
          value: 'receiveOperator'
        },
        {
          name: '城市运行',
          value: 'cityOperationClass'
        },
        {
          name: '属地',
          value: 'area'
        }
      ] // 表头可勾选项
    }
  },
  methods: {
    handleCheckedCitiesChange(data){
      this.$emit('change', data);
    }
  }
}
</script>

<style scoped>
  .condition {
    display: flex;
    padding: 0 20px 10px 20px;
    align-items: flex-start;
    text-align: left;
  }
  .title {
    color:rgba(102,102,102,1);
    width: 60px;
    display: block;
    padding-right: 10px;
    font-size: 14px;
  }
  .check-box-list {
    display: flex;
    align-items: flex-start;
    /* justify-content: space-between; */
    /* width: 864px; */
  }
  .check-group {
    text-align: left;
  }
  .check-group .el-checkbox {
    padding-bottom: 10px !important;
  }
</style>