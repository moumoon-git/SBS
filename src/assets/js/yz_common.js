import store from '../store/index';

import { MessageBox } from 'element-ui'; //删除提示框
// import axios from 'axios';
const UrlMap = window.g.ApiMap; //引入地图地址
const Url = window.g.ApiUrl;
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
var str = '00:00:00';

var phoneTime = 0;

function reset() {
  //重置
  clearInterval(time);

  time = 0;
  h = 0;
  m = 0;
  ms = 0;
  s = 0;
  str = '00:00:00';
  store.commit('setTimer', '00:00:00');
}

function start() {
  //开始
  reset();
  time = setInterval(() => {
    ms = ms + 50; //毫秒
    if (ms >= 1000) {
      ms = 0;
      s = s + 1; //秒
    }
    if (s >= 60) {
      s = 0;
      m = m + 1; //分钟
    }
    if (m >= 60) {
      m = 0;
      h = h + 1; //小时
    }
    str = toDub(h) + ':' + toDub(m) + ':' + toDub(s) + '';
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
  str = '00:00:00';
  store.commit('setTimer', '00:00:00');
  suspend = false;
}

function startPhone() {
  //电话开始
  if (!suspend) {
    phoneTime = setInterval(() => {
      ms = ms + 50; //毫秒
      if (ms >= 1000) {
        ms = 0;
        s = s + 1; //秒
      }
      if (s >= 60) {
        s = 0;
        m = m + 1; //分钟
      }
      if (m >= 60) {
        m = 0;
        h = h + 1; //小时
      }
      str = toDub(h) + ':' + toDub(m) + ':' + toDub(s) + '';
      // store.commit('setTimer', str);

      let phoneState = store.getters.getPhoneState;
      if (phoneState == 0) {
        let threePhoneList = store.getters.getThreePhoneList;
        threePhoneList[0].time = str;
      } else {
        //呼叫成功操作time
        let atPresentPhone = store.getters.getNowSelectPhoneList,
          phoneList = store.getters.getPhoneList;
        atPresentPhone.forEach((item, index) => {
          phoneList.forEach((items, indexs) => {
            if (item.content.number == items.content.number) {
              phoneList[indexs].time = str; //改变通话中计时效果
              phoneList[indexs].isCallState = true; //是否是通话状态 // bug 7309 author:hexinting date:2020-10-26
            } else {
              phoneList[indexs].isCallState = false; //是否是通话状态
            }
            if (phoneList[indexs].myState == 2) {
              phoneList[indexs].isCallState = true; // bug 7309 author:hexinting date:2020-10-26
            }
          });
        });
        store.commit('setPhoneList', phoneList); //提交修改状态之后的通话列表
      }
      store.commit('setTimer', str);
    }, 50);
    suspend = true;
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

function toDub(n) {
  //补0操作
  if (n < 10) {
    return '0' + n;
  } else {
    return '' + n;
  }
}

function guid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c == 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

function confirmDelete(title, msg) {
  // 回调
  return new Promise((resolve, reject) => {
    MessageBox.confirm(msg, title, {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })
      .then(() => {
        //执行删除操作
        resolve();
      })
      .catch(() => {
        // 取消删除
        reject();
      });
  });
}
/**
 * @param {Object} navBarList 分组配置列表
 * @param {String} name 分组名字的字段名： "label"; "name"。无该变量情况下，字段名默认为name
 * @returns {Object} groupsList 替换名字后的分组配置列表
 * @author hexinting
 * @date 2020-11-05
 * @lastEditor hexinting
 * @lastDate 2020-11-05
 * @description 替换联系人大分组名字配置 code（分组唯一识别码）；enabled（分组是否显示）
 */
function replaceContactorGroupsConfig(navBarList, name) {
  let groupsList = [...navBarList];
  const contactorGroups = JSON.parse(sessionStorage.getItem('contactorGroups')); // 后端返回的分组配置列表
  if (!contactorGroups) {
    return false;
  }
  groupsList.forEach((item) => {
    if (item) {
      // console.log("分组item", item)
      let _index = contactorGroups.findIndex((el) => el.code === item.code); // 根据code查找大分组名字
      if (_index !== -1) {
        // 存在
        if (name) {
          // 分组名字的字段不为name时
          item[name] = contactorGroups[_index].name; // 替换名字
        } else {
          item.name = contactorGroups[_index].name; // 替换名字
        }
        item.enabled = true; // 是否显示
      } else {
        item.enabled = false; // 是否显示
      }
    }
  });
  groupsList = groupsList.filter((item) => item && item.enabled); // 过滤出可以显示的分组
  return groupsList;
}

/**
 * @param {String} name 分组名字
 * @returns {String} code 分组识别code
 * @author hexinting
 * @date 2020-11-05
 * @description 过滤分组名字,查找code
 */
function filterGroupName(name) {
  let contactorGroups = JSON.parse(sessionStorage.getItem('contactorGroups'));
  let group = contactorGroups.filter((el) => el.name === name);
  let code = ''; // 分组code
  if (group.length > 0) {
    code = group[0].code;
  }
  return code;
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
  }
  // 匹配txt
  var txtlist = ['txt'];
  result = txtlist.some(function (item) {
    return item == suffix;
  });
  if (result) {
    result = 'txt';
    return 3;
  }
  // 匹配 excel
  var excelist = ['xls', 'xlsx'];
  result = excelist.some(function (item) {
    return item == suffix;
  });
  if (result) {
    result = 'excel';
    return 4;
  }
  // 匹配 word
  var wordlist = ['doc', 'docx'];
  result = wordlist.some(function (item) {
    return item == suffix;
  });
  if (result) {
    result = 'word';
    return 5;
  }
  // 匹配 pdf
  var pdflist = ['pdf'];
  result = pdflist.some(function (item) {
    return item == suffix;
  });
  if (result) {
    result = 'pdf';
    return 6;
  }
  // 匹配 ppt
  var pptlist = ['ppt'];
  result = pptlist.some(function (item) {
    return item == suffix;
  });
  if (result) {
    result = 'ppt';
    return 7;
  }
  // 匹配 视频
  var videolist = ['mp4', 'm2v', 'mkv'];
  result = videolist.some(function (item) {
    return item == suffix;
  });
  if (result) {
    result = 'video';
    return 8;
  }
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

// 阿拉伯数字转中文数字
function sectionToChinese(section) {
  var chnNumChar = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九'];
  var chnUnitSection = ['', '万', '亿', '万亿', '亿亿'];
  var chnUnitChar = ['', '十', '百', '千'];
  var strIns = '',
    chnStr = '';
  var unitPos = 0;
  var zero = true;
  while (section > 0) {
    var v = section % 10;
    if (v === 0) {
      if (!zero) {
        zero = true;
        chnStr = chnNumChar[v] + chnStr;
      }
    } else {
      zero = false;
      strIns = chnNumChar[v];
      strIns += chnUnitChar[unitPos];
      chnStr = strIns + chnStr;
    }
    unitPos++;
    section = Math.floor(section / 10);
  }
  return chnStr;
}

/**
 * @param {Number} y 年
 * @param {Number} m 月
 * @description 获取月份一共有多少天
 */
function daysInMonth(y, m) {
  let day = y % 100 == 0 ? (y % 400 == 0 ? 1 : 0) : y % 4 == 0 ? 1 : 0;
  var er = 28 + day;
  //  1   2   3   4   5   6   7   8   9   10  11  12
  var monthArr = [31, er, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  return monthArr[m - 1];
}

/**
 * @param {*} x 比较的对象1
 * @param {*} y 比较的对象2
 * @description 深度比较两个对象是否相等
 * @author hexinting
 * @date 2020-9-16
 * @returns true 相等； false 不相等
 */
function deepCompare(x, y) {
  let i, l, leftChain, rightChain;

  function compare2Objects(x, y) {
    let p;

    // remember that NaN === NaN returns false 记住，NaN === NaN返回false
    // and isNaN(undefined) returns true isNaN(未定义)返回true
    if (
      isNaN(x) &&
      isNaN(y) &&
      typeof x === 'number' &&
      typeof y === 'number'
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
      (typeof x === 'function' && typeof y === 'function') ||
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
        case 'object':
        case 'function':
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
}

/**
 * @param {Array} arr 目标数组
 * @param {Array} relationKey 关联字段
 * @param {Array} findKey 要查找的字段
 * @param {Array} findValue 目标值
 * @returns {Array} 数组
 * @description 根据值查找在数组级联关系
 * @usage 用法：
    const ids = getRelations({
        arr: data,
        relationKey: 'id',
        findKey: 'name',
        findValue: '9'
    })
 */
function getRelations({
  arr = [],
  relationKey = 'id',
  findKey = 'key',
  findValue,
}) {
  if (findValue !== 0 && !findValue) {
    // throw 'Missing parameter "findvalue"'
    return [];
  }
  let isFind = false; // 是否找到目标
  let relations = []; // 最终返回值
  // tagArr 目标数组；process 级联数组
  const find = (tagArr, process = []) => {
    const tagArrLen = tagArr.length; // 数组长度
    for (let j = 0; j < tagArrLen; j++) {
      // 已经找到目标，跳出循环
      if (isFind) {
        break;
      }
      const tagItem = tagArr[j];
      const newProcess = process.concat([tagItem[relationKey]]); // 拼接上级数组
      if (tagItem[findKey] === findValue) {
        // 找到目标，标记一下
        isFind = true;
        relations = newProcess;
        break;
      } else {
        // 上级没找到，往下级找
        if (tagItem.children && tagItem.children.length > 0) {
          find(tagItem.children, newProcess);
        }
      }
    }
  };
  find(arr);
  return relations;
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
  replaceContactorGroupsConfig,
  filterGroupName,
  matchFileType,
  sectionToChinese,
  daysInMonth,
  getRelations,
  deepCompare,
};
