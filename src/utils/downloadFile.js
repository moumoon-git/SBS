import axios from 'axios';
/* req
    {
      method: 'post',
      url: 'xxx',
      baseURL: window.SITE_CONFIG.baseUrl,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        token: xxx,
      },
      data: {},
      responseType: 'arraybuffer',
    }
*/

/**
 * @param arr 查找数组
 * @param property 查找属性
 * @param value 查找值
 * @des:查找到值后返回其值
 */
function findArrayReturnValue(arr, property, value, findKey) {
  let findValue = '';
  if (Array.isArray(arr)) {
    return;
  }
  const len = arr.length;
  for (let i = 0; i < len; i++) {
    if (
      arr[i].hasOwnProperty(property) &&
      arr[i][property] === value &&
      arr[i].hasOwnProperty(findKey)
    ) {
      findValue = arr[i][findKey];
      break;
    }
  }
  return findValue;
}

/**
 * [getFileType 下载文档对应的类型]
 * @param  {[type]} type [description]
 * @param  {[type]} id   [description]
 * @return {[type]}      [description]
 */
function getFileType(extension) {
  const arr = [
    { type: 'doc', application: 'application/msword' },
    {
      type: 'docx',
      application:
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    },
    { type: 'dot', application: 'application/msword' },
    {
      type: 'dotx',
      application:
        'application/vnd.openxmlformats-officedocument.wordprocessingml.template',
    },
    { type: 'xls', application: 'application/vnd.ms-excel' },
    {
      type: 'xlsx',
      application:
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    },
    { type: 'ppt', application: 'application/vnd.ms-powerpoint' },
    {
      type: 'pptx',
      application:
        'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    },
    { type: 'pdf', application: 'application/pdf' },
    { type: 'txt', application: 'text/plain' },
    { type: 'gif', application: 'image/gif' },
    { type: 'jpeg', application: 'image/jpeg' },
    { type: 'jpg', application: 'image/jpeg' },
    { type: 'png', application: 'image/png' },
    { type: 'css', application: 'text/css' },
    { type: 'html', application: 'text/html' },
    { type: 'htm', application: 'text/html' },
    { type: 'xsl', application: 'text/xml' },
    { type: 'xml', application: 'text/xml' },
    { type: 'mpeg', application: 'video/mpeg' },
    { type: 'mpg', application: 'video/mpeg' },
    { type: 'avi', application: 'video/x-msvideo' },
    { type: 'movie', application: 'video/x-sgi-movie' },
    { type: 'bin', application: 'application/octet-stream' },
    { type: 'exe', application: 'application/octet-stream' },
    { type: 'so', application: 'application/octet-stream' },
    { type: 'dll', application: 'application/octet-stream' },
    { type: 'ai', application: 'application/postscript' },
    { type: 'dir', application: 'application/x-director' },
    { type: 'js', application: 'application/x-javascript' },
    { type: 'swf', application: 'application/x-shockwave-flash' },
    { type: 'xhtml', application: 'application/xhtml+xml' },
    { type: 'xht', application: 'application/xhtml+xml' },
    { type: 'zip', application: 'application/zip' },
    { type: 'mid', application: 'audio/midi' },
    { type: 'midi', application: 'audio/midi' },
    { type: 'mp3', application: 'audio/mpeg' },
    { type: 'rm', application: 'audio/x-pn-realaudio' },
    { type: 'rpm', application: 'audio/x-pn-realaudio-plugin' },
    { type: 'wav', application: 'audio/x-wav' },
    { type: 'bmp', application: 'image/bmp' },
  ];
  return findArrayReturnValue(arr, 'type', extension, 'application');
}

/**
 * @description 下载文件通用方法
 * @param {} req 请求内容
 * @returns
 */
function downloadFile(req = {}, file = {}) {
  const promise = new Promise((resolve, reject) => {
    if (req) {
      axios(req)
        .then((response) => {
          // 获取当前下载时间。没有文件名的时候，使用时间作为文件名
          const date = new Date();
          const n = date.getFullYear();
          const y = date.getMonth() + 1;
          const r = date.getDate();
          const timeStr = `${n}-${y < 10 ? `0${y}` : y}-${r < 10 ? `0${r}` : r}`;
          const str = decodeURI(
            response.headers['content-disposition'],
          ).indexOf('filename') > -1 ? 'filename=' : 'fileName=';
          // 获取文件名
          // const fileName = decodeURI(
          //   response.headers['content-disposition'],
          // ).split(str)[1];
          const fileName1 = decodeURI(
            escape(response.headers['content-disposition']),
          ).split('fileName%3D')[1];
          const fileName2 = decodeURI(
            escape(response.headers['content-disposition']),
          ).split('filename%3D')[1];
          const fileName = fileName1 || fileName2;
          // 文件类型
          const fileType = fileName.split('.')[fileName.split('.').length - 1];
          if (navigator.msSaveOrOpenBlob) {
            // 兼容ie
            navigator.msSaveOrOpenBlob(
              new Blob([response.data], { type: getFileType(fileType) }),
              `${timeStr}.${fileType}`,
            );
          } else {
            const a = document.createElement('a');
            a.href = window.URL.createObjectURL(
              new Blob([response.data], { type: getFileType(fileType) }),
            );
            a.download = fileName || `${timeStr}.${fileType}`;
            document.body.appendChild(a); // 兼容Firefox浏览器
            a.click();
            a.remove();
          }
          resolve(response);
        })
        .catch((error) => {
          reject(error);
        });
    } else {
      // 若下载文件时候是直接预览，说明下载路径中带中文，要通过encodeURI转码才能下载，
      // 但通过转码下载要后端配合，在tomcat中server.xml配置里加上 URIEncoding="UTF-8"
      // 若配置不了的话，就只能麻烦后端写一个下载接口了
      const a = document.createElement('a');
      // const href = encodeURI(encodeURI(file.url));
      // a.href = href;
      a.href = file.url;
      a.download = file.name;
      a.target = '_blank'; // 新窗口打开
      document.body.appendChild(a); // 兼容Firefox浏览器
      a.click();
      a.remove();
    }
  });
  return promise;
}
export default downloadFile;
