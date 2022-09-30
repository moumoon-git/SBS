import icp19 from './icpInterface19.0'
import ca from "element-ui/src/locale/lang/ca";
import mqtt from 'mqtt';
import axios from "axios";

let client;
// 订阅主题
let ICP_VERSION = window.g.HWICP_Version;
let usernames = sessionStorage.getItem("displayname");
let topic_name;
let apiUrl = window.g.ApiUrl;
let url = window.g.MQTT_url;
let machineId;

function connect_server() {
  // 终端ID，可以随机，可以手动设定
  let clientID = "client-" + (Math.floor(Math.random() * 100000));
  // Activemq中间件地址
  client = new Paho.MQTT.Client(url, Number(61614), clientID);

  // 连接
  client.connect({
    // 根据需要选择
    // userName: user,
    // password: password,
    // 连接成功
    userName: "admin",
    password: "admin",
    onSuccess: onConnect,
    // 连接出错
    onFailure: onFailure,
  });

  // client.onConnect = onConnect;
  client.onMessageArrived = onMessageArrived;
  client.onConnectionLost = onConnectionLost;
}

// 显示输出内容
// function ws_logs(str) {
//   $("#ws_log").append(str + "<br>");
// }

//获取机器码
function getMachineId() {
  let data = {};
  axios.post(apiUrl + '/eos/event/getIp', data).then(res => {
    if (res.errorcode != 0) {
      machineId = res.data.data;
    }
  })
}

// 建立连接
function onConnect() {
  getMachineId();
  console.log("连接成功")
  // ws_logs("正在建立连接");
  // 订阅Topic
  if (ICP_VERSION == "HWICP-19.0") {
    topic_name = "EcsToEos";
    client.subscribe(topic_name);
  } else if (ICP_VERSION == "HWICP-20.0") {
    topic_name = "EcsToEos";
    client.subscribe(topic_name);
  }


}

// 连接失败
function onFailure(failure) {
  onConnect();
}

// 监听消息
function onMessageArrived(msg) {
  console.log(msg);
  let message = JSON.parse(msg.payloadString);
  if (message.type == "requestAgent") {
    let sendMsg = {
      type: "responseAgent",
      id: machineId,
    };
    sendMsg['agent'] = {
      usernames: sessionStorage.getItem("displayname"),
      agent_id: sessionStorage.getItem("agent_id"),
      iddcode: sessionStorage.getItem('seat'),
    };
    sendMsg['cmd'] = {
      SubCmd: "255",
      Tag: "330"
    };
    send_msg(sendMsg);
  }
  // let message = JSON.parse(msg.payloadString);
  // console.log(message);
  // console.log(message.cmd);
  // if (message.cmd.SubCmd === 255){
  //   switch (message.cmd.Tag) {
  //     case "274": {
  //       icp19.ThreeWayConfAck(message);
  //       break;
  //     }
  //     case "272": {
  //       icp19.CreateConfExAck(message);
  //       break;
  //     }
  //     case "277": {
  //       icp19.JoinConfEx2Ack(message);
  //       break;
  //     }
  //     case "275": {
  //       icp19.ConfMemberStatus(message);
  //       break;
  //     }
  //     case "264": {
  //       icp19.RemoveFromConfExAck(message);
  //       break;
  //     }
  //     case "279": {
  //       icp19.OperateConfMemberExAck(message);
  //       break;
  //     }
  //     case "281": {
  //       icp19.SetVideoWindowAck(message);
  //       break;
  //     }
  //     case "283": {
  //       icp19.ConfBoardCastMemberAck(message);
  //       break;
  //     }
  //     case "285": {
  //       icp19.ConfWatchMemberAck(message);
  //       break;
  //     }
  //     case "287": {
  //       icp19.ICPQueryGroupInfoAck(message);
  //       break;
  //     }
  //     case "289": {
  //       icp19.ICPQueryDeviceInfoAck(message);
  //       break;
  //     }
  //     case "291": {
  //       icp19.ICPStartRealPlayAck(message);
  //       break;
  //     }
  //     case "293": {
  //       icp19.ICPStopRealPlayAck(message);
  //       break;
  //     }
  //     case "297": {
  //       icp19.ICPPTZDeviceAck(message);
  //       break;
  //     }
  //     case "295": {
  //       icp19.ConfAddDeviceAck(message);
  //       break;
  //     }
  //     case "299": {
  //       icp19.AnswerCallAck(message);
  //       break;
  //     }
  //     case "301": {
  //       icp19.TalkingGroupSubcribeAck(message);
  //       break;
  //     }
  //     case "303": {
  //       icp19.TalkingGroupMonitorAck(message);
  //       break;
  //     }
  //     case "305": {
  //       icp19.TalkingGroupSelectAck(message);
  //       break;
  //     }
  //     case "307": {
  //       icp19.TalkingGroupPTTAck(message);
  //       break;
  //     }
  //     case "309": {
  //       icp19.MixedGroupCallAck(message);
  //       break;
  //     }
  //     case "310": {
  //       icp19.ConfInviteNotify(message);
  //       break;
  //     }
  //     case "312": {
  //       icp19.ConfAcceptInviteAck(message);
  //       break;
  //     }
  //     case "313": {
  //       icp19.AsrTxtNotify(message);
  //       break;
  //     }
  //     case "315": {
  //       icp19.AsrTxtNotify(message);
  //       break;
  //     }
  //     case "317": {
  //       icp19.ConfStartDataAck(message);
  //       break;
  //     }
  //     case "319": {
  //       icp19.ConfSetVideoSourceAck(message);
  //       break;
  //     }
  //     case "321": {
  //       icp19.OperateBlackListAck(message);
  //       break;
  //     }
  //     case "323": {
  //       icp19.AgentSendDtmfAck(message);
  //       break;
  //     }
  //     case "325": {
  //       icp19.JoinConfEx3Ack(message);
  //       break;
  //     }
  //     case "327": {
  //       icp19.AgentAccessConfAck(message);
  //       break;
  //     }
  //     default: break;
  //   }
  // }else {
  //   switch (message.cmd.SubCmd) {
  //     case "2": {
  //       icp19.AgentLoginAck(message);
  //       break;
  //     }
  //     case "6": {
  //       icp19.MakeCallAck(message);
  //       break;
  //     }
  //     case "17": {
  //       icp19.HeldCallAck(message);
  //       break;
  //     }
  //     case "18": {
  //       icp19.AlternateCallAck(message);
  //       break;
  //     }
  //     case "19": {
  //       icp19.TransferCallAck(message);
  //       break;
  //     }
  //     case "25": {
  //       icp19.CreateConfAck(message);
  //       break;
  //     }
  //     case "31": {
  //       icp19.DeleteConfAck(message);
  //       break;
  //     }
  //     case "27": {
  //       icp19.JoinConfAck(message);
  //       break;
  //     }
  //     case "35": {
  //       icp19.ConfMemberDetail(message);
  //       break;
  //     }
  //     case "3": {
  //       icp19.PortStatusChanged(message);
  //       break;
  //     }
  //     case "15": {
  //       icp19.PortStatusChanged(message);
  //       break;
  //     }
  //     case "13": {
  //       icp19.BroadcastCallOffered(message);
  //       break;
  //     }
  //     case "122": {
  //       icp19.FaxSent(message);
  //       break;
  //     }
  //     case "120": {
  //       icp19.FaxReceived(message);
  //       break;
  //     }
  //     case "41": {
  //       icp19.OperateConfMemberAck(message);
  //       break;
  //     }
  //     case "43": {
  //       icp19.TransferCallOneKeyAck(message);
  //       break;
  //     }
  //
  //     default: break;
  //   }
  // }
}

// 连接中断
function onConnectionLost(responseObject) {
  if (responseObject.errorCode !== 0) {
    // client.clientId 可以获取到ClientID
    console.log(client.clientId + ": " + responseObject.errorCode);
  }
}

// 主动断开连接
function dis_connect() {
  client.disconnect();
  // ws_logs("断开连接");
  return false;
}

// 发送消息
function send_msg(mqtt_msg_send) {
  if (mqtt_msg_send) {
    let message = new Paho.MQTT.Message(JSON.stringify(mqtt_msg_send));
    message.destinationName = 'EosToEcs';
    // 发送mqtt消息
    client.send(message);
  }
  if (ICP_VERSION == "HWICP-19.0") {
    // client.disconnect();
    topic_name = "eos" + usernames;
    client.subscribe(topic_name);
  } else if (ICP_VERSION == "HWICP-20.0") {
    client.disconnect();
    topic_name = "eos-icp20.0-" + usernames;
    client.subscribe(topic_name);
  }
  return false;
}

export default {
  connect_server,
  dis_connect,
  send_msg
}
