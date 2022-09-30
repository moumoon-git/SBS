<!--事件接报-信息报送-->
<template>
  <div class="informationReception_wrap">
    <el-row style="display: flex; height: 100%">
      <el-col>
        <div
          style="
            height: 96%;
            display: flex;
            flex-direction: column;
          "
          class="flex_wrap"
        >
          <div class="commonInfo" :style="{height:(activeAllModel=='电话'?'699px':'640px')}">
            <div class="phoneHeader">
                <el-radio-group class="phoneHeaderRadio" v-model="activeAllModel">
                  <el-radio-button label="电话"></el-radio-button>
                  <el-radio-button label="短信"></el-radio-button>
                </el-radio-group>
              
              <!--头部-->
              <div class="phoneIndex_header" v-if="activeAllModel=='电话'">
                <div class="phoneIndex_header_Tab" @click="tabShortcutGroup">
                  <img v-if="!tabObj.shortcutGroup" src="/static/img/Communihistory/shortcutGroup.png" alt="">
                  <img v-else src="/static/img/Communihistory/shortcutGroupHover.png" alt="">
                  <span>快捷组</span>
                </div>
                <div class="phoneIndex_header_Tab" @click="tabCommon">
                  <img v-if="!tabObj.common" src="/static/img/Communihistory/common.png" alt="">
                  <img v-else src="/static/img/Communihistory/common1.png" alt="">
                  <span>{{ IsShenzhenProject ? '政务联络网' : '通讯录' }}</span>
                </div>
                <div class="phoneIndex_header_Tab" @click="tabRecently">
                  <img v-if="!tabObj.recently" src="/static/img/Communihistory/recently.png" alt="">
                  <img v-else src="/static/img/Communihistory/recently1.png" alt="">
                  <span>最近联系人</span>
                </div>
              </div>
            </div>
            <!--内容-->
            <div class="phoneIndex_content" v-if="activeAllModel=='电话'">
              <!-- 架构-->
              <div class="framework" v-if="eleFlagHumanFlag">
                <div>
                  <el-tree
                    :data="data"
                    :props="defaultProps"
                    accordion
                    ref="tree"
                    @node-click="handleNodeClickZuZhi"
                    :default-checked-keys="groupId"
                    :default-expanded-keys="groupId">
                  </el-tree>
                </div>

                <div class="framework_right">

              <div class="framework_right_header">
                <div>
                  <el-input
                    placeholder="请输入关键字搜索"
                    suffix-icon="el-icon-search"
                    v-model="input"
                    @keyup.enter.native="searchBtn"
                  >
                  </el-input>
                  <button @click="searchBtn"></button>
                </div>
                <img @click="cellPhoneNumFlag=!cellPhoneNumFlag"
                    src="/static/img/Communihistory/sudoku.png" alt="">
                <div class="cellPhoneNum" v-show="cellPhoneNumFlag">
                  <dialPlate ref="dialPlate" @dialing="dialing"></dialPlate>
                </div>
              </div>
              <!--渲染的列表-->
              <div class="framework_right_content">

                <div class="framework_right_content_list" v-for="(item ,index) in organizationData" :key="index">
                  <div class="framework_right_content_list_left">
                    <div>{{item.name}} {{item.position}}</div>
                    <div> {{item.workUnit}}</div>
                  </div>

                  <div class="framework_right_content_list_right">
                    <div class="selectPhone">
                      <el-dropdown
                        trigger="click"
                        @visible-change="visMoreList($event,0)">
                          <span class="el-dropdown-link">
                            ...
                          </span>
                        <el-dropdown-menu slot="dropdown">
                          <el-dropdown-item>
                            <div class="selectPhoneCell" v-if="item.phoneAllObj.mobile">
                              <span>手机号码：{{item.phoneAllObj.mobile}}</span>
                              <img @click="callPhone(item.phoneAllObj.mobile)"
                                  src="/static/img/Communihistory/cell1.png" alt="">
                            </div>
                            <div class="selectPhoneCell" v-if="item.phoneAllObj.otherTel">
                              <span>备用号码：{{item.phoneAllObj.otherTel}}</span>
                              <img @click="callPhone(item.phoneAllObj.otherTel)"
                                  src="/static/img/Communihistory/cell1.png" alt="">
                            </div>
                            <div class="selectPhoneCell" v-if="item.phoneAllObj.officeTel">
                              <span>办公电话：{{item.phoneAllObj.officeTel}}</span>
                              <img @click="callPhone(item.phoneAllObj.officeTel)"
                                  src="/static/img/Communihistory/cell1.png" alt="">
                            </div>
                            <div class="selectPhoneCell" v-if="item.phoneAllObj.homeTel">
                              <span>应急电话：{{item.phoneAllObj.homeTel}}</span>
                              <img @click="callPhone(item.phoneAllObj.homeTel)"
                                  src="/static/img/Communihistory/cell1.png" alt="">
                            </div>
                            <div class="selectPhoneCell" v-if="item.phoneAllObj.otherTel2">
                              <span>其他电话：{{item.phoneAllObj.otherTel2}}</span>
                              <img @click="callPhone(item.phoneAllObj.otherTel2)"
                                  src="/static/img/Communihistory/cell1.png" alt="">
                            </div>
                            <div class="selectPhoneCell"
                                v-if="!item.phoneAllObj.mobile&&!item.phoneAllObj.otherTel&&!item.phoneAllObj.officeTel&&!item.phoneAllObj.number&&!item.phoneAllObj.otherTel2">
                              暂无更多
                            </div>

                          </el-dropdown-item>
                        </el-dropdown-menu>
                      </el-dropdown>
                    </div>
                    <div class="cellPhoneImg" @click="callPhoneAssign(item)"></div>
                  </div>

                </div>

              </div>
              <!--页脚-->
              <div class="framework_right_footer">
                <span>/</span>
                <el-pagination
                  @size-change="handleSizeChange"
                  @current-change="handleCurrentChange"
                  :current-page.sync="organization.page"
                  :page-size="10"
                  layout="prev, pager, next, jumper"
                  :total="organization.total">
                </el-pagination>
              </div>
                </div>
              </div>
              <!--常用和最近联系人-->
              <div class="commonAndRecently" v-if="!eleFlagHumanFlag">
                <!--渲染列表-->
                <div class="commonAndRecently_content">
                  <div v-for="(item ,index) in theOrganizationData" :key="index" class="framework_right_content_list">
                    <div class="framework_right_content_list_left">
                      <div>{{item.name || item.contactor || call}} {{item.position}}</div>
                      <div> {{item.workUnit}}</div>
                    </div>

                    <div class="framework_right_content_list_right">
                      <div class="selectPhone">
                        <el-dropdown
                          trigger="click"
                          @visible-change="visMoreList($event,0)">
                              <span class="el-dropdown-link">
                                ...
                              </span>
                          <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item>
                              <div class="selectPhoneCell" v-if="item.phoneAllObj.mobile">
                                <span>手机号码：{{item.phoneAllObj.mobile}}</span>
                                <img @click="callPhone(item.phoneAllObj.mobile)"
                                    src="/static/img/Communihistory/cell1.png" alt="">
                              </div>
                              <div class="selectPhoneCell" v-if="item.phoneAllObj.otherTel">
                                <span>备用号码：{{item.phoneAllObj.otherTel}}</span>
                                <img @click="callPhone(item.phoneAllObj.otherTel)"
                                    src="/static/img/Communihistory/cell1.png" alt="">
                              </div>
                              <div class="selectPhoneCell" v-if="item.phoneAllObj.officeTel">
                                <span>办公电话：{{item.phoneAllObj.officeTel}}</span>
                                <img @click="callPhone(item.phoneAllObj.officeTel)"
                                    src="/static/img/Communihistory/cell1.png" alt="">
                              </div>
                              <div class="selectPhoneCell" v-if="item.phoneAllObj.homeTel">
                                <span>应急电话：{{item.phoneAllObj.homeTel}}</span>
                                <img @click="callPhone(item.phoneAllObj.homeTel)"
                                    src="/static/img/Communihistory/cell1.png" alt="">
                              </div>
                              <div class="selectPhoneCell" v-if="item.phoneAllObj.otherTel2">
                                <span>其他电话：{{item.phoneAllObj.otherTel2}}</span>
                                <img @click="callPhone(item.phoneAllObj.otherTel2)"
                                    src="/static/img/Communihistory/cell1.png" alt="">
                              </div>
                              <div class="selectPhoneCell"
                                  v-if="!item.phoneAllObj.mobile&&!item.phoneAllObj.otherTel&&!item.phoneAllObj.officeTel&&!item.phoneAllObj.number&&!item.phoneAllObj.otherTel2">
                                暂无更多
                              </div>
                            </el-dropdown-item>
                          </el-dropdown-menu>
                        </el-dropdown>
                      </div>
                      <div class="cellPhoneImg" @click="callPhoneAssign(item)"></div>
                    </div>

                  </div>
                </div>
                <!--页脚-->
                <!-- <div class="framework_right_footer commonAndRecently_footer">
                  <span>/</span>
                  <el-pagination
                    @size-change="latelyHandleSizeChange"
                    @current-change="latelyHandleCurrentChange"
                    :current-page.sync="lately.page"
                    :page-size="14"
                    layout="prev, pager, next, jumper"
                    :total="lately.total">
                  </el-pagination>
                </div> -->

              </div>
            </div>
            <div style="height: 100%" class="MessageHandling" v-if="activeAllModel=='短信'">
              <smsRight ref="smsRight" :selectContact="true"></smsRight>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
    <!--弹出事件列表关联-->
    <el-dialog
      title="关联事件"
      :visible.sync="eventList"
      :close-on-click-modal="false"
      append-to-body
      left
      :before-close="beforeClose"
      v-if="rushKist"
    >
      <div>
        <el-table
          :data="gridData"
          stripe
          border
          v-loading="myLoading"
          highlight-current-row
          @row-click="rowClick"
        >
          <el-table-column
            property="title"
            label="事件标题"
            min-width="250"
          ></el-table-column>
          <el-table-column
            property="caseClass"
            label="事件类型"
            min-width="250"
          ></el-table-column>
          <el-table-column
            property="occurTime"
            label="事发时间"
            min-width="250"
          ></el-table-column>
          <el-table-column
            property="receiveOperator"
            label="接报人"
            min-width="100"
          ></el-table-column>
        </el-table>
        <el-pagination
          :page-size="pageSize"
          :total="total"
          :current-page.sync="currentPage"
          @current-change="getTabDatas"
          layout="total, prev, pager, next, jumper"
        ></el-pagination>
      </div>

      <div slot="footer" class="dialog-footer">
        <el-button @click="colser" size="mini">取 消</el-button>
        <el-button type="primary" @click="cufim" size="mini">确 定</el-button>
      </div>
    </el-dialog>

    <!--选择弹窗组件-->
    <add-dialog
      @closeDialog="closeDialog"
      @confirm="confirm"
      @close="close"
      ref="eventDialog"
      :title="title"
      :addEventDialog="addEventDialog"
      @handleNodeClick="handleNodeClick"
    ></add-dialog>

    <!--选择事发地点-->
    <location ref="loction" :mapframe="mapId"></location>

    <!--添加号码对话框-->
    <el-dialog
      :visible.sync="isAddPhonesShow"
      width="30%"
      :close-on-click-modal="false"
    >
      <div slot="title" class="dialog-header">添加号码</div>
      <el-input
        type="textarea"
        resize="none"
        :autosize="{ minRows: 4, maxRows: 4 }"
        v-model="phonesText"
        placeholder="请输入号码，多个号码使用“，”隔开"
      ></el-input>
      <div slot="footer" class="dialog-footer">
        <el-button @click="submitClose">取 消</el-button>
        <el-button type="primary" @click="submitPhones">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import smsRight from "@/view/yz_integratedCommunication/icpPhone/icpPhonePage/smsStep/smsRight";
import phoneHistoryIndex from "@/view/yz_eventManagement/informationDisposal/communicationHistory/phoneHistoryIndex";
import msgHistonryIndex from "@/view/yz_eventManagement/informationDisposal/communicationHistory/msgHistonryIndex";
import faxRight from "@/view/yz_integratedCommunication/icpPhone/icpPhonePage/faxStep/faxRight";
import newFaxModel from "@/view/yz_eventManagement/eventRegistration/newModel/newFaxModel";
import newSmsModel from "@/view/yz_eventManagement/eventRegistration/newModel/newSmsModel";
import audioPlan from "@/view/yz_eventManagement/informationDisposal/audioPlan";
import mergeFaxDialog from "@/view/yz_eventManagement/informationDisposal/mergeFaxDialog";
import resolution from "@/view/yz_eventManagement/informationDisposal/resolution";
import imgToText from "@/view/yz_eventManagement/informationDisposal/imgToText";
import Location from "@/yz_components/loction/loction"; //定位
import addDialog from "@/view/yz_eventManagement/eventReports/dialog/eventDialog"; //联系人及其她选择弹窗
import InformaHistory from "@/view/yz_eventManagement/informationDisposal/communicationHistory/comonnTemplat/InformaHistory"; // 传真历史
import axios from "axios";
import Qs from "qs";
import bus from "@/yz_components/common/js/eventBus";
import dialPlate from "@/yz_components/dialPlate";
import mixin from "@/view/yz_integratedCommunication/icpPhone/icpPhonePage/mixin";
import mixin2 from '@/view/yangZhouEventReports/assets/js/mixin/mixin.js';

export default {
  mixins: [mixin, mixin2],
  name: "commonSubmissionReview",
  components: {
    smsRight,
    newFaxModel,
    Location,
    addDialog,
    audioPlan,
    faxRight,
    phoneHistoryIndex,
    msgHistonryIndex,
    mergeFaxDialog,
    resolution,
    imgToText,
    InformaHistory,
    dialPlate
  },
  data() {
    return {
      props: {
        value: "id",
        label: "name",
        checkStrictly: true,
      },
      jurisdictionData: [], // 所属区域
      reportingUnitData: [], // 报告单位
      eventTypeData: [], // 事件类型
      beOnDutyVisible: false, // 值班员弹窗
      leaderOnDutyVisible: false, // 值班领导弹窗
      isShowEventReportDialog: false, // 是否显示事件上报弹窗
      ruleForm: {
        eventTitle: "",
        reportedTime: "",
        incidentTime: "",
        incidenArea: [],
        incidentSite: "",
        reportingUnit: [],
        incidenType: [],
        serialNumber: "",
        reportSituation: "",
        allCase: "",
        speakerName: "",
        speakerPhone: "",

        // incidentRank: '',

        timeOfWrittenSubmission: "",
        accidentSituation: "",
        beOnDuty: sessionStorage.getItem("displayname"),
        beOnDutyIds: [],
        leaderOnDuty: "",
        leaderOnDutyIds: [],
        submissionMethod: "",

        deathToll: "",
        bruiseToll: "",
        disappearToll: "",

        deathNum: "",
        injuredNum: "",
      },
      rules: {
        // eventTitle: [{required: true, message: "不能为空", trigger: "blur"}],
        reportedTime: [
          { required: true, message: "不能为空", trigger: "blur" },
        ],
        incidentTime: [
          { required: true, message: "不能为空", trigger: "blur" },
        ],
        timeOfWrittenSubmission: [
          { required: true, message: "不能为空", trigger: "blur" },
        ],
        incidenArea: [{ required: true, message: "不能为空", trigger: "blur" }],
        incidentSite: [
          { required: true, message: "不能为空", trigger: "blur" },
        ],
        reportSituation: [
          { required: true, message: "不能为空", trigger: "blur" },
        ],
        submissionMethod: [
          { required: true, message: "不能为空", trigger: "blur" },
        ],
        accidentSituation: [
          { required: true, message: "不能为空", trigger: "blur" },
        ],
        reportingUnit: [
          { required: true, message: "不能为空", trigger: "blur" },
        ],
        beOnDuty: [{ required: true, message: "不能为空", trigger: "blur" }],
        leaderOnDuty: [
          { required: true, message: "不能为空", trigger: "blur" },
        ],
        incidenType: [{ required: true, message: "不能为空", trigger: "blur" }],
        deathToll: [{ required: true, message: "不能为空", trigger: "blur" }],
        bruiseToll: [{ required: true, message: "不能为空", trigger: "blur" }],
        disappearToll: [
          { required: true, message: "不能为空", trigger: "blur" },
        ],
        allCase: [{ message: "" }],
      },
      dataALL: {
        eventTitle: "",
        reportedTime: "",
        incidentTime: "",
        incidenArea: [],
        incidentSite: "",
        reportingUnit: [],
        incidenType: [],
        serialNumber: "",
        reportSituation: "",
        allCase: "",
        speakerName: "",
        speakerPhone: "",

        // incidentRank: '',

        timeOfWrittenSubmission: "",
        accidentSituation: "",
        beOnDuty: "",
        beOnDutyIds: [],
        leaderOnDuty: "",
        leaderOnDutyIds: [],
        submissionMethod: "",

        deathToll: "",
        bruiseToll: "",
        disappearToll: "",

        deathNum: "",
        injuredNum: "",
      },
      faxStateData: [
        {
          value: "选项1",
          label: "黄金糕",
        },
        {
          value: "选项2",
          label: "双皮奶",
        },
        {
          value: "选项3",
          label: "蚵仔煎",
        },
        {
          value: "选项4",
          label: "龙须面",
        },
        {
          value: "选项5",
          label: "北京烤鸭",
        },
      ],
      faxStateData: [
        {
          value: "选项1",
          label: "黄金糕",
        },
        {
          value: "选项2",
          label: "双皮奶",
        },
        {
          value: "选项3",
          label: "蚵仔煎",
        },
        {
          value: "选项4",
          label: "龙须面",
        },
        {
          value: "选项5",
          label: "北京烤鸭",
        },
      ],
      faxStateValue: "",
      faxTypeValue: "",
      activeAllModel: "电话", //右边tabs选项
      leftTabsType: "传真", //左边tabs选项
      allFpxPreviewPath: "", //allModel选中传真的传真预览地址
      queryFaxAllTime: "", //allModel传真查询时间
      queryFaxAllSelect: "", //allModel传真下拉选中
      faxAllSelectData: "", //allModel传真获取到的数据
      list: [],
      pageFaxSize: 10, //传真MODEL分页
      totalFax: 0, //传真MODEL分页
      currentFaxPage: 1, //传真MODEL分页
      bodyStyle: {
        padding: "10px 15px",
        backgroundColor: "transparent",
        cursor: "pointer",
      }, //cred 默认的样式
      changeIndex: -1, //更改背景颜色
      eventList: false, //关联事件弹窗
      pageSize: 10,
      currentPage: 1,
      total: 0,
      rushKist: true,
      gridData: [],
      myLoading: {
        type: Boolean,
        default: false,
      },
      elTablePlanStyle: {
        height: "", //中间的高度
      },
      elTablePlanStyleNext: {
        height: "",
        padding: "10px",
      },
      heightStyle: {
        height: "",
      },
      infoEnteringStyle: {
        height: "",
      },
      eventEnteringStyle: {
        height: "",
      },
      rightHeightStyle: {
        height: "",
        display: "flex",
        "flex-direction": "column",
      },
      listHeight: {
        height: "",
      },
      saveEntering: {
        height: "",
      },
      turnTheText: {
        height: "",
      },
      changeRed: "信息处置", //默认显示信息处置
      InformationDisposalShow: true, //默认显示信息处置
      eventEnteringShow: false, //默认隐藏录入事件
      infoEnteringShow: false, // 默认隐藏信息登记
      eventsParameters: false, //情景要素是否显示
      parameter: [], //情景要素参数
      audioList: {
        //音频组件地址,只能传递一个,如果需要传递多个,可以自己修改源码  换成数组或者json
        url: "",
        //这个音频文件的长度,因为一般都是异步获取到音频地址才能初始化audio的,所以这个参数父传递给子合适点
        totalTime: "",
      },
      dialogVisible: false,
      editIndex: "",
      options: "",
      selectState: "",
      textShow: "",
      row: "", //当前选中的事件
      nowTag: "fax", //当前的tag是传真、电话还是短信
      id: "", //当前左侧选中的的列表
      phoneText: "",
      smsText: "",
      addEventDialog: false, //选择是否弹窗
      title: "", //选择弹窗标题
      eventTree: [], //事件区域选中数据
      eventAddressBook: [], //事件联系人选中数据
      eventTypeList: [], //事件类型选中数据
      eventType: [], //事件类型存储
      longitude: "", //经度
      latitude: "", //纬度
      asterisk: false,
      caseid: "", //事件类型ID
      addClass: "", //匹配出来的事件模板内容
      gutter: 20,
      audioShow: false,
      leftEventId: "",
      imgToTextId: 0,
      testAudio: false, //
      audioUrlData: "",
      audioId: "",
      mapId: "informId",
      phonePerson: "", //电话联系人
      treeLoading: true, //传真loading加载
      phoneTreeLoading: true, //电话loading加载
      smsTreeLoading: true, //短信loading加载
      phoneRushe: true, //刷新电话预览
      backSms: {
        //短信区域给一个背景图
        background: "",
        backgroundSize: "",
      },
      backPhone: {
        //短信区域给一个背景图
        background: "",
        backgroundSize: "",
      },
      faxcontactId: "", //传真一键识别用来查询联系人
      audioPlanData: "", //存储录音实例
      rushFaxData: "", //刷新传真编辑的内容

      phonesText: "",
      isAddPhonesShow: false,
      faxForm: {
        id: "",
        phone: "",
        unit: "",
        time: "",
        event: "",
        status: "",
        type: null,
        title: null,
        result: null,
        eventId: "",
        eventTitle: "",
      },
      eventOptions: [],
      timerDate: "",
      faxAllTypeList: [],
      currentFax: {}, // 当前选中的传真数据
      InformaHistoryFlag: false, // 传真历史弹窗
      clickFaxInfo: {}, //点击传真历史
      paramsData: [], //重新赋值数据库返回数据
      caseFor: [], //存储原来的事件类型id
      paramsData: [],
      imgToTextVisible: false, //图文识别弹窗
      isYangZhou: window.g.IsYangZhouProject, // 是否扬州项目
      visible: false,
      currentPage: 1, // 事件列表页码
      searchText: "", // 事件列表搜索关键字
      loadMore: true, // 是否有更多事件数据
      IsYangZhouProject: window.g.IsYangZhouProject, // 扬州项目
      IsShenzhenProject: window.g.IsShenzhenProject, // 是否是深圳项目
      isDrawOrCli: 0,//政务联络网判断是节点下拉还是搜索框搜素
      gid: 0,//保留未分组节点的组id
      isDrowOrClick: 0,//应急联络网判断是节点下拉还是搜索框搜索
      nodeid: 0,//定义节点id
      nodechildren: [],//保留节点下面的子节点信息
      //控制架构和联系人的展示方式
      eleFlagHumanFlag: true,
      //控制电话盘
      cellPhoneNumFlag: false,
      //选择架构
      options: window.g.IsYangZhouProject ? [{//按钮切换
        name: '政务通信录',
        val: '1'
      }, {
        name: '应急通信录',
        val: '4'
      }, 
      // {
      //   name: '基层联络网',
      //   val: '5'
      // }, {
      //   name: '备勤联络网',
      //   val: '6'
      // }, {
      //   name: '资源联络网',
      //   val: '7'
      // }
      ] : [{//按钮切换
        name: '政务联络网',
        val: '1'
      }, {
        name: '应急联动网',
        val: '4'
      }, {
        name: '基层联络网',
        val: '5'
      }, {
        name: '备勤联络网',
        val: '6'
      }, {
        name: '资源联络网',
        val: '7'
      }],
      // 下拉选择框的值
      value: '1',
      //切换联系人的flag
      tabObj: {
        common: false,
        recently: false,
        shortcutGroup: true
      },
      //组织架构
      data: [],
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      //搜索
      input: '',
      // 选择页
      organization: {
        page: 1,
        total: 0
      },
      //最近联系人
      lately: {
        page: 1,
        total: 0
      },
      organizationData: [],//组织架构的联系人列编数据
      theOrganizationData: [], //非组织架构的联系人列表数据
      affairsObj: {},//请求联系人的数据对象
      groupId: [],
    };
  },
  beforeDestroy() {
    window.removeEventListener("message", this.locationCallback);
    window.addEventListener("message", this.sendLocationMsg);
    document.getElementsByClassName("el-scrollbar__wrap")[0].style.overflow =
      "scroll";
    // document.getElementsByClassName('is-vertical')[13].style.visibility='visible'
  },
  created() {
    // 重要的
    this.eventScene();
    this.addressBook();
    this.incidentType();
    // -----------------
    window.addEventListener("resize", this.getHeight);
    this.getHeight();
    this.getTimes();
    window.addEventListener("message", this.locationCallback);
    window.addEventListener("message", this.sendLocationMsg);
    //获取改变状态的列表
    let data = {
      pcode: "information_processing_status",
    };
    this.$api.getByPcode(data).then((res) => {
      // console.log(res)
      if (res.errorcode == 0) {
        this.options = res.data;
        // console.log(this.options)
      } else {
        //this.$message.error(res.msg)
      }
    });
    if (this.$store.getters.getDispositionType) {
      this.leftTabsType = this.$store.getters.getDispositionType;
      // if (this.leftTabsType == "电话") {
      //   this.getUnhandledPhone();
      // } else if (this.leftTabsType == "短信") {
      //   this.getUnhandledSms();
      // } else if (this.leftTabsType == "传真") {
      //   this.getUnhandledFax();
      // }
    }

    this.getFaxTypeSelections(); //选择全部右边表单类型
    // this.getEventOptions();
  },
  computed: {
    //获取悬浮球跳转过来时是跳哪个模块
    msgType() {
      return this.$store.getters.getDispositionType;
    },
    eventTypeComments() {
      return JSON.parse(JSON.stringify(this.eventType));
    },
    selectEventStyle() {
      return function (eventId) {
        if (this.faxForm.eventId == eventId) {
          return "color:#0091ff;background-color:rgba(0, 145, 255, .1);";
        } else {
          return "";
        }
      };
    },
  },
  watch: {
    faxForm(newV){
        this.input = newV.phone
        this.searchBtn()
        this.tabShortcutGroup()
        this.value = '9'
    },
    //解决所属区域级联选择器点击不关闭的问题
    "ruleForm.incidenArea"(newValue, oldValue) {
      if (this.$refs.incidenArea) {
        var children = this.$refs.incidenArea.getCheckedNodes();
        if (children.length > 0 && children[0].children.length < 1) {
          //判断有没有下级
          this.$refs.incidenArea.dropDownVisible = false; //监听值发生变化就关闭它
        }
      }
    },
    //解决报告单位级联选择器点击不关闭的问题
    "ruleForm.reportingUnit"(newValue, oldValue) {
      if (this.$refs.reportingUnit) {
        var children = this.$refs.reportingUnit.getCheckedNodes();
        if (children.length > 0 && children[0].children.length < 1) {
          //判断有没有下级
          this.$refs.reportingUnit.dropDownVisible = false; //监听值发生变化就关闭它
        }
      }
    },
    //解决事件类型级联选择器点击不关闭的问题
    "ruleForm.incidenType"(newValue, oldValue) {
      if (this.$refs.incidenType) {
        var children = this.$refs.incidenType.getCheckedNodes();
        if (children.length > 0 && children[0].children.length < 1) {
          //判断有没有下级
          this.$refs.incidenType.dropDownVisible = false; //监听值发生变化就关闭它
        }
      }
    },
    activeAllModel: {
      handler: function (newVal) {
        if (newVal === "短信") {
          const _taht = this;
          setTimeout(() => {
            _taht.$refs.smsRight.msmEventFlag = false;
          }, 100);
          this.$store.commit("setSmsOrFax", "sms");
        } else if (newVal === "传真") {
          this.$store.commit("setSmsOrFax", "fax");
        } else if (newVal === "电话") {
          this.$store.commit("setSmsOrFax", "phone");
        }
      },
      deep: true,
    },
    audioUrlData: {
      handler(valV, oldV) {
        if (oldV != "" && valV !== oldV) {
          this.audioPlanData.stop(); //先停止录音播放
        }
      },
      deep: true,
    },
    leftTabsType: {
      handler(valV, oldV) {
        // if (valV == "电话") {
        //   this.getUnhandledPhone();
        // } else if (valV == "短信") {
        //   this.getUnhandledSms();
        // } else if (valV == "传真") {
        //   this.getUnhandledFax();
        // }
      },
      deep: true,
    },
    msgType() {
      this.leftTabsType = this.msgType;
    },
    smsText: {
      handler(nV) {
        if (nV == "" || nV == null) {
          this.backSms.background =
            "url(" + "/static/img/smsContent.png" + ")center no-repeat";
          this.backSms.backgroundSize = "220px";
        } else {
          this.backSms.background = "none";
          this.backSms.backgroundSize = "220px";
        }
      },
      deep: true,
    },
    phoneText: {
      handler(nV) {
        if (nV == "" || nV == null) {
          this.backPhone.background =
            "url(" + "/static/img/txtNull.png" + ")center no-repeat";
          this.backPhone.backgroundSize = "130px";
        } else {
          this.backPhone.background = "none";
          this.backPhone.backgroundSize = "130px";
        }
      },
      deep: true,
    },
    channelTitle: {
      handler(nV, oV) {
        console.log(nV, oV);
        if (this.titleType == "新增" || this.titleType == "登记") {
          if (
            this.ruleForm.eventTitle === "" ||
            this.ruleForm.eventTitle == null
          )
            return;
          if (this.ruleForm.incidenType.length > 0) {
            return;
          }
          this.matchingTitle();
        }
      },
      deep: true,
    },
    eventTypeComments: {
      handler(newV, oldV) {
        console.log("oldV, newV", oldV, newV);
        if (newV !== "" && newV !== null && newV.length !== 0) {
          let caseID = newV[0].id;
          let caseName = newV[0].name;
          this.$emit("refreshEvent");
          sessionStorage.setItem("caseID", caseID);
          sessionStorage.setItem("caseName", caseName);
          if (sessionStorage.getItem("caseID") != 0) {
            this.caseFor.push({ id: sessionStorage.getItem("caseID") });
            console.log(this.caseFor);
          }
        }
        if (oldV.length == 0) {
          return;
        }
        if (newV.length !== 0 && oldV.length !== 0) {
          console.log(newV, oldV);
          if (newV[0].id !== oldV[0].id) {
            this.$emit("delectReape");
          }
        }
      },
      deep: true,
    },
    /**
     * @lastEditor qinjiaqi
     * @lastDate 2020-9-30
     * @param {Object, Object} 传入的新值和表单原来的旧值
     * @return {type} undefined
     * @Description 监听事件类型子参数
     */
    parameter: {
      handler(nV, oV) {
        if (oV.length !== 0 && nV.length !== 0) {
          let isSame = this.deepCompare(nV, oV); // 深度遍历参数是否一样
          this.isUpdateParameter = !isSame; // 取反
          if (this.isUpdateParameter || this.isUpdateForm) {
            this.$emit("updateReportForm", true); // 更新的父组件，父组件去判断是否弹窗
          } else {
            this.$emit("updateReportForm", false); // 更新的父组件，父组件去判断是否弹窗
          }
        }
        let obj = {};
        obj = this.parameter.find((item) => {
          return item.name === "死亡人数"; //筛选出匹配数据
        });
        // console.log(obj.value);
        this.$store.commit("setDieNumber", obj && obj.value ? obj.value : 0);
      },
      deep: true,
    },
    /**
     * @lastEditor qinjiaqi
     * @lastDate 2020-9-30
     * @param {Object, Object} 传入的新值和表单原来的旧值
     * @return {type} undefined
     * @Description 监听事件表单
     */
    ruleForm: {
      handler(nV, oV) {
        this.$store.commit("setSituation", nV);
        this.$emit("getAll", this.dataALL, this.paramsData);
        let isSame = this.deepCompare(this.dataALL, nV); // 是否更新表单 true:两个对象一样；false：两个对象不一样
        this.isUpdateForm = !isSame; // 取反
        if (this.isUpdateParameter || this.isUpdateForm) {
          this.$emit("updateReportForm", true); // 更新的父组件，父组件去判断是否弹窗
        } else {
          this.$emit("updateReportForm", false); // 更新的父组件，父组件去判断是否弹窗
        }
      },
      deep: true,
    },
  },
  destroyed() {
    window.removeEventListener("resize", this.getHeight);
  },
  mounted() {
    if (this.IsShenzhenProject) { // 如果是深圳市项目，优先显示政务联络网。其余的项目优先显示快捷组
      this.tabCommon()
    } else {
      this.tabShortcutGroup()
    }
    bus.$on("newFaxsComing", () => {
      this.getUnhandledFax();
    });
    bus.$on("newSmssComing", () => {
      this.getUnhandledSms();
    });
    this.ruleForm.eventTitle = sessionStorage.getItem("title");
    // this.ruleForm.reportedTime = sessionStorage.getItem("time");
    // sessionStorage.setItem('LevelID', LevelID);
    this.$nextTick(() => {
      this.getEventRank();
    });
    // bus.$off("addEvent");
    // bus.$on("addEvent", () => {
    //   this.addEvent();
    // });

    let time = new Date().getTime();
    // console.log(time);
    this.rushFaxData = time;
    this.backSms.background =
      "url(" + "/static/img/smsContent.png" + ")center no-repeat";
    this.backSms.backgroundSize = "220px";
    this.backPhone.background =
      "url(" + "/static/img/txtNull.png" + ")center no-repeat";
    this.backPhone.backgroundSize = "100px";
    // this.getEventOptions();
    this.getTabDatas();

    this.getStateListData();
    let wrap = document.getElementsByClassName(
      "informationReception_wrap"
    )[0];
    if (wrap.parentNode) {
      if (wrap.parentNode.parentNode) {
        if (wrap.parentNode.parentNode.nextElementSibling) {
          if (
            wrap.parentNode.parentNode.nextElementSibling.nextElementSibling
          ) {
            if (
              wrap.parentNode.parentNode.nextElementSibling.nextElementSibling
                .style
            ) {
              wrap.parentNode.parentNode.nextElementSibling.nextElementSibling.style.visibility =
                "hidden";
              // console.log(wrap.parentNode.parentNode.nextElementSibling.nextElementSibling)
              // console.log(wrap.parentNode.parentNode.nextElementSibling.nextElementSibling.style)
            }
          }
        }
      }
    }
    // this.ruleForm.speakerName=sessionStorage.getItem('displayname')
    // this.ruleForm.speakerPhone=sessionStorage.getItem('mobile')
    // this.amendParameter()
  },
  methods: {
    //初始化数据
      initLatelyData(str) {
        this.lately = {
          page: 1,
          total: 0
        }
        this.organization = {
          page: 1,
          total: 0
        }
        this.input = ''
        //初始化组织架构和常用联系人、最近联系人按钮切换的锁
        this.tabObj.common = false
        this.tabObj.recently = false
        this.tabObj.shortcutGroup = false
        this.eleFlagHumanFlag = false
        if (str) {
          this[str] = true
          this.input = this.faxForm.phone
        }
      },
    /**
     * @param {*} x 比较的对象1
     * @param {*} y 比较的对象2
     * @description 深度比较两个对象是否相等
     * @lasteditor qinjiaqi
     * @date 2020-9-30
     * @returns true 相等； false 不相等
     */
    deepCompare(x, y) {
      var i, l, leftChain, rightChain;
      function compare2Objects(x, y) {
        var p;
        // remember that NaN === NaN returns false 记住，NaN === NaN返回false
        // and isNaN(undefined) returns true isNaN(未定义)返回true
        if (
          isNaN(x) &&
          isNaN(y) &&
          typeof x === "number" &&
          typeof y === "number"
        ) {
          return true;
        }
        // Compare primitives and functions.  比较原语和函数。
        // Check if both arguments link to the same object. 检查两个参数是否链接到同一个对象。
        // Especially useful on the step where we compare prototypes 在比较原型的步骤中特别有用
        if (x === y) {
          return true;
        }
        // Works in case when functions are created in constructor. 在构造函数中创建函数时工作。
        // Comparing dates is a common scenario. Another built-ins? 比较日期是一种常见的场景。另一个内置模板?
        // We can even handle functions passed across iframes 我们甚至可以处理通过iframes传递的函数
        if (
          (typeof x === "function" && typeof y === "function") ||
          (x instanceof Date && y instanceof Date) ||
          (x instanceof RegExp && y instanceof RegExp) ||
          (x instanceof String && y instanceof String) ||
          (x instanceof Number && y instanceof Number)
        ) {
          return x.toString() === y.toString();
        }
        // At last checking prototypes as good as we can 最后，我们尽可能地检查原型
        if (!(x instanceof Object && y instanceof Object)) {
          return false;
        }

        if (x.isPrototypeOf(y) || y.isPrototypeOf(x)) {
          return false;
        }
        if (x.constructor !== y.constructor) {
          return false;
        }
        if (x.prototype !== y.prototype) {
          return false;
        }
        // Check for infinitive linking loops 检查不定式连接循环
        if (leftChain.indexOf(x) > -1 || rightChain.indexOf(y) > -1) {
          return false;
        }
        // Quick checking of one object being a subset of another. 快速检查一个对象是否是另一个对象的子集。
        for (p in y) {
          if (y.hasOwnProperty(p) !== x.hasOwnProperty(p)) {
            return false;
          } else if (typeof y[p] !== typeof x[p]) {
            return false;
          }
        }
        for (p in x) {
          if (y.hasOwnProperty(p) !== x.hasOwnProperty(p)) {
            return false;
          } else if (typeof y[p] !== typeof x[p]) {
            return false;
          }
          switch (typeof x[p]) {
            case "object":
            case "function":
              leftChain.push(x);
              rightChain.push(y);
              if (!compare2Objects(x[p], y[p])) {
                return false;
              }
              leftChain.pop();
              rightChain.pop();
              break;

            default:
              if (x[p] !== y[p]) {
                return false;
              }
              break;
          }
        }
        return true;
      }
      if (arguments.length < 1) {
        return true;
        // throw "Need two or more arguments to compare"; 抛出“需要两个或更多的参数进行比较”;
      }
      for (i = 1, l = arguments.length; i < l; i++) {
        leftChain = [];
        rightChain = [];
        if (!compare2Objects(arguments[0], arguments[i])) {
          return false;
        }
      }
      return true;
    },
    /**
     * @author hexinting
     * @lastEditor hexinting
     * @lastDate 2020-9-25
     * @param {type} val 当前tab激活的对象
     * @descripttion:切换传真、短信、电话
     */
    handleTabChange(val) {
      if (val.name === "短信") {
        this.$store.commit("setSmsOrFax", "sms");
      } else if (val.name === "传真") {
        this.$store.commit("setSmsOrFax", "fax");
      } else {
        this.$store.commit("setSmsOrFax", "phone");
      }
    },
    /**
     * @param {type} 没有
     * @return {type} undefined
     * @description：暂无关联事件时触发清空列表并能让其新增事件
     */
    addEvent() {
      let emEventId = sessionStorage.getItem("newID");
      let emCaseId = sessionStorage.getItem("caseID");
      let emEventContent = sessionStorage.getItem("createdEvent");
      this.$emit("setId", emEventId, emCaseId); //清空之前将事件ID传给事件不保存时再次用来存储事件
      // this.$emit('addPath');
      this.titleType = "新增";
      sessionStorage.removeItem("newID");
      sessionStorage.removeItem("caseID");
      this.$emit("refreshEvent"); //新增，移除旧的本地存储
      this.ruleForm.eventTitle = ""; //清空事件标题
      this.ruleForm.reportedTime = ""; //清空首报时间
      this.ruleForm.incidentTime = ""; //清空事发时间
      this.ruleForm.incidenArea = []; //清空所属区域
      this.ruleForm.incidentSite = ""; //清空事发地点
      this.ruleForm.reportingUnit = []; //清空报告单位
      this.ruleForm.incidenType = []; //清空事件类型
      this.ruleForm.serialNumber = ""; //清空事件等级
      this.ruleForm.reportSituation = ""; //清空上报情况
      this.ruleForm.allCase = ""; //清空总体情况
      this.ruleForm.speakerName = ""; //清空报告人
      this.ruleForm.speakerPhone = ""; //清空报告人电话
      this.ruleForm.timeOfWrittenSubmission = ""; //清空书面报送时间
      this.ruleForm.accidentSituation = ""; //清空事故情况
      this.ruleForm.beOnDuty = ""; //清空值班员
      this.ruleForm.beOnDutyIds = []; //清空值班员id
      this.ruleForm.leaderOnDuty = ""; //清空值班领导
      this.ruleForm.leaderOnDutyIds = []; //清空值班领导id
      this.ruleForm.submissionMethod = ""; //清空接报方式
      this.ruleForm.deathToll = ""; //清空死亡人数
      this.ruleForm.bruiseToll = ""; //清空受伤人数
      this.ruleForm.disappearToll = ""; //清空失踪人数
      this.ruleForm.deathNum = ""; //清空死亡人数
      this.ruleForm.injuredNum = ""; //清空受伤人数
      this.parameter = []; //清空事件类型子参数
      this.test = ""; //清空事件等级id
      this.latitude = ""; //清空纬度
      this.longitude = ""; //清空经度
      this.eventAddressBook = []; //清空通讯库存储
      this.eventType = []; //清空事件类型组
      this.eventTree = []; //清空事件类型树
      this.reason = ""; //清空事发原因
      this.result = ""; //清空已造成后果
      this.growing = ""; //清空事件发展趋势
      this.messure = ""; //清空已采取措施
      let typeAdd = "新增"; //标记该事件为新增
      this.$emit("addType", typeAdd);
      // 获取默认的事件类型子参数
      let data = {
        caseId: 0,
      };
      this.$api.defaultParameters(data).then((res) => {
        if (res.errorcode == "0") {
          console.log(res.data);
          this.parameter = res.data;
        } else {
          //this.$message.error(res.msg)
        }
      });
      // 如果本地有createdEvent项则调用
      if (emEventContent) {
        this.ruleForm.incidentTime = emEventContent.time;
        this.ruleForm.incidenArea = emEventContent.position;
        this.ruleForm.eventTitle = emEventContent.event;
      }
    },
    /**
     * @lastEditor qinjiaqi
     * @lastDate 2020-9-30
     * @param {Object} 事件类型组
     * @return {type} undefined
     * @Description 改变事件类型子参数
     */
    incidenTypeChange(arr) {
      sessionStorage.setItem("caseID", arr[arr.length - 1]);
      this.amendParameter();
      var gettree = (data) => {
        // console.log('data: ', data);
        for (var i = 0; i < data.length; i++) {
          if (data[i].id == arr[arr.length - 1]) {
            this.eventType = [];
            this.eventType.push({
              name: data[i].name,
              id: data[i].id,
            });
            return;
          } else {
            if (data[i].children) {
              gettree(data[i].children);
            }
          }
        }
      };
      gettree(this.eventTypeData);
      // console.log('this.eventType: ', this.eventType);
    },
    areaTypeChange(arr) {
      var gettree = (data) => {
        console.log("data: ", data);
        for (var i = 0; i < data.length; i++) {
          if (data[i].id == arr[arr.length - 1]) {
            this.eventTree = [];
            this.eventTree.push({ name: data[i].name, id: data[i].id });
            return;
          } else {
            if (data[i].children) {
              gettree(data[i].children);
            }
          }
        }
      };
      gettree(this.jurisdictionData);
      console.log("this.jurisdictionData: ", this.jurisdictionData);
    },
    beOnDutyHandle() {
      this.beOnDutyVisible = true;
      this.$refs.beOnDutyDialog.checkboxGroup = this.ruleForm.beOnDutyIds;
    },
    changeBeOnDuty(checkboxGroup, checkboxData) {
      this.ruleForm.beOnDuty = "";
      this.beOnDutyVisible = false;
      this.ruleForm.beOnDutyIds = checkboxGroup;
      checkboxData.map((v) => {
        this.ruleForm.beOnDuty += v.name + "，";
      });
      this.ruleForm.beOnDuty = this.ruleForm.beOnDuty.substring(
        0,
        this.ruleForm.beOnDuty.length - 1
      );
    },
    leaderOnDutyHandle() {
      this.leaderOnDutyVisible = true;
      this.$refs.leaderOnDutyDialog.checkboxGroup = this.ruleForm.leaderOnDutyIds;
    },
    changeLeaderOnDuty(checkboxGroup, checkboxData) {
      this.ruleForm.leaderOnDuty = "";
      this.leaderOnDutyVisible = false;
      this.ruleForm.leaderOnDutyIds = checkboxGroup;
      checkboxData.map((v) => {
        this.ruleForm.leaderOnDuty += v.name + "，";
      });
      this.ruleForm.leaderOnDuty = this.ruleForm.leaderOnDuty.substring(
        0,
        this.ruleForm.leaderOnDuty.length - 1
      );
    },
    //获取事件级别
    getEventRank() {
      let data = {
        pcode: "emtlevel",
      };
      this.$api.eventLevel(data).then((res) => {
        if (res.errorcode == "0") {
          this.eventLevel = res.data;
        }
      });
    },
    visibleChange() {
      this.getEventRank();
    },
    // 测试下拉框
    testSelect() {
      console.log(this.parameter);
    },
    openEventDetail(key) {
      if (sessionStorage.getItem("newID")) {
        this.isEventDetail = key == 1 ? true : false;
      } else {
        this.$message({
          message: "请先保存事件!",
          type: "warning",
        });
      }
    },

    //来文类型选择
    handleCommand(val) {
      this.faxForm.type = val;
    },
    //转发
    msgTransmit(data) {
      console.log(data);
      this.$refs.smsRight.historyType = data.sendType;
      this.$refs.smsRight.historyId = data.id;
      this.InformationDisposalShow = true;
      this.eventEnteringShow = false;
      const _that = this;
      setTimeout(() => {
        _that.activeAllModel = "短信";
        // _that.$refs.smsRight.msgForm.msgContent = data.remark;
        if (data.remark) {
          this.$store.commit("setCopyBusinessCard", data.remark);
        } else {
          this.$message.warning("内容为空");
        }
      }, 100);
    },
    //回复
    msgReply(data) {
      this.InformationDisposalShow = true;
      this.eventEnteringShow = false;
      const _that = this;
      setTimeout(() => {
        _that.activeAllModel = "短信";
        // let obj = {
        //     contactorId: data.contactId,
        //     id:data.contactId,
        //     name: data.name,
        //     mobile: data.phone
        // }
        // _that.$refs.smsRight.peopleList = [obj]
        // _that.$refs.smsRight.msgForm.msgContent = data.remark
        // _that.$store.commit('setSmsMember',[obj])
        _that.$refs.smsRight.getfaxDataN([data.phone]);
      }, 100);
    },
    //回复
    reply() {
      console.log(this.$store.state.msgHeadleData);
      this.InformationDisposalShow = true;
      this.eventEnteringShow = false;
      const _that = this;
      setTimeout(() => {
        this.activeAllModel = "传真";
        if (this.$store.state.msgHeadleData) {
          this.$refs.IcpFaxRight.eventRelevance = false;
          this.$refs.IcpFaxRight.visFlag = true;
          this.$refs.IcpFaxRight.faxForm.caseId = this.faxForm.eventId;
          this.$refs.IcpFaxRight.faxForm.faxTitle = this.faxForm.title;
          this.$refs.IcpFaxRight.peopleList = [
            {
              fax: this.$store.state.msgHeadleData.phone,
              id: this.$store.state.msgHeadleData.id,
              name: this.$store.state.msgHeadleData.phone,
            },
          ];
          this.$store.commit("setFaxMember", [this.clickFaxInfo]);
          console.log(
            "回复",
            this.activeAllModel,
            this.$store.state.msgHeadleData
          );
        } else {
          this.$message.error("暂无数据");
        }
      }, 100);
    },
    //转发
    transmit() {
      const _that = this;
      this.InformationDisposalShow = true;
      this.eventEnteringShow = false;
      setTimeout(() => {
        this.activeAllModel = "传真";
        if (this.$store.state.msgHeadleData) {
          this.$api
            .previewFax({ faxId: this.$store.state.msgHeadleData.id })
            .then((res) => {
              if (res.errorcode == 0) {
                console.log(res.data);
                if (this.$refs.IcpFaxRight.faxFileList.length == 0) {
                  let objFile = new File(
                    ["First Line Text", "Second Line Text"],
                    res.data
                  );
                  this.$refs.IcpFaxRight.eventRelevance = false;
                  this.$refs.IcpFaxRight.visFlag = true;
                  this.$refs.IcpFaxRight.faxForm.caseId = this.faxForm.eventId;
                  this.$refs.IcpFaxRight.faxForm.faxTitle = this.faxForm.title;
                  this.$refs.IcpFaxRight.faxFileList.push(objFile);
                  this.$refs.IcpFaxRight.previewName = res.data;
                } else {
                  this.$message.warning("请点击清除按钮后重新选择文件上传!");
                }
              } else {
                this.$message.error(res.msg);
              }
            });
        } else {
          this.$message.error("暂无数据");
        }
      }, 100);
    },
    //传真拆分
    activeResolution() {
      if (this.allFpxPreviewPath) {
        console.log(this.allFpxPreviewPath);
        this.$refs.resolution.flag = true;
        this.$refs.resolution.oldFaxPath = this.allFpxPreviewPath;
      }
    },
    //传真合并
    faxMergeOpen() {
      this.$refs.mergeFaxDialog.isMergeFaxDialog = true;
    },
    imgToText() {
      this.imgToTextVisible = true;
      this.$nextTick(() => {
        this.$refs.imgToText.oldFaxPath = "";
        let filename = this.allFpxPreviewPath.substr(
          this.allFpxPreviewPath.lastIndexOf("/") + 1
        ); //72c0d9d068b34cbabe812ea171f0bf94.pdf
        this.$refs.imgToText.imageTextArr = [];
        console.log(this.imgToTextId, this.faxForm);
        if (this.allFpxPreviewPath) {
          let fileName = this.allFpxPreviewPath.substr(
            this.allFpxPreviewPath.lastIndexOf("/") + 1
          ); //72c0d9d068b34cbabe812ea171f0bf94.pdf
          let data = {
            faxId: this.imgToTextId,
            fileName,
            isSingle: true,
          };
          // let loading = this.$loading({
          //   lock: true,
          //   text: "识别中...",
          //   spinner: "el-icon-loading",
          //   background: "rgba(0, 0, 0, 0.7)",
          // });
          this.$api.splitPdf(data).then((res) => {
            if (res.errorcode == 0) {
              if (res.data.length > 0) {
                this.$refs.imgToText.imageTextArr = res.data;
                this.$refs.imgToText.getPageData(res.data[0], 0);
              } else {
                this.$refs.imgToText.imageTextArr = [];
              }
              this.$refs.imgToText.flag = true;
              this.$refs.imgToText.oldFaxPath = this.allFpxPreviewPath;
              // loading.close();
            } else {
              this.$message.error(res.msg);
              this.$refs.imgToText.imageTextArr = [];
              this.$refs.imgToText.oldFaxPath = "";
              // loading.close();
            }
          });
        }
      });
    },
    closeFaxDialog() {
      this.$refs.mergeFaxDialog.isMergeFaxDialog = false;
      this.timerDate = new Date().getTime();
    },
    rushContent() {
      //刷新传真子组件
      let time = new Date().getTime();
      console.log(time);
      this.rushFaxData = time;
    },
    recordingInstance(node) {
      this.audioPlanData = node; //获取到录音的实例
    },
    copyTextSuccess(e) {
      this.$message.success("复制成功");
      //把数据复制到文本域
      this.$refs.newFaxModel.copyToTextarea(e.text);
    },
    copyTextError() {
      this.$message.error("复制失败");
    },
    rowClick(row) {
      this.row = row;
    },
    saveEdite(item, types) {
      if (!this.selectState) {
        this.editIndex = "";
        return;
      }
      let data = {
        type: types,
        id: item.id,
        statusId: this.selectState,
      };
      console.log(data);
      this.$api.disposeEvent(data).then((res) => {
        if (res.errorcode == 0) {
          this.editIndex = "";
          if (types == "phone") {
            this.audioPlanData.stop();
            this.phoneTreeLoading = true;
            this.phoneRushe = false;
            this.$nextTick(() => {
              this.testAudio = false;
              this.phoneRushe = true;
              this.audioUrlData = "";
              this.audioId = "";
              this.phoneText = "";
            });
            this.getUnhandledPhone();
          } else if (types == "sms") {
            this.getUnhandledSms();
          }
        } else {
          //this.$message.error(res.msg)
        }
      });
    },
    tabClick(tab, event) {
      this.queryFaxAllTime = "";
      this.queryFaxAllSelect = "";
      this.phonePerson = "";
      this.leftEventId = "";
      this.changeIndex = -1;
      this.currentFaxPage = 1;
      this.InformationDisposalShow = false;
      this.eventEnteringShow = true;
      this.ruleForm.speakerName = "";
      this.ruleForm.speakerPhone = "";
      this.$nextTick(() => {
        //切换tabs时刷新右侧辅助页面的数据
        // this.activeAllModel = "传真"; //默认传真
        this.InformationDisposalShow = true;
        this.eventEnteringShow = false;
        this.changeRed = "信息处置";
      });
      console.log(tab);
      return;
      if (tab.name == "电话") {
        this.phoneTreeLoading = true;
        this.phoneRushe = false;
        this.$nextTick(() => {
          this.testAudio = false;
          this.phoneRushe = true;
          this.audioUrlData = "";
          this.audioId = "";
          this.phoneText = "";
        });
        this.getUnhandledPhone();
        this.nowTag = "phone";
        this.$store.commit("setSmsOrFax", "phone");
      } else if (tab.name == "短信") {
        this.smsTreeLoading = true;
        this.smsText = "";
        this.getUnhandledSms();
        this.nowTag = "sms";
        this.$store.commit("setSmsOrFax", "sms");
      }
    },
    /**
     * @lastEditor qinjiaqi
     * @lastDate 2020-10-26
     * @param {type} 无
     * @return {type} undefined
     * @Description 自适应高度
     */
    getHeight() {
      //自适应高度
      let h =
        document.documentElement.clientHeight || document.body.clientHeight;
      this.elTablePlanStyle.height = (h - (68 + 235) + 98) / 2 + "px";
      this.elTablePlanStyleNext.height = h - (68 + 235) + 40 + "px"; //原件预览文件区域高度
      this.listHeight.height = h - (68 + 450) + 120 + "px";
      this.heightStyle.height = h - (68 + 235) + 103 + "px";
      this.rightHeightStyle.height = h - (68 + 163 + 40) + 50 + "px";
      this.saveEntering.height = h - (11 + 190) + "px";
      this.turnTheText.height = (h - (68 + 235) + 54) / 2 - 34 + "px";
      // 信息登记高度
      this.infoEnteringStyle.height = h - (68 + 118 + 40) + 138 + "px";
      // 事件登记高度
      this.eventEnteringStyle.height = h - (68 + 118 + 40) + 138 + "px";
      // console.log("this.elTablePlanStyle.height"+this.elTablePlanStyle.height+"this.listHeight.height"+this.listHeight.height)
      // console.log("this.heightStyle.height"+this.heightStyle.height+"this.rightHeightStyle.height"+this.rightHeightStyle.height)
      // console.log("this.saveEntering.height"+this.saveEntering.height+"this.turnTheText.height"+this.turnTheText.height)

    },
    getTabDatas() {
      //获取事件列表
      let data = {
        size: this.pageSize,
        page: this.currentPage,
      };
      this.myLoading = true;
      this.$api
        .eventHistory(data)
        .then((res) => {
          if (res.errorcode == 0) {
            this.gridData = res.data.data;
            this.total = res.data.totalElements;
          }
          this.myLoading = false;
        })
        .catch(() => {
          this.myLoading = false;
        });
    },
    allModelCloseDialog() {
      this.$emit("allModelCloseDialog");
    },
    closeDialog() {
      //colse关闭窗口
      this.addEventDialog = false;
      this.$refs.eventDialog.clearData(); //刷新子组件数据
      // this.$emit('refreshEvent')
    },
    handleCurrentFaxChange(val) {
      //传真model分页器
      this.$emit("handleCurrentFaxChange", val);
    },
    /**
     * @param {number/string} id 报送单位id or 报送单位名字(数据库中，有的旧数据是报送单位名字，新数据是报送单位id)
     * @returns data data: { id: 报送单位id, name: 报送单位名字 }
     * @editor qinjiaqi
     * @lastDate 2020-10-19
     * @description 获取报告单位
     */
    getReportingUnit(id) {
      console.log("--------------------------------");
      console.log("报送单位：", id);
      console.log("报送单位列表", this.reportingUnitData);
      var departId = parseInt(id);
      console.log("报送单位：", departId, departId.toString() == "NaN");
      if (departId.toString() != "NaN") {
        console.log("----reportDepartId------", departId);
        var departName = "";
        if (
          this.reportingUnitData.filter((item) => item.id === departId).length >
          0
        ) {
          let departArr = [];
          departArr.push(
            this.reportingUnitData.filter((item) => item.id === departId)[0].id
          );
          departName = this.reportingUnitData.filter(
            (item) => item.id === departId
          )[0].name;
          this.ruleForm.reportingUnitName = departName;
          this.ruleForm.reportingUnit = departArr;
        } else {
          for (let i = 0; i < this.reportingUnitData.length; i++) {
            let departArr = [];
            departArr.push(this.reportingUnitData[i].id); // 第一层
            if (
              this.reportingUnitData[i].children &&
              this.reportingUnitData[i].children.filter(
                (item) => item.id === departId
              ).length > 0
            ) {
              console.log("选中报送单位：", this.reportingUnitData[i]);
              departName = this.reportingUnitData[i].children.filter(
                (item) => item.id === departId
              )[0].name;
              departArr.push(
                this.reportingUnitData[i].children.filter(
                  (item) => item.id === departId
                )[0].id
              );
              this.ruleForm.reportingUnit = departArr;
              this.ruleForm.reportingUnitName = departName;
              console.log(
                "第二层：",
                this.ruleForm.reportingUnit,
                departArr,
                departName
              );
              return false;
            }
            if (
              this.reportingUnitData[i].children &&
              this.reportingUnitData[i].children.length > 0
            ) {
              for (
                let j = 0;
                j < this.reportingUnitData[i].children.length > 0;
                j++
              ) {
                if (this.reportingUnitData[i].children[j].children) {
                  let child = this.reportingUnitData[i].children[j].children;
                  if (child.filter((item) => item.id === departId).length > 0) {
                    console.log("选中报送单位：", child);
                    departArr.push(this.reportingUnitData[i].children[j].id); // 第二层
                    departArr.push(
                      child.filter((item) => item.id === departId)[0].id
                    ); // 第三层
                    departName = child.filter((item) => item.id === departId)[0]
                      .name;
                    this.ruleForm.reportingUnitName = departName;
                    this.ruleForm.reportingUnit = departArr;
                    console.log(
                      "第三层：",
                      this.ruleForm.reportingUnit,
                      departArr,
                      departName
                    );
                    return false;
                  } else {
                    for (let el of child) {
                      if (
                        el.children &&
                        el.children.filter((item) => item.id === departId)
                          .length > 0
                      ) {
                        console.log("第四层", child, el.id);
                        departArr.push(
                          this.reportingUnitData[i].children[j].id
                        ); // 第二层
                        departArr.push(el.id); // 第三层
                        departArr.push(
                          el.children.filter((item) => item.id === departId)[0]
                            .id
                        ); // 第四层
                        departName = el.children.filter(
                          (item) => item.id === departId
                        )[0].name;
                        this.ruleForm.reportingUnitName = departName;
                        this.ruleForm.reportingUnit = departArr;
                        console.log(
                          "第四层：",
                          this.ruleForm.reportingUnit,
                          departArr,
                          departName
                        );
                        return false;
                      }
                    }
                  }
                }
              }
            }
          }
        }
      } else {
        // 数据库拿到的reportDepart是名字
        var departName = id;
        console.log("----reportDepart是名字------", departName);
        if (
          this.reportingUnitData.filter((item) => item.name === departName)
            .length > 0
        ) {
          let departArr = [];
          departArr.push(
            this.reportingUnitData.filter((item) => item.name === departName)[0]
              .id
          );
          this.ruleForm.reportingUnit = departArr;
        } else {
          for (let i = 0; i < this.reportingUnitData.length; i++) {
            let departArr = [];
            departArr.push(this.reportingUnitData[i].id); // 第一层
            if (
              this.reportingUnitData[i].children &&
              this.reportingUnitData[i].children.filter(
                (item) => item.name === departName
              ).length > 0
            ) {
              console.log("第一级", this.reportingUnitData[i].name);
              departArr.push(
                this.reportingUnitData[i].children.filter(
                  (item) => item.name === departName
                )[0].id
              );
              this.ruleForm.reportingUnit = departArr;
              console.log(
                "第二层：",
                this.ruleForm.reportingUnit,
                departArr,
                departName
              );
              return false;
            }
            if (
              this.reportingUnitData[i].children &&
              this.reportingUnitData[i].children.length > 0
            ) {
              for (
                let j = 0;
                j < this.reportingUnitData[i].children.length > 0;
                j++
              ) {
                console.log(
                  "第二级",
                  this.reportingUnitData[i].children[j].name
                );
                if (this.reportingUnitData[i].children[j].children) {
                  let child = this.reportingUnitData[i].children[j].children;
                  if (
                    child.filter((item) => item.name === departName).length > 0
                  ) {
                    console.log(
                      "第三级",
                      child.filter((item) => item.name === departName)[0].name
                    );
                    console.log("选中报送单位：", child);
                    departArr.push(this.reportingUnitData[i].children[j].id); // 第二层
                    departArr.push(
                      child.filter((item) => item.name === departName)[0].id
                    ); // 第三层
                    this.ruleForm.reportingUnit = departArr;
                    console.log(
                      "第三层：",
                      this.ruleForm.reportingUnit,
                      departArr,
                      departName
                    );
                    return false;
                  } else {
                    for (let el of child) {
                      if (
                        el.children &&
                        el.children.filter((item) => item.name === departName)
                          .length > 0
                      ) {
                        console.log("第四级", el.name);
                        console.log("第四层", child, el.id);
                        departArr.push(
                          this.reportingUnitData[i].children[j].id
                        ); // 第二层
                        departArr.push(el.id); // 第三层
                        departArr.push(
                          el.children.filter(
                            (item) => item.name === departName
                          )[0].id
                        ); // 第四层
                        this.ruleForm.reportingUnit = departArr;
                        console.log(
                          "第四层：",
                          this.ruleForm.reportingUnit,
                          departArr,
                          departName
                        );
                        return false;
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    getCaseClassId(caseClassId, caseName) {
      // alert(5)
      let incidenType = [];
      console.log("灾害类型：", caseClassId, caseName);
      console.log("灾害类型：", this.ruleForm.incidenType, this.eventTypeData);
      if (
        this.eventTypeData.filter((item) => item.id === caseClassId).length > 0
      ) {
        let filterData = this.eventTypeData.filter(
          (item) => item.id === caseClassId
        );
        incidenType.push(filterData[0].id);
        this.ruleForm.incidenType = incidenType;
        console.log("----结果---灾害类型：", this.ruleForm.incidenType);
        return false;
      } else {
        for (let a of this.eventTypeData) {
          if (a.children && a.children.length > 0) {
            if (
              a.children.filter((item) => item.id === caseClassId).length > 0
            ) {
              let filterData = a.children.filter(
                (item) => item.id === caseClassId
              );
              incidenType.push(a.id);
              incidenType.push(filterData[0].id);
              this.ruleForm.incidenType = incidenType;
              console.log("----结果---灾害类型：", this.ruleForm.incidenType);
              return false;
            } else {
              for (let b of a.children) {
                console.log("----", b);
                if (b.children && b.children.length > 0) {
                  if (
                    b.children.filter((item) => item.id === caseClassId)
                      .length > 0
                  ) {
                    let filterData = b.children.filter(
                      (item) => item.id === caseClassId
                    );
                    incidenType.push(a.id);
                    incidenType.push(b.id);
                    incidenType.push(filterData[0].id);
                    this.ruleForm.incidenType = incidenType;
                    console.log(
                      "----结果---灾害类型：",
                      this.ruleForm.incidenType
                    );
                    return false;
                  } else {
                    for (let c of b.children) {
                      if (c.children && c.children.length > 0) {
                        if (
                          c.children.filter((item) => item.id === caseClassId)
                            .length > 0
                        ) {
                          let filterData = c.children.filter(
                            (item) => item.id === caseClassId
                          );
                          incidenType.push(a.id);
                          incidenType.push(b.id);
                          incidenType.push(c.id);
                          incidenType.push(filterData[0].id);
                          this.ruleForm.incidenType = incidenType;
                          console.log(
                            "----结果---灾害类型：",
                            this.ruleForm.incidenType
                          );
                          return false;
                        } else {
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    // 获取所属区域的id
    getIncidenAreaId(areaId) {
      // alert(1)
      let incidenArea = [];
      console.log("辖区Id", areaId);
      console.log(
        "辖区名字：",
        this.ruleForm.incidenArea,
        this.jurisdictionData
      );
      if (
        this.jurisdictionData.filter((item) => item.id === areaId).length > 0
      ) {
        let filterData = this.jurisdictionData.filter(
          (item) => item.id === areaId
        );
        incidenArea.push(filterData[0].id);
        this.ruleForm.incidenArea = incidenArea;
        return false;
      } else {
        for (let a of this.jurisdictionData) {
          if (a.children && a.children.length > 0) {
            if (a.children.filter((item) => item.id === areaId).length > 0) {
              let filterData = a.children.filter((item) => item.id === areaId);
              incidenArea.push(a.id);
              incidenArea.push(filterData[0].id);
              this.ruleForm.incidenArea = incidenArea;
              return false;
            } else {
              for (let b of a.children) {
                console.log("----", b);
                if (b.children && b.children.length > 0) {
                  if (
                    b.children.filter((item) => item.id === areaId).length > 0
                  ) {
                    let filterData = b.children.filter(
                      (item) => item.id === areaId
                    );
                    incidenArea.push(a.id);
                    incidenArea.push(b.id);
                    incidenArea.push(filterData[0].id);
                    this.ruleForm.incidenArea = incidenArea;
                    return false;
                  } else {
                    for (let c of b.children) {
                      if (c.children && c.children.length > 0) {
                        if (
                          c.children.filter((item) => item.id === areaId)
                            .length > 0
                        ) {
                          let filterData = c.children.filter(
                            (item) => item.id === areaId
                          );
                          incidenArea.push(a.id);
                          incidenArea.push(b.id);
                          incidenArea.push(c.id);
                          incidenArea.push(filterData[0].id);
                          this.ruleForm.incidenArea = incidenArea;
                          return false;
                        } else {
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
      console.log(
        "辖区名字：",
        this.ruleForm.incidenArea,
        this.jurisdictionData
      );
    },
    //点击传真列表
    changeItem(item, index) {
      console.log("index: ", index);
      //点击每一条数据
      console.log("单行传真数据: ", item);
      this.clickFaxInfo = {
        id: item.contactId,
        name: item.name || item.phone,
        fax: item.phone,
      };
      this.currentFax = item;
      item.sendType = "fax";
      item.sendTypeId = item.id;
      this.$store.dispatch("msgHeadleDatas", item);
      this.faxcontactId = item.contactId;
      this.phonePerson = "";
      this.changeIndex = index;
      this.allFpxPreviewPath = "";
      this.textShow = "";
      this.leftEventId = item.id;
      this.imgToTextId = item.id;
      this.phonePerson = item.phone;
      this.faxForm = { ...item };

      this.faxForm.eventId = item.eventId; // 如果没有id，设置为空
      this.faxForm.eventTitle = item.event;
      this.nowTag = "fax";
      // 判断当前联事件id是否存在关联事件列表里面
      if (item === 0) {
        this.faxForm.eventId = "";
      }

      // 判断当前联事件id是否存在关联事件列表里面，如果不存在，faxForm.eventId为空
      // this.isHaveEventId(item.eventId);

      //获取pdf
      let data1 = {
        faxId: item.id,
      };
      this.$api.previewFax(data1).then((res) => {
        if (res.errorcode == 0) {
          this.allFpxPreviewPath = window.g.ApiUrl + "/fax/" + res.data;
        } else {
          //this.$message.error(res.msg)
        }
      });
      if (item.eventId === "" || !item.eventId || item.eventId === undefined) {
        this.addEvent(); // 没有关联事件则清空事件登记表单数据
      } else {
        // 有关联事件则获取事件详情
        //报告人
        let data = {
          id: item.eventId,
        };
        this.$api.findById(data).then((res) => {
          // alert('根据事件id获取事件详情')
          console.log(res);
          if (res.errorcode == "0") {
            this.ruleForm.eventTitle = res.data.event.title;
            this.ruleForm.reportedTime = res.data.event.reportTime;
            this.ruleForm.incidentTime = res.data.event.occurTime;
            this.ruleForm.incidenArea = [res.data.event.areaId];
            this.ruleForm.incidentSite = res.data.event.address;
            this.ruleForm.reportingUnit = res.data.event.reportDepartId;
            this.ruleForm.reportingUnitName = res.data.event.reportDepart;
            this.ruleForm.incidenType = [res.data.event.caseClassId];
            // this.ruleForm.incidentRank = res.data.event.eventLevel;
            this.test = res.data.event.eventLevelId;
            this.ruleForm.reportSituation = res.data.event.reportSuperior;
            this.ruleForm.allCase = res.data.event.reportDescription;
            this.eventTree.push({
              name: res.data.event.area,
              id: res.data.event.areaId,
            });
            this.eventType.push({
              name: res.data.event.caseClass,
              id: res.data.event.caseClassId,
            });
            this.longitude = res.data.event.longitude;
            this.latitude = res.data.event.latitude;
            this.ruleForm.speakerName = res.data.event.reportMan;
            this.ruleForm.speakerPhone = res.data.event.reportNum;
            this.ruleForm.timeOfWrittenSubmission =
              res.data.event.writtenReportTime;
            this.ruleForm.accidentSituation = res.data.event.accidentSituation;
            this.ruleForm.beOnDuty = res.data.event.dutyPeople;
            this.ruleForm.leaderOnDuty = res.data.event.dutyLeader;
            this.ruleForm.submissionMethod = res.data.event.reportType;

            if (res.data.event.reportDepartId !== 0) {
              this.getReportingUnit(res.data.event.reportDepartId);
            }
            if (
              res.data.event.reportDepartId === 0 &&
              res.data.event.reportDepart !== ""
            ) {
              // 旧数据 res.data.event.reportDepartId为0 res.data.event.reportDepart为报送单位id
              // 获取reportDepartId
              this.getReportingUnit(res.data.event.reportDepart);
            }
            this.getIncidenAreaId(res.data.event.areaId);
            this.getCaseClassId(
              res.data.event.caseClassId,
              res.data.event.caseClass
            );
            console.log("事件数据：", this.ruleForm);
            /**
             * 获取电话计时是否开启存储在本地存储
             * **/
            let extend1 = res.data.event.extend1;
            let extend2 = res.data.event.extend2;
            sessionStorage.setItem("phoneExtend1", extend1);
            sessionStorage.setItem("smsExtend2", extend2);

            //重新赋值不绑定
            this.dataALL.eventTitle = res.data.event.title;
            this.dataALL.reportedTime = res.data.event.reportTime;
            this.dataALL.incidentTime = res.data.event.occurTime;
            this.dataALL.incidenArea = [res.data.event.areaId];
            this.dataALL.incidentSite = res.data.event.address;
            this.dataALL.reportingUnit = res.data.event.reportDepart;
            this.dataALL.incidenType = [res.data.event.caseClassId];
            // this.dataALL.incidentRank = res.data.event.eventLevel;
            this.dataALL.serialNumber = res.data.event.eventCode;
            this.dataALL.reportSituation = res.data.event.reportSuperior;
            this.dataALL.allCase = res.data.event.reportDescription;
            this.dataALL.speakerName = res.data.event.reportMan;
            this.dataALL.speakerPhone = res.data.event.reportNum;

            this.dataALL.timeOfWrittenSubmission =
              res.data.event.writtenReportTime;
            this.dataALL.accidentSituation = res.data.event.accidentSituation;
            this.dataALL.beOnDuty = res.data.event.dutyPeople;
            this.dataALL.leaderOnDuty = res.data.event.dutyLeader;
            this.dataALL.submissionMethod = res.data.event.reportType;

            this.reason = res.data.event.reason;
            this.result = res.data.event.result;
            this.growing = res.data.event.growing;
            this.messure = res.data.event.messure;

            this.ruleForm.serialNumber = res.data.event.eventCode;

            if (
              res.data.event.levelId !== 0 &&
              res.data.event.levelId !== "" &&
              res.data.event.planId !== "" &&
              res.data.event.planId !== 0
            ) {
              //已经启动过预案
              this.$store.commit("setTurnOnEmergencyResponse", true);
            } else {
              //没启动过预案
              this.$store.commit("setTurnOnEmergencyResponse", false);
            }

            if (res.data.eventParams.length == 0) {
              this.eventsParameters = false;
            } else {
              this.eventsParameters = true;
              // console.log('this.parameter: ',  this.parameter);
              setTimeout(() => {
                this.parameter = res.data.eventParams;
              }, 600);
              this.paramsData = res.data.eventParams; //重新赋值数据库数据做对比
            }
            this.$emit("getAll", this.dataALL, this.paramsData);
            // console.log('parameter: ', parameter);
          }
        });
      }
    },

    // 判断当前联事件id是否存在关联事件列表里面，如果不存在，faxForm.eventId为空
    /* isHaveEventId(eventId) {
      let filterEvent = this.eventOptions.filter(item => item.id === eventId)
      if (filterEvent.length > 0) {
        this.faxForm.eventId = eventId; // 如果有关联事件，则赋值
      } else {
        this.faxForm.eventId = ""; // 如果没有关联事件，则清空
      }
      console.log('该传真关联的事件id：', this.faxForm.eventId)
    }, */
    isHaveEventId(eventId) {
      for (let i in this.eventOptions) {
        if (this.eventOptions[i].id === eventId) {
          this.faxForm.eventId = eventId; // 如果有id，则赋值
          return false;
        } else {
          this.faxForm.eventId = ""; // 如果没有id，设置为空
        }
      }
    },

    //点击电话列表
    clickPhoneList(item, index) {
      this.phonePerson = "";
      this.leftEventId = "";
      this.changeIndex = index;
      this.audioList = {};
      this.audioUrlData = "";
      this.phoneText = "";
      this.leftEventId = item.id;
      console.log(item.phone);
      this.phonePerson = item.phone;
      this.nowTag = "phone";
      //获取录音文件
      let data = {
        phoneId: item.id,
      };
      this.$api.audioUrl(data).then((res) => {
        if (res.errorcode == 0) {
          if (res.data.url && res.data.url !== "") {
            this.testAudio = false;
            this.$nextTick(() => {
              this.testAudio = true;
              this.audioId = item.id;
              this.audioUrlData = window.g.ApiUrl + "/rec/" + res.data.url;
            });
          } else {
            this.testAudio = false;
          }
        } else {
          this.testAudio = false;
          this.audioUrlData = null;
          //this.$message.error(res.msg)
        }
      });
      //获取录音转文本内容
      this.$api.phoneToText(data).then((res) => {
        if (res.errorcode == 0) {
          this.phoneText = res.data;
        } else {
          // //this.$message.error(res.msg)
        }
      });
      //报告人
      this.$api.findContactorByMobile({ phoneNum: item.phone }).then((res) => {
        if (res.errorcode == "0") {
          this.ruleForm.speakerName = res.data.name || "";
          this.ruleForm.speakerPhone = res.data.mobile || "";
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    //点击短信列表
    clickSmsList(item, index) {
      this.phonePerson = "";
      this.leftEventId = "";
      this.changeIndex = index;
      this.smsText = item.title;
      this.leftEventId = item.id;
      this.phonePerson = item.phone;
      this.nowTag = "sms";
      console.log("nowTag", this.nowTag);
      //报告人
      this.$api.findContactorByMobile({ phoneNum: item.phone }).then((res) => {
        if (res.errorcode == "0") {
          this.ruleForm.speakerName = res.data.name || "";
          this.ruleForm.speakerPhone = res.data.mobile || "";
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    eventRelevance(item) {
      //事件关联
      this.eventList = true;
      this.id = item.id;
    },
    pageMode() {
      //监听是第几页
    },
    beforeClose() {
      //叉叉弹窗关闭销毁
      this.eventList = false;
      this.rushKist = false; //放在关闭时能解决V-if闪屏问题
      this.$nextTick(() => {
        this.rushKist = true;
      });
    },
    colser() {
      //取消
      this.eventList = false;
      this.rushKist = false; //放在关闭时能解决V-if闪屏问题
      this.$nextTick(() => {
        this.rushKist = true;
      });
    },
    cufim() {
      //确认
      this.eventList = false;
      this.rushKist = false; //放在关闭时能解决V-if闪屏问题
      this.$nextTick(() => {
        this.rushKist = true;
      });
      console.log(this.row);
      if (this.row) {
        let data = {
          eventId: this.row.id,
          id: this.id,
          type: this.nowTag,
        };
        console.log(data);
        this.$api.relateEvent(data).then((res) => {
          if (res.errorcode == "0") {
            console.log(res.data);
            if (this.nowTag == "phone") {
              this.getUnhandledPhone();
            } else if (this.nowTag == "sms") {
              this.getUnhandledSms();
            }
            this.$message({
              message: "关联成功",
              type: "success",
            });
          } else {
            //this.$message.error(res.msg)
          }
        });
      }
      this.row = "";
    },
    InformationDisposal() {
      //事件录入
      this.changeRed = "通讯处置";
      this.eventEnteringShow = false;
      this.InformationDisposalShow = true;
      this.infoEnteringShow = false;
    },
    eventEntering() {
      //信息处置
      this.changeRed = "事件登记";
      this.eventEnteringShow = true;
      this.InformationDisposalShow = false;
      this.infoEnteringShow = false;
    },
    infoEntering() {
      //信息处置
      this.changeRed = "信息登记";
      this.infoEnteringShow = true;
      this.eventEnteringShow = false;
      this.InformationDisposalShow = false;
    },
    //根据修改的事件类型获取事件参数
    amendParameter() {
      let caseIdParameter = sessionStorage.getItem("caseID");
      console.log("caseIdParameter: ", caseIdParameter);
      let data = {
        caseId: caseIdParameter,
      };
      this.$api.defaultParameters(data).then((res) => {
        if (res.errorcode == "0") {
          console.log(res.data);
          if (res.data.length > 0) {
            this.eventsParameters = true;
            this.parameter = res.data;
            console.log("this.parameter:", this.parameter);
          }
        } else {
          //this.$message.error(res.msg)
        }
      });
    },
    getUnhandledFax() {
      //获取未处理的传真
      this.treeLoading = true;
      const _that = this;
      let time1 = "";
      let time2 = "";
      if (this.queryFaxAllTime) {
        console.log(this.queryFaxAllTime);
        time1 = this.formatDateTime(this.queryFaxAllTime[0]);
        time2 = this.formatDateTime(this.queryFaxAllTime[1]);
      }
      let data = {
        beginTime: time1,
        endTime: time2,
        key: this.queryFaxAllSelect,
        page: this.currentFaxPage,
        size: 10,
        statusId: this.faxStateValue,
        faxType: this.faxTypeValue,
        blacklist: 0 // 不查询黑名单传真
      };
      // console.log(data)
      this.$api
        .getUnhandledFax(data)
        .then((res) => {
          if (res.errorcode == 0) {
            if (res.data) {
              this.list = res.data.data;
              this.totalFax = res.data.total;
              if (res.data.data.length != 0) {
                setTimeout(() => {
                  res.data.data[0].sendType = "fax";
                  res.data.data[0].sendTypeId = res.data.data[0].id;
                  if (_that.InformationDisposalShow) {
                    setTimeout(() => {
                      this.$refs.IcpFaxRight.visFlag = true;
                      _that.$refs.IcpFaxRight.eventRelevance = false;
                      _that.$refs.IcpFaxRight.msgHeadleState = "yes";
                      _that.$refs.smsRight.msgHeadleState = "yes";
                    }, 100);
                  }
                  _that.$store.dispatch("msgHeadleDatas", res.data.data[0]);
                }, 500);
                this.getEventOptions();
                setTimeout(() => {
                  this.changeItem(
                    this.changeIndex != -1
                      ? res.data.data[this.changeIndex]
                      : res.data.data[0],
                    this.changeIndex != -1 ? this.changeIndex : 0
                  );
                  // this.changeItem(
                  //   res.data.data[0],
                  //   this.changeIndex != -1 ? this.changeIndex : 0
                  // );
                }, 200);
              }
            }
            this.treeLoading = false;
          } else {
            //this.$message.error(res.msg)
            this.list = [];
            this.totalFax = 0;
            this.treeLoading = false;
          }
        })
        .catch(() => {
          this.list = [];
          this.totalFax = 0;
          this.treeLoading = false;
        });
    },
    getUnhandledPhone() {
      const _that = this;
      //获取未处理的电话
      let time1 = "";
      let time2 = "";
      this.phoneTreeLoading = true;
      this.changeIndex = -1;
      this.nowTag = "phone";
      this.phonePerson = "";
      this.InformationDisposalShow = false;
      this.eventEnteringShow = true;
      this.$nextTick(() => {
        //切换tabs时刷新右侧辅助页面的数据
        this.activeAllModel = "传真"; //默认传真
        this.InformationDisposalShow = true;
        this.eventEnteringShow = false;
        this.changeRed = "信息处置";
      });
      if (this.queryFaxAllTime) {
        console.log(this.queryFaxAllTime);
        time1 = this.formatDateTime(this.queryFaxAllTime[0]);
        time2 = this.formatDateTime(this.queryFaxAllTime[1]);
      }
      let data = {
        beginTime: time1,
        endTime: time2,
        key: this.queryFaxAllSelect,
        page: this.currentFaxPage,
        size: 10,
        statusId: this.faxStateValue,
        faxType: this.faxTypeValue,
      };
      console.log(data);
      this.$api.getUnhandledPhone(data).then((res) => {
        console.log(res);
        if (res.errorcode == 0) {
          this.list = res.data.data;
          this.totalFax = res.data.total;
          this.phoneTreeLoading = false;
          setTimeout(() => {
            _that.$refs.IcpFaxRight.msgHeadleState = "yes";
            _that.$refs.smsRight.msgHeadleState = "yes";
          }, 100);
          this.clickPhoneList(res.data.data[0], 0);
        } else {
          //this.$message.error(res.msg)
        }
      });
    },
    getUnhandledSms() {
      const _that = this;
      //获取未处理的短信
      let time1 = "";
      let time2 = "";
      this.smsText = "";
      this.smsTreeLoading = true;
      this.changeIndex = -1;
      this.nowTag = "sms";
      this.phonePerson = "";
      this.InformationDisposalShow = false;
      this.eventEnteringShow = true;
      this.$nextTick(() => {
        //切换tabs时刷新右侧辅助页面的数据
        this.activeAllModel = "传真"; //默认传真
        this.InformationDisposalShow = true;
        this.eventEnteringShow = false;
        this.changeRed = "信息处置";
      });
      if (this.queryFaxAllTime) {
        console.log(this.queryFaxAllTime);
        time1 = this.formatDateTime(this.queryFaxAllTime[0]);
        time2 = this.formatDateTime(this.queryFaxAllTime[1]);
      }
      let data = {
        beginTime: time1,
        endTime: time2,
        key: this.queryFaxAllSelect,
        page: this.currentFaxPage,
        size: 10,
        statusId: this.faxStateValue,
        faxType: this.faxTypeValue,
      };
      console.log(data);
      this.$api.getUnhandledSms(data).then((res) => {
        console.log(res);
        if (res.errorcode == 0) {
          this.list = res.data.data;
          this.totalFax = res.data.total;
          this.smsTreeLoading = false;
          setTimeout(() => {
            _that.$refs.IcpFaxRight.msgHeadleState = "yes";
            _that.$refs.smsRight.msgHeadleState = "yes";
          }, 100);
          this.clickSmsList(res.data.data[0], 0);
        } else {
          //this.$message.error(res.msg)
        }
      });
    },
    formatDateTime(time) {
      let date = time;
      let y = date.getFullYear();
      let m = date.getMonth() + 1;
      m = m < 10 ? "0" + m : m;
      let d = date.getDate();
      d = d < 10 ? "0" + d : d;
      return y + "-" + m + "-" + d;
    },
    //生成事件报文模板
    eventMessage() {
      let data = {
        caseId: sessionStorage.getItem("caseID"),
        typeId: "699",
        page: 1,
        size: 10,
      };
      this.$api.templateList(data).then((res) => {
        if (res.errorcode == 0) {
          console.log(res.data.data);
          res.data.data.forEach((item, i) => {
            let addClass = item.content;
            console.log(addClass);
            //替换事件基本信息，没填的不替换、保留占位符
            if (
              this.ruleForm.eventTitle !== undefined
              // this.ruleForm.eventTitle !== null &&
              // this.ruleForm.eventTitle !== ""
            ) {
              addClass = addClass.replace(
                "【事件标题】",
                this.ruleForm.eventTitle
              );
            }
            if (
              this.ruleForm.reportedTime !== undefined &&
              this.ruleForm.reportedTime !== null &&
              this.ruleForm.reportedTime !== ""
            ) {
              addClass = addClass.replace(
                "【接报时间】",
                this.ruleForm.reportedTime
              );
            }
            if (
              this.ruleForm.incidentTime !== undefined &&
              this.ruleForm.incidentTime !== null &&
              this.ruleForm.incidentTime !== ""
            ) {
              addClass = addClass.replace(
                "【事发时间】",
                this.ruleForm.incidentTime
              );
            }
            if (this.ruleForm.incidenArea.length > 0) {
              addClass = addClass.replace(
                "【事发区域】",
                this.ruleForm.incidenArea
              );
            }
            if (
              this.ruleForm.incidentSite !== undefined &&
              this.ruleForm.incidentSite !== null &&
              this.ruleForm.incidentSite !== ""
            ) {
              addClass = addClass.replace(
                "【事发地点】",
                this.ruleForm.incidentSite
              );
            }
            if (this.ruleForm.reportingUnit.length > 0) {
              addClass = addClass.replace(
                "【报送单位】",
                this.ruleForm.reportingUnit
              );
            }
            if (this.ruleForm.incidenType.length > 0) {
              addClass = addClass.replace(
                "【事件类型】",
                this.ruleForm.incidenType
              );
            }
            if (
              this.ruleForm.speakerName !== undefined &&
              this.ruleForm.speakerName !== null &&
              this.ruleForm.speakerName !== ""
            ) {
              addClass = addClass.replace(
                "【报告人-姓名】",
                this.ruleForm.speakerName
              );
            }
            if (
              this.ruleForm.speakerPhone !== undefined &&
              this.ruleForm.speakerPhone !== null &&
              this.ruleForm.speakerPhone !== ""
            ) {
              addClass = addClass.replace(
                "【报送人-电话】",
                this.ruleForm.speakerPhone
              );
            }
            if (
              this.reason !== undefined &&
              this.reason !== null &&
              this.reason !== ""
            ) {
              addClass = addClass.replace("【事发原因】", this.reason);
            }
            if (
              this.result !== undefined &&
              this.result !== null &&
              this.result !== ""
            ) {
              addClass = addClass.replace("【已造成后果】", this.result);
            }
            if (
              this.growing !== undefined &&
              this.growing !== null &&
              this.growing !== ""
            ) {
              addClass = addClass.replace("【事件发展趋势】", this.growing);
            }
            if (
              this.messure !== undefined &&
              this.messure !== null &&
              this.messure !== ""
            ) {
              addClass = addClass.replace("【已采取措施】", this.messure);
            }

            for (let param of this.parameter) {
              console.log(param);
              console.log(`【${param.name}】` === "【类型】");
              //需要根据信息要素名称匹配替换的字符串，名称为空则跳过
              if (
                param.name === undefined ||
                param.name === null ||
                param.name === ""
              ) {
                continue;
              }
              if (
                param.value === undefined ||
                param.value === null ||
                param.value === ""
              ) {
                //没填时显示暂无
                addClass = addClass.replace(`【${param.name}】`, "暂无");
              } else {
                let str = `${param.value}`;
                if (
                  param.unit === undefined ||
                  param.unit === null ||
                  param.unit === ""
                ) {
                  str = `${param.value}`;
                } else {
                  str = `${param.value}(${param.unit})`;
                }
                addClass = addClass.replaceAll(`【${param.name}】`, str);
                // console.log(addClass.indexOf(`【${param.name}】`, addClass[39])); // 39
                // console.log(`【${param.name}】`)
              }
              /*
                let paramString =
                  paramItem.name === "时间"
                    ? ` ${paramItem.name}: ${paramItem.value};`
                    : paramItem.value == 0
                    ? ` ${paramItem.name}:暂无  `
                    : ` ${paramItem.name}:${paramItem.value}(${paramItem.unit});`;
                 */
            }

            /*
              if (item.content.indexOf("参数项") !== -1) {
                console.log(item.content.indexOf("【参数项】"));
                let paramIndex = item.content.indexOf("【参数项】");
                addClass = addClass.substr(0, paramIndex);

                for (let param of arr) {
                  addClass += param;
                }
                console.log(addClass);
                // addClass = item.content // !!!!!
                // console.log(item.content)
                // console.log('addClass', this.ruleForm)
              }
              */

            // OK

            // addClass = addClass.replace('【参数项】 【值】【单位】；', '')
            // console.log(addClass)

            //console.log(arr); // ["受伤人数: 0(位);", "时间: null(null);", "死亡人数: 0(位);", "文本: null(本);"]

            // if(item.content.indexOf('受伤人数')!=-1){
            //   this.parameter.forEach((it,i)=>{//情景要素
            //     if(it.name.indexOf('受伤人数')!=-1){
            //       addClass = addClass.replace("【受伤人数】",it.value==(null||undefined)?0:it.value);
            //     }
            //
            //   })
            //
            // }
            // if(item.content.indexOf('时间')!=-1){
            //   this.parameter.forEach((it,i)=>{//情景要素
            //     if(it.name.indexOf('时间')!=-1){
            //       addClass = addClass.replace("【时间】",it.value==(null||undefined)?'暂无时间':it.value);
            //     }
            //
            //   })
            // }
            //
            // if(item.content.indexOf('死亡人数')!=-1){
            //   this.parameter.forEach((it,i)=>{//情景要素
            //     if(it.name.indexOf('死亡人数')!=-1){
            //       addClass = addClass.replace("【死亡人数】",it.value==(null||undefined)?0:it.value);
            //     }
            //
            //   })
            // }
            //
            // if(item.content.indexOf('文本')!=-1){
            //   this.parameter.forEach((it,i)=>{//情景要素
            //     if(it.name.indexOf('文本')!=-1){
            //       addClass = addClass.replace("【文本】",it.value==(null||undefined)?0 :it.value);
            //     }
            //
            //   })
            // }
            this.addClass = addClass;
            this.autoGenerAtion();
            // this.ruleForm.allCase =addClass
          });
        } else {
          //this.$message.error(res.msg)
        }
      });
    },
    //根据事件标题匹配事件类型和预案
    matchingTitle() {
      let eventTypeId = 0;
      let areaTypeId = 0;
      if (this.eventType.length > 0) {
        eventTypeId = this.eventType[0].id;
      }
      if (this.incidenArea.length > 0) {
        areaTypeId = this.incidenArea[0].id;
      }
      let data = {
        title: this.ruleForm.eventTitle,
        caseClassId: eventTypeId,
        areaId: areaTypeId,
      };
      this.$api.matchPreplan(data).then((res) => {
        if (res.errorcode == 0) {
          if (res.data === "" || res.data === []) {
            this.ruleForm.incidenType = [];
            this.eventType = [];
            return;
          }
          this.ruleForm.incidenType = res.data.caseClass.name;
          this.eventType = [];
          this.eventType.push({
            name: res.data.caseClass.name,
            id: res.data.caseClass.id,
          });
        } else {
          //this.$message.error(res.msg)
        }
      });
    },
    //发送事发地点
    sendSite() {
      if (
        this.ruleForm.incidentSite == "" ||
        this.latitude == "" ||
        this.longitude == ""
      ) {
        this.$message({
          message: "请先选择事发地点",
          type: "warning",
        });
        return;
      }
      if (this.ruleForm.eventTitle == "" || this.ruleForm.eventTitle == null) {
        this.$message({
          message: "请先填写事件标题",
          type: "warning",
        });
        return;
      }
      this.selectTitle = "选择联系人";
      this.selectData = true;
      this.$refs.selectDialog.getListTree();
    },
    //关闭事发地点的弹窗
    closeMultiple() {
      this.hackResetMultiple = false;
      this.$nextTick(() => {
        // this.$nextTick执行一轮循环后刷新dom。
        this.hackResetMultiple = true;
      });
      this.selectData = false;
    },
    autoGenerAtion() {
      if (
        this.ruleForm.reportedTime == "" ||
        this.ruleForm.reportedTime == null ||
        this.ruleForm.reportedTime == undefined
      ) {
        this.$message({
          message: "请填写接报时间",
          type: "warning",
        });
        return;
      }
      if (
        this.ruleForm.incidentTime == "" ||
        this.ruleForm.incidentTime == null ||
        this.ruleForm.incidentTime == undefined
      ) {
        this.$message({
          message: "请填写事发时间",
          type: "warning",
        });
        return;
      }
      if (
        this.ruleForm.allCase == "" ||
        this.ruleForm.allCase == null ||
        this.ruleForm.allCase == undefined
      ) {
        this.$refs.ruleForm.clearValidate();

        this.ruleForm.allCase = this.addClass;
        //             `${this.ruleForm.reportedTime}接报:${this.ruleForm.incidentTime},发生${this.ruleForm.incidenType}事故事件。
        // 事件过程:
        // 事发原因: ${this.reason==null||undefined?'':this.reason}
        // 已造成后果:${this.result==null||undefined?'':this.result}
        // 事件发展趋势:${this.growing==null||undefined?'':this.growing}
        // 已采取措施:${this.messure==null||undefined?'':this.messure}
        //             `
      } else {
        this.$confirm(
          "基本情况已有内容, 是否覆盖?点击【取消】则自动生成的内容到末尾",
          {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          }
        )
          .then(() => {
            this.$refs.ruleForm.clearValidate();
            this.ruleForm.allCase = "";
            this.ruleForm.allCase = this.addClass;
            //             this.ruleForm.allCase =
            //               `${this.ruleForm.reportedTime}接报:${this.ruleForm.incidentTime},发生${this.ruleForm.incidenType}事故事件。
            // 事件过程:
            // 事发原因: ${this.reason==null||undefined?'':this.reason}
            // 已造成后果:${this.result==null||undefined?'':this.result}
            // 事件发展趋势:${this.growing==null||undefined?'':this.growing}
            // 已采取措施:${this.messure==null||undefined?'':this.messure}
            //               `
          })
          .catch(() => {
            this.$refs.ruleForm.clearValidate();
            console.log(this.ruleForm.allCase, this.addClass);
            this.ruleForm.allCase += `\n\n${this.addClass}`;
            //               `\n\n${this.ruleForm.reportedTime}接报:${this.ruleForm.incidentTime},发生${this.ruleForm.incidenType}事故事件。
            // 事件过程:
            // 事发原因: ${this.reason==null||undefined?'':this.reason}
            // 已造成后果:${this.result==null||undefined?'':this.result}
            // 事件发展趋势:${this.growing==null||undefined?'':this.growing}
            // 已采取措施:${this.messure==null||undefined?'':this.messure}
            //               `
          });
      }
    },
    getTimes() {
      //获取现在的时间
      let now = new Date();
      let year = now.getFullYear(); //年
      let month = now.getMonth() + 1; //月
      let day = now.getDate(); //日
      let hh = now.getHours(); //时
      let mm = now.getMinutes(); //分
      let ss = now.getSeconds(); //秒
      let clock = year + "-";
      if (month < 10) clock += "0";
      clock += month + "-";
      if (day < 10) clock += "0";
      clock += day + " ";
      if (hh < 10) clock += "0";
      clock += hh + ":";
      if (mm < 10) clock += "0";
      clock += mm + ":";
      if (ss < 10) clock += "0";
      clock += ss;
      // this.ruleForm.incidentTime=clock
      this.ruleForm.reportedTime = clock;
    },
    //发送事发地点弹窗确认
    confirmMultiple(checkedCities) {
      console.log(checkedCities);
      if (checkedCities == "" || checkedCities == []) {
        this.$message({
          message: "请先选择联系人",
          type: "warning",
        });
        return;
      }
      this.hackResetMultiple = false;
      this.$nextTick(() => {
        // this.$nextTick执行一轮循环后刷新dom。
        this.hackResetMultiple = true;
      });
      let data = {
        title: this.ruleForm.title,
        location: this.ruleForm.incidentSite, //位置
        latitude: this.latitude, //纬度
        longitude: this.longitude, //经度
        contacts: checkedCities,
      };
      this.$api.sendLocation(data).then((res) => {
        if (res.errorcode == 0) {
          this.currentPage = 1;
          this.selectData = false;
          this.$message({
            message: "发送成功！",
            type: "success",
          });
          this.getStaetData();
        } else {
          //this.$message.error(res.msg)
        }
      });
    },
    closeMyDialogMultiple() {
      this.hackResetMultiple = false;
      this.$nextTick(() => {
        // this.$nextTick执行一轮循环后刷新dom。
        this.hackResetMultiple = true;
      });
      this.selectData = false;
    },
    saveEvent() {
      //保存事件
      if (this.changeIndex == -1) {
        this.$message.warning("请先选中关联左侧列表事件");
        return false;
      }
      this.$refs["ruleForm"].validate((valid) => {
        if (valid) {
          let eventTreeId = this.eventTree;
          let eventTypeId = this.eventType;

          if (eventTreeId.length == 0) {
            eventTreeId = "";
          } else {
            eventTreeId = eventTreeId[0].id;
          }
          if (eventTypeId.length == 0) {
            eventTypeId = "";
          } else {
            eventTypeId = eventTypeId[0].id;
          }
          if (this.longitude == "" || this.longitude == undefined) {
            this.longitude = null;
          }
          if (this.latitude == "" || this.latitude == undefined) {
            this.latitude = null;
          }
          console.log(eventTreeId, eventTypeId);
          let data = {
            // eventCode:this.ruleForm.serialNumber,
            vcTitle: this.ruleForm.eventTitle, //事件标题
            typeId: this.leftEventId,
            type: this.nowTag, //fax,phone,sms
            dtReportTime:
              this.ruleForm.reportedTime.length < 19
                ? this.ruleForm.reportedTime + ":00"
                : this.ruleForm.reportedTime, //接报时间 格式为yyyy-MM-dd HH:mm 的时间，需要在后加”:00“ author:hexinting date:2020-11-13 bug8161
            dtOccurTime:
              this.ruleForm.incidentTime.length < 19
                ? this.ruleForm.incidentTime + ":00"
                : this.ruleForm.incidentTime, //事发时间 格式为yyyy-MM-dd HH:mm 的时间，需要在后加”:00“ author:hexinting date:2020-11-11 bug8161
            iAreaId: this.ruleForm.incidenArea[
              this.ruleForm.incidenArea.length - 1
            ], //事发区域ID
            // eventTreeId, //事发区域ID
            vcAddress: this.ruleForm.incidentSite, //事发地点
            dLongitude: this.longitude, //经度
            dLatitude: this.latitude, //纬度
            vcReportDepart: this.ruleForm.reportingUnit[
              this.ruleForm.reportingUnit.length - 1
            ], //报送单位
            iCaseClassId: eventTypeId, //事件类型
            // iEventLevel: this.test,//事件等级
            iEvnetSetingParams: this.parameter, //事件参数
            txtReportSuperior: this.ruleForm.reportSituation, //上报情况
            txtReportDescription: this.ruleForm.allCase, //总体情况
            vcReportMan: this.ruleForm.speakerName,
            vcReportNum: this.ruleForm.speakerPhone,
            //deathNum: this.ruleForm.deathNum,
            // injuredNum: this.ruleForm.injuredNum,
            writtenReportTime: this.ruleForm.timeOfWrittenSubmission, // 书面报送时间
            reportType: this.ruleForm.submissionMethod, // 报送方式
            accidentSituation: this.ruleForm.accidentSituation, // 事故情况
            dutyPeople: this.ruleForm.beOnDuty, // 值班员
            dutyLeader: this.ruleForm.leaderOnDuty, // 值班领导
            phoneId:
              this.phoneHistalId == "" || undefined ? null : this.phoneHistalId,
            remark:
              this.phoneHistalremack == "" || undefined
                ? null
                : this.phoneHistalremack,
          };
          this.$api.saveEventReceive(data).then((res) => {
            if (res.errorcode == "0") {
              this.$message({
                message: "保存事件成功!",
                type: "success",
              });
              if (this.nowTag == "phone") {
                this.getUnhandledPhone();
              } else if (this.nowTag == "sms") {
                this.getUnhandledSms();
              }
              // let eventId = res.data.id;
              // this.reload()
            } else {
              this.$message({
                message: res.msg,
                type: "error",
              });
            }
          });
        }
      });
    },
    close() {
      //弹出选择取消
      this.addEventDialog = false;
      // sessionStorage.setItem('caseID', this.caseFor)
      // sessionStorage.setItem('areaId',this.areaIdArr)
      // sessionStorage.setItem('area',this.areaNameArr)
      this.$refs.eventDialog.clearData(); //刷新子组件数据
    },
    //树点击事件
    handleNodeClick(data) {
      let type = this.title;
      switch (type) {
        case "选择区域":
          this.eventTree = [];
          this.eventTree.push({ name: data.name, id: data.id });
          break;
        case "选择联系人分组":
          console.log(data.name);
          this.eventAddressBook = [];
          this.eventAddressBook.push({ name: data.name, id: data.id });
          break;
        case "选择事件类型":
          this.eventType = [];
          this.eventType.push({ name: data.name, id: data.id });
          break;
        default:
          break;
      }
    },
    confirm() {
      //弹窗选择确定
      let type = this.title;
      switch (type) {
        case "选择区域":
          this.ruleForm.incidenArea = this.eventTree[0].name;
          break;
        case "选择联系人分组":
          this.ruleForm.submittedUnit = this.eventAddressBook[0].name;
          break;
        case "选择事件类型":
          this.ruleForm.incidenType = this.eventTypeList[0].name;
          let data = this.eventTypeList[0].id;
          this.caseid = this.eventTypeList[0].id; //给生成模板用
          console.log(this.eventTypeList, this.caseid);
          this.amendParameter(this.eventTypeList[0].id);
          break;
        default:
          break;
      }
      this.$refs.eventDialog.clearData(); //刷新子组件数据
      this.addEventDialog = false;
    },
    //通讯录
    addressBook() {
      let data = {};
      this.$api.phoneGroupList(data).then((res) => {
        if (res.errorcode == "0") {
          // this.$refs.eventDialog.lol(res.data);

          this.reportingUnitData = res.data; // console.log("this.treeData: ", this.treeData);
          var gettree = function (data) {
            for (var i = 0; i < data.length; i++) {
              if (data[i].children.length == 0) {
                data[i].children = undefined;
              } else {
                gettree(data[i].children);
              }
            }
          };
          gettree(this.reportingUnitData);
        }
      });
    },
    eventScene() {
      let data = {};
      this.$api.topTree(data).then((res) => {
        if (res.errorcode == "0") {
          // this.$refs.eventDialog.lol(res.data);
          this.jurisdictionData = res.data; //console.log("this.treeData: 事件接报", this.treeData);
          var gettree = function (data) {
            for (var i = 0; i < data.length; i++) {
              if (data[i].children.length == 0) {
                data[i].children = undefined;
              } else {
                gettree(data[i].children);
              }
            }
          };
          gettree(this.jurisdictionData);
        }
      });
    },
    incidentType() {
      // this.title = "选择事件类型";
      let data = {};
      this.$api.getTree(data).then((res) => {
        if (res.errorcode == "0") {
          // console.log(res);
          this.eventTypeData = res.data;
          var gettree = function (data) {
            for (var i = 0; i < data.length; i++) {
              if (data[i].children.length == 0) {
                data[i].children = undefined;
              } else {
                gettree(data[i].children);
              }
            }
          };
          gettree(this.eventTypeData);
        }
      });
    },
    location() {
      //定位弹窗
      this.$refs.loction.visible = false;
      this.$refs.loction.rushLocation = false;
      this.$nextTick(() => {
        this.$refs.loction.visible = true;
        this.$refs.loction.rushLocation = true;
      });
    },
    locationCallback(obj) {
      if (obj.data.action && obj.data.action == "retpoint") {
        let latlon = obj.data.object.point.split(",");
        this.longitude = latlon[0];
        console.log(latlon[0], latlon[1]);
        this.latitude = latlon[1];
        this.ruleForm.incidentSite = obj.data.object.address;
        this.$refs.loction.visible = false;
      }
    },
    sendLocationMsg(obj) {
      if (obj.data.action && obj.data.action == "ready") {
        console.log(this.longitude);
        console.log(this.latitude);
        if (this.longitude && this.latitude) {
          this.longitude = "";
          this.latitude = "";
          this.ruleForm.incidentSite = "";
          //var framew = window.mapFrame.contentWindow;
          var mapFarme = document.getElementById("informId");
          if (mapFarme) {
            var data = {};
            data.action = "getpoint";
            var object = {};
            object.center = this.longitude + "," + this.latitude;
            object.address = this.ruleForm.incidentSite;
            object.area = "";
            data.object = object;
            mapFarme.contentWindow.postMessage(JSON.stringify(data), "*");
          }
        }
      }
    },
    // turTheText(){ //语音转文字
    //   if(this.voiceUrl==''||this.voiceUrl==null){
    //     return
    //   }
    //   let extenion=this.voiceUrl.split('.');
    //   console.log(extenion);
    //   let data={
    //     url:this.voiceUrl,
    //     extenion:extenion[4]
    //   }
    //   this.$api.downloadRecordToText(data).then((res) => {
    //     if(res.errorcode=='0'){
    //       console.log(res.data);
    //       this.word=res.data.result
    //     }
    //   })
    // },
    /**
     * @param {type} 没有
     * @return {String} 逐级展示的事件类型
     * @description：根据id拼接类型名字,全部获取
     * @author qinjiaqi
     * @date 2020-9-21
     */
    getIncidenType() {
      let incidenType = "";
      if (this.ruleForm.incidenType.length === 1) {
        if (
          this.eventTypeData.filter(
            (item) => item.id === this.ruleForm.incidenType[0]
          ).length > 0
        ) {
          incidenType = this.eventTypeData.filter(
            (item) => item.id === this.ruleForm.incidenType[0]
          )[0].name;
        } else {
          let type1 = "";
          let type2 = "";
          let type3 = "";
          for (let i = 0; i < this.eventTypeData.length; i++) {
            if (this.eventTypeData[i].children) {
              if (
                this.eventTypeData[i].children.filter(
                  (item) => item.id === this.ruleForm.incidenType[0]
                ).length > 0
              ) {
                type1 = this.eventTypeData[i].name;
                type2 = this.eventTypeData[i].children.filter(
                  (item) => item.id === this.ruleForm.incidenType[0]
                )[0].name;
                incidenType = type1 + "/" + type2;
                // incidenType = this.eventTypeData[i].children.filter(item => item.id === this.ruleForm.incidenType[0])[0].name
              } else {
                for (
                  let j = 0;
                  j < this.eventTypeData[i].children.length;
                  j++
                ) {
                  if (this.eventTypeData[i].children[j].children) {
                    if (
                      this.eventTypeData[i].children[j].children.filter(
                        (item) => item.id === this.ruleForm.incidenType[0]
                      ).length > 0
                    ) {
                      type1 = this.eventTypeData[i].name;
                      type2 = this.eventTypeData[i].children[j].name;
                      type3 = this.eventTypeData[i].children[j].children.filter(
                        (item) => item.id === this.ruleForm.incidenType[0]
                      )[0].name;
                      incidenType = type1 + "/" + type2 + "/" + type3;
                      // incidenType = this.eventTypeData[i].children[j].children.filter(item => item.id === this.ruleForm.incidenType[0])[0].name;
                    }
                  }
                }
              }
            }
          }
        }
      } else if (this.ruleForm.incidenType.length === 2) {
        let type1 = this.eventTypeData.filter(
          (item) => item.id === this.ruleForm.incidenType[0]
        )[0].name;
        let type2 = "";
        for (let i = 0; i < this.eventTypeData.length; i++) {
          if (this.eventTypeData[i].children) {
            if (
              this.eventTypeData[i].children.filter(
                (item) => item.id === this.ruleForm.incidenType[1]
              ).length > 0
            ) {
              type2 = this.eventTypeData[i].children.filter(
                (item) => item.id === this.ruleForm.incidenType[1]
              )[0].name;
              incidenType = type1 + "/" + type2;
              // incidenType = this.eventTypeData[i].children.filter(item => item.id === this.ruleForm.incidenType[1])[0].name
            }
          }
        }
      } else if (this.ruleForm.incidenType.length === 3) {
        let type1 = this.eventTypeData.filter(
          (item) => item.id === this.ruleForm.incidenType[0]
        )[0].name;
        let type2 = "";
        let type3 = "";
        for (let i = 0; i < this.eventTypeData.length; i++) {
          if (this.eventTypeData[i].children) {
            for (let j = 0; j < this.eventTypeData[i].children.length; j++) {
              if (this.eventTypeData[i].children[j].children) {
                if (
                  this.eventTypeData[i].children[j].children.filter(
                    (item) => item.id === this.ruleForm.incidenType[2]
                  ).length > 0
                ) {
                  type2 = this.eventTypeData[i].children.filter(
                    (item) => item.id === this.ruleForm.incidenType[1]
                  )[0].name;
                  type3 = this.eventTypeData[i].children[j].children.filter(
                    (item) => item.id === this.ruleForm.incidenType[2]
                  )[0].name;
                  incidenType = type1 + "/" + type2 + "/" + type3;
                  // incidenType = this.eventTypeData[i].children[j].children.filter(item => item.id === this.ruleForm.incidenType[2])[0].name;
                }
              }
            }
          }
        }
      }
      console.log("getIncidenType获取的事件类型：", incidenType);
      return incidenType;
    },
    /**
     * @param {type} 没有
     * @return {String} 最后一个地区的名字
     * @description：根据id拼接辖区名字,只获取最后一个地区
     * @editor qinjiaqi
     * @date 2020-9-21
     */
    getIncidenArea() {
      let incidenArea = "";
      if (this.ruleForm.incidenArea.length === 1) {
        if (
          this.jurisdictionData.filter(
            (item) => item.id === this.ruleForm.incidenArea[0]
          ).length > 0
        ) {
          incidenArea = this.jurisdictionData.filter(
            (item) => item.id === this.ruleForm.incidenArea[0]
          )[0].name;
        } else {
          let area1 = "";
          let area2 = "";
          let area3 = "";
          for (let i = 0; i < this.jurisdictionData.length; i++) {
            if (this.jurisdictionData[i].children) {
              if (
                this.jurisdictionData[i].children.filter(
                  (item) => item.id === this.ruleForm.incidenArea[0]
                ).length > 0
              ) {
                // area1 = this.jurisdictionData[i].name;
                // area2 = this.jurisdictionData[i].children.filter(item => item.id === this.ruleForm.incidenArea[0])[0].name
                // incidenArea = area1 + area2
                incidenArea = this.jurisdictionData[i].children.filter(
                  (item) => item.id === this.ruleForm.incidenArea[0]
                )[0].name;
              } else {
                for (
                  let j = 0;
                  j < this.jurisdictionData[i].children.length;
                  j++
                ) {
                  if (this.jurisdictionData[i].children[j].children) {
                    if (
                      this.jurisdictionData[i].children[j].children.filter(
                        (item) => item.id === this.ruleForm.incidenArea[0]
                      ).length > 0
                    ) {
                      // area1 = this.jurisdictionData[i].name;
                      // area2 = this.jurisdictionData[i].children[j].name;
                      // area3 = this.jurisdictionData[i].children[j].children.filter(item => item.id === this.ruleForm.incidenArea[0])[0].name;
                      // incidenArea = area1 + area2 + area3
                      incidenArea = this.jurisdictionData[i].children[
                        j
                      ].children.filter(
                        (item) => item.id === this.ruleForm.incidenArea[0]
                      )[0].name;
                    }
                  }
                }
              }
            }
          }
        }
      } else if (this.ruleForm.incidenArea.length === 2) {
        // let area1 = this.jurisdictionData.filter(item => item.id === this.ruleForm.incidenArea[0])[0].name;
        // let area2 = ''
        for (let i = 0; i < this.jurisdictionData.length; i++) {
          if (this.jurisdictionData[i].children) {
            if (
              this.jurisdictionData[i].children.filter(
                (item) => item.id === this.ruleForm.incidenArea[1]
              ).length > 0
            ) {
              // area2 = this.jurisdictionData[i].children.filter(item => item.id === this.ruleForm.incidenArea[1])[0].name
              // incidenArea = area1 + area2
              incidenArea = this.jurisdictionData[i].children.filter(
                (item) => item.id === this.ruleForm.incidenArea[1]
              )[0].name;
            }
          }
        }
      } else if (this.ruleForm.incidenArea.length === 3) {
        // let area1 = this.jurisdictionData.filter(item => item.id === this.ruleForm.incidenArea[0])[0].name;
        // let area2 = ''
        // let area3 = ''
        for (let i = 0; i < this.jurisdictionData.length; i++) {
          if (this.jurisdictionData[i].children) {
            for (let j = 0; j < this.jurisdictionData[i].children.length; j++) {
              if (this.jurisdictionData[i].children[j].children) {
                if (
                  this.jurisdictionData[i].children[j].children.filter(
                    (item) => item.id === this.ruleForm.incidenArea[2]
                  ).length > 0
                ) {
                  // area2 = this.jurisdictionData[i].children.filter(item => item.id === this.ruleForm.incidenArea[1])[0].name;
                  // area3 = this.jurisdictionData[i].children[j].children.filter(item => item.id === this.ruleForm.incidenArea[2])[0].name;
                  // incidenArea = area1 + area2 + area3
                  incidenArea = this.jurisdictionData[i].children[
                    j
                  ].children.filter(
                    (item) => item.id === this.ruleForm.incidenArea[2]
                  )[0].name;
                }
              }
            }
          }
        }
      }
      console.log("getIncidenArea获取的事件类型：", incidenArea);
      return incidenArea;
    },
    /**
     * @param {type} 没有
     * @return {String} 按格式生成的标题
     * @description：一键生成标题
     * @author qinjiaqi
     * @date 2020-9-21
     */
    generateTheTitle() {
      console.log(
        "辖区名字：",
        this.ruleForm.incidenArea,
        this.jurisdictionData,
        this.jurisdictionData.filter(
          (item) => item.id === this.ruleForm.incidenArea[0]
        )
      );
      console.log(
        "事件类型：",
        this.ruleForm.incidenType,
        this.eventTypeData,
        this.eventTypeData.filter(
          (item) => item.id === this.ruleForm.incidenType[0]
        )
      );
      let oneTime = "";
      let twoTime = "";
      // 辖区名字
      let incidenArea = this.getIncidenArea();
      // 事件类型
      let incidenType = this.getIncidenType();
      /* if (this.ruleForm.incidenType.length > 0) {
               incidenType = this.eventTypeComments[0].name
        }*/
      if (this.ruleForm.incidentTime) {
        oneTime = this.ruleForm.incidentTime.substring(5, 7);
        twoTime = this.ruleForm.incidentTime.substring(8, 10);
      }
      // 生成标题时防止用户将必填项置空导致意义不明标题出现
      if (
        (oneTime === "" && twoTime === "") ||
        incidenArea === "" ||
        incidenType === ""
      ) {
        this.$message({
          message: "请将必填信息补充完整",
          type: "warning",
        });
        return;
      }
      // this.ruleForm.eventTitle = `${oneTime}.${twoTime} ${this.ruleForm.incidenArea} ${this.ruleForm.incidenType}`;
      this.ruleForm.eventTitle = `${oneTime}.${twoTime} ${incidenArea}/${incidenType}`;
      this.$message({
        message: "生成成功",
        type: "success",
      });
      this.$refs["ruleForm"].clearValidate(["eventTitle"]);
      console.log("事件标题：", this.ruleForm.eventTitle);
    },
    //语音截取识别成功赋值文字
    sendPhoneText(val) {
      this.phoneText = val;
    },
    //电话一键核实
    phoneVerification() {
      if (this.phonePerson == "" || this.leftEventId == "") {
        this.$message({
          message: "请选择需要核实的内容!",
          type: "warning",
        });
        return;
      }
      this.InformationDisposalShow = true;
      this.eventEnteringShow = false;
      this.$nextTick(() => {
        this.activeAllModel = "电话";
        this.changeRed = "信息处置";
        this.$refs.newPhoneModel.oneKeyCheck(this.phonePerson);
      });
    },
    //短信一键核实
    smsCheck() {
      if (this.phonePerson == "" || this.leftEventId == "") {
        this.$message({
          message: "请选择需要核实的内容!",
          type: "warning",
        });
        return;
      }
      this.InformationDisposalShow = true;
      this.eventEnteringShow = false;
      this.$nextTick(() => {
        this.activeAllModel = "电话";
        this.changeRed = "信息处置";
        this.$refs.newPhoneModel.oneKeyCheck(this.phonePerson);
      });
    },
    //传真一键核实
    faxCheck() {
      if (this.phonePerson == "" || this.leftEventId == "") {
        this.$message({
          message: "请选择需要核实的内容!",
          type: "warning",
        });
        return;
      }
      this.InformationDisposalShow = true;
      this.eventEnteringShow = false;
      this.$nextTick(() => {
        this.activeAllModel = "电话";
        this.changeRed = "信息处置";
        this.$refs.newPhoneModel.oneKeyCheck(this.faxcontactId);
      });
    },
    submitClose() {
      this.phonesText = "";
      this.isAddPhonesShow = false;
    },
    submitPhones() {
      if (this.phonesText.length == 0) {
        this.$message.warning("输入不能为空");
      } else {
        let data = this.phonesText.split(/[,，]/) || [];
        data = [...new Set(data)];
        let data1 = [];
        data.forEach((o) => {
          if (/^(\d{3,4}-)?\d{7,8}$/.test(o)) {
            data1.push(o);
          } else {
            setTimeout(() => {
              this.$message.error("传真号码格式错误:" + o);
            }, 500);
          }
        });
        if (data1.length == 0) {
          this.$message.warning("请输入正确的传真号码");
        } else {
          this.$refs.IcpFaxRight.getfaxDataN(data1);
        }
      }
    },
    //获取未办结事件
    getEventOptions() {
      let ipData = {
        dtStart: "",
        dtEnd: "",
        searchText: this.searchText,
        page: this.currentPage,
        size: 10,
      };
      this.$api.todolist(ipData).then((res) => {
        if (res.errorcode == 0) {
          this.eventOptions.push(...res.data.data);
          this.loadMore = res.data.data.length == 0 ? false : true;
        } else {
          // //this.$message.error(res.msg)
        }
      });
    },
    savefaxHistory() {
      let data = {
        id: this.faxForm.id,
        type: this.faxForm.type,
        title: this.faxForm.title,
        result: this.faxForm.result,
        eventId: this.faxForm.eventId,
        statusId: this.faxForm.status,
      };
      if (typeof data.statusId != "number") delete data.statusId;
      this.$api.disposeFax(data).then((res) => {
        if (res.errorcode != 0) {
          this.$message({
            message: res.msg,
            type: "error",
          });
          return;
        }
        this.$message({
          message: "保存成功！",
          type: "success",
        });
        this.getUnhandledFax();
      });
    },
    //获取状态列表
    getStateListData() {
      let data = {
        pcode: "information_processing_status",
      };
      this.$api.eventGetByPcodes(data).then((res) => {
        if (res.errorcode == 0) {
          console.log("res.data: ", res.data);
          this.faxStateData = res.data;
        } else {
          this.$message({
            message: res.msg,
            type: "error",
          });
        }
      });
    },
    // 获取全部右边表单类型
    getFaxTypeSelections() {
      this.$api.getFaxTypeSelections().then((res) => {
        if (!res.data) {
          this.faxAllTypeList = [];
          return;
        }
        this.faxAllTypeList = res.data;
      });
    },
    // 查看传真历史
    SeeTheHistory(item) {
      let historyArray = [];
      // console.log(item);
      historyArray = [];
      this.InformaHistoryFlag = true;
      this.$refs.InformaHistory.historyVisiable = true;
      let obj = {
        id: item.id,
        type: "fax",
      };
      this.$api
        .getShowHistory(obj)
        .then((res) => {
          if (res.errorcode == 0) {
            console.log(res.data);
            for (let key in res.data) {
              this.lockHistory(res.data[key], key.substr(0, key.indexOf("L")));
              historyArray.push(res.data[key]);
            }
            let arr = historyArray.flat(); //降维成一维
            console.log(arr, historyArray);
            if (arr.length !== 0) {
              arr.forEach((ele) => {
                if (ele.list) {
                  ele.name = this.disposeVisName(ele.list);
                } else {
                  ele.name = "";
                }
                if (ele.type == "fax") {
                  ele.durationStr = this.hourTimeNum(ele.duration);
                }
                ele.millisecond = new Date(ele.time).getTime(); //用毫秒数进行冒泡排序
              });
              var len = arr.length;
              for (var i = 0; i < len - 1; i++) {
                for (var j = 0; j < len - 1 - i; j++) {
                  // 相邻元素两两对比，元素交换，大的元素交换到后面
                  if (arr[j].millisecond > arr[j + 1].millisecond) {
                    var temp = arr[j];
                    arr[j] = arr[j + 1];
                    arr[j + 1] = temp;
                  }
                }
              }
              arr = arr.reverse();
              console.log(arr);
              this.$refs.InformaHistory.listData = arr;
              this.$refs.InformaHistory.audio();
              this.$refs.InformaHistory.historyVisiable = false;
            } else {
              this.$refs.InformaHistory.listData = [];
              this.$refs.InformaHistory.historyVisiable = false;
            }
          } else {
            this.$message({
              message: res.msg,
              type: "error",
            });
          }
        })
        .catch(() => {
          this.$refs.InformaHistory.listData = [];
          this.$refs.InformaHistory.historyVisiable = false;
        });
    },
    //分钟数
    minutes(time) {
      let secondNum = parseInt(time) % 3600; //得到秒
      let minutes = "00";
      //分钟
      if (secondNum >= 60) {
        minutes =
          parseInt(secondNum / 60) >= 10
            ? parseInt(secondNum / 60)
            : "0" + parseInt(secondNum / 60);
      }
      return (
        minutes +
        "分" +
        (secondNum % 60 >= 10 ? secondNum % 60 : "0" + (secondNum % 60)) +
        "秒"
      );
    },
    //小时
    hourTimeNum(time) {
      //大于等于一个小时
      let hourStr = "00";
      if (time >= 3600) {
        hourStr =
          parseInt(time / 3600) >= 10
            ? parseInt(time / 3600)
            : "0" + parseInt(time / 3600);
        return hourStr + "时" + this.minutes(time);
      } else {
        return this.minutes(time);
      }
    },
    //处理显示姓名
    disposeVisName(data) {
      let str = "";
      if (data.length != 0) {
        data.forEach((ele, index) => {
          if (index == data.length - 1) {
            str += ele.contactor;
          } else {
            str += ele.contactor + "、";
          }
        });
      }
      // console.log(str)
      return str;
    },
    //处理查看历史回调的数据
    lockHistory(data, type) {
      if (data.length != 0) {
        data.forEach((ele) => {
          ele.type = type;
        });
      }
    },
    // 关闭传真历史弹窗
    closeInformaHis() {
      this.InformaHistoryFlag = false;
    },

    /**
     * @description: 选中的事件
     * @author: xuchuangxing
     * @lastEditor : xuchuangxing
     * @updateTime : 20201119 14:56
     * @param {obj} 选中的事件信息
     * @return {*}
     */
    selectEvent(obj) {
      this.visible = false;
      this.faxForm.eventTitle = obj.title;
      this.faxForm.eventId = obj.id;
    },
    /**
     * @description: 搜索事件
     * @author : xuchuangxing
     * @lastEditor : xuchuangxing
     * @updateTime : 2020-11-19 15:06
     * @param {*}
     * @return {*}
     */
    searchEvent() {
      this.currentPage = 1;
      this.eventOptions = [];
      this.getEventOptions();
    },
    /**
     * @description: 每次追加10条事件列表
     * @author : xuchuangxing
     * @lastEditor : xuchuangxing
     * @updateTime : 2020-11-19 15:06
     * @param {*}
     * @return {*}
     */
    loadMoreHandle() {
      this.currentPage++;
      this.getEventOptions();
    },
      // 拨打默认电话
      callPhoneAssign(item) {
        let obj = {
          type: this.$store.state.msgHeadleData.sendType,
          typeId: this.$store.state.msgHeadleData.sendTypeId
        }
        if (item.mobile) {
          this.talkCall({number: item.mobile}, '', obj)
        } else if (item.otherTel) {
          this.talkCall({number: item.otherTel}, '', obj)
        } else if (item.officeTel) {
          this.talkCall({number: item.officeTel}, '', obj)
        } else if (item.number) {
          this.talkCall({number: item.number}, '', obj)
        } else if (item.otherTel2) {
          this.talkCall({number: item.otherTel2}, '', obj)
        }
      },
      // 拨打电话
      callPhone(phone) {
        if (phone) {
          let obj = {
            type: this.$store.state.msgHeadleData.sendType,
            typeId: this.$store.state.msgHeadleData.sendTypeId
          }
          this.talkCall({number: phone}, '', obj)
        }
      },
      //点击切换通讯录
      tabCommon() {
        this.initLatelyData("eleFlagHumanFlag") //初始化
        this.tabObj.common = true
        this.affairsObj = {}
        this.organizationData = []
        this.getTissueDataList()
        this.value = '1'
        this.gid = 0
        this.searchBtn()
      },
      //点击切换快捷组
      tabShortcutGroup(){
        this.initLatelyData("eleFlagHumanFlag") //初始化
        this.tabObj.shortcutGroup = true
        this.affairsObj = {}
        this.organizationData = []
        this.shortcutGroupList()
        this.value = '9'
        this.gid = 0
        this.searchBtn()
      },
      //点击切换最近联系人
      tabRecently() {
        this.initLatelyData() //初始化
        this.tabObj.recently = true
        this.combineRequery()
      },
      //获取常用联系人  政务联络网
      getCommonListData() {
        let data = {
          page: this.lately.page,
          size: 10,
          searchText: '',
          type: 'phone'
        }
        this.$api.commonContactorList(data).then((res) => {
          if (res.errorcode == 0) {
            console.log(res.data)
            if (res.data) {
              this.settlePhone(res.data.data)
            }
            this.lately.total = res.data.totalElements
          } else {
            this.$message.error(res.msg)
          }
        });
      },
      //应急联络网
      // getCommonListData() {
      //   let data = {
      //     id: 0
      //   }
      //   this.$api.getBriefsByClassId(data).then((res) => {
      //     if (res.errorcode == 0) {
      //       let fun = this.getDa(res.data, 'versionId')
      //     } else {
      //       this.$message.error(res.msg)
      //     }
      //   });
      // },
      //递归获取组织架构
      getDa(data, str) {
        if (data.length != 0) {
          data.forEach((ele, index) => {
            if (ele[str]) {
              this.$api.getStructTree({id: ele[str]}).then((res) => {
                if (res.errorcode == 0) {
                  ele.children = res.data
                  if (index == data.length - 1) {
                    this.data = data
                    console.log(data)
                  }
                }
              });
            }
          })
        }
      },
      //获取最近联系人
      getRecentlyListData() {
        this.$api.getRecentContactorList().then((res) => {
          if (res.errorcode == 0) {
            console.log(res.data)
            this.lately.total = res.data.totalElements
            if (res.data) {
              if (res.data.data.length != 0) {
                this.settlePhone(res.data.data)
                // res.data.data.forEach(ele => {
                //   ele.phoneAllObj = {
                //     mobile: ele.callType == 0 ? ele.calling : ele.called
                //   }
                // })
              }
              this.theOrganizationData = res.data.data
            }
          } else {
            this.$message.error(res.msg)
          }
        })
      },
      //整合常用和最近联系人的请求
      combineRequery() {
        if (this.tabObj.common) {
          this.getCommonList()
        } else if (this.tabObj.recently) {
          this.getRecentlyListData()
        }
      },
      //获取常用联系人
      getCommonList() {
        let data = {
          page: this.lately.page,
          searchText: "",
          size: 14,
          type: "phone",
          all: true
        }
        this.$api.commonContactorList(data).then((res) => {
          if (res.errorcode == 0) {
            if (res.data) {
              console.log("电话联系人数据为：", res.data.data)
              if (res.data) {
                this.settlePhone(res.data.data)
                this.theOrganizationData = res.data.data
                this.lately.total = res.data.totalElements
              }
            }
          } else {
            this.$message.error(res.msg)
          }
        })
      },
      //点击组织架构
      handleNodeClickZuZhi(obj, node) {
        this.input = ""
        this.organization.page = 1
        console.log('节点信息为：', obj, node)
        if (this.value == 1 || this.value == 5 || this.value == 6 || this.value == 7 || this.value == 9 || !this.value) {
          this.isDrawOrCli = 1 //1代表是树节点下
          this.affairs(obj, undefined)

        } else if (this.value == 4) {
          this.isDrowOrClick = 1 //1表示树节点下拉
          this.emergencyAddressBook(obj)
          this.nodeid = obj.id
          this.nodechildren = obj.children
        }
      },
      // 设置dictType
      setDictType (value) {
        let dictType = ''
        switch (value) {
          case '1':
            dictType = 'governmentAffairs'
            break;
          case '5':
            dictType = 'primaryLevel'
            break;
          case '6':
            dictType = 'spareTime'
            break;
          case '7':
            dictType = 'resource'
            break;
          case '9':
            dictType = 'quick'
            break;
          default:
            dictType = undefined
        }
        return dictType;
      },
      //搜索
      searchBtn() {
        if (this.value == 1 || this.value == 5 || this.value == 6 || this.value == 7 || this.value == 9 ||  !this.value) {
          let dictType = this.setDictType(this.value);
          this.isDrawOrCli = 2 //2代表搜索框搜索
          if (this.gid === -1) {
            this.affairs({id: -1}, dictType)
          } else {
            // this.gid = 0
            this.affairs({}, dictType)
          }
        } else if (this.value == 4) {
          this.isDrowOrClick = 2 //2表示搜索框搜索
          this.emergencyAddressBook({id: this.nodeid, children: this.nodechildren})
        }
      },
      //备勤联络网
      dutyGroupList() {
        this.$api.dutyGroupList({displayDefault: true}).then(res => {
          console.log(res)
          if (res.errorcode != 0) {
            this.$message({
              message: res.msg,
              type: "error"
            });
            return
          }
          if (res.data) {
            this.data = res.data
          }
        })
      },
      //资源联络网
      resourceGroupList() {
        this.$api.resourceGroupList({displayDefault: true}).then(res => {
          console.log(res)
          if (res.errorcode != 0) {
            this.$message({
              message: res.msg,
              type: "error"
            });
            return
          }
          if (res.data) {
            this.data = res.data
          }
        })
      },
      // 快捷组
      shortcutGroupList() {
        this.$api.shortcutGroupList({displayDefault: true}).then(res => {
          console.log(res)
          if (res.errorcode != 0) {
            this.$message({
              message: res.msg,
              type: "error"
            });
            return
          }
          if (res.data) {
            this.data = res.data
          }
        })
      },
      // 政务组织网
      affairs(obj, dictType) {
        if (this.isDrawOrCli === 1) {
          if (obj.id === -1) {
            this.gid = -1
            this.input = ''
          } else {
            this.gid = 0
          }
        }
        if (this.isDrawOrCli === 2) {
          if (obj.id === -1) {
            this.gid = -1
            this.input = ''
          } else {
            this.gid = 0
          }
        }
        this.affairsObj = obj
        let data = {
          groupId: obj.id || 0,
          page: this.organization.page,
          searchText: this.input,
          dictType,
          size: 10,
          type: "phone"
        };
        this.$api.contactorList(data).then(res => {
          console.log(res)
          if (res.errorcode != 0) {
            this.$message({
              message: res.msg,
              type: "error"
            });
            return
          }
          if (res.data) {
            this.settlePhone(res.data.list)
          }
          this.organizationData = res.data.list
          this.organization.total = res.data ? res.data.totalCount : 0
          console.log(this.organization.total)
        })
      },
      //应急联动网
      emergencyAddressBook(obj) {
        let isTop = true
        if (this.isDrowOrClick === 1) {  //1表示树节点下拉
          this.input = ''
        }
        let isObjectExist = JSON.stringify(obj) == '{}'
        if (!isObjectExist && obj.children) {
          if (obj.children.length === 0) {
            isTop = false
          }
        }
        console.log('点击时的对象是：', obj)
        this.affairsObj = obj
        let data = {
          id: obj.id,
          isTop: isTop + '',
          page: this.organization.page,
          searchText: this.input,
          size: 10,
          type: "phone"
        }
        console.log('传递的搜索数据是:', data)
        this.$api.emergencyAddressBook(data).then(res => {
          console.log(res)
          if (res.errorcode != 0) {
            this.$message({
              message: res.msg,
              type: "error"
            });
            return
          }
          this.settlePhone(res.data ? res.data.data : [])
          this.organizationData = res.data ? res.data.data : []
          this.organization.total = res.data ? res.data.totalElements : 0
        })
      },
      //整理电话数据
      settlePhone(data) {
        if (data.length != 0) {
          console.log(data)
          data.forEach(ele => {
            ele.phoneAllObj = {
              mobile: ele.mobile,//手机号码
              otherTel: ele.otherTel, //手机2
              officeTel: ele.officeTel,//办公电话
              number: ele.number,//联系号码
              otherTel2: ele.otherTel2//其他号码
            }
          })
        }
      },
      //组织架构的选择页
      handleSizeChange(val) {
        console.log(`每页 ${val} 条`);
      },
      handleCurrentChange(val) {
        console.log(`当前页: ${val}`);
        // 架构的页数变化时查看是哪个组织下的，然后发起请求
        if (this.value == 1 || this.value == 5 || this.value == 9) {
          this.affairs(this.affairsObj, this.setDictType(this.value))
        } else if (this.value == 4) {
          this.emergencyAddressBook(this.affairsObj)
        }
      },
      //最近联系人和常用联系人
      latelyHandleSizeChange(val) {
        // console.log(`每页 ${val} 条`);
        this.lately.page = val
        this.combineRequery()
      },
      latelyHandleCurrentChange(val) {
        // console.log(`当前页: ${val}`);
        this.lately.page = val
        this.combineRequery()
      },
      //显示更多
      visMoreList(flag, data) {
        if (flag) {
          let Ele = Array.from(document.querySelectorAll('.el-dropdown-menu.el-popper'))
          if (Ele.length != 0) {
            setTimeout(() => {
              Ele.forEach(ele => {
                // console.log(parseInt(ele.style.left),ele)
                ele.style.left = parseInt(ele.style.left) + 23 + 'px'
                ele.style.top = parseInt(ele.style.top) + 50 + 'px'
              })
            }, 10)
          }
        }
      },
      changeHeaderSelectValue(data) {
        setTimeout(() => {
          let ele = document.querySelector('.phoneIndex_header_select .el-select-dropdown')
          ele.style.top = parseInt(ele.style.top) - 5 + 'px'
        }, 100)
      },
      //获取组织架构
      getTissueDataList() {
        let data = {
          displayDefault: true //是否显示未分组联系人
        };
        this.$api.telephoneGroupingTree(data).then(res => {
          if (res.errorcode != 0) {
            this.$message({
              message: res.msg,
              type: "error"
            });
            return
          }
          this.data = res.data;
        })
      },
      //打电话
      dialing(data) {
        console.log(data)
        let obj = {
          type: this.$store.state.msgHeadleData.sendType,
          typeId: this.$store.state.msgHeadleData.sendTypeId
        }
        this.talkCall({number: parseInt(data.phoneNumber)}, '', obj)
      },
      //获得组织架构联系人
      getGroup() {

      },
      //获得基层联络网
      getJC() {
        //
        let data = {displayDefault: true}
        this.$api.gliaisonGroupList(data).then((res) => {
          if (res.errorcode == 0) {
            console.log(res.data)
            this.data = res.data
          } else {
            this.$message.error(res.msg)
          }
        })

      },
      //根据选择的组织架构值加载数据
      ifGetDataFun(val) {
        if (val == 4 && this.eleFlagHumanFlag) {
          this.getCommonListData()
        } else if (val == 5 && this.eleFlagHumanFlag) {
          this.getJC()
        } else if (val == 6 && this.eleFlagHumanFlag) {
          this.dutyGroupList()
        } else if (val == 7 && this.eleFlagHumanFlag) {
          this.resourceGroupList()
        } else if (val == 8 && this.eleFlagHumanFlag) {
          this.shortcutGroupList()
        } else if (this.eleFlagHumanFlag) {
          this.getTissueDataList()
        }
      }

}
}
</script>

<style scoped>
.informationDisposalNew_warp {
  height: 98%;
}

.informationDisposalNew_warp .word {
  text-align: center;
  margin: auto;
  position: absolute;
  display: inline-block;
  width: 50px;
  color: #fff;
  transform-origin: bottom center;
  font-size: 12px;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  right: -14px;
  top: 3px;
  font-size: 10px;
  color: white;
}

.informationDisposalNew_warp .triangle-topright {
  border-left: 20px solid transparent;
  border-right: 20px solid transparent;
  position: absolute;
  top: 7px;
  right: -15px;
  transform: rotate(45deg);
  width: 25px;
}

.informationDisposalNew_warp .textType {
  display: inline-block;
  background: rgba(250, 250, 250, 1);
  border-radius: 3px;
  border: 1px solid rgba(197, 222, 254, 1);
  width: 75px;
  height: 21px;
  color: #0091ff !important;
  line-height: 21px;
  text-align: center;
}

.el-dialog__headerbtn .el-dialog__close {
  font-size: 25px;
  font-weight: bold;
}

.el-dialog--center .el-dialog__body {
  padding: 5px 0 0 0;
}

#faxCard .el-card__body {
  padding: 0px;
}

.clock_img {
  float: right;
  color: #0091ff;
}

.message-img {
  background-image: url("../../../../static/img/icon/message.png");
  background-repeat: no-repeat;
  height: 18px;
  width: 18px;
  /*margin: auto 0;*/
  /*margin-left: 100px;*/
}

.event-img {
  background-image: url("../../../../static/img/icon/event.png");
  background-repeat: no-repeat;
  height: 18px;
  width: 18px;
  /*margin: auto 0;*/
  /*margin-left: 100px;*/
}

.cardModelDiv {
  border-bottom: 5px solid cornflowerblue;
}

.cardModelDiv .el-card__header {
  padding: 14px 20px;
}

.messageDiv {
  flex: 1;
  height: 42px;
  border: #dddee1 solid 1px;
  font-size: 17px;
  color: #333333;
  line-height: 42px;
  background: #ffffff;
  display: flex;
  cursor: pointer;
  justify-content: center;
  align-items: center;
}

.messsagColor {
  background-color: #f0f6ff;
  color: #0091ff;
  border-left: 3px solid #0091ff;
  box-sizing: border-box;
}

.messageDiv:active {
  width: 264px;
  height: 42px;
  border: #dddee1 solid 1px;
  font-size: 17px;
  color: #333333;
  line-height: 42px;
  background: #fbfcff;
  display: flex;
  cursor: pointer;
  justify-content: center;
}

.messageCut {
  margin: 0 auto;
  font-size: 16px;
}

#itemCalss .el-form-item__content {
  margin-left: 0 !important;
}

.fullScreen {
  position: absolute;
  right: 30px;
  z-index: 999;
  cursor: pointer;
  color: #ccc;
}

.informationReception_wrap  >>> .tabsClass {
  background: #ffffff;
}

.informationReception_wrap >>> .el-tabs__header.is-top {
  margin: 0;
  height: 52px;
  border-bottom: 0;
}

.informationReception_wrap >>> .el-tabs__nav-wrap.is-top {
  color: #a2a2a2 !important;
  /* background: #f9fbff; */
  height: 52px;
}

.informationReception_wrap >>> .el-tabs__nav-scroll {
  margin-top: 10px;
}

.informationReception_wrap >>> .el-tabs__item {
  font-size: 17px;
  color: #a2a2a2;
}

.informationReception_wrap >>> .el-tabs__item.is-active {
  color: #409eff;
  padding-left: 10px;
}

.informationReception_wrap >>> .el-tabs__item:hover {
  color: #6b7280;
}

.informationReception_wrap >>> .el-tabs .el-tabs__header .el-tabs__nav-scroll .el-tabs__nav.is-top{
  padding-left: 0px !important;
  border: none;
}
.informationReception_wrap >>> .el-tabs .el-tabs__header .el-tabs__nav-scroll .el-tabs__nav.is-top:after{
    content: "";
    position: absolute;
    background: #0091ff;
    width: 3px;
    height: 18px;
    left: 1px;
    top: 12px;
}
.el-tabs__nav-next,
.el-tabs__nav-prev {
  line-height: 58px;
  font-size: 20px;
}
.informationReception_wrap >>> .el-textarea__inner{
  border-radius: 0;
}

.informationReception_wrap>>>..el-collapse{
  border: none;
}
.informationReception_wrap .el-range-editor--small.el-input__inner {
  height: initial;
}

.informationReception_wrap .el-range-editor--small .el-range-separator {
  line-height: 32px;
}

.icon-smile {
  background-image: url(../../../assets/icpImg/smile.png);
  background-repeat: no-repeat;
  width: 25px;
  height: 25px;
  float: right;
}

#itemCalss .el-form-item__content {
  margin-left: 0 !important;
}

#serial .el-input.is-disabled .el-input__inner:nth-child(1) {
  background-color: black !important;
  color: yellow !important;
}

.informationReception_wrap .el-input.is-disabled .el-input__inner {
  /*overflow: hidden;*/
  /*text-overflow: ellipsis;*/
  white-space: nowrap;
}

.el-input-number--mini {
  width: 193px;
}

/* >>>.el-form--label-left .el-form-item__label{
     letter-spacing: 1px;
     position: relative;
   } */
#reporter .el-col-10 {
  padding: 0 !important;
}

#reporter .el-col-14 {
  padding-right: 0 !important;
}

#itemCalss .el-form-item__content {
  margin-left: 0 !important;
}

#baowen .el-form-item__content {
  margin-left: 0 !important;
}

#baowenNeiRon .el-form-item__content textarea {
  background-color: #f9f9f9;
  padding-right: 80px;
  resize: none;
}

#baowen .el-form-item__label:before {
  content: "";
  color: #f56c6c;
  margin-right: 4px;
}

.el-pagination__jump {
  margin-left: 0;
}

.phoneCall .el-form-item__content {
  margin-left: 0 !important;
}

#titleEvent .el-input__inner {
  padding-right: 84px !important;
}

.none {
  height: 40px;
  /*margin: 10px 0;*/
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.parameterTop,
.parameterBottom {
  display: flex;
  width: 100%;
  margin: 0 auto;
  padding: 0;
  justify-content: space-between;
}

.parameterTop li,
.parameterBottom li {
  list-style: none;
  width: 33.333%;
  height: 30px;
}

.parameterTop li::before {
  content: "●";
  color: #bde4ff;
  padding-right: 10px;
}

.informationReception_wrap .el-tooltip__popper {
  max-width: 400px !important;
  font-size: 16px !important;
  line-height: 180%;
}

/*  enlong */
.informationReception_wrap >>> .el-tabs__content {
  flex: 1;
}

.informationReception_wrap >>> .el-tabs__nav-wrap::after {
  height: 0px;
}

.informationReception_wrap .sendFaxList-headline {
  background: #0091ff;
  margin: 3px 10px;
  height: 20px;
  width: 3px;
}

.informationReception_wrap  .auto_printing {
  position: absolute;
  right: 74px;
}

.informationReception_wrap .el-card {
  position: relative;
}

.informationReception_wrap .cardCalss .el-card__body {
  padding: 0;
  background-color: #ebeef5;
}

.informationReception_wrap .faxFormClass .el-form-item {
  margin-bottom: 14px;
}

/* .faxFormitemClass .el-form-item__label {
  line-height: 20px;
} */
.MessageHandling {
}
.informationReception_wrap >>>.el-form--label-right .el-form-item__label{
     text-align: left;
}
.informationReception_wrap >>>.my-phone-right-main .sendMsg .operation{
  margin: 20px 20px 0 20px !important;
}
.informationReception_wrap .phoneHeaderRadio >>>.el-radio-button__inner{
  padding: 10px 20px;
}
.informationReception_wrap >>> .MessageHandling > div {
  /* height: 100%;
  max-height: 100%; */
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.informationReception_wrap .my-phone-right-main > div {
  flex: 1;
}

.informationReception_wrap .my-phone-right-main > div:nth-child(1) {
  display: flex;
  flex-direction: column;
  min-height: 200px;
}

.informationReception_wrap .my-phone-right-main > div:nth-child(1) > div:nth-child(1) {
  flex: 1;
}

/*  修改样式用   进行穿透 .MessageHandling>div> .my-phone-right-main-user*/
.informationReception_wrap >>> .my-phone-right-main-user{
  padding: 0 !important;
  margin-bottom: 10px !important;
}

.informationReception_wrap>>> .msgTemplate {
  display: none;
}

.informationReception_wrap>>> .my-phone-right-main {
  height: 100% !important;
  display: flex;
  flex-direction: column;
}

.informationReception_wrap>>> .contentModular {
  margin: 12px 0 8px 12px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
}

.informationReception_wrap >>> .sendMsg {
  overflow: hidden;
  padding-bottom: 0;
}

.informationReception_wrap >>> .sendMsg .el-tabs {
  margin: 0 20px;
}

>>> .sendFaxList {
  flex: 1;
  height: auto !important;
  display: flex;
  flex-direction: column;
  min-height: 200px;
}

>>> .my-phone-right-main > div:nth-child(3) {
  height: auto !important;
  min-height: 200px;
}
.informationReception_wrap >>> .my-sms-box{
  height: 205px !important;
}
.informationReception_wrap >>> .my-sms-box .NoSMSList{
  height: 205px;
  font-size:14px;
  font-weight: 500;
  line-height: 345px;
}
>>> .my-fax-head{
  padding: 13px 15px !important;
  border-bottom: 1px solid #EAE6E6;
}
>>> .recipieNumber{
  font-size: 17px !important;
}

.my-fax-picture {
  height: auto !important;
  max-height: 83%;
}

.faxListTable {
  height: auto !important;
  flex: 1;
}

.el-tab-pane {
  height: 100%;
}

.flex_wrap > div:nth-child(2) {
  flex: 1;
}

.dialog-style {
  display: flex;
  justify-content: center;
  align-items: center;
}

.sendFaxBox {
  min-height: 310px;
  max-height: 310px;
}

.el-dialog {
  margin: 0 !important;
}

.el-dialog__wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
}

.eventDetail-box-list-left {
  margin-right: 10px;
}

.eventDetail-box-list-right {
  flex: 1;
  width: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  padding: 0 10px;
  border-bottom: 1px solid #333;
}

.phoneIndex_header_select {
  width: 141px;
  height: 42px;
  background: rgba(255, 255, 255, 1);
  border-radius: 4px;
}

.phoneHeader{
  display: flex;
  border-bottom: 1px solid #EAE6E6;
}
.informationReception_wrap .phoneHeaderRadio{
  display: flex;
  margin: 10px 0 10px 20px;
}

  .framework {
    flex: 1;
    display: flex;
    justify-content: space-between;
    overflow-x: hidden;
  }

  .framework > div:nth-child(1) {
    width: 455px;
    overflow-y: scroll;
    padding-top: 20px;
    box-sizing: border-box;
    border-right: 1px solid #EAE6E6;
  }

  /* .framework > div {
    width: 50%;
    max-width: 265px;
  } */
  .commonInfo{
    display: flex;
    flex-direction: column;
  }

.framework_right_header > div:nth-child(1) > button {
  position: absolute;
  right: 0;
  top: 0;
  height: 100%;
  width: 15%;
  border: none;
  cursor: pointer;
  background: transparent;
  outline: none;
}
.informationReception_wrap {
    height: 100%;
    background: #fff;
    display: flex;
    flex-direction: column;
    /* margin: 7px 0px 0px 0px; */
  }

.phoneIndex_header {
  flex: 1;
  height: 60px;
  display: flex;
  justify-content: flex-end;
}

  .phoneIndex_header_select {
    width: 141px;
    height: 42px;
    background: rgba(255, 255, 255, 1);
    border-radius: 4px;
  }

  .phoneIndex_header_Tab {
    display: flex;
    align-items: center;
    cursor: pointer;
    white-space: nowrap;
    margin-right: 25px;
  }
  .phoneIndex_header_Tab:nth-child(3) {
    display: flex;
    align-items: center;
    cursor: pointer;
    white-space: nowrap;
    margin-right: 20px;
  }

  .phoneIndex_header_Tab > img {
    width: 24px;
    height: 24px;
    margin-right: 10px;
  }
  .phoneIndex_header_Tab > span{
    font-size: 14px;
    font-weight: 400;
    color: rgba(51, 51, 51, 1);
    line-height: 17px;
    height: 17px;
  }

  .phoneIndex_content {
    flex: 1;
    display: flex;
    overflow-y: scroll;
  }

  .framework_right {
    display: flex;
    flex-direction: column;
    width: 100%;
  }

  .framework_right_header {
    padding-left: 10px;
    display: flex;
    /* justify-content: center; */
    align-items: center;
    margin-top: 10px;
    position: relative;
  }

  .framework_right_header > div:nth-child(1) {
    width: 460px;
    height: 42px;
    position: relative;
  }

  .framework_right_header > div:nth-child(1) > button {
    position: absolute;
    right: 0;
    top: 0;
    height: 100%;
    width: 15%;
    border: none;
    cursor: pointer;
    background: transparent;
    outline: none;
  }

  .framework_right_header > img {
    width: 28px;
    height: 28px;
    margin-left: 10px;
    cursor: pointer;
  }

  .cellPhoneNum {
    position: absolute;
    top: 45px;
    right: 5%;
    background: #fff;
    z-index: 99;
    padding: 20px 15px;
    box-shadow: 0px 0px 32px 4px rgba(201, 201, 201, 0.27);
  }

  .cellPhoneNum > div {
    background: none !important;
    background-image: none !important;
  }

  .cellPhoneNum > div >>> .close {
    display: none;
  }

  /*渲染的列表*/
  .framework_right_content {
    padding-left: 10px;
    flex: 1;
    display: flex;
    flex-direction: row;
    align-items: center;
    padding-top: 14px;
    overflow: scroll;
    box-sizing: border-box;
    flex-wrap: wrap;
    align-content: flex-start;
  }
  .framework_right_content_list {
    min-width: 235px;
    min-height: 80px;
    max-width: 240px;
    width: 175px;
    height: 59px;
    background: rgba(255, 255, 255, 1);
    border-radius: 4px;
    border: 1px solid rgba(234, 230, 230, 1);
    margin-bottom: 12px;
    padding: 10px 8px 10px 10px;
    box-sizing: border-box;
    display: flex;
    justify-content: space-between;
    cursor: pointer;
    position: relative;
    transition: all .5s;
    margin-right: 10px;
  }
  .commonAndRecently_content>.framework_right_content_list {
    min-width: 230px;
    min-height: 80px;
    max-width: 240px;
    width: 175px;
    height: 59px;
    background: rgba(255, 255, 255, 1);
    border-radius: 4px;
    border: 1px solid rgba(234, 230, 230, 1);
    margin-bottom: 12px;
    padding: 10px 8px 10px 10px;
    box-sizing: border-box;
    display: flex;
    justify-content: space-between;
    cursor: pointer;
    position: relative;
    transition: all .5s;
    margin-right: 10px;
  }

  .framework_right_content_list:hover {
    transform: translateY(-5px);
    box-shadow: 3px 3px 3px #ccc;
    border: 1px solid rgba(157, 190, 255, 1);
    background: rgba(245, 250, 255, 1);
  }

  .framework_right_content_list >>> .el-dropdown {
    font-size: 26px;
    color: #DDDDDD;
    cursor: pointer;
    user-select: none;
    margin-top: -5px;
  }

  .framework_right_content_list >>> .el-select {
    position: absolute;
    left: -3%;
    top: 35px;
    width: 106%;
  }

  .framework_right_content_list >>> .el-select > .el-input {
    visibility: hidden;
  }

  .framework_right_content_list >>> .el-popper {
    left: 0 !important;
  }

  .framework_right_content_list_active {
    border: 1px solid rgba(157, 190, 255, 1);
    background: rgba(245, 250, 255, 1);
  }

  .framework_right_content_list_left {
    max-width: 80%;
  }

  .framework_right_content_list_left > div {
    text-align: left;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }

  .framework_right_content_list_left > div:nth-child(1) {
    font-size: 17px;
    font-weight: 600;
    color: rgba(51, 51, 51, 1);
    margin-bottom: 7px;
  }

  .framework_right_content_list_right {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    position: relative;
    height: 45px;
  }

  .selectPhone {
    position: absolute;
    top: -17px;
    right: 5px;
  }

  .cellPhoneImg {
    width: 25px;
    height: 27px;
    background: url("/static/img/Communihistory/cell.png") no-repeat;
    background-size: 100% 100%;
    cursor: pointer;
  }

  .cellPhoneImg:hover {
    background: url("/static/img/Communihistory/cell1.png") no-repeat;
    background-size: 100% 100%;
  }

  .informationReception_wrap .framework_right_footer {
    position: relative;
    margin-bottom: 3px;
  }

  .informationReception_wrap .framework_right_footer > span {
    position: absolute;
    z-index: 100;
    top: 4px;
    bottom: 0;
    left: 55%;
    margin: auto;
  }

  .informationReception_wrap .framework_right_footer >>> .el-pagination {
    position: relative;
    text-align:center;
  }

  .informationReception_wrap .framework_right_footer >>> .el-pagination__jump {
    font-size: 0;
    position: absolute;
    left: 34%;
    height: 25px;
    z-index: 100;
  }

  .informationReception_wrap .framework_right_footer >>> .el-pagination .btn-next .el-icon, .framework_right_footer >>> .el-pagination .btn-prev .el-icon {
    font-size: 18px;
  }

  .informationReception_wrap .framework_right_footer >>> .el-pagination .btn-next,
  .informationReception_wrap .framework_right_footer >>> .el-pagination .btn-prev {
    position: relative;
    z-index: 99;
  }

  .informationReception_wrapv .framework_right_footer >>> .el-pagination__jump .el-pagination__editor.el-input,
  .informationReception_wrap .framework_right_footer >>> .el-pagination__jump .el-pagination__editor.el-input .el-input__inner {
    width: 57px;
    height: 25px;
  }

  .selectPhoneCell {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 250px;
    padding: 0 20px;
    box-sizing: border-box;
  }

  .selectPhoneCell > img {
    width: 18px;
    height: 19px;
    cursor: pointer;
    visibility: hidden;
  }

  .selectPhoneCell:hover img {
    visibility: visible;
  }

  .selectPhoneCell:hover {
    font-weight: 500;
    color: rgba(0, 145, 255, 1);
  }


  /*联系人*/
  .commonAndRecently {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
  }

  .commonAndRecently_content {
    width: 100%;
    padding: 15px 15px;
    box-sizing: border-box;
    overflow-y: scroll;
    display: flex;
    flex: 1;
    flex-wrap: wrap;
    justify-content:flex-start;
    align-content: flex-start;
  }

  .commonAndRecently_footer {
    width: 265px;
  }

  >>> .el-tree > .is-expanded {
    position: relative;
  }

  >>> .el-tree > .is-expanded:before {
    content: '';
    position: absolute;
    height: calc(100% - 26px);
    width: 1px;
    border-left: 1px dashed #AFAFAF;
    left: 32px;
    top: 17px;
    z-index: 99;
  }

  /*激活时的蓝色条*/
  >>> .el-tree .el-tree-node__content {
    position: relative;
  }

  >>> .el-tree .el-tree-node__content:before {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 2px;
    background: #2d8cf0;
  }

  >>> .el-tree-node__expand-icon.expanded {
    margin-left: 20px;
  }

  >>> .el-tree-node__content > .el-tree-node__expand-icon {
    margin-left: 20px;
  }

  >>> .el-icon-search:before {
    font-size: 20px
  }

  >>> .el-icon-caret-right:before {
    content: "\E6E0";
  }

  >>> .el-tree-node__content:hover,
  >>> .el-tree-node__content:active,
  >>> .el-tree-node__content:focus {
    background: rgba(63, 146, 254, .2);
    color: #3F92FE;
  }

  >>> .el-tree-node__label {
    font-size: 14px;
  }

  >>> .el-dropdown-menu__item {
    padding: 0;
  }

  >>> .popper__arrow {
    display: none !important;
  }

  >>> .el-pager > li {
    display: none;
  }

  >>> .el-pager > li:last-child {
    display: block;
    text-align: right;
  }

  >>> .el-pager {
    width: 120px;
    overflow: hidden;
    z-index: 99;
    position: relative;
  }

  >>> .el-dropdown-menu__item:focus,
  >>> .el-dropdown-menu__item:hover {
    color: #000;
    background: none;
  }

  >>> .el-select-dropdown__item {
    font-size: 17px;
  }

  >>> .el-select-dropdown__item.hover,
  >>> .el-select-dropdown__item:hover {
    font-weight: 500;
  }

  >>> .el-select-dropdown__item.selected {
    font-weight: 500;
    background: rgba(0, 145, 255, .2);
  }

  >>> .expanded {
    color: #ccc;
  }
  .informationReception_wrap .MessageHandling >>> .relatedEvents{
    margin-top: 12px;
    padding: 0px !important;
    display: none;
  }
</style>
