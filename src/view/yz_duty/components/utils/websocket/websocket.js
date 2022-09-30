/*
 * @Author: your name
 * @Date: 2021-05-19 11:39:43
 * @LastEditTime: 2021-08-21 16:55:18
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \YZSchedule\vuexTest\src\utils\websocket\websocket.js
 */
import SockJS from 'sockjs-client';
const WebSocketServer=  window.SITE_CONFIG.websocket;
const websocketConfig = {
  user: '',
  admin: '',
  server: WebSocketServer,//IP
  subscribe: '/topic/icp/CtiNotify',//主题
};
let stompClient = {};
// 连接 后
function connect(callback) {
  // 获取STOMP子协议的客户端对象
  const socket = new SockJS(websocketConfig.server);
  console.log(socket);
  stompClient = Stomp.over(socket);
  // 向服务器发起websocket连接
  stompClient.connect({}, (frame) => {
    console.log(`Connected: ${frame}`);
     // 订阅服务端提供的某个topic
    stompClient.subscribe(websocketConfig.subscribe, (res) => {
      callback(res);
      console.log(res);
    });
  });
}
 // 断开连接
function disconnect() {
  if (stompClient !== null) {
    stompClient.disconnect();
  }
  console.log('Disconnected');
}
export default {
  websocketConfig,
  connect,
  disconnect,
};
