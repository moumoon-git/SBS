<template>
  <div class="word-manager">
    <el-row>
      <el-col :span="24">
        <!--tab组件-->
        <el-tabs
          class="border-tabs"
          v-model="activeName"
          type="card"
          @tab-click="cardHandleClick"
        >
          <el-tab-pane label="全部" name>
            <!--全部表格数据-->
            <!-- <word-manager-table
              ref="table"
              :tableData="tableDataDisplay"
              @formFindHandleClick="formFindHandleClick"
              @formUpgradeHandleClick="formUpgradeHandleClick"
              @formSurveyHandleClick="formSurveyHandleClick"
              @formCloseHandleClick="formCloseHandleClick"
              @formManuaVerifylHandleClick="formManuaVerifylHandleClick"
              @formExaminationlHandleClick="formExaminationlHandleClick"
            ></word-manager-table>-->
          </el-tab-pane>

          <el-tab-pane label="人员预警" name="3">
            <!--待核实表格数据-->
            <!-- <word-manager-table
              ref="table"
              :tableData="tableDataDisplay"
              @formFindHandleClick="formFindHandleClick"
              @formUpgradeHandleClick="formUpgradeHandleClick"
              @formSurveyHandleClick="formSurveyHandleClick"
              @formCloseHandleClick="formCloseHandleClick"
              @formManuaVerifylHandleClick="formManuaVerifylHandleClick"
              @formExaminationlHandleClick="formExaminationlHandleClick"
            ></word-manager-table>-->
          </el-tab-pane>

          <el-tab-pane label="车辆预警" name="4">
            <!--核实中-->
            <!-- <word-manager-table
              ref="table"
              :tableData="tableDataDisplay"
              @formFindHandleClick="formFindHandleClick"
              @formUpgradeHandleClick="formUpgradeHandleClick"
              @formSurveyHandleClick="formSurveyHandleClick"
              @formCloseHandleClick="formCloseHandleClick"
              @formManuaVerifylHandleClick="formManuaVerifylHandleClick"
              @formExaminationlHandleClick="formExaminationlHandleClick"
            ></word-manager-table>-->
          </el-tab-pane>
           <!-- 化工厂定制 -->
          <!-- <el-tab-pane label="疫情预警" name="5"> -->
            <!--待处理-->
            <!-- <word-manager-table
              ref="table"
              :tableData="tableDataDisplay"
              @formFindHandleClick="formFindHandleClick"
              @formUpgradeHandleClick="formUpgradeHandleClick"
              @formSurveyHandleClick="formSurveyHandleClick"
              @formCloseHandleClick="formCloseHandleClick"
              @formManuaVerifylHandleClick="formManuaVerifylHandleClick"
              @formExaminationlHandleClick="formExaminationlHandleClick"
            ></word-manager-table>-->
          <!-- </el-tab-pane> -->

          <!-- <el-tab-pane label="市场预警" name="6"> -->
            <!-- 处理中 -->
          <!-- </el-tab-pane> -->
          <el-tab-pane label="人群聚集" name="8">
            <!--处理中-->
          </el-tab-pane>
          <el-tab-pane label="视频监控" name="9">
            <!--处理中-->
          </el-tab-pane>
          <el-tab-pane label="风险巡查" name="10">
            <!--处理中-->
          </el-tab-pane>
          <!-- <el-tab-pane label="垃圾分类" name="11"> -->
            <!--处理中-->
          <!-- </el-tab-pane> -->
          <el-tab-pane label="要情工单" name="12">
            <!--处理中-->
          </el-tab-pane>
        </el-tabs>

        <!--头部组件-->
        <el-header
          v-if="activeName !== '10' && activeName != '11' && activeName != '12'"
          style="
            height: initial;
            padding: 0 0 0 0;
            clear: both;
            margin-top: 6px;
          "
          class="left"
        >
          <word-manager-header
            ref="header"
            :headData="headTypeData"
            :headFlag="headFlag"
            @searchHandle="searchHandle"
            @exportEventData="exportEventData"
            @addOrUpdateHandle="addOrUpdateHandle"
          ></word-manager-header>
        </el-header>
        <word-manager-table
          v-if="activeName !== '10' && activeName != '11' && activeName != '12'"
          ref="table"
          :tableData="tableDataDisplay"
          @formFindHandleClick="formFindHandleClick"
          @formUpgradeHandleClick="formUpgradeHandleClick"
          @formSurveyHandleClick="formSurveyHandleClick"
          @formCloseHandleClick="formCloseHandleClick"
          @formManuaVerifylHandleClick="formManuaVerifylHandleClick"
          @formExaminationlHandleClick="formExaminationlHandleClick"
          @formReminderlHandleClick="formReminderlHandleClick"
          @formResolveHandleClick="formResolveHandleClick"
        ></word-manager-table>
        <word-manager-inspection
          v-else
          ref="wordManagerInspection"
          :activeName="activeName"
          @formReminderlHandleClick="formReminderlHandleClickNew"
        ></word-manager-inspection>
      </el-col>
    </el-row>

    <!--分页-->
    <el-pagination
      v-if="activeName !== '10' && activeName != '11' && activeName != '12'"
      @size-change="sizeChangeHandle"
      @current-change="currentChangeHandle"
      :current-page="pageIndex"
      :page-sizes="[20, 30, 30, 40]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="totalPage"
    ></el-pagination>

    <!--点击查看，弹出查看窗口-->
    <word-manager-view
      v-if="wordMangerViewVisible"
      ref="wordManagerView"
    ></word-manager-view>

    <!--升级工单-->
    <word-manager-upgrade
      v-if="wordMangerUpgradeVisible"
      ref="wordManagerUpgrade"
      @refreshDataList="getDataList"
    ></word-manager-upgrade>

    <!--点击调查反馈，弹出编辑窗口-->
    <word-manager-survey
      v-if="wordMangerSurveyVisible"
      ref="wordManagerSurvey"
    ></word-manager-survey>

    <!--点击派单，弹出编辑窗口-->
    <word-manager-verify
      v-if="wordManagerVerifyVisible"
      ref="wordManagerVerify"
      @refreshDataList="getDataList"
    ></word-manager-verify>

    <!--点击审核，弹出编辑窗口-->
    <word-manager-examination
      v-if="wordManagerExaminationVisible"
      ref="wordManagerExamination"
      @refreshDataList="getDataList"
    ></word-manager-examination>

    <!-- 点击催办，弹出窗口 -->
    <word-manager-urge
      v-if="urgeVisible"
      ref="wordManagerUrge"
      @refresh-data-list="getDataList"
      @refresh-new-dataList="getNewDataList"
    />
  </div>
</template>
<script>
import WordManagerHeader from "./wordheader";
import WordManagerTable from "./wordmanager-table";
import WordManagerView from "./wordmanager-view";
import WordManagerUpgrade from "./wordmanager-upgrade";
import WordManagerSurvey from "./wordmanager-survey";
import WordManagerVerify from "./wordmanager-verify";
import WordManagerExamination from "./wordmanager-examination";
import inspectionTable from "./wordmanager-table-inspection";
import WordManagerUrge from './wordmanager-urge.vue';

import SockJS from "sockjs-client";
import Stomp from "stompjs";

export default {
  data() {
    return {
      urgeVisible: false,
      // websocket
      // path: "ws://192.168.6.59:8888/webSocket/"+this.$store.state.user.platformId,
      // socket:"",
      // 用户平台
      backgroundURL: window.SITE_CONFIG.baseUrl,
      platformId: this.$store.state.user.platformId,
      globalStompClient: null,
      // 头部时间组件值
      headerDateValue: "",
      // 查看弹窗默认关
      wordMangerViewVisible: false,
      // 升级工单
      wordMangerUpgradeVisible: false,
      // 调查反馈默认弹窗
      wordMangerSurveyVisible: false,
      // 核实处置、派单
      wordManagerVerifyVisible: false,
      // 审批
      wordManagerExaminationVisible: false,

      // 默认的tab
      activeName: "",

      // 分页
      pageIndex: 1, // 当前页
      pageSize: 20, // 单页显示数据
      totalPage: 100, // 总条数

      // table 显示数据
      tableDataDisplay: [],

      // 类型显示的数据
      headTypeData: [],
      // 0头部不显示新增按钮
      headFlag: 0,
      // 本平台的id传递
      headPlatformId: this.$store.state.user.platformId,

      // 共享平台id数组
      sharePlatfromArray: [],

      // 搜索条件
      startTime: "",
      endTime: "",
      searchTitle: "",
      sharePatformId: "",
      eventTypeId: "",
      shareTownId: "",
      status: "",
      platformTypeId: "",
      // 全部表格数据
      tableAllData: [],
      // 待核实表格数据
      tableWaitVerifyData: [],
      // 核实中表格数据
      tableVerifyingData: [],
      // 等处理
      tableWaitDisposeData: [],
      // 处理中
      tableDisposeingData: [],
      // 已处理
      tableDisposedData: [],
      // 已关闭
      tableClosedData: [],
      // 超出范围
      tableOutRangeData: [],
      // 处理页面跳转url
      resolveUrl: '',
    };
  },

  components: {
    "word-manager-header": WordManagerHeader,
    "word-manager-table": WordManagerTable,
    "word-manager-view": WordManagerView,
    "word-manager-survey": WordManagerSurvey,
    "word-manager-upgrade": WordManagerUpgrade,
    "word-manager-verify": WordManagerVerify,
    "word-manager-examination": WordManagerExamination,
    "word-manager-inspection": inspectionTable,
    'word-manager-urge': WordManagerUrge,
  },

  mounted() {
    this.getDataList();
  },

  beforeDestroy: function () {
    // 页面离开时断开连接,清除定时器
    //this.disconnect()
    //clearInterval(this.timer)
  },

  methods: {
    // 刷新新工单
    getNewDataList() {
      this.$refs.wordManagerInspection.getWorkData();
    },
    // 连接
    initWebSocket() {
      // console.log("platformId===="+this.platformId);
      var that = this;

      that.connection();

      // 断开重连机制,尝试发送消息,捕获异常发生时重连
      this.timer = setInterval(() => {
        try {
          that.globalStompClient.send(
            "/platform/check",
            {},
            JSON.stringify({ to: that.platformId })
          );
          //that.globalStompClient.send("text");
          // console.log("pong!");
        } catch (err) {
          // console.log("断线了: " + err);
          that.connection();
        }
      }, 10000);

      // 连接SockJS的endpoint名称为"endpointOyzc"
      // var socket = new SockJS('http://127.0.0.1:8999/endpointOyzc');
      // var socket = new SockJS('http://chrchr.natapp1.cc/endpointOyzc');
      // 使用STMOP子协议的WebSocket客户端
      // var stompClient = Stomp.over(socket);
      // this.globalStompClient = stompClient;
      // 连接WebSocket服务端
      // stompClient.connect({},function(frame){
      //   console.log("执行次数")
      //   //console.log('Connected:' + frame);
      //   //通过stompClient.subscribe订阅/topic/getResponse 目标(destination)发送的消息
      //   stompClient.subscribe('/platform/'+that.platformId+"/message",function(response){
      //
      //     //console.log("res==="+response.body)
      //     var str = response.body;
      //     if(str.indexOf("report")>-1) {   //位置更新
      //       var str2 = str;
      //       var strArray = str2.split("_");
      //       var reportName = strArray[2];
      //       var eventTypeName = strArray[3];
      //       //提示
      //       var messageInfo = reportName + "上报了" + eventTypeName + "工单";
      //
      //       //alert(messageInfo)
      //       that.$notify({
      //         title: '有新的工单上报',
      //         message: "<a href='http://scg.chinaemt.com/#/word-manager/wordmanager'>" + messageInfo + "</a>",
      //         dangerouslyUseHTMLString: true,
      //         position: 'bottom-right'
      //       });
      //
      //       //更新
      //       that.getDataList();
      //     }
      //
      //
      //   });
      // });
    },

    // 连接
    connection() {
      var that = this;

      // 连接SockJS的endpoint名称为"endpointOyzc"
      //var socket = new SockJS('http://127.0.0.1:8888/endpointOyzc');
      var socket = new SockJS(
        `${window.SITE_CONFIG.websocket}`
      );

      // 使用STMOP子协议的WebSocket客户端
      var stompClient = Stomp.over(socket);
      this.globalStompClient = stompClient;
      // 连接WebSocket服务端
      stompClient.connect({}, function (frame) {
        // console.log("执行次数");
        // console.log('Connected:' + frame);
        // 通过stompClient.subscribe订阅/topic/getResponse 目标(destination)发送的消息
        stompClient.subscribe(
          "/platform/" + that.platformId + "/message",
          function (response) {
            // console.log("res==="+response.body)
            var str = response.body;
            if (str.indexOf("report") > -1) {
              // 位置更新
              var str2 = str;
              var strArray = str2.split("_");
              var reportName = strArray[2];
              var eventTypeName = strArray[3];
              // 提示
              var messageInfo = reportName + "上报了" + eventTypeName + "工单";

              // alert(messageInfo)
              that.$notify({
                title: "有新的工单上报",
                message:
                  "<a href='http://scg.chinaemt.com/#/word-manager/wordmanager'>" +
                  messageInfo +
                  "</a>",
                dangerouslyUseHTMLString: true,
                position: "bottom-right",
              });

              // 更新
              that.getDataList();
            }
          }
        );
      });
    },
    // 断开连接
    disconnect() {
      if (this.globalStompClient != null) {
        this.globalStompClient.disconnect();
      }
      // console.log("Disconnected");
    },

    // 初始化数据
    getDataList() {
      // 判断类型
      if (this.eventTypeId == null || this.eventTypeId == "") {
        this.eventTypeId = 0;
      }

      //判断镇街
      if (this.shareTownId == null || this.shareTownId == "") {
        this.shareTownId = 0;
      }

      if (this.sharePatformId == null || this.sharePatformId == "") {
        // 本平台id,27是增城的，解决上级查看全部共享的平台数据
        // if(this.platformId == 27){
        //   this.sharePatformId = 0
        // }else{
        //   this.sharePatformId = this.platformId
        // }

        // 查出本平台的共享平台
        this.$http({
          async: false,
          url: this.$http.adornUrl(
            "/event/eventShare/selectShareMenuPlatformByMenuId"
          ),
          method: "post",
          params: this.$http.adornParams({
            myPlatformId: this.$store.state.user.platformId,
          }),
        }).then(({ data }) => {
          if (data && data.code === 0) {
            // 说明有共享数据
            if (data.list.length > 0) {
              // 先清空
              this.sharePlatfromArray = [];

              for (var i = 0; i < data.list.length; i++) {
                var id = data.list[i].linkagePlatformId;
                this.sharePlatfromArray.push(id);
              }
              // 调用获取全部工单数据
              this.getAllData(this.activeName);
            }
          } else {
            this.$message.error(data.msg);
          }
        });
      } else {
        // 先清空
        this.sharePlatfromArray = [];
        this.sharePlatfromArray.push(this.sharePatformId);
        // 调用获取全部工单数据
        this.getAllData(this.activeName);
      }
    },

    // 下载工单数据
    downloadWordExcel() {
      // 判断类型
      if (this.eventTypeId == null || this.eventTypeId == "") {
        this.eventTypeId = 0;
      }

      //判断镇街
      if (this.shareTownId == null || this.shareTownId == "") {
        this.shareTownId = 0;
      }

      if (this.sharePatformId == null || this.sharePatformId == "") {
        // 查出本平台的共享平台
        this.$http({
          async: false,
          url: this.$http.adornUrl(
            "/event/eventShare/selectShareMenuPlatformByMenuId"
          ),
          method: "post",
          params: this.$http.adornParams({
            myPlatformId: this.$store.state.user.platformId,
          }),
        }).then(({ data }) => {
          if (data && data.code === 0) {
            // 说明有共享数据
            if (data.list.length > 0) {
              // 先清空
              this.sharePlatfromArray = [];

              for (var i = 0; i < data.list.length; i++) {
                var id = data.list[i].linkagePlatformId;
                this.sharePlatfromArray.push(id);
              }
              // 调用获取全部工单数据
              this.getDownloadData();
            }
          } else {
            this.$message.error(data.msg);
          }
        });
      } else {
        // 先清空
        this.sharePlatfromArray = [];
        this.sharePlatfromArray.push(this.sharePatformId);
        // 调用获取全部工单数据
        this.getDownloadData();
      }
    },

    // 获取全部工单数据
    getAllData(flagType) {
      // console.log(flagType)
      this.platformTypeId = flagType;
      if (flagType === "0") {
        flagType = "";
      }
      if (
        flagType == "3" ||
        flagType == "4" ||
        flagType == "8" ||
        flagType == "9"
      ) {
        this.platformTypeId = "3";
      }
      if (flagType === "5") {
        this.platformTypeId = "5";
      }
      if (flagType === "6") {
        flagType = "5";
        this.platformTypeId = "6";
      }
      // console.log(
      //   "getAllData获取全部工单数据",
      //   this.status,
      //   this.pageIndex,
      //   this.pageSize
      // );
      //flagType放开数据限制 flagType: 0,
      let eventInfoConditionEntity = {
        flagType,
        flagType,
        keyword: this.searchTitle,
        startTime: this.startTime,
        endTime: this.endTime,
        eventTypeId: this.eventTypeId,
        townId: this.shareTownId,
        platformIds: this.sharePlatfromArray,
        status: this.status,
        pageIndex: this.pageIndex,
        pageSize: this.pageSize,
        platformTypeId: this.platformTypeId,
      };

      this.$http({
        url: this.$http.adornUrl("/event/eventinfo/listByConditions"),
        method: "post",
        data: this.$http.adornData(eventInfoConditionEntity, false),
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.tableDataDisplay = data.list;
          this.totalPage = data.totalPage;
          // console.log("listByConditions,listByConditions", data);
          // switch (status) {
          //   case null:
          //     this.tableAllData = data.list
          //     this.totalPage = data.totalPage
          //     break
          //   case '1':
          //     this.tableWaitVerifyData = data.list
          //     this.totalPage = data.totalPage
          //     break
          //   case '2':
          //     this.tableVerifyingData = data.list
          //     this.totalPage = data.totalPage
          //     break
          //   case '3':
          //     this.tableWaitDisposeData = data.list
          //     this.totalPage = data.totalPage
          //     break
          //   case '4':
          //     this.tableDisposeingData = data.list
          //     this.totalPage = data.totalPage
          //     break
          //   case '5':
          //     this.tableDisposedData = data.list
          //     this.totalPage = data.totalPage
          //     break
          //   case '0':
          //     this.tableClosedData = data.list
          //     this.totalPage = data.totalPage
          //     break
          //   case '6':
          //     this.tableOutRangeData = data.list
          //     this.totalPage = data.totalPage
          //     break
          //   default:
          //     break

          // }

          // // 计算当前页面显示的数据
          // let obj = {
          //   //status = null
          //   first: 'tableAllData',
          //   //status = 1
          //   second: 'tableWaitVerifyData',
          //   //status = 2
          //   third: 'tableVerifyingData',
          //   //status = 3
          //   fourth: 'tableWaitDisposeData',
          //   //status = 4
          //   fire: 'tableDisposeingData',
          //   //status = 5
          //   six: 'tableDisposedData',
          //   //status = 0
          //   seven: 'tableClosedData',
          //   //status = 6
          //   eight: 'tableOutRangeData'
          // }

          // this.handleCalculate(obj[this.activeName])
        } else {
          this.$message.error(data.msg);
        }
      });
    },

    // 获取下载工单表格的数据
    getDownloadData() {
      // console.log("获取下载工单表格的数据接口", this.sharePlatfromArray);
      console.log("数据类型", this.flagType, this.activeName);
      //flagType放开数据限制 flagType: 0,
      let eventInfoConditionEntity = {
        keyword: this.searchTitle,
        startTime: this.startTime,
        endTime: this.endTime,
        eventTypeId: this.eventTypeId,
        townId: this.shareTownId,
        platformIds: this.sharePlatfromArray,
        flagType: this.activeName,
        platformTypeId: this.platformTypeId,
        status: this.status,
        flag: 1,
      };

      this.$http({
        url: this.$http.adornUrl("/event/eventinfo/exportEventData"),
        method: "post",
        data: this.$http.adornData(eventInfoConditionEntity, false),
        responseType: "blob",
      }).then(({ data }) => {
        let eleLink = document.createElement("a");
        let url = window.URL.createObjectURL(data);
        let name = "工单统计.xls";
        eleLink.href = url;
        eleLink.download = name;
        document.body.appendChild(eleLink);
        eleLink.click();
        window.URL.revokeObjectURL(url);
      });
    },

    handleCalculate(data) {
      // 分页数据获取
      // this.totalPage = this.totalPage;
      // this.tableDataDisplay = this[data];
      // this.tableDataDisplay = this[data].slice(
      //   (this.pageIndex - 1) * this.pageSize,
      //   this.pageSize * this.pageIndex
      // )
    },

    // 判断当前在哪个table中
    handleJudge() {
      // console.log("判断当前在哪个table中:",this.activeName)
      // switch (this.activeName) {
      //   case 'first':
      this.getAllData(this.activeName);
      //     break
      //   case 'second':
      //     this.getAllData('1')
      //     break
      //   case 'third':
      //     this.getAllData('2')
      //     break
      //   case 'fourth':
      //     this.getAllData('3')
      //     break
      //   case 'fire':
      //     this.getAllData('4')
      //     break
      //   case 'six':
      //     this.getAllData('5')
      //     break
      //   case 'seven':
      //     this.getAllData('0')
      //     break
      //   case 'eight':
      //     this.getAllData('6')
      //     break
      //   default:
      //     break

      // }

      // let obj = {
      //   //status = null
      //   first: 'tableAllData',
      //   //status = 1
      //   second: 'tableWaitVerifyData',
      //   //status = 2
      //   third: 'tableVerifyingData',
      //   //status = 3
      //   fourth: 'tableWaitDisposeData',
      //   //status = 4
      //   fire: 'tableDisposeingData',
      //   //status = 5
      //   six: 'tableDisposedData',
      //   //status = 0
      //   seven: 'tableClosedData',
      //   //status = 6
      //   eight: 'tableOutRangeData'
      // }

      // this.handleCalculate(obj[this.activeName])
    },

    // 卡片点击事件
    cardHandleClick(tab, event) {
      // table 切换时,把当前页设置成 1
      // console.log("卡片点击事件");
      this.pageIndex = 1;
      this.handleJudge();
    },

    // 子组件点击查看，触发父组件方法"
    formFindHandleClick(row) {
      // 查看
      // console.log("点击查看", row);
      this.wordMangerViewVisible = true;
      this.$nextTick(() => {
        this.$refs.wordManagerView.init(row);
      });
    },

    formUpgradeHandleClick(row) {
      // 编辑
      // console.log(row);
      this.wordMangerUpgradeVisible = true;
      this.$nextTick(() => {
        this.$refs.wordManagerUpgrade.init(row);
      });
    },

    // 点击上报信息提示的a标签，跳转路由
    messageInfoClick() {
      this.$router.push({
        path: "/event-info/eventinfo",
      });
    },
    formReminderlHandleClickNew(r) {
      const row = r;
      row.eventType = 1;
      this.urgeVisible = true;
      // console.log('eventNew', row);
      this.$nextTick(() => {
        this.$refs.wordManagerUrge.init(row);
      });
    },
    // 处理
    formResolveHandleClick(r) {
      const row = r;
      this.$http({
        url: this.$http.adornUrl('/event/eventinfo/resolveEvent'),
        method: 'get',
        params: this.$http.adornParams({
          eventId: row.id,
        }),
      }).then(({ data }) => {
        if (data && data.code === 0) {
          // this.$message({
          //   message: '操作成功',
          //   type: 'success',
          //   duration: 1500,
          //   onClose: () => {
          //     this.visible = false;
          //     this.getDataList();
          //   },
          // });
          this.resolveUrl = data.data.operationUrl;
          // console.log('处理工单', this.resolveUrl);
          // window.open(this.resolveUrl);
          window.location.href = this.resolveUrl;
        } else {
          this.$message.error(data.msg);
        }
      });
    },

    formReminderlHandleClick(r) {
      const row = r;
      row.eventType = 0;
      this.urgeVisible = true;
      // console.log('event', row);
      this.$nextTick(() => {
        this.$refs.wordManagerUrge.init(row);
      });
    },

    formCloseHandleClick(row) {
      // 关闭
      // console.log(row);
      // 关闭状态
      this.$http({
        url: this.$http.adornUrl(`/event/eventinfo/updateEventInfoIsClose`),
        method: "post",
        params: this.$http.adornParams({
          isClose: 0,
          eventInfoId: row.id,
        }),
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.$message({
            message: "操作成功",
            type: "success",
            duration: 1500,
            onClose: () => {
              this.visible = false;
              this.getDataList();
            },
          });
        } else {
          this.$message.error(data.msg);
        }
      });
    },

    // 调查问卷
    formSurveyHandleClick(row) {
      // 调查反馈
      // console.log(row);
      this.wordMangerSurveyVisible = true;
      this.$nextTick(() => {
        this.$refs.wordManagerSurvey.init(row);
      });
    },

    // 核实、派单
    formManuaVerifylHandleClick(row) {
      // console.log(row);
      this.wordManagerVerifyVisible = true;
      this.$nextTick(() => {
        this.$refs.wordManagerVerify.init(row);
      });
    },

    // 审批
    formExaminationlHandleClick(row) {
      // console.log(row);
      this.wordManagerExaminationVisible = true;
      this.$nextTick(() => {
        this.$refs.wordManagerExamination.init(row);
      });
    },

    // 根据时间条件查询
    searchHandle(
      objTime,
      objContent,
      objPlatformId,
      objTypearray,
      shareTownId,
      status,
      platformTypeId
    ) {
      // console.log(
      //   objTime,
      //   objContent,
      //   objPlatformId,
      //   objTypearray,
      //   shareTownId,
      //   status,
      //   platformTypeId
      // );
      var objEventTypeId;
      if (objTypearray != null && objTypearray != "") {
        // objPlatformId是共享平台的id
        var typearray = objTypearray.slice(-1).join(",");
        objEventTypeId = Number(typearray);
      } else {
        objEventTypeId = 0;
      }

      var startTime;
      var endTime;
      if (objTime != null && objTime != "") {
        // 时间不为空
        startTime = objTime[0];
        endTime = objTime[1];
      } else {
        startTime = "";
        endTime = "";
      }

      this.sharePatformId = objPlatformId;
      this.eventTypeId = objEventTypeId;
      this.startTime = startTime;
      this.endTime = endTime;
      this.searchTitle = objContent;
      this.shareTownId = shareTownId;
      this.status = status;
      this.platformTypeId = platformTypeId;

      // console.log("条件查询条件查询条件查询", startTime, endTime);
      //初始化条件
      this.pageIndex = 1;
      this.getDataList();
    },
    // 根据时间条件查询
    exportEventData(
      objTime,
      objContent,
      objPlatformId,
      objTypearray,
      shareTownId
    ) {
      var objEventTypeId;
      if (objTypearray != null && objTypearray != "") {
        // objPlatformId是共享平台的id
        var typearray = objTypearray.slice(-1).join(",");
        objEventTypeId = Number(typearray);
      } else {
        objEventTypeId = 0;
      }

      var startTime;
      var endTime;
      if (objTime !== null || objTime !== "") {
        // 时间不为空
        startTime = objTime[0];
        endTime = objTime[1];
      } else {
        startTime = "";
        endTime = "";
      }

      this.sharePatformId = objPlatformId;
      this.eventTypeId = objEventTypeId;
      this.startTime = startTime;
      this.endTime = endTime;
      this.searchTitle = objContent;
      this.shareTownId = shareTownId;
      this.downloadWordExcel();
    },

    // 新增跳转路由
    addOrUpdateHandle(obj, flag) {
      this.$router.push({
        path: "/event-info/eventinfo",
      });
    },

    // 当前显示条数
    sizeChangeHandle(val) {
      this.pageSize = val;
      this.pageIndex = 1;
      this.handleJudge();
      // console.log("当前显示条数", val);
    },
    // 当前页
    currentChangeHandle(val) {
      this.pageIndex = val;
      this.handleJudge();
      // console.log("当前页当前页当前页", val);
    },
  },
};
</script>

<style lang="scss">
.word-manager {
  height: initial !important;
  .el-table th {
    color: #656565;
    background: rgba(230, 230, 230, 1) !important;
  }

  .el-table__body tbody > :nth-child(2n) {
    background: rgb(248, 248, 248);
  }
  // .el-header.left{
  //   height: inherit;
  // }
  .el-tabs--card > .el-tabs__header {
    border: none !important;
    .el-tabs__nav {
      border: none;
    }
    .el-tabs__item {
      border: none;
    }
  }

  .el-tabs__header
    .el-tabs__nav-wrap
    .el-tabs__nav-scroll
    .el-tabs__nav
    .el-tabs__item.is-top.is-closable.is-active,
  .el-tabs__header
    .el-tabs__nav-wrap
    .el-tabs__nav-scroll
    .el-tabs__nav
    .el-tabs__item.is-top.is-active {
    color: #fff;
    background-color: #00a9f2;
  }
}
</style>
