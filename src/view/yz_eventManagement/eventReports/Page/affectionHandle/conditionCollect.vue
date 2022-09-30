<template>
  <el-container>
    <div style="width: 100%;margin-top: 10px">
      <el-tabs type="card" v-model="activeName" @tab-click="handleClick">
        <el-tab-pane v-for="(bar,index) in navBarList" :key="index" :label="bar.name" :name="bar.name"></el-tab-pane>
        <damaged-condition v-show="activeName=='受损情况'"></damaged-condition>
        <rescue-power v-show="activeName=='救援力量'"></rescue-power>
        <goods-condition v-show="activeName=='物资情况'"></goods-condition>
        <evacuate-condition v-show="activeName=='疏散情况'"></evacuate-condition>
        <hidden-danger v-show="activeName=='隐患情况'"></hidden-danger>
        <situation-report v-show="activeName=='情况报告'"></situation-report>
      </el-tabs>
    </div>
  </el-container>
</template>

<script>
  import damagedCondition from "@/view/yz_eventManagement/eventReports/Plan/caseSummary/damagedCondition"
  import rescuePower from "@/view/yz_eventManagement/eventReports/Plan/caseSummary/rescuePower"
  import goodsCondition from "@/view/yz_eventManagement/eventReports/Plan/caseSummary/goodsCondition"
  import evacuateCondition from "@/view/yz_eventManagement/eventReports/Plan/caseSummary/evacuateCondition"
  import hiddenDanger from "@/view/yz_eventManagement/eventReports/Plan/caseSummary/hiddenDanger"
  import situationReport from "@/view/yz_eventManagement/eventReports/Plan/caseSummary/SituationReport"

  export default {
    name: "conditionCollect",
    components: {
      damagedCondition,
      rescuePower,
      goodsCondition,
      evacuateCondition,
      hiddenDanger,
      situationReport
    },
    data() {
      return {
        activeName: "受损情况",//默认选中导航条
        navBarList: [
          {
            name: "受损情况"
          }, {
            name: "救援力量"
          }, {
            name: "物资情况"
          }, {
            name: "疏散情况"
          }, {
            name: "隐患情况"
          }, {
            name: "情况报告"
          }
        ],//导航条模块
      }
    },
    methods: {
      handleClick(tab) {
        return this.activeName = tab.name;
      },
    }
  }
</script>

<style scoped>
  >>> .el-tabs--border-card {
    border: none;
  }
</style>
