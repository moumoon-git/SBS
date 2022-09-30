/**
 * @author xrw
 * @date 2019/9/23
 */
import { Message, MessageBox } from "element-ui";
import axios from 'axios';
import $axios from '../../api/api';
import store from '@/store/index';
import ucsApi from "./ucsApi";
import router from '../../../router/index'
import el from "element-ui/src/locale/lang/el";
import { start, reset, pause, startPause, startPhone, phoneReset } from "../../../assets/js/common";

const Url = window.g.ApiUrl;

// 呼入呼出开始时间
let callingStartTime = '';
let calloutStartTime = '';
// //mq服务地址
// let MQServer;
// //mq用户名
// let MQUser;
// //mq密码
// let MQPwd;
// //EMTAgent在MQ中的标识，传入用户需要登录的ICP坐席号码
// let MQMyCode;
// //WEB端在MQ中的标识，WEB端自定义即可，用于EMTAgent给WEB端发送消息
// let MQDeCode;
// //视频终端列表
// let cameraLst="";
//
// /**
//  * 获取MQ标识
//  * @param m_MQMyCode
//  * @param m_MQDeCode
//  */
// function getMQCode(m_MQMyCode, m_MQDeCode) {
//   MQMyCode = m_MQMyCode;
//   MQDeCode = "eos" + m_MQDeCode;
//   sessionStorage.setItem('MQDeCode', MQDeCode);
//   sessionStorage.setItem('MQMyCode', MQMyCode);
// }
//
// /**
//  * 获取mq地址、账号
//  */
// function getUser(m_MQMyCode, m_MQDeCode) {
//   //获取MQ标识
//   getMQCode(m_MQMyCode, m_MQDeCode);
//   //获取mq地址、账号
//   axios.post(Url + "/eos/communication/icp/init",
//     {}).then(function (data) {
//     if (data.data.errorcode === 0) {
//       // Message.success("MQ账号获取成功");
//       console.log("MQ账号获取成功")
//       MQServer = data.data.data.url;
//       MQUser = data.data.data.user;
//       MQPwd = data.data.data.password;
//       sessionStorage.setItem('MQServer', MQServer);
//       sessionStorage.setItem('MQUser', MQUser);
//       sessionStorage.setItem('MQPwd', MQPwd);
//       loadSDK();
//       return true;
//     } else {
//       console.log("MQ账号获取失败")
//       // Message.error("MQ账号获取失败");
//       return false;
//     }
//   })
// }
//
// /**
//  * EMTAgent启动 地址链接组成方式为：自定义协调头://自定义参数;自定义协议头：默认注册为EMTProtocol
//  * @param MQServer MQ服务地址，带端口
//  * @param MQUser MQ登录用户
//  * @param MQPwd MQ登陆密码
//  * @param MQMyCode EMTAgent在MQ中的标识，传入用户需要登录的ICP坐席号码
//  * @param MQDeCode WEB端在MQ中的标识，WEB端自定义即可，用于EMTAgent给WEB端发送消息,即TOPIC
//  */
// function loadSDK() {
//
// /*  window.open("EMTProtocol://<Config>"
//     + "<MQServer>" + MQServer + "</MQServer>"
//     + "<MQUser>" + MQUser + "</MQUser>"
//     + "<MQPwd>" + MQPwd + "</MQPwd>"
//     + "<MQMyCode>" + MQMyCode + "</MQMyCode>"
//     + "<MQDeCode>" + MQDeCode + "</MQDeCode><KillRunning>1</KillRunning>"
//     + "</Config>") */
//
//   var dom=document.createElement("div");
//       dom.setAttribute("id","startEMTAgent");
//       dom.setAttribute("style","display:none;");
//       dom.innerHTML="<iframe scrolling='no' frameborder='0' marginheight='10' marginwidth='40%' width='500' height='500' allowTransparency src='"
//           + "EMTProtocol://<Config>"
//           + "<MQServer>" + MQServer + "</MQServer>"
//           + "<MQUser>" + MQUser + "</MQUser>"
//           + "<MQPwd>" + MQPwd + "</MQPwd>"
//           + "<MQMyCode>" + MQMyCode + "</MQMyCode>"
//           + "<MQDeCode>" + MQDeCode + "</MQDeCode><KillRunning>1</KillRunning>"
//           + "</Config>'></iframe>";
//       document.body.appendChild(dom);
// }
//
//
// /**
//  * 设置json公告消息头
//  * @param PriCmd 主命令字，标识命令类型，默认1
//  * @param SubCmd 次命令字，标识接口id，1至255
//  * @param Tag 扩展字段，当SubCmd为255时启动该字段，256至int类型最大值，不启用是设置0
//  */
// function setRequestHeader(PriCmd, SubCmd, Tag) {
//   //json公告消息头
//   let requestHeader = {
//     "cmd": {
//       "PriCmd": PriCmd,
//       "SubCmd": SubCmd,
//       "Tag": Tag
//     }
//   };
//   return requestHeader;
// }
//
// /**
//  * 发送ICP登录配置
//  * @agent_id 坐席id
//  * @constructor
//  */
// function CtiConfig() {
//   let requestHeader = setRequestHeader(1, 226, 0);
//   //topicName:MQ的topic，vcExtension：用户选择的坐席
//   let data = {"topicName": sessionStorage.getItem("MQMyCode"), "vcExtension": sessionStorage.getItem("MQMyCode")}
//   axios.post(Url + "/eos/communication/icp/start", data).then(function (data) {
//     if (data.status == 200) {
//       console.log("已发送ICP登录配置！")
//       // Message.success("已发送ICP登录配置！");
//     }
//   })
// }
//
// /**
//  * 上层用户向cti服务注册
//  * @param user 用户名
//  * @param passwd 密码
//  * @param license 保留字段
//  * @param agent_id1 用户所拥有的1号坐席id
//  * @param agent_id2 用户所拥有的2号坐席id
//  * @constructor
//  */
// function AgentLogin(user, passwd, license, agent_id1, agent_id2) {
//   let requestHeader = setRequestHeader(1, 1, 0);
//   requestHeader["user"] = user;
//   requestHeader["passwd"] = passwd;
//   requestHeader["license"] = license;
//   requestHeader["agent_id1"] = agent_id1;
//   requestHeader["agent_id2"] = agent_id2;
//   let data = {
//     "topicName": sessionStorage.getItem("MQMyCode"),
//     "text": requestHeader
//   };
//   axios.post(Url + "/eos/communication/icp/send", data).then(function (data) {
//     if (data.status == 200) {
//       Message.info("上层用户向cti服务注册成功！");
//     } else {
//       Message.info("上层用户向cti服务注册失败！");
//     }
//   })
// }
//
/**
 * 用户登录结果返回
 * @data 接收登录返回的结果
 * @constructor
 */
function AgentLoginAck(data) {
  // 通讯服务登陆成功或失败提示语
  //date:2020.10.12,bug7372,author:husiyue
  const communicationSuccess = window.g.communicationLoginSuccess;
  const communicationError = window.g.communicationLoginError;
  if (data.status == 0) {
    Message.success(communicationSuccess);
    store.commit('setAgentService', true);
    store.commit('setCommunicationService', true);
  } else {
    Message.error(communicationError);
    store.commit('setAgentService', false);
    store.commit('setCommunicationService', false);
  }
}

//
// /**
//  * 坐席改变状态
//  * @param agent_id 坐席id
//  * @param status 改变到的状态 0:离线；1：上线
//  * @constructor
//  */
// function AgentChangeStatus(agent_id, status) {
//   let requestHeader = setRequestHeader(1, 3, 0);
//   requestHeader["agent_id"] = agent_id;
//   requestHeader["status"] = status;
//   let data = {
//     "topicName": sessionStorage.getItem("MQMyCode"),
//     "text": requestHeader
//   };
//   axios.post(Url + "/eos/communication/icp/send", data).then(function (data) {
//     if (data.errorcode == 0) {
//       // Message.info("坐席改变状态成功！");
//     } else {
//       // Message.info("坐席改变状态失败！");
//     }//
//   })
// }
//
// /*退出EMTAgent*/
// function EMTAgentClose() {
//   let requestHeader = setRequestHeader(1, 255, 270);
//   requestHeader["dataBuf"] = "CLOSESELF";
//   let data = {
//     "topicName": sessionStorage.getItem("MQMyCode"),
//     "text": requestHeader
//   };
//   axios.post(Url + "/eos/communication/icp/send", data).then(function (data) {
//     if (data.data.errorcode == 0) {
//       Message.success("坐席服务退出成功！");
//     } else {
//       Message.error("坐席服务退出失败！");
//     }
//   })
// }
//
// /**
//  * 发起呼叫
//  * @remake 发起一次呼叫，需先拿起坐席话机
//  * @param agent_id 坐席id
//  * @param called 外呼号码
//  * @param iddcode 坐席号码
//  * @constructor
//  */
// function MakeCall(agent_id, called, iddcode,obj={}) {
//   let secherNumber=called
//   axios.post(Url + "/eos/communication/phone/validateNumber", {agentId:sessionStorage.getItem("agent_id")||'',number: called}).then(function (result) {
//     if (result.status == 200) {
//       let requestHeader = setRequestHeader(1, 5, 0);
//       requestHeader["agent_id"] = agent_id;
//       requestHeader["called"] = String(result.data.data);
//       requestHeader["iddcode"] = iddcode;
//       let topicName = sessionStorage.getItem("MQMyCode")
//       let data = {
//         "topicName": topicName,
//         "text": requestHeader
//       };
//       if (topicName == "" || topicName == null || topicName == undefined) {
//         Message.error("坐席未登录!")
//       }
//       axios.post(Url + "/eos/communication/icp/send", data).then(function (data) {
//         if (data.status == 200) {
//           Message.success("已发起呼叫！");
//           store.commit("setCallStatus", true);
//           store.commit("SET_ISSHOWWIN", false);
//           store.commit("setCallee", called);
//           sessionStorage.setItem('phoneCall', String(called));
//           let isJump = store.getters.getIsJumpToIcpPhone;//是否跳转icpPhone页面
//           // if (!isJump) {
//
//           // } else {
//           //   router.push({path: '/icpPhone'});
//           // }
//           axios.post(Url + "/eos/communication/contactor/findContactorByMobile", {number: String(secherNumber)}).then(function (res) {
//             if (res.data.errorcode != 0) {
//               Message.error(res.data.msg);
//               return;
//             }
//             store.commit("SET_USERC",res.data.data);
//             let eventId = sessionStorage.getItem('newID');//事件关联的id
//             // 新增通话历史
//             let historydata = {
//               "number": called,
//               "callType": '1',
//               "startTime": getTime(),
//               "connectedTime": '',
//               "endTime": '',
//               "contactId": res.data.data.id,
//               "agentId": sessionStorage.getItem("agent_id"),
//               "caseId": eventId
//             };
//             Object.assign(historydata,obj)
//             axios.post(Url + "/eos/history/recordPhoneHisory", historydata).then(function (data) {
//               if (res.data.errorcode == 0)
//                 store.commit("setCallHistoryId", data.data.data.id)
//               else
//                 Message.error("历史记录新增失败！");
//             })
//           })
//         }
//       })
//     }
//   })
//
//
// }

//获取系统当前时间
function getTime() {
  var date = new Date();
  var seperator1 = "-";
  var seperator2 = ":";
  var month = date.getMonth() + 1;
  if (month >= 1 && month <= 9) {
    month = "0" + month;
  }
  var strDate = date.getDate();
  if (strDate >= 0 && strDate <= 9) {
    strDate = "0" + strDate;
  }
  var Hours = date.getHours();
  if (Hours >= 0 && Hours <= 9) {
    Hours = "0" + Hours;
  }
  var Minutes = date.getMinutes();
  if (Minutes >= 0 && Minutes <= 9) {
    Minutes = "0" + Minutes;
  }
  var Seconds = date.getSeconds()
  if (Seconds >= 0 && Seconds <= 9) {
    Seconds = "0" + Seconds;
  }
  var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate + " " + Hours + seperator2 + Minutes + seperator2 + Seconds;
  return currentdate;
}

/**
 * 呼叫任务请求结果通知，需要将外线编号和被呼号码关联保存起来，用于保持通话、恢复通话等 6
 * @param data 接收到的结果
 * 1、agent_id=发起呼叫的坐席id
 * 2、new_conn=用于外呼的外线编号
 * 3、status=任务结果
 * 4、cause=备用字段
 * @constructor
 */
function MakeCallAck(data) {
  console.log('--------------MakeCallAck-----------------', data);
  if (data.status == 0) {
    // Message.success("呼叫成功！");
    // startPause()

    // store.commit('setIsCallPhone', 'call');
    // store.commit("setCallStatus", true);
    // store.commit("setCallClass", 'callout');
    //保存外线编号
    store.commit("setCallConn", data.new_conn);
    store.commit('setIsHangUp', false)
  }
  else if (data.status == 1) {
    store.commit("setCallStatus", false);
    store.commit("SET_ISSHOWWIN", false);
    store.commit("SET_USERC", {});
    store.commit("setTxtNotify", []);
    if (data.cause == 63000) {
      Message.success("已停止呼叫！");
      store.commit('setIsCallPhone', 'hangUp');
      store.commit('setIsHangUp', true)
    }
    else if (data.cause == 61007) {
      Message.success("对方已拒接！");
      store.commit('setIsCallPhone', 'hangUp');
      store.commit('setIsHangUp', true)
    }
    else if (data.cause == 61005) {
      Message.success("被叫无应答！");
      store.commit('setIsCallPhone', 'hangUp');
      store.commit('setIsHangUp', true)
    }
    else if (data.cause == 61003) {
      Message.success("被叫号码不存在！");
      store.commit('setIsCallPhone', 'hangUp');
      store.commit('setIsHangUp', true)
    }
    else {
      Message.success("被叫无应答！");
      store.commit('setIsCallPhone', 'hangUp');
      store.commit('setIsHangUp', true)
    }
  }
  else if (data.status == -1) {
    Message.error("呼叫失败！");
    store.commit("setCallStatus", false);
    store.commit("SET_ISSHOWWIN", false);
    store.commit("SET_USERC", {});
    store.commit("setTxtNotify", []);
    store.commit('setIsCallPhone', 'hangUp');
    store.commit('setIsHangUp', true)
  }
  // let secherNumber = store.getters.getIsMakeCallMobile
  // console.log(secherNumber);
  // axios.post(Url + "/eos/communication/contactor/findContactorByMobile", {number: String(secherNumber)}).then(function (res) {
  //   if (res.data.errorcode != 0) {
  //     Message.error(res.data.msg);
  //     return;
  //   }
  //   store.commit("SET_USERC", res.data.data);
  //   let eventId = sessionStorage.getItem('newID');//事件关联的id
  //   // 新增通话历史
  //   let historydata = {
  //     "number": secherNumber,
  //     "callType": '1',
  //     "startTime": getTime(),
  //     "connectedTime": '',
  //     "endTime": '',
  //     "contactId": res.data.data.id,
  //     "agentId": sessionStorage.getItem("agent_id"),
  //     "caseId": eventId
  //   };
  //   axios.post(Url + "/eos/history/recordPhoneHisory", historydata).then(function (res1) {
  //     if (res.data.errorcode == 0)
  //       store.commit("setCallHistoryId", res1.data.data.id)
  //     else
  //       Message.error("历史记录新增失败！");
  //   })
  // })
}

//
// /**
//  * 发起呼叫--扩展接口。
//  * @remake 提供一个自定义参数，最终在历史记录中传入。增加号码类型，区分普通电话和视频电话等类型
//  * @param agent_id 需要外呼的坐席id
//  * @param number 外呼号码
//  * @param iddcode 坐席的号码
//  * @param param_1 呼叫外带自定义参数，会在历史记录中传入，可选
//  * @param numType 号码类型，0未知，1普通电话，2无线数字设备，3无线模拟设备4短波5手机，6坐席，7 eLTE，8视频电话
//  * @constructor
//  */
// function MakeCallEx(agent_id, number, iddcode, param_1, numType) {
//   let requestHeader = setRequestHeader(1, 44, 0);
//   requestHeader["agent_id"] = agent_id;
//   requestHeader["number"] = number;
//   requestHeader["iddcode"] = iddcode;
//   requestHeader["param_1"] = param_1;
//   requestHeader["numType"] = numType;
//   let data = {
//     "topicName": sessionStorage.getItem("MQMyCode"),
//     "text": requestHeader
//   };
//   axios.post(Url + "/eos/communication/icp/send", data).then(function (data) {
//
//   })
// }
//
// /**
//  * 挂断电话
//  * @param agent_id 请求的坐席id
//  * @param conn 需挂掉的通道编号
//  * @param key 通话队列需要移出的key值(非必填)
//  * @constructor
//  */
// function DropCall(agent_id, conn, key) {
//   let requestHeader = setRequestHeader(1, 9, 0);
//   requestHeader["agent_id"] = agent_id;
//   requestHeader["conn"] = conn;
//   let data = {
//     "topicName": sessionStorage.getItem("MQMyCode"),
//     "text": requestHeader
//   };
//   axios.post(Url + "/eos/communication/icp/send", data).then(function (data) {
//     if (data.status == 200) {
//       Message.success("已发起挂断");
//       if (key != "" || key != null) {
//         //将号码添加到通话队列
//         // store.dispatch('answerCalls')
//         store.commit("reMoveCallQueue", key);
//       }
//     }
//   })
// }
//
// /**
//  * 来电保持
//  * @param agent_id 需要外呼的坐席id
//  * @param conn 需挂掉（保持）的通道编号
//  * @constructor
//  */
// function HeldCall(agent_id, conn) {
//   let requestHeader = setRequestHeader(1, 7, 0);
//   requestHeader["agent_id"] = agent_id;
//   requestHeader["conn"] = conn;
//   let data = {
//     "topicName": sessionStorage.getItem("MQMyCode"),
//     "text": requestHeader
//   };
//   axios.post(Url + "/eos/communication/icp/send", data).then(function (data) {
//     if (data.status == 200) {
//       Message.success("已发起保持");
//     }
//   })
// }
//
// /**
//  * 恢复来电
//  * @remake 接通在等待状态的一路通话，坐席操作员拿起话机，选择等待区中的一路通话进行恢复；
//  * @param agent_id 想接通来电的坐席id
//  * @param conn_a 坐席通道编号（传agent_id即可）
//  * @param conn_b 外线通道编号
//  * @constructor
//  */
// function AlternateCall(agent_id, conn_a, conn_b) {
//   let requestHeader = setRequestHeader(1, 8, 0);
//   requestHeader["agent_id"] = agent_id;
//   requestHeader["conn_a"] = conn_a;
//   requestHeader["conn_b"] = conn_b;
//   let data = {
//     "topicName": sessionStorage.getItem("MQMyCode"),
//     "text": requestHeader
//   };
//   axios.post(Url + "/eos/communication/icp/send", data).then(function (data) {
//     if (data.status == 200) {
//       Message.success("已发起恢复");
//     }
//   })
// }
//
// /**
//  * 转接线路
//  * @remake 把本次通话转接给其他话路；首先【保持】本次通话，接着呼通要转接的话路，选择【转接】功能即可把两个话路接通
//  * @param agent_id
//  * @param conn
//  * @constructor
//  */
// function TransferCall(agent_id, conn) {
//   let requestHeader = setRequestHeader(1, 16, 0);
//   requestHeader["agent_id"] = agent_id;
//   requestHeader["conn"] = conn;
//   let data = {
//     "topicName": sessionStorage.getItem("MQMyCode"),
//     "text": requestHeader
//   };
//   axios.post(Url + "/eos/communication/icp/send", data).then(function (data) {
//
//   })
// }
//
// /**
//  * 收听录音
//  * @remake 对坐席播放录音文件
//  * @param agent_id 对其播放录音的坐席id
//  * @param conn 对其播放录音的坐席通道编号
//  * @param recordfile 录音文件名
//  * @constructor
//  */
// function PlayRecordFile(agent_id, conn, recordfile) {
//   let requestHeader = setRequestHeader(1, 23, 0);
//   requestHeader["agent_id"] = agent_id;
//   requestHeader["conn"] = conn;
//   requestHeader["recordfile"] = recordfile;
//   let data = {
//     "topicName": sessionStorage.getItem("MQMyCode"),
//     "text": requestHeader
//   };
//   axios.post(Url + "/eos/communication/icp/send", data).then(function (data) {
//
//   })
// }
//
// /**
//  * 创建电话会议
//  * @remake 创建一个电话会议
//  * @param agent_id 发起会议的坐席id
//  * @constructor
//  */
// function CreateConf(agent_id) {
//   let requestHeader = setRequestHeader(1, 24, 0);
//   requestHeader["agent_id"] = agent_id;
//   let data = {
//     "topicName": sessionStorage.getItem("MQMyCode"),
//     "text": requestHeader
//   };
//   axios.post(Url + "/eos/communication/icp/send", data).then(function (data) {
//
//   })
// }
//
// /**
//  * 删除电话会议
//  * @remake 删除一个电话会议
//  * @param agent_id 发起会议的坐席id
//  * @param conf_id 会议编号id
//  * @constructor
//  */
// function DeleteConf(agent_id, conf_id,call) {
//   let requestHeader = setRequestHeader(1, 28, 0);
//   requestHeader["agent_id"] = agent_id;
//   requestHeader["conf_id"] = conf_id;
//   let data = {
//     "topicName": sessionStorage.getItem("MQMyCode"),
//     "text": requestHeader
//   };
//   axios.post(Url + "/eos/communication/icp/send", data).then(function (data) {
//     if (data.status == 200)
//       reset();
//       typeof call ==='function'&&call();
//       Message.success("已发起删除会议！")
//   })
// }
//
// /**
//  * 加入电话会议
//  * @remake 把一路话路加入电话会议中
//  * @param agent_id 发起会议的坐席id
//  * @param conf_id 要加入的会议编号id
//  * @param conn 话路通道的编号
//  * @constructor
//  */
// function JoinConf(agent_id, conf_id, conn) {
//   let requestHeader = setRequestHeader(1, 26, 0);
//   requestHeader["agent_id"] = agent_id;
//   requestHeader["conf_id"] = conf_id;
//   requestHeader["conn"] = conn;
//   let data = {
//     "topicName": sessionStorage.getItem("MQMyCode"),
//     "text": requestHeader
//   };
//   axios.post(Url + "/eos/communication/icp/send", data).then(function (data) {
//
//   })
// }
//
// /**
//  * 移出电话会议
//  * @remake 把一路话路从电话会议中移出
//  * @param agent_id 发起会议的坐席id
//  * @param conf_id 通道所在会议编号id
//  * @param conn 话路通道的编号
//  * @constructor
//  */
// function RemoveFromConf(agent_id, conf_id, conn) {
//   let requestHeader = setRequestHeader(1, 29, 0);
//   requestHeader["agent_id"] = agent_id;
//   requestHeader["conf_id"] = conf_id;
//   requestHeader["conn"] = conn;
//   let data = {
//     "topicName": sessionStorage.getItem("MQMyCode"),
//     "text": requestHeader
//   };
//   axios.post(Url + "/eos/communication/icp/send", data).then(function (data) {
//     if (data.status == 200){}
//       Message.success("已发起移出成员！")
//   })
// }
//
// /**
//  * 查询电话会议成员
//  * @param agent_id 发起会议的坐席id
//  * @param conf_id 要查询的会议编号id
//  * @constructor
//  */
// function RequestConfMember(agent_id, conf_id) {
//   let requestHeader = setRequestHeader(1, 34, 0);
//   requestHeader["agent_id"] = agent_id;
//   requestHeader["conf_id"] = conf_id;
//   let data = {
//     "topicName": sessionStorage.getItem("MQMyCode"),
//     "text": requestHeader
//   };
//   axios.post(Url + "/eos/communication/icp/send", data).then(function (data) {
//
//   })
// }
//
// /**
//  * 查询已创建的电话会议
//  * @param agent_id 发起会议的坐席id
//  * @constructor
//  */
// function RequestConf(agent_id) {
//   let requestHeader = setRequestHeader(1, 32, 0);
//   requestHeader["agent_id"] = agent_id;
//   let data = {
//     "topicName": sessionStorage.getItem("MQMyCode"),
//     "text": requestHeader
//   };
//   axios.post(Url + "/eos/communication/icp/send", data).then(function (data) {
//
//   })
// }
//
// /**
//  * 改变会议中线路状态
//  * @param agent_id 发起请求的坐席id
//  * @param conf_id 电话会议标识id
//  * @param conn 电话线路编号
//  * @param member_type 成员状态1:只能说 2:只能听 3:可说可听
//  * @constructor
//  */
// function OperateConfMember(agent_id, conf_id, conn, member_type) {
//   let requestHeader = setRequestHeader(1, 30, 0);
//   requestHeader["agent_id"] = agent_id;
//   requestHeader["conf_id"] = conf_id;
//   requestHeader["conn"] = conn;
//   requestHeader["member_type"] = member_type;
//   let data = {
//     "topicName": sessionStorage.getItem("MQMyCode"),
//     "text": requestHeader
//   };
//   axios.post(Url + "/eos/communication/icp/send", data).then(function (data) {
//
//   })
// }
//
// /**
//  * 发送传真
//  * @remake 向cti服务发送传真请求
//  * @param case_id 事件id
//  * @param opr_name 客户端登陆用户
//  * @param fax_number 接收方号码
//  * @param fax_name 传真标题
//  * @param fax_file 传真文件名
//  * @param fax_process_id 事件流程id
//  * @param fax_id 传真任务id
//  * @param fax_extend 传真任务自定义内容
//  * @constructor
//  */
// function SendFax(case_id, opr_name, fax_number, fax_name, fax_file, fax_process_id, fax_id, fax_extend) {
//   let requestHeader = setRequestHeader(1, 121, 0);
//   requestHeader["case_id"] = case_id;
//   requestHeader["opr_name"] = opr_name;
//   requestHeader["fax_number"] = fax_number;
//   requestHeader["fax_name"] = fax_name;
//   requestHeader["fax_file"] = fax_file;
//   requestHeader["fax_process_id"] = fax_process_id;
//   requestHeader["fax_id"] = fax_id;
//   requestHeader["fax_extend"] = fax_extend;
//   let data = {
//     "topicName": sessionStorage.getItem("MQMyCode"),
//     "text": requestHeader
//   };
//   axios.post(Url + "/eos/communication/icp/send", data).then(function (data) {
//
//   })
// }

/**
 * 通话记录通知(弃用)
 * @remake 一路通话结束后，通知上层通话记录
 * @param agent_id
 * @param conn
 * @param cdr_id
 * @constructor
 */
function CallReleased(agent_id, conn, cdr_id) {
  let requestHeader = setRequestHeader(1, 14, 0);
  requestHeader["agent_id"] = agent_id;
  requestHeader["conn"] = conn;
  requestHeader["cdr_id"] = cdr_id;
  let data = {
    "topicName": sessionStorage.getItem("MQMyCode"),
    "text": requestHeader
  };
  // store.dispatch('answerCalls')
  axios.post(Url + "/eos/communication/icp/send", data).then(function (data) {

  })
}

/**
 * 保持来电结果返回
 * @param data: 1、agent_id=通话的坐席id
 * 2、conn=通话的通道编号
 * 3、status=结果
 * cdr_id=插入数据库记录的id
 * @constructor
 */
function HeldCallAck(data) {
  if (data.status == 0) {
    Message.success("保持通话成功！");
    store.dispatch("callMaintain");
    store.commit("setCallClass", 'callheld');
  } else {
    Message.error("保持通话失败！");
  }
}

/**
 * 来电恢复请求结果返回
 * @param data:1、agent_id=通话的坐席id
 2、conn_a=通话一方的通道编号
 3、conn_b=通道另一方的通道编号
 4、status=结果
 * @constructor
 */
function AlternateCallAck(data) {
  if (data.status == 0) {
    Message.success("恢复通话成功！");
    store.dispatch('callRecover');
    store.commit("setCallClass", 'callon');
    store.commit("setCallQueueClass", { callClass: 'callon', conn: data.conn_b });
  } else {
    Message.error("恢复通话失败！");
  }
}

/**
 * 来电转接请求结果返回
 * @param data: 1、1agent_id=通话的坐席id
 2、conn=转接过去（第三方）的通道编号
 3、status=结果
 * @constructor
 */
function TransferCallAck(data) {
  if (data.status == 0) {
    Message.success("来电转接成功！");
  } else {
    Message.error("来电转接失败！");
  }
}

/**
 * 创建电话会议请求结果返回
 * @param data: 1、agent_id=坐席id
 2、conf_id=创建的电话会议id
 3、status=结果
 * @constructor
 */
function CreateConfAck(data) {
  if (data.status == 0) {
    Message.success("创建电话会议成功！");
  } else {
    Message.error("创建电话会议失败！");
  }
}

/**
 * 删除电话会议请求结果返回
 * @param data：1、conf_id=需删除的电话会议id
 2、status=结果
 * @constructor
 */
function DeleteConfAck(data) {
  if (data.status == 0) {
    Message.success("电话会议结束成功！");
    store.commit("setConfStatus", false)
    store.commit("setConfId", 0)
    store.commit("cleanQueueRemove")
    store.dispatch('delecteVodiListFor')
    reset()
  } else {
    Message.error("电话会议结束失败！");
  }
}

/**
 * 加入电话会议请求结果返回
 * @param data： 1、agent_id=坐席id
 2、conf_id=目的电话会议id
 3、conn=加入电话会议的通道编号
 4、status=结果
 * @constructor
 */
function JoinConfAck(data) {
  if (data.status == 0) {
    Message.success("加入电话会议成功！");
  } else {
    Message.error("加入电话会议失败！");
  }
}

/**
 * 查询电话会议成员结果返回---自行处理返回的结果
 * @param data: 1、conf_id=目的电话会议id
 2、memmber_count=成员数量
 3、conn=成员通道编号集，以逗号隔开
 4、number=成员通道号码集，以逗号隔开
 * @returns {*}
 * @constructor
 */
function ConfMemberDetail(data) {
  return data;
}

/**
 * 线路状态提醒 3
 * @param data: 1、agent_id=坐席id
 2、conn=坐席通道编号
 3、status=坐席状态;0空闲、1摘机2;  呼叫进入、3呼出、4振铃、5应答
 * @constructor    前端呼入不在这里做,在来电提醒做。
 */
function PortStatusChanged(data) {
  console.log('--------------PortStatusChanged-----------------', data);
  let agentId = sessionStorage.getItem("agent_id");
  if (data.status == 0) {
    console.log("坐席处于空闲状态！")
    // store.commit("setIsCallPhone", '');
    store.dispatch('manyPeopleReply', data)  //根据广播去掉已经被其他坐席接听的电话
    // let holdCallPhone=store.getters.getHoldCallPhone;
    let holdCallPhone = false //之前的逻辑是保持中的电话不能挂断，是错的。所以现在不做保持的限制了
    if (!holdCallPhone) {
      store.dispatch('answerCalls') //icp貌似未接不会有东西返回，所以在坐席处于空闲时默认把电话铃声关了。
      // store.commit('setIsCallType','') //没有电话呼入呼出通话之后改为''。
      let dialogType = store.getters.getIsDialogType; // 如果是mini弹窗换成small弹窗
      if (dialogType == 'mini') {
        store.commit('setIsDialogType', 'small')
      }
      let callState = store.getters.getIsMissedCalls; //这个状态有问题，至少呼出流程有问题
      let callType = store.getters.getIsCallType; //呼叫类型，callIng>= 呼入  callOut >=呼出
      if (data.agent_id == agentId) {
        store.commit('setPhoneToPickMachine', false) //话机处于空闲状态
        if (callType == 'callIng' && callState) { //如果是呼入,如果是未接
          store.commit('setCallStatus', false);  //改为未在通话
          store.commit('SET_ISSHOWWIN', false);  //改为未在通话
          // store.commit('setIsDialogType', 'small')  //弹出未接small弹窗
          // store.commit("setIsCallPhone", 'hangUp');  //弹出电话弹窗,
          store.commit('setIsmManyCallsList', []);  //清掉多呼叫的弹窗
        }
      }

      store.commit('setIsHangUp', true);

      let boxList = [
        {
          current: 1,
          text: '三方',
          start: false,
          url: '/static/img/phoneCallImg/peopleGray.png'
        },
        {
          current: 1,
          text: '拨号',
          start: false,
          url: '/static/img/phoneCallImg/callGray.png'
        },
        {
          current: 1,
          text: '恢复',
          start: false,
          url: '/static/img/phoneCallImg/recoverGray.png'
        },
        {
          current: 1,
          text: '转接',
          start: false,
          url: '/static/img/phoneCallImg/switchGray.png'
        },
        {
          current: 1,
          text: '拨号盘',
          start: true,
          url: '/static/img/phoneCallImg/phoneBlue.png'
        },
        {
          current: 1,
          text: '保持',
          start: false,
          url: '/static/img/phoneCallImg/keepCallingGray.png'
        }]
      store.commit('setBoxList', boxList); //复原新的拨号组可操作按钮

      // store.commit("setIsCallType", '');//电话结束电话类型改为‘’

      //状态改为可进行通话
      let phoneList = store.getters.getPhoneList;
      phoneList.forEach((items, indexs) => {
        phoneList[indexs].myState = 0 //改变状态为等待中
        phoneList[indexs].time = '00:00:00';//通话时间改为0
        phoneList[indexs].isCallState=false //是否是通话状态
      })
      store.commit('setPhoneList', phoneList); //提交修改状态之后的通话列表

      store.commit('setPhoneState', 5); //三方通话存储当前通话类型
      store.commit('setThreePhoneList', []); //存储三方列表
      store.commit("setIsCallPhone", 'hangUp');//不在通话状态
      store.commit("setIsPhoneCallStatus", false);//修改是否可以操作队列

      phoneReset()  //重置计时

      store.commit("setCallStatus", false);  //旧弹窗关闭
      store.commit("SET_ISSHOWWIN", false);
      store.commit("setCallClass", '');
      // store.commit("SET_USERC", {});  // 注释原因：呼入电话挂断后，联系人的信息会为未知。注释掉可以解决此问题 author:hexinting
      store.commit("setTxtNotify", []);
      // store.commit('setIsMissedCalls',false)
      store.commit("setPhoneRecordFile", '') // bug7913 author:hexinting date:2020-11-12 初始化电话记录url
    }

  }
  else if (data.status == 1) {
    console.log("坐席处于摘机状态！")
    if (data.agent_id == agentId) {
      store.commit('setPhoneToPickMachine', true) //话机处于摘机状态
    }
  }
  else if (data.status == 2) {
    console.log("坐席处于呼叫进入状态！")
    callingStartTime = getTime();
    store.commit('setIsMissedCalls', true) //存储为未接来电
    // store.commit("setCallClass", 'callin');
    store.commit('setIsCallType', 'callIng') //呼入改为callIng。
    // store.commit('setIsDialogType','small') //small弹窗。
    store.commit("setIsCallPhone", 'call');  //弹出电话弹窗,
  }
  else if (data.status == 3) {
    if (data.agent_id == agentId) {
      calloutStartTime = getTime();
      store.commit('setIsCallType', 'callOut') //呼出改为callOut。
      store.commit('setIsDialogType', 'small') //small弹窗。
      store.commit("setMakeCallMessage", data); // (针对优士康)存放电话请求结果通知，用于判断摘机情况下，若无消息，则初始化通话状态
      console.log("坐席处于呼出状态！")
    }
    store.commit('setIsHangUp', true)
  }
  else if (data.status == 4) {
    // router.push({path: '/icpPhone'});
    console.log("坐席处于振铃状态！")
    callingStartTime = getTime();
    store.commit("setIsCallPhone", 'call');  //弹出电话弹窗
    store.commit("setCallStatus", true);
    store.commit("setCallClass", 'callin');
    store.commit('setIsCallType', 'callIng') //振铃也属于呼入
    // store.commit('setIsDialogType','small') //small弹窗。
  }
  else if (data.status == 5) {
    console.log("坐席处于应答状态！")
    store.commit("setIsCallPhone", 'talking');  //弹出电话弹窗
    store.commit("setCallClass", 'callon');
    store.commit("setCallQueueClass", { callClass: 'callon', conn: data.conn });
    // store.commit('setIsDialogType', 'small') //small弹窗。
    store.commit('setIsDialogType', 'big') // 智能接报弹窗。 任务265 石景山需求： 打通电话后，就自动弹出智能接报页面
    store.commit("setIsAgentSpeekList", []); // 清空实时语音转文字内容
    if (data.agent_id != agentId) {
      store.dispatch('manyPeopleReply', data)  //根据广播去掉已经被其他坐席接听的电话
    }
  }
}

/**
 * 来电号码提醒 15
 * @param data: 1、agent_id=正在振铃的坐席id
 2、conn=取得来电号码的通道编号
 3、calling=取得的来电号码
 * @returns {*}
 * @constructor
 */
function UpdateCallingNumber(data) {
  console.log('-----------UpdateCallingNumber--------------', data);
  // 屏蔽奇怪的电话号码
  if (/[a-zA-Z]+$/.test(data.calling)) {
    ucsApi.DropCall(data.agent_id, data.conn)
    return;
  }
  let callingNum = ''
  if (data.calling.length == 12 && data.calling[0] == '0') {
    callingNum = data.calling.substr(1)
  } else {
    callingNum = data.calling
  }
  axios.post(Url + "/eos/history/getblacklist", { phoneNumber: callingNum }).then(function (result) {
    if (result.data.data) {
      ucsApi.DropCall(data.agent_id, data.conn)
      Message.error('已发起挂断黑名单号码：' + callingNum)
      return;
    }
    store.commit("setCallConn", data.conn);
    store.commit("setCallee", callingNum);
    store.commit("setCallClass", 'callin');
    store.commit("setCallQueue", { mobile: callingNum, cid: '', callClass: 'callin', conn: data.conn });
    store.commit("setCallStatus", true);
    // $axios请求会带token请求头
    let options = {
      url: Url + "/eos/communication/contactor/findContactorByMobile",
      method: 'post',
      data: {
        number: callingNum
      }
    }
    $axios(options).then((res) => {
      if (res.errorcode !== 0) {
        Message.error(res.data.msg);
        return;
      }
      store.commit("SET_USERC", res.data);
      store.commit("setIsCallType", 'callIng'); //电话类型改为呼入
      // store.commit('setIsDialogType','small') //small弹窗。
      // store.commit("setIsCallPhone",true);
      store.dispatch('diaboloMusic', res.data); //电话响铃
      store.dispatch("manyCalls", data); //调用多呼入方法
      let agent = sessionStorage.getItem("agent_id")
      if (String(data.agent_id) === String(agent)) {
        //新增通话历史
        let historydata = {
          "number": callingNum,
          "callType": '0',
          "startTime": callingStartTime,
          "connectedTime": '',
          "endTime": '',
          "contactId": res.data.id,
          "agentId": agent
        }
        axios.post(Url + "/eos/history/recordPhoneHisory", historydata).then((res1) => {
          if (res1.status === 200)
            store.commit("setCallHistoryId", res1.data.data.id);
          else
            Message.error("历史记录新增失败！");
        })
      }

    })
  })
}

/**
 * 来电等待通知 13
 * @param data: 1、conn=来电进入等待的通道编号
 2、calling=来电号码
 3、called=被叫号码
 4、status=通话状态---0,消失，1保持中，2呼出通话中，3呼入通话中
 5、conn=每通电话的唯一标识
 * @constructor
 */
function BroadcastCallOffered(data) {
  console.log(data);
  if (data.conn) {
    store.commit("setCallConn", data.conn);
  }
  if (data.status == 0) {
    console.log("通话状态：消失！")
    // let holdCallPhone=store.getters.getHoldCallPhone; //判断是否保持状态
    let holdCallPhone = false //暂时先写死，保持中都可以挂断
    if (!holdCallPhone) {  //yskNb
      let boxList = [
        {
          current: 1,
          text: '三方',
          start: false,
          url: '/static/img/phoneCallImg/peopleGray.png'
        },
        {
          current: 1,
          text: '拨号',
          start: false,
          url: '/static/img/phoneCallImg/callGray.png'
        },
        {
          current: 1,

          text: '恢复',
          start: false,
          url: '/static/img/phoneCallImg/recoverGray.png'
        },
        {
          current: 1,
          text: '转接',
          start: false,
          url: '/static/img/phoneCallImg/switchGray.png'
        },
        {
          current: 1,
          text: '拨号盘',
          start: true,
          url: '/static/img/phoneCallImg/phoneBlue.png'
        },
        {
          current: 1,
          text: '保持',
          start: false,
          url: '/static/img/phoneCallImg/keepCallingGray.png'
        }]
      store.commit('setBoxList', boxList); //复原新的拨号组可操作按钮
      // store.commit("setIsCallType", '');//电话结束电话类型改为‘’
      let dialogType = store.getters.getIsDialogType; // 电话类型
      if (dialogType === 'mini') {
        store.commit("setIsDialogType", 'small');//若类型是mini时，电话结束电话类型改为small author:hexinting date:2020-11-6 bug7913
      }
      //状态改为可进行通话
      let phoneList = store.getters.getPhoneList;
      phoneList.forEach((items, indexs) => {
        phoneList[indexs].myState = 0 //改变状态为等待中
        phoneList[indexs].time = '00:00:00';//通话时间改为0
        phoneList[indexs].isCallState = false //是否是通话状态
      })
      store.commit('setPhoneList', phoneList); //提交修改状态之后的通话列表
      
      store.commit('setPhoneState', 5); //三方通话存储当前通话类型
      store.commit('setThreePhoneList', []); //存储三方列表
      store.commit("setIsCallPhone", 'hangUp');//不在通话状态
      store.commit("setIsPhoneCallStatus", false);//修改是否可以操作队列
      phoneReset()  //重置计时
      store.commit("setCallStatus", false);  //旧弹窗关闭
      store.commit("SET_ISSHOWWIN", false);
      store.commit("setCallClass", '');
      // store.commit("SET_USERC",{});
      store.commit("setTxtNotify", []);
      store.commit('setIsmManyCallsList', []);  //呼入通话时，未接，通话状态消失，把多个电话的弹窗关闭
      if (data.calling.length == 12 && data.calling[0] == '0') {
        store.commit("CallQueueRemove", data.calling.substr(1));
      } else {
        store.commit("CallQueueRemove", data.calling);
      }
      if (data.called.length == 12 && data.called[0] == '0') {
        store.commit("CallQueueRemove", data.called.substr(1));
      } else {
        store.commit("CallQueueRemove", data.called);
      }
    }
    store.commit('setHoldCallPhone', false);  //状态存为未保持


  }
  else if (data.status == 1) {
    console.log("通话状态：保持中！")
    store.commit("setCallClass", 'callheld');
    store.commit("setCallQueueClass", { callClass: 'callheld', conn: data.conn });
    store.commit("setIsCallType", 'callOut');//电话类型改为呼出
    // store.commit('setIsDialogType','small') //small弹窗。
    store.commit("setIsCallPhone", 'talking');//通话状态,开弹窗

  }
  else if (data.status == 2) {
    console.log("通话状态：呼出通话中！")
    startPhone()//呼出开启电话计时
    store.dispatch('callSuccess');
    store.commit("setIsCallType", 'callOut');//电话类型改为呼出
    // store.commit('setIsDialogType','small') //small弹窗。
    store.commit("setIsCallPhone", 'talking');//通话状态,开弹窗
  }
  else if (data.status == 3) {
    store.dispatch('answerCalls'); // 关闭铃声
    console.log("通话状态：呼入通话中！")
    startPhone()  //呼入开启电话计时
    store.commit("setDialable", true);//通话队列
    store.commit('setIsMissedCalls', false);//不是未接
    store.dispatch('calledSuccess', data.calling); //被叫成功通话
    store.commit("setIsCallType", 'callIng');//电话类型改为呼入
    // store.commit('setIsDialogType','small') //small弹窗。
    store.commit("setIsCallPhone", 'talking');//通话状态,开弹窗
    store.commit('setIsmManyCallsList', []);  //呼入通话时，把多个电话的弹窗关闭
    store.commit("setCallQueueClass", { callClass: 'callon', conn: data.conn });

  }
  else if (data.status == 4) {
    let agentId = sessionStorage.getItem("agent_id");
    if (data.agent_id == agentId) {
      console.log("通话状态：呼出中！")
      store.commit("setDialable", true);//通话队列
      /* 这里是处理座机拨打电话时不能获取联系人信息的问题 */
      // $axios请求会带token请求头
      let options = {
        url: Url + "/eos/communication/contactor/findContactorByMobile",
        method: 'post',
        data: {
          number: String(data.called)
        }
      }
      $axios(options)
        .then((res) => {
          let info = res.data ? res.data : {};
          let content = {
            name: info.name,
            number: data.called,
            workUnit: info.workUnit,
            position: info.position,
            state: 0
          }
          let phoneList = JSON.parse(JSON.stringify(store.getters.getPhoneList));
          let flag = false;
          phoneList.forEach((items, indexs) => {
            if (data.called == items.content.number) {
              phoneList[indexs].myState = 3;
              flag = true;
              phoneList[indexs].isCallState = true //呼叫中不能再拨打其他号码
            } else {
              phoneList[indexs].isCallState = false //呼叫中不能再拨打其他号码
            }
          });
          if (!flag) {
            phoneList.push({
              myState: 0,  // 0 >=待呼出 1>= 通话中  2>= 保持中 3>= 呼叫中 4>= 呼叫失败
              content: content,
              time: '00:00:00',
              isCallState: false,
            })
          }
          let keepList = [];
          keepList.push({
            myState: 0,  // 0 >=待呼出 1>= 通话中  2>= 保持中 3>= 呼叫中 4>= 呼叫失败
            content: content,
            time: '00:00:00',
            isCallState: true, //是否是通话状态// bug 7309 author:hexinting date:2020-10-27
          })
          store.commit("setNowSelectPhoneList", []);//先清空
          store.commit("setNowSelectPhoneList", keepList);//添加到现在选中的通话
          store.commit('setPhoneList', phoneList); //提交修改状态之后的通话列表
          store.commit("setIsMakeCallMobile", data.called);//存储当前被叫的号码
          store.commit("setIsCallType", 'callOut');//电话类型改为呼出
          // store.commit('setIsDialogType','small') //small弹窗。
          store.commit("setIsCallPhone", 'call');//通话状态,开弹窗
          if (data.called) {
            if (data.called.length == 12 && data.called[0] == '0') {
              store.commit("setCallee", data.called.substr(1));
              store.commit("setCallQueue", {
                mobile: data.called.substr(1),
                cid: '',
                callClass: 'callout',
                conn: data.conn
              });
            } else {
              store.commit("setCallee", data.called);
              store.commit("setCallQueue", { mobile: data.called, cid: '', callClass: 'callout', conn: data.conn });
            }
          }
          // 新增通话历史
          let historydata = {
            "number": data.called,
            "callType": '1',
            "startTime": calloutStartTime,
            "connectedTime": '',
            "endTime": '',
            "contactId": info.id,
            "agentId": sessionStorage.getItem("agent_id"),
            "caseId": sessionStorage.getItem('newID') //事件关联的id
          };
          axios.post(Url + "/eos/history/recordPhoneHisory", historydata)
            .then((res1) => {
              if (res1.data.errorcode == 0)
                store.commit("setCallHistoryId", res1.data.data.id)
              else
                Message.error("历史记录新增失败！");
            });
        });
    }
  }
}

/**
 * 传真发送结果返回
 * @param data： 1、fax_cdr_id=传真记录id
 2、fax_number=接收方的号码
 3、fax_file=传真文件的存放路径
 4、result=传真的发送结果
 * @constructor
 */
function FaxSent(data) {
  if (data.status == 0) {
    Message.info("传真发送成功！");
  } else {
    Message.info("传真发送失败！");
  }
}

/**
 * 通知上层收到一个新传真
 * @param data: 1、fax_cdr_id=传真记录id
 2、fax_number=发送方的号码
 3、fax_file=传真文件名
 * @returns {*}
 * @constructor
 */
function FaxReceived(data) {
  return data;
}

/**
 * 会议成员状态改变结果返回
 * @param data: 1、agent_id=发起请求的坐席id
 2、conf_id=电话会议标识id
 3、conn=电话线路编号
 4、type=成员状态1:只能说 2:只能听 3:可说可听
 5、flag=操作结果
 * @constructor
 */
function OperateConfMemberAck(data) {
  if (data.type == 1) {
    Message.info("坐席处于空闲状态！");
  } else if (data.type == 2) {
    Message.info("坐席处于摘机状态！");
  } else if (data.type == 3) {
    Message.info("坐席处于呼叫进入状态！");
  }
}

//
// /**
//  * 请求把与坐席通话的通道转接到其他号码上
//  * @param agent_id 发起操作的坐席id
//  * @param mobile_to 转接的号码
//  * @constructor
//  */
// function TransferCallOneKey(agent_id, mobile_to) {
//   let requestHeader = setRequestHeader(1, 43, 0);
//   requestHeader["agent_id"] = agent_id;
//   requestHeader["mobile_to"] = mobile_to;
//   let data = {
//     "topicName": sessionStorage.getItem("MQMyCode"),
//     "text": requestHeader
//   };
//   axios.post(Url + "/eos/communication/icp/send", data).then(function (data) {
//     if (data.status == 200)
//       Message.success("已发起转接！")
//
//   })
// }

/**
 * 转接结果返回
 * @param data: 1、agent_id=发起操作的坐席id
 2、mobile_to=转接的号码
 3、status= 请求结果
 * @constructor
 */
function TransferCallOneKeyAck(data) {
  if (data.status == 0) {
    Message.success("转接成功！");
    phoneReset()
    // startPhone()
    store.dispatch('callMultitap')
    store.commit("setCallQueue", { mobile: data.mobile_to, cid: '', callClass: 'callout', conn: 0 });
  } else {
    Message.error("转接失败！");
  }
}

//
// /**
//  * 在坐席通话过程中，加入第三方形成三方通话，系统后台自动呼叫第三方号码。
//  * @param agent_id 发起操作的坐席id
//  * @param callTag 坐席正在通话的通话标识
//  * @param thirdNum 第三方的号码
//  * @param numType 第三方号码的类型，0未知，1普通电话，2无线数字设备，3无线模拟设备4短波5手机，6坐席，7 eLTE，8视频。（默认传1，集群还需要现场才明白）
//  * @constructor
//  */
// function ThreeWayConf(agent_id, callTag, thirdNum, numType,) {
//   let requestHeader = setRequestHeader(1, 255, 273);
//   requestHeader["agent_id"] = agent_id;
//   requestHeader["callTag"] = callTag;
//   requestHeader["thirdNum"] = thirdNum;
//   requestHeader["numType"] = numType;
//   let data = {
//     "topicName": sessionStorage.getItem("MQMyCode"),
//     "text": requestHeader
//   };
//   axios.post(Url + "/eos/communication/icp/send", data).then(function (data) {
//     if (data.status == 200)
//       Message.success("已发起三方通话")
//   })
// }

/**
 * 三方通话请求结果返回 274
 * @remake 4.1.3.7版本，ret返回的是错误原因，4.1.3.8版本开始，ret返回-1为失败，大于0代码成功，返回的是会议ID
 * @param data: 1、agent_id=发起操作的坐席id
 2、long callTag= 坐席正在通话的通话标识
 3、BSTR thirdNum =第三方的号码
 4、long numType =第三方号码的类型，0未知，1普通电话，2无线数字设备，3无线模拟设备4短波5手机，6坐席，7 eLTE，8视频。
 （默认传1，集群还需要现场才明白）
 5、long iRet=请求结果，0成功，非0失败，为失败原因
 * @constructor
 */
function ThreeWayConfAck(data) {
  if (data.iRet == -1) {
    Message.error("三方通话请求失败！");
  } else {
    console.log(data)
    store.commit('setThreePhoneId', data.iRet)  //存储三方通话ID
    let threeArr = {}
    let agent_id = sessionStorage.getItem("agent_id");
    let mobile = parseInt(data.thirdNum)
    axios.post(Url + "/eos/communication/phone/reverseValidatedNumber", {
      number: mobile,
      agentId: agent_id
    }).then(function (res) {
      if (res.data.errorcode == 0) {
        let phone = res.data.data;
        // $axios请求会带token请求头
        let options = {
          url: Url + "/eos/communication/contactor/findContactorByMobile",
          method: 'post',
          data: {
            number: phone
          }
        }
        $axios(options).then((res) => {
          if (res.errorcode == 0) {
            if ([''].includes(res.data.mobile)) {
              threeArr = {
                name: '未知联系人',
                number: mobile,
                workUnit: '未知',
                position: '未知',
                state: 2
              }
            } else {
              threeArr = {
                name: res.data.name,
                number: res.data.mobile,
                workUnit: res.data.workUnit,
                position: res.data.position,
                state: 2
              }

            }
            store.dispatch('threeWayCalling', threeArr);  //调用三方通话方法
          }
        })

      }
      store.dispatch('threeWayCalling', threeArr);  //调用三方通话方法
    })

    Message.success("三方通话请求成功！");
    store.commit("setCallQueue", { mobile: data.thirdNum, cid: '', callClass: 'callout', conn: '' });
    store.commit("setConfId", data.iRet);
  }
}

/**
 * 通话结束返回 229
 * @param data:
 call_type=通话类型，0呼入，1呼出
 calling =主叫号码
 called= 被叫号码
 annalog_channel=通话标识
 agent_channel=坐席通道id
 agent_id=坐席id
 start_time=开始时间
 connected_time=通话接通时间
 end_time=结束时间
 duration=通话时长
 recordfile=录音文件名，非绝对路径
 app_param_1=前端自定义内容
 * @constructor
 */
function InsertPhoneCdr(result) {
  console.log('---------InsertPhoneCdr---------')
  // store.dispatch('answerCalls')
  // 屏蔽奇怪的电话号码
  // if (/[a-zA-Z]+$/.test(result.calling)) {
  //   return;
  // }
  if (store.getters.getCallHistoryId) {
    if (result.connected_time != '0001-01-01 00:00:00') {
      let agent = sessionStorage.getItem("agent_id")
      if (String(result.agent_id) === String(agent)) { // 更新记录时候要判断是否是当前坐席的通话
        // 任务265 石景山需求 挂断电话后，自动将语音识别的内容作为备注保存到对应的通话记录中。
        var remark = "";
        var isAgentSpeekList = store.getters.getIsAgentSpeekList;
        isAgentSpeekList.map((v) => {
          if (v.from == 2) {
            remark += v.text + "\n";
          } else if (v.from == 1) {
            remark += v.text + '\n';
          }
        });
        console.log(remark);
        let data = {
          "id": store.getters.getCallHistoryId,
          "connectedTime": result.connected_time,
          "endTime": result.end_time,
          "record": result.recordfile,
          // "remark":store.getters.getTxtNotif1
          "remark": remark // 接报备注
        }
        // $axios请求会带token请求头
        let options = {
          url: Url + "/eos/history/updateRecordPhoneHisory",
          method: 'post',
          data: data
        }
        $axios(options).then((res) => {
          if (res.errorcode !== 0) {
            Message.error(res.data.msg);
            return;
          }
          console.log('通话记录更新成功')
          // store.commit("setCallHistoryId", '');  //不清电话历史id
          store.commit('setPhoneRecordFile', result.recordfile) // 保存电话记录地址 author:hexinting date:2020-11-06 bug7913
        })
      }
    }
  }
}

//
// /**
//  * 创建音视频会议，自动呼叫成员号码，呼通接入会议
//  * @remake 其中，numType中包含视频类型，则创建视频会议，否则为音频会议。
//  音频会议创建后不能再添加视频类的成员。
//  创建视频会议时还没有成员，可传登陆的坐席号码，numType对应传8
//  * @param agent_id 发起操作的坐席id
//  * @param memberNum 会议成员号码+显示名（例如：07551001|*|会议室终端,07551002|*|手持终端），以逗号隔开，最多24个号码
//  * @param numType 成员号码对应的号码类型（0未知，1普通电话，2无线数字设备，3无线模拟设备4短波5手机，6坐席，7 eLTE，8视频），同样以逗号隔开
//  * @constructor
//  */
// function CreateConfEx(agent_id, memberNum, numType,call) {
//   let requestHeader = setRequestHeader(1, 255, 271);
//   requestHeader["agent_id"] = agent_id;
//   requestHeader["memberNum"] = memberNum;
//   requestHeader["numType"] = numType;
//   let data = {
//     "topicName": sessionStorage.getItem("MQMyCode"),
//     "text": requestHeader
//   };
//    axios.post(Url + "/eos/communication/icp/send", data).then(function (data) {
//     if (data.data.errorcode == 0) {
//       Message.success("已发起创建会议！");
//       start();
//       typeof call==='function'&&call(data)
//       //router.push({path: '/icpVideo'});
//       sessionStorage.setItem('videoListMemberNum', memberNum);
//       sessionStorage.setItem('videoListNumType', numType);
//     }
//   })
// }

/**
 * 创建音视频会议结果返回 272
 * @param data: 1、agent_id=发起操作的坐席id
 2、BSTR memberNum=会议成员号码，以逗号隔开，最多24个号码
 3、BSTR numType= 成员号码对应的号码类型，同样以逗号隔开
 4、long confId = 会议标识，0为失败，非0为会议标识，需要保存，会议操作需要用到
 5、int isVideo=是否视频会议，1是，0否
 * @returns {*}
 * @constructor
 */
function CreateConfExAck(data) {
  console.log(data, data.confId)
  if (data.confId <= 0) {
    Message.error("创建音视频会议失败！");
  } else {
    Message.success("创建音视频会议成功！");
    store.commit("setConfStatus", true)
    store.commit("setConfId", data.confId)
    start();
  }
}

//
// /**
//  * 加入会议接口
//  * @remake 调用加入会议接口，传入号码及号码类型，后台呼通加入会议，结果通过JoinConfEx2Ack回调返回
//  * @param agent_id
//  * @param conf_id
//  * @param conn
//  * @param phoneNumber
//  * @param numType
//  * @constructor
//  */
// function JoinConfEx(agent_id, conf_id, conn, phoneNumber, numType) {
//   let requestHeader = setRequestHeader(1, 255, 276);
//   requestHeader["agent_id"] = agent_id;
//   requestHeader["conf_id"] = conf_id;
//   requestHeader["conn"] = conn;
//   requestHeader["phoneNumber"] = phoneNumber;
//   requestHeader["numType"] = numType;
//   let data = {
//     "topicName": sessionStorage.getItem("MQMyCode"),
//     "text": requestHeader
//   };
//   axios.post(Url + "/eos/communication/icp/send", data).then(function (data) {
//
//   })
// }

/**
 * 加入会议接口回调返回 277
 * @param data: 1、agent_id=发起操作的坐席id
 2、 long conf_id=会议id
 3、long conn=与坐席通话的通话标识id，暂不可用
 4、int status = 接口调用结果，0成功，非0为失败原因
 5、BSTR phoneNumber
 =要加入会议的号码
 6、long numType=要加入会议的号码类型
 * @constructor
 */
function JoinConfEx2Ack(data) {
  if (data.status == 0) {
    Message.success("加入会议成功！");
  } else {
    Message.error("加入会议失败，原因：" + data.status);
  }

}

/**
 * 会议成员状态返回 275
 * @param data: 1、int agent_id= 会议所属坐席id
 2、int callTag = 通话标识，暂无意义
 3、int confId = 会议标识id
 4、BSTR memberNum =成员号码
 5、int numType =成员号码类型
 6、int status = 成员状态-----0空闲、1摘机2;  呼叫进入、3呼出、4振铃、5应答
 * @returns {*}
 * @constructor
 */
function ConfMemberStatus(data) {
  console.log(data, "会议成员状态返回")
  let therrCall = store.getters.getPhoneState
  console.log(therrCall, '~~~~~~~~~~~~~~~~~~~~~~~~~');
  // store.commit('setPhoneState',5); //三方通话存储当前通话类型
  if (therrCall == 0) {
    let phone = {
      number: '',
      status: data.status
    }
    let agent_id = sessionStorage.getItem("agent_id");
    axios.post(Url + "/eos/communication/phone/reverseValidatedNumber", {
      number: data.memberNum,
      agentId: agent_id
    }).then(function (res) {
      if (res.data.errorcode == 0) {
        phone.number = res.data.data

      }
      store.dispatch('therrCallOverKey', phone)
    })
  } else {
    store.dispatch('vodiListFor', data)
  }
  return data;
}

//
// /**
//  * 电话会议移出成员
//  * @param agent_id  1、int agent_id//坐席id
//  * @param conf_id 2、,int conf_id,//会议id
//  * @param conn 3、int conn,//通话标识
//  * @param number 4、BSTR number,//成员号码
//  * @constructor
//  */
// function RemoveFromConfEx(agent_id, conf_id, conn, number,call) {
//   let requestHeader = setRequestHeader(1, 255, 263);
//   requestHeader["agent_id"] = agent_id;
//   requestHeader["conf_id"] = conf_id;
//   requestHeader["conn"] = conn;
//   requestHeader["number"] = number;
//   let data = {
//     "topicName": sessionStorage.getItem("MQMyCode"),
//     "text": requestHeader
//   };
//   axios.post(Url + "/eos/communication/icp/send", data).then(function (data) {
//     if (data.data.errorcode == 0){
//         typeof call ==='function'&&call()
//     }else{
//       console.log(number)
//     }
//   })
// }

/**
 * 电话会议移出成员结果返回 264
 * @param data: 1、int agent_id//坐席id
 2、,int conf_id,//会议id
 3、int conn,//通话标识
 4、BSTR number,//成员号码
 5、int result//操作结果，0成功，非0 为错误码
 * @constructor
 */
function RemoveFromConfExAck(data) {
  console.log(data)
  if (data.status == 0) {
    let therrCall = store.getters.getPhoneState
    Message.success("电话会议移出成功！");
    if (therrCall == 0) {
      let phoneNumber = {
        number: '',
        status: data.status
      }
      let agent_id = sessionStorage.getItem("agent_id");
      axios.post(Url + "/eos/communication/phone/reverseValidatedNumber", {
        number: data.number,
        agentId: agent_id
      }).then(function (res) {
        if (res.data.errorcode == 0) {
          phoneNumber.number = res.data.data
        }
        store.dispatch('removalKeyPersonnel', phoneNumber)
      })
    } else {
      store.dispatch('RemoveFromConf', data)
    }
  } else {
    Message.error("电话会议移出失败！");
    // store.commit('setMeetRemoveIndex', -1)
  }

}

//
// /**
//  * 设置会议成员禁言/发言，执行结果通话OperateConfMemberExAck接口回调返回 278
//  * @param agent_id 1、int agent_id= 会议所属坐席id
//  * @param confId 2、int confId = 会议标识id
//  * @param conn 3、int conn= 通话标识，暂无意义
//  * @param type 4、int type=成员权限-----1、只能说2、只能听3、可说可听,4:不能说不能听,5:全部禁言,6:全部发言
//  * @param phoneNumber 5、BSTR phoneNumber=成员号码
//  * @constructor
//  */
// function OperateConfMemberEx(agent_id, confId, conn, type, phoneNumber,call) {
//   let requestHeader = setRequestHeader(1, 255, 278);
//   requestHeader["agent_id"] = agent_id;
//   requestHeader["conf_id"] = confId;
//   requestHeader["conn"] = conn;
//   requestHeader["type"] = type;
//   requestHeader["phoneNumber"] = phoneNumber;
//   let data = {
//     "topicName": sessionStorage.getItem("MQMyCode"),
//     "text": requestHeader
//   };
//   axios.post(Url + "/eos/communication/icp/send", data).then(function (data) {
//     if (data.data.errorcode == 0){
//       typeof call ==='function'&&call()
//         if (type == 5 || type == 2){
//           Message.success("已发起会议成员禁言")
//           typeof call ==='function'&&call()
//         }else if (type == 6 || type == 3){
//           Message.success("已发起会议成员发言")
//           typeof call ==='function'&&call()
//         }
//      }
//   })
// }

/**
 * 设置会议成员禁言/发言 返回结果
 * @param data
 * @constructor
 */
function OperateConfMemberExAck(data) {
  if (data.result == 0) {
    if (data.type == 2) {
      Message.success("设置会议成员禁言成功！");
      store.dispatch('operateConfMemberEx', data)
    } else if (data.type == 3)
      Message.success("设置会议成员发言成功！");
    store.dispatch('operateConfMemberEx', data)
  } else {
    Message.error("设置会议成员禁言/发言失败！");
  }
}

//
// /**]
//  * 设置视频会议、视频电话通话视频窗口
//  * @param agent_id  int agent_id =操作的坐席id;
//  * @param localHandle int localHandle=本端窗口句柄；
//  * @param remoteHandle  int remoteHandle=远端窗口句柄；
//  * @constructor
//  */
// function SetVideoWindow(agent_id, localHandle, remoteHandle) {
//   let requestHeader = setRequestHeader(1, 255, 280);
//   requestHeader["agent_id"] = agent_id;
//   requestHeader["localHandle"] = localHandle;
//   requestHeader["remoteHandle"] = remoteHandle;
//   let data = {
//     "topicName": sessionStorage.getItem("MQMyCode"),
//     "text": requestHeader
//   };
//   axios.post(Url + "/eos/communication/icp/send", data).then(function (data) {
//
//   })
// }

/**
 * 设置视频会议、视频电话通话视频窗口结果返回
 * @param data: 1、  int agent_id =操作的坐席id;
 2、int localHandle=本端窗口句柄；
 3、  int remoteHandle=远端窗口句柄；
 4、int result=处理结果，0成功，非0为失败错误码
 * @constructor
 */
function SetVideoWindowAck(data) {
  if (data.result == 0) {
    console.log("设置视频会议、视频电话通话视频窗口成功！");
  } else {
    console.log("设置视频会议、视频电话通话视频窗口失败，错误码：" + data.result);
  }
}

//
// /**
//  * 视频会议中，广播/取消广播成员画面功能 282
//  * @remake 可以广播单个成员画面，也可组合多个成员的画面广播。
//  * @param agent_id int 坐席id
//  * @param conf_id int 会议ID
//  * @param mixType int 广播画面模式，1单画面,4均分4画面,9均分9画面，16均分16画面
//  * @param phoneNum String 成员号码列表，以逗号分隔，最大16个
//  * @param isCannel int 是否取消广播，0否，1取消
//  * @constructor
//  */
// function ConfBoardCastMember(agent_id, conf_id, mixType, phoneNum, isCannel,call) {
//   let requestHeader = setRequestHeader(1, 255, 282);
//   requestHeader["agent_id"] = agent_id;
//   requestHeader["conf_id"] = conf_id;
//   requestHeader["mixType"] = mixType;
//   requestHeader["phoneNumber"] = phoneNum;
//   requestHeader["isCannel"] = isCannel;
//   let data = {
//     "topicName": sessionStorage.getItem("MQMyCode"),
//     "text": requestHeader
//   };
//   axios.post(Url + "/eos/communication/icp/send", data).then(function (data) {
//     // console.log(data)
//     if (data.data.errorcode == 0) {
//       if (isCannel == 1)
//         Message.success("已发起取消广播画面功能")
//       else if (isCannel == 0)
//         Message.success("已发起广播画面功能")
//         typeof call ==='function'&&call(data)
//     }
//   })
// }

/**
 * 广播/取消广播调用接口结果返回 283
 * @param data: 1、int agent_id;
 2、int conf_id;//会议ID
 3、int mixType;//广播画面模式，1单画面,4均分4画面,9均分9画面，16均分16画面
 4、char phoneNum[21*18] ; //成员号码列表，以逗号分隔，最大16个
 5、int isCannel;//是否取消广播
 6、int result=操作结果，0成功，非0为错误码
 * @constructor
 */
function ConfBoardCastMemberAck(data) {
  let msg = '';
  switch (store.state.boardStatus) {
    case 1:
      msg = "全部广播";
      break;
    case 2:
      msg = "取消广播";
      break;
    case 3:
      msg = "广播";
      break;
    case 4:
      msg = "取消广播";
      break;
  }
  console.log('data.result: ', data.result);
  if (data.result == 0) {
    Message.success(`${msg}画面成功！`);
    store.dispatch('ConfBoardCast', data)
  } else if (data.result == -1) {
    Message.error("参数错误！");
  } else {
    Message.error(`${msg}画面失败！`);
  }
  store.dispatch("initBoardParams", {});
}

//
// /**
//  * 选看视频会议成员画面，可同时预览多个成员画面，最多16个
//  * @param agent_id 坐席id
//  * @param conf_id 会议ID
//  * @param mixType 广播画面模式，1-单画面,4-均分4画面,9-均分9画面，16-均分16画面
//  * @param phoneNum 成员号码列表，以逗号分隔,最多16个
//  * @constructor
//  */
// function ConfWatchMember(agent_id, conf_id, mixType, phoneNum) {
//   let requestHeader = setRequestHeader(1, 255, 284);
//   requestHeader["agent_id"] = agent_id;
//   requestHeader["conf_id"] = conf_id;
//   requestHeader["mixType"] = mixType;
//   requestHeader["phoneNum"] = phoneNum;
//   let data = {
//     "topicName": sessionStorage.getItem("MQMyCode"),
//     "text": requestHeader
//   };
//   axios.post(Url + "/eos/communication/icp/send", data).then(function (data) {
//
//   })
// }

/**
 * 选看视频会议成员画面结果返回
 * @param data: 1、  int agent_id;
 2、int conf_id;  //会议ID
 3、int mixType;//广播画面模式，1单画面,4均分4画面,9均分9画面，16均分16画面
 4、char phoneNum[21*18] ; //成员号码列表，以逗号分隔,最多16个
 5、int result;操作结果，0成功，非0错误码
 * @constructor
 */
function ConfWatchMemberAck(data) {
  if (data.result == 0) {
    Message.info("选看视频会议成员画面成功！");
  } else {
    Message.info("选看视频会议成员画面失败，错误码：" + data.result);
  }
}

//
// /**
//  * 根据分组id，分页查询其子分组信息
//  * @remake 分组id为0时查询根分组；可查询摄像机资源和eLTE终端分组资源
//  * @param agent_id 坐席id
//  * @param iType 分组类型，0摄像机，1为eLET,8视频终端分组
//  * @param iPageIndex 分页查询，第几页
//  * @param iPageSize 分页查询，每页数量
//  * @param group_id 分组ID
//  * @constructor
//  */
// function ICPQueryGroupInfo(agent_id, iType, iPageIndex, iPageSize, group_id) {
//
//   let requestHeader = setRequestHeader(1, 255, 286);
//   requestHeader["agent_id"] = agent_id;
//   requestHeader["iType"] = iType;
//   requestHeader["iPageIndex"] = iPageIndex;
//   requestHeader["iPageSize"] = iPageSize;
//   requestHeader["group_id"] = group_id;
//   let data = {
//     "topicName": sessionStorage.getItem("MQMyCode"),
//     "text": requestHeader
//   };
//   axios.post(Url + "/eos/communication/icp/send", data).then(function (data) {
//
//   })
// }

/**
 * 查询资源分组结果返回
 * @remake result为查询结果；查询结果可能分几个包返回，最终通过groupInfo字段组成结果Jason字符串
 * @param data: 1、int agent_id;
 2、int iType;//分组类型，0摄像机，1为eLET，8视频终端分组
 3、int iPageIndex;//分页查询，第几页
 4、int iPageSize;//分页查询，每页数量
 5、char   group_id[50];    //分组ID
 6、int result =结果值，0成功，非0错误码
 7、int total;//查询字符串切分数量
 8、int index;//切分数据包第几包
 9、char groupInfo[900];分组信息jason字符串
 * @constructor
 */
function ICPQueryGroupInfoAck(data) {
  console.log(data)
  if (data.result == 0) {
    let groupInfos = JSON.parse(data.groupInfo);
    //把分组信息更新同步到本地数据库
    console.log(groupInfos, '|||||||');
    for (let i = 0; i < groupInfos.length; i++) {
      let data = {
        name: groupInfos[i].groupName,
        code: 'VideoGroup',
        operate: 0,
        pid: 0
      };
      axios.post(Url + "/eos/communication/group/updateGroup", data).then(function (data) {

      })
    }
  } else {

  }
}

//
// /**
//  * 根据资源分组id，分页查询该分组下设备资源信息，可传入设备名称模糊、精确查询设备信息
//  * @param agent_id 坐席id
//  * @param iType 设备类型 0摄像机，1eLET,8视频终端
//  * @param iPageIndex 分页查询，第几页
//  * @param iPageSize 分页查询，每页数量
//  * @param group_id 分组ID
//  * @param devName 设备名称
//  * @constructor
//  */
// function ICPQueryDeviceInfo(agent_id, iType, iPageIndex, iPageSize, group_id, devName,call) {
//   let requestHeader = setRequestHeader(1, 255, 288);
//   requestHeader["agent_id"] = agent_id;
//   requestHeader["iType"] = iType;
//   requestHeader["iPageIndex"] = iPageIndex;
//   requestHeader["iPageSize"] = iPageSize;
//   requestHeader["group_id"] = group_id;
//   requestHeader["devName"] = devName;
//   let data = {
//     "topicName": sessionStorage.getItem("MQMyCode"),
//     "text": requestHeader
//   };
//   axios.post(Url + "/eos/communication/icp/send", data).then(function (data) {
//     if (data.status == 200) {
//       typeof call ==='function'&&call(data)
//     }
//   })
// }

/**
 * 查询设备信息结果返回，字段devInfo为结果Jason字符串。
 * @param data: 1、 int   agent_id;
 2、int iType;//设备类型 0摄像机，1eLET,8视频终端分组
 3、int iPageIndex;//分页查询，第几页
 4、int iPageSize;//分页查询，每页数量
 5、char   group_id[50];    //分组ID
 6、char devName[50];//设备名称
 7、int result=结果值，0成功，非0错误码
 8、int total;//查询字符串切分数量
 9、int index;//切分数据包第几包
 10、char devInfo[900];分组信息jason字符串
 * @constructor
 */
function ICPQueryDeviceInfoAck(data) {
  console.log(data)
  data.index = data.index || 0;
  data.iPageIndex = data.iPageIndex || 0;
  data.total = data.total || 0;
  try {
    if (data.result == 0) {
      // let cameraLst
      // if(data.indexOf("cameraLst") != -1 ){
      //     cameraLst=data
      //   if(data.total){
      //
      //   }
      // }
      data.devInfo.cameraLst = data.devInfo.cameraLst || [];
      // console.log(data.devInfo.cameraLst)
      if (data.devInfo.cameraLst.length > 0) {
        data.devInfo.cameraLst.forEach(o => {
          let data1 = {
            name: o.cameraName,
            number: o.cameraNum,
            groupId: [0],
          }
          axios.post(Url + "/eos/communication/video/editVideoInfo", data1).then(function (data2) {
            // console.log(data2)
          })
        })

      }
      if (data.iPageIndex < data.total) {
        let pageIndex = data.iPageIndex + 1;
        ICPQueryDeviceInfo(Number(data.agent_id), Number(0), Number(pageIndex), Number(10), Number(0), "");
      }
    } else {
      Message.error("更新失败，错误码：" + data.result);
    }
  } catch (error) {
    console.log(error)
  }

  // if (data.index < data.total) {
  //   if(data.devInfo){
  //     cameraLst += data.devInfo;
  //   }
  //   ICPQueryDeviceInfo(Number(data.agent_id), Number(0), Number(1), Number(10), Number(0), "");
  // }else if (data.index ==data.total) {
  //   if (cameraLst!==''){
  //     cameraLst = JSON.parse(cameraLst);
  //     console.log(cameraLst)
  //     //把视频资源信息更新同步到本地数据库

  //     for (let i = 0; i < data.devInfo.length; i++) {
  //       let data = {
  //         name: cameraLst[i].cameraName,
  //         number: cameraLst[i].cameraNum,
  //         groupId: 0,
  //       };

  //     }
  //   }

  // }


}

//
// /**
//  * 根据摄像头号码，在指定窗口预览视频
//  * @param agent_id 坐席id
//  * @param iType 设备类型 0摄像机，1eLET
//  * @param devName 设备号码
//  * @param windowHandle 预览窗口句柄
//  * @constructor
//  */
// function ICPStartRealPlay(agent_id, iType, devName, windowHandle) {
//   let requestHeader = setRequestHeader(1, 255, 290);
//   requestHeader["agent_id"] = agent_id;
//   requestHeader["iType"] = iType;
//   requestHeader["devName"] = devName;
//   requestHeader["windowHandle"] = windowHandle;
//   let data = {
//     "topicName": sessionStorage.getItem("MQMyCode"),
//     "text": requestHeader
//   };
//   axios.post(Url + "/eos/communication/icp/send", data).then(function (data) {
//     if (data.status == 200)
//       Message.success('已发起视频预览！')
//   })
// }

/**
 * 预览摄像头视频结果返回，playHandle字段为播放句柄，停止播放时需要传入
 * @param data: 1、int agent_id;
 2、int iType;//设备类型 0摄像机，1eLET
 3、char devName[50];//设备号码
 4、char windowHandle[50];
 //预览窗口句柄
 5、int result= 结果值，0成功，非0错误码
 char playHandle[50]=播放句柄，停止预览时需要传入
 * @constructor
 */
function ICPStartRealPlayAck(data) {
  if (data.result == 0) {
    Message.success("预览成功！");
  } else {
    Message.error("预览失败，错误码：" + data.result);
  }
}

//
// /**
//  * 停止播放视频
//  * @param agent_id 坐席id
//  * @param iType 设备类型 0摄像机，1eLET
//  * @param playHandle 播放句柄
//  * @constructor
//  */
// function ICPStopRealPlay(agent_id, iType, playHandle) {
//   let requestHeader = setRequestHeader(1, 255, 292);
//   requestHeader["agent_id"] = agent_id;
//   requestHeader["iType"] = iType;
//   requestHeader["playHandle"] = playHandle;
//   let data = {
//     "topicName": sessionStorage.getItem("MQMyCode"),
//     "text": requestHeader
//   };
//   axios.post(Url + "/eos/communication/icp/send", data).then(function (data) {
//
//   })
// }

/**
 * 停止播放视频结果
 * @param data
 * @constructor
 */
function ICPStopRealPlayAck(data) {
  if (data.result == 0) {
    Message.info("查询设备信息成功！");
  } else {
    Message.info("查询设备信息失败，错误码：" + data.result);
  }
}

//
// /**
//  * 摄像机云台控制
//  * @param agent_id 坐席id
//  * @param vcnId 所属VCN的设备编码
//  * @param devNum 设备号码
//  * @param ptzCommand 控制命令 控制命令:
//  PTZ_LENS_ZOOM_IN = 0,焦距变大(PTZ)
//  PTZ_LENS_ZOOM_OUT=1,焦距变小(PTZ)
//  PTZ_LENS_FOCAL_NEAT=2,焦点前调 (FI)
//  PTZ_LENS_FOCAL_FAR = 3, 焦点后调 (FI)
//  PTZ_LENS_APERTURE_OPEN = 4,光圈扩大 (FI)
//  PTZ_LENS_APERTURE_CLOSE = 5,光圈缩小 (FI)
//  PTZ_UP = 6,云台向上 (PTZ)
//  PTZ_DOWN = 7,云台向下 (PTZ)
//  PTZ_LEFT = 8,云台左转 (PTZ)
//  PTZ_RIGHT = 9,云台右转 (PTZ)
//  PTZ_STOP = 10,停止PTZ
//  PTZ_FI_STOP = 11停止FI
//  * @param speed 控制速率--speed是控制的速率，范围是1~10，ptzCommand为PTZ_LENS_FOCAL_NEAT/PTZ_LENS_FOCAL_FAR/PTZ_UP/PTZ_DOWN/PTZ_LEFT/PTZ_RIGHT有效
//  * @param multiple 放大倍数，范围是1~10，ptzCommand为PTZ_LENS_ZOOM_IN/PTZ_LENS_ZOOM_OUT / PTZ_LENS_APERTURE_OPEN/PTZ_LENS_APERTURE_CLOSE有效
//  * @param isStop 是否停止操作,0操作，1停止操作,每个控制指令需要调用一次停止操作
//  * @constructor
//  */
// function ICPPTZDevice(agent_id, vcnId, devNum, ptzCommand, speed, multiple, isStop) {
//   let requestHeader = setRequestHeader(1, 255, 296);
//   requestHeader["agent_id"] = agent_id;
//   requestHeader["vcnId"] = vcnId;
//   requestHeader["devNum"] = devNum;
//   requestHeader["ptzCommand"] = ptzCommand;
//   requestHeader["speed"] = speed;
//   requestHeader["multiple"] = multiple;
//   requestHeader["isStop"] = isStop;
//   let data = {
//     "topicName": sessionStorage.getItem("MQMyCode"),
//     "text": requestHeader
//   };
//   axios.post(Url + "/eos/communication/icp/send", data).then(function (data) {
//
//   })
// }

/**
 * 云台控制结果返回
 * @param data: 1、int agent_id;
 2、char vcnId[128];//所属VCN的设备编码
 3、char devNum[50];//设备号码
 4、int ptzCommand;//控制命令
 5、int speed;//控制速率
 6、int multiple;//倍数
 7、int isStop;//是否停止
 8、int result；结果值，0成功，非0失败码
 * @constructor
 */
function ICPPTZDeviceAck(data) {
  if (data.result == 0) {
    Message.info("云台控制成功！");
  } else {
    Message.info("云台控制失败，错误码：" + data.result);
  }
}

//
// /**
//  * 监控入会，目前只能添加摄像机
//  * @param agent_id
//  * @param iType 设备类型 0摄像机，1eLET
//  * @param conf_id 会议id
//  * @param devName 设备号码
//  * @constructor
//  */
// function ConfAddDevice(agent_id, iType, conf_id, devName) {
//   let requestHeader = setRequestHeader(1, 255, 294);
//   requestHeader["agent_id"] = agent_id;
//   requestHeader["iType"] = iType;
//   requestHeader["conf_id"] = conf_id;
//   requestHeader["devName"] = devName;
//   let data = {
//     "topicName": sessionStorage.getItem("MQMyCode"),
//     "text": requestHeader
//   };
//   axios.post(Url + "/eos/communication/icp/send", data).then(function (data) {
//
//   })
// }

/**
 * 监控入会结果返回
 * @param data: 1、int agent_id;
 2、int iType;//设备类型 0摄像机，1eLET
 3、int conf_id;//会议id
 4、char devName[50];//设备号码
 5、int result;结果值，0成功，非0错误码
 * @constructor
 */
function ConfAddDeviceAck(data) {
  if (data.result == 0) {
    Message.info("监控入会成功！");
  } else {
    Message.info("监控入会失败，错误码：" + data.result);
  }
}

//
// /**
//  * 应答通话，话机摘机应答
//  * @param agent_id
//  * @param conn 通话标识
//  * @param isVideo 是否视频应答
//  * @constructor
//  */
// function AnswerCall(agent_id, conn, isVideo) {
//   let requestHeader = setRequestHeader(1, 255, 298);
//   requestHeader["agent_id"] = agent_id;
//   requestHeader["conn"] = conn;
//   requestHeader["isVideo"] = isVideo;
//   let data = {
//     "topicName": sessionStorage.getItem("MQMyCode"),
//     "text": requestHeader
//   };
//   axios.post(Url + "/eos/communication/icp/send", data).then(function (data) {
//     if (data.status == 200) {
//       Message.success("已发起应答！");
//
//     }
//   })
// }

/**
 * 应答结果返回
 * @param data: 1、int agent_id;
 2、int conn; //通话标识
 3、int isVideo；//是否视频应答
 4、int result;结果值，0成功，非0错误码
 * @constructor
 */
function AnswerCallAck(data) {
  if (data.result == 0) {
    Message.success("应答成功！");
    store.commit('setIsDialogType', 'small');//应答成功弹小窗
    store.commit("setIsAgentSpeekList", []) // 保存之前先清空实时语音转文字内容 bug8706 author：hexinting date:2020-11-24
    // start()
  } else {
    Message.error("应答失败，错误码：" + data.result);
  }
  store.dispatch('answerCalls')
}

//
// /**
//  * 订阅无线集群群组
//  * @param agent_id
//  * @param expire 订阅时间
//  * @param groupName 群组名称
//  * @constructor
//  */
// function TalkingGroupSubcribe(agent_id, expire, groupName) {
//   let requestHeader = setRequestHeader(1, 255, 300);
//   requestHeader["agent_id"] = agent_id;
//   requestHeader["expire"] = expire;
//   requestHeader["groupName"] = groupName;
//   let data = {
//     "topicName": sessionStorage.getItem("MQMyCode"),
//     "text": requestHeader
//   };
//   axios.post(Url + "/eos/communication/icp/send", data).then(function (data) {
//     if (data.status == 200) {
//       Message.info("已发起订阅无线集群群组！");
//     }
//   })
// }

/**
 * 订阅无线集群群组结果
 * @param data: 1、int  agent_id;
 2、int expire;//订阅时间
 3、char groupName[50]
 //群组名称
 4、int result;结果值，0成功，非0为错误码
 * @constructor
 */
function TalkingGroupSubcribeAck(data) {
  if (data.result == 0) {
    Message.info("订阅无线集群群组成功！");
  } else {
    Message.info("订阅无线集群群组失败，错误码：" + data.result);
  }
}

//
// /**
//  * 监听无线集群群组
//  * @param agent_id
//  * @param groupName 群组名称
//  * @param isMonitor 是否开始监听，1开始监听，0停止监听
//  * @param isAutoSubcribe 是否自动处理订阅，1是，0否，默认1
//  * @constructor
//  */
// function TalkingGroupMonitor(agent_id, groupName, isMonitor, isAutoSubcribe) {
//   let requestHeader = setRequestHeader(1, 255, 302);
//   requestHeader["agent_id"] = agent_id;
//   requestHeader["groupName"] = groupName;
//   requestHeader["isMonitor"] = isMonitor;
//   requestHeader["isAutoSubcribe"] = isAutoSubcribe;
//   let data = {
//     "topicName": sessionStorage.getItem("MQMyCode"),
//     "text": requestHeader
//   };
//   axios.post(Url + "/eos/communication/icp/send", data).then(function (data) {
//     if (data.status == 200) {
//       if (isMonitor == 1) {
//         Message.success("已发起开始监听无线集群群组！");
//         TalkingGroupSelect(agent_id, groupName, 1);
//       } else if (isMonitor == 0) {
//         Message.success("已发起停止监听无线集群群组！");
//       }
//     }
//   })
// }

/**
 * 监听无线集群群组结果返回
 * @param data: 1、int   agent_id;
 2、  char groupName[50];
 //群组名称
 3、int isMonitor;//是否开始监听，1开始监听，0停止监听
 4、int isAutoSubcribe;//是否自动处理订阅，1是，0否，默认1
 5、int result;//结果值，0成功，非0结果码
 * @constructor
 */
function TalkingGroupMonitorAck(data) {
  if (data.result == 0) {
    Message.info("监听无线集群群组成功！");
  } else {
    Message.info("监听无线集群群组失败，错误码：" + data.result);
  }
}

//
// /**
//  * 选中/监听无线集群群组切换
//  * @param agent_id
//  * @param groupName 群组名称
//  * @param isSelect 是否选中，1选中，0取消选中
//  * @constructor
//  */
// function TalkingGroupSelect(agent_id, groupName, isSelect) {
//   let requestHeader = setRequestHeader(1, 255, 304);
//   requestHeader["agent_id"] = agent_id;
//   requestHeader["groupName"] = groupName;
//   requestHeader["isSelect"] = isSelect;
//   let data = {
//     "topicName": sessionStorage.getItem("MQMyCode"),
//     "text": requestHeader
//   };
//   axios.post(Url + "/eos/communication/icp/send", data).then(function (data) {
//     if (data.status == 200) {
//       if (isSelect == 1)
//         Message.success("已选中无线集群群组！");
//       else if (isSelect == 0)
//         Message.success("已取消选中无线集群群组！");
//     }
//   })
// }

/**
 * 选中/监听无线集群群组切换结果返回
 * @param data： 1、int   agent_id;
 2、char groupName[50];//群组名称
 3、int isSelect;//是否选中，1选中，0取消选中
 4、int result;//结果值，0成功，非0为错误码
 * @constructor
 */
function TalkingGroupSelectAck(data) {
  if (data.result == 0) {
    Message.info("选中/监听无线集群群组切换成功！");
  } else {
    Message.info("选中/监听无线集群群组切换失败，错误码：" + data.result);
  }
}

//
// /**
//  * 无线集群群组抢权/放权操作
//  * @remake 注意：
//  1、该操作的前提条件是，先顺序操作以下流程：订阅、监听、选中
//  2、抢权说话完要放权，要不然会一直占用，其他人抢不了权说话。
//  * @param agent_id
//  * @param groupName 群组名称
//  * @param isPTT 是否抢权，1抢权，0放权
//  * @constructor
//  */
// function TalkingGroupPTT(agent_id, groupName, isPTT) {
//   let requestHeader = setRequestHeader(1, 255, 306);
//   requestHeader["agent_id"] = agent_id;
//   requestHeader["groupName"] = groupName;
//   requestHeader["isPTT"] = isPTT;
//   let data = {
//     "topicName": sessionStorage.getItem("MQMyCode"),
//     "text": requestHeader
//   };
//   axios.post(Url + "/eos/communication/icp/send", data).then(function (data) {
//     if (data.status == 200) {
//       if (isPTT == 1)
//         Message.success("无线集群群组已抢权！");
//       else if (isPTT == 0)
//         Message.success("无线集群群组已放权！");
//     }
//   })
// }

/**
 * 无线集群群组抢权/放权操作结果。
 * @param data: 1、int agent_id;
 2、char groupName[50];//群组名称
 3、int isPTT;//是否抢权，1抢权，0放权
 4、int result;//结果值，0成功，非0结果码
 * @constructor
 */
function TalkingGroupPTTAck(data) {
  if (data.result == 0) {
    Message.info("选中/监听无线集群群组切换成功！");
    if (data.isPTT == 1) {
      store.commit('setGroupActive', true)
    } else {
      store.commit('setGroupActive', false)
    }
  } else {
    Message.info("选中/监听无线集群群组切换失败，错误码：" + data.result);
  }
}

//
// /**
//  * 发起混编/临时混编呼叫接口
//  * @param agent_id 坐席id
//  * @param groupNum 群组号码
//  * @param groupName 群组名称
//  * @constructor
//  */
// function MixedGroupCall(agent_id, groupNum, groupName) {
//   let requestHeader = setRequestHeader(1, 255, 308);
//   requestHeader["agent_id"] = agent_id;
//   requestHeader["groupNum"] = groupNum;
//   requestHeader["groupName"] = groupName;
//   let data = {
//     "topicName": sessionStorage.getItem("MQMyCode"),
//     "text": requestHeader
//   };
//   axios.post(Url + "/eos/communication/icp/send", data).then(function (data) {
//
//   })
// }

/**
 * 发起混编/临时混编呼叫结果返回
 * @param data: 1、int agent_id=坐席id，
 2、BSTR groupNum=群组号码
 3、BSTR groupName=群组名称
 4、int conf_id=群组呼叫标识id，小于或等于0为发起失败，大于0时发起呼叫成功，返回呼叫ID
 * @constructor
 */
function MixedGroupCallAck(data) {
  if (data.conf_id <= 0) {
    Message.info("发起混编/临时混编呼叫失败！");
    store.dispatch('groupStatusClose')
    store.dispatch('removeAgentForList')
  } else if (data.conf_id > 0) {
    Message.success("发起混编/临时混编呼叫成功，呼叫ID为：" + data.conf_id);
    store.dispatch('groupStatusStart', data).then(() => {
      console.log(store.state.confStatus, '会议状态')
      store.dispatch('JoinConfEx')
    })
  }
  store.commit('setIsLoadShow', false);
}

/**
 * 邀请坐席加入会议通知
 * @param data: 1、int agent_id=坐席id
 2、int conf_id=会议id
 3、int isVideo=是否视频会议，1是0否
 4、BSTR confNumber=会议号码，可能为空
 * @returns {*}
 * @constructor
 */
function ConfInviteNotify(data) {
  return data;
}

//
// /**
//  * 坐席接受/拒绝加入会议邀请,isAccept值为1接受，0拒绝
//  * @param agent_id 坐席id
//  * @param conf_id 会议id
//  * @param isAccept 是否接受邀请，1接受，0拒绝
//  * @param confNumber 会议号码，可为空
//  * @constructor
//  */
// function ConfAcceptInvite(agent_id, conf_id, isAccept, confNumber) {
//   let requestHeader = setRequestHeader(1, 255, 311);
//   requestHeader["agent_id"] = agent_id;
//   requestHeader["conf_id"] = conf_id;
//   requestHeader["isAccept"] = isAccept;
//   requestHeader["confNumber"] = confNumber;
//   let data = {
//     "topicName": sessionStorage.getItem("MQMyCode"),
//     "text": requestHeader
//   };
//   axios.post(Url + "/eos/communication/icp/send", data).then(function (data) {
//
//   })
// }

/**
 * 坐席接受/拒绝加入会议邀请操作结果返回
 * @param data:  1、int agent_id=坐席id
 2、int conf_id=会议id
 3、int isAccept=是否接受邀请，1接受，0拒绝
 4、BSTR confNumber=会议号码，可为空
 5、Int ackRet=操作结果码，0成功，非0失败
 * @constructor
 */
function ConfAcceptInviteAck(data) {
  alert()
  if (data.conf_id == 0) {
    Message.info("坐席接受/拒绝加入会议成功！");
  } else {
    Message.info("坐席接受/拒绝加入会议失败!");
  }
}

/**
 * 通话过程中，自动语音识别结果返回
 * @param data: 1、int agent_id=坐席id
 2、int conn=通话标识
 3、int isAgentSpeek=是否是坐席说好，1是0否
 4、BSTR speekerNum=说话方号码
 5、BSTR asrTxt=说话内容识别出的文字
 * @returns {*}
 * @constructor
 */
// console.log(store.getters.getTxtNotif);
function AsrTxtNotify(data) {
  console.log('------实时语音转文字-----')
  let asrTxt = store.getters.getTxtNotif; //旧的，不动它
  let textContent = store.getters.getIsAgentSpeekList;//获取到实时转语音存储起来的
  // console.log(asrTxt)
  console.log(textContent)
  if (data.isAgentSpeek == 1) {
    asrTxt.push(`坐席:${data.asrTxt}`);
    textContent.push({  //坐席
      text: data.asrTxt,
      from: 1
    })
  } else {
    textContent.push({  //通话人
      text: data.asrTxt,
      from: 2
    })
    asrTxt.push(`${data.speekerNum}:${data.asrTxt}`);
  }
  store.commit("setTxtNotify", asrTxt)
  store.commit("setIsAgentSpeekList", textContent)
  // let data1 = {
  //   "id": store.getters.getCallHistoryId,
  //   "remark":store.getters.getTxtNotif1
  // }
  // axios.post(Url + "/eos/history/updateRecordPhoneHisory", data1).then(function (res) {
  //   if (res.data.errorcode != 0) {
  //     Message.error(res.data.msg);
  //     return;
  //   }
  // })
}

//
// /**
//  * 代接正在振铃的坐席的来电
//  * @param agent_id 坐席id
//  * @param conn 正在通话的通话ID（备用）
//  * @param agentTag 代接的坐席工号,
//  * @param agentNum 代接的坐席号码
//  * @constructor
//  */
// function SnatchPickup(agent_id, conn, agentTag, agentNum) {
//   let requestHeader = setRequestHeader(1, 255, 314);
//   requestHeader["agent_id"] = agent_id;
//   requestHeader["conn"] = conn;
//   requestHeader["agentTag"] = agentTag;
//   requestHeader["agentNum"] = agentNum;
//   let data = {
//     "topicName": sessionStorage.getItem("MQMyCode"),
//     "text": requestHeader
//   };
//   axios.post(Url + "/eos/communication/icp/send", data).then(function (data) {
//
//   })
// }

/**
 * 代接正在振铃的坐席的来电结果返回
 * @param data: int agent_id=坐席id,
 int conn=正在通话的通话ID（备用）,
 BSTR agentTag=代接的坐席工号,
 BSTR agentNum=代接的坐席号码
 Int ret = 结果，0成功，非0失败原因
 * @constructor
 */
function SnatchPickupAck(data) {
  if (data.ret == 0) {
    store.commit("setIsmManyCallsList", []) //代接成功清除
    Message.info("代接正在振铃的坐席的来电成功！");
  } else {
    Message.info("代接正在振铃的坐席的来电失败，失败原因为：" + data.ret);
  }
}

//
// /**
//  * 视频会议启动/停止辅流
//  * @param agent_id 坐席id
//  * @param confId 会议id
//  * @param isStart 是否启动，1启动，0停止
//  * @constructor
//  */
// function ConfStartData(agent_id, confId, isStart) {
//   let requestHeader = setRequestHeader(1, 255, 316);
//   requestHeader["agent_id"] = agent_id;
//   requestHeader["confId"] = confId;
//   requestHeader["isStart"] = isStart;
//   let data = {
//     "topicName": sessionStorage.getItem("MQMyCode"),
//     "text": requestHeader
//   };
//   axios.post(Url + "/eos/communication/icp/send", data).then(function (data) {
//
//   })
// }

/**
 * 视频会议启动/停止辅流结果通知
 * @param data: int agent_id=坐席id,
 int confId=会议id,
 int isStart=是否启动，1启动，0停止
 Int ret = 结果，0成功，非0失败原因
 * @constructor
 */
function ConfStartDataAck(data) {
  if (data.ret == 0) {
    Message.info("视频会议启动/停止辅流成功！");
  } else {
    Message.info("视频会议启动/停止辅流失败，失败原因为：" + data.ret);
  }
}

//
// /**
//  * 设置视频源
//  * @remake 设置一个与会者成员选看另一个与会者成员/锁定视频源
//  * @param agent_id 坐席id,
//  * @param confId 会议id
//  * @param isLock 是否启动，1启动，0停止
//  * @param dstMember 目的成员
//  * @param srcMember 视频源成员
//  * @constructor
//  */
// function ConfSetVideoSource(agent_id, confId, isLock, dstMember, srcMember) {
//   let requestHeader = setRequestHeader(1, 255, 318);
//   requestHeader["agent_id"] = agent_id;
//   requestHeader["confId"] = confId;
//   requestHeader["isLock"] = isLock;
//   requestHeader["dstMember"] = dstMember;
//   requestHeader["srcMember"] = srcMember;
//   let data = {
//     "topicName": sessionStorage.getItem("MQMyCode"),
//     "text": requestHeader
//   };
//   axios.post(Url + "/eos/communication/icp/send", data).then(function (data) {
//
//   })
// }

/**
 * 设置一个与会者成员选看另一个与会者成员/锁定视频源结果通知
 * @param data: int agent_id=坐席id,
 int confId=会议id,
 int isLock=是否启动，1启动，0停止
 BSTR dstMember=目的成员,
 BSTR srcMember=视频源成员，
 Int ret = 结果，0成功，非0失败原因
 * @constructor
 */
function ConfSetVideoSourceAck(data) {
  if (data.ret == 0) {
    Message.info("设置一个与会者成员选看另一个与会者成员/锁定视频源成功！");
  } else {
    Message.info("设置一个与会者成员选看另一个与会者成员/锁定视频源失败，失败原因为：" + data.ret);
  }
}

//
// /**
//  * 黑名单管理，可1添加，0删除,2清空
//  * @param agent_id 坐席id
//  * @param phoneNumber 号码列表，以逗号隔开，最多支持32个21个数字的号码串
//  * @param iControl 控制命令，1添加，0删除,2清空
//  * @constructor
//  */
// function OperateBlackList(agent_id, phoneNumber, iControl) {
//   let requestHeader = setRequestHeader(1, 255, 320);
//   requestHeader["agent_id"] = agent_id;
//   requestHeader["phoneNumber"] = phoneNumber;
//   requestHeader["iControl"] = iControl;
//   let data = {
//     "topicName": sessionStorage.getItem("MQMyCode"),
//     "text": requestHeader
//   };
//   axios.post(Url + "/eos/communication/icp/send", data).then(function (data) {
//
//   })
// }

/**
 * 黑名单管理结果返回
 * @param data: int  agent_id=坐席id;
 char  phoneNumber[21*32]=号码列表，以逗号隔开，最多支持32个21个数字的号码串;
 unsigned char  iControl;//控制命令，1添加，0删除,2清空
 Int iRet = 结果码，0成功，非0错误码
 * @constructor
 */
function OperateBlackListAck(data) {
  if (data.iRet == 0) {
    Message.info("黑名单管理成功！");
  } else {
    Message.info("黑名单管理失败，错误码为：" + data.iRet);
  }
}

//
// /**
//  * 坐席二次拨号，可多次调用，需间隔一秒以上
//  * @param agent_id 坐席id
//  * @param dtmfNum 二次拨号号码
//  * @constructor
//  */
// function AgentSendDtmf(agent_id, dtmfNum) {
//   let requestHeader = setRequestHeader(1, 255, 322);
//   requestHeader["agent_id"] = agent_id;
//   requestHeader["dtmfNum"] = dtmfNum;
//   let data = {
//     "topicName": sessionStorage.getItem("MQMyCode"),
//     "text": requestHeader
//   };
//   axios.post(Url + "/eos/communication/icp/send", data).then(function (data) {
//
//   })
// }

/**
 * 坐席二次拨号结果返回
 * @param data: Int agent_id=坐席id;
 char dtmfNum[21] = 二次拨号号码;
 Int iRet=结果返回，0成功，非0为错误码
 * @constructor
 */
function AgentSendDtmfAck(data) {
  if (data.iRet == 0) {
    Message.info("坐席二次拨号成功！");
  } else {
    Message.info("坐席二次拨号失败，错误码为：" + data.iRet);
  }
}

//
// /**
//  * 调用加入会议接口，传入号码及号码类型，后台呼通加入会议，结果通过JoinConfEx2Ack回调返回
//  * @param agent_id 发起操作的坐席id
//  * @param conf_id 会议id
//  * @param conn 与坐席通话的通话标识id，暂不可用
//  * @param phoneNumber 要加入会议的号码
//  * @param numType 要加入会议的号码类型
//  * @param displayName 成员在会议中的显示名称
//  * @constructor
//  */
// function JoinConfEx3(agent_id, conf_id, conn, phoneNumber, numType, displayName,call) {
//   let requestHeader = setRequestHeader(1, 255, 324);
//   requestHeader["agent_id"] = agent_id;
//   requestHeader["conf_id"] = conf_id;
//   requestHeader["conn"] = conn;
//   requestHeader["phoneNumber"] = phoneNumber;
//   requestHeader["numType"] = numType;
//   requestHeader["displayName"] = displayName;
//   let data = {
//     "topicName": sessionStorage.getItem("MQMyCode"),
//     "text": requestHeader
//   };
//   axios.post(Url + "/eos/communication/icp/send", data).then(function (data) {
//     if (data.data.errorcode == 0) {
//       Message.success("已发起加入会议！");
//       typeof call ==='function'&&call()
//
//     }
//   })
//
// }

/**
 * 加入会议接口回调返回 325
 * @param data: 1、agent_id=发起操作的坐席id
 2、 long conf_id=会议id
 3、long conn=与坐席通话的通话标识id，暂不可用
 4、int status = 接口调用结果，0成功，非0为失败原因
 5、BSTR phoneNumber
 =要加入会议的号码
 6、long numType=要加入会议的号码类型
 7、BSTR displayName=成员在会议中的显示名称
 * @constructor
 */
function JoinConfEx3Ack(data) {
  if (data.status == 0) {
    console.log(data)
    Message.success("加入会议成功！");
  } else {
    Message.error("加入会议失败，失败原因为：" + data.status);
  }
}

//
// /**
//  * 坐席重新加入会议
//  * @remake 一般情况下，坐席掉线但是会议没有结束的情况下，调用次接口重新加入会议
//  * @param agent_id 发起操作的坐席id
//  * @param conf_id 会议id
//  * @constructor
//  */
// function AgentAccessConf(agent_id, conf_id) {
//   let requestHeader = setRequestHeader(1, 255, 326);
//   requestHeader["agent_id"] = agent_id;
//   requestHeader["conf_id"] = conf_id;
//   let data = {
//     "topicName": sessionStorage.getItem("MQMyCode"),
//     "text": requestHeader
//   };
//   axios.post(Url + "/eos/communication/icp/send", data).then(function (data) {
//
//   })
// }

/**
 * 坐席重新加入会议结果返回
 * @param data: 1、agent_id=发起操作的坐席id
 2、 long conf_id=会议id
 3、int iRet=调用结果，0正确，非0为错误码
 * @constructor
 */
function AgentAccessConfAck(data) {
  if (data.iRet == 0) {
    Message.info("坐席重新加入会议成功！");
  } else {
    Message.info("坐席重新加入会议失败，错误码为：" + data.iRet);
  }
}

/**
 * 扫描仪结果
 * @param data:
 * 1、path=保存的文件路径
 2、result=操作结果0代表调用函数成功，-1失败
 * @constructor
 */
function FaxScanAck(data) {
  if (data.result == 0) {
    store.commit('setfaxScanStatus', 2);
    store.commit('setscanFilePath', path);
    Message.success("扫描成功");
  } else {
    Message.error("扫描失败");
    store.commit('setfaxScanStatus', 3);
  }
}

/***
 * 移动终端gis位置上报（icp20.0或者pwi版本使用）
 * @param data
 * @constructor
 */
function GisNotify(data) {
  //for ecs
  //loadSingleEquipmentGt(data);
}

//
// /**
//  * 单兵设备返回
//  * @param
//  * @constructor
//  */
// var singleEquipmentMaker = null
// var vectorLayertest = null;
// function loadSingleEquipmentGt(data) {
//     // 接收到数据后清空图层
//     if (singleEquipmentMaker) {
//         dispatchMap.removeLayer(singleEquipmentMaker)
//         singleEquipmentMaker.destroy()
//     }
//     if(vectorLayertest){
//         dispatchMap.removeLayer(vectorLayertest)
//         vectorLayertest.destroy()
//     }
//     var size = new SuperMap.Size(38, 38); // 标注大小
//     var offset = new SuperMap.Pixel(-(size.w / 2.4), -(size.h) * 1.05); //标注偏移角度
//     var pointStyle = new SuperMap.Icon('image/images/single.png', size, offset); // 标注样式
//         var styleText = {//设置文字的样式
//             label:data.devCode,
//             fontSize: 14,
//             fontWeight: 'bold',
//             fontColor: 'white'
//         };
//         var singleLonlat = [data.longtitude,data.latitude]
//         pointGeo = new SuperMap.Geometry.Point(singleLonlat[0],singleLonlat[1]);
//         pointFeature = new SuperMap.Feature.Vector(pointGeo);
//         pointFeature.style = styleText;
//         //将带有文字标注的点对象添加到vectorLayer上
//         vectorLayertest = new SuperMap.Layer.Vector("标注");
//         vectorLayertest.addFeatures(pointFeature);
//         dispatchMap.addLayer(vectorLayertest);
//
//         singleEquipmentMaker = new SuperMap.Layer.Markers("创建单兵设备点图层");
//         var singlePoint = [] // 经纬度数组
//         singlePoint.push(data.longtitude, data.latitude)
//         singleEquipmentMaker.addMarker(new SuperMap.Marker(new SuperMap.LonLat(singlePoint), pointStyle)); // 图层添加点
//         dispatchMap.addLayer(singleEquipmentMaker) // 添加单兵设备点图层
// }

export default {
  // getUser,
  // loadSDK,
  // CtiConfig,
  AgentLoginAck,
  //  AgentChangeStatus,
  // MakeCall,
  MakeCallAck,
  //  MakeCallEx,
  // DropCall,
  //  HeldCall,
  //  AlternateCall,
  //  TransferCall,
  //  PlayRecordFile,
  // CreateConf,
  //  DeleteConf,
  //  JoinConf,
  // RemoveFromConf,
  // RequestConfMember,
  // RequestConf,
  // OperateConfMember,
  // SendFax,
  CallReleased,
  HeldCallAck,
  AlternateCallAck,
  TransferCallAck,
  CreateConfAck,
  DeleteConfAck,
  JoinConfAck,
  ConfMemberDetail,
  PortStatusChanged,
  UpdateCallingNumber,
  BroadcastCallOffered,
  FaxSent,
  FaxReceived,
  OperateConfMemberAck,
  // TransferCallOneKey,
  TransferCallOneKeyAck,
  // ThreeWayConf,
  ThreeWayConfAck,
  //CreateConfEx,
  CreateConfExAck,
  // JoinConfEx,
  // JoinConfEx2Ack,
  ConfMemberStatus,
  //  RemoveFromConfEx,
  RemoveFromConfExAck,
  //  OperateConfMemberEx,
  OperateConfMemberExAck,
  // SetVideoWindow,
  SetVideoWindowAck,
  // ConfBoardCastMember,
  ConfBoardCastMemberAck,
  // ConfWatchMember,
  ConfWatchMemberAck,
  // ICPQueryGroupInfo,
  ICPQueryGroupInfoAck,
  // ICPQueryDeviceInfo,
  ICPQueryDeviceInfoAck,
  // ICPStartRealPlay,
  ICPStartRealPlayAck,
  // ICPStopRealPlay,
  ICPStopRealPlayAck,
  // ICPPTZDevice,
  ICPPTZDeviceAck,
  // ConfAddDevice,
  ConfAddDeviceAck,
  // AnswerCall,
  AnswerCallAck,
  //TalkingGroupSubcribe,
  TalkingGroupSubcribeAck,
  //TalkingGroupMonitor,
  TalkingGroupMonitorAck,
  //TalkingGroupSelect,
  TalkingGroupSelectAck,
  //TalkingGroupPTT,
  TalkingGroupPTTAck,
  // MixedGroupCall,
  MixedGroupCallAck,
  ConfInviteNotify,
  //  ConfAcceptInvite,
  ConfAcceptInviteAck,
  AsrTxtNotify,
  // SnatchPickup,
  SnatchPickupAck,
  //  ConfStartData,
  ConfStartDataAck,
  // ConfSetVideoSource,
  ConfSetVideoSourceAck,
  //  OperateBlackList,
  OperateBlackListAck,
  // AgentSendDtmf,
  AgentSendDtmfAck,
  // JoinConfEx3,
  JoinConfEx3Ack,
  //AgentAccessConf,
  AgentAccessConfAck,
  InsertPhoneCdr,
  // EMTAgentClose,
  FaxScanAck,
  GisNotify
}
