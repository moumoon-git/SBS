<!--
 * @Author: your name
 * @Date: 2021-08-18 16:05:38
 * @LastEditTime: 2021-08-18 16:09:00
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \project-nanhai\src\views\modules\riskInvestigation\statisticAnalysis\workOnDuty\workOnDuty.vue
-->
<template>
   <div>
     <nav-bar :selectedName="selectedName" :navBarList="navBarList" class="narBar" @changTab="changTab"></nav-bar>
     <traffic-statistic v-if="selectedName=='话务统计'"></traffic-statistic>
     <text-statistics v-if="selectedName=='短信统计'"></text-statistics>
     <fax-statistics v-if="selectedName=='传真统计'"></fax-statistics>
     <roll-on-duty v-if="selectedName=='值班点名'"></roll-on-duty>
  </div>
</template>

<script>
    import navBar from "@/components/menu/navBar"
    import trafficStatistic from "./page/trafficStatistic"
    import textStatistics from "./page/textStatistics"
    import faxStatistics from "./page/faxStatistics"
    import rollOnDuty from "./page/rollOnDuty"
    export default {
        name: "workOnDuty",
        components:{
          navBar,
          trafficStatistic,
          textStatistics,
          faxStatistics,
          rollOnDuty
        },
        data(){
          return{
            selectedName: "话务统计",//默认选中导航条
            navBarList: [
              {
                name: "话务统计"
              }, {
                name: "短信统计"
              },
              {
                name: "传真统计"
              },
              {
                name: "值班点名"
              }]//导航条模块
          }
        },
        methods: {
          changTab(tabName) {
            return this.selectedName = tabName;
          },
        }
    }
</script>

<style scoped>

</style>
