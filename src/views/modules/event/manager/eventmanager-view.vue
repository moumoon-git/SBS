<template>
  <el-dialog
    title="查看事件"
    :close-on-click-modal="false"
    :visible.sync="visible"
    width="800px">

    <div class="eventmanager-view">
      <el-row :gutter="20">
        <!--左边是事件详情表单-->
        <el-col :span="11">
          <div class="word-detail">

            <!--查看事件详情表单-->
            <el-form ref="form" :model="eventDetailForm" label-width="80px">

              <el-form-item label="事件标题">
                <el-input v-model="eventDetailForm.title" :readonly="true"></el-input>
              </el-form-item>

              <el-form-item label="事件类型">
                <el-input v-model="eventDetailForm.eventType" :readonly="true"></el-input>
              </el-form-item>

              <el-form-item label="事件等级">
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

              <el-form-item label="事件描述">
                <el-input type="textarea" :rows="2" v-model="eventDetailForm.eventDescription" :readonly="true"></el-input>
              </el-form-item>

              <el-form-item label="事件状态">
                <el-input v-model="eventDetailForm.status" :readonly="true" :formatter="eventStatusFormatter"></el-input>
              </el-form-item>

              <el-form-item label="是否关闭">
                <el-input v-model="eventDetailForm.eventClose" :readonly="true"></el-input>
              </el-form-item>

            </el-form>
          </div>
        </el-col>

        <!--右边是事件历史记录-->
        <el-col :span="13">
          <div class="word-history-record">
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
                    <h4 v-if="activity.eventStatusAfter == 1">事件状态：待核实</h4>
                    <h4 v-if="activity.eventStatusAfter == 2">事件状态：核实中</h4>
                    <h4 v-if="activity.eventStatusAfter == 3">事件状态：待处理</h4>
                    <h4 v-if="activity.eventStatusAfter == 4">事件状态：处理中</h4>
                    <h4 v-if="activity.eventStatusAfter == 5">事件状态：已处理</h4>
                    <h4 v-if="activity.eventStatusAfter == 5">事件状态：已处理</h4>
                    <h4 v-if="activity.eventStatusAfter == 6">事件状态：超出范围</h4>
                    <h4 v-if="activity.eventStatusAfter == '' || activity.eventStatusAfter == undefined">事件状态：其他</h4>

                    <p v-if="activity.title != null">事件记录：{{activity.title}}</p>
                    <p v-if="activity.mailContactorName != null">操作人员：{{activity.mailContactorName}}</p>
                    <p v-if="activity.mailContactorMobile != null">联系电话：{{activity.mailContactorMobile}}</p>
                    <p v-if="activity.mailGroupName != null">人员单位：{{activity.mailGroupName}}</p>
                    <p v-if="activity.content != null">操作描述：{{activity.content}}</p>

                    <!--单个图片-->
                    <p v-if="activity.images != null" >
                      <img :src="backgroundURL+activity.images" style="width: 140px;height: 140px"/>
                    </p>
                    <!--多个图片-->
                    <p>
                      <img
                        v-if="activity.imageArr != null"
                        v-for="(image,index) in activity.imageArr"
                        :src="backgroundURL+image"
                        :key="index"
                        style="width: 140px;height: 140px"/>
                    </p>


                    <!--单个音频-->
                    <p v-if="activity.audioUrl != null" >
                      <audio type="audio/mp3" :src="backgroundURL+activity.audioUrl" autostart=false loop=false >
                        <source :src="backgroundURL+activity.audioUrl" type="audio/mpeg" />
                      </audio>

                    </p>
                    <!--多个音频-->
                    <p>

                      <audio controls="controls"
                             v-if="activity.audioUrlArr != null"
                             v-for="(audio,index) in activity.audioUrlArr"
                             :key="index">
                        <source :src="backgroundURL+audio" type="audio/mpeg" />
                      </audio>
                    </p>


                    <!--单个视频-->
                    <!--<p  v-if="activity.videoUrl != null">
                      <video :src="backgroundURL+activity.videoUrl" width="320" height="240" controls="controls"></video>
                    </p>-->
                    <!--多个视频-->
                    <!--<p>
                      <video
                        v-if="activity.videoUrlArr != null"
                        v-for="(video,index) in activity.videoUrlArr"
                        :src="backgroundURL+video"
                        :key="index"
                        width="320" height="240" controls="controls">
                      </video>
                    </p>-->

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
        //后台全局url
        backgroundURL: window.SITE_CONFIG.cloudUrl,

        visible: false,

        //表格详情数据（初始化）
        eventDetailForm: {
          id: "",
          statusFlag: "",
          title: "",
          eventType: "",
          eventLevel: "",
          responseName: "",
          reportName: "",
          reportTime: "",
          eventPosition: "",
          eventDescription: "",
          status: "",
          eventClose: ""
        },

        //历史记录时间线
        eventHistoryRecordArray: [],
        //状态变量
        status: ""
      };
    },

    methods: {
      init(row) {
        this.visible = true;

        //查看人员详情
        this.eventDetailForm.id = row.id;
        this.eventDetailForm.title = row.title;
        this.eventDetailForm.eventType = row.eventType;
        this.eventDetailForm.reportName = row.reportName;
        this.eventDetailForm.reportTime = row.reportTime;
        this.eventDetailForm.eventPosition = row.eventPosition;
        this.eventDetailForm.eventDescription = row.eventDescription;

        //this.eventDetailForm.responseName = row.rpPoliceResponseEntity.responseName;

        if (row.status == "1") {
          this.eventDetailForm.status = "待核实";
        } else if (row.status == "2") {
          this.eventDetailForm.status = "核实中";
        } else if (row.status == "3") {
          this.eventDetailForm.status = "待处理";
        }  else if (row.status == "4") {
          this.eventDetailForm.status = "处理中";
        }else if (row.status == "5") {
          this.eventDetailForm.status = "已处理";
        } else {
          this.eventDetailForm.status = "其他";
        }

        if (row.isClose == "1") {
          this.eventDetailForm.eventClose = "否";
        } else if (row.isClose == "0") {
          this.eventDetailForm.eventClose = "是";
        } else {
          this.eventDetailForm.eventClose = "其他";
        }

        //根据事件信息请求历史记录
        this.$http({
          url: this.$http.adornUrl(`/event/eventHistory/selectHistoryByDataSourceId`),
          method: "post",
          params: this.$http.adornParams({
            dataSourceId: row.id,
            flagType: row.flagType,
            platformId: 0
          })

        }).then(({ data }) => {
            if(data.code === 0){
                // console.log("history==",data)
                this.eventHistoryRecordArray = data.list;
              }else{
                this.$message.error(data.msg)
              }
          
        });
      },
      onSubmit() {
        // console.log("submit!");
      },
      //表格格式化
      eventLevelFormatter(obj) {
        let val = obj.eventLevel;
        if (val == "1") {
          return "一般";
        } else if (val == "2") {
          return "严重";
        } else if (val == "3") {
          return "重大";
        } else if (val == "4") {
          return "特大";
        } else {
          return "其他";
        }
      },
      eventStatusFormatter(obj) {
        let val = obj.status;
        if (val == "1") {
          return "待核实";
        } else if (val == "2") {
          return "核实中";
        } else if (val == "3") {
          return "待处理";
        } else if (val == "4") {
          return "处理中";
        } else if (val == "5") {
          return "已处理";
        } else {
          return "其他";
        }
      },
    }
  };
</script>

<style lang="scss">
  .el-row {
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

  .event-history-record {
    height: 600px;
    overflow-y: auto;
  }
  .event-history-record::-webkit-scrollbar {
    width: 10px;
    height: 1px;
  }
  .event-history-record::-webkit-scrollbar-thumb {
    border-radius: 10px;
    background-color: rgba(52, 163, 242, 0.48);
  }
  .event-history-record::-webkit-scrollbar-track {
    -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
    background: #ededed;
  }
</style>
