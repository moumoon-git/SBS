import { Message, MessageBox, Loading } from "element-ui";
import axios from "axios";
import router from "../../router/index.js";
import SockJS from 'sockjs-client'
import Stomp from 'stompjs'
const root = window.g.ApiUrl;
console.log(root);

let stompClient;

//获取localStorage
export function getlocalStorage(key) {
  var result = localStorage.getItem(key);
  return result;
}

//设置localStorage,增加到vue实例方便全局调用
export function setlocalStorage(key, value) {
  localStorage.setItem(key, value);
}

//删除localStorage
export function dellocalStorage(key) {
  localStorage.removeItem(key);
}
let loading; //请求数据的加载
function startLoading() {
  loading = Loading.service({
    lock: true,
    text: "",
    background: "rgba(0, 0, 0, 0)",
    spinner: "el-icon-loading"
  });
}
function endLoading() {
  loading.close();
}
const instance = axios.create({
  baseURL: root,
  headers: {
    "Content-Type": "application/json; charset=utf-8",
    // 把token捞出来
    Authorization: localStorage.getItem("token")
      ? localStorage.getItem("token")
      : ""
  },
  withCredentials: true, // 携带cookie凭证
  responseType: "json" // 返回数据类型
});

// http request 拦截器
instance.interceptors.request.use(
  config => {
    if (
      config.url.indexOf("add") > 0 ||
      config.url.indexOf("update") > 0 ||
      config.url.indexOf("setParams") > 0
    ) {
      startLoading();
      setTimeout(function() {
        endLoading();
      }, 100);
    }
    return config;
  },
  err => {
    return Promise.reject(err);
  }
);

// http response 拦截器
let MessageBoxshow = true;
instance.interceptors.response.use(
  response => {
    let modularShow = sessionStorage.getItem("modularShow");
    if (modularShow) {
      return response;
    } else {
      let type = response.data.errorcode;
      if (
        type == "10002" ||
        type == "10004" ||
        type == "10006" ||
        type == "10009"
      ) {
        if (MessageBoxshow) {
          dellocalStorage("userName");
          sessionStorage.removeItem("modularShow");
          MessageBox.alert(response.data.msg, "提示", {
            confirmButtonText: "确定",
            callback: () => {
              MessageBoxshow = true;
              if (window.g.isUserOauth2) {
                window.location.href = window.g.oauth2Url;
              } else if (window.g.singleLoginPingAn) {
                window.location.href = window.g.singleLoginPingAnUrl;
              } else {
                router.replace({
                  path: "/login",
                  querry: {
                    redirect: router.currentRoute.fullPath
                  }
                });
              }
            }
          });
          MessageBoxshow = false;
        }
      } else if (type == "20009") {
        Message.error(response.data.msg);
      } else if (type == "-1") {
        if(response.data.msg){
          Message.error(response.data.msg);
        }else{
          Message.error("未知错误");
        }
      } else {
        return response;
      }
    }
  },
  error => {
    // 		Message({
    // 			message: '网络错误！',
    // 			type: 'warning'
    // 		});
    return Promise.reject(error); // 返回接口返回的错误信息
  }
);

export function http(url, data = {}, CallbackReload) {
  return new Promise((resolve, reject) => {
    instance
      .post(url, data, {
        headers: {
          Authorization: localStorage.getItem("token")
            ? localStorage.getItem("token")
            : ""
        }
      })
      .then(response => {
        if (response) {
          if (response.data.errorcode == 0) {
            resolve(response.data);
          } else if (response.data.errorcode == "20004") {
            Message({
              message: "该数据已不存在！",
              type: "warning"
            });
            CallbackReload.reload();
          } else {
            Message({
              message: response.data.msg,
              type: "warning"
            });
          }
        }
      })
      .catch(error => {
        reject(error);
      });
  });
}
export function httpGet(url, params = {}, CallbackReload) {
  return new Promise((resolve, reject) => {
    instance
      .get(url, {params: params}, {
        headers: {
          Authorization: localStorage.getItem("token")
            ? localStorage.getItem("token")
            : ""
        }
      })
      .then(response => {
        if (response) {
          if (response.data.errorcode == 0) {
            resolve(response.data);
          } else if (response.data.errorcode == "20004") {
            Message({
              message: "该数据已不存在！",
              type: "warning"
            });
            CallbackReload.reload();
          } else {
            Message({
              message: response.data.msg,
              type: "warning"
            });
          }
        }
      })
      .catch(error => {
        reject(error);
      });
  });
}
//拨打电话
export function MQ(url, data = {}, CallbackReload) {
  return new Promise((resolve, reject) => {
    instance
      .post(url, data, {
        headers: {
          Authorization: localStorage.getItem("token")
            ? localStorage.getItem("token")
            : ""
        }
      })
      .then(response => {
        if (response) {
          resolve(response.data);
        }
      })
      .catch(error => {
        reject(error);
      });
  });
}
// 重置表单为空表单
function resetForm(form) {
  for (let i in form) {
    form[i] = null;
  }
}

// 将联系人对象数组转换为联系人id数组
function transformToIds(objects) {
  let array = [];
  for (let i in objects) {
    array.push(objects[i].id);
  }
  return array;
}

/**
 * 删除数据时，调整当前页数
 * @param currentPage   当前页数
 * @param pageSize      页容量
 * @param totalElement  删除前数据总量
 * @param deleteCount   被删除的数据数量
 */
function adjustCurrentPage(currentPage, pageSize, totalElement, deleteCount) {
  let totalPage = Math.ceil((totalElement - deleteCount) / pageSize);
  if (currentPage !== 1 && currentPage > totalPage) {
    return totalPage;
  }
  return currentPage;
}

// function treeNodeData(id, Datalist) {//根据id获取当前节点数据
// 	let result;
// 	for (var i in Datalist) {
// 		let data = Datalist[i];
// 		if (data.id == id) {
// 			result = data;
// 			break;
// 		} else{
// 			if (data.children) {
// 				result = treeNodeData(id, data.children);
// 				if (result != null || result != undefined) {
// 					break;
// 				}
// 			}
// 		}
// 	}
// 	return result;
// }
function sendMqLink(phone) {
  MessageBox.confirm("确定拨打吗?", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning"
  })
    .then(() => {
      let machineID = localStorage.getItem("machineID");
      if (machineID) {
        let data = {
          machineID: machineID
        };
        MQ("/emergency/dispatch/map/machineState", data).then(result => {
          if (result.errorcode == 0 && result.data) {
            let msg = {
              msg: {
                type: "makeCall",
                machineID: machineID,
                data: {
                  number: phone
                }
              }
            };
            MQ("/mq/toClient", msg).then(result => {
              if (result.errorcode == 0) {
                Message({
                  message: "消息已发送",
                  type: "success"
                });
              } else {
                Message({
                  message: "发送失败",
                  type: "warning"
                });
              }
            });
          } else {
            Message({
              message: "请确认应急值守客户端是否打开",
              type: "warning"
            });
          }
        });
      } else {
        let ApiTitle = window.g.ApiTitle;
        Message({
          message: "请从应急值守客户端打开" + ApiTitle,
          type: "warning"
        });
      }
    })
    .catch(() => {
      Message({
        type: "info",
        message: "已取消"
      });
    });
}

/**
 * 发起呼叫
 * @remake 发起一次呼叫，需先拿起坐席话机
 * @param agent_id 坐席id
 * @param called 外呼号码
 * @param iddcode 坐席号码
 * @constructor
 */
function makeCall(phone) {
  MessageBox.confirm("确定拨打吗?", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning"
  })
    .then(() => {
      let ICP = JSON.parse(localStorage.getItem("ICP"));
      if (ICP.agent_id && ICP.iddcode) {
        let data;
        let topicName = localStorage.getItem("userName");
        if (window.g.ICP == "ICP19") {
          let agent_id = ICP.agent_id;
          let iddcode = ICP.iddcode.toString();
          let requestHeader = setRequestHeader(1, 0, 0);
          requestHeader["agent_id"] = agent_id;
          requestHeader["called"] = phone;
          requestHeader["iddcode"] = iddcode;
          data = {
            topicName: "eos" + topicName,
            text: requestHeader
          };
        } else if (window.g.ICP == "ICP20") {
          data = {
            topicName: "eos-icp20.0-" + topicName,
            text: {
              id: 0,
              data: {
                to: phone
              }
            }
          };
        }
        console.log(data);
        MQ("/eos/communication/icp/send", data).then(result => {
          if (result.errorcode == 0) {
            Message({
              message: "已发起呼叫!",
              type: "success"
            });
          }
        });
      } else {
        let ApiTitle = window.g.ApiTitle;
        Message({
          message: "请从应急值守打开" + ApiTitle,
          type: "warning"
        });
        return;
      }
    })
    .catch(() => {
      Message({
        type: "info",
        message: "已取消"
      });
    });
}
/**
 * 设置json公告消息头
 * @param PriCmd 主命令字，标识命令类型，默认1
 * @param SubCmd 次命令字，标识接口id，1至255
 * @param Tag 扩展字段，当SubCmd为255时启动该字段，256至int类型最大值，不启用是设置0
 */
function setRequestHeader(PriCmd, SubCmd, Tag) {
  //json公告消息头
  let requestHeader = {
    cmd: {
      PriCmd: PriCmd,
      SubCmd: SubCmd,
      Tag: Tag
    }
  };
  return requestHeader;
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
  if (data.status == 0) {
    Message({
      message: "呼叫成功!",
      type: "success"
    });
  } else if (data.status == 1) {
    if (data.cause == 63000) {
      Message({
        message: "已停止呼叫!",
        type: "success"
      });
    } else if (data.cause == 61007) {
      Message({
        message: "对方已拒接!",
        type: "success"
      });
    }
  } else {
    Message({
      message: "呼叫失败!",
      type: "error"
    });
  }
}

var lockReconnect = false; //避免重复连接
initWebsocket();
function initWebsocket() {
  // var sock = new SockJS(root + '/websocket');
  var sock = new SockJS(window.SITE_CONFIG.websocket);
  stompClient = Stomp.over(sock); // 获取 STOMP 子协议的客户端对象
  stompClient.connect(
    {}, 
    function connectCallback(frame) {
      console.log("连接成功：");
      console.log(frame);
      lockReconnect = true;
    }, function errorCallBack(frame) {
      console.log("连接失败");
      reconnctWS();
    }
  );
  stompClient.ws.onclose = function (error) {
    //console.log("关闭连接")
    console.log(error)
    reconnctWS(); //重连
  }
}

function reconnctWS() {
  if (lockReconnect) return;
  setTimeout(() => {
    initWebsocket()
  }, 5000);
}

export {
  resetForm,
  transformToIds,
  adjustCurrentPage,
  root,
  sendMqLink,
  makeCall,
  MakeCallAck,
  stompClient
};
