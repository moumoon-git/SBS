<!--@author：yf-->
<template>
    <div style="height: 100%">
      <nav-bar :selectedName="selectedName" :navBarList="navBarList"   @changTab="changTab"></nav-bar>
      <div>
<!--        <annex-information v-if="selectedName=='附件信息'"></annex-information>-->
        <fax-history v-if="selectedName=='传真历史'"></fax-history>
        <message-history v-if="selectedName=='短信历史'" @refreshEvent="refreshEvent"></message-history>
        <telephone-history v-if="selectedName=='电话历史'"></telephone-history>
      </div>

    </div>
</template>

<script>
    import navBar from "@/view/eventManagement/eventReports/Page/criminalHistory/navbar"
    // import annexInformation from "@/view/eventManagement/eventReports/Page/criminalHistory/annexInformation"
    import faxHistory from "@/view/eventManagement/eventReports/Page/criminalHistory/faxHistory"
    import messageHistory from "@/view/eventManagement/eventReports/Page/criminalHistory/messageHistory"
    import telephoneHistory from "@/view/eventManagement/eventReports/Page/criminalHistory/telephoneHistory"
    export default {
        name: "criminalHistory",
        components:{
          navBar,
          // annexInformation,
          faxHistory,
          messageHistory,
          telephoneHistory
        },
       data(){
         return{
           selectedName: "电话历史",//默认选中导航条
           navBarList: [
             {
               name: "电话历史"
             }, {
               name: "短信历史"
             }, {
               name: "传真历史"
             },
           ]//导航条模块
         }
       },
        methods:{
          changTab(tabName){
            return this.selectedName=tabName;
          },
          refreshEvent(){
            this.$emit('refreshEvent')
          }
        }
    }
</script>

<style scoped>

</style>
