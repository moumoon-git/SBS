<template>
  <el-dialog
    class="shoolRiskDialog"
    title="统计查询"
    :close-on-click-modal="false"
    @close="imgDialogVisible=false"
    :visible.sync="visible"
    width="800px"
    height="1000px"
  >

    <div class="school-cardClass">
        <div class="list">
          <!-- 一个卡片单位 -->
          <div class="colStaff" v-for="item in items" :key="item.id">
            <div class="schoolRiskCardBody">
              <div class="left" v-if="item.imageUrl != null && item.imageUrl != '' && item.imageUrl.indexOf('http') == -1 ">
                <viewer :images="item.imageUrl.split(',')">
                  <img
                    v-for="(item,index) in item.imageUrl.split(',')"
                    :src="backgroundURL+item"
                    :key="index"
                    style="height:18vh;width:8vw;min-width:99px;"
                  >
                </viewer>
                <div v-if="item.imageUrl.split(',').length>1"
                     :style="{'width':'15px','height':'15px','border-radius':'50%',
                 'line-height':'15px','border':'1px solid red','text-align':'center',
                 'position':'absolute','bottom': 50+(item.imageUrl.split(',').length-1)*120+'px',
                 'right':'10px','z-index':0,'color':'red'}">{{item.imageUrl.split(',').length}}
                </div>
              </div>

              <div class="left" v-else>
                <viewer :images="[imageUrl]">
                  <img
                    v-for="(item,index) in [imageUrl]"
                    :src="item"
                    :key="index"
                    style="height:18vh;width:8vw;min-width:99px;"
                  >
                </viewer>
              </div>

              <div class="right">
                <ul>
                  <li v-if="item.gmtCreate">
                    <label>时间:{{item.gmtCreate}}</label>
                    <span></span>
                  </li>

                  <li v-if="item.townName">
                    <label>地点:{{item.townName}}{{item.platformName}}</label>
                    <span></span>
                  </li>

                  <li v-if="item.eventTypeName">
                    <label>类型:{{item.eventTypeName}}</label>
                    <span></span>
                  </li>

                  <li v-if="item.eventDescription">
                    <label>描述:{{item.eventDescription}}</label>
                    <span></span>
                  </li>

                  <li v-if="item.status == 1">
                    <label>状态: 待核实</label>
                    <span></span>
                  </li>
                  <li v-if="item.status == 2">
                    <label>状态: 核实中</label>
                    <span></span>
                  </li>
                  <li v-if="item.status == 3">
                    <label>状态: 待处理</label>
                    <span></span>
                  </li>
                  <li v-if="item.status == 4">
                    <label>状态: 处理中</label>
                    <span></span>
                  </li>
                  <li v-if="item.status == 5">
                    <label>状态: 已处理</label>
                    <span></span>
                  </li>
                  <li v-if="item.status == 6">
                    <label>状态: 超出范围</label>
                    <span></span>
                  </li>

                  <li>
                    <el-button type="text" size="small"  @click="formFindHandleClick(item)"
                               style="border:none;background:none;color:#479DFF;font-size: 12px;font-family: MicrosoftYaHei;font-weight: bold;">查看
                    </el-button>


                    <!--<el-button type="text" size="small" v-if="item.isAutomatic != 1 && item.isClose == 1 && item.status == '待核实'"
                               @click="formManuaVerifylHandleClick(item)"
                               style="border:none;background:none;color:#76D672;font-size: 12px;font-family: MicrosoftYaHei;font-weight: bold;">派单
                    </el-button>-->

                   <!-- <span @click="updateValidlHandleClick(item)" v-if="item.validFlag == 2" style="cursor: pointer;font-size:12px; margin-left:10px; color: #fff;background-color: #f56c6c;border-color: #f56c6c;border-radius: 50%;padding: 3px;">
                    <i class="el-icon-close"></i>
                  </span>

                    <span @click="updateValidlHandleClick(item)" v-if="item.validFlag == 1" style="cursor: pointer;font-size:12px; margin-left:10px; color: #fff;background-color: #85CB61;border-color: #85CB61;border-radius: 50%;padding: 3px;">
                    <i class="el-icon-check"></i>
                  </span>-->

                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

    <!--点击查看，弹出查看窗口-->
    <word-manager-view :visible.sync="wordMangerViewVisible" ref="wordManagerView" append-to-body z-index="2"></word-manager-view>

  </el-dialog>


</template>

<script>

import WordManagerView from '../../word/manager/wordmanager-view';

export default {
  data() {
    return {
      //查看工单组件弹窗
      wordMangerViewVisible: false,
      //后台接口全局url
      backgroundURL: window.SITE_CONFIG.cloudUrl,
      imgDialogVisible: false,
      imgSrc: "",
      visible: false,
      imageUrl:require('../../../../assets/img/load (1).jpg'),

      //搜索条件
      townId: '',
      platformTypeId: '',
      startTime: "",
      endTime: "",

      //卡片值
      items: []
    };
  },

  components: {
    'word-manager-view': WordManagerView,
  },

  methods: {
    largePhoto(event) {
      this.imgDialogVisible = true;
      this.imgSrc = event.target.src;
    },
    init(flag, townId, platformTypeId, startTime, endTime) {

      let eventInfoConditionEntity = {
        flag: flag,
        townId: townId,
        startTime: startTime,
        endTime: endTime,
        platformTypeId : platformTypeId,
      }

      this.$http({
        url: this.$http.adornUrl('/event/eventinfo/selectStatisticsTypeList'),
        method: 'post',
        params: this.$http.adornParams(eventInfoConditionEntity, false)
      }).then(({ data }) => {
          // console.log('/event/eventinfo/selectStatisticsTypeList',data.list);
          if(data.list.length == 0){
            this.visible = false;
            // alert("查询为空");
            return;
          }

          this.visible = true;
          this.items = data.list;

      });

    },
    onSubmit() {
      // console.log("submit!");
    },

    formFindHandleClick (row) {
      // 查看
      // console.log("点击查看",row)
      this.wordMangerViewVisible = true
      this.$nextTick(() => {
        this.$refs.wordManagerView.init(row)
      })

    },
  }
};
</script>

<style lang="scss">
  .shoolRiskDialog .el-dialog__body {
    padding: 30px 10px;
    color: #606266;
    line-height: 24px;
    font-size: 14px;
    padding-top: 10px;
    height: 700px;
    overflow-y: auto;
    overflow-x: hidden;
  }

  .shoolRiskDialog .school-cardClass {
    padding: 3px;
    border: 1px solid rgba(230, 230, 230, 1);
    width: 100%;
    min-width: 260px;
  }
  .schoolRiskCardBody .right ul {
    margin: 0;
    padding: 0;
  }
  .schoolRiskCardBody .right ul li {
    list-style: none;
  }
  .list {
    display: flex;
    flex-wrap: wrap;
    min-width: 780px;
  }

  .shoolRiskDialog .colStaff {
    width: 24.6%;
    min-width: 370px;
    padding: 13px 10px;
    height: 200px;
    position: relative;
    margin-top: 5px;
    border: 1px solid #555;
    // display: flex;
    box-sizing: border-box;
    margin-right: 0.3vw;
    // background-color: rgb(231, 240, 190);
    border-radius: 5px;
    box-sizing: border-box;
    overflow: hidden;
    > div {
      display: flex;
      margin-left: 10px;
    }

    .schoolRiskCardBody .right {
      ul {
        padding: 0px 10px 0 15px;
        //   padding-top: 10px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        // box-sizing: border-box;
        li {
          font-size: 0.73vw;
          line-height: 23px;
          text-align: left;
          margin-left: 10px;
          label {
            overflow: hidden; /*自动隐藏文字*/
            text-overflow: ellipsis; /*文字隐藏后添加省略号*/
            white-space: nowrap; /*强制不换行*/
            width: 12em;
            display: inline-block;
          }
        }
      }
    }

    .schoolRiskCardBody .left {
      // margin-top: 16px;
      // border: 1px solid #555;
      .el-image {
        img {
          width: 100px;
          height: 100px;
        }
      }
    }
  }
</style>
