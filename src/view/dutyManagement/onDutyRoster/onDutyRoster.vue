<!--@author：wzm-->
<template>
  <div>
    <nav-bar :selectedName="selectedName" :navBarList="navBarList" class="narBar" @changTab="changTab"></nav-bar>
    <workforce-management v-if="selectedName=='排班管理'"></workforce-management>
    <history-and-scheduling v-if="selectedName=='历史排班'"></history-and-scheduling>
    <flight-management v-if="selectedName=='班次管理'"></flight-management>
    <operator-on-duty v-if="selectedName=='值班人员'"></operator-on-duty>
    <holiday-management v-if="selectedName=='节假日管理'"></holiday-management>
    <subordinateScheduling v-if="selectedName=='街道排班'"></subordinateScheduling>
  </div>
</template>

<script>
  import NavBar from "@/components/menu/navBar";
  import WorkforceManagement from "@/view/dutyManagement/onDutyRoster/workforceManagement/workforceManagement"
  import historyAndScheduling from "@/view/dutyManagement/onDutyRoster/historyAndScheduling/historyAndScheduling"
  import flightManagement from "@/view/dutyManagement/onDutyRoster/flightManagement/flightManagement"
  import operatorOnDuty from "@/view/dutyManagement/onDutyRoster/operatorOnDuty/operatorOnDuty"
  import holidayManagement from "@/view/dutyManagement/onDutyRoster/holidayManagement/holidayManagement"
  import subordinateScheduling from "@/view/dutyManagement/onDutyRoster/subordinateScheduling/subordinateScheduling";

  export default {
    name: "onDutyRoster",
    components: {
      NavBar,
      WorkforceManagement,
      historyAndScheduling,
      flightManagement,
      operatorOnDuty,
      holidayManagement,
      subordinateScheduling
    },
    data() {
      return {
        selectedName: "排班管理",//默认选中导航条
        navBarList: [
          {
            name: "排班管理"
          }, {
            name: "历史排班"
          }, {
            name: "班次管理"
          }, {
            name: "值班人员"
          }, {
            name: "节假日管理"
          }, {
            name: '街道排班'
          }
        ]//导航条模块
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
