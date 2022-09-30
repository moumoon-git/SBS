<!--@author：yf-->
<template>
    <div>
      <nav-bar :selectedName="selectedName" :navBarList="navBarList"  @changTab="changTab"></nav-bar>
      <div>
        <operating-records  v-show="selectedName=='操作记录'"></operating-records>
        <historical-records  v-show="selectedName=='历史回溯'" ref="historicalRecords"></historical-records>
      </div>

    </div>
</template>

<script>
    import navBar from "@/view/eventManagement/eventReports/Page/criminalHistory/navbar"
    import historicalRecords from "@/view/eventManagement/eventReports/Page/operatingRecord/historicalRecords"
    import operatingRecords from "@/view/eventManagement/eventReports/Page/operatingRecord/operationalRecords"
    export default {
        name: "operatingRecord",
        components:{
          navBar,
          operatingRecords,
          historicalRecords
        },
      data(){
        return{
          selectedName: "操作记录",//默认选中导航条
          navBarList: [
            {
              name: "操作记录"
            },{
              name: "历史回溯"
            }
          ]//导航条模块
        }
      },
      methods:{
        changTab(tabName){
          return this.selectedName=tabName;
        },

      }
    }
</script>

<style scoped>

</style>
