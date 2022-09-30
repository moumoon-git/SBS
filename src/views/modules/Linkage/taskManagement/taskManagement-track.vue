<template>
  <div class="taskManagementTrack">
      <div class="taskPeople">
        <p class="title">任务参与人</p>
         <img v-if="!telescopic" src="../../../../assets/img/task/retract.png" alt="" @click="telescopic=true">
          <img v-else src="../../../../assets/img/task/shrink.png" alt="" @click="telescopic=false">
      </div>
      <ul class="peopleList" :class="{'openStyle':telescopic}">
        <li class="onePeople" v-for="item in taskInfo.responsibleList" :key="item.id">
          <img src="../../../../assets/img/task/AlreadyRead.png">
          <span class="name">{{item.name}}</span>
        </li>
        <li class="onePeople" v-for="item in taskInfo.mailContactorList" :key="item.id">
          <img src="../../../../assets/img/task/Unread.png">
          <span class="name">{{item.name}}</span>
        </li>
      </ul>
      <div class="taskPeople">
        <p class="title">所有动态</p>
      </div>
      <ul class="taskList">
        <li class="oneTask" v-for="item in memberData" :key="item.id">
          <div class="taskProcess">
            <div>
              <img v-if="item.statusString == '发布任务'" src="../../../../assets/img/task/fabu.png">
              <img v-if="item.statusString == '阅读任务'" src="../../../../assets/img/task/AlreadyRead.png">
              <img v-if="item.statusString == '提交人员登记表'" src="../../../../assets/img/task/submission.png">
              <img v-if="item.statusString == '完成任务'" src="../../../../assets/img/task/complete.png">
              <img v-if="item.statusString == '重启任务'" src="../../../../assets/img/task/restart.png">
            </div>
            <div class="taskLeft">
              <p style="margin-bottom:8px;">
                <span>{{item.name}}</span>
                <span>{{item.statusString}}</span>
              </p>
              <div class="taskInfo" v-if="item.historyEntity">
                <p>登记对象：{{item.historyEntity.registerName}}</p>
                <p>备注信息：{{item.historyEntity.remark}}</p>
                <p style="color:#0091ff;cursor: pointer;" @click="trackForm(item.id)">查看人员排查登记表</p>
              </div>
            </div>
          </div>
          <div>{{item.doTime}}</div>
        </li>
      </ul>

      <!-- 任务跟踪表 -->
    <trackForm ref="trackFormView" v-if="trackFormView"></trackForm>
  </div>
</template>

<script>
import $ from 'jquery'
import trackForm from './trackForm'
export default {
  name: "taskManagement-track",
   props:{
    taskInfo:{
      type: Object,
    },
    taskId: {
      type: Number,
    }
  }
  ,
  data() {
    return {
      status: true,
      memberData: [],
      telescopic: false,//当前排查对象收缩状态
      trackFormView: false, //跟踪试图
    };
  },
  created(){
      this.liucheng()
  },
  methods: {
    liucheng(){
      this.$http({
        url: this.$http.adornUrl(`/task/taskInfor/getRecordList`),
        method: "get",
        params: this.$http.adornParams({ 
            taskId: this.taskId,
         })
      }).then(({ data }) => {
        if (data && data.code === 0) {
          // console.log(data)
          this.memberData = data.data
        } else {
          // this.memberData = []
          this.$message.error(data.msg);
        }
      });
    },
    trackForm(id){
      this.trackFormView = true
      this.$refs.trackFormView.init(this.taskId,id)
    }
  },
  components:{
    trackForm,
  }
};
</script>

<style lang="scss">
.taskManagementTrack {
  p{
    margin: 0;
  }
  ul{
    padding: 0;
    list-style: none;
  }
  // 任务参与人
 .taskPeople{
   background:rgba(249,251,255,1);
   display: flex;
   justify-content: space-between;
   height:37px;
   align-items: center;
   padding: 0 20px 0 10px;
   .title{
     font-size:12px;
     color:rgba(51,51,51,1);
     font-weight: bold;
   }
 }
 .peopleList{
   display: flex;
   padding: 0 5px;
   margin: 0;
   margin-top: 15px;
   flex-wrap: wrap;
   height: 46px;
   overflow: hidden;
   .onePeople{
     text-align: center;
     align-items: center;
     margin: 0 5px 10px;
     border-radius:3px;
     width:98px;
     height:36px;
     line-height: 32px;
     border:1px solid rgba(0,145,255,0.24);
     font-weight: bold;
     .name{
       color: #666;
       margin-left: 10px;
     }
   }
 }
  //参与人展开样式
 .openStyle{
   height: 92px;
   overflow: scroll;
   &::-webkit-scrollbar{
     width: 0;
     height: 0 !important;
   }
 }
  // 所有动态
 .taskList{
   .oneTask{
     display: flex;
     justify-content: space-between;
     align-items: center;
     padding: 13px 10px 2px 11px;
     color: #666;
     border-bottom: 1px solid rgba(233,236,241,1);
     .taskProcess{
       display: flex;
       .taskLeft{
         margin-left: 13px;
         .taskInfo{
           p{
            margin-bottom: 10px;
            
           }
         }
       }
     }
   }
 }
}
</style>