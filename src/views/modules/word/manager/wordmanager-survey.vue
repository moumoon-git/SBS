<template>
  <el-dialog
    :close-on-click-modal="false"
    title="调查反馈"
    :visible.sync="visible"
    width="800px">

    <div class="wordmanager-view">
      <el-row :gutter="20">
        <!--左边是事件详情表单-->
        <el-col :span="11">
          <div class="event-detail">

            <!--查看事件详情表单-->
            <el-form ref="form" :model="eventDetailForm" label-width="80px">

              <el-form-item label="工单标题">
                <el-input v-model="eventDetailForm.title" :readonly="true"></el-input>
              </el-form-item>

              <el-form-item label="工单类型">
                <el-input v-model="eventDetailForm.eventType" :readonly="true"></el-input>
              </el-form-item>

              <el-form-item label="响应等级">
                <el-input v-model="eventDetailForm.responseName" :readonly="true"></el-input>
              </el-form-item>

              <el-form-item label="上报人员">
                <el-input v-model="eventDetailForm.reportName" :readonly="true"></el-input>
              </el-form-item>

              <el-form-item label="上报时间">
                <el-input v-model="eventDetailForm.reportTime" :readonly="true"></el-input>
              </el-form-item>

              <el-form-item label="事发地点">
                <el-input v-model="eventDetailForm.eventPosition" :readonly="true"></el-input>
              </el-form-item>

              <el-form-item label="工单描述">
                <el-input v-model="eventDetailForm.eventDescription" :readonly="true"></el-input>
              </el-form-item>

              <el-form-item label="工单状态">
                <el-input v-model="eventDetailForm.status" :readonly="true" ></el-input>
              </el-form-item>

              <el-form-item label="是否关闭">
                <el-input v-model="eventDetailForm.eventClose" :readonly="true"></el-input>
              </el-form-item>

            </el-form>
          </div>
        </el-col>

        <!--右边是事件历史记录-->
        <el-col :span="13">
          <div class="event-history-record">
            <!--历史记录时间线-->
            <div class="block">
              <el-timeline>
                <el-timeline-item
                  v-for="(activity, index) in eventHistoryRecordArray"
                  :key="index"
                  :color="activity.color"
                  :timestamp="activity.gmtCreate"
                  placement="top">
                  <el-card>
                    <h4 v-if="activity.status == 1">评价：非常不满意</h4>
                    <h4 v-if="activity.status == 2">评价：不满意</h4>
                    <h4 v-if="activity.status == 3">评价：一般</h4>
                    <h4 v-if="activity.status == 4">评价：满意</h4>
                    <h4 v-if="activity.status == 5">评价：非常满意</h4>
                    <h4 v-if="activity.status == null">评价：其他</h4>

                    <p v-if="activity.reportName != null">操作人员：{{activity.reportName}}</p>
                    <p v-if="activity.reportUnit != null">人员单位：{{activity.reportUnit}}</p>
                    <p v-if="activity.advice != null">反馈建议：{{activity.advice}}</p>

                  </el-card>
                </el-timeline-item>
              </el-timeline>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
  </el-dialog>

</template>

<script>

  export default {
    data() {
      return {
        visible: false,

        //表格详情数据（初始化）
        eventDetailForm: {
          id : '',
          title: '',
          eventType: '',
          eventLevel: '',
          responseName: '',
          reportName: '',
          reportTime: '',
          eventPosition: '',
          eventDescription: '',
          status: '',
          eventClose: ''
        },

        //历史记录时间线
        eventHistoryRecordArray: [],
        /*{
          color: '#4896DF',
          status: '【俞思远】上报',
          mailContactorEntity: '',
          contactorTel: '',
          content: '',
          image: 'http://n.sinaimg.cn/sd/crawl/698/w400h298/20181119/Nm-h-hnyuqhi0367472.jpg',
          gmtCreate: '2018-04-12 20:46',
          size: 'large',
          type: 'primary',
          icon: 'el-icon-more'
        }*/

      }
    },
    methods: {
      init(row){

        //console.log(row)
        this.visible = true

        //查看人员详情
        this.eventDetailForm.id = row.id;
        this.eventDetailForm.status = row.status;
        this.eventDetailForm.title = row.title;
        this.eventDetailForm.eventType = row.eventType;
        this.eventDetailForm.reportName = row.reportName;
        this.eventDetailForm.reportTime = row.reportTime;
        this.eventDetailForm.eventPosition = row.eventPosition;
        this.eventDetailForm.eventDescription = row.eventDescription;
        //this.eventDetailForm.responseName = row.rpPoliceResponseEntity.responseName;


        if(row.isClose == '1'){
          this.eventDetailForm.eventClose = "否"
        }else if(row.isClose == '0'){
          this.eventDetailForm.eventClose = "是"
        }else{
          this.eventDetailForm.eventClose = "其他"
        }

        //根据事件信息请求历史记录
        this.$http({
          url: this.$http.adornUrl(`/event/eventSurvey/selectSurveyListByEventInfoId/${row.id}`),
          method: 'get',
        }).then(({data}) => {
          // 说明有共享数据
          if (data.code === 0) {
            // console.log(data);
            this.eventHistoryRecordArray = data.list;
          } else {
            this.$message.error(data.msg);
          }
        })


      },

      onSubmit() {
        // console.log('submit!');
      },

      //表格格式化
      eventLevelFormatter(obj){
        let val = obj.eventLevel;
        if(val == '1'){
          return "一般"
        }else if(val == '2'){
          return "严重"
        }else if(val == '3'){
          return "重大"
        }else if(val == '4'){
          return "特大"
        }else{
          return "其他"
        }
      },

      eventStatusFormatter(obj){
        let val = obj.status;
        if(val == '1'){
          return "待核实"
        }else if(val == '2'){
          return "核实中"
        }else if(val == '3'){
          return "待处理"
        }else if(val == '4'){
          return "处理中"
        }else if(val == '5'){
          return "已处理"
        }else{
          return "其他"
        }
      },
    }
  }

</script>

<style lang="scss">

  /*.el-row {
    margin-bottom: 20px;
    &:last-child {
      margin-bottom: 0;
    }
  }
  .el-col {
    border-radius: 4px;
  }
  .bg-purple-dark {
    background: #99a9bf;
  }
  .bg-purple {
    background: #d3dce6;
  }
  .bg-purple-light {
    background: #e5e9f2;
  }
  .grid-content {
    border-radius: 4px;
    min-height: 36px;
  }
  .row-bg {
    padding: 10px 0;
    background-color: #f9fafc;
  }

  .event-history-record{
    height: 600px;
    overflow-y: auto;
  }
  .event-history-record::-webkit-scrollbar {
    width: 10px;
    height: 1px;
  }
  .event-history-record::-webkit-scrollbar-thumb {
    border-radius: 10px;
    background-color: rgba(14, 174, 160, 0.48);

  }
  .event-history-record::-webkit-scrollbar-track {
    -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
    background: #EDEDED;
  }*/
</style>
