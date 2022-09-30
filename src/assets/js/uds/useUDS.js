// 详细参数配置请查看SIOC项目的useUDS.ts
import Stomp from 'stompjs';
import cookie from 'js-cookie';
import bus from '@/views/common/js/eventBus.js';
import store from '@/store/index'
import { Encrypt, Decrypt } from '@/utils/AESUtils';

export function createClient(_server, _user, _password) {
  // 1. state
  const MQServer = _server || window.SITE_CONFIG.MQServer;
  const user = _user || cookie.get('userName');
  const password = _password || cookie.get('password');
  const guid = localStorage.getItem('guid') || `browser${Math.round(Math.random() * 10000000)}`;
  localStorage.setItem('guid', guid);
  const sender = `uds_${user}`;
  const url = `/topic/${sender}`;
  const client = Stomp.client(MQServer);

  // 2. methods
  const disconnect = () => {
    client.disconnect();
  };

  const UDSListener = new Set();

  const addUDSListener = (fn) => {
    UDSListener.add(fn);
  };

  const removeUDSListener = (fn) => {
    UDSListener.delete(fn);
  };

  const establish = () => {
    client.connect(
      user,
      password,
      () => {
        client.subscribe(url, (message) => {
          let messageBody;
          try {
            messageBody = JSON.parse(message.body) || {};
          } catch (e) {
            messageBody = message.body || {};
          }
          UDSListener.forEach((cb) => {
            try {
              cb(messageBody);
            } catch (error) {
              console.error(error);
            }
          });
        });
        client.subscribe(`/topic/ucs${localStorage.phoneSeatNumber}`, (message) => {
          let messageBody;
          console.log(message)
          try {
            messageBody = JSON.parse(message.body) || {};
            if(messageBody.cmd.SubCmd == '13' || messageBody.cmd.SubCmd == 13) {
              store.commit('setCallIng',true)
              localStorage.setItem('2.7guid',messageBody.guid)
            }
            if(messageBody.cmd.SubCmd == '313' || messageBody.cmd.SubCmd == 313) {
              let textContent = store.getters.getIsAgentSpeekList;//获取到实时转语音存储起来的
              console.log(textContent)
              if (messageBody.isAgentSpeek == 1) {
                  textContent.push({  //坐席
                      text: messageBody.asrTxt,
                      from: 1
                  })
              } else {
                  textContent.push({  //通话人
                      text: messageBody.asrTxt,
                      from: 2
                  })
              }
              store.commit("setIsAgentSpeekList", textContent)    
            }
          } catch (e) {
            messageBody = message.body || {};
          }

        });        
      },
      establish,
    );
  };
  establish();

  /**
   * 拨打电话
   * @param contact 联系人
   * @param options 额外设置
   */
  const makePhoneCall = (contact, options = []) => {
    client.send(url, {}, JSON.stringify({
      cmd: {
        PriCmd: 2,
        SubCmd: 50,
        Tag: 0,
      },
      guid,
      sender,
      number: contact.phone,
      type: contact.type,
      contactorId: contact.id,
      name: contact.name,
      params: options,
    }));
  };
  /**
  * 创建会议
  * @param title 会议标题
  * @param members 会议成员数组
  * @param eventId 事件id
  */
  const createMeeting = (title, members, eventId) => {
    client.send(url, {}, JSON.stringify({
      cmd: {
        PriCmd: 2,
        SubCmd: 102,
        Tag: 0,
      },
      guid,
      sender,
      title,
      eventId,
      member: members,
    }));
  };

  /**
   * 唤醒本地UDS客户端
   */
  const waken = (agent) => {
    const a = document.createElement('a');
    a.href = `sinvie-uds://localhost/?action=login&user=${user}&pwd=${
      Encrypt(
        String(password),
        '_aes_secret_key_',
        '_aes_secret_iv__',
      ).toString()
    }&agent=${agent}`;
    console.log('唤醒uds:', a.href);
    a.click();
  };

  /**
   * @description 同步终端
   * @param group_id 分组Id：有分组Id就传分组Id，全部就传''。20210707 groupId ucs暂时还未定好要传什么字段，所以先传空
   */
  const inputDevice = (groupId) => {
    client.send(url, {}, JSON.stringify({
      cmd: {
        PriCmd: 1,
        SubCmd: 255,
        Tag: 286,
      },
      guid, // 用户guid
      sender, // 业务系统topic名
      agent_id: 0, // 用户登录的坐席id
      iType: 0, // 分组类型，0摄像机，1为eLET,8视频终端分组
      iPageIndex: 1, // 分页查询，第几页
      iPageSize: 1000, // 分页查询，每页数量。默认会全部导入数据，所以传个最大值
      group_id: groupId, // 分组ID
      devName: '', // 设备名称
    }));
  };

  /**
   * 同步终端
   * @param deviceType 设备类型，0-监控/摄像头，2-集群终端，8-会场终端
   */
  const syncDevice = (deviceType) => new Promise((resolve) => {
    const handler = (messageBody) => {
      if (messageBody.cmd && messageBody.cmd.SubCmd == 71) {
        resolve();
      }
    };
    addUDSListener(handler);
    client.send(url, {}, JSON.stringify({
      cmd: {
        PriCmd: 2,
        SubCmd: 70,
        Tag: 0,
      },
      guid,
      sender,
      deviceType,
    }));
  });

  /**
     * @description 检测uds是否在线的心跳检测回调方法
     * @param {Object} messageBody MQ消息
     */
  const heartbeatAck = (messageBody) => new Promise((resolve) => {
    if (messageBody.cmd && messageBody.cmd.SubCmd == 5) {
      console.log('Heartbeat在线状态检测ACK', messageBody)
      bus.$emit('heartbeatAck');
      resolve();
    }
  });
  addUDSListener(heartbeatAck);

  /**
   * @description Heartbeat在线状态检测。业务系统向UDS发送消息，检测UDS是否在线。
   * @param {string, number} 坐席号码
   */
  const heartbeatDetection = (agent) => new Promise((resolve) => {
    client.send(url, {}, JSON.stringify({
      cmd: {
        PriCmd: 2,
        SubCmd: 4,
        Tag: 0,
      },
      guid,
      sender,
      agent,
    }));
    resolve();
  });

  return {
    _client: client,
    addUDSListener,
    removeUDSListener,
    makePhoneCall,
    disconnect,
    createMeeting,
    waken,
    inputDevice,
    syncDevice,
    heartbeatDetection,
  };
}

export default {
  createClient,
};
