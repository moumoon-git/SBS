<!--
 * @Author: yaoweixin
 * @Date: 2020-11-06 19:33:47
 * @LastEditors: yaoweixin
 * @LastEditTime: 2020-11-23 20:09:03
 * @Description: 重发会议弹框
 * @FilePath: \SBSNEW\src\views\modules\sys\combined\history\MeetingRecord\restartMeetingDialog.vue
-->
<template>
  <div class="restartMeetingDialog">
    <sv-dialog ref="dialog" title="重启会议" @cancel="quitDialog">
      <!-- 会议成员 -->
      <div class="contentWrapper">
        <div class="meetingMemberWrapper">
          <div class="meetingMemberText">会议成员数：</div>
          <div class="meetingMemberNumber">{{ memberList.length }}</div>
        </div>
        <div class="placeWrapper">
          <div class="place" v-for="(item, index) in memberList" :key="index">
            <div v-if="item.memberType == 1">
              <img src="~@/assets/img/Telephone.png" alt="" />
              <div class="placeRemark">{{ item.name }}</div>
            </div>
            <div v-if="item.memberType == 6">
              <img src="~@/assets/img/Seat.png" alt="" />
              <div class="placeRemark">{{ item.name }}</div>
            </div>
            <div v-if="item.memberType == 8">
              <img src="~@/assets/img/video.png" alt="" />
              <div class="placeRemark">{{ item.name }}</div>
            </div>
            <div v-if="item.memberType == 9">
              <img src="~@/assets/img/Monitor.png" alt="" />
              <div class="placeRemark">{{ item.name }}</div>
            </div>
          </div>
        </div>
      </div>
      <sv-button width="120px" @click="startMeeting">启动会议</sv-button>
      <template #footer><span></span></template>
    </sv-dialog>
    <!-- 重启会议失败弹框 -->
    <StartMeetingFailureDialog
      ref="startMeetingFailureDialog"
    ></StartMeetingFailureDialog>
  </div>
</template>
<script>
import StartMeetingFailureDialog from "./StartMeetingFailureDialog.vue";
export default {
  name: "restartMeetingDialog",
  data() {
    return {
      meetingId: "", //会议的id
      memberList: [], //会议成员
      platformId: "", //平台的id
    };
  },
  components: {
    StartMeetingFailureDialog,
  },
  methods: {
    /**
     * @description: 初始化弹框
     * @param {*} data:表格数据
     * @return {*}
     */
    init(data) {
      console.log("表格数据为", data);
      this.meetingId = data.id;
      this.memberList = data.memberList;
      this.platformId = data.platformId;
      this.$refs.dialog.visible = true;
    },
    /**
     * @description: 重启会议
     * @param {*}
     * @return {*}
     */
    startMeeting() {
      var that = this;
      var ws = new WebSocket(window.SITE_CONFIG["websocket_phone"]);
      var msgArray = [];
      this.memberList.forEach((item, index) => {
        console.log("item数据", item);
        var msg = {
          contactName: item.name,
          phone: item.phone,
          memberType: item.memberType,
        };
        msgArray.push(msg);
      });
      var sendMsg = {
        id: this.meetingId,
        member: msgArray,
        platformId: this.platformId,
        type: "CreateConf",
      };
      console.log("发送data", sendMsg, "json", JSON.stringify(sendMsg));
      ws.onopen = function () {
        ws.send(JSON.stringify(sendMsg));
        console.log("WebSocket发送的内容：", sendMsg);
        console.log("WebSocket地址：", ws);
      };
      ws.onmessage = (evt) => {
        var restartMessage = JSON.parse(evt.data);
        if (restartMessage.code == -1) {
          that.$refs.startMeetingFailureDialog.dialogVisible = true;
        }
        console.log("WebSocket接收到的数据：", evt);
      };
      ws.onerror = function (evt) {
        console.log("WebSocket错误信息：", evt);
        // that.$refs.startMeetingFailureDialog.dialogVisible = true;
      };
    },
    quitDialog() {
      this.$refs.dialog.visible = false;
    },
  },
};
</script>
<style lang="less" scoped>
.restartMeetingDialog {
  /* 弹框样式 */
  /deep/ .sv-dialog {
    width: 500px;
    height: 247px;
    /deep/ .sv-dialog__context {
      display: block;
      .contentWrapper {
        background-color: #f2f2f2;
        margin: 15px;
        padding: 15px;
        .meetingMemberWrapper {
          display: flex;
          margin-bottom: 15px;
          .meetingMemberText {
          }

          .meetingMemberNumber {
          }
        }
        /* 会议成员 */
        .placeWrapper {
          display: flex;
          .place {
            display: flex;
            align-items: center;
            flex-wrap: wrap;
            div {
              display: flex;
              align-items: center;
              margin-left: 10px;
              img {
                width: 15px;
                // height: 15px;
              }

              .placeRemark {
              }
            }
          }
        }
      }

      .sv-button {
        background: #0091ff;
        color: #fff !important;
        text-align: center;
        margin: 0 auto;
        display: block !important;
        margin-top: 100px;
      }
    }
  }
}
</style>