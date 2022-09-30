import Vue from 'vue'
import Vuex from 'vuex'
import cloneDeep from 'lodash/cloneDeep'
import common from './modules/common'
import user from './modules/user'
import rules from './modules/rules'
import callPhone from './modules/call-phone'
import analysis from './modules/analysis'
import responseUnit from './modules/responseUnit'
import seat from './modules/seat'
import actions from './actions'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    common,
    user,
    rules,
    echarts,
    callPhone,
    analysis,
    responseUnit,
    seat,
  },
  //这里放全局参数
  state: {
    /******************************************************* 石景山项目开始 *******************************************************/
    /****** 服务状态提示 ******/
    agentService: "坐席未连接", //坐席连接状态
    communicationService: "通讯服务未连接", //通讯服务连接状态
    smsService: "短信服务未连接", //短信服务连接状态
    /****** icp 20.0 19.0 使用变量 ******/
    callStatus: false, //是否通话中
    callClass: "", //当callStatus=true时，呼出【callout】,呼叫进入【callin】,通话中【callon】,保持中【callheld】
    cid: "", //语音呼叫id
    callee: "", //通话端电话号码
    caller: "", //坐席电话号码
    callType: "", // video:视频呼叫 voice:语音呼叫 monitor:视频监控 halfdial:半双工点呼
    callQueue: [], //通话队列,
    passcode: "", //会议密码
    unifiedAccessCode: "", //会议统一接入码
    callconn: "", //通道编号
    confStatus: false, //是否会议中
    confId: "", //会议编号
    currentGroupNum: "", //当前集群抢权编号
    ConfMemberStatus: {
      videoList: [],
      camera: [],
      microphone: [],
    }, //会议成员和画面语音状态
    callHistoryId: "", //当前通话历史ID
    grpid: "", //组呼群组号
    timer: "00:00:00", //计时器

    /******  我是区分 ↑ 和 ↓ 的区别的 ******/
    preparednessResponse: false, //是否启动预案
    eventSituation: [], //存储事件总体情况内容
    eventParam: [],
    isJumpToIcpPhone: true,
    /* 电话历史-登记事件 */
    phoneHistoryId: {},
    txtNotify: [], //备忘录语音转文字
    youShiKanAgentIdsCenterNo: "", //优士康调度员信息↓
    youShiKanAgentIdsValue: "",
    youShiKanAgentIdsPassword: "",
    youShiKanAgentIdsDspuserNo: "",
    navTree: [], // 导航菜单树
    defaultactive: "", // 当前路由名称
    youShiKanLogin: true, //优士康是否登录成功
    myVdcConfId: "",
    icpName: "phone",
    userCall: {},
    ConfMemberStatus1: [], // 会议列表
    smsMember: [], //短信队列
    faxMember: [], //传真队列
    talkMember: [], // 对讲列表
    phoneTreeList: {
      //电话树状分组队列
      tree1: [],
      tree4: [],
      tree5: [],
      tree6: [],
      tree7: [],
    },
    smsTreeList: {
      //短信树状分组队列
      tree1: [],
      tree4: [],
      tree5: [],
      tree6: [],
      tree7: [],
      tree8: [],
    },
    faxTreeList: {
      //传真树状分组队列
      tree1: [],
      tree4: [],
      tree5: [],
      tree6: [],
      tree7: [],
      tree8: [],
    },
    meetingTreeList: {
      //会议树状分组队列
      tree3: [],
      tree6: [],
      tree4: [],
      tree5: [],
      tree8: [],
      tree1: [],
      tree2: [],
      tree7: [],
    },
    talkTreeList: {
      //对讲树状分组队列
      tree1: [],
    },
    ConfSpeakStatus: false, // 全部发言
    ConfBroadcastStatus: false, // 全部广播
    ConfTalkbackStatus: false, // 全部对讲
    dienNumber: "", //事件总体情况死亡人数
    overallEvent: "", //事件总体情况突发事件报文
    dispositionType: "", //悬浮球跳转的处置类型
    videoNumber: [],
    isShowWind: false,
    videoType: 1, //会议类型
    meetingFunction: false, //会议单独广播、发言、对讲，成功状态
    setForm: {
      //会议设置
      conNumber: 11, //会场数量
      timeType: 3, //1小时，2分钟，3秒
      timeNumber: "",
      type: null, //切换模式 1部分,全部
      number: 0, //每次切换视频数量
      changeType: 1, //轮询顺序 1 时间先后 2随机
    },
    confListIndex: 0, //当前会议序号
    confList: [
      {
        myVdcConfId: "", //当前会议ic
        id: "", //当前会议历史记录id
        videoType: 1, //会议类型
        timer: "00:00:00", //计时器
        videoList: [], //当前会议成员详细数据包括名称，号码，状态
        start: "", //加入时间只对应呼叫入会
        videoNumber: [], //当前会议成员号码用于检测是否已经加入会议防止会议成员重复
        confStatus: false,
      },
    ],
    groupType: "", //批量导入联系人类型
    groupId: null, //批量导入联系人ID

    isLoadShow: false, //
    groupActive: false, // 集群会议抢权状态
    currentGroupName: "", //集群号码
    boardCasdIndex: -1, // 单个广播编号
    boardStatus: 1, //广播执行状态 1全部广播 2全部禁播  3单个广播 4单个禁播
    // meetRemoveIndex: -1,
    telephoneState: 0, //通话状态
    musicState: "-1", //为空不响铃,具体参数在actions
    phoneList: [], //电话队列
    nowSelectPhoneList: [], //现在选中的通话
    xinxiheshiArr: [], // 信息核实
    xinxibaosongArr: [], // 信息报送
    lingdaozhishiArr: [], // 领导指示
    boxList: [
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
    ], //拨号盘可操作组
    bookReminder: false, //是否需要通讯录提醒
    dutyReminder: false, //是否需要交接班提醒
    phoneState: 5, //判断是那种类型的操作 0=>三方
    threePhoneList: [], //三方通话队列
    faxScanStatus: 0, //0：非作业中，1：扫描中2：成功，3：失败，
    scanFilePath: "", //扫描文件路径
    isCallPhone: "hangUp", //是否在通话中，这里用icp返回的通话队列来设置   call>=振铃  talking>=通话 hangUp >= 挂断
    isCallType: "", //callIng>= 呼入  callOut >=呼出
    isPhoneCallStatus: false, // 是否可操作电话队列用来存储 nowSelectPhoneList  false 不可用 ||可用
    isAgentSpeekList: [], //实时转文字存储内容
    isShowButton: false, // 是否显示小按钮
    threePhoneId: "", //三方通话ID
    isHangUp: true, //  true/ 电话呼出时不可挂断 false /可以挂断
    isIntelligenceReports: false, //是否开启智能接报,面对突然改的需求你是改整体逻辑还是加参数呢?
    isMissedCalls: false, //是否有未接来电
    msgContactsUpdate: false, // 短信联系人是否更新
    faxContactsUpdate: false, // 传真联系人
    dialogType: "", // big : 最大弹窗 small : 中等弹窗 mini : 最小弹窗  '' : 不弹窗
    manyCallsList: [], // 呼入通话弹窗
    //信息处置
    msgHeadleData: {},
    makeCallMobile: "", //被叫号码
    uploadAgent: true, //agent是否需要重新加载
    holdCallPhone: false, //是否为保持中
    faxSendCount: 0, //传真发送次数
    phoneToPickMachine: false, //手柄是否在空闲状态
    // 事件续报
    msgTabName: "", // 事件续报短信名称
    faxQueueDetail: {}, // 融合通讯当前传真队列详情
    copyContent: "", // 当前系统复制的内容
    copyBusinessCard: "", // 复制名片

    answerNum: 0, //未读
    dialable: false, // 是否需要拨号
    autoCallSettings: {
      // 自动转接设置
      isAutoCall: "关",
      phone: "",
    },
    makeCallMessage: null, // 拨打电话收到回调消息
    recordFile: "", // 通话后录音文件地址
    /******************************************************* 石景山项目结束 *******************************************************/

    /******************************************************* openlab项目开始 *******************************************************/
    selectContact: [],
    mainTabs: [], //菜单栏面包屑
    mainTabsActiveName: "", //选中面包屑名字
    /****** 服务状态提示 ******/
    agentService: "坐席未连接", //坐席连接状态
    communicationService: "通讯服务未连接", //通讯服务连接状态
    smsService: "短信服务未连接", //短信服务连接状态
    /****** icp 20.0 19.0 使用变量 ******/
    callStatus: false, //是否通话中
    callClass: "", //当callStatus=true时，呼出【callout】,呼叫进入【callin】,通话中【callon】,保持中【callheld】
    cid: "", //语音呼叫id
    callee: "", //通话端电话号码
    caller: "", //坐席电话号码
    callType: "", // video:视频呼叫 voice:语音呼叫 monitor:视频监控 halfdial:半双工点呼
    callQueue: [], //通话队列,
    passcode: "", //会议密码
    unifiedAccessCode: "", //会议统一接入码
    callconn: "", //通道编号
    confStatus: false, //是否会议中
    confId: "", //会议编号
    currentGroupNum: "", //当前集群抢权编号
    ConfMemberStatus: {
      videoList: [],
      camera: [],
      microphone: [],
    }, //会议成员和画面语音状态
    callHistoryId: "", //当前通话历史ID
    grpid: "", //组呼群组号
    timer: "00:00:00", //计时器

    /******  我是区分 ↑ 和 ↓ 的区别的 ******/
    preparednessResponse: false, //是否启动预案
    eventSituation: [], //存储事件总体情况内容
    eventParam: [],
    isJumpToIcpPhone: true,
    /* 电话历史-登记事件 */
    phoneHistoryId: {},
    txtNotify: [], //备忘录语音转文字
    youShiKanAgentIdsCenterNo: "", //优士康调度员信息↓
    youShiKanAgentIdsValue: "",
    youShiKanAgentIdsPassword: "",
    youShiKanAgentIdsDspuserNo: "",
    navTree: [], // 导航菜单树
    defaultactive: "", // 当前路由名称
    youShiKanLogin: true, //优士康是否登录成功
    dieNumber: "",
    myVdcConfId: "",
    icpName: "phone",
    userCall: {},
    ConfMemberStatus1: [], // 会议列表
    smsMember: [], //短信队列
    faxMember: [], //传真队列
    talkMember: [], // 对讲列表
    phoneTreeList: {
      //电话树状分组队列
      tree1: [],
      tree4: [],
      tree5: [],
      tree6: [],
      tree7: [],
    },
    smsTreeList: {
      //短信树状分组队列
      tree1: [],
      tree4: [],
      tree5: [],
      tree6: [],
      tree7: [],
      tree8: [],
    },
    faxTreeList: {
      //传真树状分组队列
      tree1: [],
      tree4: [],
      tree5: [],
      tree6: [],
      tree7: [],
      tree8: [],
    },
    meetingTreeList: {
      //会议树状分组队列
      tree3: [],
      tree6: [],
      tree4: [],
      tree5: [],
      tree8: [],
      tree1: [],
      tree2: [],
      tree7: [],
    },
    talkTreeList: {
      //对讲树状分组队列
      tree1: [],
    },
    ConfSpeakStatus: false, // 全部发言
    ConfBroadcastStatus: false, // 全部广播
    ConfTalkbackStatus: false, // 全部对讲
    dienNumber: "", //事件总体情况死亡人数
    overallEvent: "", //事件总体情况突发事件报文
    dispositionType: "", //悬浮球跳转的处置类型
    videoNumber: [],
    isShowWind: false,
    videoType: 1, //会议类型
    meetingFunction: false, //会议单独广播、发言、对讲，成功状态
    setForm: {
      //会议设置
      conNumber: 11, //会场数量
      timeType: 3, //1小时，2分钟，3秒
      timeNumber: "",
      type: null, //切换模式 1部分,全部
      number: 0, //每次切换视频数量
      changeType: 1, //轮询顺序 1 时间先后 2随机
    },
    confListIndex: 0, //当前会议序号
    confList: [
      {
        myVdcConfId: "", //当前会议ic
        id: "", //当前会议历史记录id
        videoType: 1, //会议类型
        timer: "00:00:00", //计时器
        videoList: [], //当前会议成员详细数据包括名称，号码，状态
        start: "", //加入时间只对应呼叫入会
        videoNumber: [], //当前会议成员号码用于检测是否已经加入会议防止会议成员重复
        confStatus: false,
      },
    ],
    groupType: "", //批量导入联系人类型
    groupId: null, //批量导入联系人ID

    isLoadShow: false, //
    groupActive: false, // 集群会议抢权状态
    currentGroupName: "", //集群号码
    boardCasdIndex: -1, // 单个广播编号
    boardStatus: 1, //广播执行状态 1全部广播 2全部禁播  3单个广播 4单个禁播
    // meetRemoveIndex: -1,
    telephoneState: 0, //通话状态
    musicState: "-1", //为空不响铃,具体参数在actions
    phoneList: [], //电话队列
    nowSelectPhoneList: [], //现在选中的通话
    boxList: [
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
    ], //拨号盘可操作组
    bookReminder: false, //是否需要通讯录提醒
    dutyReminder: false, //是否需要交接班提醒
    phoneState: 5, //判断是那种类型的操作 0=>三方
    threePhoneList: [], //三方通话队列
    faxScanStatus: 0, //0：非作业中，1：扫描中2：成功，3：失败，
    scanFilePath: "", //扫描文件路径
    isCallPhone: "hangUp", //是否在通话中，这里用icp返回的通话队列来设置   call>=振铃  talking>=通话 hangUp >= 挂断
    isCallIng:false,
    isCallType: "", //callIng>= 呼入  callOut >=呼出
    isPhoneCallStatus: false, // 是否可操作电话队列用来存储 nowSelectPhoneList  false 不可用 ||可用
    isAgentSpeekList: [], //实时转文字存储内容
    isShowButton: false, // 是否显示小按钮
    threePhoneId: "", //三方通话ID
    isHangUp: true, //  true/ 电话呼出时不可挂断 false /可以挂断
    isIntelligenceReports: false, //是否开启智能接报,面对突然改的需求你是改整体逻辑还是加参数呢?
    isMissedCalls: false, //是否有未接来电
    msgContactsUpdate: false, // 短信联系人是否更新
    faxContactsUpdate: false, // 传真联系人
    dialogType: "", // big : 最大弹窗 small : 中等弹窗 mini : 最小弹窗  '' : 不弹窗
    manyCallsList: [], // 呼入通话弹窗
    //信息处置
    msgHeadleData: {},
    makeCallMobile: "", //被叫号码
    uploadAgent: true, //agent是否需要重新加载
    holdCallPhone: false, //是否为保持中
    faxSendCount: 0, //传真发送次数
    phoneToPickMachine: false, //手柄是否在空闲状态
    // 事件续报
    msgTabName: "", // 事件续报短信名称
    faxQueueDetail: {}, // 融合通讯当前传真队列详情
    copyContent: "", // 当前系统复制的内容
    copyBusinessCard: "", // 复制名片

    answerNum: 0, //未读
    dialable: false, // 是否需要拨号
    autoCallSettings: {
      // 自动转接设置
      isAutoCall: "关",
      phone: "",
    },
    recordFile: "", // 通话后录音文件地址
    makeCallMessage: null, // 拨打电话收到回调消息
    eventList: [], //信息接报-事件接报 事件+事件续报列表
    commonInformationReport: {}, // 一般事件接报数据（信息接报-一般事件接报）
    activeEvent: {}, // 设置事件接报页面当前激活的事件续报
    eventId: null, // 事件id
    caseId: null, // 事件类型id
    loading: {
      loading: false,
    },
    /******************************************************* openlab项目结束 *******************************************************/
  },
  //这里是set方法
  mutations: {
    setCallIng(state,tag) {
      state.isCallIng = tag
    },    
    /******************************************************* 石景山项目开始 *******************************************************/
    // 重置vuex本地储存状态
    resetStore(state) {
      Object.keys(state).forEach((key) => {
        state[key] = cloneDeep(window.SITE_CONFIG["storeState"][key]);
      });
    },
    SET_FAXSENDCOUNT: (state) => {
      //传真发送次数
      state.faxSendCount++;
      console.log(123231232332);
    },
    SET_ANSWERNUM: (state) => {
      //传真发送次数
      state.answerNum++;
    },
    SET_CONFLISTINDEX: (state, confListIndex) => {
      //设置当前会议序号
      state.confListIndex = confListIndex;
    },
    SET_CONFLIST: (state, confList) => {
      //设置当前会议列表
      state.confList = confList;
    },
    //设置当前会议列表中的各项属性(myVdcConfId,id,videoList...)data(idx:当前会议序号，key：修改的属性,content:修改之后内容)
    SET_CONFLISTID: (state, data) => {
      state.confList[data.idx][data.key] = data.content;
    },
    SET_SETFORM: (state, setForm) => {
      state.setForm = setForm;
    },
    SET_VIDEOTYPE: (state, videoType) => {
      state.videoType = videoType;
    },
    SET_ISSHOWWIN: (state, isShowWind) => {
      state.isShowWind = isShowWind;
    },
    SET_ICPNAME: (state, icpName) => {
      state.icpName = icpName;
    },
    SET_VIDEONUMBER: (state, videoNumber) => {
      state.videoNumber = videoNumber;
    },
    SET_USERC: (state, key) => {
      state.userCall = key;
    },
    SET_CONFID: (state, confId) => {
      state.myVdcConfId = confId;
    },
    SET_COMEMBER: (state, ConfMemberStatus1) => {
      state.ConfMemberStatus1 = ConfMemberStatus1;
    },
    //设置短信队列数据
    setSmsMember: (state, smsMember) => {
      state.smsMember = smsMember;
    },
    //设置传真队列数据
    setFaxMember: (state, faxMember) => {
      state.faxMember = JSON.parse(JSON.stringify(faxMember))
    },
    //设置对讲列表数据
    setTalkMember: (state, talkMember) => {
      state.talkMember = talkMember;
    },
    //设置电话树状分组队列
    setPhoneTreeList: (state, phoneTreeList) => {
      state.phoneTreeList = phoneTreeList;
    },
    //设置短信树状分组队列
    setSmsTreeList: (state, smsTreeList) => {
      state.smsTreeList = smsTreeList;
    },
    //设置传真树状分组队列
    setFaxTreeList: (state, faxTreeList) => {
      state.faxTreeList = faxTreeList;
    },
    //设置传真详情队列
    setFaxQueueDetail: (state, faxQueueDetail) => {
      state.faxQueueDetail = faxQueueDetail;
    },
    //设置会议树状分组队列
    setMeetingTreeList: (state, meetingTreeList) => {
      state.meetingTreeList = meetingTreeList;
    },
    //设置对讲树状分组队列
    setTalkTreeList: (state, talkTreeList) => {
      state.talkTreeList = talkTreeList;
    },
    SET_Speak: (state, ConfSpeakStatus) => {
      state.ConfSpeakStatus = ConfSpeakStatus;
    },
    SET_Broadcast: (state, ConfBroadcastStatus) => {
      state.ConfBroadcastStatus = ConfBroadcastStatus;
    },
    SET_Talkback: (state, ConfTalkbackStatus) => {
      state.ConfTalkbackStatus = ConfTalkbackStatus;
    },
    setAgentService(state, status) {
      if (status) {
        state.agentService = "坐席连接成功";
      } else {
        state.agentService = "坐席连接失败";
      }
    },
    setCommunicationService(state, status) {
      if (status) {
        state.communicationService = "通讯服务连接成功";
      } else {
        state.communicationService = "通讯服务连接失败";
      }
    },
    setSmsService(state, status) {
      if (status) {
        state.smsService = "短信服务连接成功";
      } else {
        state.smsService = "短信服务连接失败";
      }
    },
    setCallStatus(state, callStatus) {
      state.callStatus = callStatus;
    },
    setCallConn(state, callconn) {
      state.callconn = callconn;
    },
    setCallClass(state, callClass) {
      state.callClass = callClass;
    },
    setCid(state, cid) {
      state.cid = cid;
    },
    setCallee(state, callee) {
      state.callee = callee;
    },
    setCaller(state, caller) {
      state.caller = caller;
    },
    setCallType(state, callType) {
      state.callType = callType;
    },
    setCallQueue(state, callQueue) {
      state.callQueue.push({
        mobile: callQueue.mobile,
        cid: callQueue.cid,
        callClass: callQueue.callClass,
        conn: callQueue.conn,
      });
    },
    setCallQueueClass(state, Queue) {
      for (let key in state.callQueue) {
        if (state.callQueue[key].conn == Queue.conn)
          state.callQueue[key].callClass = Queue.callClass;
      }
    },
    setConfId(state, confId) {
      state.confId = confId;
    },
    setConfMemberStatus(state, ConfMemberStatus) {
      if (ConfMemberStatus.hasOwnProperty("videoList"))
        state.ConfMemberStatus.videoList = ConfMemberStatus.videoList;
      if (ConfMemberStatus.hasOwnProperty("camera"))
        state.ConfMemberStatus.camera = ConfMemberStatus.camera;
      if (ConfMemberStatus.hasOwnProperty("microphone"))
        state.ConfMemberStatus.microphone = ConfMemberStatus.microphone;
    },
    setCallHistoryId(state, callHistoryId) {
      state.callHistoryId = callHistoryId;
    },
    setConfStatus(state, confStatus) {
      state.confStatus = confStatus;
    },
    setPasscode(state, passcode) {
      state.passcode = passcode;
    },
    setTimer(state, timer) {
      state.timer = timer;
    },
    setUnifiedAccessCode(state, unifiedAccessCode) {
      state.unifiedAccessCode = unifiedAccessCode;
    },
    //按照key删除通话队列
    reMoveCallQueue(state, key) {
      if (key != "" || key != null) state.callQueue.splice(key, 1);
    },
    //清空通话队列
    cleanQueueRemove(state) {
      state.callQueue = [];
    },
    //按照号码删除通话队列
    CallQueueRemove(state, number) {
      for (let key in state.callQueue) {
        if (state.callQueue[key].mobile == number)
          state.callQueue.splice(key, 1);
      }
    },
    setGrpid(state, grpid) {
      state.grpid = grpid;
    },

    /******  我是区分 ↑ 和 ↓ 的区别的 ******/
    setTurnOnEmergencyResponse(state, turnOnEmergencyResponse) {
      state.preparednessResponse = turnOnEmergencyResponse;
    },
    setSituation(state, situation) {
      state.eventSituation = JSON.parse(JSON.stringify(situation));
    },
    setParam(state, argument) {
      state.eventParam = argument;
    },
    setIsJumpToIcpPhone(state, isJumpTo) {
      state.isJumpToIcpPhone = isJumpTo;
    },
    setPhoneHistoryId(state, id) {
      state.phoneHistoryId = id;
    },
    setTxtNotify(state, txtNotify) {
      state.txtNotify = txtNotify;
    },
    setCenterNo(state, youShiKanAgentIdsCenterNo) {
      state.youShiKanAgentIdsCenterNo = youShiKanAgentIdsCenterNo;
    },
    setValue(state, youShiKanAgentIdsValue) {
      state.youShiKanAgentIdsValue = youShiKanAgentIdsValue;
    },
    setPassword(state, youShiKanAgentIdsPassword) {
      state.youShiKanAgentIdsPassword = youShiKanAgentIdsPassword;
    },
    setDspuserNo(state, youShiKanAgentIdsDspuserNo) {
      state.youShiKanAgentIdsDspuserNo = youShiKanAgentIdsDspuserNo;
    },
    setNavTree(state, navTree) {
      // 设置导航菜单树
      state.navTree = navTree;
    },
    defaultactive(state, defaultactive) {
      //当前路由名称
      state.defaultactive = defaultactive;
    },
    setYouShiKanLogin(state, youShiKanLogin) {
      state.youShiKanLogin = youShiKanLogin;
    },
    setDieNumber(state, dieNumber) {
      state.dieNumber = dieNumber;
    },
    setOverallEvent(state, overallEvent) {
      state.overallEvent = overallEvent;
    },
    setDispositionType(state, dispositionType) {
      state.dispositionType = dispositionType;
    },

    setGroupType(state, groupType) {
      state.groupType = groupType;
    },

    setGroupId(state, groupId) {
      state.groupId = groupId;
    },
    // 设置当前集群抢权编号
    SET_CURRENT_GROUP_NUM(state, groupId) {
      state.currentGroupNum = groupId;
    },

    setIsLoadShow(state, isLoadShow) {
      state.isLoadShow = isLoadShow;
    },
    setCurrentGroupName(state, groupName) {
      state.currentGroupName = groupName;
    },
    setVideoType(state, type) {
      state.videoType = type;
    },
    setMeetingFunction(state, type) {
      state.meetingFunction = type;
    },
    setGroupActive(state, groupActive) {
      state.groupActive = groupActive;
    },
    setBoardCasdIndex(state, boardCasdIndex) {
      state.boardCasdIndex = boardCasdIndex;
    },
    setBardStatus(state, boardStatus) {
      state.boardStatus = boardStatus;
    },
    setMeetRemoveIndex(state, meetRemoveIndex) {
      state.meetRemoveIndex = meetRemoveIndex;
    },
    setTelephoneState(state, telephoneState) {
      state.telephoneState = telephoneState;
    },
    setMusicState(state, musicState) {
      state.musicState = musicState;
    },

    //电话列表
    setPhoneList(state, phoneList) {
      state.phoneList = phoneList ? phoneList : [];
    },

    //现在选中电话列表
    setNowSelectPhoneList(state, nowSelectPhoneList) {
      state.nowSelectPhoneList = nowSelectPhoneList ? nowSelectPhoneList : [];
    },

    //信息核实
    setXinxiheshiArr(state, xinxiheshiArr) {
      state.xinxiheshiArr = xinxiheshiArr ? xinxiheshiArr : [];
    },

    //信息报送
    setXinxibaosongArr(state, xinxibaosongArr) {
      state.xinxibaosongArr = xinxibaosongArr ? xinxibaosongArr : [];
    },

    //领导指示
    setLingdaozhishiArr(state, lingdaozhishiArr) {
      state.lingdaozhishiArr = lingdaozhishiArr ? lingdaozhishiArr : [];
    },

    //拨号盘可操作组
    setBoxList(state, boxList) {
      state.boxList = boxList;
    },

    //设置是否需要通讯录提醒
    setBookReminder(state, bookReminder) {
      state.bookReminder = bookReminder;
    },

    //设置是否需要交接班提醒
    setDutyReminder(state, dutyReminder) {
      state.dutyReminder = dutyReminder;
    },

    //当前通话的状态
    setPhoneState(state, phoneState) {
      state.phoneState = phoneState;
    },

    //保持状态
    setHoldCallPhone(state, holdCallPhone) {
      state.holdCallPhone = holdCallPhone;
    },

    //是否需要重新加载agent
    setUploadAgent(state, uploadAgent) {
      state.uploadAgent = uploadAgent;
    },

    //话机是否在摘机状态
    setPhoneToPickMachine(state, phoneToPickMachine) {
      state.phoneToPickMachine = phoneToPickMachine;
    },

    setThreePhoneList(state, threePhoneList) {
      state.threePhoneList = threePhoneList;
    },
    setfaxScanStatus(state, faxScanStatus) {
      state.faxScanStatus = faxScanStatus;
    },
    setscanFilePath(state, scanFilePath) {
      state.scanFilePath = scanFilePath;
    },

    setIsCallPhone(state, isCallPhone) {
      state.isCallPhone = isCallPhone;
    },

    setIsPhoneCallStatus(state, isPhoneCallStatus) {
      state.isPhoneCallStatus = isPhoneCallStatus;
    },

    setIsCallType(state, isCallType) {
      state.isCallType = isCallType;
    },

    setIsAgentSpeekList(state, isAgentSpeekList) {
      state.isAgentSpeekList = isAgentSpeekList;
    },

    setIsShowButton(state, isShowButton) {
      state.isShowButton = isShowButton;
    },

    setThreePhoneId(state, threePhoneId) {
      state.threePhoneId = threePhoneId;
    },
    setIsHangUp(state, isHangUp) {
      state.isHangUp = isHangUp;
    },

    setIsIntelligenceReports(state, isIntelligenceReports) {
      state.isIntelligenceReports = isIntelligenceReports;
    },

    setIsMissedCalls(state, isMissedCalls) {
      state.isMissedCalls = isMissedCalls;
    },

    setIsDialogType(state, dialogType) {
      state.dialogType = dialogType;
    },

    setIsmManyCallsList(state, manyCallsList) {
      state.manyCallsList = manyCallsList;
    },

    //被叫号码
    setIsMakeCallMobile(state, makeCallMobile) {
      state.makeCallMobile = makeCallMobile;
    },

    // 更新短信分组联系人
    getMsgContactsUpdate(state, isMsgContactsUpdate) {
      state.msgContactsUpdate = isMsgContactsUpdate; // 传入Boolean判断更新联系人
    },

    //
    getFaxContactsUpdate(state, isFaxContactUpdate) {
      state.faxContactsUpdate = isFaxContactUpdate;
    },
    //  信息处置的点击数据
    msgHeadleData(state, val) {
      state.msgHeadleData = JSON.parse(JSON.stringify(val));
    },

    // 改变接报续报中的短信名字
    SET_MsgTabName(state, val) {
      state.msgTabName = val; // 普通短信 or H5短信
    },

    // 当前系统复制的内容
    setCopy(state, val) {
      state.copyContent = val;
    },

    // 复制名片
    setCopyBusinessCard(state, val) {
      state.copyBusinessCard = val;
    },
    
    // 复制名片 联系人id
    setCopyCardContactors(state, val) {
      state.copyCardContactors = val;
    },
    
    // 是否拨号
    setDialable(state, val) {
      state.dialable = val;
    },
    // 选择通讯录->是短信、传真、还是电话
    setSmsOrFax(state, val) {
      state.smsOrFax = val;
    },

    setAudioText(state, val) {
      state.audioText = val;
    },

    // 设置语音转文字的loading
    setTurnToTextLoading(state, val) {
      state.loading = val;
    },

    // 自动转接设置
    setAutoCallSettings(state, val) {
      state.autoCallSettings = val;
    },

    // (针对优士康)拨打电话后优士康返回的回调消息 (author:hexinting)
    setMakeCallMessage(state, val) {
      state.makeCallMessage = val;
    },

    // 通话结束后，录音地址
    setPhoneRecordFile(state, val) {
      state.recordFile = val;
    },
    /******************************************************* 石景山项目结束 *******************************************************/

    /******************************************************* openlab项目开始 *******************************************************/
    setSelectContact(state, selectContact) {
      state.selectContact = selectContact;
    },
    updateMainTabs(state, tabs) {
      state.mainTabs = tabs;
    }, //更新菜单栏menu面包屑
    updateMainTabsActiveName(state, name) {
      state.mainTabsActiveName = name;
    }, //更新选中面包屑名字
    SET_FAXSENDCOUNT: (state) => {
      //传真发送次数
      state.faxSendCount++;
      console.log(123231232332);
    },
    SET_ANSWERNUM: (state) => {
      //传真发送次数
      state.answerNum++;
    },
    SET_CONFLISTINDEX: (state, confListIndex) => {
      //设置当前会议序号
      state.confListIndex = confListIndex;
    },
    SET_CONFLIST: (state, confList) => {
      //设置当前会议列表
      state.confList = confList;
    },
    //设置当前会议列表中的各项属性(myVdcConfId,id,videoList...)data(idx:当前会议序号，key：修改的属性,content:修改之后内容)
    SET_CONFLISTID: (state, data) => {
      state.confList[data.idx][data.key] = data.content;
    },
    SET_SETFORM: (state, setForm) => {
      state.setForm = setForm;
    },
    SET_VIDEOTYPE: (state, videoType) => {
      state.videoType = videoType;
    },
    SET_ISSHOWWIN: (state, isShowWind) => {
      state.isShowWind = isShowWind;
    },
    SET_ICPNAME: (state, icpName) => {
      state.icpName = icpName;
    },
    SET_VIDEONUMBER: (state, videoNumber) => {
      state.videoNumber = videoNumber;
    },
    SET_USERC: (state, key) => {
      state.userCall = key;
    },
    SET_CONFID: (state, confId) => {
      state.myVdcConfId = confId;
    },
    SET_COMEMBER: (state, ConfMemberStatus1) => {
      state.ConfMemberStatus1 = JSON.parse(JSON.stringify(ConfMemberStatus1));
    },
    //设置短信队列数据
    setSmsMember: (state, smsMember) => {
      state.smsMember = smsMember;
    },
    //设置传真队列数据
    setFaxMember: (state, faxMember) => {
      state.faxMember = JSON.parse(JSON.stringify(faxMember))
    },
    //设置对讲列表数据
    setTalkMember: (state, talkMember) => {
      state.talkMember = talkMember;
    },
    //设置电话树状分组队列
    setPhoneTreeList: (state, phoneTreeList) => {
      state.phoneTreeList = phoneTreeList;
    },
    //设置短信树状分组队列
    setSmsTreeList: (state, smsTreeList) => {
      state.smsTreeList = smsTreeList;
    },
    //设置传真树状分组队列
    setFaxTreeList: (state, faxTreeList) => {
      state.faxTreeList = faxTreeList;
    },
    //设置传真详情队列
    setFaxQueueDetail: (state, faxQueueDetail) => {
      state.faxQueueDetail = faxQueueDetail;
    },
    //设置会议树状分组队列
    setMeetingTreeList: (state, meetingTreeList) => {
      state.meetingTreeList = meetingTreeList;
    },
    //设置对讲树状分组队列
    setTalkTreeList: (state, talkTreeList) => {
      state.talkTreeList = talkTreeList;
    },
    SET_Speak: (state, ConfSpeakStatus) => {
      console.log("设置静音", ConfSpeakStatus);
      state.ConfSpeakStatus = ConfSpeakStatus;
    },
    SET_Broadcast: (state, ConfBroadcastStatus) => {
      state.ConfBroadcastStatus = ConfBroadcastStatus;
    },
    SET_Talkback: (state, ConfTalkbackStatus) => {
      state.ConfTalkbackStatus = ConfTalkbackStatus;
    },
    setAgentService(state, status) {
      if (status) {
        state.agentService = "坐席连接成功";
      } else {
        state.agentService = "坐席连接失败";
      }
    },
    setCommunicationService(state, status) {
      if (status) {
        state.communicationService = "通讯服务连接成功";
      } else {
        state.communicationService = "通讯服务连接失败";
      }
    },
    setSmsService(state, status) {
      if (status) {
        state.smsService = "短信服务连接成功";
      } else {
        state.smsService = "短信服务连接失败";
      }
    },
    setCallStatus(state, callStatus) {
      state.callStatus = callStatus;
    },
    setCallConn(state, callconn) {
      state.callconn = callconn;
    },
    setCallClass(state, callClass) {
      state.callClass = callClass;
    },
    setCid(state, cid) {
      state.cid = cid;
    },
    setCallee(state, callee) {
      state.callee = callee;
    },
    setCaller(state, caller) {
      state.caller = caller;
    },
    setCallType(state, callType) {
      state.callType = callType;
    },
    setCallQueue(state, callQueue) {
      state.callQueue.push({
        mobile: callQueue.mobile,
        cid: callQueue.cid,
        callClass: callQueue.callClass,
        conn: callQueue.conn,
      });
    },
    setCallQueueClass(state, Queue) {
      for (let key in state.callQueue) {
        if (state.callQueue[key].conn == Queue.conn)
          state.callQueue[key].callClass = Queue.callClass;
      }
    },
    setConfId(state, confId) {
      state.confId = confId;
    },
    setConfMemberStatus(state, ConfMemberStatus) {
      if (ConfMemberStatus.hasOwnProperty("videoList"))
        state.ConfMemberStatus.videoList = ConfMemberStatus.videoList;
      if (ConfMemberStatus.hasOwnProperty("camera"))
        state.ConfMemberStatus.camera = ConfMemberStatus.camera;
      if (ConfMemberStatus.hasOwnProperty("microphone"))
        state.ConfMemberStatus.microphone = ConfMemberStatus.microphone;
    },
    setCallHistoryId(state, callHistoryId) {
      state.callHistoryId = callHistoryId;
    },
    setConfStatus(state, confStatus) {
      state.confStatus = confStatus;
    },
    setPasscode(state, passcode) {
      state.passcode = passcode;
    },
    setTimer(state, timer) {
      state.timer = timer;
    },
    setUnifiedAccessCode(state, unifiedAccessCode) {
      state.unifiedAccessCode = unifiedAccessCode;
    },
    //按照key删除通话队列
    reMoveCallQueue(state, key) {
      if (key != "" || key != null) state.callQueue.splice(key, 1);
    },
    //清空通话队列
    cleanQueueRemove(state) {
      state.callQueue = [];
    },
    //按照号码删除通话队列
    CallQueueRemove(state, number) {
      for (let key in state.callQueue) {
        if (state.callQueue[key].mobile == number)
          state.callQueue.splice(key, 1);
      }
    },
    setGrpid(state, grpid) {
      state.grpid = grpid;
    },

    /******  我是区分 ↑ 和 ↓ 的区别的 ******/
    setTurnOnEmergencyResponse(state, turnOnEmergencyResponse) {
      state.preparednessResponse = turnOnEmergencyResponse;
    },
    setSituation(state, situation) {
      state.eventSituation = JSON.parse(JSON.stringify(situation));
    },
    setParam(state, argument) {
      state.eventParam = argument;
    },
    setIsJumpToIcpPhone(state, isJumpTo) {
      state.isJumpToIcpPhone = isJumpTo;
    },
    setPhoneHistoryId(state, id) {
      state.phoneHistoryId = id;
    },
    setTxtNotify(state, txtNotify) {
      state.txtNotify = txtNotify;
    },
    setCenterNo(state, youShiKanAgentIdsCenterNo) {
      state.youShiKanAgentIdsCenterNo = youShiKanAgentIdsCenterNo;
    },
    setValue(state, youShiKanAgentIdsValue) {
      state.youShiKanAgentIdsValue = youShiKanAgentIdsValue;
    },
    setPassword(state, youShiKanAgentIdsPassword) {
      state.youShiKanAgentIdsPassword = youShiKanAgentIdsPassword;
    },
    setDspuserNo(state, youShiKanAgentIdsDspuserNo) {
      state.youShiKanAgentIdsDspuserNo = youShiKanAgentIdsDspuserNo;
    },
    setNavTree(state, navTree) {
      // 设置导航菜单树
      state.navTree = navTree;
    },
    defaultactive(state, defaultactive) {
      //当前路由名称
      state.defaultactive = defaultactive;
    },
    setYouShiKanLogin(state, youShiKanLogin) {
      state.youShiKanLogin = youShiKanLogin;
    },
    setDieNumber(state, dieNumber) {
      state.dieNumber = dieNumber;
    },
    setOverallEvent(state, overallEvent) {
      state.overallEvent = overallEvent;
    },
    setDispositionType(state, dispositionType) {
      state.dispositionType = dispositionType;
    },

    setGroupType(state, groupType) {
      state.groupType = groupType;
    },

    setGroupId(state, groupId) {
      state.groupId = groupId;
    },
    // 设置当前集群抢权编号
    SET_CURRENT_GROUP_NUM(state, groupId) {
      state.currentGroupNum = groupId;
    },

    setIsLoadShow(state, isLoadShow) {
      state.isLoadShow = isLoadShow;
    },
    setCurrentGroupName(state, groupName) {
      state.currentGroupName = groupName;
    },
    setVideoType(state, type) {
      state.videoType = type;
    },
    setMeetingFunction(state, type) {
      state.meetingFunction = type;
    },
    setGroupActive(state, groupActive) {
      state.groupActive = groupActive;
    },
    setBoardCasdIndex(state, boardCasdIndex) {
      state.boardCasdIndex = boardCasdIndex;
    },
    setBardStatus(state, boardStatus) {
      state.boardStatus = boardStatus;
    },
    setMeetRemoveIndex(state, meetRemoveIndex) {
      state.meetRemoveIndex = meetRemoveIndex;
    },
    setTelephoneState(state, telephoneState) {
      state.telephoneState = telephoneState;
    },
    setMusicState(state, musicState) {
      state.musicState = musicState;
    },

    //电话列表
    setPhoneList(state, phoneList) {
      state.phoneList = phoneList ? phoneList : [];
    },

    //现在选中电话列表
    setNowSelectPhoneList(state, nowSelectPhoneList) {
      state.nowSelectPhoneList = nowSelectPhoneList ? nowSelectPhoneList : [];
    },

    //拨号盘可操作组
    setBoxList(state, boxList) {
      state.boxList = boxList;
    },

    //设置是否需要通讯录提醒
    setBookReminder(state, bookReminder) {
      state.bookReminder = bookReminder;
    },

    //设置是否需要交接班提醒
    setDutyReminder(state, dutyReminder) {
      state.dutyReminder = dutyReminder;
    },

    //当前通话的状态
    setPhoneState(state, phoneState) {
      state.phoneState = phoneState;
    },

    //保持状态
    setHoldCallPhone(state, holdCallPhone) {
      state.holdCallPhone = holdCallPhone;
    },

    //是否需要重新加载agent
    setUploadAgent(state, uploadAgent) {
      state.uploadAgent = uploadAgent;
    },

    //话机是否在摘机状态
    setPhoneToPickMachine(state, phoneToPickMachine) {
      state.phoneToPickMachine = phoneToPickMachine;
    },

    setThreePhoneList(state, threePhoneList) {
      state.threePhoneList = threePhoneList;
    },
    setfaxScanStatus(state, faxScanStatus) {
      state.faxScanStatus = faxScanStatus;
    },
    setscanFilePath(state, scanFilePath) {
      state.scanFilePath = scanFilePath;
    },

    setIsCallPhone(state, isCallPhone) {
      state.isCallPhone = isCallPhone;
    },

    setIsPhoneCallStatus(state, isPhoneCallStatus) {
      state.isPhoneCallStatus = isPhoneCallStatus;
    },

    setIsCallType(state, isCallType) {
      state.isCallType = isCallType;
    },

    setIsAgentSpeekList(state, isAgentSpeekList) {
      state.isAgentSpeekList = isAgentSpeekList;
    },

    setIsShowButton(state, isShowButton) {
      state.isShowButton = isShowButton;
    },

    setThreePhoneId(state, threePhoneId) {
      state.threePhoneId = threePhoneId;
    },
    setIsHangUp(state, isHangUp) {
      state.isHangUp = isHangUp;
    },

    setIsIntelligenceReports(state, isIntelligenceReports) {
      state.isIntelligenceReports = isIntelligenceReports;
    },

    setIsMissedCalls(state, isMissedCalls) {
      state.isMissedCalls = isMissedCalls;
    },

    setIsDialogType(state, dialogType) {
      state.dialogType = dialogType;
    },

    setIsmManyCallsList(state, manyCallsList) {
      state.manyCallsList = manyCallsList;
    },

    //被叫号码
    setIsMakeCallMobile(state, makeCallMobile) {
      state.makeCallMobile = makeCallMobile;
    },

    // 更新短信分组联系人
    getMsgContactsUpdate(state, isMsgContactsUpdate) {
      state.msgContactsUpdate = isMsgContactsUpdate; // 传入Boolean判断更新联系人
    },

    //
    getFaxContactsUpdate(state, isFaxContactUpdate) {
      state.faxContactsUpdate = isFaxContactUpdate;
    },
    //  信息处置的点击数据
    msgHeadleData(state, val) {
      state.msgHeadleData = val;
    },

    // 改变接报续报中的短信名字
    SET_MsgTabName(state, val) {
      state.msgTabName = val; // 普通短信 or H5短信
    },

    // 当前系统复制的内容
    setCopy(state, val) {
      state.copyContent = val;
    },

    // 复制名片
    setCopyBusinessCard(state, val) {
      state.copyBusinessCard = val;
    },

    // 是否拨号
    setDialable(state, val) {
      state.dialable = val;
    },
    // 选择通讯录->是短信、传真、还是电话
    setSmsOrFax(state, val) {
      Vue.set(state, "smsOrFax", val); // 避免getters方法拿不到数据
    },

    setAudioText(state, val) {
      state.audioText = val;
    },

    // 设置语音转文字的loading
    setTurnToTextLoading(state, val) {
      state.loading = val;
    },

    // 自动转接设置
    setAutoCallSettings(state, val) {
      state.autoCallSettings = val;
    },

    // 通话结束后，录音地址
    setPhoneRecordFile(state, val) {
      state.recordFile = val;
    },

    // (针对优士康)拨打电话后优士康返回的回调消息 (author:hexinting)
    setMakeCallMessage(state, val) {
      state.makeCallMessage = val;
    },
    //存放事件+事件续报列表（信息接报-事件接报）
    setEventList(state, val) {
      state.eventList = val;
    },

    // 一般事件接报数据（信息接报-一般事件接报）
    setCommonInformationReport(state, val) {
      state.commonInformationReport = val;
    },

    // 设置事件接报页面当前激活的事件续报
    setActiveEvent(state, val) {
      state.activeEvent = val;
    },

    // 事件id
    setEventId(state, val) {
      state.eventId = val;
    },

    // 事件类型id
    setCaseId(state, val) {
      state.caseId = val;
    },
    /******************************************************* openlab项目结束 *******************************************************/
  },
  actions: actions,
  //get方法
  getters: {
    /******************************************************* 石景山项目开始 *******************************************************/
    getisCallIng: state => {
      return state.isCallIng
    },    
    getConfListIndex: (state) => {
      return state.confListIndex;
    },
    getConfList: (state) => {
      return state.confList;
    },
    getSetForm: (state) => {
      return state.setForm;
    },
    getVideoType: (state) => {
      return state.videoType;
    },
    getMeetingFunction: (state) => {
      return state.meetingFunction;
    },
    getIsShowWind: (state) => {
      return state.isShowWind || false;
    },
    getvideoNumber: (state) => {
      return state.videoNumber || [];
    },
    getSmsMember: (state) => {
      return state.smsMember || [];
    },
    getFaxMember: (state) => {
      return state.faxMember || [];
    },
    getTalkMember: (state) => {
      return state.talkMember || [];
    },
    getPhoneTreeList: (state) => {
      return state.phoneTreeList;
    }, //获取电话树状分组队列
    getSmsTreeList: (state) => {
      return state.smsTreeList;
    }, //获取短信树状分组队列
    getFaxTreeList: (state) => {
      return state.faxTreeList;
    }, //获取传真树状分组队列
    getMeetingTreeList: (state) => {
      return state.meetingTreeList;
    }, //获取会议树状分组队列
    getTalkTreeList: (state) => {
      return state.talkTreeList;
    }, //获取对讲树状分组队列
    // 根据会议类型切换展示不同成员数据
    getConfMemberStatus1: (state) => {
      return state.ConfMemberStatus1.filter((v) => {
        if (state.videoType == 0) {
          return !v.meetingType;
        } else if (state.videoType == 1) {
          return (
            !v.meetingType ||
            v.meetingType == 1 ||
            v.meetingType == 2 ||
            v.meetingType == 7
          );
        } else {
          return !v.meetingType || v.meetingType == 2 || v.meetingType == 7;
        }
      });
    },
    getConfSpeakStatus: (state) => {
      return state.ConfSpeakStatus || false;
    },
    getConfBroadcastStatus: (state) => {
      return state.ConfBroadcastStatus || false;
    },
    getConfTalkbackStatus: (state) => {
      return state.ConfTalkbackStatus || false;
    },
    getUserCall: (state) => state.userCall,
    getIcpName: (state) => state.icpName,
    getMyVdcConfId: (state) => state.myVdcConfId,
    getAgentService: (state) => state.agentService,
    getCommunicationService: (state) => state.communicationService,
    getSmsService: (state) => state.smsService,
    getCallStatus: (state) => state.callStatus,
    getCallConn: (state) => state.callconn,
    getCallClass: (state) => {
      return state.callClass || "";
    },
    getCid: (state) => state.cid,
    getCallee: (state) => state.callee,
    getCaller: (state) => state.caller,
    getCallType: (state) => state.callType,
    getPasscode: (state) => state.passcode,
    getUnifiedAccessCode: (state) => state.unifiedAccessCode,
    getConfId: (state) => state.confId,
    getConfMemberStatus: (state) => state.ConfMemberStatus,
    getConfStatus: (state) => state.confStatus,
    getCallQueue: (state) => state.callQueue,
    getCallHistoryId: (state) => state.callHistoryId,
    getTimer: (state) => state.timer,
    getGrpid: (state) => state.grpid,

    /******  我是区分 ↑ 和 ↓ 的区别的 ******/
    getTurnOnEmergencyResponse: (state) => state.preparednessResponse,
    getSituation: (state) => state.eventSituation,
    getParam: (state) => state.eventParam,
    getIsJumpToIcpPhone: (state) => state.isJumpToIcpPhone,
    getPhoneHistoryId: (state) => state.phoneHistoryId,
    getTxtNotif: (state) => state.txtNotify,
    getTxtNotif1: (state) => {
      return state.txtNotify.join("") || "";
    },
    getCenterNo: (state) => state.youShiKanAgentIdsCenterNo,
    getValue: (state) => state.youShiKanAgentIdsValue,
    getPassword: (state) => state.youShiKanAgentIdsPassword,
    getDspuserNo: (state) => state.youShiKanAgentIdsDspuserNo,
    getYouShiKanLogin: (state) => state.youShiKanLogin,
    getDieNumber: (state) => state.dieNumber,
    getOverallEvent: (state) => state.overallEvent,
    getDispositionType: (state) => state.dispositionType,
    getGroupType: (state) => state.groupType,
    getGroupId: (state) => state.groupId,

    getCurrentGroupName: (state) => state.currentGroupName,
    getIsLoadShow: (state) => state.isLoadShow,
    getGroupActive: (state) => state.groupActive,
    getBoardCasdIndex: (state) => state.boardCasdIndex,
    getBoardStatus: (state) => state.boardStatus,
    // getMeetRemoveIndex: state => state.meetRemoveIndex,
    getTelephoneState: (state) => state.telephoneState,
    getMusicState: (state) => state.musicState,
    getPhoneList: (state) => state.phoneList,
    getNowSelectPhoneList: (state) => state.nowSelectPhoneList,
    getXinxiheshiArr: (state) => state.xinxiheshiArr,
    getXinxibaosongArr: (state) => state.xinxibaosongArr,
    getLingdaozhishiArr: (state) => state.lingdaozhishiArr,
    getBoxList: (state) => state.boxList,
    getBookReminder: (state) => state.bookReminder,
    getDutyReminder: (state) => state.dutyReminder,
    getPhoneState: (state) => state.phoneState,
    getThreePhoneList: (state) => state.threePhoneList,
    getfaxScanStatus: (state) => state.faxScanStatus,
    getscanFilePath: (state) => state.scanFilePath,
    getIsCallPhone: (state) => state.isCallPhone,
    getIsPhoneCallStatus: (state) => state.isPhoneCallStatus,
    getIsCallType: (state) => state.isCallType,
    getIsAgentSpeekList: (state) => state.isAgentSpeekList,
    getIsShowButton: (state) => state.isShowButton,
    getThreePhoneId: (state) => state.threePhoneId,
    getIsHangUp: (state) => state.isHangUp,
    getIsIntelligenceReports: (state) => state.isIntelligenceReports,
    getIsMissedCalls: (state) => state.isMissedCalls,
    getIsDialogType: (state) => state.dialogType,
    getIsManyCallsList: (state) => state.manyCallsList,
    getIsMakeCallMobile: (state) => state.makeCallMobile,
    getUploadAgent: (state) => state.uploadAgent,
    getHoldCallPhone: (state) => state.holdCallPhone,
    getPhoneToPickMachine: (state) => state.phoneToPickMachine,
    getCopyBusinessCard: (state) => state.copyBusinessCard,
    getDialable: (state) => state.dialable,
    getSmsOrFax: (state) => state.smsOrFax,
    getAudioText: (state) => state.audioText,
    getTurnToTextLoading: (state) => state.loading.loading || false,
    getFaxSendCount: (state) => state.faxSendCount,
    getAutoCallSettings: (state) => state.autoCallSettings,
    getMakeCallMessage: (state) => state.makeCallMessage, // 获取请求通话方法后等待的回调信息
    getPhoneRecordFile: (state) => state.recordFile, // 获取通话结束后的录音地址
    /******************************************************* 石景山项目结束 *******************************************************/




    
    /******************************************************* openlab项目开始 *******************************************************/
    getSelectContact: (state) => {
      return state.selectContact;
    },
    getConfListIndex: (state) => {
      return state.confListIndex;
    },
    getConfList: (state) => {
      return state.confList;
    },
    getSetForm: (state) => {
      return state.setForm;
    },
    getVideoType: (state) => {
      return state.videoType;
    },
    getMeetingFunction: (state) => {
      return state.meetingFunction;
    },
    getIsShowWind: (state) => {
      return state.isShowWind || false;
    },
    getvideoNumber: (state) => {
      return state.videoNumber || [];
    },
    getSmsMember: (state) => {
      return state.smsMember || [];
    },
    getFaxMember: (state) => {
      return state.faxMember || [];
    },
    getTalkMember: (state) => {
      return state.talkMember || [];
    },
    getPhoneTreeList: (state) => {
      return state.phoneTreeList;
    }, //获取电话树状分组队列
    getSmsTreeList: (state) => {
      return state.smsTreeList;
    }, //获取短信树状分组队列
    getFaxTreeList: (state) => {
      return state.faxTreeList;
    }, //获取传真树状分组队列
    getMeetingTreeList: (state) => {
      return state.meetingTreeList;
    }, //获取会议树状分组队列
    getTalkTreeList: (state) => {
      return state.talkTreeList;
    }, //获取对讲树状分组队列
    // 根据会议类型切换展示不同成员数据
    getConfMemberStatus1: (state) => {
      let arr = state.ConfMemberStatus1.filter((v) => {
        if (state.videoType == 0) {
          return !v.meetingType;
        } else if (state.videoType == 1) {
          return (
            !v.meetingType ||
            v.meetingType == 1 ||
            v.meetingType == 2 ||
            v.meetingType == 7
          );
        } else {
          return !v.meetingType || v.meetingType == 2 || v.meetingType == 7;
        }
      });
      return arr;
    },
    getConfSpeakStatus: (state) => {
      console.log("当前静音状态", state.ConfSpeakStatus);
      return state.ConfSpeakStatus || false;
    },
    getConfBroadcastStatus: (state) => {
      return state.ConfBroadcastStatus || false;
    },
    getConfTalkbackStatus: (state) => {
      return state.ConfTalkbackStatus || false;
    },
    getUserCall: (state) => state.userCall,
    getIcpName: (state) => state.icpName,
    getMyVdcConfId: (state) => state.myVdcConfId,
    getAgentService: (state) => state.agentService,
    getCommunicationService: (state) => state.communicationService,
    getSmsService: (state) => state.smsService,
    getCallStatus: (state) => state.callStatus,
    getCallConn: (state) => state.callconn,
    getCallClass: (state) => {
      return state.callClass || "";
    },
    getCid: (state) => state.cid,
    getCallee: (state) => state.callee,
    getCaller: (state) => state.caller,
    getCallType: (state) => state.callType,
    getPasscode: (state) => state.passcode,
    getUnifiedAccessCode: (state) => state.unifiedAccessCode,
    getConfId: (state) => state.confId,
    getConfMemberStatus: (state) => state.ConfMemberStatus,
    getConfStatus: (state) => state.confStatus,
    getCallQueue: (state) => state.callQueue,
    getCallHistoryId: (state) => state.callHistoryId,
    getTimer: (state) => state.timer,
    getGrpid: (state) => state.grpid,

    /******  我是区分 ↑ 和 ↓ 的区别的 ******/
    getTurnOnEmergencyResponse: (state) => state.preparednessResponse,
    getSituation: (state) => state.eventSituation,
    getParam: (state) => state.eventParam,
    getIsJumpToIcpPhone: (state) => state.isJumpToIcpPhone,
    getPhoneHistoryId: (state) => state.phoneHistoryId,
    getTxtNotif: (state) => state.txtNotify,
    getTxtNotif1: (state) => {
      return state.txtNotify.join("") || "";
    },
    getCenterNo: (state) => state.youShiKanAgentIdsCenterNo,
    getValue: (state) => state.youShiKanAgentIdsValue,
    getPassword: (state) => state.youShiKanAgentIdsPassword,
    getDspuserNo: (state) => state.youShiKanAgentIdsDspuserNo,
    getYouShiKanLogin: (state) => state.youShiKanLogin,
    getDieNumber: (state) => state.dieNumber,
    getOverallEvent: (state) => state.overallEvent,
    getDispositionType: (state) => state.dispositionType,
    getGroupType: (state) => state.groupType,
    getGroupId: (state) => state.groupId,

    getCurrentGroupName: (state) => state.currentGroupName,
    getIsLoadShow: (state) => state.isLoadShow,
    getGroupActive: (state) => state.groupActive,
    getBoardCasdIndex: (state) => state.boardCasdIndex,
    getBoardStatus: (state) => state.boardStatus,
    // getMeetRemoveIndex: state => state.meetRemoveIndex,
    getTelephoneState: (state) => state.telephoneState,
    getMusicState: (state) => state.musicState,
    getPhoneList: (state) => state.phoneList,
    getNowSelectPhoneList: (state) => state.nowSelectPhoneList,
    getBoxList: (state) => state.boxList,
    getBookReminder: (state) => state.bookReminder,
    getDutyReminder: (state) => state.dutyReminder,
    getPhoneState: (state) => state.phoneState,
    getThreePhoneList: (state) => state.threePhoneList,
    getfaxScanStatus: (state) => state.faxScanStatus,
    getscanFilePath: (state) => state.scanFilePath,
    getIsCallPhone: (state) => {
      console.log(state.isCallPhone);
      return state.isCallPhone;
    },
    getIsPhoneCallStatus: (state) => state.isPhoneCallStatus,
    getIsCallType: (state) => state.isCallType,
    getIsAgentSpeekList: (state) => state.isAgentSpeekList,
    getIsShowButton: (state) => state.isShowButton,
    getThreePhoneId: (state) => state.threePhoneId,
    getIsHangUp: (state) => state.isHangUp,
    getIsIntelligenceReports: (state) => state.isIntelligenceReports,
    getIsMissedCalls: (state) => state.isMissedCalls,
    getIsDialogType: (state) => {
      console.log(state.dialogType);
      return state.dialogType;
    },
    getIsManyCallsList: (state) => {
      console.log(state.manyCallsList);
      return state.manyCallsList;
    },
    getIsMakeCallMobile: (state) => state.makeCallMobile,
    getUploadAgent: (state) => state.uploadAgent,
    getHoldCallPhone: (state) => state.holdCallPhone,
    getPhoneToPickMachine: (state) => state.phoneToPickMachine,
    getCopyBusinessCard: (state) => state.copyBusinessCard,
    getDialable: (state) => state.dialable,
    getSmsOrFax: (state) => state.smsOrFax,
    getAudioText: (state) => state.audioText,
    getTurnToTextLoading: (state) => state.loading.loading || false,
    getFaxSendCount: (state) => state.faxSendCount,
    getAutoCallSettings: (state) => state.autoCallSettings,
    getPhoneRecordFile: (state) => state.recordFile, // 获取通话结束后的录音地址
    getMakeCallMessage: (state) => state.makeCallMessage, // 获取请求通话方法后等待的回调信息
    getEventList: (state) => state.eventList, // 获取事件+事件续报列表
    getCommonInformationReport: (state) => state.commonInformationReport, // 获取一般事件接报信息
    getActiveEvent: (state) => state.activeEvent, // 获取事件接报当前激活的事件续报
    getEventId: (state) => state.eventId, // 获取事件id
    getCaseId: (state) => state.caseId, // 获取事件类型id
    /******************************************************* openlab项目结束 *******************************************************/
  },
  strict: process.env.NODE_ENV !== "production",
});
