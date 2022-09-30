<template>
  <el-dialog
    title="查看工单"
    :close-on-click-modal="false"
    @close="imgDialogVisible=false"
    :visible.sync="visible"
    width="800px"
    :modal="false"
  >
    <div class="wordmanager-view">
      <el-row :gutter="20">
        <!--左边是事件详情表单-->
        <el-col :span="11">
          <div class="word-detail">
            <!--查看事件详情表单-->
            <el-form ref="form" :model="eventDetailForm" label-width="80px">
              <!-- <el-form-item label="事件标题">
              <el-input v-model="eventDetailForm.title" :readonly="true"></el-input>
              </el-form-item>-->

              <el-form-item label="工单类型">
                <el-input v-model="eventDetailForm.eventTypeName" :readonly="true"></el-input>
              </el-form-item>

              <!--<el-form-item label="事件等级">
                <el-input v-model="eventDetailForm.responseName" :readonly="true"></el-input>
              </el-form-item>-->

              <!--<el-form-item label="上报人员">
                <el-input v-model="eventDetailForm.reportName" :readonly="true"></el-input>
              </el-form-item>-->

              <el-form-item label="上报时间">
                <el-input v-model="eventDetailForm.gmtCreate" :readonly="true"></el-input>
              </el-form-item>

              <el-form-item label="工单地点">
                <!-- <el-input v-model="eventDetailForm.eventPosition" :readonly="true"></el-input> -->
              </el-form-item>

              <el-form-item label="工单描述">
                <el-input
                  type="textarea"
                  :rows="2"
                  :readonly="true"
                ></el-input>
              </el-form-item>

              <el-form-item label="工单状态">
                <el-input
                  v-model="eventDetailForm.status"
                  :readonly="true"
                  :formatter="eventStatusFormatter"
                ></el-input>
              </el-form-item>

              <el-form-item label="是否关闭">
                <el-input v-model="eventDetailForm.eventClose" :readonly="true"></el-input>
              </el-form-item>

              <el-form-item>
                <template>
                  <el-row>
                    <el-col
                      :span="12"
                      class="demo-image__preview"
                      v-if="eventDetailForm.imageUrl != null && eventDetailForm.imageUrl != '' && eventDetailForm.imageUrl.indexOf('http') == -1"
                    >
                      <viewer :images="eventDetailForm.imageUrl.split(',')" style="display:flex">
                        <img
                          v-for="(item,index) in eventDetailForm.imageUrl.split(',')"
                          :src="backgroundURL+item"
                          :key="index"
                          style="width: 120px; height: 120px"
                        />
                      </viewer>
                    </el-col>

                    <el-col
                      :span="12"
                      class="demo-image__preview"
                      v-if="eventDetailForm.imageUrl != null && eventDetailForm.imageUrl != '' && eventDetailForm.imageUrl.indexOf('http') != -1"
                    >
                      <viewer :images="[eventDetailForm.imageUrl]">
                        <img
                          v-for="(item,index) in [eventDetailForm.imageUrl]"
                          :src="item"
                          :key="index"
                          style="width: 120px; height: 120px"
                        />
                      </viewer>
                    </el-col>
                  </el-row>

                  <!-- <el-row v-if="eventDetailForm.imagesUrlArr != null && eventDetailForm.imagesUrlArr != ''">
                    <el-col :span="12" class="demo-image__preview"  v-for="(url, index) in eventDetailForm.imagesUrlArr" :key="index">
                      <img
                        style="width: 120px; height: 120px" @click="largePhoto($event)"
                        :src="eventDetailForm.imgUrl" >
                    </el-col>
                  </el-row>-->

                  <el-row>
                    <el-col>
                      <audio
                        style="width: 100%;"
                        controls="controls"
                        v-if="eventDetailForm.audioUrl != null && eventDetailForm.audioUrl != ''"
                      >
                        <source
                          :src="backgroundURL+eventDetailForm.audioUrl"
                          type="audio/mpeg"
                        />
                      </audio>
                    </el-col>
                  </el-row>

                  <!--<img
                      style="width: 100px; height: 100px"
                  :src="'http://chrchr.natapp1.cc/wx/images/'+url" >-->
                  <!--<div class="demo-image__preview"  v-for="url in eventDetailForm.imagesUrlArr">
                      <el-image
                        width="100px"
                        height="100px"
                        :src="url"
                        :preview-src-list="eventDetailForm.imagesUrlArr">
                      </el-image>
                  </div>-->
                </template>
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
                  placement="top"
                >
                  <el-card>
                    <h4 v-if="activity.eventStatusAfter == 1">工单状态：待核实</h4>
                    <h4 v-if="activity.eventStatusAfter == 2">工单状态：核实中</h4>
                    <h4 v-if="activity.eventStatusAfter == 3">工单状态：待处理</h4>
                    <h4 v-if="activity.eventStatusAfter == 4">工单状态：处理中</h4>
                    <h4 v-if="activity.eventStatusAfter == 5">工单状态：已处理</h4>
                    <h4 v-if="activity.eventStatusAfter == 6">工单状态：超出范围</h4>
                    <h4
                      v-if="activity.eventStatusAfter == '' || activity.eventStatusAfter == undefined"
                    >事件状态：其他</h4>

                    <p v-if="activity.title != null && activity.title != ''">事件记录：{{activity.title}}</p>
                    <p
                      v-if="activity.mailContactorName != null && activity.mailContactorName != ''"
                    >操作人员：{{activity.mailContactorName}}</p>
                    <p
                      v-if="activity.mailContactorMobile != null && activity.mailContactorMobile != ''"
                    >联系电话：{{activity.mailContactorMobile}}</p>
                    <p
                      v-if="activity.mailGroupName != null  && activity.mailGroupName !=''"
                    >人员单位：{{activity.mailGroupName}}</p>
                    <p
                      v-if="activity.content != null  && activity.content !=''"
                    >操作描述：{{activity.content}}</p>

                    <!--单个图片indexOf("http")>-1-->
                    <!-- <p v-if="activity.imageUrl != null && activity.imageUrl != '' && activity.imageUrl.indexOf('http')>-1" >
                       <viewer :images="activity.imageUrl.split(',')">
                        <img
                          v-for="(image,index) in activity.imageUrl.split(',')"
                          :src="image"
                          :key="index"
                          style="width: 140px;height: 140px;"
                        />
                      </viewer>
                    </p> -->

                    <p
                      v-if="activity.imageUrl != null && activity.imageUrl != '' && activity.imageUrl.indexOf('http')==-1"
                    >
                      <viewer :images="activity.imageUrl.split(',')">
                        <img
                          v-for="(image,index) in activity.imageUrl.split(',')"
                          :src="backgroundURL + image"
                          :key="index"
                          style="width: 140px;height: 140px;"
                        />
                      </viewer>
                    </p>
                    <!--多个图片-->
                    <p v-if="activity.imageArr != null && activity.imageArr != ''">
                      <viewer :images="activity.imageArr">
                        <img
                          v-for="(image,index) in activity.imageArr"
                          :src="backgroundURL + image"
                          :key="index"
                          style="width: 140px;height: 140px;"
                        />
                      </viewer>
                    </p>

                    <!--单个音频-->
                    <p v-if="activity.audioUrl != null && activity.audioUrl != ''">
                      <audio controls="controls" >
                        <source
                          :src="backgroundURL+activity.audioUrl"
                          type="audio/mpeg"
                        />
                      </audio>
                    </p>
                    <!--多个音频-->
                    <p>
                      <audio
                        controls="controls"
                        v-if="activity.audioUrlArr != null && activity.audioUrlArr != ''"
                        v-for="(audio,index) in activity.audioUrlArr"
                        :key="index"
                      >
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
    <el-dialog
      title="查看图片"
      :visible.sync="imgDialogVisible"
      style="text-align:center;margin-top:100px;"
      width="400px"
      :modal="false"
    >
      <img :src="imgSrc" style="width: 300px;height: 300px;" />
    </el-dialog>
  </el-dialog>
</template>

<script>
export default {
  data() {
    return {
      //后台接口全局url
      backgroundURL: window.SITE_CONFIG.cloudUrl,
      imgDialogVisible: false,
      imgSrc: "",
      visible: false,

      //表格详情数据（初始化）
      eventDetailForm: {
        id: "",
        statusFlag: "",
        title: "",
        eventType: "",
        eventLevel: "",
        eventTypeName: "",
        responseName: "",
        reportName: "",
        gmtCreate: "",
        eventPosition: "",
        eventDescription: "",
        status: "",
        eventClose: "",
        imageUrl: "",
        audioUrl: "",
        imagesUrlArr: []
      },

      //历史记录时间线
      eventHistoryRecordArray: [],
      //状态变量
      status: ""
    };
  },

  methods: {
    largePhoto(event) {
      // if(event.target.style.width=="140px"){

      //   event.target.style="position:absolute;width:300px;height:300px;"
      //   console.log(1)
      // } else {
      //   event.target.style="position:absolute;width:140px;height:140px;"
      // }
      this.imgDialogVisible = true;
      this.imgSrc = event.target.src;
      // console.log("eventevent", event.target.src);
    },
    init(row) {
      // console.log("info", row);
      this.visible = true;

      //查看人员详情
      this.eventDetailForm.id = row.id;
      this.eventDetailForm.title = row.title;
      this.eventDetailForm.eventType = row.eventType;
      this.eventDetailForm.reportName = row.reportName;
      this.eventDetailForm.gmtCreate = row.gmtCreate
      this.eventDetailForm.eventPosition = row.eventPosition;
      // this.eventDetailForm.eventDescription = row.eventDescription;
      this.eventDetailForm.eventTypeName = row.eventTypeName;
      this.eventDetailForm.audioUrl = row.audioUrl;
      this.eventDetailForm.status = row.status;

      this.eventDetailForm.imageUrl = row.imageUrl;
      // console.log(
      //   "this.eventDetailForm.imageUrl",
      //   this.eventDetailForm.imagesUrlArr
      // );
      if (row.imageUrl != null && row.imageUrl != "") {
        this.eventDetailForm.imagesUrlArr = [];
        // console.log("image", row.imageUrl);
        if (row.imageUrl.indexOf(",") > -1) {
          let urlList = row.imageUrl.split(",");
          for (var i = 0; i < urlList.length; i++) {
            this.eventDetailForm.imagesUrlArr.push(
              this.backgroundURL + urlList[i]
            );
          }
        } else {
          this.eventDetailForm.imagesUrlArr = [];
          if (row.imageUrl.indexOf("http") > -1) {
            this.eventDetailForm.imagesUrlArr.push(row.imageUrl);
          } else {
            this.eventDetailForm.imagesUrlArr.push(
              this.backgroundURL + row.imageUrl
            );
          }
        }
      }

      //this.eventDetailForm.responseName = row.rpPoliceResponseEntity.responseName;

      // if (row.status == "1") {
      //   this.eventDetailForm.status = "待核实";
      // } else if (row.status == "2") {
      //   this.eventDetailForm.status = "核实中";
      // } else if (row.status == "3") {
      //   this.eventDetailForm.status = "待处理";
      // }  else if (row.status == "4") {
      //   this.eventDetailForm.status = "处理中";
      // }else if (row.status == "5") {
      //   this.eventDetailForm.status = "已处理";
      // } else if(row.status == "6"){
      //   this.eventDetailForm.status = "超出范围";
      // }else {
      //   this.eventDetailForm.status = "其他";
      // }

      if (row.isClose == "1") {
        this.eventDetailForm.eventClose = "否";
      } else if (row.isClose == "0") {
        this.eventDetailForm.eventClose = "是";
      } else {
        this.eventDetailForm.eventClose = "其他";
      }

      //根据事件信息请求历史记录
      this.$http({
        url: this.$http.adornUrl(
          `/event/eventHistory/selectHistoryByDataSourceId`
        ),
        method: "post",
        params: this.$http.adornParams({
          dataSourceId: row.id,
          flagType: row.flagType,
          platformId: 0
        })
      }).then(({ data }) => {
        if (data.code === 0) {
          // console.log("selectHistoryByDataSourceId", data);
          this.eventHistoryRecordArray = data.list;
        } else {
          this.$message.error(data.msg);
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
    }
  }
};
</script>

<style lang="scss">
// .el-row {
//   margin-bottom: 20px;
//   &:last-child {
//     margin-bottom: 0;
//   }
// }
// .el-col {
//   border-radius: 4px;
// }
// .bg-purple-dark {
//   background: #99a9bf;
// }
// .bg-purple {
//   background: #d3dce6;
// }
// .bg-purple-light {
//   background: #e5e9f2;
// }
// .grid-content {
//   border-radius: 4px;
//   min-height: 36px;
// }
// .row-bg {
//   padding: 10px 0;
//   background-color: #f9fafc;
// }

.word-history-record {
  height: 600px;
  overflow-y: auto;
}
.word-history-record::-webkit-scrollbar {
  width: 10px;
  height: 1px;
}
.word-history-record::-webkit-scrollbar-thumb {
  border-radius: 10px;
  background-color: rgba(52, 163, 242, 0.48);
}
.word-history-record::-webkit-scrollbar-track {
  -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
  background: #ededed;
}
</style>
