<template>
    <div class="conferenceHistoryBox">
      <el-scrollbar style="height: 100%">
        <div style="padding: 20px">
          <el-tabs class="narBar " v-model="activeName"  @tab-click="handleClick">
            <el-tab-pane v-for="(bar,index) in navBarList"
                         :key="index" :label="bar.name" :name="bar.label">
            </el-tab-pane>
          </el-tabs>
          <start ref="start" v-if="activeName=='start'"></start>
          <joji-vue ref="jojiVue" v-if="activeName=='jojiVue'"></joji-vue>
        </div>
      </el-scrollbar>
    </div>
</template>

<script>
    import start from '@/view/yz_History/conferenceHistory/plug/start'
    import jojiVue from '@/view/yz_History/conferenceHistory/plug/jojiVue'
    export default {
        name: "conferenceHistory",
        components:{
          start,jojiVue
        },
        data(){
          return{
            activeName: 'start',
            navBarList:[
              {
                name: "发起会议记录",
                label:'start'
              },
              {
                name: "参与会议记录",
                label:'jojiVue'
              },
            ],
          }
        },
        methods:{
          //tabs点击
          handleClick(tab){
            this.activeName=tab.name
          }
        }
    }
</script>

<style scoped>
  .narBar {
    height: 56px;
    background: rgba(255, 255, 255, 1);
    /*border: 1px solid rgba(219, 219, 219, 1);*/
    /*border-radius: 3px;*/
  }
  .conferenceHistoryBox{
    margin:0 30px;
    padding:0 10px 0 10px;
    box-sizing: border-box;
    text-align: left;
    height: calc(100vh - 190px);
    box-sizing: border-box;
    background: white;
  }
</style>
