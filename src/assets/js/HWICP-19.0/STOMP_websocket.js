import icp19 from './icpInterface19.0'
import {Message} from "element-ui";
import axios from 'axios';
import store from '../../store/index';
import router from '../../../router/index'
const Url = window.g.ApiUrl;
const MQurl=window.g.MQurl;
let client;
// let queue_name= "eos"+sessionStorage.getItem('displayname');

function connect_server() {
  // let ws = new WebSocket("ws://192.168.1.160:61614");
  // let url = "ws://10.10.180.37:61614";
  // let url = "ws://10.123.192.13:61614";
  client = Stomp.client(MQurl);
  // client.heartbeat.outgoing = 0; // 客户端不发送
  // client.heartbeat.incoming = 10000;     // 客户端每10s接收一次数据从服务器

  let callbackMSG = function(message) {
    // console.log(message);
    console.log('message1: ',message)
    if (message.body) {
      onMessageArrived(message.body);
      // Message("got message with body " + message.body)
    } else {
      Message("got empty message");
    }
  };

  let connect_callback = function(frame) {
    let queue_name= "eos"+sessionStorage.getItem('displayname');
    client.subscribe('/topic/'+queue_name, callbackMSG);
  };

  let error_callback = function(error) {
    // alert(error.headers.message);
    console.log(error);
    setTimeout(client.connect('user','Sinvieemt!@34', connect_callback,error_callback),1000)
  };

  client.connect('user','Sinvieemt!@34', connect_callback,error_callback);

}

// 建立连接
// function onConnect() {
//   // ws_logs("正在建立连接");
//   console.log(topic_name);
//   // 订阅Topic
//   client.subscribe(topic_name, onMessageArrived, onFailure);
// }

// 连接失败
// function onFailure() {
//   console.log("连接失败！正在重新连接!");
//   onConnect();
// }
//ECS消息发送
function SendMessageToECS(message){
  let data = {
    "topicName": "ecs"+sessionStorage.getItem('displayname'),
    "text": message
  };
  axios.post(Url + "/eos/communication/icp/send", data).then(function (data) {
    if(data.status == 200)
      console.log("ECS消息发送成功："+message);
  })
}
// 监听消息
function onMessageArrived(msg) {
  let message = JSON.parse(msg);
  console.log(message)
  console.log(message.cmd.Tag==289)
  // SendMessageToECS(message)
  if (message.cmd.SubCmd === "255"|| message.cmd.SubCmd === 255) {
    switch (message.cmd.Tag) {
      case 0: {
        //创建音视频会议，自动呼叫成员号码，呼通接入会议
        // router.push({path: '/icpVideo'});
        icp19.CreateConfEx(message.agent_id,message.memberNum,message.numType);
        break;
      }
      case "274": {
        //三方通话请求结果返回
        icp19.ThreeWayConfAck(message);
        break;
      }
      case "272": {
        //创建音视频会议结果
        icp19.CreateConfExAck(message);
        break;
      }
      case "277": {
        //加入会议接口回调
        icp19.JoinConfEx2Ack(message);
        break;
      }
      case "275": {
        //会议成员状态返回
        icp19.ConfMemberStatus(message);
        break;
      }
      case "264": {
        //电话会议移出成员结果返回
        icp19.RemoveFromConfExAck(message);
        break;
      }
      case "279": {
        //设置会议成员禁言/发言 返回结果
        icp19.OperateConfMemberExAck(message);
        break;
      }
      case "281": {
        //设置视频会议、视频电话通话视频窗口结果返回
        icp19.SetVideoWindowAck(message);
        break;
      }
      case "283": {
        //广播/取消广播调用接口结果返回
        icp19.ConfBoardCastMemberAck(message);
        break;
      }
      case "285": {
        //选看视频会议成员画面结果
        icp19.ConfWatchMemberAck(message);
        break;
      }
      case "287": {
        //查询资源分组结果返回
        icp19.ICPQueryGroupInfoAck(message);
        break;
      }
      case 289||"289": {
        //查询设备信息结果返回
        icp19.ICPQueryDeviceInfoAck(message);
        break;
      }
      case "290"||290: {
        //根据摄像头号码，在指定窗口预览视频
        icp19.ICPStartRealPlay(message);
        break;
      }
      case "291": {
        //预览摄像头视频结果返回
        icp19.ICPStartRealPlayAck(message);
        break;
      }
      case "293": {
        //停止播放视频结果
        icp19.ICPStopRealPlayAck(message);
        break;
      }
      case "297": {
        //云台控制结果返回
        icp19.ICPPTZDeviceAck(message);
        break;
      }
      case "295": {
        //监控入会结果返回
        icp19.ConfAddDeviceAck(message);
        break;
      }
      case "299": {
        //应答结果返回
        icp19.AnswerCallAck(message);
        break;
      }
      case "301": {
        //订阅无线集群群组结果
        icp19.TalkingGroupSubcribeAck(message);
        break;
      }
      case "303": {
        //监听无线集群群组结果返回
        icp19.TalkingGroupMonitorAck(message);
        break;
      }
      case "305": {
        //选中/监听无线集群群组切换结果
        icp19.TalkingGroupSelectAck(message);
        break;
      }
      case "307": {
        //无线集群群组抢权/放权操作结果
        icp19.TalkingGroupPTTAck(message);
        break;
      }
      case "309": {
        //发起混编/临时混编呼叫结果返回
        icp19.MixedGroupCallAck(message);
        break;
      }
      case "310": {
        //邀请坐席加入会议通知
        icp19.ConfInviteNotify(message);
        break;
      }
      case "312": {
        //坐席接受/拒绝加入会议邀请操作结果返回
        icp19.ConfAcceptInviteAck(message);
        break;
      }
      case "313": {
        //通话过程中，自动语音识别结果返回
        icp19.AsrTxtNotify(message);
        break;
      }
      case "315": {
        //代接正在振铃的坐席的来电结果返回
        icp19.SnatchPickupAck(message);
        break;
      }
      case "317": {
        //视频会议启动/停止辅流结果通知
        icp19.ConfStartDataAck(message);
        break;
      }
      case "319": {
        //设置一个与会者成员选看另一个与会者成员/锁定视频源结果通知
        icp19.ConfSetVideoSourceAck(message);
        break;
      }
      case "321": {
        //黑名单管理结果返回
        icp19.OperateBlackListAck(message);
        break;
      }
      case "323": {
        //坐席二次拨号结果返回
        icp19.AgentSendDtmfAck(message);
        break;
      }
      case "325": {
        //加入会议接口回调返回
        icp19.JoinConfEx3Ack(message);
        break;
      }
      case "327": {
        //坐席重新加入会议结果返回
        icp19.AgentAccessConfAck(message);
        break;
      }
      default:
        break;
    }
  } else {
    switch (message.cmd.SubCmd) {
      case 0: {
        store.commit("setIsJumpToIcpPhone",true);
        icp19.MakeCall(message.agent_id,message.called,message.iddcode);
        break;
      }
      case "2": {
        icp19.AgentLoginAck(message);
        break;
      }
      case "6": {
        icp19.MakeCallAck(message);
        break;
      }
      case "17": {
        icp19.HeldCallAck(message);
        break;
      }
      case "18": {
        icp19.AlternateCallAck(message);
        break;
      }
      case "19": {
        icp19.TransferCallAck(message);
        break;
      }
      case "25": {
        icp19.CreateConfAck(message);
        break;
      }
      case "31": {
        icp19.DeleteConfAck(message);
        break;
      }
      case "27": {
        icp19.JoinConfAck(message);
        break;
      }
      case "35": {
        icp19.ConfMemberDetail(message);
        break;
      }
      case "3": {
        icp19.PortStatusChanged(message);
        break;
      }
      case "15": {
        icp19.UpdateCallingNumber(message);
        break;
      }
      case "13": {
        icp19.BroadcastCallOffered(message);
        break;
      }
      case "122": {
        icp19.FaxSent(message);
        break;
      }
      case "120": {
        icp19.FaxReceived(message);
        break;
      }
      case "41": {
        icp19.OperateConfMemberAck(message);
        break;
      }
      case "43": {
        icp19.TransferCallOneKeyAck(message);
        break;
      }
      case "229": {
        icp19.InsertPhoneCdr(message);
        break;
      }
      default:
        break;
    }
  }
}

// 连接中断
// function onConnectionLost(responseObject) {
//   if (responseObject.errorCode !== 0) {
//     // client.clientId 可以获取到ClientID
//     console.log(client.clientId + ": " + responseObject.errorCode);
//   }
// }

// 主动断开连接
function dis_connect() {
  client.disconnect();
  return false;
}


export default {
  connect_server,
  dis_connect,
}
