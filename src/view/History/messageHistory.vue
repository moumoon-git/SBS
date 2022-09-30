<template>
    <div>
      <nav-bar style="background-color: #F9FBFF;"  ref="navBar" :selectedName="selectedName" :navBarList="navBarList" class="narBar"
               @changTab="changTab" ></nav-bar>
      <fax-history ref="faxHistory" v-if="selectedName=='传真历史'"></fax-history>
      <msg-history ref="msgHistory" v-if="selectedName=='短信历史'"></msg-history>
      <phone-history ref="phoneHistory" v-if="selectedName=='电话历史'"></phone-history>
      <!-- <conference-history ref="conferenceHistory" v-if="selectedName=='会议历史'"></conference-history> -->
    </div>
</template>

<script>
    import navBar from "./components/navBar"
    import faxHistory from '@/view/History/faxHistory/faxHistory'
    import msgHistory from '@/view/History/msgHistory/msgHistory'
    import phoneHistory from '@/view/History/phoneHistory/phoneHistory'
    import conferenceHistory from '@/view/History/conferenceHistory/conferenceHistory'
      export default {
        name: "messageHistory",
        components:{
          navBar,faxHistory,msgHistory,phoneHistory,conferenceHistory  
        },
        data(){
          return{
            selectedName: "电话历史",//默认选中导航条
            tabType: '',
            navBarList: [
              {
                name: "电话历史"
              },{
                name: "短信历史"
              },{
                name: "传真历史"
              },
              // {
              //   name: "会议历史"
              // },
            ],//导航条模块
          }
        },
        created() {
          console.log(this.$route.query.type)
          let tabType = this.$route.query.type // msg
          if (tabType === 'msg') {
            this.selectedName = '短信历史'
          } else if (tabType === 'phone') {
            this.selectedName = '电话历史'
          } else if (tabType === 'fax') {
            this.selectedName = '传真历史'
          }
        },
        watch:{
          '$route.query.type'(newVal, oldVal){
            console.log(12331233131)
            if (!newVal){
              return
            }
            if (newVal === 'msg') {
              this.selectedName = '短信历史'
            } else if (newVal === 'phone') {
              this.selectedName = '电话历史'
            } else if (newVal === 'fax') {
              this.selectedName = '传真历史'
            }
          }
        },
        methods:{
          changTab(tabName) {
            this.selectedName=tabName;
            // this.$router.push({path:'/messageHistory'}) // 注释原因：在本页面跳转本页面会报错（hexinting）
          },
        }
    }
</script>

<style scoped>
>>>.el-tabs__nav-scroll{
  margin: 0;
}
</style>
