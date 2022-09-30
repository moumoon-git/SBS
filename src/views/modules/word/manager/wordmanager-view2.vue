<template>
<div>
  <el-dialog
    title="查看工单"
    :close-on-click-modal="false"
    @close="imgDialogVisible=false"
    :visible.sync="visible"
    width="800px"
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

              <el-form-item label="标记" v-if="eventDetailForm.eventClose == '1'">
                <el-switch active-text="未关闭" v-model="value6" disabled></el-switch>
              </el-form-item>

              <el-form-item label="标记" v-if="eventDetailForm.eventClose == '0'">
                <el-switch active-text="已关闭" v-model="value7" disabled></el-switch>
              </el-form-item>

              <el-form-item label="状态">
                <el-input
                  v-model="eventDetailForm.status"
                  :readonly="true"
                  :formatter="eventStatusFormatter"
                ></el-input>
              </el-form-item>

              <el-form-item label="区域">
                <el-input v-model="eventDetailForm.areaName" :readonly="true"></el-input>
              </el-form-item>

              <el-form-item label="类型">
                <el-input v-model="eventDetailForm.eventTypeName" :readonly="true"></el-input>
              </el-form-item>

              <!--<el-form-item label="事件等级">
                <el-input v-model="eventDetailForm.responseName" :readonly="true"></el-input>
              </el-form-item>-->

              <!--<el-form-item label="上报人员">
                <el-input v-model="eventDetailForm.reportName" :readonly="true"></el-input>
              </el-form-item>-->
              <el-form-item label="描述">
                <el-input
                  type="textarea"
                  :rows="6"
                  v-model="eventDetailForm.eventDescription"
                  :readonly="true"
                  resize="none"
                ></el-input>
              </el-form-item>

              <el-form-item label="时间">
                <el-input v-model="eventDetailForm.gmtCreate" :readonly="true"></el-input>
              </el-form-item>

              <el-form-item label="地点" v-if="eventDetailForm.eventPosition">
                <el-input v-model="eventDetailForm.eventPosition" :readonly="true"></el-input>
              </el-form-item>

              <!--<el-form-item label="是否关闭">
                <el-input v-model="eventDetailForm.eventClose" :readonly="true"></el-input>
              </el-form-item>-->

              <el-form-item>
                <template>
                  <el-row>
                    <el-col
                      :span="12"
                      class="demo-image__preview"
                      v-for="(url, index) in eventDetailForm.imagesUrlArr"
                      :key="index"
                    >
                      <viewer :images="[url]">
                        <img
                          v-for="(item,index) in [url]"
                          :src="item.indexOf('http')>-1?item:backgroundURL+item"
                          :key="index"
                          width="120"
                          height="120"
                        />
                      </viewer>
                    </el-col>
                  </el-row>

                  <el-row>
                    <el-col v-for="(item,index) in eventDetailForm.audioUrlArr" :key="index">
                      <audio
                        style="width: 100%;"
                        controls="controls"
                      >
                        <source
                          :src="item"
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
                    <p
                      v-if="activity.eventStatusAfter == 1  && activity.townName != null && activity.platformName != null"
                    >工单区域：{{activity.townName}}{{activity.platformName}}</p>
                    <p v-if="activity.title != null && activity.title != ''">工单记录：{{activity.title}}</p>
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
                    <p
                      v-if="activity.imageUrl != null && activity.imageUrl != '' && activity.imageUrl.indexOf('http')>-1"
                    >
                      <viewer :images="[activity.imageUrl]">
                        <img
                          v-for="(item,index) in [activity.imageUrl]"
                          :src="item"
                          :key="index"
                          width="140"
                          height="140"
                        />
                      </viewer>
                    </p>

                    <p
                      v-if="activity.imageUrl != null && activity.imageUrl != '' && activity.imageUrl.indexOf('http')==-1"
                    >
                      <viewer :images="[activity.imageUrl]">
                        <img
                          :src="backgroundURL+activity.imageUrl"
                          style="width: 140px;height: 140px;"
                          @click="largePhoto($event)"
                        />
                        </viewer>
                    </p>
                    <!--多个图片-->
                    <p v-if="activity.imageArr != null && activity.imageArr != ''">
                      <viewer :images="activity.imageArr">
                        <img
                          v-for="(item,index) in activity.imageArr"
                          :src="backgroundURL+item"
                          :key="index"
                          width="140"
                          height="140"
                        />
                      </viewer>
                    </p>

                    <!--单个音频-->
                    <p v-if="activity.audioUrl != null && activity.audioUrl != ''">
                      <audio controls="controls">
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
    <!-- <el-dialog
      title="查看图片"
      :visible.sync="imgDialogVisible"
      style="text-align:center;margin-top:100px;"
      width="400px"
      :modal="false"
    >
      <img :src="imgSrc" style="width: 300px;height: 300px;" />
    </el-dialog> -->
  </el-dialog>
  <!-- 新的查看弹窗 -->
 <el-dialog
    title="查看详情"
  
    @close="imgDialogVisible=false"
    :visible.sync="dvisible"
    width="800px"
 
    class="dialog_css"
  >
   <div class="view">
     <div class="view_title">
       <span class="title_time">上报时间：<span class="title_time_css">{{eventDetailForm.gmtCreate}}</span></span>
       <span class="title_time">事件类型：<span class="title_time_css">{{eventDetailForm.eventTypeName}}</span></span>
       <span class="title_time">地点：<span class="title_time_css">{{eventDetailForm.platName}}</span></span>
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
  data () {
    return {
      dvisible:false,
      // 后台接口全局url
      backgroundURL: window.SITE_CONFIG.cloudUrl,
      imgDialogVisible: false,
      imgSrc: '',
      visible: false,

      // 切换标志
      value6: true,
      value7: false,

      // 表格详情数据（初始化）
      eventDetailForm: {
        id: '',
        statusFlag: '',
        title: '',
        eventType: '',
        eventLevel: '',
        eventTypeName: '',
        responseName: '',
        reportName: '',
        gmtCreate: '',
        eventPosition: '',
        eventDescription: '',
        status: '',
        eventClose: '',
        imageUrl: '',
        imagesUrlArr: [],
        audioUrl: '',
        audioUrlArr: [],
        areaName: '',
        platName:''
      },

      // 历史记录时间线
      eventHistoryRecordArray: [],
      // 状态变量
      status: ''
    }
  },

  methods: {
    largePhoto (event) {
      // if(event.target.style.width=="140px"){

      //   event.target.style="position:absolute;width:300px;height:300px;"
      //   console.log(1)
      // } else {
      //   event.target.style="position:absolute;width:140px;height:140px;"
      // }
      this.imgDialogVisible = true
      this.imgSrc = event.target.src
      // console.log("eventevent", event.target.src);
    },
    init (row) {
       console.log("info", row);
      this.visible = true

      // 查看人员详情
      this.eventDetailForm.id = row.id
      this.eventDetailForm.title = row.title
      this.eventDetailForm.eventType = row.eventType
      this.eventDetailForm.reportName = row.reportName
      this.eventDetailForm.gmtCreate = row.gmtCreate.substr(0, 10)
      this.eventDetailForm.eventPosition = row.eventPosition
      this.eventDetailForm.eventDescription = row.eventDescription
      this.eventDetailForm.eventTypeName = row.eventTypeName
      this.eventDetailForm.eventClose = row.isClose
      this.eventDetailForm.platName = row.platformName

      // 拼凑
      this.eventDetailForm.areaName =
        (row.townName == null ? '' : row.townName) + row.platformName

      // 图片，可能是空、可能是一张、可能是多张
      this.eventDetailForm.imageUrl = row.imageUrl
      this.eventDetailForm.imagesUrlArr = []

      // 判断是否是多张
      if (row.imageUrl != null && row.imageUrl != '') {
        // 多张图片
        if (row.imageUrl.indexOf(',') > -1 && row.imageUrl.indexOf('http') > -1) {
          // 多张人车预警数据
          let urlList = row.imageUrl.split(',')
          for (var i = 0; i < urlList.length; i++) {
            this.eventDetailForm.imagesUrlArr.push(urlList[i])
          }
        } else if (row.imageUrl.indexOf(',') > -1 && row.imageUrl.indexOf('http') === -1) {
          // 多张小区学校数据
          let urlList = row.imageUrl.split(',')
          for (var i = 0; i < urlList.length; i++) {
            this.eventDetailForm.imagesUrlArr.push(
              this.backgroundURL + urlList[i]
            )
          }
        } else if (row.imageUrl.indexOf(',') === -1 && row.imageUrl.indexOf('http') > -1) {
          // 一张人车预警
          this.eventDetailForm.imagesUrlArr.push(row.imageUrl)
        } else if (row.imageUrl.indexOf(',') === -1 && row.imageUrl.indexOf('http') === -1) {
          // 多张人车预警
          this.eventDetailForm.imagesUrlArr.push(this.backgroundURL + row.imageUrl)
        }
      }

      // 音频
      this.eventDetailForm.audioUrl = row.audioUrl
      this.eventDetailForm.audioUrlArr = []

      // 判断是否是多个音频
      if (row.audioUrl != null && row.audioUrl != '') {
        if (row.audioUrl.indexOf(',') > -1) {
          // 多个
          let urlList = row.audioUrl.split(',')
          for (var i = 0; i < urlList.length; i++) {
            this.eventDetailForm.audioUrlArr.push(this.backgroundURL + urlList[i])
          }
        } else {
          // 单个
          this.eventDetailForm.audioUrlArr.push(this.backgroundURL + row.audioUrl)
        }
      }

      if (row.status == '1') {
        this.eventDetailForm.status = '待核实'
      } else if (row.status == '2') {
        this.eventDetailForm.status = '核实中'
      } else if (row.status == '3') {
        this.eventDetailForm.status = '待处理'
      } else if (row.status == '4') {
        this.eventDetailForm.status = '处理中'
      } else if (row.status == '5') {
        this.eventDetailForm.status = '已处理'
      } else if (row.status == '6') {
        this.eventDetailForm.status = '超出范围'
      } else if (row.status == '7') {
        this.eventDetailForm.status = '已关闭'
      } else {
        this.eventDetailForm.status = '其他'
      }

      // if (row.isClose == "1") {
      //   this.eventDetailForm.eventClose = "否";
      // } else if (row.isClose == "0") {
      //   this.eventDetailForm.eventClose = "是";
      // } else {
      //   this.eventDetailForm.eventClose = "其他";
      // }

      // 根据事件信息请求历史记录
      this.$http({
        url: this.$http.adornUrl(
          `/event/eventHistory/selectHistoryByDataSourceId`
        ),
        method: 'post',
        params: this.$http.adornParams({
          dataSourceId: row.id,
          flagType: row.flagType,
          platformId: 0
        })
      }).then(({ data }) => {
        if (data && data.code === 0) {
            // console.log("selectHistoryByDataSourceId", data);
          this.eventHistoryRecordArray = data.list
        } else {
          this.$message.error(data.msg)
        }
      })
    },
    onSubmit () {
      // console.log("submit!");
    },
    // 表格格式化
    eventLevelFormatter (obj) {
      let val = obj.eventLevel
      if (val == '1') {
        return '一般'
      } else if (val == '2') {
        return '严重'
      } else if (val == '3') {
        return '重大'
      } else if (val == '4') {
        return '特大'
      } else {
        return '其他'
      }
    },
    eventStatusFormatter (obj) {
      let val = obj.status
      if (val == '1') {
        return '待核实'
      } else if (val == '2') {
        return '核实中'
      } else if (val == '3') {
        return '待处理'
      } else if (val == '4') {
        return '处理中'
      } else if (val == '5') {
        return '已处理'
      } else if (val == '6') {
        return '超出范围'
      } else if (val == '7') {
        return '已关闭'
      } else {
        return '其他'
      }
    }
  }
}
</script>

<style lang="scss">
.dialog_css{
  font-size: 14px;
    /deep/ .el-dialog {
      border-radius: 5px;
      box-shadow: 0px 0px 23px 3px rgba(201, 201, 201, 0.27);
    }
    //弹窗表头样式
    /deep/ .el-dialog__header {
      height: 40px;
      line-height: 40px;
      background-color: #f1f4f6;
      border-radius: 5px 5px 0px 0px;
      padding: 0px;
      /deep/ .el-dialog__title {
        font-size: 14px;
        padding-left: 20px;
      }
      /deep/.el-dialog__headerbtn {
        top: 0px;
      }
    }
    /deep/ .el-dialog__body {
      padding: 0px;
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
