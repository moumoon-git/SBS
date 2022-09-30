import icp19 from "@/assets/js/HWICP-19.0/ucsApi"
import store from '../../store/index';
import axios from 'axios';
/*
 *@describe 融合通讯 电话队列
 *
 */

export default {
  //呼叫成功
  async callSuccess({ commit, state }) {
    //呼叫成功操作状态
    let atPresentPhone = store.getters.getNowSelectPhoneList, phoneList = store.getters.getPhoneList;
    atPresentPhone.forEach((item, index) => {
      phoneList.forEach((items, indexs) => {
        if (item.content.number == items.content.number) {
          phoneList[indexs].myState = 1 //改变状态成通话中
          phoneList[indexs].isCallState = true //是否是通话状态 // bug 7309 author:hexinting date:2020-10-29
        } else {
          phoneList[indexs].isCallState = false //是否是通话状态 // bug 7309 author:hexinting date:2020-10-29
        }

      })
    })
    commit('setPhoneList', phoneList); //提交修改状态之后的通话列表
    let boxlist = [];
    boxlist.push(
      {
        current: 0,
        text: '三方',
        start: true,
        url: '/static/img/phoneCallImg/peopleBlue.png'
      },
      {
        current: 0,
        text: '挂断',
        start: true,
        url: '/static/img/phoneCallImg/hangup.png'
      },
      {
        current: 1,
        text: '恢复',
        start: false,
        url: '/static/img/phoneCallImg/recoverGray.png'
      },
      {
        current: 0,
        text: '转接',
        start: true,
        url: '/static/img/phoneCallImg/switchBlue.png'
      },
      {
        current: 1,
        text: '拨号盘',
        start: false,
        url: '/static/img/phoneCallImg/phoneGray.png'
      },
      {
        current: 0,
        text: '保持',
        start: true,
        url: '/static/img/phoneCallImg/keepCallingBlue.png'
      })
    commit('setBoxList', boxlist)

  },

  //被呼成功接听
  calledSuccess({ commit, state }, data) {
    let boxlist = [];
    boxlist.push(
      {
        current: 0,
        text: '三方',
        start: true,
        url: '/static/img/phoneCallImg/peopleBlue.png'
      },
      {
        current: 0,
        text: '挂断',
        start: true,
        url: '/static/img/phoneCallImg/hangup.png'
      },
      {
        current: 1,
        text: '恢复',
        start: false,
        url: '/static/img/phoneCallImg/recoverGray.png'
      },
      {
        current: 0,
        text: '转接',
        start: true,
        url: '/static/img/phoneCallImg/switchBlue.png'
      },
      {
        current: 1,
        text: '拨号盘',
        start: false,
        url: '/static/img/phoneCallImg/phoneGray.png'
      },
      {
        current: 0,
        text: '保持',
        start: true,
        url: '/static/img/phoneCallImg/keepCallingBlue.png'
      })
    commit('setBoxList', boxlist)
    let callinPhone = store.getters.getUserCall;
    let content;
    content = {
      name: callinPhone.name,
      number: data,
      workUnit: callinPhone.workUnit,
      position: callinPhone.position,
      state: 0
    };
    let phoneList = store.getters.getPhoneList;
    phoneList.push({
      myState: 0,  // 0 >=待呼出 1>= 通话中  2>= 保持中 3>= 呼叫中 4>= 呼叫失败
      content: content,
      time: '00:00:00',
      isCallState: true, //是否是通话状态// bug 7309 author:hexinting date:2020-10-27,
    })
    let keepList = [];
    keepList.push({
      myState: 0,  // 0 >=待呼出 1>= 通话中  2>= 保持中 3>= 呼叫中 4>= 呼叫失败
      content: content,
      time: '00:00:00',
      isCallState: false,
    })
    commit("setNowSelectPhoneList", '');//先清空
    commit("setNowSelectPhoneList", keepList);//添加到现在选中的通话
    // commit("setPhoneList", phoneList);//通话队列

    for (let i = 0; i < phoneList.length; i++) {
      for (let j = i + 1; j < phoneList.length; j++) {
        if (phoneList[i].content.number == phoneList[j].content.number) {
          phoneList.splice(j, 1);
          j--;
        }
      }
    }
    commit('setPhoneList', phoneList); //提交修改状态之后的通话列表

    let atPresentPhone = store.getters.getNowSelectPhoneList, atPhoneList = store.getters.getPhoneList;
    atPresentPhone.forEach((item, index) => {
      atPhoneList.forEach((items, indexs) => {
        if (item.content.number == items.content.number) {
          atPhoneList[indexs].myState = 1 //改变状态成通话中
          atPhoneList[indexs].isCallState = true //是否是通话状态 // bug 7309 author:hexinting date:2020-10-29
        } else {
          atPhoneList[indexs].isCallState = false //是否是通话状态  // bug 7309 author:hexinting date:2020-10-29
        }

      })
    })
    commit('setPhoneList', atPhoneList); //提交修改状态之后的通话列表
  },

  //呼叫保持
  async callMaintain({ commit, state }) {
    //保持成功操作状态
    let atPresentPhone = store.getters.getNowSelectPhoneList, phoneList = store.getters.getPhoneList;
    atPresentPhone.forEach((item, index) => {
      phoneList.forEach((items, indexs) => {
        if (item.content.number == items.content.number) {
          phoneList[indexs].myState = 2 //改变状态为保持中
          phoneList[indexs].isCallState = true //是否是通话状态  // bug 7309 author:hexinting date:2020-10-29
        } else {
          phoneList[indexs].isCallState = false //是否是通话状态  // bug 7309 author:hexinting date:2020-10-29
        }
      })
    })
    commit('setPhoneList', phoneList); //提交修改状态之后的通话列表

    let boxlist = [];
    boxlist.push({
      current: 1,
      text: '三方',
      start: false,
      url: '/static/img/phoneCallImg/peopleGray.png'
    },
      {
        current: 0,
        text: '挂断',
        start: true,
        url: '/static/img/phoneCallImg/hangup.png'
      },
      {
        current: 0,
        text: '恢复',
        start: true,
        url: '/static/img/phoneCallImg/recoverBlue.png'
      },
      {
        current: 0,
        text: '转接',
        start: true,
        url: '/static/img/phoneCallImg/switchBlue.png'
      },
      {
        current: 1,
        text: '拨号盘',
        start: false,
        url: '/static/img/phoneCallImg/phoneGray.png'
      },
      {
        current: 1,
        text: '保持',
        start: false,
        url: '/static/img/phoneCallImg/keepCallingGray.png'
      })
    commit('setBoxList', boxlist)
    await commit('setHoldCallPhone', true)  //保持中

  },

  //通话恢复
  async callRecover({ commit, state }) {
    let atPresentPhone = store.getters.getNowSelectPhoneList, phoneList = store.getters.getPhoneList;
    atPresentPhone.forEach((item, index) => {
      phoneList.forEach((items, indexs) => {
        if (item.content.number == items.content.number) {
          phoneList[indexs].myState = 1 // 0 >=待呼出 1>= 通话中  2>= 保持中 3>= 呼叫中 4>= 呼叫失败
          phoneList[indexs].isCallState = true //是否是通话状态 // bug 7309 author:hexinting date:2020-10-29
        } else {
          phoneList[indexs].isCallState = false // 是否通话状态 // bug 7309 author:hexinting date:2020-10-29
        }
      })
    })
    commit('setPhoneList', phoneList); //提交修改状态之后的通话列表

    let boxlist = [];
    boxlist.push(
      {
        current: 0,
        text: '三方',
        start: true,
        url: '/static/img/phoneCallImg/peopleBlue.png'
      },
      {
        current: 0,
        text: '挂断',
        start: true,
        url: '/static/img/phoneCallImg/hangup.png'
      },
      {
        current: 1,
        text: '恢复',
        start: false,
        url: '/static/img/phoneCallImg/recoverGray.png'
      },
      {
        current: 0,
        text: '转接',
        start: true,
        url: '/static/img/phoneCallImg/switchBlue.png'
      },
      {
        current: 1,
        text: '拨号盘',
        start: false,
        url: '/static/img/phoneCallImg/phoneGray.png'
      },
      {
        current: 0,
        text: '保持',
        start: true,
        url: '/static/img/phoneCallImg/keepCallingBlue.png'
      })
    commit('setBoxList', boxlist)
  },

  //电话转接
  async callMultitap({ dispatch, commit, state }) {
    let phoneList = store.getters.getPhoneList;
    phoneList.forEach((items, indexs) => {
      phoneList[indexs].myState = 0 // 0 >=待呼出 1>= 通话中  2>= 保持中 3>= 呼叫中 4>= 呼叫失败 5>= 转接中
      phoneList[indexs].isCallState = false //是否是通话状态 // bug 7309 author:hexinting date:2020-11-12
      phoneList[indexs].time = '00:00:00'
    })
    commit('setNowSelectPhoneList', ''); //转接之后清空当前Vuex存的选中数据
    commit('setPhoneList', phoneList); //提交修改状态之后的通话列表

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
        current: 0,
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
  },

  //三方通话拨出
  async threeWayCalling({ commit, state }, data) {
    let content = []
    let agentArr = {}  //获取agent的信息
    let agentName = sessionStorage.getItem('displayname');
    let agentNumber = sessionStorage.getItem('seat');
    let agentUnit = '';
    let agentPosition = '';
    let agentState = 0  // 0=>本人 1=>通话中 2=>呼出中 3=>呼叫失败 其他的整数=>已挂断
    agentArr = {
      name: agentName,
      number: agentNumber,
      workUnit: agentUnit,
      position: agentPosition,
      state: agentState
    }
    content.push(agentArr)
    let keepLsit = store.getters.getNowSelectPhoneList;
    console.log(keepLsit);
    keepLsit[0].content.state = 1 //当前正在通话的对象,状态进来肯定是通话中
    content.push(keepLsit[0].content)
    content.push(data)  //添加第三方的电话.新添加进来的人
    let threeList = [];
    threeList.push({
      time: '00:00:00',
      content: content
    })
    console.log(threeList);
    store.commit('setPhoneState', 0); //存储当前通话类型
    await store.dispatch('filtrationPerson')
    store.commit('setThreePhoneList', threeList); //存储三方列表

    let boxlist = [];
    boxlist.push(
      {
        current: 1,
        text: '三方',
        start: false,
        url: '/static/img/phoneCallImg/peopleGray.png'
      },
      {
        current: 0,
        text: '挂断',
        start: true,
        url: '/static/img/phoneCallImg/hangup.png'
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
        start: false,
        url: '/static/img/phoneCallImg/phoneGray.png'
      },
      {
        current: 1,
        text: '保持',
        start: false,
        url: '/static/img/phoneCallImg/keepCallingGray.png'
      })
    commit('setBoxList', boxlist)

  },

  //三方通话过滤通话队列过滤到正在通话的
  filtrationPerson({ commit, state }) {
    let atPresentPhone = store.getters.getNowSelectPhoneList, phoneList = store.getters.getPhoneList;
    console.log(atPresentPhone, phoneList);
    atPresentPhone.forEach((item, index) => {
      phoneList.forEach((items, indexs) => {
        if (item.content.number == items.content.number) {
          phoneList.splice(indexs, 1);
        }

      })
    })
    commit('setPhoneList', phoneList); //删除相同值之后的列表
  },

  //三方通话成员状态
  async therrCallOverKey({ commit, state }, data) {
    console.log(data, '++++++++++++++++++++++++++++++++++++///////');
    let threePhoneList = store.getters.getThreePhoneList
    threePhoneList[0].content.forEach((item, index) => {
      //status = 成员状态-----0空闲、1摘机2;  呼叫进入、3呼出、4振铃、5应答
      //这里对应 threePhoneList 的 state==1 ? "通话中" : state==2 ? '呼叫中':state==3 ? '呼叫失败': state== 0?'本人':'已挂断'
      if (data.number == item.number) {
        let status = data.status
        switch (status) {
          case 0:
            item.state = 2  //呼叫中
            break;
          case 5:
            item.state = 1  //通话中
            break;
          default:
            item.state = 2
            break;
        }
      }
    })
    commit('setThreePhoneList', threePhoneList); //删除相同值之后的列表

  },

  //三方通话单个成员移除
  removalKeyPersonnel({ commit, state }, data) {
    let threePhoneList = store.getters.getThreePhoneList
    threePhoneList[0].content.forEach((item, index) => {
      if (data.number == item.number) {
        threePhoneList[0].content.splice(index, 1)
      }
    })
    commit('setThreePhoneList', threePhoneList); //删除相同值之后的列表
  },

  //电话呼入添加到呼入弹窗队列
  async manyCalls({ commit, state }, data) {
    // getIsManyCallsList  ,  setIsmManyCallsList
    let user = store.getters.getUserCall
    // console.log(user);
    let numberData = {
      'number': data.calling
    }
    let Url = window.g.ApiUrl;
    let city
    let tmpCity = await axios.post(Url + "/eos/communication/phone/getNumberArea", numberData)
    if (tmpCity.data.data.province && tmpCity.data.data.city) {
      city = `${tmpCity.data.data.province}  ${tmpCity.data.data.city}`
    }
    if (!tmpCity.data.data.province && tmpCity.data.data.city) {
      city = `${tmpCity.data.data.city}`
    }
    if (tmpCity.data.data.province && !tmpCity.data.data.city) {
      city = `${tmpCity.data.data.province}`
    }
    if (!tmpCity.data.data.province && !tmpCity.data.data.city) {
      city = `${'未知'}`
    }
    // city = `${tmpCity.data.data.province ? tmpCity.data.data.province : '未知'}  ${tmpCity.data.data.city ? tmpCity.data.data.city : '未知'}`
    let callObj = {
      agentNumber: data.agentNumber,
      number: user.mobile ? user.mobile : data.calling,
      agentId: data.agent_id,
      agentTag: data.agentTag,
      msg: {
        name: user.name ? user.name : '未知',
        workUnit: user.workUnit ? user.workUnit : '未知',
        city: city,
        position: user.position ? user.position : '未知',
      }
    }
    let callList = JSON.parse(JSON.stringify(store.getters.getIsManyCallsList));
    callList.push(callObj)
    commit('setIsmManyCallsList', callList);
  },

  //根据坐席id对比去掉被其他坐席接听的电话弹窗
  manyPeopleReply({ commit, state }, data) {
    console.log('-----------来电已经被其他坐席接听了 -------------');
    let callList = JSON.parse(JSON.stringify(store.getters.getIsManyCallsList));
    let phoneList = JSON.parse(JSON.stringify(store.getters.getPhoneList));
    let index = callList.findIndex(m => data.agent_id == m.agentId);
    if (index > -1) {
      let number = callList[index].number;
      callList.splice(index, 1);
      store.commit("setIsCallPhone", 'hangUp');
      store.commit("setIsDialogType", '');
      store.dispatch('answerCalls');
      // 删除电话队列对应的信息
      let phoneListIndex = phoneList.findIndex(m => String(m.content.number) === String(number));
      if (phoneListIndex > -1) {
        phoneList.splice(phoneListIndex, 1);
      }
      store.commit('setPhoneList', phoneList);
    }
    commit('setIsmManyCallsList', callList);
  },

  // //根据坐席id对比去掉代答窗口
  // generation({commit, state},data){
  //   let agentId = sessionStorage.getItem('agent_id')
  //   if(data.agent_id !== agentId){
  //     let callList = store.getters.getIsManyCallsList
  //     callList.forEach((item, index) => {
  //
  //         callList.splice(index, 1)
  //         store.commit("setIsCallPhone",'hangUp');
  //         store.commit("setIsDialogType",'');
  //         store.dispatch('answerCalls')
  //     }
  //     )}
  //   commit('setIsmManyCallsList',callList);
  // }


}
