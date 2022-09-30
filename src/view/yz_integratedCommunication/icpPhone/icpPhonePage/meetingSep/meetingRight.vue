<template>
  <div class="my-phone-right-main">
    <div
      :class="
        !vdcp ? 'my-radio-box-main' : 'my-radio-box-main vdcpMettingHandleWrap'
      "
    >
      <el-radio-group v-model="videoType">
        <el-radio-button
          v-for="(item, index) in list1"
          :label="index"
          :key="index"
          :disabled="confStatus"
          >{{ item.name }}</el-radio-button
        >
      </el-radio-group>
      <!-- vdcp -->
      <div v-if="vdcp">
        <el-button type="primary" @click="OpenTemplat">模板</el-button>
        <el-button
          type="primary"
          v-if="!vdcpInterVal"
          @click="vdcpLxDataObj.vdcpLxFlag = !vdcpLxDataObj.vdcpLxFlag"
          >轮询</el-button
        >
        <el-button v-else @click="outVdcpStartLx" type="danger"
          >退出轮询</el-button
        >
      </div>
    </div>
    <template v-if="videoList.length > 0 || confStatus">
      <div class="my-phone-right-main-user">
        <div class="my-fax-head">
          <div class="my-fax-head-left">
            <div>
              会议成员:
              <span>{{ videoList.length }}人</span>&nbsp;&nbsp; 会议时长:
              <span>{{ time }}</span>
            </div>
            <div
              class="saveMettingTemplate"
              v-if="vdcp"
              @click.stop="editWindPupopVis = true"
            >
              保存模板
            </div>
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
            @mouseenter="getMonitoring(index)"
            :key="index"
          >
            <i class="el-icon-close" @click="myDelete(index)"></i>
            <div v-if="confStatus">
              <div v-if="item.myState">
                <!-- <template v-if="item.meetingType !=1"> -->
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
                <!-- </template>
                <template v-if="item.meetingType == 2 || item.meetingType == 1"> -->

                <i
                  class="my-fax-list1-delete iconfont icon-closeView"
                  @click="openVideo(index)"
                  :class="{
                    'close-style': !item.myVideo,
                    noClick: !confStatus
                  }"
                  v-if="!item.myVideo"
                ></i>
                <i
                  class="my-fax-list1-delete iconfont icon-view"
                  @click="openVideo(index)"
                  :class="{ 'operate-active': !item.myVideo }"
                  v-else
                ></i>
                <!-- </template> -->
              </div>
              <div
                v-else-if="
                  item.myState == 4 || item.myState == 0 || !item.myState
                "
                @click.capture="
                  reConnect(
                    item.call || item.number || item.indexCode || item.content
                  )
                "
                style="font-size: 15px;color:#0091ff;cursor: pointer;float:right;margin: 5px;"
              >
                <!-- <i
                  class="my-fax-list1-delete iconfont icon-reconnect"
                  @click="reConnect(item.call || item.number)"
                ></i> -->
                重新呼叫
              </div>
              <!-- <i
                v-if="item.myPhoneState==true&&item.myState!=5"
                class="my-fax-list1-state el-icon-s-opportunity"
                :class="{'noClick':false}"
              ></i>
              <i
                v-if="item.myPhoneState==true&&item.myState==5"
                class="my-fax-list1-stateOne el-icon-s-opportunity"
                :class="{'noClick':false}"
              ></i> -->
            </div>

            <!-- 已激活 -->
            <img
              v-if="
                vdcp &&
                  item.numberType == '8' &&
                  item.setChairFlag &&
                  item.myState
              "
              :src="item.active"
              class="setChair"
              alt=""
            />
            <!-- 未激活 -->
            <img
              v-if="
                vdcp &&
                  item.numberType == '8' &&
                  !item.setChairFlag &&
                  !confStatus
              "
              :src="item.notActive"
              @click="setChairFun(item)"
              class="setChair"
              alt=""
            />

            <i
              class="my-fax-list1-delete iconfont icon-notConnected"
              style="position: absolute;right: 120px;top:15px;font-size:20px;pointer-events:none;"
              v-if="confStatus && !item.myState"
            ></i>
            <div
              class="my-fax-list1-left-box"
              :style="{ 'margin-right': item.myState ? '90px' : '150px' }"
            >
              <!-- <span class="my-fax-list1-left">{{index+1}}</span> -->
              <!-- <i class="my-fax-list1-left iconfont icon-camera" v-if="item.meetingType == 1" :style="{color:item.myState == 0?'#f2f2f2':'initial'}"></i> -->

              <div
                class="my_fax_list1_left_box_hover"
                v-if="item.meetingType == 1"
              >
                <img
                  v-if="
                    item.myState != 4 &&
                      item.myState != 0 &&
                      item.myState != 3 &&
                      item.myState
                  "
                  src="../../../../../assets/icpImg/jian1.png"
                  alt=""
                />
                <img
                  v-else
                  src="../../../../../assets/icpImg/jian.png"
                  alt=""
                />
                <div class="my-fax-list1-left-box_rocker_wrap">
                  <div class="rocker_wrap">
                    <div
                      class="rocker_rotate_wrap"
                      :data-index="item.indexCode"
                    ></div>
                    <span>旋转</span>
                  </div>
                  <div class="rocker_jj_wrap">
                    <input
                      class="rocker_jjInput_wrap"
                      type="range"
                      min="1"
                      max="10"
                      value="0"
                    />
                    <span>变焦</span>
                  </div>
                </div>
              </div>

              <!-- :style="{color:item.myState == 0?'#f2f2f2':'initial'}" -->
              <i
                class="my-fax-list1-left iconfont icon-video"
                :style="{
                  color:
                    item.myState == 0 || item.myState == 3
                      ? '#f2f2f2'
                      : '#4db915'
                }"
                v-else-if="item.meetingType == 2"
              ></i>
              <i
                class="my-fax-list1-left iconfont icon-talkBack"
                v-else-if="item.meetingType == 7"
                style="font-size: 19px !important"
                :style="{ color: item.myState == 0 ? '#f2f2f2' : 'initial' }"
              ></i>
              <i
                class="my-fax-list1-left iconfont icon-author"
                v-else
                :style="{ color: item.myState == 0 ? '#f2f2f2' : 'initial' }"
              ></i>
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
                <!-- 0广播，1取消广播 -->
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
      :class="IsYangZhouProject?rightDialog:''"
      :visible.sync="isAddNumberShow"
      :before-close="handleClose"
      width="242px"
      :close-on-click-modal="false"
      custom-class="addPhone"
    >
      <div class="transition-box" style="display: flex;padding-left: 13px;">
        <dial-plate
          isShowClose="true"
          @callPhone="callPhone"
          style="display: inline-block"
        ></dial-plate>
      </div>
    </el-dialog>

    <!-- 删除确认 -->
    <delete-confi ref="deleteConfi" @deleteHandle="clearNumber"></delete-confi>

    <!-- vdcp设置轮询 -->
    <div class="winPpup" v-if="vdcpLxDataObj.vdcpLxFlag">
      <i
        class="el-icon-close"
        @click="vdcpLxDataObj.vdcpLxFlag = !vdcpLxDataObj.vdcpLxFlag"
      ></i>
      <el-form ref="form" label-width="70px">
        <el-form-item label="轮询间隔">
          <el-select v-model="vdcpLxDataObj.vdcpLxTimeVal">
            <el-option
              v-for="(item, index) in vdcpLxDataObj.vdcpLxTime"
              :key="index"
              :label="item"
              :value="item"
            ></el-option>
          </el-select>
          <span>秒</span>
        </el-form-item>
        <el-form-item label="轮询画面">
          <el-select v-model="vdcpLxDataObj.vdcpLxNumVal">
            <el-option
              v-for="(item, index) in vdcpLxDataObj.vdcpLxNum"
              :key="index"
              :label="item"
              :value="item"
            ></el-option>
          </el-select>
          <span>个</span>
        </el-form-item>
      </el-form>
      <el-button type="primary" @click="vdcpStartLx">启动轮询</el-button>
    </div>
    <!-- vdcp编辑模板名称弹窗 -->
    <editWindPupop
      @returnVal="returnVal"
      @closeEditWindPupopVis="closeEditWindPupopVis"
      v-if="editWindPupopVis"
    ></editWindPupop>
    <!-- vdcp编辑模板的弹窗 -->
    <editMettingTemplate
      ref="editMettingTemplates"
      v-show="editMettListData"
      @cancel="editMettListDataCancel"
      @affirm="editMettListDataAffirm"
    >
    </editMettingTemplate>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import { guid, start, reset } from "@/assets/js/common";
import dialPlate from "./dialPlate.vue";
import editWindPupop from "./editWindPupop.vue"; // 编辑模板名称弹窗
import editMettingTemplate from "./editMettingTemplate.vue"; // 编辑模板名称弹窗
import deleteConfi from "./deleteConfi";
import EL_rocker from "@/assets/js/rocker.js";
import Cookies from "js-cookie";
import axios from "axios";
import { setTimeout } from "timers";
//
export default {
  components: {
    dialPlate,
    deleteConfi,
    editWindPupop,
    editMettingTemplate
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
        height: ""
      },
      videoType: 1, // 当前选项值
      list1: [
        {
          name: "电话会议",
          label: "0"
        },
        {
          name: "视频会议",
          label: "1"
        },
        {
          name: "集群会议",
          label: "2"
        }
      ], // tab选项
      // viewVisble: true, // 广播开关
      // microphoneVisible: true, // 发言开关
      // talkBackVisble: true, // 集群开关
      // confStatus: true,
      isAddNumberShow: false, // 拨号入会弹窗
      devNum: "", // 摄像头编码
      timer: "", //定时器
      // vdcp项目
      vdcp: window.g.IsVDCPProject,
      setChairEleData: {},
      vdcpLxDataObj: {
        vdcpLxTime: [10, 20, 30, 40, 50, 60],
        vdcpLxNum: [1, 2, 4, 6, 8, 10],
        vdcpLxFlag: false,
        vdcpLxTimeVal: 10,
        vdcpLxNumVal: 1
      },
      // 轮询下标
      vdcpInd: 1,
      // vdcp项目的定时器
      vdcpInterVal: "",
      // 输入会议模板名弹窗
      editWindPupopVis: false,
      //编辑会议列表弹窗
      editMettListData: false,
      // confStatus:true
      agentLoginAckInterval: "",
      IsYangZhouProject: window.g.IsYangZhouProject, // 扬州项目
      rightDialog: "rightDialog",
    };
  },
  computed: {
    groupActiveText: function() {
      return this.groupActive ? "已抢权" : "已放权";
    },
    telephoneState: function() {
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
      meetingFunction: "getMeetingFunction" // 广播、发言、对讲状态
    })
  },

  watch: {
    // confStatus: function(newVal){
    //   this.videoList = []
    // },
    // 设置主会场
    /**
     * @Description: el
     * @Date: 2020-12-04 10:36:55
     * @param {*} newVal
     * @description:
     * @LastEditors: Seven
     * @LastEditTime: Do not edit
     */
    videoList(newVal, oldVal) {
      if (newVal && newVal.length != 0 && this.vdcp) {
        newVal.forEach(ele => {
          if (!ele.setChairObj && ele.numberType == "8") {
            ele.setChairFlag = false;
            ele.notActive = require("@/assets/icpImg/setChair1.png");
            ele.active = require("@/assets/icpImg/setChair.png");
          }
        });
      }
      if (
        newVal.length !== oldVal.length &&
        this.$store.state.confStatus &&
        this.$store.state.ConfBroadcastStatus
      ) {
        // 添加人员的时候查看是否为广播状态，调用一次广播
        this.ConfBoardCastMemberAll(0);
      }
      console.log(newVal);
    },
    /**
     * @Description: el
     * @Date: 2020-12-04 10:36:59
     * @param {*}
     * @description:
     * @LastEditors: hexinting
     * @LastEditTime: 2021年2月23日10:48:36
     */
    // 监听会议状态，发起设置主会场设置
    confStatus(newVal) {
      if (newVal) {
        let agentId = sessionStorage.getItem("agent_id");
        let confId = this.$store.state.confId;
        if (!this.setChairEleData.content) return;
        let chairSite = this.setChairEleData.content.call || "";
        if (!chairSite || chairSite === "") return;
        this.$icp19.ConfSetChair(agentId, confId, chairSite);
      }
    },
    // 更新会议类型，用于改变显示的联络网
    videoType: function(newVal) {
      this.$store.commit("setVideoType", newVal);
    },
    agent_id() {
      this.reConnectMeeting();
    }
  },
  mounted() {
    console.log(this.microphoneVisible);
    this.reConnectMeeting();
    var that = this;
    // setInterval(() => {
    //   console.log("that.videoList,that.confStatus",that.videoList,that.confStatus);
    //   console.log("that.videoType,that.videoList",that.videoType,that.videoList);
    //   // that.videoList.forEach(ele=>{
    //   //   ele.myState = 1
    //   // })
    //   // that.videoList[0].setChairFlag = true
    // }, 3000);
    if (!this.confStatus) {
      this.groupStatusClose();
    }

    // this.$store.commit("setIsLoadShow", false);
    // var that = this;
    // this.$bus.$on("clearNumber", function() {
    //   that.clearNumber();
    // });
    // this.$store.commit("SET_COMEMBER", []);
    // this.$store.commit("setConfStatus", true); //设置会议状态
  },
  methods: {
    OpenTemplat() {
      this.editMettListData = true;
      this.$refs.editMettingTemplates.reqMeetingListData();
      this.$refs.editMettingTemplates.allDataList = [];
    },
    reConnectMeeting() {
      this.agent_id = sessionStorage.getItem("agent_id"); // 写在mount里并不能更新坐席id
      const that = this;
      let agentLoginAckIntervalIndex = 0;
        // this.agentLoginAckInterval = window.setInterval(function() {
      if (sessionStorage.getItem("icpConnectSuccessful") == "true") {
        //   window.clearInterval(this.agentLoginAckInterval);

        that.$icp19.RequestConf(Number(that.agent_id)).then(res => {
          console.log("that.$icp19.RequestConf res", res);
          if (res.data.errorcode == 0 && that.myVdcConfId) {
            that.$icp19
              .RequestConfMember(Number(that.agent_id), that.myVdcConfId)
              .then(response => {
                console.log("that.$icp19.RequestConfMember response", response);
                console.log(
                  "sessionStorage.getItem('ConfMemberDetail')",
                  JSON.parse(sessionStorage.getItem("ConfMemberDetail"))
                );
                var videoNumber = [];

                axios
                  .post(
                    `${window.g.ApiUrl}/eos/communication/icp/getMeetingMemberList`,
                    {
                      agentId: String(that.agent_id),
                      meetingId: String(that.myVdcConfId)
                    }
                  )
                  .then(function(response) {
                    console.log(
                      "/eos/communication/icp/getMeetingMemberList会议成员列表查询接口response",
                      response
                    );
                    if (response.data.errorcode == 0) {
                      var a = JSON.parse(response.data.data);
                      console.log("JSON.parse(response.data)", a);
                      if (
                        a.meetingType != 0 &&
                        a.meetingType != 1 &&
                        a.meetingType != 2
                      ) {
                        return;
                      }
                      that.$store.commit(
                        "SET_COMEMBER",
                        JSON.parse(a.meetingJson)
                      );
                      that.videoType = a.meetingType;
                    }
                  })
                  .catch(function(error) {
                    console.log(
                      "/eos/communication/icp/getMeetingMemberList会议成员列表查询接口error",
                      error
                    );
                  });

                Promise.resolve(
                  (() => {
                    console.log(
                      "JSON.parse(sessionStorage.getItem('ConfMemberDetail')).number",
                      JSON.parse(sessionStorage.getItem("ConfMemberDetail"))
                        .number
                    );
                    JSON.parse(sessionStorage.getItem("ConfMemberDetail"))
                      .number.split(",")
                      .forEach(item => {
                        // if(item&&item!='null'){
                        videoNumber.push(item);
                        // }
                      });
                  })()
                ).then(() => {
                  that.$store.commit("SET_VIDEONUMBER", videoNumber);
                  if (
                    response.data.errorcode == 0 &&
                    that.videoNumber.length > 0
                  ) {
                    that.$icp19
                      .ConfReconnectSite(
                        that.agent_id,
                        that.myVdcConfId,
                        sessionStorage.getItem("seat")
                      )
                      .then(data => {
                        console.log("that.$icp19.ConfReconnectSite", data);
                        if (!data.data.errorcode == 0) {
                          that.$message.error(data.data.msg);
                        } else {
                          that.$store.commit("setConfStatus", true);
                          // author:xuchuangxing updateTime:2021/2/23 避免切换页面时清空重置了时长
                          if (!that.time == "00:00:00") {
                              start();
                          }
                        }
                      });
                  } else {
                    that.$message.error(response.data.msg);
                  }
                });
              });
          } else {
            // that.$message.error(res.data.msg)
          }
        });
      }

        //   agentLoginAckIntervalIndex += 1;
        //   agentLoginAckIntervalIndex == 300 &&
        //     window.clearInterval(this.agentLoginAckInterval);
        // }, 1000);
    },
    ...mapActions([
      "addAgentForList", // 会议列表添加坐席
      "removeAgentForList", // 会议列表移除坐席
      "groupStatusClose", // 集群会议 关闭/初始化
      "initBoardParams" // 初始化或设置广播参数
    ]),
    // 控制摄像机方向
    callBack(type) {
      console.log(type, this.devNum);
      let ptzCommand = 0;
      this.agent_id = sessionStorage.getItem("agent_id"); // 写在mount里并不能更新坐席id
      if (type.index == 1) {
        ptzCommand = 6;
      } else if (type.index == 2) {
        ptzCommand = 9;
      } else if (type.index == 3) {
        ptzCommand = 7;
      } else if (type.index == 4) {
        ptzCommand = 8;
      }
      switch (type.type) {
        case "mousedown":
          this.$icp19.ICPPTZDevice(
            this.agent_id,
            "",
            this.devNum,
            ptzCommand,
            5,
            5,
            0
          );
          break;
        case "mouseup":
          // 停止操作
          this.$icp19.ICPPTZDevice(
            this.agent_id,
            "",
            this.devNum,
            ptzCommand,
            5,
            5,
            1
          );
          break;
        default:
          break;
      }
    },
    magnifyNarrow(inpele) {
      this.agent_id = sessionStorage.getItem("agent_id"); // 写在mount里并不能更新坐席id
      const that = this;
      // 放大缩小
      inpele.addEventListener("change", function(val) {
        let value = this.value;
        if (this.getAttribute("oldValue")) {
          if (this.getAttribute("oldValue") > value) {
            // 缩小
            that.$icp19.ICPPTZDevice(
              that.agent_id,
              "",
              that.devNum,
              3,
              5,
              value,
              0
            );
            // 停止操作meiyou
            that.$icp19.ICPPTZDevice(
              that.agent_id,
              "",
              that.devNum,
              3,
              5,
              value,
              1
            );
          } else if (this.getAttribute("oldValue") < value) {
            // 放大
            that.$icp19.ICPPTZDevice(
              that.agent_id,
              "",
              that.devNum,
              2,
              5,
              value,
              0
            );
            // 停止操作meiyou
            that.$icp19.ICPPTZDevice(
              that.agent_id,
              "",
              that.devNum,
              2,
              5,
              value,
              1
            );
          }
        } else {
          // 放大
          that.$icp19.ICPPTZDevice(
            that.agent_id,
            "",
            that.devNum,
            2,
            5,
            value,
            0
          );
          // 停止操作meiyou
          that.$icp19.ICPPTZDevice(
            that.agent_id,
            "",
            that.devNum,
            2,
            5,
            value,
            1
          );
        }
        this.setAttribute("oldValue", value);
      });
    },
    // 旋转和聚焦
    rockerDom(ele, inpele, devNum) {
      this.devNum = devNum;
      const that = this;
      // 每个元素只能生成一个摇杆
      if (!ele.getAttribute("flag")) {
        // 生成摇杆
        let el = new EL_rocker(
          ele,
          "ulWrap" + devNum,
          that.callBack,
          "",
          {
            width: 100,
            height: 100
          },
          4,
          devNum
        );
        el.loading(); // 初始化
        this.magnifyNarrow(inpele);
        ele.setAttribute("flag", "1");
      }
    },
    // 获取监控
    getMonitoring(index) {
      console.log(index);
      let allMonitoringEle = Array.from(
        document.querySelectorAll(".rocker_rotate_wrap")
      );
      let allInputEle = document.querySelectorAll(".rocker_jjInput_wrap");
      if (
        allMonitoringEle.length == 0 ||
        !allMonitoringEle ||
        index >= allMonitoringEle.length
      ) {
        return;
      }
      this.rockerDom(
        allMonitoringEle[index],
        allInputEle[index],
        allMonitoringEle[index].getAttribute("data-index")
      );
    },
    // 全部功能禁用
    allFunctionProhibit() {
      let videoList = [...this.videoList];
      videoList.forEach((o, i) => {
        o.myVideo = false;
        o.myAuto = false;
      });
      // console.log('videoList: ', videoList);
      // this.microphoneVisible = false
      // this.viewVisble = false
      // this.talkBackVisble = false
      // this.$store.commit("SET_Speak", false);
      this.$store.commit("SET_Broadcast", false);
      this.$store.commit("SET_Talkback", false);
    },
    // 全部 发言/禁言
    OperateConfMemberAll(status) {
      // 3是true  2是false
      let videoList = [...this.videoList];
      if (videoList.length == 0) {
        return;
      }
      let phoneNum = "";
      let numberType = "";
      this.agent_id = sessionStorage.getItem("agent_id"); // 写在mount里并不能更新坐席id
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
            numberType += o.content.numType + ",";
          } else {
            phoneNum += o.content.call;
            numberType += o.content.numType;
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
            numberType,
            res => {}
          )
          .then(data => {
            if (data.data.errorcode == 0) {
              var myAutoFlag = false;
              if (status == 5) {
                this.$message.success("已发起会议成员禁言");
              } else if (status == 6) {
                this.$message.success("已发起会议成员发言");
              }
              videoList.forEach((o, i) => {
                if (status == 6) {
                  o.myAuto = true;
                  myAutoFlag = true;
                } else if (status == 5) {
                  o.myAuto = false;
                }
              });
              this.$store.commit("SET_Speak", myAutoFlag);
              this.$store.commit("SET_COMEMBER", videoList);
            }
          });
      }
    },
    // 全部 广播/禁播
    ConfBoardCastMemberAll(isCannel) {
      // 是否取消广播，0否，1取消
      let mixType = 16;
      let phoneNum = "";
      let videoList = [...this.videoList];
      this.agent_id = sessionStorage.getItem("agent_id"); // 写在mount里并不能更新坐席id
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
        } else if (5 <= this.videoList.length && this.videoList.length <= 6) {
          mixType = 6;
        } else if (7 <= this.videoList.length && this.videoList.length <= 9) {
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
          boardCasdIndex: -1
        });
        this.$icp19
          .ConfBoardCastMember(
            Number(this.agent_id),
            Number(this.myVdcConfId),
            mixType,
            phoneNum,
            isCannel,
            res => {}
          )
          .then(data => {
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
              /*
              ucs 返回的状态存在不确定性，可能比这个快，也可能比这个慢，
              当比这个慢的时候这时候状态就乱了
              所以不能在这个设置这个状态，在ucs那边设置就好了
            */
              // this.$store.commit("SET_Broadcast", !this.viewVisble);
            } else {
              this.$message.error("发起广播画面功能 失败");
              this.$store.dispatch("initBoardParams", {});
            }
          });
        this.$store.commit("setMixTypeNum", mixType);
      } else if (this.HWICP_Version == "HWICP-20.0") {
        let memberInfos = [];
        videoList.forEach((o, i) => {
          videoList;
          memberInfos[i] = {
            number: o.content.call
          };
        });
        if ((isCannel = 0)) {
          this.$icp.broadcastMixPicture(
            this.myVdcConfId,
            mixType,
            memberInfos,
            res => {}
          );
          videoList.forEach((o, i) => {
            o.myVideo = true;
          });
        }
        if ((isCannel = 1)) {
          this.$icp.cancelBroadcastMixPicture(
            this.myVdcConfId,
            memberInfos,
            res => {}
          );
          videoList.forEach((o, i) => {
            o.myVideo = false;
          });
          //this.$store.commit("SET_Broadcast", !this.viewVisble);
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
        this.agent_id = sessionStorage.getItem("agent_id"); // 写在mount里并不能更新坐席id
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
              .then(res => {
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
              .then(res => {
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
        this.agent_id = sessionStorage.getItem("agent_id"); // 写在mount里并不能更新坐席id
        parmas = [
          Number(this.agent_id),
          Number(this.myVdcConfId),
          0,
          this.videoList[index].myAuto ? 2 : 3,
          this.videoList[index].content.call.toString(),
          this.videoList[index].content.numType.toString()
          // res => {
          // }
        ];

        this.$icp19.OperateConfMemberEx(...parmas).then(data => {
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
          type: "warning"
        }).then(() => {
          this.Decentralization(index);
        });
      } else {
        this.$confirm("是否进行抢权操作", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          this.agent_id = sessionStorage.getItem("agent_id"); // 写在mount里并不能更新坐席id
          this.$icp19
            .TalkingGroupPTT(this.agent_id, this.currentGroupName, index)
            .then(data => {
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
      this.agent_id = sessionStorage.getItem("agent_id"); // 写在mount里并不能更新坐席id
      this.$icp19
        .TalkingGroupPTT(this.agent_id, this.currentGroupName, index)
        .then(data => {
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
      // this.$confirm("确认结束会议？", {
      //   confirmButtonText: "确定",
      //   cancelButtonText: "取消",
      //   type: "warning"
      // })
      //   .then(() => {
      this.agent_id = sessionStorage.getItem("agent_id"); // 写在mount里并不能更新坐席id
      let self = this;
      if (self.HWICP_Version == "HWICP-20.0") {
        self.$icp.endConf(self.myVdcConfId);

        self.endMessing();
        deleteMeetingMemberList();
      } else if (self.HWICP_Version == "HWICP-19.0") {
        self.$icp19
          .DeleteConf(Number(self.agent_id), Number(self.myVdcConfId))
          .then(data => {
            if (data.data.errorcode == 0) {
              this.$message.success("已发起删除会议！");
              reset();
              self.endMessing();
              deleteMeetingMemberList();
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
            confId: self.myVdcConfId
          })
          .then(res => {
            if (res.result === 0) {
              self.$message.success("已结束会议！");
              deleteMeetingMemberList();

              self.endMessing();
            } else {
            }
          });
      }

      function deleteMeetingMemberList() {
        axios
          .post(
            `${window.g.ApiUrl}/eos/communication/icp/deleteMeetingMemberList`,
            {
              agentId: String(self.agent_id),
              meetingId: sessionStorage.getItem("confId") || self.myVdcConfId
            }
          )
          .then(function(response) {
            console.log(
              "/eos/communication/icp/deleteMeetingMemberList会议成员列表删除接口response",
              response
            );
          })
          .catch(function(error) {
            console.log(
              "/eos/communication/icp/deleteMeetingMemberList会议成员列表删除接口error",
              error
            );
          });
      }
      // this.$store.commit("SET_COMEMBER", videoList);
      // this.removeAgentForList();
      // })
      // .catch(() => {
      //   this.$message({
      //     type: "info",
      //     message: "取消结束会议"
      //   });
      // });
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
    /**
     * @param {*}
     * @description: 发起会议
     * @LastEditors: hexinting
     * @LastEditTime: 2021年2月23日10:48:36
     */
    openMeeting() {
      if (this.isShowWind || this.confStatus) {
        this.$message({
          message: "正在通话中",
          type: "warning"
        });
        return;
      }
      if (this.videoList.length == 0) {
        this.$message({
          message: "请添加会议成员！",
          type: "warning"
        });
        return;
      }
      this.$confirm("确认启动会议？", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.agent_id = sessionStorage.getItem("agent_id"); // 写在mount里并不能更新坐席id

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
                  h265: "false"
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
                if (self.confStatus) self.allFunctionProhibit();
              }, 100);
              this.$store.commit("setConfStatus", true); //设置会议状态
              setTimeout(() => {
                setMeetingMemberList();
              }, 3000);

              break;

            case "HWICP-19.0":
              console.log(this.videoType, self.videoList);
              // sessionStorage.getItem("seat")

              if (this.videoType != "2") {
                let memberNum = "";
                let numType = "";
                for (let index = 0; index < self.videoList.length; index++) {
                  if (index != self.videoList.length - 1) {
                    memberNum =
                      memberNum +
                      self.videoList[index].content.call +
                      "|*|" +
                      (self.videoList[index].content.name
                        ? self.videoList[index].content.name
                        : "未知") +
                      ",";
                    if (
                      self.videoType == "0" &&
                      self.videoList[index].content.numType == "8"
                    ) {
                      numType = numType + "1,";
                    } else {
                      numType =
                        (numType + self.videoList[index].content.numType ||
                          (this.videoType != 1 ? 1 : 8)) + ",";
                    }
                  } else {
                    memberNum =
                      memberNum +
                      self.videoList[index].content.call +
                      "|*|" +
                      (self.videoList[index].content.name
                        ? self.videoList[index].content.name
                        : "未知");
                    numType =
                      numType + self.videoList[index].content.numType ||
                      (this.videoType != 1 ? 1 : 8);
                  }
                }

                if (self.videoType == "0") {
                  numType = numType + ",1";
                } else if (self.videoType == "1") {
                  // numType = numType + ",8"; // 注释原因：发起视频会议时候numType传多了个8
                  numType = numType;
                }
                // console.log(sessionStorage.getItem("seat"));
                if (window.g.IsOpenLabProject) {
                  // 在会议列表中添加坐席
                  // let agentCode = sessionStorage.getItem("seat")
                  // memberNum+=(','+agentCode+'|*|坐席')
                  // let meetingArrData = JSON.parse(JSON.stringify(self.$store.state.ConfMemberStatus1))
                  // let agentCodeFlag = meetingArrData.reduce((pre,ele) => {
                  //   if(ele.indexCode == agentCode){
                  //     pre = ele
                  //   }
                  //   return pre
                  // },'')
                  // if (!agentCodeFlag) {
                  //   meetingArrData.push({
                  //     agentCode:agentCode,
                  //     name:agentCode,
                  //     indexCode:agentCode,
                  //     content: {
                  //       call: agentCode,
                  //       meetingType: "2",
                  //       name: agentCode,
                  //       numType: "8"
                  //     },
                  //     meetingType: "2",
                  //     numberType: "8"
                  //   })
                  //   self.$store.commit("SET_COMEMBER", meetingArrData); //加入坐席号码
                  // }
                  // 在会议列表中添加坐席
                  this.addAgentForList().then(res => {
                    console.log("添加坐席");
                  });
                }
                this.$icp19
                  .CreateConfEx(
                    Number(self.agent_id),
                    memberNum,
                    numType,
                    function(res) {
                      // console.log(res);
                    }
                  )
                  .then(data => {
                    if (data.data.errorcode == 0) {
                      this.$message.success("已发起创建会议！");
                      start();
                      // typeof call==='function'&&call(data)
                      //router.push({path: '/icpVideo'});
                      sessionStorage.setItem("videoListMemberNum", memberNum);
                      sessionStorage.setItem("videoListNumType", numType);
                      this.$store.commit("setConfStatus", true); //设置会议状态

                      this.allFunctionProhibit();
                      setTimeout(() => {
                        setMeetingMemberList();
                      }, 3000);
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
                  item =>
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
                        .then(data => {
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
                                v => v.content.name != "当前坐席"
                              );
                              joinMember = joinMember.filter(
                                v =>
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

                                    res => {}
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
                            setTimeout(() => {
                              setMeetingMemberList();
                            }, 3000);
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
                sites: []
              };
              self.videoList.forEach(o => {
                formData.sites.push({
                  name: o.content.name,
                  uri: o.content.call,
                  type: 1
                });
              });

              self.$api.vdcCreateConf(formData).then(res => {
                if (res.result === 0) {
                  this.$store.commit("SET_CONFID", res.data.confId || ""); //设置会议ID
                  this.$message.success("已发起创建会议！");
                  this.$store.commit("setConfStatus", true); //设置会议状态
                  // console.log(this.confStatus);
                  setTimeout(() => {
                    if (this.confStatus) this.allFunctionProhibit();
                  }, 100);
                  setTimeout(() => {
                    setMeetingMemberList();
                  }, 3000);
                } else {
                }
              });
          }

          function setMeetingMemberList() {
            axios
              .post(
                `${window.g.ApiUrl}/eos/communication/icp/setMeetingMemberList`,
                {
                  meetingJson: JSON.stringify(self.videoList),
                  agentId: String(self.agent_id),
                  meetingId: String(self.myVdcConfId),
                  meetingType: self.videoType // lastEditor:xuchuangxing 0:电话会议 1:视频会议 2:集群会议 3:视频点名 区分会议保护的哪种类型会议，重启相对应的会议
                }
              )
              .then(function(response) {
                sessionStorage.setItem("confId", self.myVdcConfId);
                console.log(
                  "/eos/communication/icp/setMeetingMemberList会议成员列表存储结果response",
                  response
                );
              })
              .catch(function(error) {
                console.log(
                  "/eos/communication/icp/setMeetingMemberList会议成员列表存储结果error",
                  error
                );
              });
          }
        })
        .catch(e => {
          console.log("catch e", e);
          this.$message({
            type: "info",
            message: "取消召开会议"
          });
        });
    },
    myDelete(index) {
      let videoList = [...this.videoList],
        videoNumber = [...this.videoNumber];
      this.agent_id = sessionStorage.getItem("agent_id"); // 写在mount里并不能更新坐席id
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
            h265: "false"
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
            res => {}
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
      this.agent_id = sessionStorage.getItem("agent_id"); // 写在mount里并不能更新坐席id
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
              h265: "false"
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
              res => {}
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
          number: data.phoneNumber
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
      this.agent_id = sessionStorage.getItem("agent_id"); // 写在mount里并不能更新坐席id
      phoneData = [...new Set(phoneData)];
      phoneData = phoneData.filter(x =>
        videoList.every(y => x != y.content.call)
      );
      if (this.HWICP_Version == "HWICP-19.0") {
        phoneData.map(v => {
          let data = {
            number: v
          };
          this.$api.findDeviceByNumber(data).then(res => {
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

                    res => {}
                  )
                  .then(res => {
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
                numType: ""
              };
              // console.log('res.data: ', detailData);
              videoList.push(detailData);
              this.videoNumber.push(v);
              this.$store.commit("SET_COMEMBER", videoList); //成员
              this.$store.commit("SET_VIDEONUMBER", this.videoNumber); //成员号码数组用来判断是否已经添加了的
              this.isAddNumberShow = false;
              if (successConf) this.$message.success("已发起加入会议！");
              if (error) this.$message.error(error);
            } else {
              error = res.msg;
            }
          });
          // console.log('videoList: ', videoList);
        });
      }
    },
    // 重新呼叫
    reConnect(number) {
      let num = number;
      if (typeof number == "object") {
        num = number.call;
      }
      this.agent_id = sessionStorage.getItem("agent_id"); // 写在mount里并不能更新坐席id
      this.$icp19
        .ConfReconnectSite(this.agent_id, this.myVdcConfId, String(num))
        .then(data => {
          console.log("data: ", data);
          if (data.data.errorcode == 0) {
            this.$message.success("已发起重呼");
          } else {
            this.$message.error("重呼失败，请稍等片刻重试");
          }
        });
    },
    /**
     * @Description: el
     * @Date: 2020-12-04 10:36:11
     * @param {*}
     * @description:
     * @LastEditors: Seven
     * @LastEditTime: Do not edit
     */
    // 设置主会场
    setChairFun(item) {
      let data = this.videoList;
      if (data && data.length != 0) {
        data.forEach(ele => {
          ele.setChairFlag = false;
        });
        item.setChairFlag = true;
      }
      this.setChairEleData = item;
    },
    /**
     * @Description: el
     * @Date: 2020-12-04 10:36:14
     * @param {*}
     * @description:
     * @LastEditors: Seven
     * @LastEditTime: Do not edit
     */
    // 启动轮询
    vdcpStartLx() {
      const that = this;
      let vdcpLxdata = this.vdcpLxDataObj;
      // console.log(vdcpLxdata.vdcpLxTimeVal,vdcpLxdata.vdcpLxNumVal);
      // 清除定时器
      if (this.vdcpInterVal) {
        clearInterval(this.vdcpInterVal);
        this.vdcpInterVal = null;
        this.vdcpInterVal = "";
      }
      this.vdcpInterVal = setInterval(() => {
        let agentId = sessionStorage.getItem("agent_id");
        let confId = that.$store.state.confId;
        let data = that.vdcpLxDataObj; // 轮询的时间和个数
        let num = Number(data.vdcpLxNumVal); // 每次轮询个数
        let videoList = that.videoList;
        // pre //为初始值 []
        let arr = videoList.reduce((pre, ele, index) => {
          // 轮询标识为空 或者 它的标识和轮播的标识不一致时
          if (!ele.vdcpLx || ele.vdcpLx != that.vdcpInd) {
            ele.vdcpLx = that.vdcpInd;
            pre.push(ele);
          }
          return pre;
        }, []);
        if (arr.length == 0) {
          return;
        }
        // 如果缺少则补齐空位 或者 某轮顺利完成时 进行下次轮询
        if (arr.length <= num && videoList.length > num) {
          that.vdcpInd += 1;
          videoList.forEach((ele, index) => {
            if (num - arr.length < index) {
              ele.vdcpLx = that.vdcpInd;
              arr.push(ele);
            }
          });
        }
        // 处理人员号码
        let phoneNum = "";
        arr.forEach((ele, ind) => {
          // 如果arr.length 大于 轮询个数时只取 轮询个数的数据
          if (ind < num) {
            phoneNum += ele.content.call + ",";
          }
        });
        phoneNum = phoneNum.substring(0, phoneNum.length - 1);
        that.$icp19.ConfBoardCastMember(agentId, confId, num, phoneNum, 0);
      }, vdcpLxdata.vdcpLxTimeVal * 1000);
      // 关闭小弹窗
      this.vdcpLxDataObj.vdcpLxFlag = !this.vdcpLxDataObj.vdcpLxFlag;
    },
    /**
     * @Description: el
     * @Date: 2020-12-04 10:36:16
     * @param {*}
     * @description: 退出轮询
     * @LastEditors: Seven
     * @LastEditTime: Do not edit
     */
    outVdcpStartLx() {
      // 清除定时器
      if (this.vdcpInterVal) {
        clearInterval(this.vdcpInterVal);
        this.vdcpInterVal = null;
        this.vdcpInterVal = "";
      }
    },
    /**
     * @Description: el
     * @Date: 2020-12-05 16:34:43
     * @param {*} val
     * @description: 获取到弹窗的值,添加会议模板
     * @LastEditors: Seven
     * @LastEditTime: Do not edit
     */
    returnVal(val) {
      // 拿到模板名称
      let members = this.videoList.reduce((pre, ele, index) => {
        let obj = {};
        obj.order = index;
        obj.memberId = String(ele.id);
        obj.memberType = ele.meetingType;
        pre.push(obj);
        return pre;
      }, []);
      let data = {
        members,
        data: {
          name: val
        }
      };
      this.$api.vdcpMeetingAdd(data).then(res => {
        console.log(res.data);
        if (res.errorcode !== 0) {
          return;
        }
      });
      this.closeEditWindPupopVis();
    },
    /**
     * @Description: el
     * @Date: 2020-12-05 16:35:01
     * @param {*}
     * @description: 关闭弹窗
     * @LastEditors: Seven
     * @LastEditTime: Do not edit
     */
    closeEditWindPupopVis() {
      this.editWindPupopVis = false;
    },
    /**
     * @Description: el
     * @Date: 2020-12-05 16:35:07
     * @param {*}
     * @description: 编辑模板取消
     * @LastEditors: Seven
     * @LastEditTime: Do not edit
     */
    editMettListDataCancel() {
      this.editMettListData = false;
    },
    /**
     * @Description: el
     * @Date: 2020-12-05 16:35:12
     * @param {*}
     * @description: 编辑模板确认
     * @LastEditors: Seven
     * @LastEditTime: Do not edit
     */
    editMettListDataAffirm(data) {
      this.editMettListData = false;
      this.$store.commit("SET_COMEMBER", data);
      this.videoList = data;
      this.openMeeting();
    }
  },
  destroyed() {
    // window.clearInterval(this.agentLoginAckInterval);
  }
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
  position: relative;
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
  display: flex;
  justify-content: space-between;
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
  display: flex;
  align-items: center;
}
.my-fax-list1-left-box_rocker_wrap {
  position: absolute;
  display: none;
  width: 236px;
  height: 173px;
  background: rgba(255, 255, 255, 1);
  box-shadow: 0px 4px 42px 4px rgba(154, 176, 209, 0.31);
  border-radius: 6px;
  top: 70%;
  z-index: 99;
  left: 0px;
}
.rocker_wrap > div {
  top: 25px;
  left: 38px;
  position: absolute;
}
.rocker_wrap > span {
  bottom: 13px;
  left: 70px;
  position: absolute;
  font-size: 14px;
  font-weight: 500;
  color: rgba(102, 102, 102, 1);
}
.rocker_jj_wrap span {
  position: absolute;
  right: 30px;
  bottom: 13px;
  font-size: 14px;
  font-weight: 500;
  color: rgba(102, 102, 102, 1);
}
.my-fax-list1-left-box_rocker_wrap input {
  transform: rotate(-90deg);
  position: absolute;
  right: -13px;
  -webkit-appearance: none;
  max-width: 350px;
  width: 50%;
  height: 5px;
  border-radius: 5px;
  background: #d8d8d8;
  outline: none;
  bottom: 96px;
}
.my-fax-list1-left-box_rocker_wrap input::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #fff;
  background: rgba(255, 255, 255, 1);
  box-shadow: 0px 0px 2px 0px rgba(73, 73, 74, 0.35);
  cursor: pointer;
}

.my-fax-list1-left-box_rocker_wrap input::-moz-range-thumb {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #fff;
  background: rgba(255, 255, 255, 1);
  box-shadow: 0px 0px 2px 0px rgba(73, 73, 74, 0.35);
  cursor: pointer;
}
.my_fax_list1_left_box_hover > img {
  width: 15px;
  height: 15px;
  cursor: pointer;
}
.my_fax_list1_left_box_hover > img:hover + .my-fax-list1-left-box_rocker_wrap,
.my-fax-list1-left-box_rocker_wrap:hover {
  display: flex;
}
.my-fax-list1-right {
  margin-left: 10px;
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
.rightDialog>>> [role="dialog"] {
  margin: auto !important;
  position: fixed;
  top: 85%;
  left: 93.5%;
  transform: translate(-50%, -50%);
}
  
.setChair {
  float: right;
  width: 20px;
  margin-top: 7px;
  margin-right: 5px;
  cursor: pointer;
}
.vdcpMettingHandleWrap {
  display: flex;
  justify-content: space-between;
  padding: 0 11px;
  box-sizing: border-box;
}
.saveMettingTemplate {
  font-size: 14px;
  font-weight: 400;
  color: #0091ff;
  margin-right: 11px;
  cursor: pointer;
}
.winPpup {
  position: absolute;
  top: 120px;
  left: 150px;
  border: 1px solid #d7d7d7;
  background: #fff;
  border-radius: 5px;
  padding: 0px 0px 30px 15px;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  i {
    margin-bottom: 5px;
  }
  .el-form {
    overflow: hidden;
    margin-right: 15px;
  }
  button {
    margin: auto;
    display: block;
  }
  span {
    margin-left: 5px;
  }
}
</style>
