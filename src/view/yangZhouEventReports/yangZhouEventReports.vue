<template>
  <el-row class="event_report_wrap">
    <!-- 左边 值班要情记录-->
    <el-col :span="12" class="wrap_item wrap_item_left">
      <div class="new-event-title-tab">
        <PageHeader>
          <template #name>值班要情记录</template>
          <template>
            <!-- <SwitchEvent /> -->
            <div class="operation">
              <span class="operation-title">切换事件</span>
              <el-popover
                v-model="visible"
                placement="bottom"
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
                    />
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
                        v-if="loadMore"
                        round
                        icon="iconfont icon-loadMore"
                        size="mini"
                        @click="loadMoreHandle"
                        >加载更多</el-button
                      >
                      <div v-else>暂无更多数据</div>
                    </div>
                  </ul>
                </template>
                <template v-else>
                  <div style="text-align: center; margin-top: 10px">
                    暂无数据
                  </div>
                </template>

                <el-input
                  v-model="selectEvent"
                  size="big"
                  slot="reference"
                  readonly
                  placeholder="请选择"
                >
                  <span slot="suffix" class="suffic-icon">
                    <i
                      class="el-icon-arrow-down"
                      :style="{
                        transform: visible ? 'rotateZ(180deg)' : 'rotateZ(0)',
                      }"
                    ></i>
                  </span>
                </el-input>
              </el-popover>
              <el-button type="primary" @click="addEvent" class="operation_btn"
                >新增事件</el-button
              >
            </div>
          </template>
        </PageHeader>
      </div>

      <div :style="eventLeft" class="eventLeft">
        <div style="height: 100%">
        <!-- <el-scrollbar style="height: 100%"> -->
          <overall-situation
            @emitPath="emitPath"
            @getAll="getAll"
            @saveSuccess="saveSuccess"
            @addType="addType"
            @typeAddAll="typeAddAll"
            ref="overallSituation"
            @refreshEvent="refreshEvent"
            @delectReape="delectReape"
            @setId="setId"
            @oneKeyCheck="oneKeyCheck"
            @oneKeySubmission="oneKeySubmission"
            @updateNewID="updateNewID"
            @updateReportForm="updateReportForm"
            @initEventList="initEventList"
            @createBulletin="createBulletin"
            @jumpto="refreshTruti"
          ></overall-situation>
        <!-- </el-scrollbar> -->
        </div>
      </div>
    </el-col>

    <!-- 右边 值班要情管理-->
    <el-col :span="12" class="wrap_item wrap_item_right">
      <PageHeader>
        <template #name>值班要情管理</template>
      </PageHeader>

      <div style="background-color: white">
        <nav-bar
          :selectedName="clickedName"
          :navBarList="items"
          class="eventReport-narBar"
          @changTab="clickTab"
        ></nav-bar>

        <div
          :style="eventRight"
          style="
            background-color: white;
            overflow: auto;
            position: relative;
            padding: 0 10px;
          "
          v-if="tests"
        >
          <div style="height: 100%; background-color: white">
          <!-- <el-scrollbar style="height: 100%; background-color: white"> -->
            <information-to-verify
              v-if="clickedName == '信息核实'"
              ref="informationToVerify"
              @closeContact="closeContact"
              @setClick="setClick"
              @serMapArttr="serMapArttr"
              @repeal="repeal"
            ></information-to-verify>

            <event-bulletin
              v-if="clickedName == '事件快报'"
              ref="eventBulletin"
            ></event-bulletin>

            <!-- <submission-review
              v-if="clickedName == '信息上报' && isYangZhou"
              ref="messageSubmission"
              @setClick="setClick"
              @closeContact="closeContact"
            ></submission-review>
            <message-submission
              v-else-if="clickedName == '信息上报'"
              ref="messageSubmission"
              @setClick="setClick"
              @closeContact="closeContact"
            ></message-submission> -->
            <information-Submission
              v-else-if="clickedName == '信息报送'"
              ref="informationSubmission"
              @setClick="setClick"
              @closeContact="closeContact"
            >
            </information-Submission>

            <leadership-instructions
              v-if="clickedName == '批示指示'"
              ref="leadershipInstructions"
            ></leadership-instructions>

            <truth-initial
              v-if="clickedName == '事件初判'"
              ref="truthInitial"
            ></truth-initial>

            <condition-collect
              v-show="clickedName == '情况汇总'"
              ref="conditionCollect"
            ></condition-collect>

            <criminal-history
              v-if="clickedName == '通讯历史'"
              @refreshEvent="refreshEvent"
            ></criminal-history>

            <operating-record
              ref="operatingRecord"
              v-if="clickedName == '操作记录'"
            ></operating-record>
          <!-- </el-scrollbar> -->
          </div>
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
        <el-button @click="noSave" size="mini">不保存</el-button>
        <el-button @click="offSave" size="mini">取消</el-button>
        <el-button type="primary" @click="yesSave" size="mini">保存</el-button>
      </span>
    </el-dialog>
  </el-row>
</template>

<script>
import navBar from '@/yz_components/menu/navBar';
import overallSituation from '@/view/yangZhouEventReports/yangZhouOverallSituation';
import informationToVerify from '@/view/yz_eventManagement/eventReports/Page/affectionHandle/informationToVerify';
import eventBulletin from '@/view/yangZhouEventReports/page/eventBulletin/eventBulletin';
import leadershipInstructions from '@/view/yangZhouEventReports/page/leadershipInstructions';
import truthInitial from '@/view/yz_eventManagement/eventReports/Page/affectionHandle/truthInitial';
import conditionCollect from '@/view/yz_eventManagement/eventReports/Page/affectionHandle/conditionCollect';
import informationSubmission from '@/view/yangZhouEventReports/page/eventBulletin/informationSubmission';
import operatingRecord from '@/view/yz_eventManagement/eventReports/Page/operatingRecord';
import criminalHistory from '@/view/yz_eventManagement/eventReports/Page/criminalHistory';
import PageHeader from '@/view/yangZhouEventReports/components/PageHeader/PageHeader';
import SwitchEvent from '@/view/yangZhouEventReports/components/SwitchEvent/SwitchEvent';
import bus from "@/yz_components/common/js/eventBus";
import SockJS from "sockjs-client";
import Stomp from "stompjs";
export default {
  name: 'yangZhouEventReports',
  components: {
    navBar,
    overallSituation,
    informationToVerify,
    eventBulletin,
    // messageSubmission,
    // submissionReview,
    leadershipInstructions,
    truthInitial,
    conditionCollect,
    informationSubmission, // 信息上报（扬州）
    operatingRecord,
    criminalHistory,
    PageHeader,
    SwitchEvent,
  },
  inject: ['reload'],
  data() {
    return {
      navBarList: [],
      clickedName: '信息核实',
      isUpdateReportForm: false, // 是否更新事件接报表单 false 没更新，true 更新
      items: [
        {
          name: '信息核实',
        },
        {
          name: '事件快报',
        },
        {
          name: '信息报送',
        },
        {
          name: '批示指示',
        },
        {
          name: '事件初判',
        },
        {
          name: '情况汇总',
        },
        {
          // name: '接报历史',
          name: '通讯历史', // 莘县要求修改
        },
        {
          name: '操作记录',
        },
      ],
      overShow: false,
      tests: true, //监听数据变化控制数据刷新
      typeTab: '',
      judge: true, //确认保存用来判断是否填写完内容控制跳转
      roulformDataAll: [], //数据库返回的第一次数据
      newFormDataAll: [], //新的数据
      oldlParam: [], //数据库返回的参数数据
      newlparam: [], //新的数据参数
      dialogVisible: false, //弹窗
      stateOfPreservation: 1, //保存状态
      storeNewState: '保存', //判断新增还是保存
      stort: false,
      leftRefresh: true,
      eventID: '',
      selectEventId: '',
      eventLeft: {
        height: '',
      },
      eventRight: {
        height: '',
      },
      cutPageRush: false, //默认隐藏接报信息页面
      selectEvent: null, // 事件标题
      eventOptions: [],
      isYangZhou: window.g.IsYangZhouProject, // 是否扬州项目
      eventStatus: 0, //监听当前事件的eventStatus，可能取值为0，1，2
      visible: false,
      currentPage: 1, // 事件列表页码
      pageSize: 10, // 每页条数
      searchText: '', // 事件列表搜索关键字
      loadMore: true, // 是否有更多事件数据
      faxClient: {}, //推送的sokect
    };
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
          return 'color:#0091ff;background-color:rgba(0, 145, 255, .1);';
        } else {
          return '';
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
        if (sessionStorage.getItem('newID')) {
          this.selectEvent = sessionStorage.getItem('eventTitle');
        }
      },
      deep: true,
    },
    nowDate: {
      handler(val) {
        this.comparison(val);
      },
      deep: true,
    },
    parment: {
      handler(val) {
        if (val == '' || val == undefined || val == null) {
          return;
        }
        this.comparParam(val);
      },
      deep: true,
    },
    stateOfPreservation: {
      handler(newL, oldV) {
        if (newL === 1 && this.storeNewState == '新增') {
          return;
        }
        if (newL !== 1 && this.storeNewState == '保存') {
        } else if (newL === 1 && this.storeNewState !== '保存') {
        } else if (newL === 0 && oldV === 1 && this.storeNewState === '保存') {
        } else if (newL === 1 && oldV === 0 && this.storeNewState === '保存') {
        } else if (newL === 1 && oldV === 1 && this.storeNewState === '保存') {
        } else {
        }
      },
      deep: true,
    },
    storeNewState: {
      handler(newL) {
        if (newL == '新增') {
          this.storeNewState = newL;
        }
      },
      deep: true,
    },
  },
  created() {
    window.addEventListener('resize', this.getHeight);
    this.getHeight();
    this.listenBtn();
    // this.faxWebSokect()
  },
  destroyed() {
    window.removeEventListener('resize', this.getHeight);
  },
  mounted() {
    // this.getPlant()
    this.initEvent();
    sessionStorage.setItem('refreshTruti', false);
  },
  methods: {
      //传真短信事件推送的方法
      faxWebSokect() {
      let _this = this;
      // 建立连接对象
      console.log(_this.$window.SITE_CONFIG["websocket"])
      let faxSocket = new SockJS(_this.$window.SITE_CONFIG["websocket"]);
      console.log(faxSocket)
      // 获取STOMP子协议的客户端对象
      this.faxClient = Stomp.over(faxSocket);
      console.log(this.faxClient)
      // 接受的推送数量
      this.faxClient.accpetNum = 0
      // 定义客户端的认证信息,按需求配置
      let headers = {
        Authorization: ""
      };
      // 向服务器发起websocket连接
      this.faxClient.connect(
        headers,
        () => {
          this.faxClient.subscribe(
            "/topic/icp/CtiNotify",
            msg => {
              //根据返回来的信息分别处理
              let message = msg;
              let msgBody = JSON.parse(message.body);
              console.log(message);
              console.log(msgBody);
              //事件通知弹窗
              // 信息处置-事件接报-信息核实-刷新核实列表
              if (msgBody.cmd && msgBody.cmd.SubCmd == "131") {
                this.faxClient.accpetNum += 1
                if(this.faxClient.accpetNum = 1) {
                  let msgData = {
                    contactorName:msgBody.contactorName,
                    SubCmd:msgBody.cmd.SubCmd,
                    datetime:msgBody.datetime,
                    eventName:msgBody.eventName
                  }
                  bus.$emit("informationVerification",msgData);
                }
                else if(this.faxClient.accpetNum == 2) {
                  this.faxClient.accpetNum = 0
                }
              }
            },
            headers
          );
        },
        () => {}
      );
    },
    /**
     * @author hexinting
     * @date 2020-12-09
     * @description 跳转到事件快报页面 bug9130
     */
    createBulletin() {
      this.clickedName = '事件快报';
    },
    /**
     * @date 2020-11-28
     * @author hexinting
     * @lastDate 2020-11-30
     * @description 初始化事件列表
     */
    initEventList(type) {
      this.currentPage = 1;
      this.initEvent(type); // 更新事件列表
    },
    /**
     * @param {boolean} isUpdate 是否更新
     * @author hexinting
     * @date 2020-9-17
     * @description 是否更新了事件接报表单
     */
    updateReportForm(isUpdate) {
      this.isUpdateReportForm = isUpdate;
    },
    /**
     * @author qinjiaqi
     * @lastEditor hexinting
     * @lastDate 2020-11-29
     * @param {type} 没有
     * @return {type} undefined
     * @description：监听当前展示事件是否完结
     */
    listenBtn() {
      let eventID = sessionStorage.getItem('newID');
      //监听默认展示的事件是否完结
      if (eventID == '' || eventID == null || eventID == 'newID') {
        let data = {};
        this.$api.selectLastEvent(data).then((res) => {
          if (res.errorcode == '0') {
            if (res.data) {
              // 要判断是否数据不为空，否则数据为空时候会报错 author:hexinting date:2020-11-29
              this.eventStatus = res.data.event.statusCode;
              console.log('当前事件的完结状态码是：', this.eventStatus);
              if (this.eventStatus == 1) {
                return;
              }
            }
          }
        });
      } else {
        //监听当前选择的事件是否完结
        let arr = {
          id: eventID,
        };
        this.$api.findById(arr).then((res) => {
          if (res.errorcode == '0') {
            this.eventStatus = res.data.event.statusCode;
            if (this.eventStatus == 1) {
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
      document.getElementById('end_event_btn').blur(); // 按钮不失焦的效果不美观
      let eventID = sessionStorage.getItem('newID');
      this.$confirm('您即将完结该事件，是否确认完结？', '提示', {
        customClass: 'message-logout',
        confirmButtonClass: 'confirm-button-style',
        cancelButtonClass: 'cancel-button-style',
        confirmButtonText: '确认完结',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          if (eventID == '' || eventID == null || eventID == undefined) {
            // 防止用户新建事件时点击完结
            this.$message({
              type: 'warning',
              message: '当前事件未被创建，不能完结',
            });
            return;
          }
          let data = {
            eventId: eventID,
          };
          // 注释原因：“eventEnd”接口完结事件会新增一条空的续报.导致查询出现空续报数据，改为“yzEnd”。author：hexinting date:20210113
          this.$api.yzEnd(data).then((res) => {
            if (res.errorcode == '0') {
              this.$message({
                message: '事件完结成功!',
                type: 'success',
              });
              this.listenBtn(); // 完结后更新按钮样式
            } else {
              this.$message.error(res.msg);
            }
          });
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消完结',
          });
        });
    },
    serMapArttr(data) {
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
    /**
     * @lastEditor hexinting
     * @lastDate 2020-12-28
     * @description 更新eventId
     */
    updateNewID(newID) {
      this.clickedName = '信息核实';
      this.$store.commit('setEventList', []);
      if (newID) {
        this.selectEventId = parseInt(newID); // 事件id
        this.selectEvent = ''; // 事件标题
      } else {
        this.selectEvent = ''; // 事件标题
        this.selectEventId = ''; // 事件id
      }
    },
    /**
     * @lastEditor hexinting
     * @lastDate 2020-11-29
     * @description 获取左右容器的高度
     */
    getHeight() {
      let h =
        document.documentElement.clientHeight || document.body.clientHeight;
      this.eventLeft.height = h - (54 + 150) + 'px';
      this.eventRight.height = h - (54 + 150 + 54) + 'px';
      if (this.cutPageRush) {
        this.eventLeft.height = h - (68 + 205) + 112 + 'px';
      }
    },
    addType(typeAdd) {
      this.storeNewState = typeAdd;
    },
    typeAddAll(typeOfReceipt) {
      // 新增成功
      this.overShow = false;
      this.isUpdateReportForm = false;
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
    noSave() {
      this.dialogVisible = false;
      this.overShow = false;
      this.isUpdateReportForm = false; // 还原为初始值，未更新
      sessionStorage.setItem('newID', this.eventID);
      sessionStorage.setItem('caseID', this.caseID);
      this.refreshEvent();
      this.$refs.overallSituation.close(); // 调用子组件的方法
    },
    /**
     * @lastAuthor hexinting
     * @lastDate 2020-9-17
     * @description 当表单发生改变时 取消
     */
    offSave() {
      this.dialogVisible = false;
      this.overShow = true;
      this.isUpdateReportForm = true; // 表单更新了
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
    },
    clickTab(tabName) {
      this.clickedName = tabName;
      sessionStorage.setItem('refreshTruti', false);
    },
    setClick(index, name, buttons, caseName, caseId) {},

    /**
     * @lastEditor hexinting
     * @lastDate 2020-11-29
     * @description 监听到事件类型的变化进行tabs操作
     */
    delectReape() {
      // 监听到事件类型的变化进行tabs操作
      if (this.navBarList.length > 0) {
        // 若无navBarList时会报错
        const length = this.navBarList.length - 1;
        if (this.navBarList[length].name == '事件联系人') {
          this.navBarList.pop();
        }
      }
    },

    /**
     * @lastEditor hexinting
     * @lastDate 2020-11-29
     * @description 关闭弹窗
     */
    closeContact() {
      if (this.navBarList.length > 0) {
        // 若无navBarList时会报错
        let lengith = this.navBarList.length - 1;
        if (this.navBarList[lengith].name == '事件联系人') {
          this.navBarList.pop();
        }
      }
    },
    cutRush() {
      // 要情界面切换接报信息界面
      this.cutPageRush = this.cutPageRush ? false : true;

      this.getHeight();
    },
    /**
     * @author hexinting
     * @date 2020-12-11
     * @description 一键核实 复制事故简况到短信内容，自动转到信息核实页面
     */
    oneKeyCheck() {
      // 一键核实
      this.clickedName = '信息核实';
      this.$nextTick(() => {
        this.$refs.informationToVerify.giveDataClass();
      });
    },
    /**
     * @author hexinting
     * @date 2020-12-11
     * @description 一键报送 复制事故简况到短信内容，自动转到信息报送页面
     */
    oneKeySubmission() {
      // 一键报送
      this.clickedName = '信息报送';
      this.$nextTick(() => {
        // 需要等页面加载完毕之后在调用
        this.$refs.informationSubmission.giveDataClass();
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
     * @description 获取事件列表
     */
    getEventList() {
      return new Promise((resolve) => {
        const requestData = {
          size: this.pageSize,
          page: this.currentPage,
          name: this.searchText,
          reportType:
            !this.$route.query.linkageValue ||
            this.$route.query.linkageValue === '关'
              ? 0
              : 5,
        };
        this.$szApi
          .listBy(requestData)
          .then((res) => {
            if (res.errorcode === 0) {
              resolve(res.data);
            } else {
              this.$message.error(
                `获取事件列表错误，错误代码${res.errorcode}：，错误信息：${res.msg}`,
              );
            }
          })
          .catch((error) => {
            this.$message.error(
              `获取事件列表错误，错误代码${error.errorcode}：，错误信息：${error.msg}`,
            );
          });
      });
    },
    /**
     * @param {String} type 类型'updateList'：更新列表，如果事件接报页面将事件都删除了或者重新新建了事件，那么要重新赋值
     * @returns 无
     * @lastEditor hexinting
     * @lastDate 2020-11-30
     * @description 初始化所有事件
     */
    initEvent(type) {
      // 事件Id
      const eventID = sessionStorage.getItem('newID') && sessionStorage.getItem('newID') !== 'newID'
        ? Number(sessionStorage.getItem('newID'))
        : '';
      // 获取事件列表
      this.getEventList().then((res) => {
        this.eventOptions = res.data;
        if (res.data.length !== this.pageSize || this.currentPage >= this.pageSize) {
          this.loadMore = false;
        } else {
          this.loadMore = true;
        }
        // 2.7原有逻辑，如果缓存里面已经有事件Id了，优先显示缓存的事件。若没有，则显示最新的事件
        if (eventID && eventID !== 'newID') {
          // 事件Id
          this.eventID = eventID;
          this.selectEventId = eventID;
          // 事件标题
          this.selectEvent = sessionStorage.getItem('eventTitle');;
          // 在事件接报页面监听事件id
          this.$store.commit('setEventId', eventID);
        }
        // 显示最新事件
        if (type === 'updateList' || !eventID) {
          this.switchEvent(this.eventOptions[0].id);
        }
      });
    },
    // 切换事件
    switchEvent(id) {
      const currentEvent = this.eventOptions.find((v) => v.id == id);
      // 切换事件后缓存的展示标题也要改
      sessionStorage.setItem('eventTitle', currentEvent.title);
      sessionStorage.setItem('newID', currentEvent.id);
      // 事件标题
      this.selectEvent = currentEvent.title;
      // currentEvent.levelId为true，已经启动过预案
      this.$store.commit('setTurnOnEmergencyResponse', !!currentEvent.levelId);
      // 注释原因：bug8566 eos拉会成功后，在事件接报模块切换事件会刷新页面，导致页面刷新，home.vue页面中的beforeDestroy关闭会议的方法 author：hexinting date:2020-11-20
      // this.reload()
      // 切换事件之后默认进入信息核实子页面
      this.selectEventId = currentEvent.id;
      this.clickedName = '信息核实';
      this.$store.commit('setEventId', currentEvent.id); // 在事件接报页面监听事件id
      this.visible = false;
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
      this.currentPage += 1;
      // 获取事件列表
      this.getEventList().then((res) => {
        this.eventOptions = this.eventOptions.concat(...res.data);
        if (res.data.length !== this.pageSize || this.currentPage >= this.pageSize) {
          this.loadMore = false;
        } else {
          this.loadMore = true;
        }
      });
    },
    refreshTruti() {
      this.clickedName = '事件初判';
    },
  },
};
</script>

<style lang="scss">
@import url('./assets/css/yangZhouEventReports.scss');
</style>
<style>
>>>.el-scrollbar__wrap {
  overflow-y: scroll !important;
}
</style>
