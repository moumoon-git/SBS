import {
  Message,
  MessageBox
} from 'element-ui'
import axios from 'axios'
const root = window.g.ApiUrl;
/**
 * 根据上传得到的文件相对路径导入数据
 * @param filePath    文件相对路径
 * @param dataType    数据类型
 * @param callBack    导入成功的回调函数，通常为刷新
 * @returns {Promise<void>}
 * @constructor
 */
async function ImportData(filePath, dataType, callBack) {
  if (filePath && filePath.length > 0) {
    if (dataType === "") {
      Message("暂时无法导入该类型数据");
      return;
    }
    let data = {
      file: filePath,
      type: dataType
    };
    try {
      let res = await axios({
        method: 'post',
        url: root + '/eos/communication/contactor/importFromExcel',
        data: data
      });
      if (res.status === 200) {
        if (res.data) {
          if (res.data.msg === 'SUCCESS') {
            Message('导入成功');
            callBack(); //刷新页面
          }
        }
      } else {
        Message('导入失败，请重新导入');
      }
    } catch (e) {
      Message('导入失败，请重新导入');
    }
  }
}

export {
  ImportData,
  root
}
