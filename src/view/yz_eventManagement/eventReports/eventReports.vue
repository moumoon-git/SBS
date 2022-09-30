<!--@author：yf-->
<template>
  <el-row>
    <el-col :span="12">
      <!--      <div class="eventTitle"-->
      <!--      >-->
      <!--        <div style="-->
      <!--        width: 100%;height:100%;background: url(/static/img/loveRecord.png) 3% 52% no-repeat;-->
      <!--        background-size: 20px 16px">值班要情记录-->
      <!--        </div>-->
      <!--        <i @click="cutRush" style=" position: absolute;top: 30px;right: 10px;cursor: pointer" class="el-icon-refresh">-->
      <!--          <span style="font-size: 12px;vertical-align: 3px;">{{cutType}}</span>-->
      <!--        </i>-->
      <!--      </div>-->
      <div class="new-event-title-tab">
        <div class="title">
          <img src="/static/img/loveRecord.png" alt />
          <span>值班要情记录</span>
        </div>
        <div class="operation">
          <span class="operation-title">切换事件</span>
          <el-popover
            placement="bottom"
            v-model="visible"
            popper-class="eventOptions"
          >
            <div class="eventSearch">
              <el-input
                v-model="searchText"
                placeholder="请输入关键字"
                size="small"
              >
                <i
                  slot="suffix"
                  class="el-input__icon el-icon-search"
                  @click="searchEvent"
                ></i>
              </el-input>
            </div>
            <!-- <div class="recentOptions">
                <div class="recentTitle">近期选择：</div>
                <ul class="recentList">
                  <li class="eachRecent">08.27天河区自然灾害</li>
                </ul>
              </div> -->
            <template v-if="eventOptions.length > 0">
              <ul class="eventList">
                <li
                  v-for="item in eventOptions"
                  :key="item.id"
                  class="evenyEvent"
                  @click="switchEvent(item.id)"
                  :style="selectEventStyle(item.id)"
                >
                  {{ item.title }}
                </li>
                <div class="loadMore">
                  <el-button
                    round
                    icon="iconfont icon-loadMore"
                    size="mini"
                    @click="loadMoreHandle"
                    v-if="loadMore"
                    >加载更多</el-button
                  >
                  <div v-else>暂无更多数据</div>
                </div>
              </ul>
            </template>
            <template v-else>
              <div style="text-align: center; margin-top: 10px">暂无数据</div>
            </template>

            <el-input
              slot="reference"
              v-model="selectEvent"
              readonly
              placeholder="请选择"
            ></el-input>
          </el-popover>
          <el-button type="primary" @click="addEvent" style="margin-left: 5px"
            >新增事件</el-button
          >
          <!-- bug：6844 需求说要去除 author：hexinting -->
          <!-- <el-button icon="el-icon-sort" circle size="mini" class="change-btn" @click="cutRush"></el-button> -->
        </div>
      </div>
      <!--实现点击切换至接报信息-->
      <nav-bar
        style="background-color: #f9fbff"
        v-show="cutPageDoll"
        ref="navBar"
        :selectedName="selectedName"
        :navBarList="navBarList"
        class="narBar"
        @changTab="changTab"
      ></nav-bar>

      <div
        :style="eventLeft"
        style="
          margin: 0 15px 0 20px;
          height: 720px;
          background-color: white;
          overflow-y: auto;
        "
      >
        <el-scrollbar style="height: 100%">
          <!--实现点击切换至接报信息-->
          <cut-page ref="cutPage" v-show="cutPageRush"></cut-page>
          <div v-show="cutPageDoll">
            <event-back v-if="selectedName == '事件续报'"></event-back>
            <event-contact
              v-show="selectedName == '事件联系人'"
              ref="eventContact"
              @closeContact="closeContact"
            ></event-contact>
            <extend-information
              v-if="selectedName == '扩展信息'"
            ></extend-information>
            <criminal-history
              v-if="selectedName == '接报历史'"
              @refreshEvent="refreshEvent"
            ></criminal-history>
            <operating-record
              ref="operatingRecord"
              v-if="selectedName == '操作记录'"
            ></operating-record>

            <overall-situation
              @emitPath="emitPath"
              @getAll="getAll"
              @saveSuccess="saveSuccess"
              @addType="addType"
              @typeAddAll="typeAddAll"
              @saveError="saveError"
              ref="overallSituation"
              v-if="selectedName == '事件接报'"
              @refreshEvent="refreshEvent"
              @delectReape="delectReape"
              @setId="setId"
              @oneKeyCheck="oneKeyCheck"
              @oneKeySubmission="oneKeySubmission"
              @updateNewID="updateNewID"
              @updateReportForm="updateReportForm"
            ></overall-situation>
            <test-specification
              v-if="selectedName == '信息核实说明'"
            ></test-specification>
            <small-mobile-platform
              v-if="selectedName == '小型移动平台信息'"
            ></small-mobile-platform>
          </div>
        </el-scrollbar>
      </div>
    </el-col>
    <el-col :span="12">
      <div class="eventTitle">
        <div
          style="
            width: 100%;
            height: 100%;
            background: url(/static/img/loveRecord.png) 3% 52% no-repeat;
            background-size: 20px 16px;
          "
        >
          值班要情管理
        </div>
      </div>

      <div style="background-color: white; margin: 0 15px 0 20px">
        <el-steps :active="active" simple ref="steps">
          <el-step
            v-for="(item, index) in items"
            :title="item.title"
            :key="item.index"
            icon="el-icon-more"
            style="cursor: pointer"
            @click.native="actives(index, item.title)"
          ></el-step>
        </el-steps>

        <div
          :style="eventRight"
          style="
            background-color: white;
            overflow: auto;
            position: relative;
            height: 720px;
            padding: 0 20px;
          "
          v-if="tests"
        >
          <el-scrollbar style="height: 100%; background-color: white" caonima>
            <information-to-verify
              v-if="active == '0'"
              ref="informationToVerify"
              @closeContact="closeContact"
              @setClick="setClick"
              @serMapArttr="serMapArttr"
              @repeal="repeal"
            ></information-to-verify>
            <truth-initial
              v-if="active == '1'"
              ref="truthInitial"
            ></truth-initial>
            <submission-review
              v-if="active == '2' && (isYangZhou || isZengCheng)"
              ref="messageSubmission"
              @setClick="setClick"
              @closeContact="closeContact"
            ></submission-review>
            <message-submission
              v-else-if="active == '2'"
              ref="messageSubmission"
              @setClick="setClick"
              @closeContact="closeContact"
            ></message-submission>
            <lead-conductor
              v-if="active == '3'"
              ref="leadConductor"
              @skipInstructConvey="skipInstructConvey"
            ></lead-conductor>
            <!--这里改为v-show是因为做完了才发现v-if不到$refs的-->
            <instruct-convey
              v-show="active == '4'"
              ref="instructConvey"
            ></instruct-convey>
            <!--            <condition-top v-show="active=='4'" ref="conditionTop"></condition-top>-->
            <!--            <start-plan v-show="active=='6'" ref="startPlan"></start-plan>-->
            <condition-collect
              v-show="active == '5'"
              ref="conditionCollect"
            ></condition-collect>
            <!-- authorName qinjiaqi -->
            <!-- 当扬州为真时该处被隐藏
            <div v-show="!isYangZhou" style="width: 200px;margin:10px auto;" >
                <el-button 
                    :class="{'end-style':isEnd, 'not-end-style':!isEnd}" 
                    @click="endEvent"
                    :disabled="isEnd ? true : false"
                    type="info"
                    id="end_event_btn"
                >{{endBtnTitle}}</el-button>
            </div>-->
          </el-scrollbar>
        </div>
      </div>
    </el-col>

    <el-dialog
      :show-close="false"
      :close-on-click-modal="false"
      :visible.sync="dialogVisible"
      :close-on-press-escape="false"
      top="350px"
      width="400px"
    >
      <div
        style="width: 90%; text-align: left; margin: 0 auto; font-size: 16px"
      >
        发现您还有未保存修改的内容，是否保存？
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="noSaave" size="mini">不保存</el-button>
        <el-button @click="offSave" size="mini">取消</el-button>
        <el-button type="primary" @click="yesSave" size="mini">保存</el-button>
      </span>
    </el-dialog>
  </el-row>
</template>

<script>
import navBar from "@/yz_components/menu/navBar";
import eventBack from "@/view/yz_eventManagement/eventReports/Page/eventBack";
import criminalHistory from "@/view/yz_eventManagement/eventReports/Page/criminalHistory";
import eventContact from "@/view/yz_eventManagement/eventReports/Page/eventContact";
import extendInformation from "@/view/yz_eventManagement/eventReports/Page/extendInformation";
import operatingRecord from "@/view/yz_eventManagement/eventReports/Page/operatingRecord";
import overallSituation from "@/view/yz_eventManagement/eventReports/Page/overallSituation";
import smallMobilePlatform from "@/view/yz_eventManagement/eventReports/Page/smallMobilePlatform";
import testSpecification from "@/view/yz_eventManagement/eventReports/Page/testSpecification";

import informationToVerify from "@/view/yz_eventManagement/eventReports/Page/affectionHandle/informationToVerify";
import truthInitial from "@/view/yz_eventManagement/eventReports/Page/affectionHandle/truthInitial";
import messageSubmission from "@/view/yz_eventManagement/eventReports/Page/affectionHandle/messageSubmission";
import submissionReview from "@/view/yz_eventManagement/eventReports/Page/affectionHandle/SubmissionReview";
import leadConductor from "@/view/yz_eventManagement/eventReports/Page/affectionHandle/leadConductor";
import instructConvey from "@/view/yz_eventManagement/eventReports/Page/affectionHandle/instructConvey";
import conditionTop from "@/view/yz_eventManagement/eventReports/Page/affectionHandle/conditionTop";
import startPlan from "@/view/yz_eventManagement/eventReports/Page/affectionHandle/startPlan";
import conditionCollect from "@/view/yz_eventManagement/eventReports/Page/affectionHandle/conditionCollect";

import cutPage from "@/view/yz_eventManagement/eventReports/Plan/cutPage"; //切换的事件处置的页面

export default {
  name: "eventReports",
  components: {
    navBar,
    eventBack,
    criminalHistory,
    eventContact,
    extendInformation,
    operatingRecord,
    overallSituation,
    smallMobilePlatform,
    testSpecification,
    informationToVerify,
    truthInitial,
    messageSubmission,
    submissionReview, // 信息报送（石景山）
    leadConductor,
    instructConvey,
    conditionTop,
    startPlan,
    conditionCollect,
    cutPage,
  },
  inject: ["reload"],
  data() {
    return {
      isUpdateReportForm: false, // 是否更新事件接报表单 false 没更新，true 更新
      selectedName: "事件接报", //默认选中导航条
      navBarList: [
        {
          name: "事件接报",
        },
        {
          name: "事件续报",
        },
        {
          name: "扩展信息",
        },

        // {
        //   name: "信息核实说明"
        // },
        {
          name: "接报历史",
        },
        {
          name: "操作记录",
        },
      ], //导航条模块
      active: 0,
      items: [
        {
          title: "信息核实",
        },
        {
          title: "智能初判",
        },
        {
          title: "信息报送",
        },
        {
          title: "领导指示",
        },

        // {
        //   title: "事件上报",
        // },
        {
          title: "指令传达",
        },
        // {
        //   title: "应急响应",
        // },
        {
          title: "情况汇总",
        },
      ],
      overShow: false, //

      tests: true, //监听数据变化控制数据刷新
      typeTab: "",

      judge: true, //确认保存用来判断是否填写完内容控制跳转

      roulformDataAll: [], //数据库返回的第一次数据
      newFormDataAll: [], //新的数据

      oldlParam: [], //数据库返回的参数数据
      newlparam: [], //新的数据参数

      dialogVisible: false, //弹窗
      stateOfPreservation: 1, //保存状态

      storeNewState: "保存", //判断新增还是保存
      stort: false,

      leftRefresh: true,
      eventID: "",
      // smsContentData:''
      selectEventId: "",
      eventLeft: {
        height: "",
      },
      eventRight: {
        height: "",
      },
      cutType: "切换至接报信息页面", //页面切换
      cutPageDoll: true, //默认显示要情接报页面
      cutPageRush: false, //默认隐藏接报信息页面
      selectEvent: null,
      eventOptions: [],
      isYangZhou: window.g.IsYangZhouProject, // 是否扬州项目
      isZengCheng: window.g.IsZengChengProject, // 是否增城项目
      eventStatus: 0, //监听当前事件的eventStatus，可能取值为0，1，2
      isEnd: false, //监听eventStatus来改变按钮
      endBtnTitle: "事件完结", //按钮的文本
      visible: false,
      currentPage: 1, // 事件列表页码
      searchText: "", // 事件列表搜索关键字
      loadMore: true, // 是否有更多事件数据
    };
  },
  created() {
    window.addEventListener("resize", this.getHeight);
    this.getHeight();
    this.listenBtn();

    // 扬州项目需求-屏蔽扩展信息
    if (this.isYangZhou) {
      this.navBarList.splice(2, 1);
    }
  },
  destroyed() {
    window.removeEventListener("resize", this.getHeight);
  },
  computed: {
    nowDate() {
      return JSON.parse(JSON.stringify(this.$store.getters.getSituation));
    },
    parment() {
      return JSON.parse(JSON.stringify(this.$store.getters.getParam));
    },
    selectEventStyle() {
      return function (eventId) {
        if (this.selectEventId == eventId) {
          return "color:#0091ff;background-color:rgba(0, 145, 255, .1);";
        } else {
          return "";
        }
      };
    },
  },
  watch: {
    /*
     * @Author: qinjiaqi
     * @Date: 2020-09-30
     * @param {Int->String} 事件id，获取并更新后变成标题字符串
     * @return {type} undefined
     * @description：监听选择事件是否发生变化，变化就获取新事件的标题
     */
    selectEvent: {
      handler(val) {
        this.selectEvent = sessionStorage.getItem("eventTitle");
      },
      deep: true,
    },
    nowDate: {
      handler(val) {
        console.log("------------getSituation---nowDate---------------", val);
        this.comparison(val);
      },
      deep: true,
    },
    parment: {
      handler(val) {
        // console.log("------------getParam---parment---------------", val);
        if (val == "" || val == undefined || val == null) {
          return;
        }
        this.comparParam(val);
      },
      deep: true,
    },
    stateOfPreservation: {
      handler(newL, oldV) {
        console.log(
          "---------------stateOfPreservation------------------",
          newL
        );
        // console.log(newL, oldV);
        if (newL === 1 && this.storeNewState == "新增") {
          this.$refs.navBar.activeName = "事件接报";
          return;
        }
        if (newL !== 1 && this.storeNewState == "保存") {
          this.selectedName = this.typeTab;
        } else if (newL === 1 && this.storeNewState !== "保存") {
          this.$refs.navBar.activeName = "事件接报";
        } else if (newL === 0 && oldV === 1 && this.storeNewState === "保存") {
          this.selectedName = this.typeTab;
        } else if (newL === 1 && oldV === 0 && this.storeNewState === "保存") {
          this.selectedName = this.typeTab;
        } else if (newL === 1 && oldV === 1 && this.storeNewState === "保存") {
          this.$refs.navBar.activeName = "事件接报";
        } else {
          this.selectedName = this.typeTab;
        }
      },
      deep: true,
    },
    storeNewState: {
      handler(newL) {
        console.log("---------------newL------------------", newL);
        if (newL == "新增") {
          this.storeNewState = newL;
        }
      },
      deep: true,
    },
  },
  mounted() {
    // this.getPlant()
    this.initEvent();
  },
  methods: {
    /**
     * @param {boolean} isUpdate 是否更新
     * @author hexinting
     * @date 2020-9-17
     * @description 是否更新了事件接报表单
     */
    updateReportForm(isUpdate) {
      this.isUpdateReportForm = isUpdate;
      console.log("**********是否更新了事件接报表单********", isUpdate);
    },
    /**
     * @author qinjiaqi
     * @param {type} 没有
     * @return {type} undefined
     * @description：监听当前展示事件是否完结
     */
    listenBtn() {
      let eventID = sessionStorage.getItem("newID");
      //监听默认展示的事件是否完结
      if (eventID == "" || eventID == null || eventID == "newID") {
        let data = {};
        this.$api.selectLastEvent(data).then((res) => {
          if (res.errorcode == "0") {
            this.eventStatus = res.data.event.statusCode;
            console.log("当前事件的完结状态码是：", this.eventStatus);
            if (this.eventStatus == 1) {
              this.isEnd = true;
              this.endBtnTitle = "已完结";
              return;
            }
          }
        });
      } else {
        //监听当前选择的事件是否完结
        let arr = {
          id: eventID,
        };
        this.$api.findById(arr).then((res) => {
          if (res.errorcode == "0") {
            this.eventStatus = res.data.event.statusCode;
            console.log("当前事件的完结状态码是：", this.eventStatus);
            if (this.eventStatus == 1) {
              this.isEnd = true;
              this.endBtnTitle = "已完结";
              return;
            }
          }
        });
      }
    },
    /**
     * @author qinjiaqi
     * @param {type} 没有
     * @return {type} undefined
     * @description：处理事件完结
     */
    endEvent() {
      console.log("点击了事件完结按钮");
      document.getElementById("end_event_btn").blur(); //按钮不失焦的效果不美观
      let eventID = sessionStorage.getItem("newID");
      this.$confirm("您即将完结该事件，是否确认完结？", "提示", {
        customClass: "message-logout",
        confirmButtonClass: "confirm-button-style",
        cancelButtonClass: "cancel-button-style",
        confirmButtonText: "确认完结",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          if (eventID == "" || eventID == null || eventID == undefined) {
            //防止用户新建事件时点击完结
            this.$message({
              type: "warning",
              message: "当前事件未被创建，不能完结",
            });
            return;
          }
          let data = {
            eventId: eventID,
          };
          // 注释原因：“eventEnd”接口完结事件会新增一条空的续报.导致查询出现空续报数据，改为“yzEnd”。author：hexinting date:20210113
          this.$api.yzEnd(data).then((res) => {
            if (res.errorcode == "0") {
              this.$message({
                message: "事件完结成功!",
                type: "success",
              });
              this.listenBtn(); //完结后更新按钮样式
            } else {
              this.$message.error(res.msg);
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消完结",
          });
        });
    },
    serMapArttr(data) {
      // console.log(data)
      let obj = {
        incidentSite: this.$refs.overallSituation.ruleForm.incidentSite,
        longitude: this.$refs.overallSituation.longitude,
        latitude: this.$refs.overallSituation.latitude,
      };
      this.hisyData = JSON.parse(JSON.stringify(obj)); // 历史数据
      this.$refs.overallSituation.ruleForm.incidentSite =
        data.distributionResultAddress;
      this.$refs.overallSituation.longitude = data.distributionResultLongitude;
      this.$refs.overallSituation.latitude = data.distributionResultLatitude;
    },
    repeal() {
      this.$refs.overallSituation.ruleForm.incidentSite = this.hisyData.incidentSite;
      this.$refs.overallSituation.longitude = this.hisyData.longitude;
      this.$refs.overallSituation.latitude = this.hisyData.latitude;
    },
    // 更新eventId
    updateNewID(newID) {
      if (newID) {
        this.selectEvent = parseInt(newID);
      } else {
        this.selectEvent = "";
      }
    },
    getHeight() {
      let h =
        document.documentElement.clientHeight || document.body.clientHeight;
      this.eventLeft.height = h - (68 + 150) + "px";
      this.eventRight.height = h - (68 + 205) + 58 + "px";
      if (this.cutPageRush) {
        this.eventLeft.height = h - (68 + 205) + 112 + "px";
      }
    },
    skipInstructConvey(tableRowData) {
      //指令传达跳转
      console.log(tableRowData);
      this.active = 4;
      let smsContentData = `${tableRowData.deptName}${tableRowData.leadername}同志于${tableRowData.createTime}批示${tableRowData.approval}。`;
      this.$refs.instructConvey.nameType = "短信";
      this.$refs.instructConvey.smsContent = smsContentData;
    },
    saveError(nameTab) {
      //保存失败或新增失败
      this.$refs.navBar.activeName = nameTab;
    },
    addType(typeAdd) {
      this.storeNewState = typeAdd;
    },
    typeAddAll(typeOfReceipt) {
      //新增成功
      this.overShow = false;
      this.isUpdateReportForm = false;
      // console.log(typeOfReceipt);
      this.$refs.navBar.activeName = "事件接报";
    },
    setId(emEventId, emCaseId) {
      //不保存时间修改时事件接报页面传递过来的方法，给event赋值。
      this.eventID = emEventId;
      this.caseID = emCaseId;
    },
    /**
     * @lastAuthor hexinting
     * @lastDate 2020-9-17
     * @description 当表单发生改变时 不保存
     */
    noSaave() {
      this.dialogVisible = false;
      this.selectedName = this.typeTab;
      this.overShow = false;
      this.isUpdateReportForm = false; // 还原为初始值，未更新
      // console.log('overShow改为', this.overShow)
      // console.log(this.eventID, this.caseID);
      sessionStorage.setItem("newID", this.eventID);
      sessionStorage.setItem("caseID", this.caseID);
      this.refreshEvent();
      this.$refs.overallSituation.close(); //调用子组件的方法
    },
    /**
     * @lastAuthor hexinting
     * @lastDate 2020-9-17
     * @description 当表单发生改变时 取消
     */
    offSave() {
      this.dialogVisible = false;
      this.$refs.navBar.activeName = "事件接报";
      this.overShow = true;
      this.isUpdateReportForm = true; // 表单更新了
      // console.log('overShow改为', this.overShow)
    },
    /**
     * @lastAuthor hexinting
     * @lastDate 2020-9-17
     * @description 当表单发生改变时 保存
     */
    yesSave() {
      this.dialogVisible = false;
      this.overShow = false;
      this.isUpdateReportForm = false; // 还原为初始值，未更新
      // console.log('overShow改为', this.overShow)
      this.$nextTick(() => {
        this.$refs.overallSituation.typeOfReceipt = this.storeNewState;
        this.$refs.overallSituation.saveEvent();
      });
    },
    /**
     * @lastAuthor hexinting
     * @lastDate 2020-9-17
     * @description 当表单发生改变时 保存成功
     */
    saveSuccess(preservation, stort) {
      this.stort = false;
      this.stateOfPreservation = 0;
      this.stort = stort;
      if (this.stort) {
        this.overShow = false;
        this.isUpdateReportForm = false; // 还原为初始值，未更新
        // console.log('overShow改为', this.overShow)
        this.stateOfPreservation = preservation;
      }
    },
    getAll(dataALL, paramsData) {
      this.roulformDataAll = dataALL;
      this.oldlParam = paramsData;
    },
    comparParam(val) {
      this.newlparam = val;
      let newL = JSON.stringify(this.newlparam);
      let oldL = JSON.stringify(this.oldlParam);
      // console.log(oldL);
      // console.log(newL);
      if (newL != oldL) {
        this.overShow = true;
      } else {
        this.overShow = false;
      }
    },
    comparison(val) {
      this.newFormDataAll = val;
      let old = JSON.stringify(this.roulformDataAll);
      let neL = JSON.stringify(this.newFormDataAll);
      if (neL != old) {
        this.overShow = true;
      } else {
        this.overShow = false;
      }
    },
    refreshEvent() {
      this.tests = false;
      this.$nextTick(() => {
        this.tests = true;
      });
    },
    /**
     * @lastAuthor hexinting
     * @lastDate 2020-9-17
     * @description 确认保存用来判断是否填写完内容控制跳转
     */
    emitPath(judge) {
      this.judge = judge;
      this.overShow = true;
      this.isUpdateReportForm = true; // 要更新
      // console.log('overShow改为', this.overShow)
      this.$refs.navBar.activeName = "事件接报";
    },
    /**
     * @lastAuthor hexinting
     * @lastDate 2020-9-17
     * @description 切换页
     */
    changTab(tabName) {
      console.log("----------------------------");
      this.typeTab = tabName;
      if (this.selectedName == "事件接报") {
        // if (this.overShow) {
        //   console.log('是否保存？')
        //   this.dialogVisible = true;
        // } else {
        //   this.selectedName = tabName;
        // }
        if (this.isUpdateReportForm) {
          this.dialogVisible = true; // 更新了事件接报表单，显示弹窗
        } else {
          this.selectedName = tabName; // 没更新事件接报表单，继续跳转
        }
      } else {
        this.selectedName = tabName;
      }
    },
    actives(index, title) {
      this.active = index;
      this.$nextTick(() => {
        this.$refs.instructConvey.getConductor(); //刷新指令传达批示信息下拉数据
        this.$refs.instructConvey.tabsTitle = title; //刷新指令传达批示信息下拉数据
        !this.isYangZhou && !this.isZengCheng
          ? (this.$refs.messageSubmission.tabsTitle = title)
          : ""; // 发送时判断是信息报送标识 增城、扬州 用石景山的信息报送（有独立的发送接口）author:xuchuangxing lastUpdateTime:2021/1/29
      });
    },
    setClick(index, name, buttons, caseName, caseId) {
      // console.log(index, name, buttons, caseName, caseId);

      this.$refs.eventContact.getData(index, buttons, caseName, caseId);
      let lengith = this.navBarList.length - 1;
      if (this.navBarList[lengith].name == "事件联系人") {
        this.selectedName = "事件联系人";
        this.$refs.navBar.activeName = "事件联系人";
        return;
      } else {
        this.navBarList.push({
          name: name[0].name,
        });
        this.selectedName = "事件联系人";
        this.$refs.navBar.activeName = "事件联系人";
        return "this.selectedName == '事件接报'";
      }
    },
    delectReape() {
      //监听到事件类型的变化进行tabs操作
      let lengith = this.navBarList.length - 1;
      if (this.navBarList[lengith].name == "事件联系人") {
        this.navBarList.pop();
      }
    },
    closeContact() {
      let lengith = this.navBarList.length - 1;
      if (this.navBarList[lengith].name == "事件联系人") {
        this.navBarList.pop();
        this.selectedName = "事件接报";
        this.$refs.navBar.activeName = "事件接报";
      }
      // this.navBarList.pop();
      // this.$nextTick(() => {
      //   this.selectedName == '事件接报';
      // });
      // console.log(this.navBarList);
    },
    cutRush() {
      //要情界面切换接报信息界面
      this.cutPageDoll = this.cutPageDoll ? false : true;
      this.cutPageRush = this.cutPageRush ? false : true;
      this.cutType = this.cutPageDoll
        ? "切换至接报信息页面"
        : "切换至要情记录页面";
      this.getHeight();
    },
    oneKeyCheck() {
      //一键核实
      this.active = 0;
      this.$nextTick(() => {
        this.$refs.informationToVerify.giveDataClass();
      });
    },
    oneKeySubmission() {
      //一键报送
      this.active = 2;
      this.$nextTick(() => {
        //需要等页面加载完毕之后在调用
        this.$refs.messageSubmission.giveDataClass();
      });
    },
    /**
     * @param 无
     * @returns 无
     * @lastEditor qinjiaqi
     * @lastDate 2020-10-16
     * @description 新增事件时事件完结按钮初始化
     */
    addEvent() {
      this.$refs.overallSituation.addEvent();
    },
    /**
     * @param 无
     * @returns 无
     * @lastEditor hexinting
     * @lastDate 2020-9-18
     * @description 初始化所有事件
     */
    initEvent() {
      setTimeout(() => {
        if (sessionStorage.getItem("newID")) {
          this.eventID = sessionStorage.getItem("newID"); // 获取事件id
          this.selectEventId = this.eventID;
          if (this.eventID !== "newID") {
            this.selectEvent = parseInt(this.eventID); // 切换事件
          } else {
            this.selectEvent = null; // 切换事件
          }
          console.log(
            "selectEvent: ",
            this.selectEvent,
            sessionStorage.getItem("newID")
          );
        }
      }, 800);
      let ipData = {
        size: 10,
        page: this.currentPage,
        name: this.searchText,
        reportType:
          !this.$route.query.linkageValue ||
          this.$route.query.linkageValue == "关"
            ? 0
            : 5,
      };
      this.$szApi.listBy(ipData).then((res) => {
        if (res.errorcode == 0) {
          this.eventOptions.push(...res.data.data);
          this.loadMore = res.data.data.length == 0 ? false : true;
        } else {
          // //this.$message.error(res.msg)
        }
      });
    },
    // 切换事件
    switchEvent(id) {
      // console.log('obj: ', id);
      let currentEvent = this.eventOptions.find((v) => v.id == id);
      sessionStorage.setItem("eventTitle", currentEvent.title); // 切换事件后缓存的展示标题也要改
      // console.log('currentEvent: ', currentEvent);
      this.selectEvent = currentEvent.title; // 事件标题
      if (
        currentEvent.levelId !== 0 &&
        currentEvent.levelId !== "" &&
        currentEvent.levelId !== "" &&
        currentEvent.levelId !== 0
      ) {
        //已经启动过预案
        this.$store.commit("setTurnOnEmergencyResponse", true);
      } else {
        this.$store.commit("setTurnOnEmergencyResponse", false);
      }
      sessionStorage.setItem("newID", currentEvent.id);
      this.reload();
    },
    /**
     * @description: 搜索事件
     * @author : xuchuangxing
     * @lastEditor : xuchuangxing
     * @updateTime : 2020-11-17 18:58
     * @param {*}
     * @return {*}
     */
    searchEvent() {
      this.currentPage = 1;
      this.eventOptions = [];
      this.initEvent();
    },
    /**
     * @description: 每次追加10条事件列表
     * @author : xuchuangxing
     * @lastEditor : xuchuangxing
     * @updateTime : 2020-11-17 18:58
     * @param {*}
     * @return {*}
     */
    loadMoreHandle() {
      this.currentPage++;
      this.initEvent();
    },
  },
};
</script>

<style>
/* authorName qinjiaqi */
/* 事件完结后的按钮样式 */
.end-style {
  -moz-box-shadow: none;
  -webkit-box-shadow: none;
  box-shadow: none;
  left: 0px;
  top: 0px;
  float: right;
  margin-right: -255px;
  margin-top: 50px;
  border: none;
  width: 100px;
  height: 34px;
  text-align: center;
  color: white;
  background-color: rgba(161, 161, 161, 1);
}

/* 事件完结前的按钮样式 */
.not-end-style {
  -moz-box-shadow: none;
  -webkit-box-shadow: none;
  box-shadow: none;
  left: 0px;
  top: 0px;
  float: right;
  margin-right: -255px;
  margin-top: 50px;
  border: none;
  width: 100px;
  height: 34px;
  text-align: center;
  color: white;
  background-color: rgba(0, 153, 255, 1);
}

/* 事件完结弹出框样式 */
.message-logout {
  width: 443px;
  height: 150px;
  background: inherit;
  background-color: rgba(255, 255, 255, 1);
  box-sizing: border-box;
  border-width: 1px;
  border-style: solid;
  border-color: rgba(188, 188, 188, 1);
  border-radius: 5px;
  -moz-box-shadow: none;
  -webkit-box-shadow: none;
  box-shadow: none;
}

.el-message-box__btns {
  text-align: center !important;
}

.el-message-box__btns {
  padding: 10px 20px 10px !important;
  text-align: center !important;
}

.el-message-box {
  padding-bottom: 0px !important;
}

/* 确认按钮样式 */
.confirm-button-style {
  background: inherit;
  background-color: rgba(0, 153, 255, 1);
  width: 100px;
  height: 34px;
  float: center;
  border: none;
  border-radius: 5px;
}

/* 取消按钮样式 */
.cancel-button-style {
  width: 100px;
  height: 34px;
  float: right;
  box-sizing: border-box;
  border-width: 1px;
  background-color: rgba(255, 255, 255, 1);
  border-color: rgba(121, 121, 121, 1);
  border-radius: 5px;
  margin-right: 70px;
  text-align: center;
}
</style>

<style scoped>
.eventOver {
  background: rgba(255, 255, 255, 1);
}

.eventTitle {
  height: 58px;
  line-height: 58px;
  background: rgba(255, 255, 255, 1);
  margin: 10px 15px 0 20px;
  font-size: 18px;
  text-align: left;
  text-indent: 55px;
  font-family: PingFangSC-Medium;
  font-weight: bold;
  color: #333333;
  position: relative;
}

.new-event-title-tab {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 5px 20px;
  height: 58px;
}

.new-event-title-tab .title {
  display: flex;
  align-items: center;
  font-size: 18px;
  font-weight: bold;
  color: #333333;
  font-family: PingFangSC-Medium;
}

.new-event-title-tab .title img {
  width: 20px;
  height: 16px;
  padding-right: 15px;
  margin-top: 1px;
}

.operation {
  display: flex;
  align-items: center;
}

.operation .operation-title {
  cursor: pointer;
  margin-right: 5px;
}

.operation .el-select {
  padding: 0 10px;
}

.operation .change-btn {
  border-color: #409eff;
  -webkit-transform: rotate(90deg);
  -moz-transform: rotate(90deg);
  transform: rotate(90deg);
  filter: progid:DXImageTransform.Microsoft.BasicImage(rotation=1);
}

.operation .change-btn .el-icon-sort {
  color: #409eff;
}

.narBar {
  margin: 0 15px 0 20px !important;
  border: 0 !important;
}

.el-tabs__nav-next {
  font-size: 26px;
  margin-left: 20px;
}

.el-tabs__nav-prev {
  font-size: 26px;
  margin-right: 20px;
}

.el-step.is-simple .el-step__head {
  width: auto;
  position: absolute;
  font-size: 0;
  left: 70px;
  padding-right: 10px;
}

.el-steps--simple {
  padding: 17px 4% !important;
  background-color: #f9fbff;
}

.el-step.is-simple .el-step__arrow::after,
.el-step.is-simple .el-step__arrow::before {
  display: none;
}

>>> .el-steps > .el-step > .el-step__head {
  display: none;
}

.el-step.is-simple:not(:last-of-type) .el-step__title {
  max-width: 100%;
}

.el-step.is-simple .el-step__icon-inner[class*="el-icon"]:not(.is-status) {
  padding-left: 66px;
}

.el-tabs__nav-wrap::after {
  height: 0;
}
</style>
