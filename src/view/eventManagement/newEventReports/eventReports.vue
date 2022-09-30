<template>
  <el-row>
    <el-col :span="12">
      <!-- 值班要情记录头部 -->
      <section
        class="new-event-title-tab"
        style="background: white; margin: 10px 0 0px 20px"
      >
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
        </div>
      </section>
      <!--实现点击切换至接报信息-->
      <!-- <nav-bar
            style="background-color: #f9fbff"
            v-show="cutPageDoll"
            ref="navBar"
            :selectedName="selectedName"
            :navBarList="navBarList"
            class="narBar"
            @changTab="changTab"
        ></nav-bar> -->
      <section
        :style="eventLeft"
        style="
          margin: 0 0 0 20px;
          height: calc(100vh - 176px);
          background-color: white;
          overflow-y: auto;
        "
      >
        <el-scrollbar style="height: 100%">
          <!--实现点击切换至接报信息-->
          <cut-page ref="cutPage" v-show="cutPageRush"></cut-page>
          <div v-show="cutPageDoll">
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
              @setId="setId"
              @oneKeySubmission="oneKeySubmission"
              @updateNewID="updateNewID"
              @updateReportForm="updateReportForm"
              @initEventList="initEventList"
              @createBulletin="createBulletin"
              @previewFaxFile="previewFaxFile"
            ></overall-situation>
          </div>
        </el-scrollbar>
      </section>
    </el-col>

    <el-col :span="12">
      <!-- 值班要情管理头部 -->
      <section class="eventTitle">
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
      </section>
      <!-- 值班要情管理tab内容 -->
      <section
        style="background-color: white; margin: 0 15px 0 20px;position:relative;"
      >
        <nav-bar
          style="background-color: #f9fbff"
          :selectedName="clickedName"
          :navBarList="items"
          class="narBar"
          @changTab="clickTab"
        ></nav-bar>

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
          <el-scrollbar
            class="eventRightScrollBar"
            style="height: 100%; background-color: white"
          >
            <incident-report
              v-if="clickedName == '事件快报'"
              ref="incidentReport"
              :is-linkage="true"
            ></incident-report>
            <message-submission
              v-if="clickedName == '信息报送'"
              ref="messageSubmission"
            ></message-submission>
            <events-panorama
              class="eventsPanorama"
              v-if="clickedName == '事件全景'"
              ref="eventsPanorama"
            ></events-panorama>
            <lead-conductor
              v-if="clickedName == '批示指示'"
              ref="leadConductor"
            ></lead-conductor>
            <condition-collect
              v-show="clickedName == '情况汇总'"
              ref="conditionCollect"
            ></condition-collect>
          </el-scrollbar>
        </div>

        <!-- 文件预览 -->
        <div v-if="isShowPreviewer" class="filePreviewer">
          <div class="filePreviewer_header">
            传真预览
            <i class="el-icon-error" @click="isShowPreviewer = false"></i>
          </div>
          <el-scrollbar>
            <div class="filePreviewer_content">
              <template v-if="imgOrFile === 'img'">
                <el-image
                  class="img_item"
                  :src="filePath"
                  :preview-src-list="imageUrlList"
                >
                </el-image>
              </template>
              <iframe
                v-else
                :src="filePath"
                id="fpxIframe"
                width="650px"
                height="100%"
                frameborder="no"
                marginwidth="0"
                marginheight="0"
                scrolling="no"
                allowtransparency="yes"
              >
              </iframe>
            </div>
          </el-scrollbar>
        </div>
      </section>
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
import axios from "axios";
import Qs from "qs";
import navBar from "@/components/menu/navBar";
import overallSituation from "@/view/eventManagement/newEventReports/page/overallSituation";
import messageSubmission from "@/view/eventManagement/newEventReports/page/messageSubmission_new";
import submissionReview from "@/view/eventManagement/eventReports/Page/affectionHandle/SubmissionReview";
import eventsPanorama from "@/view/eventManagement/newEventReports/page/eventsPanorama";
import leadConductor from "@/view/eventManagement/newEventReports/page/leadershipInstructions";
import conditionCollect from "@/view/eventManagement/eventReports/Page/affectionHandle/conditionCollect";
import cutPage from "@/view/eventManagement/eventReports/Plan/cutPage"; //切换的事件处置的页面
import incidentReport from "@/view/eventManagement/eventBulletin/Page/incidentReport"; // 引用路由事件快报中事件快报扬州右边模块
import { matchFileType } from "@/assets/js/common.js";

export default {
  name: "eventReports",
  components: {
    navBar,
    overallSituation,
    messageSubmission,
    submissionReview, // 信息报送（石景山）
    eventsPanorama,
    leadConductor,
    conditionCollect,
    cutPage,
    incidentReport
  },
  inject: ["reload"],
  data() {
    return {
      clickedName: "事件快报",
      isUpdateReportForm: false, // 是否更新事件接报表单 false 没更新，true 更新
      selectedName: "事件接报", //默认选中导航条
      navBarList: [
        {
          name: "事件接报"
        }
      ], //导航条模块
      items: [
        {
          name: "事件快报"
        },
        {
          name: "信息报送"
        },
        {
          name: "事件全景"
        },
        {
          name: "批示指示"
        },
        {
          name: "情况汇总"
        }
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
        height: ""
      },
      eventRight: {
        height: ""
      },
      cutType: "切换至接报信息页面", //页面切换
      cutPageDoll: true, //默认显示要情接报页面
      cutPageRush: false, //默认隐藏接报信息页面
      selectEvent: null,
      eventOptions: [],
      IsShiJingShanProject: window.g.IsShiJingShanProject,
      IsNanShan: window.g.IsNanShanProject, //是否是南山项目
      eventStatus: 0, //监听当前事件的eventStatus，可能取值为0，1，2
      isEnd: false, //监听eventStatus来改变按钮
      endBtnTitle: "事件完结", //按钮的文本
      visible: false,
      currentPage: 1, // 事件列表页码
      searchText: "", // 事件列表搜索关键字
      loadMore: true, // 是否有更多事件数据
      filePath:
        "http://192.168.3.129:8088/fax/24e866c5a93d45e5974dbd0f00e92f64.pdf", // 文件路径-用来预览传真文件
      isShowPreviewer: false, // 是否显示文件预览弹窗
      imageUrlList: [], // 图片预览列表
      imgOrFile: "file" // 预览器显示图片还是文件
    };
  },
  created() {
    window.addEventListener("resize", this.getHeight);
    this.getHeight();

    // this.listenBtn(); // 深圳不启用
  },
  destroyed() {
    window.removeEventListener("resize", this.getHeight);
  },
  computed: {
    // 事件接报表单
    nowDate() {
      return JSON.parse(JSON.stringify(this.$store.getters.getSituation));
    },
    // 事件类型 对应的 参数
    parment() {
      return JSON.parse(JSON.stringify(this.$store.getters.getParam));
    },
    selectEventStyle() {
      return function(eventId) {
        if (this.selectEventId == eventId) {
          console.log("eventId: ", eventId);
          console.log("this.selectEventId: ", this.selectEventId);
          return "color:#0091ff;background-color:rgba(0, 145, 255, .1);";
        } else {
          return "";
        }
      };
    }
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
      deep: true
    },
    nowDate: {
      handler(val) {
        // console.log("------------getSituation---nowDate---------------", val);
        this.comparison(val);
      },
      deep: true
    },
    parment: {
      handler(val) {
        // console.log("------------getParam---parment---------------", val);
        if (val == "" || val == undefined || val == null) {
          return;
        }
        this.comparParam(val);
      },
      deep: true
    },
    // 深圳市新需求中左侧没有导航栏 该方法先注释掉，否则会报错
    // stateOfPreservation: {
    //   handler(newL, oldV) {
    //     // console.log(
    //     //   "---------------stateOfPreservation------------------",
    //     //   newL
    //     // );
    //     // console.log(newL, oldV);
    //     if (newL === 1 && this.storeNewState == "新增") {
    //       this.$refs.navBar.activeName = "事件接报";
    //       return;
    //     }
    //     if (newL !== 1 && this.storeNewState == "保存") {
    //       this.selectedName = this.typeTab;
    //     } else if (newL === 1 && this.storeNewState !== "保存") {
    //       this.$refs.navBar.activeName = "事件接报";
    //     } else if (newL === 0 && oldV === 1 && this.storeNewState === "保存") {
    //       this.selectedName = this.typeTab;
    //     } else if (newL === 1 && oldV === 0 && this.storeNewState === "保存") {
    //       this.selectedName = this.typeTab;
    //     } else if (newL === 1 && oldV === 1 && this.storeNewState === "保存") {
    //       this.$refs.navBar.activeName = "事件接报";
    //     } else {
    //       this.selectedName = this.typeTab;
    //     }
    //   },
    //   deep: true,
    // },
    storeNewState: {
      handler(newL) {
        // console.log("---------------newL------------------", newL);
        if (newL == "新增") {
          this.storeNewState = newL;
        }
      },
      deep: true
    }
  },
  mounted() {
    // this.getPlant()
    this.initEvent();
  },
  methods: {
    /**
     * @author hexinting
     * @date 2020-12-22
     * @description 预览传真文件
     */
    previewFaxFile(item) {
      console.log("传真文件数据：", item);
      this.isShowPreviewer = true; // 显示文件查看器
      if (matchFileType(item.fileName) === 2) {
        // 2 是图片
        this.imgOrFile = "img";
        this.filePath = item.url; // 文件路径
        this.imageUrlList.push(window.g.ApiUrl + item.filePath); // 图片显示列表
      } else if (
        matchFileType(item.fileName) !== 1 ||
        matchFileType(item.fileName) !== 10
      ) {
        this.imgOrFile = "file";
        this.filePath = item.url; // 文件路径
      }
    },
    /**
     * @author hexinting
     * @date 2020-12-18
     * @description 跳转到事件快报页面
     */
    createBulletin() {
      this.clickedName = "事件快报";
    },
    /**
     * @date 2020-12-18
     * @author hexinting
     * @lastDate 2020-12-24
     * @description 初始化事件列表
     */
    initEventList() {
      this.currentPage = 1;
      this.eventOptions = [];
      this.initEvent("updateList"); // 更新事件列表
    },
    clickTab(tabName) {
      this.clickedName = tabName;
    },
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
        this.$api.selectLastEvent(data).then(res => {
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
        let arr = { id: eventID };
        this.$api.findById(arr).then(res => {
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
     * @lastEditor hexinting
     * @lastDate 2020-12-28
     * @description 更新eventId
     */
    updateNewID(newID) {
      this.clickedName = "事件快报";
      this.$store.commit("setEventList", []);
      if (newID) {
        this.selectEventId = parseInt(newID); // 事件id
        this.selectEvent = ""; // 事件标题
      } else {
        this.selectEvent = ""; // 事件id
        this.selectEventId = ""; // 事件标题
      }
    },
    getHeight() {
      let h =
        document.documentElement.clientHeight || document.body.clientHeight;
      this.eventLeft.height = h - 170 + "px";
      this.eventRight.height = h - (68 + 205) + 58 + "px";
      if (this.cutPageRush) {
        this.eventLeft.height = h - (68 + 205) + 112 + "px";
      }
    },
    skipInstructConvey(tableRowData) {
      //指令传达跳转
      console.log(tableRowData);
      let smsContentData = `${tableRowData.deptName}${tableRowData.leadername}同志于${tableRowData.createTime}批示${tableRowData.approval}。`;
    },
    saveError(nameTab) {
      //保存失败或新增失败
      // this.$refs.navBar.activeName = nameTab; // 深圳市新需求中左侧没有导航栏 先注释掉，否则会报错
    },
    addType(typeAdd) {
      this.storeNewState = typeAdd;
    },
    typeAddAll(typeOfReceipt) {
      //新增成功
      this.overShow = false;
      this.isUpdateReportForm = false;
      // console.log('overShow改为', this.overShow)
      // console.log(typeOfReceipt);
      // this.$refs.navBar.activeName = "事件接报";  // 深圳市新需求中左侧没有导航栏 先注释掉，否则会报错
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
      this.$store.commit("setCaseId", this.caseID);
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
      // this.$refs.navBar.activeName = "事件接报"; // 深圳市新需求中左侧没有导航栏 先注释掉，否则会报错
      this.overShow = true;
      this.isUpdateReportForm = true; // 还原为初始值，未更新
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
      // console.log('overShow改为', this.overShow)
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
      // console.log('overShow改为', this.overShow)
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
      // this.$refs.navBar.activeName = "事件接报"; // 深圳市新需求中左侧没有导航栏 先注释掉，否则会报错
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
        type: "warning"
      })
        .then(() => {
          if (eventID == "" || eventID == null || eventID == undefined) {
            //防止用户新建事件时点击完结
            this.$message({
              type: "warning",
              message: "当前事件未被创建，不能完结"
            });
            return;
          }
          let data = {
            eventId: eventID
          };
          // 注释原因：“eventEnd”接口完结事件会新增一条空的续报.导致查询出现空续报数据，改为“yzEnd”。author：hexinting date:20210113
          this.$api.yzEnd(data).then(res => {
            if (res.errorcode == "0") {
              this.$message({
                message: "事件完结成功!",
                type: "success"
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
            message: "已取消完结"
          });
        });
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
    oneKeySubmission() {
      //一键报送
      this.clickedName = "信息报送";
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
     * @param {String} type 类型'updateList'：更新列表，如果事件接报页面将事件都删除了，那么要重新赋值
     * @returns 无
     * @lastEditor hexinting
     * @lastDate 2020-12-18
     * @description 初始化所有事件
     */
    initEvent(type) {
      setTimeout(() => {
        if (sessionStorage.getItem("newID")) {
          console.log(
            'sessionStorage.getItem("newID"): ',
            sessionStorage.getItem("newID")
          );
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
            : 5
      };
      this.$szApi.listBy(ipData).then(res => {
        if (res.errorcode == 0) {
          this.eventOptions.push(...res.data.data);
          this.loadMore = res.data.data.length == 0 ? false : true;
          if (type === "updateList") {
            this.switchEvent(res.data.data[0].id);
          }
        } else {
          // //this.$message.error(res.msg)
        }
      });
    },
    /**
     * @lastEditor hexinting
     * @lastDate 2020-12-28
     * @description 切换事件
     */
    switchEvent(id) {
      this.visible = false; // 选中了事件后隐藏下拉框
      // console.log('obj: ', id);
      let currentEvent = this.eventOptions.find(v => v.id == id);
      sessionStorage.setItem("eventTitle", currentEvent.title); // 切换事件后缓存的展示标题也要改
      this.selectEvent = currentEvent.title; // 事件标题
      console.log("currentEvent: ", currentEvent);
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
      this.selectEventId = currentEvent.id;
      // this.reload() // 注释原因：bug8566 eos拉会成功后，在事件接报模块切换事件会刷新页面，导致页面刷新，home.vue页面中的beforeDestroy关闭会议的方法 author：hexinting date:2020-11-20
      // 切换事件之后默认进入事件接报和信息核实这两个子页面
      // this.selectedName = "事件接报";
      // this.$refs.navBar.activeName = "事件接报";
      this.clickedName = "事件快报";
      this.$store.commit("setEventId", currentEvent.id); // 在事件接报页面监听事件id
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
    }
  }
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

.eventRightScrollBar >>> .el-scrollbar__view {
  height: 100%;
}
/* 事件全景 */
.eventsPanorama {
  margin-top: 15px;
}

/* 文件预览 */
.filePreviewer {
  width: 100%;
  height: 100%;
  background: rgba(135, 135, 135, 0.7);
  position: absolute;
  top: 0;
  z-index: 100;
  padding: 5%;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.filePreviewer_header {
  width: 650px;
  height: 40px;
  line-height: 40px;
  background: #f1f4f6;
  border-radius: 5px 5px 0px 0px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px 0 10px;
  box-sizing: border-box;
}

.filePreviewer_content {
  background: #ffffff;
  width: 650px;
  height: 680px;
}

.filePreviewer_header .el-icon-error {
  cursor: pointer;
}

.filePreviewer .img_item {
  width: 100%;
  height: 100%;
}

.filePreviewer .img_item >>> .el-image__preview {
  object-fit: contain;
}
</style>
