import axios from 'axios';
import qs from 'qs';
import store from '@/store/index';
import { Message } from 'element-ui';
import $http from '@/utils/httpRequest'; // api: https://github.com/axios/axios
import Cookies from "js-cookie";

// 引用AES源码js
const CryptoJS = require('crypto-js');

const environment = process.env.NODE_ENV === 'production' ? 'production' : 'development';

// 转写配置（科大讯飞）- 项目上要使用科大讯飞语音转文字功能的话，要先开通，拿到appid和secretKey
const config = {
  hostUrl: 'http://raasr.xfyun.cn/api/', // 请求地址 正式环境没用到
  appId: window.SITE_CONFIG['ASR'].appId, // 讯飞开放平台应用ID
  secretKey: window.SITE_CONFIG['ASR'].secretKey, // 语音转写秘钥
  filePath: '', // 音频文件地址
};
const FILE_PIECE_SICE = 10485760; // 文件分片大小 10M
const ts = parseInt(new Date().getTime() / 1000); // 时间戳
let fileLength = 0; // 文件长度
let fileNameList = []; // 分片名字列表
let fileList = []; // 分片文件列表
let initSliceId = 'aaaaaaaaa`'; // 初始silce_id
let fileName = ''; // 转写文件名
// 事件id
let eventId = 0;

/**
 * @return {String} signa 返回加密签名
 * @descripttion 获取鉴权签名
 */
function getSigna() {
  const md5 = CryptoJS.MD5(config.appId + ts).toString(); // md5加密
  const sha1 = CryptoJS.HmacSHA1(md5, config.secretKey); // HmacSHA1加密
  const signa = CryptoJS.enc.Base64.stringify(sha1); // Base64加密
  return signa; // 返回加密签名
}

/**
 * @return {String} signa 返回加密签名
 * @descripttion slice_id 生成器(科大讯飞提供的方法)
 */
function getNextSliceId() {
  let i = initSliceId.length - 1;
  while (i >= 0) {
    const ci = initSliceId[i];
    if (ci !== 'z') {
      initSliceId = `${initSliceId.slice(0, i)}${String.fromCharCode(ci.charCodeAt(0) + 1)}${initSliceId.slice(i + 1)}`;
      break;
    } else {
      initSliceId = `${initSliceId.slice(0, i)}a${initSliceId.slice(i + 1)}`;
      i -= 1;
    }
  }
  return initSliceId;
}

/**
 * @param {String} url 录音地址
 * @descripttion 获取文件名字
 */
function getFileName(url) {
  const pos = url.lastIndexOf('/');
  fileName = url.substring(pos + 1); // 文件名带后缀
}

/**
 * @param {String} id 录音数据的id
 * @descripttion 切割文件 获取分片
 */
function getSplitRecord(url) {
  return new Promise((resolve, reject) => {
    let data = new FormData();
    // data.append('recordName', 'split_test.wav'); // 文件名
    data.append('recordName', url); // 文件名
    data.append('splitSize', '5'); // 分片的大小
    $http({
      method: 'post',
      url: `${window.SITE_CONFIG.fileupload}/phone/splitRecord`,
      contentType: 'application/x-www-from-urlencoded',
      data,
    })
      .then((response) => {
        console.log(response)
        if (!response.data.data) {
          Message.error('音频文件不存在');
          store.commit('setTurnToTextLoading', { loading: false }); // 关闭loading
        } else {
          fileNameList = response.data.data; // 获取到后端切割的分片名字
        }
        resolve(fileNameList);
      })
      .catch((error) => {
        store.commit('setTurnToTextLoading', { loading: false }); // 关闭loading
        reject(error);
      });
  });
}

/**
 * @param {String} id 录音数据id
 * @param {String} name 文件名
 * @descripttion 下载文件流
 */
function getFile(id, name) {
  return new Promise((resolve, reject) => {
    axios({
      url: `${window.SITE_CONFIG.fileupload}/phone/record?fileName=${name}`,
      method: 'get',
      // data: {
      //   fileName: name, // 文件名，带后缀
      // },
      responseType: 'blob',
      header: {
        token: Cookies.get('token'),
      },
    })
      .then((response) => {
        console.log(response)
        let data = {};
        data.size = response.headers['content-length'];
        fileLength = response.headers['content-length'];
        const blob = new Blob([response.data], { type: response.data.type });
        data.file = blob;
        fileList.push(data); // 将文件存入数组
        resolve(data);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

/**
 * @param {array} names 文件名
 * @param {String} id 录音数据id
 * @descripttion 根据文件名传给后端下载文件流 队列
 */
function getFileQueue(names, id) {
  let promise = Promise.resolve();
  names.forEach((item) => {
    promise = promise.then(() => {
      const files = getFile(id, item);
      return files;
    });
  });
  return promise;
}

/**
 * @param {String} id 录音数据id
 * @descripttion 根据文件名传给后端下载文件流
 */
async function getFileList(id) {
  if (fileNameList.length === 0) {
    store.commit('setTurnToTextLoading', { loading: false }); // 开启加载中
    return;
  }
  const queue = await getFileQueue(fileNameList, id);
  return queue;
}

/**
   * @param {String} id 录音数据id
   * @param {String} data 录音数据
   * @descripttion 更新录音
   */
async function updateRecord(id, result) {
  let params = new FormData();
  params.append('id', id); // 当前录音数据id
  params.append('voiceTxt', result); // 转写结果
  params.append('eventId', eventId); // 事件Id
  $http({
    method: 'post',
    service: 'eoc',
    url: `${window.SITE_CONFIG.event}/eos/history/phone/updateCdr`,
    contentType: 'application/x-www-from-urlencoded',
    data: params,
  }).then((res) => {
    if (res.data.errorcode === 0) {
      // console.log('更新录音成功', res);
    }
  });
}

/**
 * @param {String} id 录音数据id
 * @param {String} url data 录音数据 替换为直接传url author:xuchuangxing lastUpdateTime:2021/1/8 10:20
 * @descripttion 华为语音转写-huaweiAsr方法 （深圳项目）
 */
async function huaweiAsr(id, src) {
  console.log(src);
  // 重新拼接成代理语音地址
  const url = `${window.SITE_CONFIG.HWASR}${src}`;
  const res = await axios({
    url: `${window.SITE_CONFIG.fileupload}/huaweiCloud/huaweiAsr`,
    method: 'get',
    params: {
      url,
      // url: 'http://222.189.189.181:9998/rec/20210724165738_6014_15819249242_CALLOUT.wav', // 测试录音文件地址
    },
  });
  let result = '';
  if (res.data.data) {
    const sentenceList = [...res.data.data.sentenceList]; // 转写完的数据
    // 拼接录音数据
    if (sentenceList.length > 1) {
      sentenceList.forEach((val) => {
        result += `${val.text}\n`;
      });
    } else if (sentenceList.length === 1) {
      result = sentenceList[0].text;
    }
    store.commit('setAudioText', sentenceList); // 存放录音数据
    store.commit('setTurnToTextLoading', { loading: false }); // 取消loading
  }
  await updateRecord(id, result); // 更新录音
  console.log('华为录音转文字结果：', result);
  return result; // 返回渲染识别文字 author:xuchuangxing lastUpdateTime:2021/1/8 10:20
}

/**
 * @param {String} url 录音地址
 * @descripttion 预处理接口
 */
function prepare(url) {
  config.filePath = url;
  // 文件分片数目（建议分片大小为10M，若文件<10M，则slice_num=1）
  const sliceNum = Math.ceil(fileLength / FILE_PIECE_SICE);
  const params = {
    app_id: config.appId, // 讯飞开放平台应用ID
    signa: getSigna(), // 加密数字签名（基于HMACSHA1算法，可参考实时转写生成方式或页面下方demo）
    ts, // 当前时间戳，从1970年1月1日0点0分0秒开始到现在的秒数
    file_len: fileLength, // 文件大小（单位：字节）
    file_name: fileName, // 文件名称（带后缀）
    slice_num: sliceNum, // 文件分片数目（建议分片大小为10M，若文件<10M，则slice_num=1）
  };
  return new Promise((resolve) => {
    axios({
      url: environment === 'production' ? `${window.g.proxyUrl}/api/prepare` : '/raasr/api/prepare',
      method: 'post',
      data: qs.stringify(params),
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
      },
    })
      .then((res) => {
        if (res.data.ok === 0) {
          // 成功
          resolve(res.data.data);
        } else {
          // 失败
          store.commit('setTurnToTextLoading', { loading: false }); // 关闭loading
          Message.error(res.data.failed);
        }
      })
      .catch((err) => {
        store.commit('setTurnToTextLoading', { loading: false }); // 关闭loading
        Message.error(err.failed);
      });
  });
}

/**
 * @param {array} files 录音分片后的文件流
 * @param {String} taskId 任务id
 * @param {number} id 录音数据id
 * @description 上传分片 队列
 */
function loopUploadQueue(files = [], taskId, id) {
  let promise = Promise.resolve();
  files.forEach((file) => {
    promise = promise.then(() => {
      return upload(taskId, id, file.file);
    });
  });
  return promise;
}

/**
 * @param {String} taskId 任务id
 * @param {String} id 录音数据id
 * @descripttion 分片上传
 */
async function loopUpload(taskId, id) {
  return await loopUploadQueue(fileList, taskId, id);
}

/**
 * @param {String} task_id 任务id
 * @param {String} id 录音数据id
 * @param {String} file 二进制流
 * @descripttion 文件分片上传接口
 */
function upload(taskId, id, file) {
  const sliceId = getNextSliceId(initSliceId);
  const params = {
    app_id: config.appId, // 讯飞开放平台应用ID
    signa: getSigna(), // 加密数字签名
    ts, // 时间戳
    task_id: taskId, // 任务ID
    slice_id: sliceId, // 分片序号
  };
  let formData = new FormData();
  formData.append('app_id', params.app_id);
  formData.append('signa', params.signa);
  formData.append('ts', params.ts);
  formData.append('task_id', params.task_id);
  formData.append('slice_id', params.slice_id);
  formData.append('content', file); // content 分片文件内容
  return new Promise((resolve, reject) => {
    axios({
      url: environment === 'production' ? `${window.g.proxyUrl}/api/upload` : '/raasr/api/upload',
      method: 'post',
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
      .then((res) => {
        if (res.data.ok === 0) {
          // 成功
          resolve(res);
        } else {
          // 失败
          store.commit('setTurnToTextLoading', { loading: false }); // 关闭loading
          Message.error(res.data.failed);
          reject(res.data.failed);
        }
      })
      .catch((err) => {
        store.commit('setTurnToTextLoading', { loading: false }); // 关闭loading
        reject(err);
      });
  });
}

/**
 * @param {String} task_id 任务id
 * @param {String} id 录音数据id
 * @descripttion 合并文件接口
 */
function merge(taskId, id) {
  const params = {
    app_id: config.appId, // 讯飞开放平台应用ID
    signa: getSigna(), // 加密数字签名
    ts, // 时间戳
    task_id: taskId, // 任务ID
  };
  return new Promise((resolve, reject) => {
    axios({
      url: environment === 'production' ? `${window.g.proxyUrl}/api/merge` : '/raasr/api/merge',
      method: 'post',
      data: qs.stringify(params),
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
      },
    })
      .then((res) => {
        if (res.data.ok !== 0) {
          // 失败
          store.commit('setTurnToTextLoading', { loading: false }); // 关闭loading
          Message.error(res.data.failed);
        }
        return res.data.ok === 0 ? loopGetProgress(taskId, id) : null;
      })
      .then((result) => {
        resolve(result);
      })
      .catch((err) => {
        store.commit('setTurnToTextLoading', { loading: false }); // 关闭loading
        reject(err);
      });
  });
}

function sleep(time) {
  return new Promise((resolve) => {
    setTimeout(resolve, time);
  });
}

/**
 * @param {String} task_id 任务id
 * @descripttion 获取转写进度
 */
function getProgress(taskId) {
  const params = {
    app_id: config.appId, // 讯飞开放平台应用ID
    signa: getSigna(), // 加密数字签名
    ts, // 时间戳
    task_id: taskId, // 任务ID
  };
  return new Promise((resolve, reject) => {
    axios({
      url: environment === 'production' ? `${window.g.proxyUrl}/api/getProgress` : '/raasr/api/getProgress',
      method: 'post',
      data: qs.stringify(params),
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
      },
    })
      .then((res) => {
        if (res.data.ok === 0) {
          // 成功
          resolve(res);
        } else {
          // 失败
          store.commit('setTurnToTextLoading', { loading: false }); // 关闭loading
          Message.error(res.data.failed);
          reject(res.data.failed);
        }
      })
      .catch((err) => {
        store.commit('setTurnToTextLoading', { loading: false }); // 关闭loading
        reject(err);
      });
  });
}

/**
 * @param {String} taskId 任务id
 * @param {String} id 录音数据id
 * @descripttion 获取结果接口
 */
function getResult(taskId, id) {
  const params = {
    app_id: config.appId, // 讯飞开放平台应用ID
    signa: getSigna(), // 加密数字签名
    ts, // 时间戳
    task_id: taskId, // 任务ID
  };
  return new Promise((resolve) => {
    axios({
      url: environment === 'production' ? `${window.g.proxyUrl}/api/getResult` : '/raasr/api/getResult',
      method: 'post',
      data: qs.stringify(params),
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
      },
    }).then((res) => {
      let result = '';
      let data = JSON.parse(res.data.data);
      if (data.length > 1) {
        data.forEach((val) => {
          result += val.onebest + '\n';
        });
      } else if (data.length === 1) {
        result = data[0].onebest;
      }
      store.commit('setAudioText', data); // 存放转写结果
      store.commit('setTurnToTextLoading', { loading: false }); // 关闭loading
      updateRecord(id, result); // 更新录音
      resolve(result);
    });
  });
}

/**
 * @param {String} taskId 任务id
 * @param {String} id 录音数据id
 * @descripttion 循环获取转写进度
 */
async function loopGetProgress(taskId, id) {
  const { data } = await getProgress(taskId); // 获取转写进度
  const res = JSON.parse(data.data);
  if (res.status === 9) {
    const result = await getResult(taskId, id);
    return result;
  } else {
    const timer = sleep(3000).then(() => loopGetProgress(taskId, id));
    return timer;
  }
}

/**
 * @descripttion 初始化数据
 */
function initData() {
  fileLength = 0; // 文件长度
  fileNameList = []; // 分片名字列表
  fileList = []; // 分片文件列表
  initSliceId = 'aaaaaaaaa`'; // 初始silce_id
  fileName = ''; // 文件名
  store.commit('setAudioText', []);
}

/**
 * @param {String} url 录音地址
 * @param {String} event 录音数据
 * @descripttion 语音转写
 */
export default async function allApiRequest(url, event) {
  try {
    eventId = event.id;
    // 扬州项目需求使用华为云 lastEditor:xuchuangxing lastUpdateTime:2021/1/7 18:16
    let result = '';
    // if (!!config.appId && !!config.secretKey) {
    //   // 科大讯飞
    //   initData(); // 初始化数据
    //   getFileName(url); // 获取文件名
    //   await getSplitRecord(url); // 获取分片名字
    //   await getFileList(event.id); // 获取分片文件
    //   if (fileList.length === 0) {
    //     Message.error('音频文件不存在');
    //     return;
    //   }
    //   const taskId = await prepare(url, event); // 预处理
    //   await loopUpload(taskId, event.id); // 上传文件
    //   result = await merge(taskId, event.id); // 合并，获取结果
    // }

    // 华为asr
    // 扬州项目录音转文字用华为云的
    result = await huaweiAsr(event.id, url);
    return result;
  } catch (err) {
    return '';
  }
}
