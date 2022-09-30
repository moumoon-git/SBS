import axios from '../api/api' // 倒入 api
const UrlRoot = window.g.ApiUrl; //引入接口地址

/**
 * 深圳做的事件管理模块事件登记的接口文件夹
 * **/


export const listBy = data => {
  return axios({ //获取事件列表
    url: UrlRoot + '/eos/event/listBy',
    method: 'post',
    data
  })
};

export const getByPcodes = data => {
  return axios({ //根据pcodes获取事件等级或者事件状态
    url: UrlRoot + '/emergency/preparation/dictionary/getByPcode',
    method: 'post',
    data
  })
};

export const getTopCase = data => {
  return axios({ //获取事件类别
    url: UrlRoot + '/eos/caseClass/getTopCase',
    method: 'post',
    data
  })
};

export const phoneGroupList = data => {
  return axios({ //获取电话分组
    url: UrlRoot + '/eos/communication/group/phoneGroupList',
    method: 'post',
    data
  })
};

export const getTree = data => {
  return axios({ //事件类型
    url: UrlRoot + '/eos/caseClass/getTree',
    method: 'post',
    data
  })
};

export const eventDelete = data => {
  return axios({ //事件删除
    url: UrlRoot + '/eos/event/delete',
    method: 'post',
    data
  })
};
export const eventDeleteList = data => {
  return axios({ //事件删除
    url: UrlRoot + '/eos/event/deleteList',
    method: 'post',
    data
  })
};

export const getEventStatistics = data => {
  return axios({ //获取死亡、受伤、失踪人数
    url: UrlRoot + '/eos/event/getEventStatistics',
    method: 'post',
    data
  })
};


export const selectAll = data => {
  return axios({ //根据事件id查询所有历史
    url: UrlRoot + '/eos/event/receive/selectAll',
    method: 'post',
    data
  })
};

export const selectHistory = data => {
  return axios({ //获取全部历史传真、事件、历史其中一项
    url: UrlRoot + '/eos/event/receive/selectHistory',
    method: 'post',
    data
  })
};

export const contactorList = data => {
  return axios({ //根据分组查找联系人
    url: UrlRoot + '/eos/communication/group/contactorList',
    method: 'post',
    data
  })
};

export const getUnhandled = data => {
  return axios({ //悬浮框获取数量
    url: UrlRoot + '/eos/register/getUnhandled',
    method: 'post',
    data
  })
};

export const phoneGruopList = data => {
  return axios({ //信息处置------通讯录
    url: UrlRoot + '/eos/register/phoneGruopList',
    method: 'post',
    data
  })
};

export const recentContactor = data => {
  return axios({ //信息处置------最近联系人
    url: UrlRoot + '/eos/communication/contactor/recentContactor',
    method: 'post',
    data
  })
};

export const smsModelTree = data => {
  return axios({ //信息处置------最近联系人
    url: UrlRoot + '/eos/event/template/tree',
    method: 'post',
    data
  })
};

export const previewFax = params => {
  return axios({ //信息处置------预览传真
    url: UrlRoot + '/fax/previewFax',
    method: 'get',
    params
  })
};

export const phoneToText = data => {
  return axios({ //信息处置----录音转文字
    url: UrlRoot + '/eos/communication/phone/phoneToText',
    method: 'post',
    data
  })
};

export const phoneGetUrl = data => {
  return axios({ //信息处置----获取电话录音文件
    url: UrlRoot + '/eos/communication/phone/getUrl',
    method: 'post',
    data
  })
};

export const bookSearch = data => {
  return axios({ //信息处置----通讯录搜索接口
    url: UrlRoot + '/eos/register/search',
    method: 'post',
    data
  })
};

export const eventDetail = data => {
  return axios({ //事件管理----事件全景
    // url: UrlRoot + '/eos/register/eventDetail',
    url: UrlRoot + '/eos/register/eventDetail',
    method: 'post',
    data
  })
};

export const exportEventDetail = params => {
  return axios({ //事件管理----导出列表
    url: UrlRoot + '/eos/register/exportEventDetail',
    method: 'get',
    params
  })
};



export default {
  listBy,
  getByPcodes,
  getTopCase,
  phoneGroupList,
  getTree,
  eventDelete,
  eventDeleteList,
  getEventStatistics,
  selectAll,
  selectHistory,
  contactorList,
  getUnhandled,
  phoneGruopList,
  recentContactor,
  smsModelTree,
  previewFax,
  phoneToText,
  phoneGetUrl,
  bookSearch,
  eventDetail,
  exportEventDetail,
}
