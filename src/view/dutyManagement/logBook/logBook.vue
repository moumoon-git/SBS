<!--@author：wzm-->
<template>
  <div>
    <nav-bar :selectedName="selectedName" :navBarList="navBarList"  class="narBar" @changTab="changTab"></nav-bar>
    <duty-log  v-if="selectedName=='当班日志'"></duty-log>
    <history-log  v-if="selectedName=='历史日志'"></history-log>
  </div>
</template>

<script>
    import navBar from "@/components/menu/navBar"
    import dutyLog from "@/view/dutyManagement/logBook/dutyLog/dutyLog"
    import historyLog from "@/view/dutyManagement/logBook/historyLog/historyLog"
    export default {
        name: "logBook",
        components:{
          navBar,
          dutyLog,
          historyLog
        },
        data(){
          return{
            selectedName: "当班日志",//默认选中导航条
            navBarList: [
              {
                name: "当班日志"
              }, {
                name: "历史日志"
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
