<template>
  <div class="list">
    <!-- 一个卡片单位 -->
    <template v-if="!switchView">
      <div class="colStaff" v-for="item in tableData" :key="item.alarmId">
        <!-- <div class="left" style="margin-top:16px;">
              <img style="width:162px;height:100%" :src="item.bkgPicUrl" alt />
        </div>-->
        <div style="overflow: hidden;height: 100%;">
          <div
            class="left"
            v-if="item.imageUrl != null && item.imageUrl != '' && item.imageUrl.indexOf('http') == -1 "
          >
            <viewer :images="item.imageUrl.split(',')" style="height:175px;overflow:hidden;">
              <img
                v-for="(item,index) in item.imageUrl.split(',')"
                :src="backgroundURL+item"
                :key="index"
                style="height:14vh;width:100%;"
              />
            </viewer>
            <div
              v-if="item.imageUrl.split(',').length>1"
              :style="{'width':'15px','height':'15px','border-radius':'50%','line-height':'13px','border':'1px solid red','text-align':'center','position':'absolute','bottom': '14px','right':'6px','z-index':0,'color':'red'}"
            >{{item.imageUrl.split(',').length}}</div>
          </div>

          <div
            class="left"
            v-if="item.imageUrl != null && item.imageUrl != '' && item.imageUrl.indexOf('http') != -1 "
          >
            <viewer :images="[item.imageUrl]">
              <img
                v-for="(item,index) in [item.imageUrl]"
                :src="item"
                :key="index"
                style="height:14vh;width:100%;"
              />
            </viewer>
          </div>

          <div class="left" v-if="!item.imageUrl">
            <viewer :images="[imageUrl]">
              <img
                v-for="(item,index) in [imageUrl]"
                :src="item"
                :key="index"
                style="height:14vh;width:100%;"
              />
            </viewer>
          </div>

          <div class="right">
            <ul class="info">
              <li v-if="item.townName">
                <label>地点：{{item.platformName}}</label>
                <!-- <label>地点：{{item.townName}}{{item.platformName}}</label> -->
<!-- 
                <label>
                  <div
                    v-if="item.validFlag == 1"
                    @click="updateValidlHandleClick(item)"
                    style="cursor: pointer;"
                  >
                    <img
                      src="../../../../assets/img/smile3.png"
                      alt
                      style="width: 22px;height: 22px;"
                    />
                  </div>
                  <div
                    v-if="item.validFlag == 2"
                    @click="updateValidlHandleClick(item)"
                    style="cursor: pointer;"
                  >
                    <img src="../../../../assets/img/cry.png" alt style="width: 26px;height: 26px;" />
                  </div>
                </label> -->
                <!--<span style="font-size:14px; color: #fff;background-color: #f56c6c;border-color: #f56c6c;border-radius: 50%;padding: 5px;">
                      <i class="el-icon-close"></i>
                </span>-->
                <!-- <span style="background-color: red"><i class="el-icon-close"></i></span>-->
              </li>
              <li v-if="item.eventTypeName">
                <label>类型：{{item.eventTypeName}}</label>
                <span></span>
              </li>
              <li v-if="item.gmtCreate">
                <label>时间：{{item.gmtCreate}}</label>
                <span></span>
              </li>
              <!-- <li v-if="item.eventDescription">
                <label>描述:{{item.eventDescription}}</label>
                <span></span>
              </li> 
              <li v-if="item.status">
                <label>状态：{{item.status}}</label>
                <span></span>
              </li>
              <li>-->
                <!-- <label>名单库:{{item.listLibName}}</label> -->
                <!-- <span></span> -->
              <!-- </li> -->
              <li>
                <el-button
                  type="text"
                  size="small"
                  @click="formFindHandleClick(item)"
                  style="border:none;background:none;color:#479DFF;font-size: 12px;font-family: MicrosoftYaHei;font-weight: bold;"
                >查看</el-button>

                <!-- 2020-11-06 tanjinfeng 新增派单按钮 -->
                <!-- 开始 -->
                <el-button
                  v-if="['待核实', '核实中', '待处理'].includes(item.status)"
                  type="text"
                  size="small"
                  style="border:none;background:none;color:#479DFF;font-size: 12px;font-family: MicrosoftYaHei;font-weight: bold;"
                  @click="
                    deliverDialog();
                    deliverId = item.id;
                  "
                >派单</el-button>
                <el-button
                  v-else
                  type="text"
                  size="small"
                  style="border:none;background:none;color:#479DFF;font-size: 12px;font-family: MicrosoftYaHei;font-weight: bold;"
                  @click="recallDeliver(item)"
                >撤回</el-button>
                <!-- 结束 -->


                <el-button
                  type="text"
                  size="small"
                  v-if="item.validFlag == 1"
                  @click="updateValidlHandleClick(item)"
                  style="border:none;background:none;color:#479DFF;font-size: 12px;font-family: MicrosoftYaHei;font-weight: bold;"
                >设为无效</el-button>
                <el-button
                  type="text"
                  size="small"
                  v-if="item.validFlag == 2"
                  @click="updateValidlHandleClick(item)"
                  style="border:none;background:none;color:#479DFF;font-size: 12px;font-family: MicrosoftYaHei;font-weight: bold;"
                >设为有效</el-button>

                <!--<el-button type="text" size="small" @click="formUpdateHandleClick(item)"
                        style="border:none;background:none;color:#76D672;font-size: 12px;font-family: MicrosoftYaHei;font-weight: bold;">编辑
                </el-button>-->

                <!-- <el-button
                  type="text"
                  size="small"
                  v-if="item.isAutomatic != 1 && item.isClose == 1 && item.status == '待核实'"
                  @click="formManuaVerifylHandleClick(item)"
                  style="border:none;background:none;color:#76D672;font-size: 12px;font-family: MicrosoftYaHei;font-weight: bold;"
                >派单</el-button> -->

                <!--<span v-if="item.validFlag == 2" @click="updateValidlHandleClick(item)"  style="cursor: pointer;font-size:12px; margin-left:10px; color: #fff;background-color: #f56c6c;border-color: #f56c6c;border-radius: 50%;padding: 3px;">
                      <i class="el-icon-close"></i>
                </span>-->

                <!--<el-tooltip class="item" effect="dark" content="Top Center 提示文字" placement="top" v-if="item.validFlag == 1">-->
                <!--<span v-if="item.validFlag == 1" @click="updateValidlHandleClick(item)"  style="cursor: pointer;font-size:12px; margin-left:10px; color: #fff;background-color: #85CB61;border-color: #85CB61;border-radius: 50%;padding: 3px;">
                        <i class="el-icon-check"></i>
                </span>-->
                <!--</el-tooltip>-->
              </li>
            </ul>
          </div>
        </div>
      </div>
    </template>

    <el-table :data="tableData" style="width: 100%" v-else>
      <el-table-column label="抓拍图片" align="center">
        <template slot-scope="scope">
          <div
            v-if="scope.row.imageUrl != null && scope.row.imageUrl != '' && scope.row.imageUrl.indexOf('http') == -1 "
          >
            <viewer :images="scope.row.imageUrl.split(',')" style="height:100px;overflow:hidden;position:relative;">
              <img
                v-for="(item,index) in scope.row.imageUrl.split(',')"
                :src="backgroundURL+item"
                :key="index"
                style="height:100px;width:100px;min-width:99px;"
              />
            </viewer>
            <div
              v-if="scope.row.imageUrl.split(',').length>1"
              :style="{'width':'15px','height':'15px','border-radius':'50%','line-height':'13px','border':'1px solid red','text-align':'center','position':'absolute','bottom': '6px','right':'6px','z-index':0,'color':'red'}"
            >{{scope.row.imageUrl.split(',').length}}</div>
          </div>

          <div
            v-if="scope.row.imageUrl != null && scope.row.imageUrl != '' && scope.row.imageUrl.indexOf('http') != -1 "
          >
            <viewer :images="[scope.row.imageUrl]">
              <img
                v-for="(item,index) in [scope.row.imageUrl]"
                :src="item"
                :key="index"
                style="height:100px;width:100px;min-width:99px;"
              />
            </viewer>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="gmtCreate" label="时间" align="center"></el-table-column>
      <el-table-column label="地点" align="center">
        <template slot-scope="scope">{{scope.row.townName}}{{scope.row.platformName}}</template>
      </el-table-column>

      <el-table-column label="类型" align="center"></el-table-column>

      <!-- <el-table-column prop="eventDescription" label="描述" align="center"></el-table-column>
      <el-table-column prop="status" label="状态" align="center" width="80"></el-table-column> -->
      <el-table-column label="有效标志" align="center">
        <template slot-scope="scope">
          <div
            v-if="scope.row.validFlag == 1"
            @click="updateValidlHandleClick(scope.row)"
            style="cursor: pointer;"
          >
            <img src="../../../../assets/img/smile3.png" alt style="width: 22px;height: 22px;" />
          </div>
          <div
            v-if="scope.row.validFlag == 2"
            @click="updateValidlHandleClick(scope.row)"
            style="cursor: pointer;"
          >
            <img src="../../../../assets/img/cry.png" alt style="width: 26px;height: 26px;" />
          </div>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button
            type="text"
            size="small"
            @click="formFindHandleClick(scope.row)"
            style="border:none;background:none;color:#479DFF;font-size: 12px;font-family: MicrosoftYaHei;font-weight: bold;"
          >查看</el-button>
          <el-button
            type="text"
            size="small"
            v-if="scope.row.eventInfoId"
            @click="formManuaVerifylHandleClick(scope.row)"
            style="border:none;background:none;color:#76D672;font-size: 12px;font-family: MicrosoftYaHei;font-weight: bold;"
          >派单</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 选择联系人弹窗 -->
    <LinkmanDraggable ref="deliverDialog" v-show="deliverDialogVisible" @OnchildByValue="deliverDialogConfirm($event)"/>
  </div>
</template>

<script>
import campusPeripheryHeader from "@/views/modules/word/manager/wordheader";
import LinkmanDraggable from "@/views/modules/riskInvestigation/inspectionSheetManagement/LinkmanDraggable/LinkmanDraggable";
export default {
  props: ["tableData",'switchView'],
  components: {
    LinkmanDraggable
  },
  data() {
    return {
      imageUrl: require("../../../../assets/img/load (1).jpg"),
      backgroundURL: window.SITE_CONFIG.cloudUrl,
      // 派单弹窗可视
      deliverDialogVisible: false,
      // 需要派单的工单id
      deliverId: ''
    };
  },
  created() {
    // console.log(this.tableData);
  },
  methods: {
    //查看
    formFindHandleClick(val) {
      //alert("子组件点击查看，触发父组件方法")
      this.$emit("formFindHandleClick", val);
    },
    //编辑
    formManuaVerifylHandleClick(val) {
      this.$emit("formManuaVerifylHandleClick", val);
    },
    //改变有效性
    updateValidlHandleClick(val) {
      this.$emit("updateValidlHandleClick", val);
    },

    /**
     * @method
     * @author tanjinfeng
     * @date 2020-11-06
     * @desc 派单弹窗
     */
    deliverDialog() {
      this.deliverDialogVisible = true;
      this.$refs.deliverDialog.handleAddContacts(
        '/mail/mailgroup/list',
        '请选择',
      );
    },
    deliverDialogConfirm({ linkman }) {
      const mailContactorIds = [];
      linkman.forEach((e) => {
        mailContactorIds.push(e.id);
      })
      const request = {
        url: '/weChatHandleTaskPC/monitoringSendSingleSchool',
        baseURL: window.SITE_CONFIG.baseUrl,
        method: 'post',
        data: {
          mailContactorIds,
          id: this.deliverId,
        },
      };
      this.$http(request)
        .then((response) => {
          if (response.data.code === 0) {
            this.$message.success('派单成功');
            this.$emit('refresh-table');
          } else {
            this.$message.error(`派单失败，错误代码：${response.data.code}，错误信息：${response.data.msg}`);
          }
        })
        .catch((error) => {
          this.$message.error(`派单失败，错误信息：${error}`);
        });
    },

    /**
     * @author tanjinfeng
     * @date 2020-12-29
     * @desc 撤回派单
     */
    recallDeliver(item) {
      this.$http(`${window.SITE_CONFIG.baseUrl}/event/eventinfo/cancelEventInfo?eventInfoId=${item.id}`)
        .then((response) => {
          if (response.data.code === 0) {
            this.$message.success('撤回成功');
            this.$emit('refresh-table');
          } else {
            this.$message.error(`撤回失败，错误代码：${response.data.code}，错误信息：${response.data.msg}`);
          }
        })
        .catch((error) => {
          this.$message.error(`撤回失败，错误信息：${error}`);
        });
    },
  },
};
</script>
<style lang="scss" scoped>
ul {
  margin: 0;
  padding: 0;
}
ul li {
  list-style: none;
}
.list {
  display: flex;
  // justify-content: space-between;
  // align-content: space-between;
  // padding: 0px 5px 0px 10px;
  flex-wrap: wrap;
  min-width: 1207px;
}
// .list:after {
//   content: "";
//   width: 33%;
//   border: 1px solid transparent;
// }
.colStaff {
  width: 24.6%;
  min-width: 293px;
  padding: 13px 10px;
  height: 164px;
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
  .right {
    height: 14vh;
    .info {
      padding: 0px 10px 0 15px;
      //   padding-top: 10px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      height: 100%;
      // box-sizing: border-box;
      li {
        font-size: 0.73vw;
        line-height: 23px;
        text-align: left;
        margin-left: 10px;
        label {
          // overflow: hidden; /*自动隐藏文字*/
          // text-overflow: ellipsis; /*文字隐藏后添加省略号*/
          // white-space: nowrap; /*强制不换行*/
          // width: 11em;
          display: inline-block;
        }
      }
    }
  }
  .left {
    // margin-top: 16px;
    // border: 1px solid #555;
    position: relative;
    width:8vw;
    min-width:99px;
    .el-image {
      img {
        width: 100px;
        height: 100px;
      }
    }
  }
}
</style>
