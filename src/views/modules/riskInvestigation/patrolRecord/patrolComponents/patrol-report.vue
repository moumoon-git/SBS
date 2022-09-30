<template>
  <div class="patrolReport">
    <el-dialog :visible.sync="showPatrolReport" custom-class="patrolReport__board" title="巡查记录" width="1303px">
      <!-- <div slot="title" class="patrolReport__dialogHeader">巡查记录</div> -->

      <div class="patrolReport__info">
          <div>
            <span>巡查时间：</span>
            <span style="font-weight:bold">{{gmtModified}}</span>
          </div>
          <div>
            <span>巡查人：</span>
            <span style="color:#0091FF">{{ContactorString}}</span>
          </div>
          <div>
            <span>巡查结果：</span>
            <span>
              <img
                :src="require('@/assets/img/result-complete.svg')"
                style="display:inline;font-size:20px;width:22px;height:22px;margin: 0 5px;"
              />
              {{`正常：${usual}`}}
            </span>
            <span>
              <img
                :src="require('@/assets/img/result-warning.svg')"
                style="display:inline;font-size:20px;width:22px;height:22px;margin: 0 5px 0 30px;"
              />
              {{`异常：${unusual}`}}
            </span>
          </div>
        
      </div>

      <div class="patrolReport__introduction">
        <div class="left-content">
          <!-- <div style="margin-top:27px">巡查区域：{{placeArea}}</div> -->
          <div class="item">
            <span class="item-label">巡查区域：</span>
            {{placeArea}}
          </div>
          <!-- <div style="margin-top:28px">任务名称：{{taskName}}</div> -->
          <div class="item">
            <span class="item-label">任务名称：</span>
            {{taskName}}
          </div>
          <!-- <div style="margin-top:28px">
            <span>巡查说明：</span>
            <span style v-html="remark"></span>
          </div> -->
          <div class="item">
            <span class="item-label">巡查说明：</span>
            <div class="remark">{{remark}}</div>
          </div>
        </div>
        <div class="right-content">
          <div class="item" style="width: 100px;">
            <span class="item-label">巡查部门：</span>
            {{patrolDepString}}
          </div>
          <div class="item" style="width: 100px;">
            <span class="item-label">处置部门：</span>
            {{handleDepString}}
          </div>
          <div class="item">
            <span class="item-label">巡查地点：</span>
            <img
              src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAAmCAYAAACsyDmTAAAD2ElEQVRYR82YTWhcVRTH/+dOEjsNooZKaiA6956gKZFpFoJB8WPauHBXF4qo0I07BQvW7mqr3fkBFnTnQkQp2IXdCZbWWhENBKmRYCaZe18yLmpA/EDSaJyZI1fegG3mvXdn3ixylvPO+Z/fO/eec+8bwg4z2mE8yA0kIrS+vr7bv9jo6Og1IpI8L9kTkHPuIQBPisjDAO4BsCuG+AtAlYguAzhrjPmqW7iugDyIiLwJ4P7ARHNE9Eo3YEFAIjIYRdF7AJ73SxQI859bvITva61fIKJ/smIzxRcWFm4bHh4+B8AvTx67vLGxcahcLv+WJpIKJCKFKIo+E5HH8pC0Y4novNb6cSJqJumlAtVqtbeI6OV+wLQ1ROTtiYmJo10Dra6u7ms2mwsABvoJBKBRKBTKpVLpx066iRWy1n4K4FAAzC8Avo39ZgDsCYg5x8xPBAM55+4C4EREpYi3iOjE5ubmG1NTU1veb3FxcahYLB4TkdcAJMYSUQuAMcas3ajfsULW2pcAvJPxpieZ2SfeZtbaEwBOZsQfYebToUCf+EmcuPGI/iCivVprP5m3WRRFu0TkZxG5JQXqLDM/FQTknLsiIvtTxC4y88G0ClhrLwA4kOLzPTNPBwFZa+sAxlMq9KUx5tE0IOfcJRF5JMXnJ2a+MxSoCuDuFKCNra2tOyYnJ//s5LO0tHTz0NDQVREZTgFaZmZ/MF9nSZv6IoBKxqY8zcxHEja1bwjfGGnWcdk7AjnnXheR4xmC/uB8l4iOa61/975RFN0qIqdE5MWA2FPGmFeDKrSysjKjlPomSzR+/jcR+YkOESkDuCkkTik1o7WeCwLyTtbaKwDSOi0kb5JPxw7zzolHRxRFh1ut1gd5sqY0xWFjzIednicC+auHn0cA7u0z1GK9Xp+uVCqNroDiZZsFcL7PQLPM7IdmR8u8MVprPwLwbD+giOhjY8xzaVqZQL6VW62W76LEyR0IW1dK7W+PiJ4r5ANrtVqFiD7PcVlrKqVmtdaXsuAzK9QWcM4djT+BsjS3PSeiY8YY//mUacFA8SY/A+DpTNXrHc4w8zOhMV0Bzc/P7x4ZGbkgIv6qmmlENDc4OFgZHx/fzHSOHboC8jHVanXPwMDA12m3gVh7uVgsPjg2Nubv3MHWNZBXXl5eNoVCwUPtTch0VSn1gNZ6NZik1wq1E6ytrU01Go0vANx+Q1JfkQPM/EO3MN6/pwq1E0VRNC0ifk+NxL/9qpQ6qLX2R05Plgso7rz7/PHi/1Tws6ZUKn3XE0neJft/Uv8dJyLCzP4unstyVyhX9g7BOw7oXxZ8UTbyUkY+AAAAAElFTkSuQmCC"
              style="width:25px;position:relative;bottom:2px;"
            />
            {{place}}
          </div>
          <div class="item">
            <span class="item-label">巡查周期：</span>
            {{periodName}}
          </div>
        </div>
        <div class="right-content">
          <div class="item" style="float:right">
            <span class="item-label" style="left: -100px;">巡查负责人：</span>
            <span style="color:#0091FF">{{patrolContactorString}}</span>
          </div>
          <div class="item" style="float:right">
            <span class="item-label" style="left: -100px;">处置负责人：</span>
            <span style="color:#0091FF">{{handleContactorString}}</span>
          </div>
          <!-- <div style="margin-top:10px">
            <span>巡查部门：{{patrolDepString}}</span>
            <span style="margin-left:100px">
              巡查负责人：
              <span style="color:#0091FF">{{patrolContactorString}}</span>
            </span>
          </div>
          <div style="margin-top:10px">
            <span>处置部门：{{handleDepString}}</span>
            <span style="margin-left:100px">处置负责人：</span>
            <span style="color:#0091FF">{{handleContactorString}}</span>
          </div>
          <div style="margin-top:10px">
            <span>
              巡查地点：
              <img
                :src="require('@/assets/img/weizhi.svg')"
                style="width:20px; filter: brightness(50%);  opacity: 0.4;  "
              />
              {{place}}
            </span>
          </div>

          <div style="margin-top:10px">巡查周期：{{periodName}}</div> -->
        </div>
      </div>

      <div class="patrolReport__card">
        <div class="card-left">
          <div class="card-header">检查项目</div>
          <div class="check-item-scroll">
            <div
              class="check-item-container"
              :class="itemSelected == index ? 'check-item-selected':''"
              v-for="(item, index) in investigationInforEntities"
              :key="item.id"
              @click="getInfo(index);selectItem(index)"
            >
              <div
                class="check-item"
              >{{item.name }}</div>
              <span
                :class="statusArr[index] == '正常'?'item-normal':'item-unnormal'"
              >{{item.status}}</span>
            </div>
          </div>
        </div>
        <div class="card-right">
          <div class="card-header">
            <span>{{dataForm.name}}</span>
            <span>检查时间:{{dataForm.gmtModified?dataForm.gmtModified:''}}</span>
          </div>

          <div class="card-content">
            <div class="card-content-item">
              <span class="item-label">检查内容:</span>
              {{dataForm.content}}
            </div>
            <div
              class="card-content-item"
              :class="dataForm.status=='0'?'result-unnormal':'result-normal'"
            >
              <span class="item-label">检查结果:</span>
              {{dataForm.statusName}}
            </div>
            <div class="card-content-item">
              <span class="item-label">情况说明:</span>
              {{dataForm.remark}}
            </div>
            <div class="card-content-item" style="width:600px;">
              <span class="item-label">拍照说明:</span>
              <viewer v-for="(item,index) in dataForm.imgUrl" :key="index">
                <img
                  :src="backgroundURL+item.url"
                  style="height:189px;margin-right:18px;"
                >
              </viewer>
              <img
                :src="require('@/assets/img/yitongzhi.svg')"
                style="width:120px;position:absolute;right:-162px;top:-100px;" 
                v-if="dataForm.isNotice == '0' && dataForm.statusName == '异常'"
              >
              <img
                :src="require('@/assets/img/weitongzhi.svg')"
                style="width:120px;position:absolute;right:-162px;top:-100px;" 
                v-if="dataForm.isNotice == '1' && dataForm.statusName == '异常'"
              >
            </div>

            <div class="card-footer">
              <img
              src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAAmCAYAAACsyDmTAAAD2ElEQVRYR82YTWhcVRTH/+dOEjsNooZKaiA6956gKZFpFoJB8WPauHBXF4qo0I07BQvW7mqr3fkBFnTnQkQp2IXdCZbWWhENBKmRYCaZe18yLmpA/EDSaJyZI1fegG3mvXdn3ixylvPO+Z/fO/eec+8bwg4z2mE8yA0kIrS+vr7bv9jo6Og1IpI8L9kTkHPuIQBPisjDAO4BsCuG+AtAlYguAzhrjPmqW7iugDyIiLwJ4P7ARHNE9Eo3YEFAIjIYRdF7AJ73SxQI859bvITva61fIKJ/smIzxRcWFm4bHh4+B8AvTx67vLGxcahcLv+WJpIKJCKFKIo+E5HH8pC0Y4novNb6cSJqJumlAtVqtbeI6OV+wLQ1ROTtiYmJo10Dra6u7ms2mwsABvoJBKBRKBTKpVLpx066iRWy1n4K4FAAzC8Avo39ZgDsCYg5x8xPBAM55+4C4EREpYi3iOjE5ubmG1NTU1veb3FxcahYLB4TkdcAJMYSUQuAMcas3ajfsULW2pcAvJPxpieZ2SfeZtbaEwBOZsQfYebToUCf+EmcuPGI/iCivVprP5m3WRRFu0TkZxG5JQXqLDM/FQTknLsiIvtTxC4y88G0ClhrLwA4kOLzPTNPBwFZa+sAxlMq9KUx5tE0IOfcJRF5JMXnJ2a+MxSoCuDuFKCNra2tOyYnJ//s5LO0tHTz0NDQVREZTgFaZmZ/MF9nSZv6IoBKxqY8zcxHEja1bwjfGGnWcdk7AjnnXheR4xmC/uB8l4iOa61/975RFN0qIqdE5MWA2FPGmFeDKrSysjKjlPomSzR+/jcR+YkOESkDuCkkTik1o7WeCwLyTtbaKwDSOi0kb5JPxw7zzolHRxRFh1ut1gd5sqY0xWFjzIednicC+auHn0cA7u0z1GK9Xp+uVCqNroDiZZsFcL7PQLPM7IdmR8u8MVprPwLwbD+giOhjY8xzaVqZQL6VW62W76LEyR0IW1dK7W+PiJ4r5ANrtVqFiD7PcVlrKqVmtdaXsuAzK9QWcM4djT+BsjS3PSeiY8YY//mUacFA8SY/A+DpTNXrHc4w8zOhMV0Bzc/P7x4ZGbkgIv6qmmlENDc4OFgZHx/fzHSOHboC8jHVanXPwMDA12m3gVh7uVgsPjg2Nubv3MHWNZBXXl5eNoVCwUPtTch0VSn1gNZ6NZik1wq1E6ytrU01Go0vANx+Q1JfkQPM/EO3MN6/pwq1E0VRNC0ifk+NxL/9qpQ6qLX2R05Plgso7rz7/PHi/1Tws6ZUKn3XE0neJft/Uv8dJyLCzP4unstyVyhX9g7BOw7oXxZ8UTbyUkY+AAAAAElFTkSuQmCC"
              style="width:25px;position:relative;bottom:2px;"
            >
              <span>{{dataForm.place}}</span>
            </div>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      itemSelected: -1,
      backgroundURL: window.SITE_CONFIG.cloudUrl,
      instanceInforEntity: [],
      statusArr: [], //存储检查项目状态数组
      showPatrolReport: false, // 是否显示
      gmtModified: "",
      //任务名称
      taskName: "",
      groupIdName: "",
      remark: "",
      patrolContactor: "",
      handleContactor: "",
      placeArea: "",
      place: "",
      period: "",
      periodName: "",
      longitude: "",
      latitude: "",
      handleContactorString: "",
      patrolContactorString: "",
      patrolDepString: "",
      handleDepString: "",
      //项目实体列表
      investigationInforEntities: "",
      //项目名称
      inforName: "",
      unusual: "",
      usual: "",
      //处置人
      handleContactorString: "",
      //巡查人
      ContactorString: "",
      patrolDepString: "",
      handleDepString: "",
      //项目详情
      dataForm: {
        name: "",
        id: "",
        remark: "",
        imgUrl: [],
        status: "",
        statusName: "",
        place: "",
        longitude: "",
        latitude: "",
        gmtModified: "",
        isNotice: "",
        handleContactorString: "",
        patrolContactorString: "",
        patrolDepString: "",
        handleDepString: "",
        content: "",
      },
    };
  },
  methods: {
    init(id) {
      this.clearInfo();
      this.$http({
        url: this.$http.adornUrl(`/investigation/instanceInfor/info/${id}`),
        method: "get",
        params: this.$http.adornParams({
          id,
        }),
      }).then(({ data }) => {
        console.log("巡查记录详情", data);
        this.statusArr = []; //先清空状态数组
        if (data && data.code === 0) {
          this.gmtModified = data.data.gmtModified;
          this.groupIdName = data.data.taskEntity.groupIdName;
          this.taskName = data.data.taskEntity.name;
          this.remark = data.data.taskEntity.remark;
          this.remark = this.remark.replace(/;/g, "<br>");
          this.patrolContactor = data.data.taskEntity.patrolContactor;
          this.handleContactor = data.data.taskEntity.patrolContactor;
          this.place = data.data.taskEntity.place;
          this.placeArea = data.data.taskEntity.groupIdName;
          this.period = data.data.taskEntity.period;
          this.longitude = data.data.taskEntity.longitude;
          this.latitude = data.data.taskEntity.latitude;
          this.handleContactorString =
            data.data.taskEntity.handleContactorString;
          this.patrolContactorString =
            data.data.taskEntity.patrolContactorString;
          this.patrolDepString = data.data.taskEntity.patrolDepString;
          this.handleDepString = data.data.taskEntity.handleDepString;
          this.inforName = data.data.taskEntity.investigationInforEntities.name;
          this.unusual = data.data.unusual;
          this.usual = data.data.usual;
          this.handleContactorString =
            data.data.taskEntity.handleContactorString;
          this.ContactorString = data.data.patrolContactorString;
          this.patrolDepString = data.data.taskEntity.patrolDepString;
          this.handleDepString = data.data.taskEntity.handleDepString;

          // data.data.inforEntitys = [
          //   {instanceInforEntity:null},
          //   {instanceInforEntity:{
          //     status:1
          //   }},
          //   {instanceInforEntity:{
          //     status:0
          //   }}
          // ]
          data.data.inforEntitys.forEach((v) => {
            console.log("v.instanceInforEntity===>", v.instanceInforEntity);
            if (v.instanceInforEntity == null) {
              if (data.data.status == "-1") {
                this.statusArr.push("待巡查");
              } else {
                this.statusArr.push("未巡查");
              }
            } else if (v.instanceInforEntity.status == 0) {
              this.statusArr.push("异常");
            } else if (v.instanceInforEntity.status == 1) {
              this.statusArr.push("正常");
            } else {
              this.statusArr.push("无法识别");
            }
            console.log(",this.statusArr===>", this.statusArr);
            // this.instanceInforEntity.push(v.instanceInforEntity);
          });
          this.investigationInforEntities = data.data.inforEntitys;
          for (let i = 0; i < this.investigationInforEntities.length; i++) {
            this.investigationInforEntities[i].status = this.statusArr[i];
          }

          if (this.period == "1") {
            this.periodName = "每天";
          }
          if (this.period == "2") {
            this.periodName = "每周";
          }
          if (this.period == "3") {
            this.periodName = "每月";
          }
          if (this.period == "4") {
            this.periodName = "每年";
          }
          this.getInfo(0);
          // this.getInfo(1, "总变开关柜");
        } else {
          this.$message.error(data.msg);
        }
      });
    },
    clearInfo() {
      this.dataForm.name = "";
      this.dataForm.gmtModified = "";
      this.dataForm.content = "";
      this.dataForm.isNotice = "";
      this.dataForm.status = "";
      this.dataForm.remark = "";
      this.dataForm.imgUrl = [];
      this.dataForm.place = "";
      this.dataForm.statusName = "";
    },
    selectItem(index) {
      this.itemSelected = index;
    },
    //检查项目详情
    getInfo(index) {
      this.selectItem(0)
      this.dataForm.name = this.investigationInforEntities[index].name;
      this.dataForm.gmtModified =
        this.investigationInforEntities[index].instanceInforEntity == null
          ? ""
          : this.investigationInforEntities[index].instanceInforEntity
              .gmtModified;
      this.dataForm.content = this.investigationInforEntities[index].content;

      if (this.investigationInforEntities[index].instanceInforEntity != null) {
        this.dataForm.isNotice = this.investigationInforEntities[
          index
        ].instanceInforEntity.isNotice;
        this.dataForm.status = this.investigationInforEntities[
          index
        ].instanceInforEntity.status;
        if (this.dataForm.status == "0") {
          this.dataForm.statusName = "异常";
        }
        if (this.dataForm.status == "1") {
          this.dataForm.statusName = "正常";
        }
        this.dataForm.remark = this.investigationInforEntities[
          index
        ].instanceInforEntity.remark;
        this.dataForm.imgUrl = JSON.parse(
          this.investigationInforEntities[index].instanceInforEntity.imgUrl
        );
        this.dataForm.place = this.investigationInforEntities[
          index
        ].instanceInforEntity.place;
      }
      console.log("11111111", this.dataForm);
      // this.dataForm.id = id;
      // this.dataForm.name = name;
      // this.$http({
      //   url: this.$http.adornUrl(
      //     `/investigation/instanceInfor/instanceInfo/${this.dataForm.id}`
      //   ),
      //   method: "post",
      //   params: this.$http.adornParams()
      // }).then(({ data }) => {
      //   if (data && data.code === 0) {
      //     if (data.data.imgUrl != null && data.data.imgUrl.length > 0) {
      //       this.dataForm.imgUrl = JSON.parse(data.data.imgUrl);
      //     }

      //     this.dataForm.remark = data.data.remark;

      //     this.dataForm.status = data.data.status;
      //     if (this.dataForm.status == "0") {
      //       this.dataForm.statusName = "异常";
      //     } else {
      //       this.dataForm.statusName = "正常";
      //     }
      //     this.dataForm.place = data.data.place;
      //     this.dataForm.longitude = data.data.longitude;
      //     this.dataForm.latitude = data.data.latitude;
      //     this.dataForm.gmtModified = data.data.gmtModified;
      //     this.dataForm.isNotice = data.data.isNotice;
      //     this.dataForm.handleContactorString =
      //       data.data.taskInstanceEntity.taskEntity.handleContactorString;
      //     this.dataForm.patrolContactorString =
      //        data.data.taskInstanceEntity.taskEntity.patrolContactorString;
      //     this.dataForm.patrolDepString =
      //       data.data.taskInstanceEntity.taskEntity.patrolDepString;
      //     this.dataForm.handleDepString =
      //       data.data.taskInstanceEntity.taskEntity.handleDepString;
      //     if (data.data.inforEntity != null) {
      //       this.dataForm.content = data.data.inforEntity.content;
      //     }
      //     this.visible = true;
      //   } else {
      //     this.$message.error(data.msg);
      //   }
      // });
    },
  },
};
</script>

<style lang="less">
.patrolReport {
  // .el-dialog__wrapper {
  //    z-index: 2006 !important;
  // }

  // .patrolReport__board {
  //   position: relative;
  //   height: 800px;
  //   top: -70px;
  //   .patrolReport__dialogHeader {
  //     position: absolute;
  //     top: 0;
  //     left: 0;
  //     right: 0;
  //     height: 50px;
  //     background-color: #f2f2f2;
  //     box-sizing: border-box;
  //     padding: 15px;
  //   }

  //   .patrolReport__info {
  //     position: absolute;
  //     top: 60px;
  //     left: 90px;
  //     right: 0;
  //     box-sizing: border-box;
  //     padding: 0 15px;
  //     height: 30px;
  //     opacity: 0.58;
  //     background-color: #ffffff;
  //   }

  //   .patrolReport__introduction {
  //     position: absolute;
  //     top: 100px;
  //     left: 10px;
  //     right: 10px;

  //     background-color: #f9fbff;
  //   }
  //   .el-card__header {
  //     background-color: #fbfcff;
  //   }
  //   .el-card {
  //     height: 500px !important;
  //   }
  //   .patrolReport__card {
  //     position: relative;
  //     bottom: -220px;
  //     left: 0px;
  //     right: 15px;

  //     box-sizing: border-box;
  //     .box-card_green {
  //       border: 1px solid #0bd295;
  //       height: 20px;
  //       position: absolute;
  //       right: 10px;
  //       color: #ffffff;
  //       background-color: #0bd295;
  //       padding: 0 2px;
  //       box-sizing: border-box;
  //       border-radius: 3px;
  //     }
  //     .box-card_red {
  //       border: 1px solid #fa7e7e;
  //       height: 20px;
  //       position: absolute;
  //       right: 10px;
  //       color: #ffffff;
  //       background-color: #fa7e7e;
  //       padding: 0 2px;
  //       box-sizing: border-box;
  //       border-radius: 3px;
  //     }
  //   }
  //   .shangxin {
  //     border-left: 2px solid #3f92fe;
  //     background-color: burlywood;
  //   }
  //   .errorResult {
  //     color: #d9001b;
  //   }
  //   .sucessResult {
  //     color: #70b603;
  //   }
  // }

  /deep/.el-dialog {
    border-radius: 7px;
    width: 1303px;
    /deep/.el-dialog__header {
      background: #F1F4F6;
      border-radius: 7px;
      padding: 15px 28px;
      .el-dialog__title {
        font-size: 16px;
        font-family: "Microsoft YaHei", PingFangSC-Regular, "PingFang SC", Roboto-Regular, SourceHanSansCN-Regular;
        color: rgba(51, 51, 51, 1);
      }
      .el-dialog__headerbtn {
        height: 21px;
        width: 21px;
        line-height: 21px;
        text-align: center;
        position: absolute;
        top: 17px;
        right: 14px;
        i {
          font-size: 20px;
          font-weight: bolder;
        }
      }
    }
    .el-dialog__body {
      padding: 0;
    }
  }
  * {
    font-size: 14px;
    font-family: "Microsoft YaHei", PingFangSC-Regular, "PingFang SC", Roboto-Regular, SourceHanSansCN-Regular;
  }
  .patrolReport__info {
    display: flex;
    padding: 28px 0 28px 242px;
    > * {
      margin-right: 56px;
    }
  }
  .patrolReport__introduction {
    background: rgba(249, 251, 255, 1);
    display: flex;
    justify-content: space-between;
    padding: 0 84px 28px 84px;
    margin-bottom: 28px;
    .left-content {
      margin: 0 50px 0 80px;
      .item {
        margin-top: 28px;
        // position: relative;
        display: flex;
        flex-direction: row;
        // width: 600px;
        color: rgba(51, 51, 51, 1);
        .item-label {
          // position: absolute;
          // left: -50px;
          // top: 0;
          color: rgba(85, 85, 85, 1);
          min-width: 80px;
        }
        .remark {
          max-width: 350px;
        }
      }
    }
    .right-content {
      width: 400px;
      display: flex;
      flex-direction: column;
      .item {
        margin-top: 28px;
        margin-left: 80px;
        position: relative;
        color: rgba(51, 51, 51, 1);
        .item-label {
          // position: absolute; 注释原因：巡查记录弹窗样式异常
          left: -80px;
          top: 0;
          color: rgba(85, 85, 85, 1);
        }
      }
    }
  }
  .patrolReport__card {
    display: flex;
    padding-bottom: 30px;
    .card-left {
      border: 1px solid rgba(221, 221, 221, 1);
      width: 335px;
      margin-left: 28px;
      position: relative;
      .card-header {
        border-bottom: 1px solid rgba(221, 221, 221, 1);
        padding: 11px 0 9px 19px;
        font-size: 16px;
        font-family: "Microsoft YaHei", PingFangSC-Regular, "PingFang SC", Roboto-Regular, SourceHanSansCN-Regular;
        font-weight: bold;
        color: rgba(102,102,102,1);
        margin-bottom: 7px;
      }
      .check-item-scroll {
        overflow: auto;
        height: calc(100% - 52px);
        .check-item-container {
          position: relative;
          padding: 10px 19px;
          border-left: 2px solid white;
          cursor: pointer;
          .check-item {
            width: 215px;
            margin-right: 10px;
            display: inline-block;
          }
          .item-normal {
            display: inline-block;
            border: 1px solid #0BD295;
            color: white;
            background: #0BD295;
            border-radius: 4px;
            width: 56px;
            height: 30px;
            line-height: 30px;
            text-align: center;
          }
          .item-unnormal {
            display: inline-block;
            border: 1px solid #FA7E7E;
            color: white;
            background: #FA7E7E;
            border-radius: 4px;
            width: 56px;
            height: 30px;
            line-height: 30px;
            text-align: center;
          }
        }
        .check-item-selected{
          border-left: 2px solid #3F92FE;
          background: rgba(231, 242, 253, 1);
        }
      }
    }
    .card-right {
      border: 1px solid rgba(221, 221, 221, 1);
      width: 896px;
      margin-left: 14px;
      position: relative;
      .card-header {
        border-bottom: 1px solid rgba(221, 221, 221, 1);
        padding: 11px 0 9px 19px;
        margin-bottom: 7px;
        // position: relative;
        display: flex;
        justify-content: space-between;
        span {
          font-size: 16px;
          font-family: "Microsoft YaHei", PingFangSC-Regular, "PingFang SC", Roboto-Regular, SourceHanSansCN-Regular;
          font-weight: bold;
          color: rgba(102,102,102,1);
          &:last-child {
            // position: absolute;
            right: 12px;
            font-family: "Microsoft YaHei", PingFangSC-Regular, "PingFang SC", Roboto-Regular, SourceHanSansCN-Regular;
            font-weight: 400;
          }
        }
      }
      .card-content {
        .card-content-item {
          margin: 21px 19px 0 99px;
          font-size: 14px;
          font-family: "Microsoft YaHei", PingFangSC-Regular, "PingFang SC", Roboto-Regular, SourceHanSansCN-Regular;
          color: rgba(51, 51, 51, 1);
          position: relative;
          min-height: 21px;
          .item-label {
            position: absolute;
            left: -80px;
            color: rgba(85, 85, 85, 1);
          }
        }
        .result-unnormal {
          color: #F66E6E;
        }
        .result-normal {
          color: #0BD295;
        }
        .card-footer {
          border-top: 1px solid #DDDDDD;
          margin-top: 25px;
          padding: 11px 15px;
          span {
            font-size: 14px;
            font-family: "Microsoft YaHei", PingFangSC-Regular, "PingFang SC", Roboto-Regular, SourceHanSansCN-Regular;
            color:rgba(102,102,102,1);
          }
          
        }
      }
    }
  }
}
.viewer-container {
  z-index: 999999 !important;
}
</style>
