<!--
 * @Author: your name
 * @Date: 2021-08-18 15:45:38
 * @LastEditTime: 2021-08-18 16:17:03
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \project-nanhai\src\views\modules\riskInvestigation\statisticAnalysis\eventInformation\eventInformation_copy.vue
-->
<template>
   <div>
     <nav-bar :selectedName="selectedName" :navBarList="navBarList" class="narBar" @changTab="changTab"></nav-bar>
     <event-trend-analysis v-if="selectedName=='事件趋势分析'"></event-trend-analysis>
     <event-Distribution v-if="selectedName=='事件分布分析'"></event-Distribution>
     <event-list v-if="selectedName=='事件列表分析'"></event-list>
  </div>
</template>

<script>
    import navBar from "@/components/menu/navBar"
    import eventTrendAnalysis from "./eventTrendAnalysis"
    import eventList from "./eventList/eventList"
    import eventDistribution from "./eventDistribution/eventDistribution"
    import rollOnDuty from "../workOnDuty/page/rollOnDuty"
    export default {
        name: "workOnDuty",
        components:{
          navBar,
          eventTrendAnalysis,
          eventList,
          eventDistribution,
          rollOnDuty
        },
        data(){
          return{
            selectedName: "事件趋势分析",//默认选中导航条
            navBarList: [
              {
                name: "事件趋势分析"
              },
              {
                name: "事件分布分析"
              },
              {
                name: "事件列表分析"
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
