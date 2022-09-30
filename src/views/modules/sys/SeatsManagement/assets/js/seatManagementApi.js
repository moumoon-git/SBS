import http from "@/utils/httpRequest";
import { Message } from 'element-ui';
/**
 * @description 坐席管理(平台) 坐席信息下拉列表
 */
function getTypeSeatInfoList(type, callback) {
  http({
    url: http.adornUrl('/seatmanage/seatInfo/getTypeSeatInfoList'),
    method: 'get',
    params: http.adornParams({
      type,
    }),
  }).then((data) => {
    if (data.data.code === 0) {
      // console.log(data)
      callback('success', type, data.data);
    } else {
      // Message.error(data.msg);
      callback('error', data.data);
    }
  }).catch((error) => {
    callback('error', error.data);
  });
}

/**
 * @description 坐席管理(超管) 获取 坐席信息类型列表(字典表)
 */
function getSysDictionaryListByCode(callback) {
  http({
    url: http.adornUrl('/sys/sysdictionary/getSysDictionaryListByCode'),
    method: 'get',
    params: http.adornParams({
      code: 'seat_manage',
    }),
  }).then((data) => {
    if (data.data.code === 0) {
      callback('success', data.data);
    } else {
      // Message.error(data.msg);
      callback('error', data.data);
    }
  }).catch((error) => {
    callback('error', error.data);
  });
}
/**
 * @description 坐席管理平台 列表
 */
function getSeatManageGroup(params, callback) {
  http({
    url: http.adornUrl('/seatmanage/seatManageGroup/list'),
    method: 'post',
    params: http.adornParams(params),
  }).then((data) => {
    if (data.data.code === 0) {
      callback('success', data.data);
    } else {
      // Message.error(data.msg);
      callback('error', data.data);
    }
  }).catch((error) => {
    callback('error', error.data);
  });
}

/**
 * @description 坐席管理平台 添加坐席组
 */
function addSeatGroup(params, callback) {
  http({
    url: http.adornUrl('/seatmanage/seatManageGroup/add'),
    method: 'post',
    data: http.adornParams(params),
    headers: {
      'Content-Type': 'application/json',
    },
  }).then((data) => {
    if (data.data.code === 0) {
      callback('success', data.data);
    } else {
      // Message.error(data.msg);
      callback('error', data.data);
    }
  }).catch((error) => {
    callback('error', error.data);
  });
}

/**
 * @description 坐席管理平台 删除坐席组
 */
function deleteSeatGroup(params, callback) {
  http({
    url: http.adornUrl('/seatmanage/seatManageGroup/delete'),
    method: 'post',
    data: http.adornParams(params),
    headers: {
      'Content-Type': 'application/json',
    },
  }).then((data) => {
    if (data.data.code === 0) {
      callback('success', data.data);
    } else {
      // Message.error(data.msg);
      callback('error', data.data);
    }
  }).catch((error) => {
    callback('error', error.data);
  });
}

/**
 * @description 坐席管理平台 修改坐席管理组
 */
function updateSeatGroup(params, callback) {
  http({
    url: http.adornUrl('/seatmanage/seatManageGroup/update'),
    method: 'post',
    data: http.adornParams(params),
    headers: {
      'Content-Type': 'application/json',
    },
  }).then((data) => {
    if (data.data.code === 0) {
      callback('success', data.data);
    } else {
      // Message.error(data.msg);
      callback('error', data.data);
    }
  }).catch((error) => {
    callback('error', error.data);
  });
}

/**
 * @description 坐席管理(超管) 列表 模糊查询
 */
function getSeatInfo(params, callback) {
  http({
    url: http.adornUrl('/seatmanage/seatInfo/list'),
    method: 'post',
    params: http.adornParams(params),
  }).then((data) => {
    if (data.data.code === 0) {
      callback('success', params, data.data);
    } else {
      // Message.error(data.msg);
      callback('error', data.data);
    }
  }).catch((error) => {
    callback('error', error.data);
  });
}

/**
 * @description 坐席管理（超管）添加坐席信息
 */
function addSeatInfo(params, callback) {
  http({
    url: http.adornUrl('/seatmanage/seatInfo/add'),
    method: 'post',
    data: http.adornParams(params),
    headers: {
      'Content-Type': 'application/json',
    },
  }).then((data) => {
    if (data.data.code === 0) {
      callback('success', data.data);
    } else {
      callback('error', data.data);
    }
  }).catch((error) => {
    callback('error', error.data);
  });
}

/**
 * @description 坐席管理（超管） 更新数据坐席信息
 */
function updateSeatInfo(params, callback) {
  http({
    url: http.adornUrl('/seatmanage/seatInfo/update'),
    method: 'post',
    data: http.adornParams(params),
    headers: {
      'Content-Type': 'application/json',
    },
  }).then((data) => {
    if (data.data.code === 0) {
      callback('success', data.data);
    } else {
      // Message.error(data.msg);
      callback('error', data.data);
    }
  }).catch((error) => {
    callback('error', error.data);
  });
}

/**
 * @description 坐席管理（超管） 批量删除
 */
function deleteSeatInfo(params, callback) {
  http({
    url: http.adornUrl('/seatmanage/seatInfo/delete'),
    method: 'post',
    data: http.adornParams(params),
  }).then((data) => {
    if (data.data.code === 0) {
      callback('success', data.data);
    } else {
      // Message.error(data.msg);
      callback('error', data.data);
    }
  }).catch((error) => {
    callback('error', error.data);
  });
}
/**
 * @description 坐席平台（超管） 获取平台信息
 */
function getPlatform(callback) {
  http({
    url: http.adornUrl('/sys/platform/treeList'),
    method: 'get',
    params: http.adornParams({}),
  }).then((data) => {
    if (data.data.code === 0) {
      callback('success', data.data);
    } else {
      // Message.error(data.msg);
      callback('error', data.data);
    }
  }).catch((error) => {
    callback('error', error.data);
  });
}

/**
 * @description 坐席管理(超管) 批量关联坐席号
 */
function batchUpdate(params, callback) {
  http({
    url: http.adornUrl('/seatmanage/seatInfo/batchUpdate'),
    method: 'post',
    data: http.adornParams(params),
    headers: {
      'Content-Type': 'application/json',
    },
  }).then((data) => {
    if (data.data.code === 0) {
      callback('success', data.data);
    } else {
      // Message.error(data.msg);
      callback('error', data.data);
    }
  }).catch((error) => {
    callback('error', error.data);
  });
}

/**
 * @description 记住我 获取当前记住的坐席组
 */
function getUserSeatInformation(callback) {
  http({
    url: http.adornUrl('/seatmanage/seatRemember/getOne'),
    method: 'get',
    data: http.adornParams({}),
  }).then((data) => {
    if (data.data.code === 0) {
      callback('success', data.data);
    } else {
      // Message.error(data.msg);
      callback('error', data.data);
    }
  }).catch((error) => {
    callback('error', error.data);
  });
}

/**
 * @description 坐席管理 点击记住我保存
 */
function setUserSeatInformation(params, callback) {
  http({
    url: http.adornUrl('/seatmanage/seatRemember/add'),
    method: 'post',
    data: http.adornParams(params),
    headers: {
      'Content-Type': 'application/json',
    },
  }).then((data) => {
    if (data.data.code === 0) {
      callback('success', data.data);
    } else {
      // Message.error(data.msg);
      callback('error', data.data);
    }
  }).catch((error) => {
    callback('error', error.data);
  });
}

/**
 * @description 坐席管理 更新坐席信息
 */
function updateUserSeatInformation(params, callback) {
  http({
    url: http.adornUrl('/seatmanage/seatRemember/update'),
    method: 'post',
    data: http.adornParams(params),
    headers: {
      'Content-Type': 'application/json',
    },
  }).then((data) => {
    if (data.data.code === 0) {
      callback('success', data.data);
    } else {
      // Message.error(data.msg);
      callback('error', data.data);
    }
  }).catch((error) => {
    callback('error', error.data);
  });
}

/**
 * @description 坐席管理（超管） 调用UDS 获取 坐席信息
 */
function getUcsSeatVo(params, callback) {
  http({
    url: http.adornUrl('/seatmanage/seatInfo/getUcsSeatVo'),
    method: 'get',
    params: http.adornParams(params),
  }).then((data) => {
    if (data.data.code === 0) {
      callback('success', data.data);
    } else {
      // Message.error(data.msg);
      callback('error', data.data);
    }
  }).catch((error) => {
    callback('error', error.data);
  });
}

/**
 * @description 坐席管理 用户选择后通知ucs 更新坐席组里坐席状态
 */
function noticeUcsGroupInfo(params, callback) {
  http({
    url: http.adornUrl('/seatmanage/seatManageGroup/noticeUcsGroupInfo'),
    method: 'get',
    params: http.adornParams(params),
  }).then((data) => {
    if (data.data.code === 0) {
      callback('success', data.data);
    } else {
      // Message.error(data.msg);
      callback('error', data.data);
    }
  }).catch((error) => {
    callback('error', error.data);
  });
}

/**
 * @description 坐席管理 添加分组 查询是否存在
 */
function searchByname(params, callback) {
  http({
    url: http.adornUrl('/seatmanage/seatManageGroup/searchByname'),
    method: 'get',
    params: http.adornParams(params),
  }).then((data) => {
    if (data.data.code === 0) {
      callback('success', data.data);
    } else {
      // Message.error(data.msg);
      callback('error', data.data);
    }
  }).catch((error) => {
    callback('error', error.data);
  });
}

/**
 * @description 坐席管理超管  添加坐席下拉列表修改
 */
function getLocalSeatUcsInfo(params, callback) {
  http({
    url: http.adornUrl('/seatmanage/seatUcsInfo/getLocalSeatUcsInfo'),
    method: 'get',
    params: http.adornParams(params),
  }).then((data) => {
    if (data.data.code === 0) {
      callback('success', data.data);
    } else {
      callback('error', data.data);
    }
  }).catch((error) => {
    callback('error', error.data);
  });
}

export default {
  getTypeSeatInfoList,
  getSysDictionaryListByCode,
  getSeatManageGroup,
  addSeatGroup,
  deleteSeatGroup,
  updateSeatGroup,
  getSeatInfo,
  addSeatInfo,
  updateSeatInfo,
  deleteSeatInfo,
  getPlatform,
  batchUpdate,
  getUserSeatInformation,
  setUserSeatInformation,
  updateUserSeatInformation,
  getUcsSeatVo,
  noticeUcsGroupInfo,
  searchByname,
  getLocalSeatUcsInfo,
};
