<template>
  <el-row :gutter="20" style="margin: 0">
    <el-col :span="10">
      <div class="user" v-if="logoUser == true"></div>
      <div class="user2" v-if="logoUser == false">
        <span style="padding-left: 10%">{{ title }}</span>
      </div>
    </el-col>
    <el-col
      :span="6"
      style="color: #ffffff; text-align: left; position: relative"
    >
      <!--      <div style="position: absolute;">-->
      <!--        <i  size="mini" class="el-icon-s-fold" style="color: #FFFFFF;cursor: pointer"  @click="shrink" v-if="isShow"></i>-->
      <!--      </div>-->

      <span style="padding-left: 160px" v-if="logoUser == true">{{
        title
      }}</span>
      <span style="padding-left: 160px" v-if="logoUser == false"></span>
      <!--      <span style="font-size: 16px">({{agentService}},{{communicationService}}-->
      <!--        &lt;!&ndash;,{{smsService}}&ndash;&gt;-->
      <!--        )-->
      <!--       </span>-->
    </el-col>
    <el-col
      :span="8"
      class="_el-col"
      style="text-align: right; display: flex; justify-content: flex-end"
    >
      <div
        v-if="autoCallSettings.isAutoCall === '开'"
        style="
          display: flex;
          justify-content: center;
          align-items: center;
          width: 180px;
        "
      >
        <div class="img-style">
          <img
            src="../../../static/img/phoneCallImg/autoCall.png"
            alt
            class="autoCallImg"
          />
          <img
            src="../../../static/img/icon/close.png"
            alt
            class="deleteAutoImg"
            @click="delCallForwarding"
          />
        </div>
        <span
          style="
            color: rgba(255, 255, 255, 1);
            font-size: 17px;
            font-weight: 400;
            margin-left: 6px;
          "
          >{{ autoCallSettings.phone }}</span
        >
      </div>
      <!-- 动态生成app下载二维码 -->
      <el-tooltip
        class="item"
        effect="dark"
        content="下载"
        placement="bottom"
        style="cursor: pointer"
        v-if="downLoadAppUrl != '' && downLoadAppUrl != null"
      >
        <el-popover placement="bottom" width="270" trigger="click">
          <div>
            <el-row>
              <el-col :span="24">
                <div class="qrcode-download-tips">扫码下载</div>
              </el-col>
            </el-row>
            <el-row class="qrcode-row">
              <el-col class="qrcode-col">
                <div id="query">
                  <canvas class="arcode-canvas" id="canvas"></canvas>
                </div>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <div class="qrcode-tips">仅支持安卓手机二维码</div>
              </el-col>
            </el-row>
          </div>
          <el-button
            type="button"
            size="small"
            slot="reference"
            icon="el-icon-download"
            @click="useqrcode"
            class="shrink-button"
          >
          </el-button>
        </el-popover>
      </el-tooltip>
      <el-badge
        class="iconDot"
        :hidden="
          smsAnswerList.length +
            phoneAnswerList.length +
            faxAnswerList.length +
            eventAnswerList.length ===
          0
        "
        is-dot
      >
        <el-popover placement="top-start" width="200" trigger="click">
          <div>
            <el-row>
              <el-col :span="24">
                <div
                  class
                  style="color: #f67b5c; font-size: 16px; margin-bottom: 2%"
                >
                  <i class="el-icon-warning"></i>
                  24小时未读消息({{
                    smsAnswerList.length +
                    phoneAnswerList.length +
                    faxAnswerList.length +
                    eventAnswerList.length
                  }})
                </div>
              </el-col>
            </el-row>
            <el-row>
              <el-col
                :span="12"
                style="
                  border: 1px solid #f0f0f0;
                  height: 75px;
                  text-align: center;
                  color: #0091ff;
                  position: relative;
                "
              >
                <div class="notify-icon" @click="clickAnswerShow('msg')">
                  <el-badge
                    :hidden="smsAnswerList.length === 0"
                    :value="smsAnswerList.length"
                    class="item"
                    type="primary"
                  >
                    <img
                      src="../../../static/img/notify-msg-icon.png"
                      alt="msg"
                    />
                    <span class="notify-span">短信</span>
                  </el-badge>
                </div>
              </el-col>
              <el-col
                :span="12"
                style="
                  border: 1px solid #f0f0f0;
                  height: 75px;
                  text-align: center;
                  color: #0bd295;
                  position: relative;
                "
              >
                <div class="notify-icon" @click="clickAnswerShow('phone')">
                  <el-badge
                    :hidden="phoneAnswerList.length === 0"
                    :value="phoneAnswerList.length"
                    class="phone-badge"
                    style="color: #0bd295"
                  >
                    <img
                      src="../../../static/img/notify-phone-icon.png"
                      alt="phone"
                    />
                    <span class="notify-span">电话</span>
                  </el-badge>
                </div>
              </el-col>
            </el-row>
            <el-row>
              <el-col
                :span="12"
                style="
                  border: 1px solid #f0f0f0;
                  height: 75px;
                  text-align: center;
                  color: #0bd295;
                  position: relative;
                "
              >
                <div class="notify-icon" @click="clickAnswerShow('fax')">
                  <el-badge
                    :hidden="faxAnswerList.length === 0"
                    :value="faxAnswerList.length"
                    class="fax-badge"
                    style="color: #f2b626"
                  >
                    <img
                      src="../../../static/img/notify-fax-icon.png"
                      alt="fax"
                    />
                    <span class="notify-span">传真</span>
                  </el-badge>
                </div>
              </el-col>
              <el-col
                :span="12"
                style="
                  border: 1px solid #f0f0f0;
                  height: 75px;
                  text-align: center;
                  color: #0bd295;
                  position: relative;
                "
              >
                <div
                  class="notify-icon"
                  @click="clickAnswerShow('event', '事件')"
                >
                  <el-badge
                    :hidden="true"
                    class="event-badge"
                    style="color: #fa7e7e"
                  >
                    <img
                      src="../../../static/img/notify-event-icon.png"
                      alt="event"
                    />
                    <span class="notify-span">事件</span>
                  </el-badge>
                </div>
              </el-col>
            </el-row>
          </div>
          <el-button
            type="button"
            size="small"
            slot="reference"
            icon="el-icon-message-solid"
            class="shrink-button"
          ></el-button>
        </el-popover>
      </el-badge>

      <el-tooltip
        class="item"
        effect="dark"
        content="应急综合保障"
        placement="bottom"
        style="cursor: pointer"
      >
        <el-button
          type="button"
          size="small"
          icon="el-icon-menu"
          class="shrink-button"
          @click="toEbs"
        ></el-button>
      </el-tooltip>

      <el-tooltip
        class="item"
        effect="dark"
        content="应急指挥一张图"
        placement="bottom"
        style="cursor: pointer"
      >
        <el-button
          type="button"
          size="small"
          icon="el-icon-s-flag"
          class="shrink-button"
          @click="toEcs"
        ></el-button>
      </el-tooltip>

      <el-tooltip
        v-if="isShiJingShan"
        class="item"
        effect="dark"
        content="应急指挥一张屏"
        placement="bottom"
        style="cursor: pointer"
      >
        <el-button
          type="button"
          size="small"
          icon="el-icon-monitor"
          class="shrink-button"
          @click="toBigScreen"
        ></el-button>
      </el-tooltip>

      <el-tooltip class="item" effect="dark" content="设置" placement="bottom">
        <el-button
          type="button"
          size="small"
          icon="el-icon-s-tools"
          class="shrink-button"
          @click="setting"
        ></el-button>
      </el-tooltip>

      <el-tooltip class="item" effect="dark" content="退出" placement="bottom">
        <el-button
          type="button"
          size="small"
          icon="el-icon-switch-button"
          class="shrink-button"
          @click="quitBtn"
        ></el-button>
      </el-tooltip>
    </el-col>
    <!--    <el-col :span="1" class="_el-col">-->
    <!--      -->
    <!--    </el-col>-->
    <setting-dialog
      :dialogVisible="dialogVisible"
      @handleClose="handleClose"
    ></setting-dialog>
  </el-row>
</template>

<script>
import settingDialog from "@/view/SysSetting/settingDialog";
import { phoneReset } from "@/assets/js/common";
import { mapGetters } from "vuex";
import QRCode from "qrcode";
export default {
  name: "MenuIcon",
  components: { settingDialog },
  data() {
    return {
      HWICP_Version: window.g.HWICP_Version, //icp版本
      isShow: true, //图标按钮是否显示,
      dialogVisible: false, //是否显示弹窗
      EBSUrl: window.g.ApiEBS,
      ECSUrl: window.g.ApiMap,
      ip: "",
      logoUser: window.g.logoIsShow,
      title: window.g.systemTitle,

      phoneAnswerList: [], // 电话未读
      smsAnswerList: [], // 短信未读
      faxAnswerList: [], // 传真未读
      eventAnswerList: [], // 事件未读
      isShiJingShan: window.g.systemTitle.indexOf("石景山") > -1, // 是否石景山项目
      autoCallSettings: {
        phone: "",
        isAutoCall: "关",
      }, // 自动转接电话
      downLoadAppUrl: window.g.downLoadAppUrl, // app下载地址
    };
  },
  watch: {
    cAnswerNum() {
      this.getAllAnswer();
    },
    settings: {
      handler: function (newVal, oldVal) {
        this.autoCallSettings = newVal;
        console.log("autoCallSettings", newVal);
      },
      deep: true,
    },
  },
  computed: {
    //计算属性监听全局变量进行数组操作
    ...mapGetters({
      settings: "getAutoCallSettings", //自动转接设置
    }),
    cAnswerNum() {
      return this.$store.state.answerNum;
    },

    // agentService() {
    //   return this.$store.getters.getAgentService
    // },
    // communicationService() {
    //   return this.$store.getters.getCommunicationService
    // },
    // smsService() {
    //   return this.$store.getters.getSmsService
    // }
  },
  created() {
    this.getAllAnswer();
    console.log("设置", this.settings, this.$store.getters.getAutoCallSettings);
    this.autoCallSettings = this.$store.getters.getAutoCallSettings; // bug8569 author:hexinting date:2020-11-19
  },
  methods: {
    getAllAnswer() {
      this.getPhoneAnswerList(); //获取电话未读
      this.getSmsAnswerList(); //获取电话未读
      this.getFaxAnswerList(); //获取电话未读
      this.getEventAnswerList(); //获取电话未读
    },
    /**
     * @lastEditor hexinting
     * @lastDate 2020-10-22
     * @description 获取未读电话
     */
    getPhoneAnswerList() {
      //获取未读电话
      this.$api.getMissCalls({}).then((res) => {
        if (res.errorcode == 0) {
          if (res.data) {
            this.phoneAnswerList = res.data;
          }
        }
      });
    },
    /**
     * @lastEditor hexinting
     * @lastDate 2020-10-22
     * @description 获取未读短信
     */
    getSmsAnswerList() {
      //获取未读短信
      this.$api.getUnreadSms({}).then((res) => {
        if (res.errorcode == 0) {
          if (res.data) {
            this.smsAnswerList = res.data;
          }
        }
      });
    },
    /**
     * @lastEditor hexinting
     * @lastDate 2020-10-22
     * @description 获取未读传真
     */
    getFaxAnswerList() {
      //获取未读传真
      this.$api.getUnreadFax({}).then((res) => {
        if (res.errorcode == 0) {
          if (res.data) {
            this.faxAnswerList = res.data;
          }
        }
      });
    },
    getEventAnswerList() {
      //获取未读事件
      // this.$api.getUnreadSms({}).then(res =>{
      //
      // })
    },

    clickAnswerShow(type, title) {
      if (title === "事件") {
        console.log(121321);
        this.$router.push({
          path: "/eventRegistration",
          query: { type },
        });
        return;
      }
      this.$router.push({ path: "/messageHistory", query: { type } });
    },

    toEbs() {
      //打开EBS
      let ipData = {};
      this.$api.getIp(ipData).then((res) => {
        if (res.errorcode == "0") {
          this.ip = res.data;
          let data = {
            guId: this.ip,
          };
          this.$api.userPlan(data).then((res) => {
            if (res.errorcode == "0") {
              let usernames = res.data.usernames;
              let psw = res.data.psw.replace("+", "%2B"); // 将 + 替换成 加密的 %2B url地址获取时才不会被转义成空格 author:xuchuangxing lastUpdateTime:2021/1/24
              let agent_id = sessionStorage.getItem("agent_id");
              let iddcode = sessionStorage.getItem("seat");
              window.open(
                `${
                  this.EBSUrl
                }/#/login?usernames=${usernames}&psw=${psw}&agent_id=${agent_id}&iddcode=${iddcode}&Authorization=${
                  localStorage.getItem("token")
                    ? localStorage.getItem("token")
                    : ""
                }`
              );
            } else {
              this.$message.error(res.msg);
            }
          });
        } else {
          this.$message.error("暂时无法打开该系统");
        }
      });
    },
    toEcs() {
      //打开ecs系统
      let ipData = {};
      this.$api.getIp(ipData).then((res) => {
        if (res.errorcode == "0") {
          this.ip = res.data;
          let data = {
            guId: this.ip,
          };
          this.$api.userPlan(data).then((res) => {
            if (res.errorcode == "0") {
              let usernames = res.data.usernames;
              let psw = res.data.psw.replace("+", "%2B"); // 将 + 替换成 加密的 %2B url地址获取时才不会被转义成空格 author:xuchuangxing lastUpdateTime:2021/1/24
              let agent_id = sessionStorage.getItem("agent_id");
              let iddcode = sessionStorage.getItem("seat");
              if (window.g.MapProjectUrl === true) {
                window.open(
                  `${
                    this.ECSUrl
                  }/login.html?usernames=${usernames}&psw=${psw}&agent_id=${agent_id}&iddcode=${iddcode}&Authorization=${
                    localStorage.getItem("token")
                      ? localStorage.getItem("token")
                      : ""
                  }`
                );
              } else {
                window.open(
                  `${
                    this.ECSUrl
                  }/dispatch.html?agent_id=${agent_id}&iddcode=${iddcode}&Authorization=${
                    localStorage.getItem("token")
                      ? localStorage.getItem("token")
                      : ""
                  }`
                );
              }
            } else {
              this.$message.error(res.msg);
            }
          });
        } else {
          this.$message.error("暂时无法打开该系统");
        }
      });
    },
    // 打开大屏
    toBigScreen() {
      let ipData = {};
      this.$api.getIp(ipData).then((res) => {
        if (res.errorcode == "0") {
          this.ip = res.data;
          let data = {
            guId: this.ip,
          };
          this.$api.userPlan(data).then((res) => {
            if (res.errorcode == "0") {
              let usernames = res.data.usernames;
              let psw = res.data.psw;
              let agent_id = sessionStorage.getItem("agent_id");
              let iddcode = sessionStorage.getItem("seat");
              if (window.g.MapProjectUrl === true) {
                window.open(
                  `${"http://172.26.72.34:9090"}/login.html?usernames=${usernames}&psw=${psw}&agent_id=${agent_id}&iddcode=${iddcode}&Authorization=${
                    localStorage.getItem("token")
                      ? localStorage.getItem("token")
                      : ""
                  }`
                );
              } else {
                window.open(
                  `${"http://172.26.72.34:9090"}/index.html?agent_id=${agent_id}&iddcode=${iddcode}&Authorization=${
                    localStorage.getItem("token")
                      ? localStorage.getItem("token")
                      : ""
                  }`
                );
              }
            } else {
              this.$message.error(res.msg);
            }
          });
        } else {
          this.$message.error("暂时无法打开该系统");
        }
      });
    },
    shrink() {
      this.isShow = false;
      this.$emit("menuClose");
    },
    setting() {
      this.dialogVisible = true; //打开设置窗口
    },
    handleClose() {
      this.dialogVisible = false; //关闭设置窗口
    },
    quitBtn() {
      this.$confirm("确定退出吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.quit();
          let that = this;
          this.$icp19.UnInitialize(function () {
            phoneReset(); //重置计时
            let boxList = [
              {
                current: 1,
                text: "三方",
                start: false,
                url: "/static/img/phoneCallImg/peopleGray.png",
              },
              {
                current: 1,
                text: "拨号",
                start: false,
                url: "/static/img/phoneCallImg/callGray.png",
              },
              {
                current: 1,
                text: "恢复",
                start: false,
                url: "/static/img/phoneCallImg/recoverGray.png",
              },
              {
                current: 1,
                text: "转接",
                start: false,
                url: "/static/img/phoneCallImg/switchGray.png",
              },
              {
                current: 1,
                text: "拨号盘",
                start: true,
                url: "/static/img/phoneCallImg/phoneBlue.png",
              },
              {
                current: 1,
                text: "保持",
                start: false,
                url: "/static/img/phoneCallImg/keepCallingGray.png",
              },
            ];
            that.$store.commit("setBoxList", boxList); //复原新的拨号组可操作按钮
            that.$store.commit("setPhoneList", []); //提交修改状态之后的通话列表
            that.$store.commit("setNowSelectPhoneList", []);
            that.$store.commit("setPhoneState", 5); //三方通话存储当前通话类型
            that.$store.commit("setThreePhoneList", []); //存储三方列表
            that.$store.commit("setIsCallPhone", "hangUp"); //不在通话状态,关闭弹窗
            that.$store.commit("setIsPhoneCallStatus", false); //修改是否可以操作队列
            that.$store.commit("setCallStatus", false); //旧弹窗关闭
            that.$store.commit("SET_ISSHOWWIN", false);
            that.$store.commit("setCallClass", "");
            that.$store.commit("SET_USERC", {});
            that.$store.commit("setTxtNotify", []);
            that.$store.commit("setIsDialogType", "");
            that.$store.commit("setUploadAgent", false); //是否加载agent
            that.$store.commit("setAgentService", false); //初始坐席连接状态 author:hexinting date:2020-10-27 bug 7332
            that.$store.commit("setCommunicationService", false); //初始通讯服务连接状态 author:hexinting date:2020-10-27 bug 7332
          });
          this.$YouShiKang.quit(); //退出优士康（清除计时器）
          if (window.g.isUserOauth2) {
            window.location.href = window.g.quitUrl;
          }
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消",
          });
        });
    },
    quit() {
      let data = {};
      this.$api.logout(data).then((res) => {
        if (res.errorcode == 0) {
          localStorage.removeItem("agent_id");
          sessionStorage.removeItem("displayname");
          this.$message({
            message: res.data,
            type: "success",
          });
          this.$router.push({
            path: window.g.route,
          });
          let message = "坐席已退出";
          let data = {
            topicName: "ecs" + sessionStorage.getItem("displayname"),
            text: message,
          };
          this.$api.sendMsgToECS(data).then((res) => {
            if (res.errorcode == 0) {
              this.$message("已向ECS发送" + message);
            }
          });
          // this.$MQTT_wenSocket.dis_connect();
          if (this.HWICP_Version == "HWICP-19.0") {
            // this.$STOMP_websocket.dis_connect();
            this.$icp19.UnInitialize();
          }
        }
      });
    },

    // 删除坐席呼叫转发配置
    delCallForwarding() {
      let data = {
        phone: this.autoCallSettings.phone,
        agentId: sessionStorage.getItem("agent_id"),
      };
      this.$api.delCallForwarding(data).then((res) => {
        if (res.errorcode === 0) {
          console.log("已关闭自动转接");
          // this.$message({
          //   message: '已关闭自动转接',
          //   type: 'success'
          // })
          let autoCallSettings = {
            phone: this.autoCallSettings.phone,
            isAutoCall: "关",
          };
          this.$store.commit("setAutoCallSettings", autoCallSettings);
        }
      });
    },
    /**
     * @description: 动态生成app下载二维码
     * @updateTime : 2020-11-16
     * @athor : husiyue
     * @lastEditor : husiyue
     * @param downLoadAppUrl  app下载地址
     * @return {*}
     */
    useqrcode() {
      this.QueryDetail = window.g.downLoadAppUrl;
      let canvas = document.getElementById("canvas");
      QRCode.toCanvas(canvas, this.QueryDetail, (error) => {
        if (error) {
          this.$message({
            message: "二维码加载失败",
            type: "error",
          });
        }
      });
    },
  },
};
</script>


<style scoped>
._el-col {
  color: #9da4b3;
  padding: 0 !important;
  /*border-left: 1px solid #F2F2F2;*/
}

.iconSize {
  font-size: 24px;
}

.shrink-button {
  font-size: 22px;
  color: white;
  border: none;
  background-color: rgba(0, 0, 0, 0);
}

.shrink-button:hover {
}

.shrink-button:focus {
  color: #656565;
  background-color: white;
}

.iconDot >>> .is-dot {
  right: 25px;
  top: 30px;
}

>>> .el-button + .el-button {
  margin-left: 0;
}
.user {
  background: url(/static/img/LOGO.png) 3px no-repeat;
  background-size: 70% 50px;
  width: 100%;
  height: 65px;
}
.user2 {
  width: 100%;
  height: 65px;
  color: white;
}

/*.el-icon-s-fold:hover{*/
/*color: #FFFFFF;*/
/*}*/
.notify-icon {
  cursor: pointer;
  display: inline-block;
  font-size: 28px;
  position: absolute;
  top: 40%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.notify-span {
  display: inline-block;
  font-size: 16px;
  font-weight: 400;
  line-height: 30px;
  position: absolute;
  width: 40px;
  top: 28px;
  left: -6px;
}
.img-style {
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
}
.autoCallImg {
  width: 44px;
  height: 44px;
  cursor: pointer;
}
.img-style:hover .deleteAutoImg {
  display: block !important;
  position: absolute;
  top: -6px;
  right: -6px;
  cursor: pointer;
  width: 20px;
  height: 20px;
}
.deleteAutoImg {
  display: none;
  position: absolute;
  top: -6px;
  right: -6px;
  cursor: pointer;
  width: 20px;
  height: 20px;
}
.arcode-canvas {
  width: 200px !important;
  height: 200px !important;
}
.qrcode-download-tips {
  font-size: 15px;
  margin-bottom: 2%;
  font-weight: 600;
  text-align: center;
}
.qrcode-tips {
  font-size: 13px;
  margin-bottom: 2%;
  margin-top: 2%;
  text-align: center;
}
.qrcode-row {
  display: flex;
  justify-content: center;
}
.qrcode-col {
  color: #f0f0f0;
  height: 200px;
  width: 200px;
  position: relative;
}
</style>
