<template>
  <div class="my-phone-right-main">
    <div class="my-radio-box-main">
      <el-radio-group v-model="videoType">
        <el-radio-button
          v-for="(item, index) in list1"
          :label="index"
          :key="index"
          :disabled="confStatus"
          >{{ item.name }}</el-radio-button
        >
      </el-radio-group>
    </div>
    <template v-if="videoList.length > 0 || confStatus">
      <div class="my-phone-right-main-user">
        <div class="my-fax-head">
          <div class="my-fax-head-left">
            会议成员:
            <span>{{ videoList.length }}人</span>&nbsp;&nbsp; 会议时长:
            <span>{{ time }}</span>
          </div>
          <!-- <div class="my-fax-head-right">
            <span @click="EndConf" class="openMeeting-btn oy-active" v-if="confStatus">结束会议</span>
            <span @click="openMeeting" class="openMeeting-btn" v-else>召开会议</span>

            <div v-show="confStatus && videoType == 2" style=" display: flex">
              <span
                @click="TalkingGroupPTT"
                style="margin-left: 10px"
                class="openMeeting-btn"
                v-if="!groupActive"
              >抢权</span>
              <span
                @click="TalkingGroupPTT"
                style="margin-left: 10px"
                class="openMeeting-btn oy-active"
                v-else
              >放权</span>
            </div>

            <i class="my-fax-head-right-line"></i>
            <span @click="clearNumber">清空</span>
          </div>-->
        </div>
        <div class="my-fax-list-box">
          <div
            class="my-fax-list1"
            v-for="(item, index) in videoList"
            :key="index"
          >
            <i class="el-icon-close" @click="myDelete(index)"></i>
            <div v-if="confStatus">
              <template v-if="item.meetingType != 1">
                <i
                  class="my-fax-list1-delete iconfont icon-closeMicrophone"
                  @click="openAuto(index)"
                  :class="{ 'close-style': !item.myAuto, noClick: !confStatus }"
                  v-if="!item.myAuto"
                ></i>
                <i
                  class="my-fax-list1-delete iconfont icon-microphone"
                  @click="openAuto(index)"
                  :class="{ 'operate-active': item.myAuto }"
                  v-else
                ></i>
              </template>
              <template v-if="item.meetingType == 2 || item.meetingType == 1">
                <i
                  class="my-fax-list1-delete iconfont icon-closeView"
                  @click="openVideo(index)"
                  :class="{
                    'close-style': !item.myVideo,
                    noClick: !confStatus,
                  }"
                  v-if="!item.myVideo"
                ></i>
                <i
                  class="my-fax-list1-delete iconfont icon-view"
                  @click="openVideo(index)"
                  :class="{ 'operate-active': !item.myVideo }"
                  v-else
                ></i>
              </template>
              <!-- <i
                v-if="item.myPhoneState==true&&item.myState!=5"
                class="my-fax-list1-state el-icon-s-opportunity"
                :class="{'noClick':false}"
              ></i>
              <i
                v-if="item.myPhoneState==true&&item.myState==5"
                class="my-fax-list1-stateOne el-icon-s-opportunity"
                :class="{'noClick':false}"
              ></i>-->
            </div>
            <div class="my-fax-list1-left-box">
              <!-- <span class="my-fax-list1-left">{{index+1}}</span> -->
              <i
                class="my-fax-list1-left iconfont icon-camera"
                v-if="item.meetingType == 1"
              ></i>
              <i
                class="my-fax-list1-left iconfont icon-video"
                v-else-if="item.meetingType == 2"
              ></i>
              <i
                class="my-fax-list1-left iconfont icon-talkBack"
                v-else-if="item.meetingType == 7"
                style="font-size: 19px !important"
              ></i>
              <i class="my-fax-list1-left iconfont icon-author" v-else></i>
              <div class="my-fax-list1-right">
                {{ item.name || item.contactor || item.call || item.number }}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="outBox">
        <div class="sendMsg">
          <div class="leftButton" v-if="videoType != 0">
            <template v-if="videoType != 2">
              <el-tooltip
                class="item"
                effect="dark"
                :content="!viewVisble ? '禁播' : '广播'"
                placement="left"
              >
                <div
                  class="leftTop"
                  :class="{ noClick: !confStatus }"
                  @click="ConfBoardCastMemberAll(viewVisble ? 1 : 0)"
                >
                  <i class="iconfont icon-view" v-if="!confStatus"></i>
                  <template v-else>
                    <i
                      v-if="viewVisble"
                      class="iconfont icon-view hoverStyle"
                    ></i>
                    <i v-else class="iconfont icon-closeView close-style"></i>
                  </template>
                </div>
              </el-tooltip>
              <el-tooltip
                class="item"
                effect="dark"
                :content="!microphoneVisible ? '禁言' : '发言'"
                placement="left"
              >
                <div
                  class="leftBottom"
                  :class="{ noClick: !confStatus }"
                  @click="OperateConfMemberAll(microphoneVisible ? 2 : 3)"
                >
                  <i
                    class="iconfont icon-prohibitMicrophone"
                    v-if="!confStatus"
                  ></i>
                  <template v-else>
                    <i
                      v-if="microphoneVisible"
                      class="iconfont icon-prohibitMicrophone hoverStyle"
                    ></i>
                    <i
                      v-else
                      class="iconfont icon-closeMicrophone close-style"
                    ></i>
                  </template>
                </div>
              </el-tooltip>
            </template>
            <template v-else>
              <el-tooltip
                class="item"
                effect="dark"
                :content="!microphoneVisible ? '禁言' : '发言'"
                placement="left"
              >
                <div
                  class="leftTop"
                  :class="{ noClick: !confStatus }"
                  @click="OperateConfMemberAll(microphoneVisible ? 2 : 3)"
                >
                  <i
                    class="iconfont icon-prohibitMicrophone"
                    v-if="!confStatus"
                  ></i>
                  <template v-else>
                    <i
                      v-if="microphoneVisible"
                      class="iconfont icon-prohibitMicrophone hoverStyle"
                    ></i>
                    <i
                      v-else
                      class="iconfont icon-closeMicrophone close-style"
                    ></i>
                  </template>
                </div>
              </el-tooltip>
              <el-tooltip
                class="item"
                effect="dark"
                content="对讲"
                placement="left"
              >
                <div
                  class="leftBottom"
                  :class="{ noClick: !confStatus }"
                  @click="TalkingGroupPTT(talkBackVisble ? 1 : 0)"
                >
                  <i class="iconfont icon-talkBack" v-if="!confStatus"></i>
                  <template v-else>
                    <i
                      v-if="talkBackVisble"
                      class="iconfont icon-talkBack hoverStyle"
                    ></i>
                    <i
                      v-else
                      class="iconfont icon-closeTalkBack close-style"
                    ></i>
                  </template>
                </div>
              </el-tooltip>
            </template>
          </div>
          <el-tooltip
            class="item"
            effect="dark"
            :content="!microphoneVisible ? '禁言' : '发言'"
            placement="left"
            v-else
          >
            <div
              class="leftButton teleconferencing"
              :class="{ noClick: !confStatus }"
              @click="OperateConfMemberAll(microphoneVisible ? 2 : 3)"
            >
              <i
                class="iconfont icon-prohibitMicrophone"
                v-if="!confStatus"
              ></i>
              <template v-else>
                <i
                  v-if="microphoneVisible"
                  class="iconfont icon-prohibitMicrophone hoverStyle"
                ></i>
                <i v-else class="iconfont icon-closeMicrophone close-style"></i>
              </template>
            </div>
          </el-tooltip>
          <div class="rightButton" v-if="!confStatus">
            <el-tooltip
              class="item"
              effect="dark"
              content="拨号"
              placement="right"
            >
              <div class="rightTop" @click="submitPhones">
                <i class="iconfont icon-dialIn"></i>
              </div>
            </el-tooltip>
            <el-tooltip
              class="item"
              effect="dark"
              content="清场"
              placement="right"
            >
              <div class="rightBottom" @click="openDelete">
                <i class="iconfont icon-clearance"></i>
              </div>
            </el-tooltip>
          </div>
          <template v-else>
            <el-tooltip
              class="item"
              effect="dark"
              content="拨号"
              placement="right"
            >
              <div class="rightButton startMeeting" @click="submitPhones">
                <i class="iconfont icon-dialIn"></i>
              </div>
            </el-tooltip>
          </template>
          <el-button
            type="primary"
            class="conferenceSwitch"
            @click="openMeeting"
            v-if="!confStatus"
            >启动会议</el-button
          >
          <el-button
            type="primary"
            class="conferenceSwitch meeting-active"
            @click="EndConf"
            v-else
            >结束会议</el-button
          >
          <!-- <el-row style="margin:10px">
            <el-col :span="8" class="labelName">会议类型：</el-col>
            <el-radio-group v-model="videoType" style="margin-top: 15px;font-size:13px">
              <el-radio :label="0" :disabled="confStatus" style="margin-right: 10px" border>电话会议</el-radio>
              <el-radio
                :label="1"
                :disabled="confStatus"
                style="margin-right: 10px; margin-left: 0;"
                border
              >视频会议</el-radio>
              <el-radio
                :label="2"
                :disabled="confStatus"
                style="margin-right: 0; margin-left: 0"
                border
              >集群会议</el-radio>
            </el-radio-group>
          </el-row>
          <el-row style="margin:20px">
            <el-col :span="8" class="labelName">会议时长：</el-col>
            <el-col :span="14">{{timer}}</el-col>
          </el-row>

          <el-row style="margin:20px" v-if="videoType == 2 && confStatus">
            <el-col :span="8" class="labelName">集群状态：</el-col>
            <el-col :span="14">{{groupActiveText}}</el-col>
          </el-row>

          <el-row style="margin:20px" v-if="confStatus">
            <el-col :span="8" class="labelName">会议操作：</el-col>
            <el-col :span="14">
              <div class="flex-spc-x flex-wrap">
                <el-button style="margin: 10px 0" @click="OperateConfMemberAll(3)" type="primary">全部发言</el-button>
                <el-button style="margin: 10px 0" @click="OperateConfMemberAll(2)">全部禁言</el-button>
                <el-button
                  style="margin: 10px 0"
                  @click="ConfBoardCastMemberAll(0)"
                  v-if="videoType != 2"
                  type="primary"
                >全部广播</el-button>
                <el-button
                  style="margin: 10px 0"
                  @click="ConfBoardCastMemberAll(1)"
                  v-if="videoType != 2"
          >取消广播</el-button>-->
          <!-- <el-row style="margin:5px">
                  <el-col :span="12">
                    <div class="oy-all-list" @click="OperateConfMemberAll(3)">
                      <i class="oy-icon-myAuto"></i>
                      <span>全部发言</span>
                    </div>
                  </el-col>
                  <el-col :span="12" v-if="videoType != 2">
                    <div class="oy-all-list" @click="ConfBoardCastMemberAll(0)">
                      <i class="oy-icon-myVideo"></i>
                      <span>全部广播</span>
                    </div>
                  </el-col>
                </el-row>
                <el-row style="margin:10px 5px 5px 5px;">
                  <el-col :span="12">
                    <div class="oy-all-list oy-active" @click="OperateConfMemberAll(2)">
                      <i class="oy-icon-myAuto"></i>
                      <span>全部禁言</span>
                    </div>
                  </el-col>
                  <el-col :span="12" v-if="videoType != 2">
                    <div class="oy-all-list oy-active" @click="ConfBoardCastMemberAll(1)">
                      <i class="oy-icon-myVideo"></i>
                      <span>取消广播</span>
                    </div>
                  </el-col>
          </el-row>-->
          <!-- </div>
            </el-col>
          </el-row>-->
        </div>
      </div>
    </template>
    <template v-else>
      <div class="NoMeeting">暂无会议</div>
    </template>

    <!-- 拨号入会 -->
    <el-dialog
      :visible.sync="isAddNumberShow"
      :before-close="handleClose"
      width="242px"
      :close-on-click-modal="false"
      custom-class="addPhone"
    >
      <div class="transition-box" style="display: flex; padding-left: 13px">
        <dial-plate
          isShowClose="true"
          @callPhone="callPhone"
          style="display: inline-block"
        ></dial-plate>
      </div>
    </el-dialog>

    <!-- 删除确认 -->
    <delete-confi ref="deleteConfi" @deleteHandle="clearNumber"></delete-confi>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import { guid, start, reset } from "@/assets/js/common";
import dialPlate from "./dialPlate.vue";
import deleteConfi from "./deleteConfi";

export default {
  components: {
    dialPlate,
    deleteConfi,
  },
  // props: {
  //   isAddNumberShow: {
  //     type: Boolean,
  //     default: () => {
  //       return false;
  //     }
  //   }
  // },
  data() {
    return {
      seatNumber: sessionStorage.getItem("seat"),
      agent_id: sessionStorage.getItem("agent_id"),
      HWICP_Version: window.g.HWICP_Version, //icp版本
      videoListMemberNum: "", //ECS视频会议参会人员
      videoListNumType: "", //ECS视频会议参会人员类型
      videoType: this.$store.state.videoType, //会议类型
      load_text: "正在连接集群会议",
      rightHeightStyle: {
        height: "",
      },
      videoType: 1, // 当前选项值
      list1: [
        {
          name: "电话会议",
          label: "0",
        },
        {
          name: "视频会议",
          label: "1",
        },
        {
          name: "集群会议",
          label: "2",
        },
      ], // tab选项
      // viewVisble: true, // 广播开关
      // microphoneVisible: true, // 发言开关
      // talkBackVisble: true, // 集群开关
      // confStatus: true,
      isAddNumberShow: false, // 拨号入会弹窗
      timer: "", //定时器
    };
  },
  computed: {
    groupActiveText: function () {
      return this.groupActive ? "已抢权" : "已放权";
    },
    telephoneState: function () {
      return this.$store.getters.getTelephoneState;
    },
    ...mapGetters({
      groupNum: "getGroupNum", //集群号码
      myVdcConfId: "getConfId",
      videoList: "getConfMemberStatus1",
      videoNumber: "getvideoNumber",
      time: "getTimer",
      callIsVisible: "getCallStatus",
      isShowWind: "getIsShowWind",

      confStatus: "getConfStatus", //会议状态
      currentGroupName: "getCurrentGroupName", // 当前抢权的集群号码
      groupActive: "getGroupActive", // 抢权状态
      isLoadShow: "getIsLoadShow", // 加载框开关
      boardCasdIndex: "getBoardCasdIndex",
      getMeetRemoveIndex: "getMeetRemoveIndex",
      microphoneVisible: "getConfSpeakStatus", // 全部发言
      viewVisble: "getConfBroadcastStatus", // 全部广播
      talkBackVisble: "getConfTalkbackStatus", // 全部对讲
      meetingFunction: "getMeetingFunction", // 广播、发言、对讲状态
    }),
  },

  watch: {
    // confStatus: function(newVal){
    //   this.videoList = []
    // },
    // 更新会议类型，用于改变显示的联络网
    videoType: function (newVal) {
      this.$store.commit("setVideoType", newVal);
    },
  },
  mounted() {
    if (!this.confStatus) {
      this.groupStatusClose();
    }
    // this.$store.commit("setIsLoadShow", false);
    // var that = this;
    // this.$bus.$on("clearNumber", function() {
    //   that.clearNumber();
    // });
    // this.$store.commit("SET_COMEMBER", []);
    // this.$store.commit("setConfStatus", false); //设置会议状态
  },
  methods: {
    ...mapActions([
      "addAgentForList", // 会议列表添加坐席
      "removeAgentForList", // 会议列表移除坐席
      "groupStatusClose", // 集群会议 关闭/初始化
      "initBoardParams", // 初始化或设置广播参数
    ]),
    // 全部功能禁用
    allFunctionProhibit() {
      let videoList = [...this.videoList];
      videoList.forEach((o, i) => {
        o.myVideo = true;
        o.myAuto = false;
      });
      // console.log('videoList: ', videoList);
      // this.microphoneVisible = false
      // this.viewVisble = false
      // this.talkBackVisble = false
      this.$store.commit("SET_Speak", true);
      this.$store.commit("SET_Broadcast", false);
      this.$store.commit("SET_Talkback", false);
    },
    // 全部 发言/禁言
    OperateConfMemberAll(status) {
      let videoList = [...this.videoList];
      if (videoList.length == 0) {
        return;
      }
      let phoneNum = "";
      if (this.HWICP_Version == "HWICP-20.0") {
        let isMute;
        if ((status = 2)) {
          isMute = "true";
        }
        if ((status = 1)) {
          isMute = "false";
        }
        this.$icp.muteConf(this.myVdcConfId, isMute);
        videoList.forEach((o, i) => {
          if (status == 2) o.myAuto = false;
          else if (status == 3) o.myAuto = true;
        });
        // this.viewVisble = !this.viewVisble;
        this.$store.commit("SET_Speak", !this.microphoneVisible);
      } else if (this.HWICP_Version == "HWICP-19.0") {
        videoList.forEach((o, i) => {
          if (i != videoList.length - 1) {
            phoneNum += o.content.call + ",";
          } else {
            phoneNum += o.content.call;
          }
        });
        //status: 1、只能说2、只能听3、可说可听,4:不能说不能听,5:全部禁言,6:全部发言
        status = status == 2 ? 5 : 6;
        this.$icp19
          .OperateConfMemberEx(
            Number(this.agent_id),
            Number(this.myVdcConfId),
            0,
            status,
            phoneNum,
            (res) => {}
          )
          .then((data) => {
            if (data.data.errorcode == 0) {
              if (status == 5) {
                this.$message.success("已发起会议成员禁言");
              } else if (status == 6) {
                this.$message.success("已发起会议成员发言");
              }
              videoList.forEach((o, i) => {
                if (status == 6) o.myAuto = true;
                else if (status == 5) o.myAuto = false;
              });
              this.$store.commit("SET_Speak", !this.microphoneVisible);
              this.$store.commit("SET_COMEMBER", videoList);
            }
          });
      }
    },
    // 全部 广播/禁播
    ConfBoardCastMemberAll(isCannel) {
      let mixType = 16;
      let phoneNum = "";
      let videoList = [...this.videoList];
      if (videoList.length == 0) {
        return;
      }
      if (isCannel == 1) {
        mixType = 1;
      } else {
        if (this.videoList.length <= 1) {
          mixType = 1;
        } else if (2 <= this.videoList.length && this.videoList.length <= 4) {
          mixType = 4;
        } else if (5 <= this.videoList.length && this.videoList.length <= 9) {
          mixType = 9;
        } else if (9 <= this.videoList.length) {
          mixType = 16;
        }
      }
      videoList.forEach((o, i) => {
        if (i != videoList.length - 1) {
          phoneNum = phoneNum + o.content.call + ",";
        } else {
          phoneNum = phoneNum + o.content.call;
        }
      });
      if (this.HWICP_Version == "HWICP-19.0") {
        // 设置广播禁播状态
        this.initBoardParams({
          bardStatus: Number(isCannel) + 1,
          boardCasdIndex: -1,
        });
        this.$icp19
          .ConfBoardCastMember(
            Number(this.agent_id),
            Number(this.myVdcConfId),
            mixType,
            phoneNum,
            isCannel,
            (res) => {}
          )
          .then((data) => {
            // console.log('data: ', data);
            if (data.data.errorcode == 0) {
              if (isCannel == 1)
                this.$message.success("已发起取消广播画面功能");
              else if (isCannel == 0)
                this.$message.success("已发起广播画面功能");
              // typeof call ==='function'&&call(data)
              videoList.forEach((o, i) => {
                if (isCannel == 1) o.myVideo = false;
                else if (isCannel == 0) o.myVideo = true;
              });
              this.$store.commit("SET_Broadcast", !this.viewVisble);
            } else {
              this.$message.error("发起广播画面功能 失败");
              this.$store.dispatch("initBoardParams", {});
            }
          });
      } else if (this.HWICP_Version == "HWICP-20.0") {
        let memberInfos = [];
        videoList.forEach((o, i) => {
          videoList;
          memberInfos[i] = {
            number: o.content.call,
          };
        });
        if ((isCannel = 0)) {
          this.$icp.broadcastMixPicture(
            this.myVdcConfId,
            mixType,
            memberInfos,
            (res) => {}
          );
          videoList.forEach((o, i) => {
            o.myVideo = true;
          });
        }
        if ((isCannel = 1)) {
          this.$icp.cancelBroadcastMixPicture(
            this.myVdcConfId,
            memberInfos,
            (res) => {}
          );
          videoList.forEach((o, i) => {
            o.myVideo = false;
          });
          this.$store.commit("SET_Broadcast", !this.viewVisble);
        }
      }
    },
    // 点击 广播/禁播
    openVideo(index) {
      if (this.confStatus) {
        let videoList = [...this.videoList];
        let count = 0; //判断当前开启的视频会议数
        let phoneNum = "";
        let isCannel = 0; //是否取消广播，0否，1取消
        let number = [];
        //先判断广播开始状态 this.videoList[index].myVideo =true 非开启状态
        if (this.videoList[index].myVideo) {
          //已开启
          if (this.HWICP_Version == "HWICP-20.0") {
            this.$icp.cancelBroadcastConfMember(
              this.myVdcConfId,
              this.videoList[index].content.call
            );
          } else if (this.HWICP_Version == "HWICP-19.0") {
            this.videoList.forEach((o, i) => {
              if (index != i) {
                //判断是否当前项,因为此时当前项为开启状态所以不加入开启列表
                if (o.myVideo) {
                  number.push(o.content.call);
                }
              }
            });
            count = number.length;
            phoneNum = number.join(",").slice(0);
            if (count == 0) {
              isCannel = 1;
            } else {
              if (count == 1) {
                count = 1;
              } else if (count <= 4) {
                count = 4;
              } else if (count <= 9) {
                count = 9;
              } else {
                count = 16;
              }
            }
            this.initBoardParams({ bardStatus: 4, boardCasdIndex: index });
            this.$icp19
              .ConfBoardCastMember(
                Number(this.agent_id),
                Number(this.myVdcConfId),
                count,
                phoneNum,
                isCannel
                // res => {
                // }
              )
              .then((res) => {
                if (res.errorcode == 0) {
                  videoList[index].myVideo = !videoList[index].myVideo;
                  this.$store.commit("SET_COMEMBER", videoList);
                }
              });
          }
        } else {
          if (this.HWICP_Version == "HWICP-20.0") {
            this.$icp.broadcastConfMember(
              this.myVdcConfId,
              this.videoList[index].content.call
            );
            if (this.meetingFunction) {
              videoList[index].myVideo = !videoList[index].myVideo;
              this.$store.commit("SET_COMEMBER", videoList);
            }
          } else if (this.HWICP_Version == "HWICP-19.0") {
            this.videoList.forEach((o, i) => {
              if (index == i) {
                //判断是否当前项,因为当前项为非开启我们点击非开启时要开启所以要放入开启项中
                number.push(o.content.call);
              } else {
                if (o.myVideo) {
                  number.push(o.content.call);
                }
              }
            });
            count = number.length;

            if (count == 0) {
              isCannel = 1;
            } else {
              if (count == 1) {
                count = 1;
              } else if (count <= 4) {
                count = 4;
              } else if (count <= 9) {
                count = 9;
              } else {
                count = 16;
              }
            }
            phoneNum = number.join(",").slice(0);
            this.initBoardParams({ bardStatus: 3, boardCasdIndex: index });
            this.$icp19
              .ConfBoardCastMember(
                Number(this.agent_id),
                Number(this.myVdcConfId),
                count,
                phoneNum,
                isCannel
                // res => {
                // }
              )
              .then((res) => {
                if (res.errorcode == 0) {
                  videoList[index].myVideo = !videoList[index].myVideo;
                  this.$store.commit("SET_COMEMBER", videoList);
                }
              });
            // this.$icp19.ConfBoardCastMember(
            // Number(this.agent_id),
            // Number(this.myVdcConfId),
            // 1,
            // this.videoList[index].content.call.toString(),
            //   0
            // );
          }
        }
      }
    },
    //会议成员发言 状态1、只能说2、只能听3、可说可听
    openAuto(index) {
      if (this.confStatus) {
        let videoList = [...this.videoList];
        var parmas = [];
        // if(this.videoType != 2){
        console.log(this.videoList[index].content);
        parmas = [
          Number(this.agent_id),
          Number(this.myVdcConfId),
          0,
          this.videoList[index].myAuto ? 2 : 3,
          this.videoList[index].content.call.toString(),
          // res => {
          // }
        ];

        this.$icp19.OperateConfMemberEx(...parmas).then((data) => {
          if (data.data.errorcode == 0) {
            if (this.videoList[index].myAuto) {
              this.$message.success("已发起会议成员禁言");
            } else {
              this.$message.success("已发起会议成员发言");
            }
            videoList[index].myAuto = !videoList[index].myAuto;
            this.$store.commit("SET_COMEMBER", videoList);
          }
        });
        if (this.meetingFunction) {
          // console.log(videoList)
          // }
          // }else{
          //   parmas = [
          //       Number(this.agent_id),
          //       Number(this.myVdcConfId),
          //       0,
          //       index,
          //       this.currentGroupName,
          //       res => {
          //           console.log(res, '集群会议禁言')
          //       }
          //   ]
          // }
        }
      }
    },
    // 集群会议 抢权/放权
    TalkingGroupPTT(index) {
      if (!this.confStatus) return;
      if (index) {
        this.$confirm("是否进行放权操作", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }).then(() => {
          this.Decentralization(index);
        });
      } else {
        this.$confirm("是否进行抢权操作", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }).then(() => {
          this.$icp19
            .TalkingGroupPTT(this.agent_id, this.currentGroupName, index)
            .then((data) => {
              if (data.data.errorcode == 0) {
                this.$message.success("抢权成功，你有1分钟说话时间");
                this.$store.commit("SET_Talkback", true);
                this.timer = setTimeout(() => {
                  this.Decentralization(1);
                }, 60000);
              } else {
                this.$message.error("抢权失败，请稍等片刻重试");
              }
            });
        });
      }
    },
    // 放权
    Decentralization(index) {
      this.$icp19
        .TalkingGroupPTT(this.agent_id, this.currentGroupName, index)
        .then((data) => {
          if (data.data.errorcode == 0) {
            this.$message.success("无线集群群组已放权！");
            this.$store.commit("SET_Talkback", false);
            clearTimeout(this.timer);
          } else {
            this.$message.error("抢权失败，请稍等片刻重试");
          }
        });
    },
    //结束会议
    EndConf() {
      this.$confirm("确认结束会议？", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          let self = this;
          if (self.HWICP_Version == "HWICP-20.0") {
            self.$icp.endConf(self.myVdcConfId);

            self.endMessing();
          } else if (self.HWICP_Version == "HWICP-19.0") {
            self.$icp19
              .DeleteConf(Number(self.agent_id), Number(self.myVdcConfId))
              .then((data) => {
                if (data.data.errorcode == 0) {
                  this.$message.success("已发起删除会议！");
                  reset();
                  self.endMessing();
                } else {
                  self.$message.error(data.data.msg);
                  reset();
                  self.endMessing();
                }
              });
          } else if (self.HWICP_Version == "vdc") {
            //是否为vdc项目结束会议
            self.$api
              .vdcDeleteConf({
                confId: self.myVdcConfId,
              })
              .then((res) => {
                if (res.result === 0) {
                  self.$message.success("已结束会议！");

                  self.endMessing();
                } else {
                }
              });
          }
          // this.$store.commit("SET_COMEMBER", videoList);
          // this.removeAgentForList();
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "取消结束会议",
          });
        });
    },
    endMessing() {
      let self = this;
      let videoList = [...self.videoList];
      self.$store.commit("SET_CONFID", ""); //重置会议ID
      sessionStorage.removeItem("videoListMemberNum");
      sessionStorage.removeItem("videoListNumType");
      self.$store.commit("setConfStatus", false); //设置会议状态
      videoList.forEach((o, i) => {
        console.log("o: ", o);
        o.myVideo = false;
        o.myAuto = false;
      });
      self.$store.commit("SET_COMEMBER", videoList);
      self.removeAgentForList();
    },
    // 发起会议
    openMeeting() {
      if (this.isShowWind || this.confStatus) {
        this.$message({
          message: "正在通话中",
          type: "warning",
        });
        return;
      }
      if (this.videoList.length == 0) {
        this.$message({
          message: "请添加会议成员！",
          type: "warning",
        });
        return;
      }
      this.$confirm("确认启动会议？", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          let self = this;
          switch (this.HWICP_Version) {
            case "HWICP-20.0":
              let isVideo, isRecorded;
              let memberInfos = [];
              isRecorded = "false"; //是否录像
              for (let i = 0; i < self.videoList.length; i++) {
                memberInfos[i] = {
                  number: self.videoList[i].content.call,
                  name: self.videoList[i].content.name,
                  isMute: "false",
                  isCamera: "false",
                  isWatchOnly: "false",
                  h265: "false",
                };
              }

              if (this.videoType == "0") {
                isVideo = "false";
                this.$icp.createConf(isVideo, isRecorded, memberInfos);
              } else if (this.videoType == "1") {
                isVideo = "true";
                this.$icp.createConf(isVideo, isRecorded, memberInfos);
              }
              setTimeout(() => {
                if (this.confStatus) this.allFunctionProhibit();
              }, 100);
              this.$store.commit("setConfStatus", true); //设置会议状态
              break;

            case "HWICP-19.0":
              if (this.videoType != "2") {
                // console.log(this.videoType, self.videoList);
                let memberNum = "";
                let numType = "";
                for (let index = 0; index < self.videoList.length; index++) {
                  if (index != self.videoList.length - 1) {
                    memberNum =
                      memberNum +
                      self.videoList[index].content.call +
                      "|*|" +
                      self.videoList[index].content.name +
                      ",";
                    if (
                      self.videoType == "0" &&
                      self.videoList[index].content.numType == "8"
                    )
                      numType = numType + "1" + ",";
                    else
                      numType =
                        numType + self.videoList[index].content.numType ||
                        (this.videoType != 1 ? 1 : 8) + ",";
                  } else {
                    memberNum =
                      memberNum +
                      self.videoList[index].content.call +
                      "|*|" +
                      self.videoList[index].content.name;
                    numType =
                      numType + self.videoList[index].content.numType ||
                      (this.videoType != 1 ? 1 : 8);
                  }
                }
                if (self.videoType == "0") {
                  numType = numType + ",1";
                } else if (self.videoType == "1") {
                  numType = numType + ",8";
                }
                // console.log(sessionStorage.getItem("MQMyCode"));
                this.$icp19
                  .CreateConfEx(
                    Number(self.agent_id),
                    memberNum,
                    numType,
                    function (res) {
                      // console.log(res);
                    }
                  )
                  .then((data) => {
                    if (data.data.errorcode == 0) {
                      this.$message.success("已发起创建会议！");
                      start();
                      // typeof call==='function'&&call(data)
                      //router.push({path: '/icpVideo'});
                      sessionStorage.setItem("videoListMemberNum", memberNum);
                      sessionStorage.setItem("videoListNumType", numType);
                      this.$store.commit("setConfStatus", true); //设置会议状态

                      this.allFunctionProhibit();
                    }
                  });
                // setTimeout(()=>{
                //   if (this.confStatus) this.allFunctionProhibit()
                // },100)
              } else {
                // 集群会议
                let videoList = [...this.videoList];
                this.$store.commit("setIsLoadShow", true);
                let params = self.videoList.filter(
                  (item) =>
                    item.content.hasOwnProperty("grouping") &&
                    item.content.grouping == "集群分组"
                );

                // console.log(params, "params");
                if (params.length > 0) {
                  if (params.length > 1) {
                    this.$message.warning("只能选择一个集群分组");
                  } else {
                    this.addAgentForList().then(() => {
                      this.$icp19
                        .MixedGroupCall(
                          Number(self.agent_id), //坐席 id
                          params[0].content.call, //群组号码
                          params[0].content.name // 群组名称
                        )
                        .then((data) => {
                          if (data.conf_id == -1) {
                            this.$message.error(
                              "连接失败，错误码：" + data.errcode
                            );
                            this.$store.commit("setIsLoadShow", false);
                            // return false;
                          } else {
                            start();
                            this.$store.commit("setConfStatus", true); //设置会议状态

                            this.load_text = "连接成功，正在创建会议";

                            this.allFunctionProhibit();

                            this.$store.commit("setIsLoadShow", false);

                            // 将除了集群分组以外的成员入会
                            if (this.HWICP_Version == "HWICP-19.0") {
                              let joinMember = [];
                              joinMember = this.videoList.filter(
                                (v) => v.content.name != "当前坐席"
                              );
                              joinMember = joinMember.filter(
                                (v) =>
                                  !v.content.grouping &&
                                  v.content.grouping != "集群分组"
                              );
                              // joinMember = data.filter(x =>
                              //   this.videoList.every(y => x != y.content.call)
                              // );
                              console.log("joinMember: ", joinMember);
                              joinMember.map((v, index) => {
                                if (this.confStatus) {
                                  this.$icp19.JoinConfEx3(
                                    Number(this.agent_id),
                                    Number(this.myVdcConfId),
                                    0,
                                    v.content.call,
                                    1,
                                    "未知",

                                    (res) => {}
                                  );
                                }
                                this.videoNumber.push(v.content.call);
                                // console.log('videoList: ', videoList);
                              });
                              this.$store.commit(
                                "SET_COMEMBER",
                                this.videoList
                              ); //成员
                              this.$store.commit(
                                "SET_VIDEONUMBER",
                                this.videoNumber
                              ); //成员号码数组用来判断是否已经添加了的
                            }
                            // return data;
                          }
                        });
                    });
                  }
                } else {
                  this.$message.warning("请选择集群分组");
                }

                // .then(data => {
                //   console.log('data: ', data);
                //   if (data) {
                //     this.load_text = "连接成功，正在创建会议";
                //   let videoList = [...this.videoList];
                //   videoList.forEach((o, i) => {
                //     o.myVideo = true;
                //     o.myAuto = true;
                //   });
                //   }
                // });
              }
              break;

            case "vdc":
              // console.log(params);
              //判断是否为vdc项目
              let formData = {
                name: "test1",
                duration: "",
                sites: [],
              };
              self.videoList.forEach((o) => {
                formData.sites.push({
                  name: o.content.name,
                  uri: o.content.call,
                  type: 1,
                });
              });

              self.$api.vdcCreateConf(formData).then((res) => {
                if (res.result === 0) {
                  this.$store.commit("SET_CONFID", res.data.confId || ""); //设置会议ID
                  this.$message.success("已发起创建会议！");
                  this.$store.commit("setConfStatus", true); //设置会议状态
                  // console.log(this.confStatus);
                  setTimeout(() => {
                    if (this.confStatus) this.allFunctionProhibit();
                  }, 100);
                } else {
                }
              });
          }
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "取消召开会议",
          });
        });
    },
    myDelete(index) {
      let videoList = [...this.videoList],
        videoNumber = [...this.videoNumber];
      if (!this.confStatus) {
        videoList.splice(index, 1);
        videoNumber.splice(index, 1);
        this.$store.commit("SET_COMEMBER", videoList);
        this.$store.commit("SET_VIDEONUMBER", videoNumber);
      } else {
        if (this.HWICP_Version == "HWICP-20.0") {
          let memberInfo = {
            number: this.videoList[index].content.call,
            name: this.videoList[index].content.name,
            isMute: "false",
            isCamera: "false",
            isWatchOnly: "false",
            h265: "false",
          };
          this.$icp.hangupConfMember(this.myVdcConfId, memberInfo);
          videoList.splice(index, 1);
          videoNumber.splice(index, 1);
          this.$store.commit("SET_COMEMBER", videoList);
          this.$store.commit("SET_VIDEONUMBER", videoNumber);
        } else if (this.HWICP_Version == "HWICP-19.0") {
          // this.$store.commit('setMeetRemoveIndex',index)
          this.$icp19.RemoveFromConfEx(
            Number(this.agent_id),
            Number(this.myVdcConfId),
            0,
            this.videoList[index].content.call,
            this.videoList[index].content.numType,
            (res) => {}
          );
          // this.$message.success("已发起移出成员！");
          videoList.splice(index, 1);
          videoNumber.splice(index, 1);
          this.$store.commit("SET_COMEMBER", videoList);
          this.$store.commit("SET_VIDEONUMBER", videoNumber);
        }
      }
    },
    getfaxDataN(data) {
      this.$emit("update:isAddNumberShow", false);
    },
    getfaxData(data) {
      let data1 = Object.assign({}, data);
    },
    // submitPhones() {
    //   this.$emit("update:isAddNumberShow", true);
    // },
    clearNumber() {
      //清空
      let videoList = [...this.videoList],
        videoNumber = [...this.videoNumber],
        videoList1 = [...videoList],
        videoNumber1 = [...videoNumber],
        len = videoList1.length - 1;
      if (!this.confStatus) {
        this.$store.commit("SET_COMEMBER", []);
        this.$store.commit("SET_VIDEONUMBER", []);
      } else {
        if (this.HWICP_Version == "HWICP-20.0") {
          this.videoList.forEach((o, index) => {
            let memberInfo = {
              number: o.content.call,
              name: o.content.name,
              isMute: "false",
              isCamera: "false",
              isWatchOnly: "false",
              h265: "false",
            };
            this.$icp.hangupConfMember(
              this.$store.getters.getConfId,
              memberInfo
            );
            for (let i = len; i >= 0; i--) {
              let idx = this.videoNumber.indexOf(videoNumber[i]);
              if (idx != -1) {
                videoNumber.splice(idx, 1);
                videoList.splice(idx, 1);
                this.$store.commit("SET_COMEMBER", videoList);
                this.$store.commit("SET_VIDEONUMBER", videoNumber);
              }
            }
            this.videoList.length == 0 && this.$message.success("全部移除成功");
          });
        } else if (this.HWICP_Version == "HWICP-19.0") {
          this.$store.commit("setMeetRemoveIndex", -1);
          for (let i = len; i >= 0; i--) {
            this.$icp19.RemoveFromConfEx(
              Number(this.agent_id),
              Number(this.myVdcConfId),
              0,
              videoList1[i].content.call,
              videoList[index].content.numType,
              (res) => {}
            );
            let idx = this.videoNumber.indexOf(videoNumber1[i]);
            if (idx != -1) {
              // this.$message.success("已发起移出成员！");
              videoNumber.splice(idx, 1);
              videoList.splice(idx, 1);
              this.$store.commit("SET_COMEMBER", videoList);
              this.$store.commit("SET_VIDEONUMBER", videoNumber);
              this.videoList.length == 0 &&
                this.$message.success("全部移除成功");
            }
          }
        }
      }
    },
    // 拨号入会
    submitPhones() {
      // this.$emit("update:isAddNumberShow", true);
      this.isAddNumberShow = true;
    },
    //拨号盘拨号
    dialing(data) {
      console.log(data);
      if (data.phoneNumber) {
        let rowNumber = {
          number: data.phoneNumber,
        };
        console.log(rowNumber);
        console.log(this.phonesText1);
        if (this.phonesText1.length > 0) {
          console.log("存在");
          this.phonesText1 = this.phonesText1 + "," + rowNumber.number;
        } else {
          console.log("不存在");
          this.phonesText1 = rowNumber.number;
        }
        console.log(this.phonesText1);
        // this.makeCallDish(rowNumber)  //拨号盘呼叫
      }
    },
    handleClose() {
      this.isAddNumberShow = false;
    },
    // 删除弹窗
    openDelete() {
      this.$refs.deleteConfi.init("清空会场");
    },
    // 拨号入会
    callPhone(phoneNumber) {
      let successConf = false;
      let videoList = this.videoList;
      let error = "";
      // console.log("phoneNumber: ", phoneNumber);
      let phoneData = phoneNumber.split(",") || [];
      phoneData = [...new Set(phoneData)];
      phoneData = phoneData.filter((x) =>
        videoList.every((y) => x != y.content.call)
      );
      if (this.HWICP_Version == "HWICP-19.0") {
        phoneData.map((v) => {
          let data = {
            number: v,
          };
          this.$api.findDeviceByNumber(data).then((res) => {
            if (res.errorcode == 0) {
              let detailData = res.data;
              if (this.confStatus) {
                this.$icp19
                  .JoinConfEx3(
                    Number(this.agent_id),
                    Number(this.myVdcConfId),
                    0,
                    v,
                    this.videoType != 1 ? 1 : 8,
                    detailData.name ? detailData.name : "未知",

                    (res) => {}
                  )
                  .then((res) => {
                    if (res.errorcode == 0) {
                      successConf = true;
                    } else {
                      error = res.msg;
                    }
                  });
              }
              detailData.myAuto = false;
              detailData.myVideo = false;
              detailData.myState = 0;
              detailData.content = {
                name: detailData.name,
                call: v,
                numType: "",
              };
              // console.log('res.data: ', detailData);
              videoList.push(detailData);
              this.videoNumber.push(v);
            } else {
              error = res.msg;
            }
          });
          // console.log('videoList: ', videoList);
          this.$store.commit("SET_COMEMBER", videoList); //成员
          this.$store.commit("SET_VIDEONUMBER", this.videoNumber); //成员号码数组用来判断是否已经添加了的
          this.isAddNumberShow = false;
          if (successConf) this.$message.success("已发起加入会议！");
          if (error) this.$message.error(error);
        });
      }
    },
  },
};
</script>

<style scoped>
@import "../../../../../assets/oyIcon/style.css";
@import "../../../../../assets/fonts/iconfont.css";

.my-phone-right-main {
  overflow: auto;
  background-color: white;
  height: calc(100vh - 200px);
  background-color: white;
}

.my-phone-right-main-user {
  background: #fff;
  padding: 10px 0 20px 0;
  /* border-radius: 8px; */
  font-size: 16px;
  border-bottom: 1px solid #d7d7d7;
}

.my-fax-head {
  padding: 0 11px;
  display: flex;
  align-items: center;
}

.my-fax-head-left {
  font-size: 14px;
  color: #666;
  line-height: 20px;
  flex: 1;
  padding: 7px 0 6px 12px;
  background: rgba(247, 248, 250, 1);
  border-radius: 3px 3px 0px 0px;
  border: 1px solid rgba(234, 230, 230, 1);
}

.my-fax-head-left span {
  font-weight: bold;
  color: #333;
  margin: 0 5px;
}

.my-fax-head-right {
  color: #0091ff;
  display: flex;
  align-items: center;
}

.my-fax-head-right span {
  cursor: pointer;
}

.my-fax-head-right-line {
  margin: 0 10px;
  height: 30px;
  width: 1px;
  background: #e1e2e6;
}

.my-fax-list-box {
  padding: 0 11px 10px 11px;
  /* border: 1px solid #858585; */
  /* border-radius: 6px; */
  height: 400px;
  overflow: auto;
}

.my-fax-list {
  display: flex;
  height: 30px;
  color: #858585;
  align-items: center;
}

.my-fax-list1 {
  height: 30px;
  padding: 14px 0 11px;
  color: #858585;
  border: 1px solid #eae6e6;
  border-top: none;
  position: relative;
}
.my-fax-list1:last-child {
  border-radius: 0 0 3px 3px;
}

.my-fax-list1:hover {
  background: #f5faff;
  border-color: #9dbeff;
}

.my-fax-list1-left-box {
  box-sizing: border-box;
  padding: 0 0 0 10px;
  height: 30px;
  margin-right: 95px;
  /* display: flex;
  align-items: center; */
}

.my-fax-list1-right {
  margin-left: 23px;
  color: #333333;
  font-size: 14px;
  line-height: 30px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.my-fax-list1-right-left {
  margin-right: 30px;
  color: #333333;
  font-size: 14px;
  line-height: 30px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.my-fax-list1-state {
  float: right;
  width: 20px;
  line-height: 30px;
  text-align: center;
  font-size: 18px;
  color: #999;
  height: 30px;
  cursor: pointer;
  margin-right: 7px;
}

.my-fax-list1-stateOne {
  float: right;
  width: 20px;
  line-height: 30px;
  text-align: center;
  font-size: 18px;
  color: #9fc8fe;
  height: 30px;
  cursor: pointer;
  margin-right: 7px;
}
.my-fax-list1-stateTwo {
  float: right;
  width: 20px;
  line-height: 30px;
  text-align: center;
  font-size: 18px;
  color: red;
  height: 30px;
  cursor: pointer;
  margin-right: 7px;
}

.my-fax-list1-delete {
  float: right;
  width: 20px;
  line-height: 30px;
  text-align: center;
  font-size: 18px;
  height: 30px;
  color: #9fc8fe;
  cursor: pointer;
  margin-right: 5px;
}

.my-fax-list1-delete.noClick {
  cursor: not-allowed;
}

.my-fax-list1-delete.oy-active:before {
  color: #f56c6c;
}

.my-fax-list1-left {
  height: 20px;
  width: 20px;
  /* border-radius: 50%; */
  /* background: #7bc6fe; */
  /* text-align: center; */
  line-height: 20px;
  /* color: #fff; */
  font-size: 14px;
  float: left;
  margin: 5px 0;
}

.sendFaxBox {
  margin: 16px 0;
  background-color: white;
  /* border: 1px solid rgba(219, 219, 219, 1); */
  border-radius: 3px;
}

.el-icon-close {
  float: right;
  /*font-size: #333;*/
  padding: 0 5px;
  line-height: 30px;
  cursor: pointer;
}

.my-fax-list1-delete-line {
  float: right;
  height: 20px;
  width: 1px;
  margin: 5px;
  background: #e1e2e6;
}

.openMeeting-btn {
  padding: 7px 10px;
  text-align: center;
  color: #fff;
  background: #409eff;
  font-size: 12px;
  border-radius: 3px;
}

.openMeeting-btn.oy-active {
  background: #f56c6c;
}
.labelName {
  font-size: 14px;
  font-family: Microsoft YaHei, sans-serif;
  font-weight: 400;
  color: rgba(96, 98, 102, 1);
}

.oy-all-list {
  margin: 0 20px 0 40px;
  color: #9fc8fe;
  cursor: pointer;
}

.oy-all-list.oy-active {
  color: #999;
}

.oy-all-list.oy-active i:before {
  color: #999;
}

.oy-all-list span {
  font-size: 14px;
}
.groupActive {
  color: #409eff !important;
}
.color1 {
  color: #999;
}
.el-radio__label {
  font-size: 15px;
  padding-left: 10px;
}
</style>
<style lang="scss" scoped>
$pixel: 70px;
// 四分之一圆的样式
@mixin circle {
  width: $pixel;
  height: $pixel;
  background-color: #ededed;
  line-height: $pixel;
  text-align: center;
}
// 四分之一圆悬停的样式
@mixin circleHover {
  width: $pixel * 1.25;
  height: $pixel * 1.25;
  line-height: $pixel * 1.25;
  box-shadow: 0 0 7px #0091ff;
}
.my-phone-right-main {
  // 开启样式
  .operate-active {
    color: #9fc8fe;
  }
  // 关闭样式
  .close-style {
    color: #f56c6c !important;
  }
  .my-radio-box-main {
    margin: 15px 0;
    text-align: center;
  }

  // 操作盘样式
  .outBox {
    height: 225px;
    display: flex;
    justify-content: center;
    align-items: center;
    .sendMsg {
      width: $pixel * 2+4;
      height: $pixel * 2+4;
      position: relative;
      .iconfont {
        color: #ddd;
      }
      .noClick {
        cursor: not-allowed !important;
        color: #ddd;
      }
      .operate-active {
        color: #9fc8fe;
      }

      // 操作盘左半边样式
      .leftButton {
        // 关闭样式
        .close-style {
          color: #f56c6c !important;
        }
        .leftTop {
          @include circle;
          border-radius: $pixel 0 0 0;
          position: absolute;
          right: $pixel + 4;
          bottom: $pixel + 4;
          .hoverStyle {
            color: #9fc8fe;
          }
          &:hover {
            @include circleHover;
            border-radius: $pixel * 1.25 0 0 0;
            cursor: pointer;
            .hoverStyle {
              color: #0091ff;
            }
          }
        }
        .leftBottom {
          @include circle;
          border-radius: 0 0 0 $pixel;
          position: absolute;
          right: $pixel + 4;
          top: $pixel + 4;
          .hoverStyle {
            color: #9fc8fe;
          }
          &:hover {
            @include circleHover;
            border-radius: 0 0 0 $pixel * 1.25;
            cursor: pointer;
            .hoverStyle {
              color: #0091ff;
            }
          }
        }
      }
      // 电话会议发言和广播样式
      .teleconferencing {
        @include circle;
        height: $pixel * 2+4; //两个半圆的高度加上两个半圆之间的间距
        line-height: initial;
        text-align: initial;
        border-radius: $pixel 0 0 $pixel;
        position: absolute;
        right: $pixel + 4;
        .iconfont {
          position: absolute;
          top: calc(
            50% - (8px+2px)
          ); // 8:图标一半的高度，2:两个半圆之间的边距的一半
          left: calc(
            (70px - 40px) / 2 - 8px
          ); // 70:半圆一半的宽度，2:会议开关一半的宽度
        }
        .hoverStyle {
          color: #9fc8fe;
        }
        &:hover {
          width: $pixel * (1.25);
          height: ($pixel * 2+4) * 1.125;
          border-radius: $pixel * (1.25) 0 0 $pixel * (1.25);
          box-shadow: 0 0 7px #0091ff;
          top: -(($pixel * 2+4) * 0.125)/2;
          cursor: pointer;
          .hoverStyle {
            color: #0091ff;
          }
          .iconfont {
            top: calc(50% - (8px+2px));
            left: calc((70px + (70px / 4) - 40px) / 2 - 8px);
          }
        }
      }
      // 操作盘右半边样式
      .rightButton {
        .iconfont {
          color: #9fc8fe;
        }
        .rightTop {
          @include circle;
          border-radius: 0 $pixel 0 0;
          position: absolute;
          left: $pixel + 4;
          bottom: $pixel + 4;
          &:hover {
            @include circleHover;
            border-radius: 0 $pixel * 1.25 0 0;
            cursor: pointer;
            .iconfont {
              color: #0091ff !important;
            }
          }
        }
        .rightBottom {
          @include circle;
          border-radius: 0 0 $pixel 0;
          position: absolute;
          left: $pixel + 4;
          top: $pixel + 4;
          &:hover {
            @include circleHover;
            border-radius: 0 0 $pixel * 1.25 0;
            .iconfont {
              color: #0091ff !important;
            }
          }
        }
      }
      // 开启会议右边圆盘样式
      .startMeeting {
        @include circle;
        height: $pixel * 2+4; //两个半圆的高度加上两个半圆之间的间距
        line-height: initial;
        text-align: initial;
        border-radius: 0 $pixel $pixel 0;
        position: absolute;
        left: $pixel + 4;
        .iconfont {
          color: #9fc8fe;
          position: absolute;
          top: calc(
            50% - (8px+2px)
          ); // 8:图标一半的高度，2:两个半圆之间的边距的一半
          right: calc(
            (70px - 40px) / 2 - 8px
          ); // 70:半圆一半的宽度，2:会议开关一半的宽度
        }
        &:hover {
          width: $pixel * (1.25);
          height: ($pixel * 2+4) * 1.125;
          border-radius: 0 $pixel * (1.25) $pixel * (1.25) 0;
          box-shadow: 0 0 7px #0091ff;
          top: -(($pixel * 2+4) * 0.125)/2;
          cursor: pointer;
          .iconfont {
            color: #0091ff;
            top: calc(50% - (8px+2px));
            right: calc((70px + (70px / 4) - 40px) / 2 - 8px);
          }
        }
      }
      // 会议开关样式
      .conferenceSwitch {
        // width:70px;
        // height:70px;
        // line-height: 70px;
        // text-align: center;
        // color: white;
        background: #0091ff;
        box-shadow: 0px 7px 13px 0px rgba(168, 169, 171, 0.07);
        border: 1px solid rgba(255, 255, 255, 1);
        border-radius: 50%;
        /* padding: 12px; */
        position: absolute;
        width: 80px;
        height: 80px;
        text-align: center;
        top: calc(50% - 40px);
        left: calc(50% - 40px - 2px);
        padding: 0;
      }
      // 结束会议样式
      .meeting-active {
        background: #fa7f7f;
      }
    }
  }

  /* 暂无会议 */
  .NoMeeting {
    background-image: url(/static/img/nullList.png);
    background-repeat: no-repeat;
    background-position: center;
    background-color: white;
    text-align: center;
    line-height: 820px;
    font-size: 12px;
    font-weight: bold;
    color: #cad5e8;
    height: 699px;
  }

  // 拨号入会弹窗
  /deep/ .addPhone {
    .el-dialog__header {
      height: 19px;
      .el-dialog__headerbtn {
        top: 4px;
        font-size: 7px;
      }
    }
  }
}
</style>
