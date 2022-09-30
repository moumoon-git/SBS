import store from '@/store/index';

import { MessageBox } from 'element-ui';  //删除提示框
// import axios from 'axios';
const UrlMap = window.g.ApiMap; //引入地图地址
const Url = window.g.ApiUrl

// author:hexinting
// ColorList echarts 调色盘颜色列表。如果系列没有设置颜色，则会依次循环从该列表中取颜色作为系列颜色。
// 默认为['#c23531','#2f4554', '#61a0a8', '#d48265', '#91c7ae','#749f83',  '#ca8622', '#bda29a','#6e7074', '#546570', '#c4ccd3']
const ColorList = [
  '#52A5FF',
  '#FFEB55',
  '#8196FF',
  '#FF6E88',
  '#FEBB59',
  '#FFE658',
  '#c23531',
  '#2f4554',
  '#61a0a8',
  '#FFD7DB',
  '#d48265',
  '#91c7ae',
  '#749f83',
  '#ca8622',
  '#bda29a',
  '#6e7074',
  '#546570',
  '#c4ccd3'
] // 图形遍历的颜色

//
// const instance = axios.create({
//   baseUrl:root,
//   headers:{
//     'Content-Type':'application/json;charset=utf-8'
//   },
// });
//
// /**
//  * 建立本地存储
//  */
export function setLocalStorage(key, value) {
  localStorage.setItem(key, value);
}

// /**
//  * 获取本地存储
//  */
export function getLocalStorage(key) {
  let result = localStorage.getItem(key);
  return result;
}

// /**
//  * 删除本地存储
//  */
export function delLocalStorage(key) {
  localStorage.removeItem(key);
}

// /**
//  * 删除数据时，调整当前页数
//  * @param currentPage   当前页数
//  * @param pageSize      页容量
//  * @param totalElement  删除前数据总量
//  * @param deleteCount   被删除的数据数量
//  */
function adjustCurrentPage(currentPage, pageSize, totalElement, deleteCount) {
  let totalPage = Math.ceil((totalElement - deleteCount) / pageSize);
  if (currentPage !== 1 && currentPage > totalPage) {
    return totalPage;
  }
  return currentPage;
}

// function getUserIP(onNewIP) {
//   var myPeerConnection = window.RTCPeerConnection || window.mozRTCPeerConnection || window.webkitRTCPeerConnection;
//   var pc = new myPeerConnection({
//       iceServers: []
//     }),
//     noop = function() {},
//     localIPs = {},
//     ipRegex = /([0-9]{1,3}(\.[0-9]{1,3}){3}|[a-f0-9]{1,4}(:[a-f0-9]{1,4}){7})/g,
//     key;
//
//   function iterateIP(ip) {
//     if (!localIPs[ip]) onNewIP(ip);
//     localIPs[ip] = true;
//   }
//
//   //create a bogus data channel
//   pc.createDataChannel("");
//
//   // create offer and set local description
//   pc.createOffer().then(function(sdp) {
//     sdp.sdp.split('\n').forEach(function(line) {
//       if (line.indexOf('candidate') < 0) return;
//       line.match(ipRegex).forEach(iterateIP);
//     });
//
//     pc.setLocalDescription(sdp, noop, noop);
//   }).catch(function(reason) {
//     // An error occurred, so handle the failure to connect
//   });
//
//   //sten for candidate events
//   pc.onicecandidate = function(ice) {
//     if (!ice || !ice.candidate || !ice.candidate.candidate || !ice.candidate.candidate.match(ipRegex)) return;
//     ice.candidate.candidate.match(ipRegex).forEach(iterateIP);
//   };
// }

var time = 0;
var h = 0;
var m = 0;
var ms = 0;
var s = 0;
var str = "00:00:00";

var phoneTime = 0;

function reset() {  //重置
  clearInterval(time);

  time = 0;
  h = 0;
  m = 0;
  ms = 0;
  s = 0;
  str = "00:00:00";
  store.commit('setTimer', "00:00:00");
}

function start() {  //开始
  reset();
  time = setInterval(() => {
    ms = ms + 50;         //毫秒
    if (ms >= 1000) {
      ms = 0;
      s = s + 1;         //秒
    }
    if (s >= 60) {
      s = 0;
      m = m + 1;        //分钟
    }
    if (m >= 60) {
      m = 0;
      h = h + 1;        //小时
    }
    str = toDub(h) + ":" + toDub(m) + ":" + toDub(s) + "";
    store.commit('setTimer', str);
  }, 50);
}

var suspend = false;
function phoneReset() {
  h = 0;
  m = 0;
  ms = 0;
  s = 0;
  clearInterval(phoneTime);
  str = "00:00:00";
  store.commit('setTimer', "00:00:00");
  suspend = false;
}


function startPhone() {  //电话开始
  if (!suspend) {
    phoneTime = setInterval(() => {
      ms = ms + 50;         //毫秒
      if (ms >= 1000) {
        ms = 0;
        s = s + 1;         //秒
      }
      if (s >= 60) {
        s = 0;
        m = m + 1;        //分钟
      }
      if (m >= 60) {
        m = 0;
        h = h + 1;        //小时
      }
      str = toDub(h) + ":" + toDub(m) + ":" + toDub(s) + "";
      // store.commit('setTimer', str);

      let phoneState = store.getters.getPhoneState;
      if (phoneState == 0) {
        let threePhoneList = store.getters.getThreePhoneList;
        threePhoneList[0].time = str

      }
      else {
        //呼叫成功操作time
        let atPresentPhone = store.getters.getNowSelectPhoneList, phoneList = store.getters.getPhoneList;
        atPresentPhone.forEach((item, index) => {
          phoneList.forEach((items, indexs) => {
            if (item.content.number == items.content.number) {
              phoneList[indexs].time = str //改变通话中计时效果
              phoneList[indexs].isCallState = true //是否是通话状态 // bug 7309 author:hexinting date:2020-10-27
            } else {
              phoneList[indexs].isCallState = false //是否是通话状态
            }
            if (phoneList[indexs].myState == 2) {
              phoneList[indexs].isCallState = true //是否是通话状态 // bug 7309 author:hexinting date:2020-10-27
            }
          })
        })
        store.commit('setPhoneList', phoneList); //提交修改状态之后的通话列表
      }
      store.commit('setTimer', str);
    }, 50);
    suspend = true
  }
}

// function pause() { //电话暂停定时器
//   console.log('~~~~~~~~~~~~~')
//   suspend=true
// }

// function startPause() { //电话重新开启定时器
//   // suspend=false
//   // startPhone()
// }



function toDub(n) {  //补0操作
  if (n < 10) {
    return "0" + n;
  } else {
    return "" + n;
  }
}

function guid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

function confirmDelete(title, msg) {
  // 回调
  return new Promise((resolve, reject) => {
    MessageBox.confirm(msg, title, {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      //执行删除操作
      resolve()
    }).catch(() => {
      // 取消删除
      reject()
    });
  })
}

/**
 * @param {Number} y 年
 * @param {Number} m 月
 * @description 获取月份一共有多少天
 */
function daysInMonth(y, m) {
  let day = (y % 100 == 0) ? ((y % 400 == 0) ? 1 : 0) : ((y % 4 == 0) ? 1 : 0)
  var er = 28 + day;
  //  1   2   3   4   5   6   7   8   9   10  11  12
  var monthArr = [31, er, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  return monthArr[m - 1];
}

/*
  * @param: fileName - 文件名称
  * @param: 数据返回 1) 无后缀匹配 - false
  * @param: 数据返回 2) 匹配图片 - image
  * @param: 数据返回 3) 匹配 txt - txt
  * @param: 数据返回 4) 匹配 excel - excel
  * @param: 数据返回 5) 匹配 word - word
  * @param: 数据返回 6) 匹配 pdf - pdf
  * @param: 数据返回 7) 匹配 ppt - ppt
  * @param: 数据返回 8) 匹配 视频 - video
  * @param: 数据返回 9) 匹配 音频 - radio
  * @param: 数据返回 10) 其他匹配项 - other
  */
function matchFileType(fileName) {
  // 后缀获取
  var suffix = '';
  // 获取类型结果
  var result = '';
  try {
    var flieArr = fileName.split('.');
    suffix = flieArr[flieArr.length - 1];
  } catch (err) {
    suffix = '';
  }
  // fileName无后缀返回 false
  if (!suffix) {
    result = false;
    return 1;
  }
  // 图片格式
  var imglist = ['png', 'jpg', 'jpeg', 'bmp', 'gif'];
  // 进行图片匹配
  result = imglist.some(function (item) {
    return item == suffix;
  });
  if (result) {
    result = 'image';
    return 2;
  };
  // 匹配txt
  var txtlist = ['txt'];
  result = txtlist.some(function (item) {
    return item == suffix;
  });
  if (result) {
    result = 'txt';
    return 3;
  };
  // 匹配 excel
  var excelist = ['xls', 'xlsx'];
  result = excelist.some(function (item) {
    return item == suffix;
  });
  if (result) {
    result = 'excel';
    return 4;
  };
  // 匹配 word
  var wordlist = ['doc', 'docx'];
  result = wordlist.some(function (item) {
    return item == suffix;
  });
  if (result) {
    result = 'word';
    return 5;
  };
  // 匹配 pdf
  var pdflist = ['pdf'];
  result = pdflist.some(function (item) {
    return item == suffix;
  });
  if (result) {
    result = 'pdf';
    return 6;
  };
  // 匹配 ppt
  var pptlist = ['ppt'];
  result = pptlist.some(function (item) {
    return item == suffix;
  });
  if (result) {
    result = 'ppt';
    return 7;
  };
  // 匹配 视频
  var videolist = ['mp4', 'm2v', 'mkv'];
  result = videolist.some(function (item) {
    return item == suffix;
  });
  if (result) {
    result = 'video';
    return 8;
  };
  // 匹配 音频
  var radiolist = ['mp3', 'wav', 'wmv'];
  result = radiolist.some(function (item) {
    return item == suffix;
  });
  if (result) {
    result = 'radio';
    return 9;
  }
  // 其他 文件类型
  result = 'other';
  return 10;
}

export {
  UrlMap,
  adjustCurrentPage,
  Url,
  reset,
  start,
  guid,
  startPhone,
  phoneReset,
  confirmDelete,
  ColorList,
  daysInMonth,
  matchFileType,
}
