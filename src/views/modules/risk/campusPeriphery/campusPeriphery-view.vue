<template>
<!-- 这个暂时注释，需要直接将visibleTemp改成visible即可 -->
<div>
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

              <el-form-item label="工单类型">
                <el-input v-model="eventDetailForm.eventTypeName" :readonly="true"></el-input>
              </el-form-item>

              <el-form-item label="上报时间">
                <el-input v-model="eventDetailForm.gmtCreate" :readonly="true"></el-input>
              </el-form-item>

              <el-form-item label="工单描述">
                <el-input
                  type="textarea"
                  :rows="2"
                  v-model="eventDetailForm.eventDescription"
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
                      <viewer :images="eventDetailForm.imageUrl.split(',')" style="display:flex;width:250px;flex-wrap:wrap">
                        <img
                          v-for="(item,index) in eventDetailForm.imageUrl.split(',')"
                          :src="backgroundURL+item"
                          :key="index"
                          style="width: 120px; height: 120px; margin: 0 5px 5px 0"
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


                  <el-row>

                    <el-col  v-if="eventDetailForm.audioUrl != null && eventDetailForm.audioUrl != '' && eventDetailForm.audioUrl.indexOf(',') > -1">
                      <audio
                        style="width: 100%;"
                        controls="controls"
                        v-for="(item,key) in eventDetailForm.audioUrl.split(',')"
                        :key="key"
                      >
                        <source
                          :src="backgroundURL+item"
                          type="audio/mpeg"
                        />
                      </audio>
                    </el-col>

                    <el-col  v-if="eventDetailForm.audioUrl != null && eventDetailForm.audioUrl != '' && eventDetailForm.audioUrl.indexOf(',') == -1">
                      <audio
                        style="width: 100%;"
                        controls="controls"
                      >
                        <source
                          :src="backgroundURL+eventDetailForm.audioUrl"
                          type="audio/mpeg"
                        />
                      </audio>
                    </el-col>
                  </el-row>

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


                    <p
                      v-if="activity.imageUrl != null && activity.imageUrl != '' && activity.imageUrl.indexOf('http')==-1"
                    >
                      <viewer :images="activity.imageUrl.split(',')">
                        <img
                          v-for="(image,index) in activity.imageUrl.split(',')"
                          :src="backgroundURL +'/'+ image"
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


  <!-- 新的查看弹窗 -->
 <el-dialog
    title="查看详情"

    @close="imgDialogVisible=false"
    :visible.sync="visibleTemp"
    width="800px"
 
    class="dialog_css"
  >
   <div class="view">
     <div class="view_title">
       <span class="title_time">上报时间：<span class="title_time_css">{{eventDetailForm.gmtCreate}}</span></span>
       <span class="title_time">事件类型：<span class="title_time_css">{{eventDetailForm.eventTypeName}}</span></span>
       <span class="title_time">地点：<span class="title_time_css">{{eventDetailForm.platformName}}</span></span>
       </div>
       <div class="desc">事件描述：<span class="desc_css">{{eventDetailForm.eventDescription}}</span>
       </div>
       <div class="img">事件图片：
          <viewer><img :src="eventDetailForm.imageUrl" class="img_css" alt="暂无图片"></viewer>
       </div>
   </div>

      </el-dialog>
  </div>

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
        visibleTemp:false,
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
          imagesUrlArr: [],
          platformName:""
        },

        //历史记录时间线
        eventHistoryRecordArray: [],
        //状态变量
        status: ""
      };
    },

    methods: {
      largePhoto(event) {

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
        this.eventDetailForm.eventDescription = row.eventDescription;
        this.eventDetailForm.eventTypeName = row.eventTypeName;
        this.eventDetailForm.audioUrl = row.audioUrl;
        this.eventDetailForm.status = row.status;
        this.eventDetailForm.platformName = row.platformName;
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
                this.backgroundURL+ row.imageUrl
              );
            }
          }
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
          // console.log("selectHistoryByDataSourceId", data);
          this.eventHistoryRecordArray = data.list;
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

.dialog_css{
 /deep/  .el-dialog__header{
       background-color: #f1f6ff;
     }
         /deep/ .el-dialog__body{
      padding:0px;   
     }
   .view{
     height:400px;
     background-color:#fff;
    
 
     .view_title{
       font-size: 14px;
       display: flex;
       justify-content: space-around;
       background-color: #F9FBFF;
       padding:10px ;
       border-bottom:2px solid #f1f6ff;
       .title_time{
          color:#999999;
            .title_time_css{
         color:#333333;
         font-weight: 500;
       }
       }
     }
     .desc{
       font-size:14px;
       padding:20px;
       color:#555555;
       border:1px solid #f4f4f4;
       .desc_css{
         color:#333333;
         font-weight:500;
       }
     }
     .img{
       padding:20px;
       color:#555555;
     .img_css{
       width:140px;
       padding:20px;
       color:#999999;
       font-size:12px;
     }}
   }}
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
