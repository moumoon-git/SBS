<template>
  <div class="taskManagementTable">
    <div class="taskPeople">
        <p class="title">排查对象</p>
        <img v-if="!telescopic" src="../../../../assets/img/task/retract.png" alt="" @click="telescopic=true">
        <img v-else src="../../../../assets/img/task/shrink.png" alt="" @click="telescopic=false">
      </div>
      <ul class="peopleList" :class="{'openStyle':telescopic}">
        <li class="onePeople" v-for="item in this.taskInfo.epiRegisterList" :key="item.id" @click="seeProcess(item.id)">
          <div style="width:75%">
            <p class="name textHiding">{{item.imName}}</p>
            <p class="textHiding">{{item.humanTypeString}}</p>
          </div>
          <div style="color:#0091FF;cursor: pointer;" @click.stop="registraForm(item.id)">
            详情
          </div>
        </li>
      </ul>
      <div class="taskPeople">
        <p class="title">跟踪记录</p>
      </div>
      <ul class="taskList">
        <li class="oneTask" v-for="item in memberData" :key="item.id">
          <div class="taskProcess">
            <div>
              <img src="../../../../assets/img/task/experience.png">
            </div>
            <div class="taskLeft">
              <p style="margin-bottom:8px;">
                <span style="margin-right:42px;">登记人：{{item.registerName}}</span>
                <span>排查结果：{{item.investigateResultString}}</span>
              </p>
              <div class="taskInfo">
                <p class="textHiding">备注信息：{{item.remark}}</p>
                <p style="color:#0091FF;cursor: pointer;" @click="trackForm(item.id)">查看登记表</p>
              </div>
            </div>
          </div>
          <div>{{item.gmtCreate}}</div>
        </li>
      </ul>

    <el-dialog
      title="排查登记表"
      :visible.sync="centerDialogVisible"
      width="600px"
      center
      >
      <div style="display:flex;justify-content:space-between;margin-bottom:20px;">
        <div>登记人：{{registraData.registerName}}</div>
        <div>登记时间：{{registraData.gmtCreate}}</div>
      </div>

      <div style="backgroundColor:#f0f0f0;padding: 20px;margin-bottom:20px;">
        <p style="text-align:center">登记信息</p>
        <div v-for="(item,index) in registraInfo" :key="index">
          <div style="display:flex;"><p style="width:20px;">{{index+1}}.</p><p>{{item.title}}</p></div>
          <template v-if="item.topicName === '单选题'">
            <div v-for="one in item.answer.indexOf(',')>-1?item.answer.split(','):[item.answer]" :key="one.id">
              <div v-for="v in item.epiSelectEntityList" :key="v.id">
                <p v-if="one == v.id">{{v.content}}</p>
              </div>
            </div>
          </template>
          <template v-if="item.topicName === '混答+多选'">
              <div v-for="one in item.answer.indexOf(',')>-1?item.answer.slice(0,item.answer.indexOf('#')).split(','):[item.answer.slice(0,item.answer.indexOf('#'))]" :key="one.id">
                <div v-for="v in item.epiSelectEntityList" :key="v.id">
                  <p v-if="one == v.id && v.ifInput=='1'">{{item.answer.slice(item.answer.indexOf('#')+2,item.answer.length)}}</p>
                  <p v-else-if="one == v.id">{{v.content}}</p>
                </div>
              </div>
            <!-- <p v-if="item.answer.indexOf('#')>-1">{{item.answer.slice(item.answer.indexOf('#')+2,item.answer.length)}}</p> -->
          </template>
          <template v-if="item.topicName === '混答+单选'">
            <div v-for="v in item.epiSelectEntityList" :key="v.id">
              <p v-if="item.answer.indexOf('#')>-1?item.answer.slice(0,item.answer.indexOf('#')):item.answer == v.id">{{v.content}}{{item.answer.indexOf('#')>-1?','+item.answer.slice(item.answer.indexOf('#')+2,item.answer.length):""}}</p>
            </div>
          </template>
        </div>
        <!-- <p>1.您和您的家人身体状况</p>
        <p>自觉正常</p>
        <p>2.体温检测</p>
        <p>36.8度</p>
        <p>3.您和您最近是否有外出</p>
        <p>否</p>
        <p>4.最近是否有亲友来访，尤其湖北或武汉亲友</p>
        <p>否</p>
        <p>5.您或您的家人是否已复工</p>
        <p>否</p> -->
      </div>

      <div style="backgroundColor:#f0f0f0;padding: 20px;">
        <p style="text-align:center">登记情况</p>
        <p>登记结果：{{registraData.investigateResultString}}</p>
        <div style="display:flex;">
          <p style="width:145px">备注信息：</p>
          <p>{{registraData.remark}}</p>
        </div>
      </div>

      <span slot="footer" class="dialog-footer">
        <el-button @click="centerDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="centerDialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 任务跟踪表 -->
    <trackForm ref="trackFormView" v-if="trackFormView"></trackForm>
  </div>
</template>

<script>
// import '@/assets/iconfont/iconfont.css'
import trackForm from './trackForm'
export default {
  name: "taskManagement-table",
  props:{
    taskInfo:{
      type: Object,
    },
    taskId: {
      type: Number,
    }
  },
  data() {
    return {
      status: true,
      memberData: [],
      centerDialogVisible: false, // 登记表试图
      registraData: [],//登记表
      registraInfo: [],//登记信息
      idx: 0,
      telescopic: false,//当前参与人收缩状态
      memberData: [], //跟踪记录
      trackFormView: false, //跟踪试图
    };
  },
  created(){
    if (this.taskInfo.epiRegisterList.length>0) {
      this.seeProcess(this.taskInfo.epiRegisterList[0].id)
    }
  },
  methods: {
    seeProcess(index) {
      this.idx = index
      this.$http({
        url: this.$http.adornUrl(`/task/taskRegisterHistory/list`),
        method: "get",
        params: this.$http.adornParams({ 
            page: 1,
            limit: 5,
            taskId: this.taskId,
            registerId: index,
         })
      }).then(({ data }) => {
        if (data && data.code === 0) {
          // console.log(data)
          this.memberData = data.page.list
        } else {
          this.memberData = []
          this.$message.error(data.msg);
        }
      });
    },
    registraForm(id){
      this.centerDialogVisible = true
      this.$http({
        url: this.$http.adornUrl(`/task/taskRegisterHistory/getOneAndLink`),
        method: "get",
        params: this.$http.adornParams({ 
            id,
            taskId:this.taskId
         })
      }).then(({ data }) => {
        if (data && data.code === 0) {
          // console.log(data)
          this.registraData = data.data
          this.registraInfo = data.data.epiRegisterTikuEntity.epiQuestionEntityList
        } else {
          this.registraData = []
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
.taskManagementTable{
  p{
    margin: 0;
  }
  ul{
    padding: 0;
    list-style: none;
  }
  // 排查对象
 .taskPeople{
   background:rgba(249,251,255,1);
   display: flex;
   justify-content: space-between;
   align-items: center;
   height:37px;
   padding: 0 20px 0 10px;
   .title{
     font-size:12px;
     color:rgba(51,51,51,1);
     font-weight: bold;
   }
   .shrink{
     width: 24px;
     height: 24px;
   }
 }
 .peopleList{
   display: flex;
   padding: 0 5px;
   margin: 0;
   margin-top: 15px;
   flex-wrap: wrap;
   height: 60px;
   overflow: hidden;
   .onePeople{
     text-align: center;
     margin: 0 5px 10px;
     border-radius:3px;
     width:135px;
     height:50px;
     border:1px solid rgba(0,145,255,0.24);
     font-weight: bold;
     display: flex;
     align-items: center;
     justify-content: space-between;
     padding: 0 10px 0 11px;
     font-size: 12px;
     color: #666;
     .name{
       font-size: 14px;
     }
   }
 }
  //参与人展开样式
 .openStyle{
   height: 120px;
   overflow: scroll;
   &::-webkit-scrollbar{
     width: 0;
     height: 0 !important;
   }
 }
  // 跟踪记录
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
       width: 75%;
       .taskLeft{
         margin-left: 13px;
         width: 95%;
         .taskInfo{
           p{
            margin-bottom: 10px;
           }
         }
       }
     }
   }
 }
 /deep/ .el-dialog {
  border-radius: 5px;
  .el-dialog__header {
    background-color: rgba(241,244,246,1) !important;
    border-radius: 5px 5px 0 0;
    height: 40px;
    line-height: 43px;
    padding: 0 !important;
    .el-dialog__headerbtn {
      top: 0px;
      .el-dialog__close {
        color: rgba(173,182,194,1);
      }
    }
    span {
      color: #333333;
      padding-left: 20px;
      font-size: 14px;
    }
  }
  .el-dialog__body{
    padding: 18px 25px;
  }
}
}
</style>