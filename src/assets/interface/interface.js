import axios from '../api/api' // 倒入 api

/* 将所有接口统一起来便于维护
 * 如果项目很大可以将 url 独立成文件，接口分成不同的模块
 */

const UrlRoot = window.g.ApiUrl; //引入接口地址
const SITE_CONFIG = window.SITE_CONFIG["baseUrl"]; //引入接口地址

// 判断传真
export const loadtiff = data => {
    return axios({ //登录接口
        url: UrlRoot + '/eos/communication/fax/loadExistsTIFF',
        method: 'post',
        data
    })
};
// 接口倒出
export const login = data => {
    return axios({ //登录接口
        url: UrlRoot + '/login',
        method: 'post',
        data
    })
};

//融合通讯模块接口
export const telephoneGroupingTree = params => {
    return axios({ //电话分组查询
        // url: UrlRoot + '/eos/communication/group/phoneGroupList',
        url: SITE_CONFIG + '/mail/mailgroup/list',
        method: 'get',
        params
    })
};

export const doBlacklist = data => {
    return axios({ // 短信历史 全部 添加到防骚扰
        url: UrlRoot + '/eos/history/blacklist',
        method: 'post',
        data
    })
};

export const checkBlacklist = data => {
    return axios({ // 查看号码是否在黑名单里
        url: UrlRoot + '/eos/history/getblacklist',
        method: 'post',
        data
    })
};

export const contactorList = params => {
    return axios({ //根据分组查找联系人
        // url: UrlRoot + '/eos/communication/group/contactorList',
        // ser/mail/mailcontactor/list/forsms
        url: SITE_CONFIG + '/mail/mailcontactor/list/forsms',
        method: 'get',
        params
    })
};

export const addContactorToGroup = data => {
    return axios({ // 往组里新增通讯录存在的联系人
        url: UrlRoot + '/eos/communication/group/addContactorToGroup',
        method: 'post',
        data
    })
};

export const findAllContactor = data => {
    return axios({ //根据分组查询所有联系人
        url: UrlRoot + "/eos/communication/group/findAllContactorByGroupId",
        method: 'post',
        data
    })
};

export const commonContactorList = data => {
    return axios({ //查找常用联系人
        url: UrlRoot + '/eos/communication/contactor/findCommonContactor',
        method: 'post',
        data
    })
};

export const phoneQuickGroupList = data => {
    return axios({ //电话快捷组
        url: UrlRoot + '/eos/communication/group/phoneQuickGroupList',
        method: 'post',
        data
    })
};

export const usedContactor = data => {
    return axios({ //设为常用联系人
        url: UrlRoot + '/eos/communication/contactor/usedContactor',
        method: 'post',
        data
    })
};

export const importFromContactorExcel = data => {
    return axios({ //导入联系人
        url: UrlRoot + '/eos/communication/contactor/importFromExcel',
        method: 'post',
        data
    })
};

export const findContactorById = data => {
    return axios({ //查找常用联系人
        url: UrlRoot + '/eos/communication/contactor/findContactor',
        method: 'post',
        data
    })
};

export const findAllContactors = data => {
    return axios({ //批量查找常用联系人
        url: UrlRoot + '/eos/communication/contactor/findAllContactors',
        method: 'post',
        data
    })
};

export const recentContactorList = data => {
    return axios({ //查找最近联系人
        url: UrlRoot + '/eos/communication/contactor/recentContactor',
        method: 'post',
        data
    })
};


export const getRecentContactorList = data => {
    return axios({ //查找最近联系人
        url: UrlRoot + '/eos/communication/contactor/recentContactorList',
        method: 'post',
        data
    })
};

export const videoGroupList = data => {
    return axios({ //查找视频分组
        url: UrlRoot + '/eos/communication/group/videoGroupListSjs',
        method: 'post',
        data
    })
};

export const videoEditVideoInfo = data => {
    return axios({ //编辑视频信息
        url: UrlRoot + '/eos/communication/video/editVideoInfo',
        method: 'post',
        data
    })
};


export const terminalGroupList = data => {
    return axios({ //查找终端分组
        url: UrlRoot + '/eos/communication/group/terminalGroupList',
        method: 'post',
        data
    })
};

export const removeTerminal = data => {
    return axios({ //移除终端
        url: UrlRoot + '/eos/communication/terminal/remove',
        method: 'post',
        data
    })
};


export const validateNumber = data => {
    return axios({ //监测手机号码拨打类型
        url: UrlRoot + '/eos/communication/phone/validateNumber',
        method: 'post',
        data
    })
};

export const terminalList = data => {
    return axios({ //终端分组信息
        url: UrlRoot + '/eos/communication/terminal/talkGroupList',
        method: 'post',
        data
    })
};

export const editTalkGroupInfo = data => {
    return axios({ //修改终端信息
        url: UrlRoot + '/eos/communication/terminal/editTalkGroupInfo',
        method: 'post',
        data
    })
};

export const addTalkGroupInfo = data => {
    return axios({ //新增终端信息
        url: UrlRoot + '/eos/communication/terminal/addTalkGroup',
        method: 'post',
        data
    })
};


export const getBriefsByClassId = data => {
    return axios({ //应急通讯录预案
        url: UrlRoot + '/eos/communication/preplan/getPreplansByClassId',
        method: 'post',
        data
    })
};

export const getStructTree = data => {
    return axios({ //应急通讯录组织架构
        url: UrlRoot + '/eos/communication/preplan/getStructTree',
        method: 'post',
        data
    })
};

export const emergencyAddressBookTree = data => {
    return axios({ //应急通讯录查询
        url: UrlRoot + '/eos/communication/preplan/list',
        method: 'post',
        data
    })
};

export const emergencyAddressBook = data => {
    return axios({ //应急通讯录联系人
        url: UrlRoot + '/eos/communication/preplan/emergencyAddressBook',
        method: 'post',
        data
    })
};

export const smsGroupList = data => {
    return axios({ //短信分组查询
        // url: UrlRoot + '/eos/communication/group/smsGroupList',
        url: SITE_CONFIG + '/message/messageGroup/listTree',
        method: 'post',
        data
    })
};
//
export const addNewGroup = data => {
    return axios({ //添加新的分组
        url: SITE_CONFIG + '/message/messageGroup/saveMessageContactorGroup',
        method: 'post',
        data
    })
};
export const smsSendRecord = data => {
    return axios({ //短信历史 发送记录
        url: UrlRoot + '/eos/history/smsGroupList',
        method: 'post',
        data
    })
};

export const findSmsGroup = data => {
    return axios({ //发送记录获取联系人
        url: UrlRoot + '/eos/history/findSmsGroup',
        method: 'post',
        data
    })
};

export const smsType = data => {
    return axios({ //短信类型获取
        // url: UrlRoot + '/eos/communication/sms/smsType',
        url: UrlRoot + '/eos/communication/sms/smsType',
        method: 'post',
        data
    })
};

export const findSmsSign = data => {
    return axios({ //获取短信签名
        url: UrlRoot + '/eos/communication/sms/findSmsSign',
        method: 'post',
        data
    })
};

export const eventImg = data => {
    return axios({ //获取事件全景图片
        url: UrlRoot + '/eos/communication/group/findAllPicture',
        method: 'post',
        data
    })
};

export const eventVideo = data => {
    return axios({ //获取事件全景视频
        url: UrlRoot + '/eos/event/approval/listFeedbackVideo',
        method: 'post',
        data
    })
};

export const addSmsSign = data => {
    return axios({ //添加短信签名
        url: UrlRoot + '/eos/communication/sms/addSmsSign',
        method: 'post',
        data
    })
};

export const deleteSmsSign = data => {
    return axios({ //删除短信签名
        url: UrlRoot + '/eos/communication/sms/removeSmsSign',
        method: 'post',
        data
    })
};

export const addSmsMould = data => {
    return axios({ //新增短信模板
        url: UrlRoot + '/eos/communication/sms/addSmsMould',
        method: 'post',
        data
    })
};

export const addPromptSmsQueue = data => {
    return axios({ //增加催报短信队列
        url: UrlRoot + '/eos/communication/sms/addPromptSmsQueue',
        method: 'post',
        data
    })
};


export const updateSmsMould = data => {
    return axios({ //更新短信模板
        url: UrlRoot + '/eos/communication/sms/updateSmsMould',
        method: 'post',
        data
    })
};

export const removeSmsMould = data => {
    return axios({ //删除短信模板
        url: UrlRoot + '/eos/communication/sms/removeSmsMould',
        method: 'post',
        data
    })
};


export const smsQueue = data => {
    return axios({ //查询短信队列
        url: UrlRoot + '/eos/communication/sms/smsQueue',
        method: 'post',
        data
    })
};

export const immediateData = data => {
    return axios({ //查询即时发送队列
        // url: UrlRoot + '/eos/communication/smsQueue/taskList',
        url: UrlRoot + '/eos/communication/sms/taskList',
        method: 'post',
        data
    })
};

export const immediateDetail = data => {
    return axios({ //查询即时发送队列详情
        url: UrlRoot + '/eos/communication/taskDetail',
        method: 'post',
        data
    })
};
export const timingData = data => {
    return axios({ //查询定时发送队列
        // url: UrlRoot + '/eos/communication/smsQueue/taskList',
        url: UrlRoot + '/eos/communication/sms/taskList',
        method: 'post',
        data
    })
};

export const timingDetail = params => {
    return axios({ //查询定时发送队列详情
        url: UrlRoot + '/eos/communication/sms/taskDetail',
        method: 'get',
        params
    })
};

export const remindData = data => {
    return axios({ //查询催报发送队列
        url: UrlRoot + '/eos/communication/sms/promptList',
        method: 'post',
        data
    })
};

export const remindDetail = data => {
    return axios({ //查询催报发送队列详情
        // url: UrlRoot + '/eos/communication/smsQueue/promptDetail',
        url: UrlRoot + '/eos/communication/sms/promptDetail',
        method: 'post',
        data
    })
};

export const sendHistory = data => {
    return axios({ //查询发送历史
        url: UrlRoot + '/eos/history/smsGroupList',
        method: 'post',
        data
    })
};

export const sendHistoryDetail = params => {
    return axios({ //查询发送历史详情
        // {{eventUrl}}/eos/communication/sms/smsListByGroupNum
        url: UrlRoot + '/eos/communication/sms/smsListByGroupNum',
        // url: UrlRoot + '/eos/history/findSmsGroups',
        method: 'get',
        params
    })
};

export const failSend = data => {
    return axios({ //发送历史失败重发
        // url: UrlRoot + '/eos/communication/sms/resendSms', // 注释原因：3.0使用下面的接口
        url: UrlRoot + '/eos/communication/sms/findFailureAndSendAgain',
        method: 'post',
        data
    })
};

export const smsDelTask = data => {
    return axios({ // 短信队列-定时-取消发送或者删除成员
        url: UrlRoot + '/eos/communication/smsQueue/deleteTask',
        method: 'post',
        data
    })
};

export const smsDelPrompt = data => {
    return axios({ // 短信队列-催报-取消发送或者删除成员
        url: UrlRoot + '/eos/communication/smsQueue/deletePrompt',
        method: 'post',
        data
    })
};

export const removeSmsQueue = data => {
    return axios({ //删除短信队列
        url: UrlRoot + '/eos/communication/sms/removeSmsQueue',
        method: 'post',
        data
    })
};


export const faxGroupList = data => {
    return axios({ //传真分组查询
        url: UrlRoot + '/eos/communication/group/faxGroupList',
        method: 'post',
        data
    })
};

export const removeFaxQueue = data => {
    return axios({ //删除传真详情
        url: UrlRoot + '/eos/communication/fax/removeFaxQueue',
        method: 'post',
        data
    })
};


export const groupCollection = data => {
    return axios({ //查询所有分组
        url: SITE_CONFIG + '/message/messageGroup/listTree',
        method: 'post',
        data
    })
};


export const talkGroupListTree = data => {
    return axios({ //集群分组查询
        url: UrlRoot + '/eos/communication/group/talkGroupList',
        method: 'post',
        data
    })
};

export const editTalkGroup = data => {
    return axios({ //修改集群信息
        url: UrlRoot + '/eos/communication/groupTalk/editTalkGroupInfo',
        method: 'post',
        data
    })
};
export const addTalkGroup = data => {
    return axios({ //新增集群信息
        url: UrlRoot + '/eos/communication/groupTalk/addTalkGroup',
        method: 'post',
        data
    })
};

export const talkGroupList = data => {
    return axios({ //集群分组信息
        url: UrlRoot + '/eos/communication/groupTalk/talkGroupList',
        method: 'post',
        data
    })
};

export const removeTalkGroup = data => {
    return axios({ //集群分组信息
        url: UrlRoot + '/eos/communication/groupTalk/remove',
        method: 'post',
        data
    })
};

export const concatorSex = data => {
    return axios({ //联系人性别查询
        url: UrlRoot + '/eos/communication/contactor/concatorSex',
        method: 'post',
        data
    })
};

export const contactorPosition = data => {
    return axios({ //联系人职务查询
        url: UrlRoot + '/eos/communication/contactor/contactorPosition',
        method: 'post',
        data
    })
};

export const concatorImportant = data => {
    return axios({ //联系人紧急程度查询
        url: UrlRoot + '/eos/communication/contactor/important',
        method: 'post',
        data
    })
};

export const updateGroup = data => {
    return axios({ //插入，更新，删除分组 0->新增 1-> 更新 2
        url: UrlRoot + '/eos/communication/group/updateGroup',
        method: 'post',
        data
    })
};


export const updateConcator = data => {
    return axios({ //更新联系人
        url: UrlRoot + '/eos/communication/contactor/updateContactor',
        method: 'post',
        data
    })
};

export const getVideoList = data => {
    return axios({ //视频分组内容查询
        url: UrlRoot + '/eos/communication/video/videoList',
        method: 'post',
        data
    })
};

export const videoremoveGroup = data => {
    return axios({ //从某个分组移除某个视频
        url: UrlRoot + '/eos/communication/video/removeGroup',
        method: 'post',
        data
    })
};


export const removeCommonContactor = data => {
    return axios({ //视频分组内容查询
        url: UrlRoot + '/eos/communication/contactor/removeCommonContactor',
        method: 'post',
        data
    })
};

export const findContactorByMobile = params => {
    return axios({ //根据号码查询联系人信息
        url: SITE_CONFIG + '/mail/mailcontactor/phoneNum',
        method: 'get',
        params
    })
};

export const findContactorByFaxNum = data => {
    return axios({ //根据传真号码查询联系人信息
        url: UrlRoot + '/eos/communication/contactor/findContactorByFax',
        method: 'post',
        data
    })
};

export const findDeviceByNumber = data => {
    return axios({ //根据号码查询联系人或者设备信息
        url: UrlRoot + '/eos/communication/group/findDeviceByNumber',
        method: 'post',
        data
    })
};

export const promptSmsQueue = data => {
    return axios({ //查询催报信息
        url: UrlRoot + '/eos/communication/sms/promptSmsQueue',
        method: 'post',
        data
    })
};

export const rotateTiff = data => {
    return axios({ // 旋转传真
        url: UrlRoot + '/fax/rotateTiff', // '/eos/communication/fax/rotateTiff'
        method: 'post',
        data
    })
};

export const previewFax = params => {
    return axios({ //预览传真
        url: UrlRoot + '/fax/previewFax',
        method: 'get',
        params
    })
};

export const removePromptSmsQueue = data => {
    return axios({ //删除催报信息
        url: UrlRoot + '/eos/communication/sms/removePromptSmsQueue',
        method: 'post',
        data
    })
};


export const searchFaxQueue = data => {
    return axios({ //查询传真
        url: UrlRoot + '/eos/communication/fax/searchFaxQueue',
        method: 'post',
        data
    })
};

// 添加联系人到指定分组
export const addContactsToGroup = data => {
    return axios({
        url: UrlRoot + '/eos/communication/contactor/addContactorToGroup',
        method: 'post',
        data
    })
}

//
// export const exportModle = data => {
//   return axios({ //导出模板
//     url: UrlRoot + '/eos/communication/contactor/exportModle',
//     method: 'post',
//     data
//   })
// };


//TODO Is it the correct note?
export const getTree = data => {
    return axios({ //事件类型
        url: UrlRoot + '/eos/caseClass/getTree',
        method: 'post',
        data
    })
};

export const getJurisdiction = data => {
    return axios({ //所属区域
        url: SITE_CONFIG + '/sys/systown/treeList',
        method: 'post',
        data
    })
};

export const all = data => {
    return axios({ //全部电话接口
        url: UrlRoot + '/eos/history/phonelist',
        method: 'post',
        data
    })
};
export const allocated = data => {
    return axios({ //已接电话接口
        url: UrlRoot + '/eos/history/phonelist',
        method: 'post',
        data
    })
};
export const answered = data => {
    return axios({ //已拨电话接口
        url: UrlRoot + '/eos/history/phonelist',
        method: 'post',
        data
    })
};
export const Unanswered = data => {
    return axios({ //未接电话接口
        url: UrlRoot + '/eos/history/phonelist',
        method: 'post',
        data
    })
};
export const phoneWord = data => {
    return axios({ //电话历史导出
        url: UrlRoot + '/eos/history/exportPhoneList',
        method: 'post',
        data
    })
};
export const musicrecord = data => {
    return axios({ //电话历史播放 ，下载录音的文件流
        url: UrlRoot + '/eos/communication/phone/record',
        method: 'post',
        data
    })
};
export const recordToText = data => {
    return axios({ //电话历史转文字
        url: UrlRoot + '/eos/communication/phone/recordToText',
        method: 'post',
        data
    })
};

export const allEventlist = data => {
    return axios({ //电话历史的下拉框
        url: UrlRoot + '/eos/history/allEventlist',
        method: 'post',
        data
    })
};

export const createdEvent = data => {
    return axios({ //智能接报创建事件
        url: UrlRoot + '/eos/event/eventReport/reportAnalysis',
        method: 'post',
        data
    })
};

export const getAllEventlist = data => {
    return axios({ //获取关联事件
        url: UrlRoot + '/eos/history/getAllEventlist ',
        method: 'post',
        data
    })
};


export const topTree = data => {
    return axios({ //区域树 /sys/systown/list
        // url: UrlRoot + '/eos/system/area/topTree',
        url: SITE_CONFIG + '/sys/systown/list',
        // method: 'post',
        method: 'get',
        data
    })
};

export const todolist = data => {
    return axios({ //todolist接口
        url: UrlRoot + '/eos/history/eventlist',
        method: 'post',
        data
    })
};

export const todoAll = data => {
    return axios({ //todoAll接口
        url: UrlRoot + '/eos/event/getAll',
        method: 'post',
        data
    })
};

export const updateRecordPhoneHisory = data => {
    return axios({ //更新电话历史接口
        url: UrlRoot + '/eos/history/updateRecordPhoneHisory',
        method: 'post',
        data
    })
};
export const ok = data => {
    return axios({ //保存的接口
        url: UrlRoot + '/eos/history/updatephone',
        method: 'post',
        data
    })
};
export const msg = data => {
    return axios({ //短信历史搜索接口
        url: UrlRoot + '/eos/history/smstype',
        method: 'post',
        data
    })
};
export const msg_table = data => {
    return axios({ //短信历史表格接口
        url: UrlRoot + '/eos/history/updatesms',
        method: 'post',
        data
    })
};

export const msg_box = data => {
    return axios({ //短信历史完成接口
        url: UrlRoot + '/eos/history/smslist',
        method: 'post',
        data
    })
};

export const typeList = data => {
    return axios({ //短信历史 全部获取类型
        url: UrlRoot + '/emergency/preparation/dictionary/getByPcode',
        method: 'post',
        data
    })
};

export const statusList = data => {
    return axios({ //短信历史 全部短信状态
        url: UrlRoot + '/eos/history/smsStatus',
        method: 'post',
        data
    })
};

export const lishijilu = data => {
    return axios({ //短信历史 全部短信历史记录
        url: UrlRoot + '/eos/history/smslist',
        method: 'post',
        data
    })
};

export const getContacts = data => {
    return axios({ //短信历史 联系人记录
        url: UrlRoot + '/eos/history/smsContactorList',
        method: 'post',
        data
    })
};

export const findSmsListByContactId = data => {
    return axios({ //短信历史 获取联系人的发送记录
        url: UrlRoot + '/eos/history/findSmsListByContactId',
        method: 'post',
        data
    })
};

export const smsRead = data => {
    return axios({ //把未读短信修改成已读短信
        url: UrlRoot + '/eos/history/smsRead',
        method: 'post',
        data
    })
};

export const faxRead = data => {
    return axios({ //把未读传真修改成已读传真
        url: UrlRoot + '/eos/history/faxRead',
        method: 'post',
        data
    })
};

export const fax = data => {
    return axios({ //传真历史表格接口
        url: UrlRoot + '/eos/history/faxlist',
        method: 'post',
        data
    })
};
export const fax_success = data => {
    return axios({ //传真历史完成接口
        url: UrlRoot + '/eos/history/updatefax',
        method: 'post',
        data
    })
};
export const loadTIFF = data => {
    return axios({ //传真历史加载tiff
        url: UrlRoot + '/eos/communication/fax/loadTIFF',
        method: 'post',
        data
    })
};
export const loadHistoryFax = data => {
    return axios({ //传真历史转发
        url: UrlRoot + '/eos/history/loadHistoryFax',
        method: 'post',
        data
    })
};
export const eventStat = data => {
    return axios({ //事件统计
        url: UrlRoot + '/eos/statistics/eventStatController/eventStat',
        method: 'post',
        data
    })
};

export const eventHistory = data => {
    return axios({ //事件历史
        url: UrlRoot + '/eos/event/list',
        method: 'post',
        data
    })
};

export const eventDelete = data => {
    return axios({ //事件历史删除
        url: UrlRoot + '/eos/event/delete',
        method: 'post',
        data
    })
};

export const findSmsMould = data => {
    return axios({ //获取所有短信模板
        // url: UrlRoot + '/eos/communication/sms/findSmsMould',
        url: UrlRoot + '/smsTemplateType/tree',
        method: 'post',
        data
    })
};
export const findTencentmsg = data => {
    return axios({ //获取腾讯云所有短信模板
        url: UrlRoot + '/qcloudsms/template/templateGroup',
        method: 'post',
        data
    })
};
export const findTencenttree = data => {
    return axios({ //获取腾讯云的树请求子的接口
        url: UrlRoot + '/qcloudsms/template/templateGroupList',
        method: 'post',
        data
    })
};
export const addTencentmsg = data => {
    return axios({ //添加腾讯云模板
        url: UrlRoot + '/qcloudsms/template/add',
        method: 'post',
        data
    })
};
export const changeTencentmsg = data => {
    return axios({ //修改腾讯云模板
        url: UrlRoot + '/qcloudsms/template/update',
        method: 'post',
        data
    })
};
export const changeTencentree = data => {
    return axios({ //删除腾讯云树
        url: UrlRoot + '/qcloudsms/template/delete',
        method: 'post',
        data
    })
};
/*========信息动态板块=============*/
export const InformationReleas = data => {
    return axios({ //事件动态接口
        url: UrlRoot + '/eos/appDutyInformationReleas/list',
        method: 'post',
        data
    })
};

export const memoList = data => {
    return axios({ //备忘录，查找表格
        url: UrlRoot + '/eos/appDutyInformationReleas/memo/list',
        method: 'post',
        data
    })
};

export const memoDelete = data => {
    return axios({ //备忘录，删除
        url: UrlRoot + '/eos/appDutyInformationReleas/memo/delete',
        method: 'post',
        data
    })
};

export const memoUpdate = data => {
    return axios({ //备忘录，修改
        url: UrlRoot + '/eos/appDutyInformationReleas/memo/update',
        method: 'post',
        data
    })
};

export const memoAdd = data => {
    return axios({ //备忘录，添加
        url: UrlRoot + '/eos/appDutyInformationReleas/memo/add',
        method: 'post',
        data
    })
};

export const InformationReleasUploadUrl = UrlRoot + '/upload/appDutyInformationReleaseAttachmentUpload';

export const appDutyInformationReleasAdd = data => {
    return axios({ //信息动态-添加工作安排
        url: UrlRoot + '/eos/appDutyInformationReleas/add',
        method: 'post',
        data
    })
};

export const appDutyInformationReleasDetail = data => {
    return axios({ //信息动态-添加工作安排
        url: UrlRoot + '/eos/appDutyInformationReleas/detail',
        method: 'post',
        data
    })
};

export const noticeOnscreen = data => {
    return axios({ //通知公告-上屏显示
        url: UrlRoot + '/eos/appDutyInformationReleas/notice/onscreen',
        method: 'post',
        data
    })
};

export const seeResponse = params => {
    return axios({ //工作安排-查看响应情况
        url: UrlRoot + '/app/sjs/affairs/seeResponse',
        method: 'get',
        params
    })
};

export const chasing = data => {
    return axios({ //工作安排-查看响应情况-追呼
        url: UrlRoot + '/app/sjs/affairs/call',
        method: 'post',
        data
    })
};

export const workType = data => {
    return axios({ //工作安排-新增工作安排-获取所有类型
        url: UrlRoot + '/eos/appDutyInformationReleas/detail',
        method: 'post',
        data
    })
};

export const appDutyInformationReleasUpdate = data => {
    return axios({ //信息动态-添加工作安排
        url: UrlRoot + '/eos/appDutyInformationReleas/update',
        method: 'post',
        data
    })
};
export const appDutyInformationReleasDelete = data => {
    return axios({ //信息动态-添加工作安排
        url: UrlRoot + '/eos/appDutyInformationReleas/delete',
        method: 'post',
        data
    })
};

export const addAffairs = data => {
    return axios({ //政务管理-新增/修改工作安排或零报告
        url: UrlRoot + '/app/sjs/affairs/saveOrUpdate',
        method: 'post',
        data
    })
};

export const delAffairs = data => {
    return axios({ //政务管理-删除政务
        url: UrlRoot + '/app/sjs/affairs/deleted',
        method: 'post',
        data
    })
};

export const seeAffairs = params => {
    return axios({ //政务管理-查看政务表格
        url: UrlRoot + '/app/sjs/affairs/page',
        method: 'get',
        params
    })
};

export const seeAffairsDetail = params => {
    return axios({ //政务管理-查看政务详情
        url: UrlRoot + '/app/sjs/affairs/info',
        method: 'get',
        params
    })
};
export const GovernmentAffairsUploadUrl = UrlRoot + '/upload/uploadAffairs'; //政务管理-上传附件

export const issue = data => {
    return axios({ //政务管理-下发工作安排
        url: UrlRoot + '/app/sjs/affairs/send',
        method: 'post',
        data
    })
};

export const initTypeData = data => {
    return axios({ //政务管理-类型管理-类型数据
        url: UrlRoot + '/eos/appDutyInformationReleas/delete',
        method: 'post',
        data
    })
};

export const typeDetail = data => {
    return axios({ //政务管理-类型管理-类型数据详情
        url: UrlRoot + '/eos/appDutyInformationReleas/delete',
        method: 'post',
        data
    })
};

export const addOrEditType = data => {
    return axios({ //政务管理-类型管理-新增/编辑类型
        url: UrlRoot + '/app/sjs/affairsType/saveOrUpdate',
        method: 'post',
        data
    })
};

export const delType = data => {
    return axios({ //政务管理-类型管理-删除类型
        url: UrlRoot + '/app/sjs/affairsType/deleted',
        method: 'post',
        data
    })
};

/*========信息动态板块=============*/
export const eventAdvancedInquire = data => {
    return axios({ //事件历史高级查询
        url: UrlRoot + '/eos/event/listBy',
        method: 'post',
        data
    })
};

export const eventLevel = data => {
    return axios({ //事件级别
        url: UrlRoot + '/emergency/preparation/dictionary/getByParentCode',
        method: 'post',
        data
    })
};


export const eventInformationHistory = data => {
    return axios({ //获取事件管理，信息快报事件快报下的事件历史
        url: UrlRoot + '/eos/event/bullitin/list',
        method: 'post',
        data
    })
};

export const eventLettersHistory = data => {
    return axios({ //获取事件管理，信息快报事件快报下的快报历史
        url: UrlRoot + '/eos/event/bullitin/findByEventId',
        method: 'post',
        data
    })
};

export const findByWeek = data => {
    return axios({ //信息快报，要情周报数据.
        url: UrlRoot + '/eos/event/bullitin/findByWeek',
        method: 'post',
        data
    })
};

export const updateWeek = data => {
    return axios({ //信息快报，要情周报根据时间查询.
        url: UrlRoot + '/eos/event/bullitin/updateWeek',
        method: 'post',
        data
    })
};
//事件管理=>信息快报=>月报表格
export const findByMonth = data => {
    return axios({ //信息快报，月报表格.
        url: UrlRoot + '/eos/event/bullitin/findByMonth',
        method: 'post',
        data
    })
};
//事件管理=>应急响应=>响应流程
export const responseGetProcess = data => {
    return axios({
        url: UrlRoot + '/eos/event/response/getProcess',
        method: 'post',
        data
    })
};
//事件管理=>应急响应=>组织架构
export const responseGetStruct = data => {
    return axios({
        url: UrlRoot + '/eos/event/response/getStruct',
        method: 'post',
        data
    })
};
//事件管理=>应急响应=>职责分发(群发短信)
export const responseDispatch = data => {
    return axios({
        url: UrlRoot + '/eos/event/response/dispatch',
        method: 'post',
        data
    })
};
//事件管理=>应急响应=>根据组织架构id,关键字,获取联系人名单
export const responseSearch = data => {
    return axios({
        url: UrlRoot + '/eos/event/response/search',
        method: 'post',
        data
    })
};
//事件管理=>应急响应=>保存流程处理结果
export const responseSaveFlow = data => {
    return axios({
        url: UrlRoot + '/eos/event/response/save',
        method: 'post',
        data
    })
};
//事件管理=>应急响应=>获取下发内容
export const responseGetDispatch = data => {
    return axios({
        url: UrlRoot + '/eos/event/response/getDispatch',
        method: 'post',
        data
    })
};
//事件管理=>应急响应=>获取回复情况
export const responseGetReply = data => {
    return axios({
        url: UrlRoot + '/eos/event/response/getReply',
        method: 'post',
        data
    })
};
//事件管理=>应急响应=>添加人员(废弃)
export const responseAddContact = data => {
    return axios({
        url: UrlRoot + '/eos/event/response/addContact',
        method: 'post',
        data
    })
};
//事件管理=>应急响应=>删除人员(废弃)
export const responseDeleteContact = data => {
    return axios({
        url: UrlRoot + '/eos/event/response/deleteContact',
        method: 'post',
        data
    })
};
//值班管理=>值班排班=>历史排班=>表格数据
export const historyAndScheduling = data => {
    return axios({
        url: UrlRoot + '/eos/duty/dutyPlan/monthlyList',
        method: 'post',
        data
    })
};
//值班管理=>值班排班=>节假日管理=>表格数据
export const holidayManagement = data => {
    return axios({
        url: UrlRoot + '/eos/duty/dutyFestival/list',
        method: 'post',
        data
    })
};

//值班管理=>值班排班=>节假日管理=>万年历表格数据
export const holidayManagementList = data => {
    return axios({
        url: UrlRoot + '/eos/duty/dutyFestivalGroup/page',
        method: 'post',
        data
    })
};

//值班管理=>值班排班=>节假日管理=>修改
export const holidayManagementchange = data => {
    return axios({
        url: UrlRoot + '/eos/duty/dutyFestival/update',
        method: 'post',
        data
    })
};
//值班管理=>值班排班=>值班人员=>表格数据
export const operatorOnDuty = data => {
    return axios({
        url: UrlRoot + '/eos/duty/dutyContactor/list',
        method: 'post',
        data
    })
};
//值班管理=>值班排班=>排班导入
export const importFromExcel = data => {
    return axios({
        url: UrlRoot + '/eos/duty/dutyPlan/importFromExcel',
        method: 'post',
        data
    })
};
//值班管理=>值班排班=>值班人员=>添加
export const operatorOnDutydeladd = data => {
    return axios({
        url: UrlRoot + '/eos/duty/dutyContactor/add',
        method: 'post',
        data
    })
};
//值班管理=>值班排班=>值班人员=>删除
export const operatorOnDutydel = data => {
    return axios({
        url: UrlRoot + '/eos/duty/dutyContactor/delete',
        method: 'post',
        data
    })
};
//值班管理=>值班排班=>值班人员=>排序
export const order = data => {
    return axios({
        url: UrlRoot + '/eos/duty/dutyContactor/order',
        method: 'post',
        data
    })
};
//值班管理=>值班排班=>值班人员按钮
export const allman = data => {
    return axios({
        url: UrlRoot + '/eos/duty/dutyContactor/all',
        method: 'post',
        data
    })
};
//值班管理=>值班排班=>班次管理=>表格数据
export const flightManagement = data => {
    return axios({
        url: UrlRoot + '/eos/duty/dutyFrequency/list',
        method: 'post',
        data
    })
};
//值班管理=>值班排班=>班次管理=>删除
export const flightManagement_del = data => {
    return axios({
        url: UrlRoot + '/eos/duty/dutyFrequency/delete',
        method: 'post',
        data
    })
};
//值班管理=>值班排班=>班次管理=>修改
export const holidayManagement_change = data => {
    return axios({
        url: UrlRoot + '/eos/duty/dutyFrequency/update',
        method: 'post',
        data
    })
};
//值班管理=>值班排班=>班次管理=>添加
export const holidayManagement_add = data => {
    return axios({
        url: UrlRoot + '/eos/duty/dutyFrequency/add',
        method: 'post',
        data
    })
};
//值班管理=>值班排班=>短信
export const dutyplan = data => {
    return axios({
        url: UrlRoot + '/eos/duty/dutyPlan/send',
        method: 'post',
        data
    })
};
//值班管理=>值班排班=>班次管理=>排序
export const sort = data => {
    return axios({
        url: UrlRoot + '/eos/duty/dutyFrequency/order',
        method: 'post',
        data
    })
};
//值班管理=>值班排班=>值班日志=>接班人员
export const dutyLog_man = data => {
    return axios({
        url: UrlRoot + '/ctiOperator/all',
        method: 'post',
        data
    })
};
//值班管理=>值班排班=>值班日志=>当班日志=>表格数据
export const dutyLog = data => {
    return axios({
        url: UrlRoot + '/eos/duty/dutyLog/todayLogDetail',
        method: 'post',
        data
    })
};

//值班管理=>值班排班=>值班日志=>当班日志=>添加
export const dutyLogadd = data => {
    return axios({
        url: UrlRoot + '/eos/duty/dutyLogOperations/add',
        method: 'post',
        data
    })
};
//值班管理=>值班排班=>值班日志=>当班日志=>修改
export const dutyLogchange = data => {
    return axios({
        url: UrlRoot + '/eos/duty/dutyLogOperations/update',
        method: 'post',
        data
    })
};
//值班管理=>值班排班=>值班日志=>当班日志=>删除
export const dutyLogdel = data => {
    return axios({
        url: UrlRoot + '/eos/duty/dutyLogOperations/delete',
        method: 'post',
        data
    })
};
//值班管理=>值班排班=>值班日志=>当班日志=>保存
export const dutyLogupdate = data => {
    return axios({
        url: UrlRoot + '/eos/duty/dutyLog/save',
        method: 'post',
        data
    })
};
//值班管理=>值班排班=>值班日志=>当班日志=>交班
export const handover = data => {
    return axios({
        url: UrlRoot + '/eos/duty/dutyLog/handover',
        method: 'post',
        data
    })
};
//值班管理=>值班排班=>导入（模板）
export const importTemplate = data => {
    return axios({
        url: UrlRoot + '/eos/duty/dutyPlan/importTemplates',
        method: 'post',
        data
    })
};

//值班管理=>值班排班=>节假日=>添加
export const holidayManagementadd = data => {
    return axios({
        url: UrlRoot + '/eos/duty/dutyFestival/add',
        method: 'post',
        data
    })
};
//值班管理=>值班排班=>节假日=>万年历添加
export const holidayManagementaddList = data => {
    return axios({
        url: UrlRoot + '/eos/duty/dutyFestivalGroup/save',
        method: 'post',
        data
    })
};
//值班管理=>值班排班=>节假日=>删除
export const holidayManagementdel = data => {
    return axios({
        url: UrlRoot + '/eos/duty/dutyFestival/delete',
        method: 'post',
        data
    })
};

//值班管理=>值班排班=>节假日=>万年历删除
export const holidayManagementdelete = data => {
    return axios({
        url: UrlRoot + '/eos/duty/dutyFestivalGroup/delete',
        method: 'post',
        data
    })
};

//值班管理=>值班排班=>值班日志=>历史日志=>表格数据
export const dutyLoghistory = data => {
    return axios({
        url: UrlRoot + '/eos/duty/dutyLog/historyLogDetail',
        method: 'post',
        data
    })
};
//值班管理=>值班排班=>值班日志=>当班日志=>办理情况和领导批示
export const dutyLogboss = data => {
    return axios({
        url: UrlRoot + '/eos/duty/dutyLog/getApproval',
        method: 'post',
        data
    })
};
// 值班管理=>值班点名=>在岗统计=>全部
export const conferenceDuty_all = data => {
    return axios({
        url: UrlRoot + '/eos/duty/conferenceDuty/list',
        method: 'post',
        data
    })
};
// 值班管理=>值班点名=>在岗统计=>数据
export const conferenceDuty_num = data => {
    return axios({
        url: UrlRoot + '/eos/duty/conferenceDuty/conferenceDutyStatistics',
        method: 'post',
        data
    })
};
// 值班管理=>视频点名=>联系人
export const videoAndTerminalGroupList = data => {
    return axios({
        url: UrlRoot + '/eos/duty/conferenceDuty/videoAndTerminalGroupList',
        method: 'post',
        data
    })
};
// 值班管理=>视频点名=>保存
export const vdioSave = data => {
    return axios({
        url: UrlRoot + '/eos/duty/conferenceDuty/vedioSave',
        method: 'post',
        data
    })
};


//值班管理=>值班一览表=>天气
export const getWeather = data => {
  return axios({
      url: UrlRoot + '/yangzhou/television/getWeather',
      method: 'post',
      data
  })
};
//值班管理=>值班一览表=>统计数据
export const getCommunication = data => {
  return axios({
      url: UrlRoot + '/yangzhou/television/getCommunication',
      method: 'post',
      data
  })
};

//值班管理=>值班一览表=>值班人员
export const getDuty = data => {
  return axios({
      url: UrlRoot + '/yangzhou/television/getDuty',
      method: 'post',
      data
  })
};

export const updateMonth = data => {
    return axios({ //信息快报，月报按日期查询.
        url: UrlRoot + '/eos/event/bullitin/updateMonth',
        method: 'post',
        data
    })
};
export const miniProgramSave = data => {
    return axios({ //信息快报，月报按日期查询.
        url: UrlRoot + '/eos/duty/conferenceDuty/miniProgramSave',
        method: 'post',
        data
    })
};


export const updateDay = data => {
    return axios({ //信息快报，日报按日期查询.
        url: UrlRoot + '/eos/event/bullitin/updateDay',
        method: 'post',
        data
    })
};

export const bullitinTree = data => {
    return axios({ //信息快报---每日一报---获取日期树.
        url: UrlRoot + '/eos/event/bullitin/tree',
        method: 'post',
        data
    })
};

export const findByDay = data => {
    return axios({ //每日一报--按年、月、日查询每日一报.
        url: UrlRoot + '/eos/event/bullitin/findByDay',
        method: 'post',
        data
    })
};

export const selectLastEvent = data => {
    return axios({ //获取最新一条事件的总体情况
        url: UrlRoot + '/eos/event/receive/selectLastEvent',
        method: 'post',
        data
    })
};

export const phoneGroupList = data => {
    return axios({ //获取最新一条事件的总体情况
        url: UrlRoot + '/eos/communication/group/phoneGroupList',
        method: 'post',
        data
    })
};

export const findById = data => {
    return axios({ //根据事件id获取事件
        url: UrlRoot + '/eos/event/findById',
        method: 'post',
        data
    })
};

export const operatorList = data => {
    return axios({ //值班工作仪表盘，值班人员
        url: UrlRoot + '/eos/statistics/eventStatController/operatorList',
        method: 'post',
        data
    })
};

export const telephoneStat = data => {
    return axios({ //值班工作仪表盘，查询出话务统计
        url: UrlRoot + '/eos/statistics/eventStatController/telephoneStat',
        method: 'post',
        data
    })
};


export const telephoneStatCall = data => {
    return axios({ //值班工作仪表盘，呼入接听统计
        url: UrlRoot + '/eos/statistics/eventStatController/telephoneStatCall',
        method: 'post',
        data
    })
};


export const noteStat = data => {
    return axios({ //值班工作仪表盘，短信统计
        url: UrlRoot + '/eos/statistics/eventStatController/noteStat',
        method: 'post',
        data
    })
};

export const faxStat = data => {
    return axios({ //值班工作仪表盘，传真统计
        url: UrlRoot + '/eos/statistics/eventStatController/faxStat',
        method: 'post',
        data
    })
};

/*******?开始事件接报，信息快报?******/
export const damageList = data => {
    return axios({ //信息快报，保存快报
        url: UrlRoot + '/eos/event/sum/damage/list',
        method: 'post',
        data
    })
};


export const saveDay = data => {
    return axios({ //事件管理，保存事件快报
        url: UrlRoot + '/eos/event/bullitin/saveDay',
        method: 'post',
        data
    })
};

export const saveEventDay = data => {
    return axios({ //信息快报，每日一报保存
        url: UrlRoot + '/eos/event/bullitin/saveEventDay',
        method: 'post',
        data
    })
};
/*******?结束事件接报，信息快报?******/

/*******?结束事件接报，情况汇总?******/
export const caseList = data => {
    return axios({ //情况汇总,受损情况，查找列表
        url: UrlRoot + '/eos/event/sum/damage/list',
        method: 'post',
        data
    })
};

export const caseAdd = data => {
    return axios({ //情况汇总,受损情况，新增
        url: UrlRoot + '/eos/event/sum/damage/add',
        method: 'post',
        data
    })
};

export const caseUpdate = data => {
    return axios({ //情况汇总,受损情况，修改
        url: UrlRoot + '/eos/event/sum/damage/update',
        method: 'post',
        data
    })
};

export const caseDelete = data => {
    return axios({ //情况汇总,受损情况，删除
        url: UrlRoot + '/eos/event/sum/damage/delete',
        method: 'post',
        data
    })
};

export const rescueList = data => {
    return axios({ //情况汇总,救援力量，查找列表
        url: UrlRoot + '/eos/event/sum/rescue/list',
        method: 'post',
        data
    })
};

export const rescueAdd = data => {
    return axios({ //情况汇总,救援力量，新增
        url: UrlRoot + '/eos/event/sum/rescue/add',
        method: 'post',
        data
    })
};

export const rescueUpdate = data => {
    return axios({ //情况汇总,救援力量，修改
        url: UrlRoot + '/eos/event/sum/rescue/update',
        method: 'post',
        data
    })
};

export const rescueDelete = data => {
    return axios({ //情况汇总,救援力量，删除
        url: UrlRoot + '/eos/event/sum/rescue/delete',
        method: 'post',
        data
    })
};

export const materialList = data => {
    return axios({ //情况汇总,物资情况，查找列表
        url: UrlRoot + '/eos/event/sum/material/list',
        method: 'post',
        data
    })
};

export const materialAdd = data => {
    return axios({ //情况汇总,物资情况，新增
        url: UrlRoot + '/eos/event/sum/material/add',
        method: 'post',
        data
    })
};

export const materialUpdate = data => {
    return axios({ //情况汇总,物资情况，修改
        url: UrlRoot + '/eos/event/sum/material/update',
        method: 'post',
        data
    })
};

export const materialDelete = data => {
    return axios({ //情况汇总,物资情况，删除
        url: UrlRoot + '/eos/event/sum/material/delete',
        method: 'post',
        data
    })
};

export const evacuateList = data => {
    return axios({ //情况汇总,疏散情况，查找列表
        url: UrlRoot + '/eos/event/sum/evacuate/list',
        method: 'post',
        data
    })
};

export const evacuateAdd = data => {
    return axios({ //情况汇总,疏散情况，新增
        url: UrlRoot + '/eos/event/sum/evacuate/add',
        method: 'post',
        data
    })
};

export const evacuateUpdate = data => {
    return axios({ //情况汇总,疏散情况，修改
        url: UrlRoot + '/eos/event/sum/evacuate/update',
        method: 'post',
        data
    })
};

export const evacuateDelete = data => {
    return axios({ //情况汇总,疏散情况，删除
        url: UrlRoot + '/eos/event/sum/evacuate/delete',
        method: 'post',
        data
    })
};

export const riskList = data => {
    return axios({ //情况汇总,隐患情况，查找列表
        url: UrlRoot + '/eos/event/sum/risk/list',
        method: 'post',
        data
    })
};

export const riskAdd = data => {
    return axios({ //情况汇总,隐患情况，新增
        url: UrlRoot + '/eos/event/sum/risk/add',
        method: 'post',
        data
    })
};

export const riskUpdate = data => {
    return axios({ //情况汇总,隐患情况，修改
        url: UrlRoot + '/eos/event/sum/risk/update',
        method: 'post',
        data
    })
};

export const riskDelete = data => {
    return axios({ //情况汇总,隐患情况，删除
        url: UrlRoot + '/eos/event/sum/risk/delete',
        method: 'post',
        data
    })
};

export const reportAdd = data => {
    return axios({ //情况汇总,情况报告，新增
        url: UrlRoot + '/eos/event/sum/file/add',
        method: 'post',
        data
    })
};

export const reportList = data => {
    return axios({ //情况汇总,情况报告，查找列表
        url: UrlRoot + '/eos/event/sum/file/list',
        method: 'post',
        data
    })
};

export const mergeSimpleUpload = data => {
    return axios({ //情况汇总,情况报告，上传
        url: UrlRoot + '/eos/event/sum/file/add',
        method: 'post',
        data
    })
};

export const reportDelete = data => {
    return axios({ //情况汇总，情况报告，删除
        url: UrlRoot + '/eos/event/sum/file/delete',
        method: 'post',
        data
    })
};

/*******?结束事件接报，情况汇总?******/


/*******?开始事件接报————信息核实?******/
export const getFlow = data => {
    return axios({ //信息核实，获取流程
        url: UrlRoot + '/eos/event/flow/getFlow',
        method: 'post',
        data
    })
};

export const getFlowList = data => {
    return axios({ //信息核实，获取列表
        url: UrlRoot + '/eos/event/contactor/list',
        method: 'post',
        data
    })
};

export const flowAdd = data => {
    return axios({ //信息核实，新增子流程
        url: UrlRoot + '/eos/event/flow/add',
        method: 'post',
        data
    })
};

export const flowUpdate = data => {
    return axios({ //信息核实，修改子流程
        url: UrlRoot + '/eos/event/flow/updateFlow',
        method: 'post',
        data
    })
};

export const deleteFlow = data => {
    return axios({ //信息核实，修改子流程
        url: UrlRoot + '/eos/event/flow/deleteFlow',
        method: 'post',
        data
    })
};

export const getFlowAdd = data => {
    return axios({ //信息核实，新增联系人
        url: UrlRoot + '/eos/event/contactor/add',
        method: 'post',
        data
    })
};

export const getFlowUpdate = data => {
    return axios({ //信息核实，新增联系人
        url: UrlRoot + '/eos/event/contactor/update',
        method: 'post',
        data
    })
};

export const getFlowDelete = data => {
    return axios({ //信息核实，新增联系人
        url: UrlRoot + '/eos/event/contactor/delete',
        method: 'post',
        data
    })
};

export const areaList = data => {
    return axios({ //信息核实，获取属地负责人
        url: UrlRoot + '/eos/event/areaContactor/list',
        method: 'post',
        data
    })
};

/*******?结束事件接报————信息核实?******/

/*******?开始事件接报————操作记录?******/

export const selectOperator = data => {
    return axios({ //操作记录，获取表格数据
        url: UrlRoot + '/eos/event/receive/operator/selectOperator',
        method: 'post',
        data
    })
};

export const saveOperator = data => {
    return axios({ //操作记录，新增联系人
        url: UrlRoot + '/eos/event/receive/operator/saveOperator',
        method: 'post',
        data
    })
};

export const deleteOperator = data => {
    return axios({ //操作记录，删除联系人
        url: UrlRoot + '/eos/event/receive/operator/deleteOperator',
        method: 'post',
        data
    })
};

export const selectAllOperatorHistory = data => {
    return axios({ //操作记录，历史回溯，查找列表
        url: UrlRoot + '/eos/event/receive/operator/selectAllOperatorHistory',
        method: 'post',
        data
    })
};

export const saveEventReceive = data => {
    return axios({ //保存事件接报
        url: UrlRoot + '/eos/event/receive/saveEventReceive',
        method: 'post',
        data
    })
};
//济南事件上报
export const addEventInFos = data => {
    return axios({ //保存事件接报
        url: UrlRoot + '/eos/event/receive/addEventInFos',
        method: 'post',
        data
    })
};

export const saveApprovedBy = data => {
    return axios({ // 保存审定人数据
        url: UrlRoot + '/eos/event/appEventDealBulletin/setApprovalContacts',
        method: 'post',
        data
    })
};

export const saveApprovalOpinions = data => {
    return axios({ // 提交审定意见
        url: UrlRoot + '/eos/event/appEventDealBulletin/approve',
        method: 'post',
        data
    })
};
/*******?结束事件接报————操作记录?******/

/*******?开始事件接报————事件回溯?******/
export const selectEventDealList = data => {
    return axios({ //操作记录，历史回溯，查找列表
        url: UrlRoot + '/eos/event/receive/deal/selectEventDealList',
        method: 'post',
        data
    })
};

export const choose = data => {
    return axios({ //操作记录，历史回溯，查找列表
        url: UrlRoot + '/eos/event/contactor/choose',
        method: 'post',
        data
    })
};
/*******?结束事件接报————事件回溯?******/

/*******?开始事件接报————领导批示?******/
export const leadList = data => {
    return axios({ //领导批示，查找列表
        url: UrlRoot + '/eos/event/approval/list',
        method: 'post',
        data
    })
};

export const leadList1 = data => {
    return axios({ //领导批示，查找列表
        url: UrlRoot + '/eos/event/approval/list1',
        method: 'post',
        data
    })
};

export const leadAdd = data => {
    return axios({ //领导批示新增
        url: UrlRoot + '/eos/event/approval/add',
        method: 'post',
        data
    })
};

export const leadUpdate = data => {
    return axios({ //领导批示修改
        url: UrlRoot + '/eos/event/approval/update',
        method: 'post',
        data
    })
};

export const leadDelete = data => {
    return axios({ //领导批示修改
        url: UrlRoot + '/eos/event/approval/delete',
        method: 'post',
        data
    })
};

export const listRelayInstruction = data => {
    return axios({ //领导批示修改
        url: UrlRoot + '/eos/event/struct/listRelayInstruction',
        method: 'post',
        data
    })
};
/*******?结束事件接报————领导批示?******/

/*******?开始实情初判?******/
export const getPreplanByCaseId = data => {
    return axios({ //领导批示修改
        url: UrlRoot + '/eos/event/preplan/getPreplanByCaseId',
        method: 'post',
        data
    })
};

export const getLevelByPreplanId = data => {
    return axios({
        url: UrlRoot + '/eos/event/preplan/getLevelByPreplanId',
        method: 'post',
        data
    })
};

export const StartThePlan = data => {
    return axios({ //启动预案
        url: UrlRoot + '/eos/event/StartThePlan',
        method: 'post',
        data
    })
};

export const structList = data => {
    return axios({ //子流程获取人员
        url: UrlRoot + '/eos/event/struct/list',
        method: 'post',
        data
    })
};

export const structDelete = data => {
    return axios({ //子流程获取人员
        url: UrlRoot + '/eos/event/struct/delete',
        method: 'post',
        data
    })
};

export const personAdd = data => {
    return axios({ //子流程---人员--添加
        url: UrlRoot + '/eos/event/struct/add',
        method: 'post',
        data
    })
};


export const userPlan = data => {
    return axios({ //获取机器码
        url: UrlRoot + '/eos/event/user',
        method: 'post',
        data
    })
};
/*******?结束实情初判?******/

/*******?开始接报历史?******/
export const selectPhoneHistory = data => {
    return axios({ //根据事件id查询电话历史
        url: UrlRoot + '/eos/event/receive/history/selectPhoneHistory',
        method: 'post',
        data
    })
};
export const saveEventDeal = data => {
    return axios({ //保存事件续报
        url: UrlRoot + '/eos/event/receive/deal/saveEventDeal',
        method: 'post',
        data
    })
};

export const editEventDeal = data => {
    return axios({ //更新事件续报
        url: UrlRoot + '/eos/event/receive/deal/editEventDeal',
        method: 'post',
        data
    })
};

export const saveJudge = data => {
    return axios({ //保存实情初判预案
        url: UrlRoot + '/eos/event/preplan/saveJudge',
        method: 'post',
        data
    })
};

export const deleteEventDeal = data => {
    return axios({ //删除事件续报
        url: UrlRoot + '/eos/event/report/deleteEventDeal',
        method: 'post',
        data
    })
};

// 删除事件
export const deleteEvent = data => {
    return axios({
        url: UrlRoot + '/eos/event/report/deleteEvent',
        method: 'post',
        data
    })
}

export const changeLevel = data => {
    return axios({ //启动预案，调整等级
        url: UrlRoot + '/eos/event/changeLevel',
        method: 'post',
        data
    })
};

export const judgePlan = data => {
    return axios({ //接收有没有启动过预案
        url: UrlRoot + '/eos/event/plan',
        method: 'post',
        data
    })
};

export const selectSmsHistory = data => {
    return axios({ //短信历史
        url: UrlRoot + '/eos/event/receive/history/selectSmsHistory',
        method: 'post',
        data
    })
};

export const getPhoneHistory = params => {
    return axios({ // 信息接报-事件接报-信息报送-审核报送列表
        url: UrlRoot + '/eos/event/receive/history/getPhoneHistory',
        method: 'get',
        params
    })
};

export const getSmsHistory = params => {
    return axios({ // 信息接报-事件接报-信息报送-审核报送列表
        url: UrlRoot + '/eos/event/receive/history/getSmsHistory',
        method: 'get',
        params
    })
};

export const getFaxHistory = params => {
    return axios({ // 信息接报-事件接报-信息报送-审核报送列表
        url: UrlRoot + '/eos/event/receive/history/getFaxHistory',
        method: 'get',
        params
    })
};

export const logout = data => {
    return axios({ //退出系统
        url: UrlRoot + '/logout',
        method: 'post',
        data
    })
};

export const saveScheduling = data => {
    return axios({ //保存排班
        url: UrlRoot + '/eos/duty/dutyPlan/dutyPlanSave',
        method: 'post',
        data
    })
};

export const addSmsQueue = data => {
    return axios({ //下发短信
        url: UrlRoot + '/eos/communication/sms/addSmsQueue',
        method: 'post',
        data
    })
};

export const auditSubmissionList = params => {
    return axios({ // 信息接报-事件接报-信息报送-审核报送列表
        url: UrlRoot + '/eos/event/submitApproval/page',
        method: 'get',
        params
    })
};

export const getReviewer = params => {
    return axios({ // 信息接报-事件接报-信息报送-获取审核人
        url: UrlRoot + '/eos/event/submitApproval/getReviewer',
        method: 'get',
        params
    })
};

export const saveOrUpdateAudit = data => {
    return axios({ // 信息接报-事件接报-信息报送-保存或更新审核
        url: UrlRoot + '/eos/event/submitApproval/saveOrUpdate',
        method: 'post',
        data
    })
};

export const saveReviewer = data => {
    return axios({ // 信息接报-事件接报-信息报送-保存审核人
        url: UrlRoot + '/eos/event/submitApproval/saveReviewer',
        method: 'post',
        data
    })
};

export const delAudit = data => {
    return axios({ // 信息接报-事件接报-信息报送-删除审核
        url: UrlRoot + '/eos/event/submitApproval/delete',
        method: 'post',
        data
    })
};

export const submitApproval = data => {
    return axios({ // 信息接报-事件接报-信息报送-提交审核
        url: UrlRoot + '/eos/event/submitApproval/submit',
        method: 'post',
        data
    })
};

export const reportH5Sms = data => {
    return axios({ // 发送h5短信
        url: UrlRoot + '/eos/event/approval/reportH5Sms',
        method: 'post',
        data
    })
};

export const todayLeaderList = data => {
    return axios({ //根据日期查询今天值班的领导
        url: UrlRoot + '/eos/duty/dutyPlan/todayLeaderList',
        method: 'post',
        data
    })
};

export const paramList = data => {
    return axios({ //获取事件参数
        url: UrlRoot + '/eos/event/param/list',
        method: 'post',
        data
    })
};

export const paramAdd = data => {
    return axios({ //保存事件参数
        url: UrlRoot + '/eos/event/param/add',
        method: 'post',
        data
    })
};

export const paramDelete = data => {
    return axios({ //事件参数删除
        url: UrlRoot + '/eos/event/param/add/delete',
        method: 'post',
        data
    })
};

export const sendFax = data => {
    return axios({ //下发传真
        url: UrlRoot + '/eos/communication/fax/sendFax',
        method: 'post',
        data
    })
};

export const selectPhoneDepartment = data => {
    return axios({ //根据事件ID获取电话报送单位
        url: UrlRoot + '/eos/event/receive/history/selectPhoneDepartment',
        method: 'post',
        data
    })
};

export const selectFaxDepartment = data => {
    return axios({ //根据事件id查询传真记录中所有联系人的单位
        url: UrlRoot + '/eos/event/receive/history/selectFaxDepartment',
        method: 'post',
        data
    })
};

export const selectSmsHistoryByEventAndUnit = data => {
    return axios({ //根据事件id和联系人单位查询短信历史
        url: UrlRoot + '/eos/event/receive/history/selectSmsHistoryByEventAndUnit',
        method: 'post',
        data
    })
};

export const selectPhoneHistoryByEventAndUnit = data => {
    return axios({ //根据事件id和联系人单位查询所有电话历史
        url: UrlRoot + '/eos/event/receive/history/selectPhoneHistoryByEventAndUnit',
        method: 'post',
        data
    })
};

export const selectSmsDepartment = data => {
    return axios({ //根据事件id查询短信记录中所有联系人的单位
        url: UrlRoot + '/eos/event/receive/history/selectSmsDepartment',
        method: 'post',
        data
    })
};


export const eventEnd = data => {
    return axios({ //事件完结
        url: UrlRoot + '/eos/event/end',
        method: 'post',
        data
    })
};

export const exportExcel = data => {
    return axios({ //事件管理-导出文件
        url: UrlRoot + '/eos/event/exportExcel',
        method: 'post',
        data
    })
};
// export const exportList = data => {
//   return axios({ //事件管理-导出列表
//     url: UrlRoot + '/eos/event/exportExcel',
//     method: 'post',
//     data
//   })
// };

export const eventActive = data => {
    return axios({ //事件激活-扬州功能
        url: UrlRoot + '/eos/event/eventActive',
        method: 'post',
        data
    })
};

export const saveRollCall = data => {
    return axios({ //保存电话点名的手动点名
        url: UrlRoot + '/eos/duty/conferenceDuty/phoneSave',
        method: 'post',
        data
    })
};

//系统设置接口
export const changePassword = data => {
    return axios({ //修改密码
        url: UrlRoot + '/eos/basics/basicsSettingController/changePassword',
        method: 'post',
        data
    })
};

export const checkPassword = data => {
    return axios({ //验证原密码
        url: UrlRoot + '/eos/basics/basicsSettingController/verificationPassword',
        method: 'post',
        data
    })
};

export const blackList = data => {
    return axios({ //查询黑名单 //新增黑名单 //修改黑名单 //删除黑名单
        url: UrlRoot + '/eos/basics/basicsSettingController/blacklist',
        method: 'post',
        data
    })
};


export const addFlowContent = data => {
    return axios({ //子流程说明保存
        url: UrlRoot + '/eos/event/flow/addFlowContent',
        method: 'post',
        data
    })
};


export const eventType = data => {
    return axios({ //事件类型
        url: UrlRoot + '/eos/basics/basicsSettingController/eventType',
        method: 'post',
        data
    })
};

// 系统设置=>事件等级=>列表  增删改
export const eventlevelAll = data => {
    return axios({
        url: UrlRoot + '/eos/basics/basicsSettingController/eventClass',
        method: 'post',
        data
    })
};

export const areaSetting = data => {
    return axios({ //区域管理
        url: UrlRoot + '/eos/basics/basicsSettingController/areaSetting',
        method: 'post',
        data
    })
};

export const appContactors = data => {
    return axios({ //区域管理-根据联系人id获取信息
        url: UrlRoot + '/eos/basics/basicsSettingController/appContactors',
        method: 'post',
        data
    })
};

export const forward = data => {
    return axios({ //转发设置
        url: UrlRoot + '/eos/basics/basicsSettingController/transpond',
        method: 'post',
        data
    })
};

export const userManage = data => {
    return axios({ //用户管理
        url: UrlRoot + '/eos/basics/basicsSettingController/operatorAdministration',
        method: 'post',
        data
    })
};

export const isAdmin = data => {
    return axios({ //判断当前用户是否是管理员-是否展示用户管理
        url: UrlRoot + '/eos/basics/basicsSettingController/contactorsAdmin',
        method: 'post',
        data
    })
};

export const selectAttachmentHistory = data => {
    return axios({ //根据事件id查询附件历史
        url: UrlRoot + '/eos/event/receive/history/selectAttachmentHistory',
        method: 'post',
        data
    })
};

export const selectFaxHistoryByEventAndUnit = data => {
    return axios({ //根据事件id和联系人单位查询传真历史
        url: UrlRoot + '/eos/event/receive/history/selectFaxHistoryByEventAndUnit',
        method: 'post',
        data
    })
};

export const selectFaxHistory = data => {
    return axios({ //根据事件查询传真历史
        url: UrlRoot + '/eos/event/receive/history/selectFaxHistory',
        method: 'post',
        data
    })
};

export const sendAppListAll = params => {
  return axios({ //发送到APP人员选择
      // url: UrlRoot + '/ctiOperator/listAll',
      url: SITE_CONFIG + '/sys/user/userList',
      method: 'get',
      params
  })
};

export const sendAppListAllNew = data => {
  return axios({ //发送到APP人员选择(从联系人中选择)
      url: SITE_CONFIG + '/mail/mailcontactor/list',
      method: 'post',
      data
  })
};

export const sendApp = data => {
    return axios({ //发送到APP
        url: UrlRoot + '/eos/event/bullitin/sendApp',
        method: 'post',
        data
    })
};

export const getAgent = data => {
    return axios({ //获取坐席Id
        url: UrlRoot + '/eos/communication/icp/agent',
        method: 'post',
        data
    })
};

export const recordPhoneHisory = data => {
    return axios({
        url: UrlRoot + '/eos/history/recordPhoneHisory',
        method: 'post',
        data
    })
};

export const LiveGetTime = data => {
    return axios({ //根据事件ID及事件等级判断倒计时
        url: UrlRoot + '/eos/event/getTime',
        method: 'post',
        data
    })
};

export const defaultParameters = data => {
    return axios({ //根据事件类型获取新的事件参数
        url: UrlRoot + '/eos/event/param/eventList',
        method: 'post',
        data
    })
};

export const eventReception = data => {
    return axios({ //根据事件类型获取新的事件参数
        url: UrlRoot + '/eos/event/eventReport/reporting',
        method: 'post',
        data
    })
};

export const exportEventDayWord = data => {
    return axios({ //信息快报,事件快报导出word时向后台发送json
        url: UrlRoot + '/eos/event/bullitin/exportEventDayWord',
        method: 'post',
        data
    })
};

export const extendGetAttach = data => {
    return axios({ //扩张信息获取已经上传的文件列表
        url: UrlRoot + '/eos/event/getAttach',
        method: 'post',
        data
    })
};

export const addAttachWithoutFile = data => {
    return axios({ //事件扩展信息的附件信息保存
        url: UrlRoot + '/eos/event/addAttachWithoutFile',
        method: 'post',
        data
    })
};

export const delAttachWithoutFile = data => {
    return axios({ //删除事件扩展信息的附件信息
        url: UrlRoot + '/eos/event/delAttachWithoutFile',
        method: 'post',
        data
    })
};


export const extendDelAttach = data => {
    return axios({ //扩张信息删除
        url: UrlRoot + '/eos/event/delAttach',
        method: 'post',
        data
    })
};

export const getDefault = data => {
    return axios({ //获取初判预案的默认预案
        url: UrlRoot + '/eos/event/preplan/getDefault',
        method: 'post',
        data
    })
};

export const stopTime = data => {
    return axios({ //停止时间报送
        url: UrlRoot + '/eos/event/stopTime',
        method: 'post',
        data
    })
};


export const addReport = data => {
    return axios({ //事件联系人添加报告人
        url: UrlRoot + '/eos/event/contactor/addReport',
        method: 'post',
        data
    })
};

export const eventReport = data => {
    return axios({ //事件接报
        url: UrlRoot + '/eos/history/eventDeal',
        method: 'post',
        data
    })
};

export const sendLocation = data => {
    return axios({ //发送事发地点
        url: UrlRoot + '/eos/event/sendLocation',
        method: 'post',
        data
    })
};
export const addContactor = data => {
    return axios({ //短信历史-添加联系人
        url: UrlRoot + '/eos/history/addContactor',
        method: 'post',
        data
    })
};

export const findEventDealById = data => {
    return axios({ //根据接报id查询接报(历史记录)
        url: UrlRoot + '/eos/history/findEventDealById',
        method: 'post',
        data
    })
};

export const sendMsgToECS = data => {
    return axios({ //向ECS系统发送信息
        url: UrlRoot + '/eos/communication/icp/send',
        method: 'post',
        data
    })
};

export const matchPreplan = data => {
    return axios({ //根据输入的标题匹配事件类型
        url: UrlRoot + '/eos/event/matchPreplan',
        method: 'post',
        data
    })
};


export const groupOrder = data => {
    return axios({ //分组排序功能
        url: UrlRoot + '/eos/communication/group/groupOrder',
        method: 'post',
        data
    })
};

export const contactorOrder = data => {
    return axios({ //联系人排序功能
        url: UrlRoot + '/eos/communication/contactor/contactorOrder',
        method: 'post',
        data
    })
};

export const getIp = data => {
    return axios({ //获取ip
        url: UrlRoot + '/eos/event/getIp',
        method: 'post',
        data
    })
};

export const getMachineId = data => {
    return axios({ //获取机器码
        url: UrlRoot + '/eos/communication/phone/getMachineId',
        method: 'post',
        data
    })
};

export const findOperator = data => {
    return axios({ //根据id获取联系人名字
        url: UrlRoot + '/operator/findOperator',
        method: 'post',
        data
    })
};

export const loginStatus = data => {
    return axios({ //传入登录信息
        url: UrlRoot + '/eos/communication/phone/loginStatus',
        method: 'post',
        data
    })
};
export const iStarted = data => {
    return axios({ //启动预案判断打开过地图没有
        url: UrlRoot + '/eos/event/iStarted',
        method: 'post',
        data
    })
};

export const premitModules = data => {
    return axios({ //系统菜单模块数据
        url: UrlRoot + '/module/premitModules',
        method: 'post',
        data
    })
};

export const downloadRecord = data => {
    return axios({ //根据路劲请求LJL接口
        url: UrlRoot + '/eos/communication/phone/downloadRecord',
        method: 'post',
        data
    })
};

export const downloadRecordToText = data => {
    return axios({ //语音转文字
        url: UrlRoot + '/eos/communication/phone/downloadRecordToText',
        method: 'post',
        data
    })
};

export const getPhoneHelperByPid = data => {
    return axios({
        url: UrlRoot + '/eos/communication/phone/getPhoneHelperByPid',
        method: 'post',
        data
    })
};
export const getSamePidPhoneHelper = data => {
    return axios({
        url: UrlRoot + '/eos/communication/phone/getSamePidPhoneHelper',
        method: 'post',
        data
    })
};

export const getAiDefault = data => {
    return axios({ //智能初判
        url: UrlRoot + '/eos/event/preplan/getAiDefault',
        method: 'post',
        data
    })
};

export const templateList = data => {
    return axios({ //生成事件报文
        url: UrlRoot + '/eos/event/template/list',
        method: 'post',
        data
    })
};

export const divideList = data => {
    return axios({ //事件等级判断模板
        url: UrlRoot + '/eos/event/divide/list',
        method: 'post',
        data
    })
};

export const getDefaultEventLevel = data => {
    return axios({ //获取默认的初判事件等级
        url: UrlRoot + '/eos/event/preplan/getDefaultEventLevel',
        method: 'post',
        data
    })
};

export const getUnhandledFax = data => {
    return axios({
        url: UrlRoot + '/eos/register/getUnhandledFax',
        method: 'post',
        data
    })
};

export const splitPdf = data => {
    //拆分传真
    return axios({
        url: UrlRoot + '/eos/communication/fax/splitPdf',
        method: 'post',
        data
    })
};

export const previewFaxArrayBuff = data => {
    //根据pdf文件名转成二进制流
    return axios({
        url: UrlRoot + '/eos/communication/pdf/preview',
        method: 'post',
        data
    })
};

export const previewFaxArrayBuffdownload = params => {
    //根据pdf文件名转成二进制流
    return axios({
        url: UrlRoot + '/eos/communication/pdf/download',
        method: 'get',
        params
    })
};

export const getUnhandledPhone = data => {
    return axios({
        url: UrlRoot + '/eos/register/getUnhandledPhone',
        method: 'post',
        data
    })
};

export const getUnhandledSms = data => {
    return axios({
        url: UrlRoot + '/eos/register/getUnhandledSms',
        method: 'post',
        data
    })
};

export const getByPcode = data => {
    return axios({ //字典表数据
        url: UrlRoot + '/emergency/preparation/dictionary/getByPcode',
        method: 'post',
        data
    });
};

export const disposeEvent = data => {
    return axios({ //处置未完成的传真、短信、电话
        url: UrlRoot + '/eos/register/disposeEvent',
        method: 'post',
        data
    });
};

export const imgToText = data => {
    return axios({ //ORR 图片转为文字
        url: UrlRoot + '/eos/communication/fax/imgToText',
        method: 'post',
        data
    });
};

export const splitToJpgs = data => {
    return axios({ //ORR 读取数据库图片每页转为文字
        url: UrlRoot + '/fax/splitToJpgs', // '/eos/communication/fax/splitToJpgs'
        method: 'post',
        data
    });
};

// export const splitToJpgs = data => {
//     return axios({ //ORR 读取数据库图片每页转为文字
//         url: UrlRoot + '/huaweiCloud/huaweiOcr',
//         method: 'post',
//         data
//     });
// };

export const rotatePdf = data => {
    return axios({ //ORR 顺序旋转
        url: UrlRoot + '/eos/communication/fax/saveRotatePdf',
        method: 'post',
        data
    });
};

export const getFileUrl = data => {
    return axios({ //ORR 读取数据库图片每页转为文字
        url: UrlRoot + '/eos/communication/fax/getTiff',
        method: 'post',
        data
    });
};

export const pdfToText = data => {
    return axios({ //ORR 读取数据库图片当前页转为文字
        url: UrlRoot + '/eos/communication/fax/pdfToText',
        method: 'post',
        data
    });
};

export const ocrResult = data => {
    return axios({ //ORR 修改后图片当前页转为文字
        url: UrlRoot + '/eos/communication/fax/getOcrResul',
        method: 'post',
        data
    });
};

export const faxFileToText = data => {
    return axios({ //ORR 修改后的每页转为文字
        url: UrlRoot + '/eos/communication/fax/faxFileToText',
        method: 'post',
        data
    });
};

export const saveOcrResult = data => {
    return axios({ //ORR 修改图片每页转为文字
        url: UrlRoot + '/fax/saveOcrResult',
        method: 'post',
        data
    });
};

export const ocrResultList = data => {
    return axios({ // 根据传真ID获取所有OCR转文字结果
        url: UrlRoot + '/fax/getOcrResultList',
        method: 'post',
        data
    });
};

export const relateEvent = data => {
    return axios({ //短信、传真、电话关联事件
        url: UrlRoot + '/eos/register/relateEvent',
        method: 'post',
        data
    });
};

export const dutyH5Sms = data => {
    return axios({ //信息核实---H5短信下发
        url: UrlRoot + '/eos/communication/sms/dutyH5Sms',
        method: 'post',
        data
    });
};

export const audioUrl = data => {
    return axios({ //获取电话录音文件
        // url: UrlRoot + '/eos/communication/phone/getUrl',
        url: UrlRoot + '/eos/communication/contactor/getUrl',
        method: 'post',
        data
    });
};

export const phoneToText = data => {
    return axios({ //获取电话录音转文本的内容
        url: UrlRoot + '/eos/communication/contactor/phoneToText',
        method: 'post',
        data
    });
};


export const gliaisonGroupList = data => {
    return axios({ //获取电话录音转文本的内容
        url: UrlRoot + '/eos/communication/group/gliaisonGroupList',
        method: 'post',
        data
    });
};
export const dutyGroupList = data => {
    return axios({ //获取电话录音转文本的内容
        url: UrlRoot + '/eos/communication/group/dutyGroupList',
        method: 'post',
        data
    });
};

export const shortcutGroupList = data => {
    return axios({ //获取快捷联络网数据
        url: UrlRoot + '/eos/communication/group/quickGroupList',
        method: 'post',
        data
    });
};

export const cutWav = data => {
    return axios({ //音频截取转文字
        url: UrlRoot + '/eos/communication/phone/cutWav',
        method: 'post',
        data,
        responseType: 'arraybuffer',
    });
};

export const recentDayContactor = data => {
    return axios({ //电话查找最近三天联系人
        url: UrlRoot + '/eos/communication/contactor/recentDayContactor',
        method: 'post',
        data
    });
};

export const preplanList = data => {
    return axios({ //vdcp会议预案——分页获取
        url: UrlRoot + '/conference/preplan/list',
        method: 'post',
        data
    });
};

export const preplanDelete = data => {
    return axios({ //vdcp会议预案——删除
        url: UrlRoot + '/conference/preplan/delete',
        method: 'post',
        data
    });
};

export const preplanListContactor = data => {
    return axios({ //vdcp获取会议预案联系人
        url: UrlRoot + '/conference/preplan/listContactor',
        method: 'post',
        data
    });
};

export const conferenceList = data => {
    return axios({ //vdcp会议——查询
        url: UrlRoot + '/conference/list',
        method: 'post',
        data
    });
};

export const perplanTree = data => {
    return axios({ //vdcp会议——查询
        url: UrlRoot + '/conference/perplan/tree',
        method: 'post',
        data
    });
};

export const preplanAdd = data => {
    return axios({ //vdcp会议——选中表格联系人保存
        url: UrlRoot + '/conference/preplan/add',
        method: 'post',
        data
    });
};

export const preplanUpdate = data => {
    return axios({ //vdcp会议——选中表格联系人保存
        url: UrlRoot + '/conference/preplan/update',
        method: 'post',
        data
    });
};


export const recentContactorConference = data => {
    return axios({ //会议-查找最近联系人分组
        url: UrlRoot + '/eos/communication/contactor/recentContactorConference',
        method: 'post',
        data
    })
};

export const videoList1 = data => {
    return axios({ //会议-查找视频分组
        url: UrlRoot + '/eos/communication/video/videoList1',
        method: 'post',
        data
    })
};

export const talkGroupList1 = data => {
    return axios({ //会议-查找终端分组
        url: UrlRoot + '/eos/communication/terminal/talkGroupList1',
        method: 'post',
        data
    })
};

export const contactorList1 = data => {
    return axios({ //会议-查找政务联络网分组
        url: UrlRoot + '/eos/communication/group/contactorList1',
        method: 'post',
        data
    })
};

export const groupTalkTalkGroupList1 = data => {
    return axios({ //会议-查找集群分组
        url: UrlRoot + '/eos/communication/groupTalk/talkGroupList1',
        method: 'post',
        data
    })
};

export const emergencyAddressBook1 = data => {
    return axios({ //预案联系人
        url: UrlRoot + '/eos/communication/preplan/emergencyAddressBook1',
        method: 'post',
        data
    })
};

export const preplanListAll = data => {
    return axios({ //会议历史获取全部
        url: UrlRoot + '/conference/preplan/listAll',
        method: 'post',
        data
    })
};

export const listContactorNotNull = data => {
    return axios({ //获取会议预案联系人(号码不为空)
        url: UrlRoot + '/conference/preplan/listContactorNotNull',
        method: 'post',
        data
    })
};

export const vdcConfStart = data => {
    return axios({ //开始会议记录
        url: UrlRoot + '/conference/start',
        method: 'post',
        data
    })
};
export const vdcConfJoin = data => {
    return axios({ //加入会议记录
        url: UrlRoot + '/conference/join',
        method: 'post',
        data
    })
};
export const vdcConfFinish = data => {
    return axios({ //会议结束记录
        url: UrlRoot + '/conference/finish',
        method: 'post',
        data
    })
};
export const emergencyGroupList = data => {
    return axios({ //
        url: UrlRoot + '/eos/communication/group/emergencyGroupList',
        method: 'post',
        data
    })
};
export const getAreaListByPid = params => {
    return axios({ //
        url: UrlRoot + '/eos/system/area/getListByPid',
        method: 'get',
        params
    })
};
export const updateAreaOrder = data => {
    return axios({ //
        url: UrlRoot + '/eos/system/area/updateOrder',
        method: 'post',
        data
    })
};

export const provinceMD5 = data => {
    return axios({ //获取省厅报送加密后的参数
        url: UrlRoot + '/eos/event/othersystem/provinceMD5',
        method: 'post',
        data
    })
};

export const reportEvent = data => {
    return axios({ //获取省厅报送接口
        url: UrlRoot + '/eos/event/othersystem/reportEvent',
        method: 'post',
        data
    })
};

export const stSelectEvent = data => {
    return axios({ //获取查询
        url: UrlRoot + '/eos/event/othersystem/selectEvent',
        method: 'post',
        data
    })
};

export const searchPhoneGruopList = data => {
    return axios({ //信息处置，搜索通讯录
        url: UrlRoot + '/eos/register/searchPhoneGruopList',
        method: 'post',
        data
    })
};

export const dutyDetail = data => {
    return axios({ //值班管理，班次详情
        url: UrlRoot + '/eos/duty/dutyFrequency/detail',
        method: 'post',
        data
    })
};

export const getContactorHistory = data => {
    return axios({ //获取联系人历史变更
        url: UrlRoot + '/eos/communication/contactor/getContactorHistory',
        method: 'post',
        data
    })
};

export const getFaxTypeSelections = data => {
    return axios({ //传真历史，来文类型
        url: UrlRoot + '/eos/history/getFaxTypeSelections',
        method: 'post',
        data
    })
};


export const faxDelete = data => {
    return axios({ //传真历史，删除传真
        url: UrlRoot + '/eos/communication/fax/delete',
        method: 'post',
        data
    })
};

export const listFaxDeleted = data => {
    return axios({ //传真历史，传真回收站
        url: UrlRoot + '/eos/communication/fax/listFaxDeleted',
        method: 'post',
        data
    })
};

export const deleteFaxInRecycleBin = data => {
    return axios({ //传真历史，回收站删除传真
        url: UrlRoot + '/eos/communication/fax/deleteFaxInRecycleBin',
        method: 'post',
        data
    })
};

export const deleteAllInRecycleBin = data => {
    return axios({ //传真历史，回收站删除传真
        url: UrlRoot + '/eos/communication/fax/deleteAllInRecycleBin',
        method: 'post',
        data
    })
};

export const faxRecover = data => {
    return axios({ //传真历史，还原传真
        url: UrlRoot + '/eos/communication/fax/recover',
        method: 'post',
        data
    })
};

export const sendfaxGroupList = data => {
    return axios({ //传真历史---发送记录
        url: UrlRoot + '/eos/history/faxGroupList',
        method: 'post',
        data
    })
};

export const findFaxGroup = data => {
    return axios({ //传真历史---发送记录获取联系人
        url: UrlRoot + '/eos/history/findFaxGroup',
        method: 'post',
        data
    })
};

// 内部文档
export const listClass = data => {
    return axios({ //内部文档，树
        url: UrlRoot + '/eos/document/listClass',
        method: 'post',
        data
    })
};

export const addlistClass = data => {
    return axios({ //内部文档，新增文档树
        url: UrlRoot + '/eos/document/addClass',
        method: 'post',
        data
    })
};

export const updatelistClass = data => {
    return axios({ //内部文档，修改文档树
        url: UrlRoot + '/eos/document/updateClass',
        method: 'post',
        data
    })
};

export const deleteClasslistClass = data => {
    return axios({ //内部文档，删除文档树
        url: UrlRoot + '/eos/document/deleteClass',
        method: 'post',
        data
    })
};

export const orderlistClass = data => {
    return axios({ //内部文档，排序文档树
        url: UrlRoot + '/eos/document/order',
        method: 'post',
        data
    })
};

export const listFileClass = data => {
    return axios({ //内部文档，分页获取文档
        url: UrlRoot + '/eos/document/listFile',
        method: 'post',
        data
    })
};

export const addFileClass = data => {
    return axios({ //内部文档，新增文档
        url: UrlRoot + '/eos/document/addFile',
        method: 'post',
        data
    })
};

export const detailFileClass = data => {
    return axios({ //内部文档，查看文档
        url: UrlRoot + '/eos/document/detail',
        method: 'post',
        data
    })
};

export const documentList = data => {
    return axios({ //内部文档，获取文档历史
        url: UrlRoot + '/eos/document/getHistory',
        method: 'post',
        data
    })
};

export const documentRestore = data => {
    return axios({ //内部文档，还原文档
        url: UrlRoot + '/eos/document/restore',
        method: 'post',
        data
    })
};

export const deleteFileClass = data => {
    return axios({ //内部文档，表格删除文档
        url: UrlRoot + '/eos/document/deleteFile',
        method: 'post',
        data
    })
};

export const updateFileClass = data => {
    return axios({ //内部文档，表格修改文档
        url: UrlRoot + '/eos/document/updateFile',
        method: 'post',
        data
    })
};

export const confirmDutyLog = data => {
    return axios({ //确认交接班信息
        url: UrlRoot + '/eos/duty/dutyLog/confirm',
        method: 'post',
        data
    })
};

export const resourceGroupList = data => {
    return axios({ //资源通讯录
        url: UrlRoot + '/eos/communication/group/resourceGroupList',
        method: 'post',
        data
    })
};

export const convertHtmlPDF = data => {
    return axios({ //富文本编辑后的预览
        url: UrlRoot + '/eos/communication/fax/convertHtmlPDF',
        method: 'post',
        data
    })
};
export const faxQueuelistAll = data => {
    return axios({ //获取传真队列
        // url: UrlRoot + '/eos/communication/faxQueue/listAll',
        url: UrlRoot + '/eos/communication/fax/listAll',
        method: 'post',
        data
    })
};
export const faxQueuefindByName = data => {
    return axios({ //获取传真详情
        url: UrlRoot + '/eos/communication/faxQueue/findByName',
        method: 'post',
        data
    })
};

export const faxQueuedeleteAll = data => {
    return axios({ //撤销全部待发传真
        url: UrlRoot + '/eos/communication/faxQueue/deleteAll',
        method: 'post',
        data
    })
};
export const faxReSendFax = data => {
    return axios({ //重发传真
        url: UrlRoot + '/eos/communication/fax/reSendFax',
        method: 'post',
        data
    })
};
export const faxQueuedelete = data => {
    return axios({ //撤销待发传真
        url: UrlRoot + '/eos/communication/faxQueue/delete',
        method: 'post',
        data
    })
};
export const faxmergePdf = data => {
    return axios({ //传真合并
        url: UrlRoot + '/eos/communication/fax/mergePdf',
        method: 'post',
        data
    })
};

export const getRemindStatus = data => {
    return axios({ //获取是否需要提醒
        url: UrlRoot + '/ctiOperator/getRemindStatus',
        method: 'post',
        data
    })
};
export const getMsgOperatorSign = data => {
    return axios({ // 获取短信预览头部签名
        url: UrlRoot + '/eos/communication/sms/getSmsOperatorSign',
        method: 'get',
        data
    })
}

export const helperGetTree = data => {
    return axios({ //电话助手---获取模板树
        url: UrlRoot + '/eos/communication/helper/getTree',
        method: 'post',
        data
    })
};

export const helpergetHelper = data => {
    return axios({ //电话助手---获取模板内容
        url: UrlRoot + '/eos/communication/helper/getHelper',
        method: 'post',
        data
    })
};

export const updateContactorGroupOrder = data => {
    return axios({ //更新联系人分组顺序
        url: UrlRoot + '/eos/communication/group/updateOrder',
        method: 'post',
        data
    })
};

export const updateOrderReplenish = data => {
    return axios({ //更新联系人分组顺序
        url: UrlRoot + '/eos/communication/group/updateOrderReplenish',
        method: 'post',
        data
    })
};

export const reverseValidatedNumber = data => {
    return axios({ //将包含前缀的号码还原为原号码
        url: UrlRoot + '/eos/communication/phone/reverseValidatedNumber',
        method: 'post',
        data
    })
};

export const getFaxTemplateTree = data => {
    return axios({ //传真模板----获取传真模板树
        url: UrlRoot + '/eos/communication/faxTemplate/getTree',
        method: 'post',
        data
    })
};

export const addFaxTemplateTree = data => {
    return axios({ //传真模板----新增传真模板树
        url: UrlRoot + '/eos/communication/faxTemplate/add',
        method: 'post',
        data
    })
};

export const updateFaxTemplateTree = data => {
    return axios({ //传真模板----修改传真模板树
        url: UrlRoot + '/eos/communication/faxTemplate/update',
        method: 'post',
        data
    })
};

export const deleteFaxTemplateTree = data => {
    return axios({ //传真模板----删除传真模板树
        url: UrlRoot + '/eos/communication/faxTemplate/delete',
        method: 'post',
        data
    })
};

export const eventGetByPcodes = data => {
    return axios({ //获取处置状态
        url: UrlRoot + '/emergency/preparation/dictionary/getByPcode',
        method: 'post',
        data
    })
};

export const disposePhone = data => {
    return axios({ //获取处置状态
        url: UrlRoot + '/eos/register/disposePhone',
        method: 'post',
        data
    })
};
export const disposeSms = data => {
    return axios({ //获取处置状态
        // url: UrlRoot + '/eos/register/disposeSms',
        url: UrlRoot + '/eos/sms/register/disposeSms',
        method: 'post',
        data
    })
};

export const disposeFax = data => {
    return axios({ //更新传真历史
        url: UrlRoot + '/eos/register/disposeFax',
        method: 'post',
        data
    })
};

export const getShowHistory = data => {
    return axios({ //查看历史
        // url: UrlRoot + '/eos/register/showHistory',
        url: UrlRoot + '/eos/register/showHistory',
        method: 'post',
        data
    })
};

export const removeRecord = data => {
    return axios({ //删除历史记录
        // url: UrlRoot + '/eos/register/showHistory',
        url: UrlRoot + '/eos/register/showHistory',
        method: 'post',
        data
    })
};

export const previewPdf = data => {
    return axios({ //预览PDF
        url: UrlRoot + '/eos/communication/pdf/previewName',
        method: 'post',
        data
    })
};

export const getGroup = data => {
    return axios({ //查看历史
        url: UrlRoot + '/eos/communication/group/getGroup',
        method: 'post',
        data
    })
};


export const getNumberArea = data => {
    return axios({ //查询号码归属地
        url: UrlRoot + '/eos/communication/phone/getNumberArea',
        method: 'post',
        data
    })
};

export const getDeptChildren = data => {
    return axios({ //查询下级单位
        url: UrlRoot + '/eos/dept/getChildren',
        method: 'get',
        data
    })
};

export const sendInstructionToLowerDept = data => {
    return axios({ // 联动传达下发批示到下级部门
        url: UrlRoot + '/eos/event/approval/sendInstructionToLowerDept',
        method: 'post',
        data
    })
};

export const monthlyListInLowerDept = data => {
    return axios({ // 获取下级部门当月排班
        url: UrlRoot + '/eos/duty/dutyPlan/monthlyListInLowerDept',
        method: 'post',
        data
    })
};

export const getMissCalls = data => {
    return axios({ // 获取未接来电
        url: UrlRoot + '/eos/communication/phone/getMissCalls',
        method: 'post',
        data
    })
};

export const getUnreadSms = data => {
    return axios({ // 获取未接短信
        url: UrlRoot + '/eos/history/getUnreadSms',
        method: 'post',
        data
    })
};

export const getUnreadFax = data => {
    return axios({ // 获取未接传真
        url: UrlRoot + '/eos/history/getUnreadFax',
        method: 'post',
        data
    })
};

export const handleMissCalls = data => {
    return axios({ // 处理未接来电
        url: UrlRoot + '/eos/communication/phone/handleMissCalls',
        method: 'post',
        data
    })
};

export const faxContactorList = data => {
    return axios({ // 获取联系人记录
        url: UrlRoot + '/eos/history/faxContactorList',
        method: 'post',
        data
    })
};

export const findFaxListByContactId = data => {
    return axios({ // 获取联系人的发送记录
        url: UrlRoot + '/eos/history/findFaxListByContactId',
        method: 'post',
        data
    })
};


export const getLowerDeptUpdateTime = data => {
    return axios({ // 下级报告
        url: UrlRoot + '/eos/duty/dutyInformationReport/getLowerDeptUpdateTime',
        method: 'post',
        data
    })
};

export const getReportListInLowerDept = data => {
    return axios({ // 下级报告
        url: UrlRoot + '/eos/duty/dutyInformationReport/getReportListInLowerDept',
        method: 'post',
        data
    })
};

export const getReportListInDetail = data => {
    return axios({ // 下级报告
        url: UrlRoot + '/eos/duty/dutyInformationReport/detail',
        method: 'post',
        data
    })
};

export const getToken = params => {
    return axios({ // 获取登录token
        url: UrlRoot + '/getToken',
        method: 'get',
        params
    })
};

export const uploadEvent = data => {
    return axios({ // 上传附件
        url: UrlRoot + '/upload/uploadEventDealAttachment',
        method: 'post',
        data
    })
};
export const getLicenseExpireTime = params => {
    return axios({ // 获取登录页LicenseExpireTime时间
        url: UrlRoot + '/license/getLicenseExpireTime',
        method: 'get',
        params
    })
};

export const listWater = data => {
    return axios({ // 获取城市用水
        url: UrlRoot + '/eos/city/listWater',
        method: 'post',
        data
    })
};

export const saveWater = data => {
    return axios({ // 保存城市用水
        url: UrlRoot + '/eos/city/addWater',
        method: 'post',
        data
    })
};

export const listGarbate = data => {
    return axios({ // 获取生活垃圾
        url: UrlRoot + '/eos/city/listGarbate',
        method: 'post',
        data
    })
};

export const listQuality = params => {
    return axios({ // 空气质量接口
        url: UrlRoot + '/eos/appCity/quality/list',
        method: 'get',
        params
    })
};

export const listQualitysaveOrUpdate = data => {
    return axios({ // 空气质量新增和修改
        url: UrlRoot + '/eos/appCity/quality/saveOrUpdate',
        method: 'post',
        data
    })
};
export const listWeather = data => {
    return axios({ // 天气情况接口
        url: UrlRoot + '/eos/appCity/weather/list',
        method: 'post',
        data
    })
};
export const saveOrUpdateweather = data => {
    return axios({ // 天气情况新增接口
        url: UrlRoot + '/eos/appCity/weather/saveOrUpdate',
        method: 'post',
        data
    })
};

export const listWaters = data => {
    return axios({ // PC端城市运行水电气热接口
        url: UrlRoot + '/eos/appCity/water/list',
        method: 'post',
        data
    })
};

export const savewaterOrUpdate = data => {
    return axios({ // PC端城市运行水电气热新增便捷接口
        url: UrlRoot + '/eos/appCity/water/batchSave',
        method: 'post',
        data
    })
};


export const getMould = (params) => {
    return axios({ // 城市运行-查询模板
        url: UrlRoot + '/eos/appCity/wordSignature',
        method: 'get',
        params
    })
};
export const setMould = (params) => {
    return axios({ // 城市运行-修改模板
        url: UrlRoot + '/eos/appCity/wordSignature',
        method: 'post',
        params
    })
};
export const outputWord = (params) => {
    return axios({ // 导出word文档
        url: UrlRoot + '/eos/appCity/outputWord',
        method: 'get',
        params
    })
};

export const appCityReportH5Sms = data => {
    return axios({ // 下发短信
        url: UrlRoot + '/eos/appCity/reportH5Sms',
        method: 'post',
        data
    })
};

export const saveGarbage = data => {
    return axios({ // 保存生活垃圾
        url: UrlRoot + '/eos/city/addGarbage',
        method: 'post',
        data
    })
};

export const listEnergy = data => {
    return axios({ // 获取能源
        url: UrlRoot + '/eos/city/listEnergy',
        method: 'post',
        data
    })
};

export const saveEnergy = data => {
    return axios({ // 保存能源
        url: UrlRoot + '/eos/city/addEnergy',
        method: 'post',
        data
    })
};

export const saveGas = data => {
    return axios({ // 保存能源燃气
        url: UrlRoot + '/eos/city/addGas',
        method: 'post',
        data
    })
};

export const listMuck = data => {
    return axios({ // 获取渣土
        url: UrlRoot + '/eos/city/listMuck',
        method: 'post',
        data
    })
};

export const saveMuck = data => {
    return axios({ //保存渣土
        url: UrlRoot + '/eos/city/addMuck',
        method: 'post',
        data
    })
};

export const sjsEventStat = data => {
    return axios({ //石景山事件统计数据
        url: UrlRoot + '/eos/statistics/eventStatController/sjsEventStat',
        method: 'post',
        data
    })
}

export const exportSjsEventListToExcel = data => {
    return axios({ //石景山事件统计数据
        url: UrlRoot + '/eos/statistics/eventStatController/exportSjsEventListToExcel',
        method: 'post',
        data
    })
}

export const getSjsEventList = data => {
    return axios({ //石景山事件统计数据
        url: UrlRoot + '/eos/statistics/eventStatController/sjsEventList',
        method: 'post',
        data
    })
}

export const reloadGroupInfo = data => {
    return axios({ //更新终端接口
        url: UrlRoot + '/eos/communication/video/reloadGroupInfo',
        method: 'post',
        data
    })
}

export const reloadDeviceInfo = data => {
    return axios({ //更新设备接口
        url: UrlRoot + '/eos/communication/video/reloadDeviceInfo',
        method: 'post',
        data
    })
}


export const beijingReloadDeviceInfo = data => {
    return axios({ //石景山更新设备接口 更新终端接口
        url: UrlRoot + '/sjs/video/syncVideo',
        method: 'post',
        data
    })
}


export const getAllContactorByClassId = data => {
    return axios({ //根据班次id查询值班人员
        url: UrlRoot + '/eos/duty/sjsDutyContactor/getAllContactorByClassId',
        method: 'post',
        data
    })
}
export const getContactorByClassId = data => {
    return axios({ //根据班次id分页查询值班人员
        url: UrlRoot + '/eos/duty/sjsDutyContactor/getContactorByClassId',
        method: 'post',
        data
    })
}

export const addDutyContactor = data => {
    return axios({ //新增值班人员
        url: UrlRoot + '/eos/duty/sjsDutyContactor/add',
        method: 'post',
        data
    })
}

export const deleteDutyContactor = data => {
    return axios({ //删除值班人员
        url: UrlRoot + '/eos/duty/sjsDutyContactor/delete',
        method: 'post',
        data
    })
}

export const saveOrUpdate = data => {
    return axios({ //保存或修改班次
        url: UrlRoot + '/app/sjs/duty/classes/saveorupdate',
        method: 'post',
        data
    })
}


export const deletedClasses = data => {
    return axios({ //删除班次管理
        url: UrlRoot + '/app/sjs/duty/classes/deletedclasses',
        method: 'post',
        data
    })
}

export const deletedClassesTime = data => {
    return axios({ //删除班次的其中一个时间段
        url: UrlRoot + '/app/sjs/duty/classes/deletedclassestime',
        method: 'post',
        data
    })
}

export const addRule = data => {
    return axios({ //值班人员---添加挂起规则
        url: UrlRoot + '/eos/duty/sjsDutyContactor/addRule',
        method: 'post',
        data
    })
}

export const getRule = data => {
    return axios({ //值班人员---获取挂起规则
        url: UrlRoot + '/eos/duty/sjsDutyContactor/getRule',
        method: 'post',
        data
    })
}

export const addAllRule = data => {
    return axios({ //值班人员---添加全部挂起规则
        url: UrlRoot + '/eos/duty/sjsDutyContactor/addAllRule',
        method: 'post',
        data
    })
}
export const getRuleList = params => {
    return axios({ //根据月份查询所有班次(值班人员处使用)
        url: UrlRoot + '/app/sjs/duty/classes/list',
        method: 'get',
        params
    })
}

export const getStatisticsList = params => {
    return axios({ //根据月份查询所有班次(值班人员排班统计处使用)
        url: UrlRoot + '/eos/duty/sjsDutyContactor/getAllByTime',
        method: 'get',
        params
    })
}

export const automaticList = params => {
    return axios({ //月自动排班
        url: UrlRoot + '/app/sjs/duty/automaticList',
        method: 'get',
        params
    })
}

export const getDutyList = params => {
    return axios({ //根据月份获取值班排班表
        url: UrlRoot + '/app/sjs/duty/list',
        method: 'get',
        params
    })
}

export const clearDuty = params => {
    return axios({ //重置排班
        url: UrlRoot + '/app/sjs/duty/clear',
        method: 'get',
        params
    })
}

export const deleteDuty = params => {
    return axios({ //重置排班
        url: UrlRoot + '/eos/duty/dutyPlan/delete',
        method: 'get',
        params
    })
}

export const saveDuty = data => {
    return axios({ //保存排班
        url: UrlRoot + '/app/sjs/duty/save',
        method: 'post',
        data
    })
}

export const dutyCopy = params => {
    return axios({ //复制排班
        url: UrlRoot + '/app/sjs/duty/copy',
        method: 'get',
        params
    })
}

export const getRuleByClassId = data => {
    return axios({ //获取挂起规则
        url: UrlRoot + '/eos/duty/sjsDutyContactor/getRuleByClassId',
        method: 'post',
        data
    })
}
export const getPageClasses = params => {
    return axios({ //查询班次列表(带分页)
        url: UrlRoot + '/app/sjs/duty/classes/page',
        method: 'get',
        params
    })
}

// export const getPeople = params => {
//     return axios({ //获取值班人员
//         url: UrlRoot + '/eos/duty/sjsDutyContactor/getPeople',
//         method: 'get',
//         params
//     })
// }
export const getPeople = data => {
  return axios({ //获取值班人员
      url: UrlRoot + '/eos/duty/sjsDutyContactor/getPeople',
      method: 'post',
      data
  })
}
export const getOutputTemplate = params => {
    return axios({ //获取值班排班导入模板
        url: window.SITE_CONFIG["event"] + '/app/sjs/duty/outputTemplate',
        method: 'get',
        params
    })
}
export const inputExcelFun = data => {
    return axios({ //导入值班排班
        url: window.SITE_CONFIG["event"] + '/app/sjs/duty/inputExcel',
        method: 'post',
        data
    })
}

export const searchDutyPeople = data => {
    return axios({ //获取值班人员
        url: UrlRoot + '/eos/duty/sjsDutyContactor/searchDutyPeople',
        method: 'post',
        data
    })
}

export const deleteRule = data => {
    return axios({ //值班人员---删除规则
        url: UrlRoot + '/eos/duty/sjsDutyContactor/deleteRule',
        method: 'post',
        data
    })
}

export const orderClass = data => {
    return axios({ //班次排序
        url: UrlRoot + '/app/sjs/duty/classes/order',
        method: 'post',
        data
    })
}

export const splitRecord = data => {
    return axios({ //切割录音
        url: UrlRoot + '/eos/communication/phone/splitRecord',
        method: 'post',
        data
    })
}

export const affairsClasses = params => {
    return axios({ // 政务值班-获取政务值班
        url: UrlRoot + '/app/sjs/duty/affairsClasses/list',
        method: 'get',
        params
    })
}

export const affairsGroup = params => {
    return axios({ // 政务值班-获取当月的排班记录
        url: UrlRoot + '/app/sjs/duty/affairsGroup/list',
        method: 'get',
        params
    })
}

export const dateGroup = params => {
    return axios({ // 政务值班-获取当月的部门记录
        url: UrlRoot + '/app/sjs/duty/dateGroup/list',
        method: 'get',
        params
    })
}

export const dateGroupSave = data => {
    return axios({ // 政务值班-保存当天的部门记录
        url: UrlRoot + '/app/sjs/duty/dateGroup/save',
        method: 'post',
        data
    })
}

export const sendSms = data => {
    return axios({ // 政务值班-排班任务下发
        url: UrlRoot + '/app/sjs/duty/dateGroup/sendSms',
        method: 'post',
        data
    })
}

export const unitScheduling = params => {
    return axios({ // 政务值班-单位排班
        url: UrlRoot + '/app/sjs/duty/affairs/groupSetting/automatic',
        method: 'get',
        params
    })
}

export const saveUnit = data => {
    return axios({ // 政务值班-保存采集单位管理
        url: UrlRoot + '/app/sjs/duty/affairs/groupSetting/saveAll',
        method: 'post',
        data
    })
}

export const delUnit = data => {
    return axios({ // 政务值班-删除采集单位管理
        url: UrlRoot + '/app/sjs/duty/affairs/groupSetting/delete',
        method: 'post',
        data
    })
}

export const deptTree = params => {
    return axios({ // 政务值班-获取采集单位管理部门树型数据
        url: SITE_CONFIG + '/sys/platform/getChildrenPlatform',
        method: 'get',
        params
    })
}

export const collectionUnitList = params => {
    return axios({ // 政务值班-获取采集单位管理已保存的单位列表
        url: UrlRoot + '/app/sjs/duty/affairs/groupSetting/list',
        method: 'get',
        params
    })
}

export const deduplicationPage = params => {
    return axios({ // 政务值班-获取分组选择历史
        url: UrlRoot + '/app/sjs/duty/dateGroup/getDeduplicationPage',
        method: 'get',
        params
    })
}

export const deduplicationList = params => {
    return axios({ // 政务值班-获取所有已选择的排班(去重)
        url: UrlRoot + '/app/sjs/duty/dateGroup/getDeduplicationList',
        method: 'get',
        params
    })
}

export const contactorHistory = params => {
    return axios({ // 政务值班-获取最近选择的联系人
        url: UrlRoot + '/app/sjs/duty/dateGroup/getContactorClickHistory',
        method: 'get',
        params
    })
}

export const getListByGroup = params => {
    return axios({ // 查询已排班日期
        url: UrlRoot + '/app/sjs/duty/dateGroup/getListByGroup',
        method: 'get',
        params
    })
}

export const affairsClassesSaveOrUpdate = data => {
    return axios({ // 政务值班-保存或更新值班
        url: UrlRoot + '/app/sjs/duty/affairsClasses/saveOrUpdate',
        method: 'post',
        data
    })
}
export const affairsGroupSaveOrUpdate = data => {
    return axios({ // 政务值班-批量保存或更新当天的记录
        url: UrlRoot + '/app/sjs/duty/affairsGroup/saveOrUpdate',
        method: 'post',
        data
    })
}
export const affairsClassesDelete = data => {
    return axios({ // 政务值班-删除值班
        url: UrlRoot + '/app/sjs/duty/affairsClasses/delete',
        method: 'post',
        data
    })
}
export const affairsGroupDelete = data => {
    return axios({ // 政务值班-清空当天的记录
        url: UrlRoot + '/app/sjs/duty/affairsGroup/delete',
        method: 'post',
        data
    })
}

export const getOneByDate = params => {
    return axios({ // 政务值班-获取当天值班
        url: UrlRoot + '/app/sjs/duty/affairsGroup/getOneByDate',
        method: 'get',
        params
    })
}

export const affairsTypeList = params => {
    return axios({ //获取政务类型列表
        url: UrlRoot + '/app/sjs/affairsType/list',
        method: 'get',
        params
    })
}

export const getConfirmList = params => {
    return axios({ //获取政务类型列表
        url: UrlRoot + '/eos/event/approval/getConfirmList',
        method: 'get',
        params
    })
}
export const saveReportHistory = data => {
    return axios({ //保存报送给省厅的事件信息记录（没用到）
        url: UrlRoot + '/eos/event/othersystem/saveReportHistory',
        method: 'post',
        data
    })
}

export const findCaseClassByCode = data => {
    return axios({ //通过code查询省厅事件类型
        url: UrlRoot + '/eos/event/othersystem/findCaseClassByCode',
        method: 'post',
        data
    })
}

export const govEventDelete = data => {
    return axios({ //省厅事件删除接口
        url: UrlRoot + '/eos/event/othersystem/eventDelete',
        method: 'post',
        data
    })
}

export const govEventUpdate = data => {
    return axios({ //省厅事件初报续报修改接口
        url: UrlRoot + '/eos/event/othersystem/eventUpdate',
        method: 'post',
        data
    })
}

export const selectEventReportHistory = params => {
    return axios({ //查询省厅事件报送历史
        url: UrlRoot + '/eos/event/othersystem/selectEventReportHistory',
        method: 'get',
        params
    })
}

export const govReportEvent = data => {
    return axios({ //省厅-事件上报
        url: UrlRoot + '/eos/event/othersystem/reportEvent',
        method: 'post',
        data
    })
}

export const selectProvinceCaseClass = data => {
    return axios({ //省厅-事件灾害类型
        url: UrlRoot + '/eos/event/othersystem/selectProvinceCaseClass',
        method: 'post',
        data
    })
}


export const setForwardingPhone = data => {
    return axios({ //融合通讯-电话-设置坐席呼叫转发
        url: UrlRoot + '/eos/communicate/callForwarding/setForwardingPhone',
        method: 'post',
        data
    })
}

export const getSeatDuty = data => {
    return axios({ //融合通讯-电话-自动转接-选择-获取所有班次值班人员
        url: UrlRoot + '/app/sjs/duty/getSeatDuty',
        method: 'post',
        data
    })
}

export const searchDuty = params => {
    return axios({ //融合通讯-电话-自动转接-选择-搜索班次值班人员
        url: UrlRoot + '/app/sjs/duty/search',
        method: 'get',
        params
    })
}

export const delCallForwarding = data => {
    return axios({ //融合通讯-电话-删除坐席呼叫转发配置
        url: UrlRoot + '/eos/communicate/callForwarding/delCallForwarding',
        method: 'post',
        data
    })
}

export const findAppCallForwardingHistory = data => {
    return axios({ //融合通讯-电话-坐席历史呼叫转发列表
        url: UrlRoot + '/eos/communicate/callForwarding/findAppCallForwardingHistory',
        method: 'post',
        data
    })
}

export const findCallForwarding = data => {
        return axios({ //融合通讯-电话-查询已配置的呼叫转发号码
            url: UrlRoot + '/eos/communicate/callForwarding/findCallForwarding',
            method: 'post',
            data
        })
    }
    // 紧急联系人模块.
    // 用户配置
export const getUserConfig = data => {
        return axios({
            url: UrlRoot + '/eos/communication/emergency/unit/getUserConfig',
            method: 'post',
            data
        })
    }
    // 更新用户配置
export const updateUserConfig = data => {
    return axios({
        url: UrlRoot + '/eos/communication/emergency/unit/updateUserConfig',
        method: 'post',
        data
    })
}

// 获取应急联系单位信息
export const unitList = data => {
    return axios({
        url: UrlRoot + '/eos/communication/emergency/unit/list',
        method: 'post',
        data
    })
}

// 获取应急联系表类型
export const classifyList = params => {
    return axios({
        url: UrlRoot + '/eos/communication/emergency/classify/list',
        method: 'get',
        params
    })
}

// 删除应急联系表类型
export const classifyListdelete = params => {
        return axios({
            url: UrlRoot + '/eos/communication/emergency/classify/delete',
            method: 'get',
            params
        })
    }
    // 批量保存应急联系表类型
export const classifyBatchSave = data => {
        return axios({
            url: UrlRoot + '/eos/communication/emergency/classify/batchSave',
            method: 'post',
            data
        })
    }
    // 获取应急联系单位信息
export const classifyGetlist = params => {
        return axios({
            url: UrlRoot + '/eos/communication/emergency/unit/list',
            method: 'get',
            params
        })
    }
    // 更新单位
export const classifyUpdateGetlist = data => {
        return axios({
            url: UrlRoot + '/eos/communication/emergency/unit/update',
            method: 'post',
            data
        })
    }
    // 添加单位
export const classifyAddGetlist = data => {
        return axios({
            url: UrlRoot + '/eos/communication/emergency/unit/add',
            method: 'post',
            data
        })
    }
    // 删除单位
export const classifyDeleteGetlist = params => {
    return axios({
        url: UrlRoot + '/eos/communication/emergency/unit/delete',
        method: 'get',
        params
    })
}

//获取模式列表
export const subordinateModeGetModeList = params => {
        return axios({
            url: UrlRoot + '/eos/duty/subordinateMode/mode/list',
            method: 'get',
            params
        })
    }
    //新增或更新模式
export const subordinateModeSaveMode = data => {
        return axios({
            url: UrlRoot + '/eos/duty/subordinateMode/mode/save',
            method: 'post',
            data
        })
    }
    //删除模式
export const subordinateModeDeleteMode = data => {
        return axios({
            url: UrlRoot + '/eos/duty/subordinateMode/mode/delete',
            method: 'post',
            data
        })
    }
    //根据模式获取班次
export const subordinateModeGetClassesList = params => {
        return axios({
            url: UrlRoot + '/eos/duty/subordinateMode/classes/list',
            method: 'get',
            params
        })
    }
    //保存当前模式的班次
export const subordinateModeSaveClassesList = data => {
        return axios({
            url: UrlRoot + '/eos/duty/subordinateMode/classes/save',
            method: 'post',
            data
        })
    }
    //删除一个模式下的班次
export const subordinateModeDeleteClassesList = data => {
        return axios({
            url: UrlRoot + '/eos/duty/subordinateMode/classes/delete',
            method: 'post',
            data
        })
    }
    //获取模式下的值班角色列表
export const subordinateModeGetRoleList = params => {
        return axios({
            url: UrlRoot + '/eos/duty/subordinateMode/role/list',
            method: 'get',
            params
        })
    }
    //保存或更新值班角色
export const subordinateModeSaveRoleList = data => {
        return axios({
            url: UrlRoot + '/eos/duty/subordinateMode/role/save',
            method: 'post',
            data
        })
    }
    //删除其中一个值班角色
export const subordinateModeDeleteRoleList = data => {
        return axios({
            url: UrlRoot + '/eos/duty/subordinateMode/role/delete',
            method: 'post',
            data
        })
    }
    //获取当月选择部门的所有排班计划
export const subordinateGetAllByDate = params => {
        return axios({
            url: UrlRoot + '/eos/duty/subordinate/getAllByDate',
            method: 'get',
            params
        })
    }
    //获取所有部门
export const subordinateGetAllGroup = params => {
        return axios({
            url: SITE_CONFIG + '/sys/platform/allList',
            method: 'get',
            params
        })
    }
    //保存添加部门
export const subordinateSaveSelectedGroup = data => {
        return axios({
            url: UrlRoot + '/eos/duty/subordinate/svaeDept',
            method: 'post',
            data
        })
    }
    //获取已添加的部门
export const subordinateGetSelectedGroup = params => {
        return axios({
            url: UrlRoot + '/eos/duty/subordinate/getDept',
            method: 'get',
            params
        })
    }
    //获取当月排班模式
export const subordinateGetCurrentMode = params => {
    return axios({
        url: UrlRoot + '/eos/duty/subordinateMode/role/listByDeptAndDate',
        method: 'get',
        params
    })
}

//获取单位分组信息
export const getGroupInfo = params => {
        return axios({
            url: UrlRoot + '/eos/communication/group/groupInfo',
            method: 'get',
            params
        })
    }
    // 统计分析=>值班统计管理
export const getConferenceDutyStatistics = data => {
    return axios({ //获取统计分析分组
        url: UrlRoot + '/eos/duty/rollCallOnDuty/getRollCallOnDutyStatistics',
        method: 'post',
        data
    })
}

// 融合通讯-自动排序
export const autoSort = data => {
    return axios({
        url: UrlRoot + '/eos/communication/contactor/autoSort',
        method: 'post',
        data
    })
}

// 融合通讯-联系人分组排序列表
export const contactorOrderList = data => {
    return axios({
        url: UrlRoot + '/eos/communication/group/contactorOrderList',
        method: 'post',
        data
    })
}

// 请求下载接口前判断是否登录失效
export const verification = data => {
    return axios({ //获取统计分析分组
        url: UrlRoot + '/eos/event/bullitin/verification',
        method: 'post',
        data
    })
}

// 根据电话记录id查找语音转文字结果
export const findRecordTextByPhoneId = data => {
    return axios({
        url: UrlRoot + '/eos/history/findRecordTextByPhoneId',
        method: 'post',
        data
    })
}

// 事件快报-值班机上报
export const pageAioEvent = params => {
    return axios({
        url: UrlRoot + '/eos/event/aioEvent/pageAioEvent',
        method: 'get',
        params
    })
}

// 事件分布分析-导出报告
export const exportWordFromEventAnalysis = params => {
    return axios({
        url: UrlRoot + '/eos/statistics/eventStatController/exportWordFromEventAnalysis',
        method: 'get',
        params
    })
}

// 事件死亡名单 保存or修改
export const saveDeathList = data => {
    return axios({
        url: UrlRoot + '/eos/event/deathList/saveDeathList',
        method: 'post',
        data
    })
}

// 查询死亡名单(带分页)
export const findEventDeathList = data => {
    return axios({
        url: UrlRoot + '/eos/event/deathList/findEventDeathList',
        method: 'post',
        data
    })
}

// 查询身份下拉框的数据
export const findEventDeathListType = data => {
    return axios({
        url: UrlRoot + '/eos/event/deathList/findEventDeathListType',
        method: 'post',
        data
    })
}

// 删除事件死亡名单
export const deleteDeathList = data => {
    return axios({
        url: UrlRoot + '/eos/event/deathList/deleteDeathList',
        method: 'post',
        data
    })
}

// 事件死亡名单 保存多个
export const saveDeathLists = data => {
    return axios({
        url: UrlRoot + '/eos/event/deathList/saveDeathLists',
        method: 'post',
        data
    })
}

// 查询所有死亡名单
export const findEventDeathListByEventId = data => {
    return axios({
        url: UrlRoot + '/eos/event/deathList/findEventDeathListByEventId',
        method: 'post',
        data
    })
}

export const findAllSmsList = data => {
    return axios({ //短信历史 全部短信历史记录
        url: UrlRoot + '/eos/history/findAllSmsList',
        method: 'post',
        data
    })
};

export const getReceiveSms = data => {
    return axios({
        // url: UrlRoot + '/eos/register/getReceiveSms',原来的
        url: UrlRoot + '/eos/communication/sms/getReceiveSms',
        method: 'post',
        data
    })
};

export const findAppDisaster = data => {
    return axios({ //获取全部一键通
        url: UrlRoot + '/eos/communicate/sz/disaster/findAppDisaster',
        method: 'post',
        data
    })
};

export const findAppDisasterPic = data => {
    return axios({ //点某行一键通
        url: UrlRoot + '/eos/communicate/sz/disaster/findAppDisasterPic',
        method: 'post',
        data
    })
};

export const findAppSzXxydyjReport = data => {
    return axios({ //获取全部小型应急平台
        url: UrlRoot + '/eos/communicate/sz/xxydyj/findAppSzXxydyjReport',
        method: 'post',
        data
    })
};

export const findAppSzXxydyjReportAttach = data => {
    return axios({ //点某行小型应急
        url: UrlRoot + '/eos/communicate/sz/xxydyj/findAppSzXxydyjReportAttach',
        method: 'post',
        data
    })
};

// 查询事件续报
export const findEventDealList = data => {
    return axios({
        url: UrlRoot + '/eos/event/report/findEventDealList',
        method: 'post',
        data
    })
}

// 获取融合通讯分组（项目现场配置的分组）
export const contactorGroupsFromDictionary = data => {
        return axios({ //获取融合通讯分组
            url: UrlRoot + '/eos/communication/group/ContactorGroupsFromDictionary',
            method: 'post',
            data
        })
    }
    // 获取报告单位（事件接报）
export const topUnitTree = data => {
    return axios({
        url: UrlRoot + '/eos/system/unit/topUnitTree',
        method: 'post',
        data
    })
}
export const unitSetting = data => {
    return axios({ //区域管理
        url: UrlRoot + '/eos/basics/basicsSettingController/unitSetting',
        method: 'post',
        data
    })
};
// 事件续报保存
export const saveEventDealReport = data => {
    return axios({
        url: UrlRoot + '/eos/event/report/saveEventDeal',
        method: 'post',
        data
    })
}

// 下载系统模板
export const exportTemplate = params => {
    return axios({
        url: UrlRoot + '/eos/event/bullitin/exportTemplate',
        method: 'get',
        params
    })
}

// 扬州完结事件
export const yzEnd = data => {
    return axios({
        url: UrlRoot + '/eos/event/yzEnd',
        method: 'post',
        data
    })
};

// 获取字典表code
export const getByCodeAndParentCode = data => {
    return axios({
        url: UrlRoot + '/emergency/preparation/dictionary/getByCodeAndParentCode',
        method: 'post',
        data
    })
};

export const getEventByPhoneId = data => {
    return axios({
        //电话历史 全部电话历史记录
        url: UrlRoot + "/eos/history/getEventByPhoneId ",
        method: "post",
        data
    });
};
export const getEventBySmsId = data => {
    return axios({ //短信历史 全部短信历史记录
        url: UrlRoot + '/eos/history/getEventBySmsId',
        method: 'post',
        data
    })
};

export const sendEventBulletin = data => {
    return axios({ // 发送事件快报短信
        url: UrlRoot + '/eos/event/appEventDealBulletin/sendOutApprovalForSms',
        method: 'post',
        data
    })
};

export const getEventBulletinHistory = params => {
    return axios({ // 获取通讯历史数据
        url: UrlRoot + '/eos/event/appEventDealBulletin/getCommHistory',
        method: 'get',
        params
    })
};


export const superiorReadEvent = data => {
    return axios({ // 信息处置-系统上报-上级阅读下级上报事件
        url: UrlRoot + '/eos/event/receive/superiorReadEvent',
        method: 'post',
        data
    })
};

export const getEventPageNum = params => {
    return axios({ // 信息处置-系统上报-获取事件在列表中的页数
        url: UrlRoot + '/eos/event/getEventPageNum',
        method: 'get',
        params
    })
};

// 值班管理=>新版值班点名=>获取月所有单位数据
export const getMonthAllDepartment = data => {
  return axios({
      url: UrlRoot + '/eos/duty/rollCallOnDuty/countByCode',
      method: 'post',
      data
  })
};

// 值班管理=>新版值班点名=>点名通知-获取岗位和部门数据
export const getDutyAndPosition = data => {
  return axios({
      url: UrlRoot + '/eos/duty/rollCallOnDuty/getAllContactor',
      method: 'post',
      data
  })
};

export const getPostData = data => {
  return axios({ // 获取所有岗位下拉数据
      url: UrlRoot + '/eos/communication/contactor/getAllPost',
      method: 'post',
      data
  })
};

// 值班管理=>新版值班点名=>点名通知-选择单位加载的部门数据
export const departmentGroupList = data => {
  return axios({
      url: UrlRoot + '/eos/duty/rollCallOnDuty/getDept',
      method: 'post',
      data
  })
};

// 值班管理=>新版值班点名=>获取模板
export const getTemplate = data => {
  return axios({
      url: UrlRoot + '/eos/duty/rollCallOnDuty/groupCollection',
      method: 'post',
      data
  })
};

// 值班管理=>新版值班点名=>获取日所有单位数据
export const departmentListBy = data => {
  return axios({
      url: UrlRoot + '/eos/duty/rollCallOnDuty/listBy',
      method: 'post',
      data
  })
};

// 值班管理=>新版值班点名=>保存或者修改模板
export const templateSaveOrUpdate = data => {
  return axios({
      url: UrlRoot + '/eos/duty/rollCallOnDuty/saveOrUpdateModel',
      method: 'post',
      data
  })
};

// 值班管理=>新版值班点名=>删除模板
export const templateDelete = data => {
  return axios({
      url: UrlRoot + '/eos/duty/rollCallOnDuty/deleteModel',
      method: 'post',
      data
  })
};

// 值班管理=>新版值班点名=删除单位
export const deleteDepartments = data => {
  return axios({
      url: UrlRoot + '/eos/duty/rollCallOnDuty/deleteDepartments',
      method: 'post',
      data
  })
};

// 值班管理=>新版值班点名=>保存或者修改单位
export const saveOrUpdateDepartment = data => {
  return axios({
      url: UrlRoot + '/eos/duty/rollCallOnDuty/saveOrUpdateDepartment',
      method: 'post',
      data
  })
};

// 值班管理=>新版值班点名=>获取日所有单位数据
export const getNotificationData = data => {
  return axios({
      url: UrlRoot + '/eos/duty/rollCallOnDuty/countByGroupIds',
      method: 'post',
      data
  })
};

// 值班管理=>新版值班点名=>获取点名动态-查看中的通知数据
export const getviewReplyData = data => {
  return axios({
      url: UrlRoot + '/eos/duty/rollCallOnDuty/pageRollContactor',
      method: 'post',
      data
  })
};

// 值班管理=>新版值班点名=>点名通知-下发通知
export const issueNotice = data => {
  return axios({
      url: UrlRoot + '/eos/duty/rollCallOnDuty/sendH5Sms',
      method: 'post',
      data
  })
};

// 值班管理=>新版值班点名=>点名通知-选择单位 保存部门数据
export const saveDepartment = data => {
  return axios({
      url: UrlRoot + '/eos/duty/rollCallOnDuty/saveDept',
      method: 'post',
      data
  })
};

// 值班管理=>新版值班点名=>获取日所有单位统计状态数据
export const getStatusStatistics = data => {
  return axios({
      url: UrlRoot + '/eos/duty/rollCallOnDuty/rollCallNews',
      method: 'post',
      data
  })
};

//   工作安排——查看在H5回复的内容
export const getReplyList = params => {
  return axios({
      url: UrlRoot + '/app/sjs/affairsReply/getReplyList',
      method: 'get',
      params
  })
};

export const getDefaultDeptAndGroupRel = data => {
    return axios({ //工作安排-新增工作安排-选择单位
        url: UrlRoot + '/app/sjs/affairs/getDefaultDeptAndGroupRel',
        method: 'post',
        data
    })
};

//   工作安排——删除已上传的传真模板文件
export const deleteFaxTempFile = params => {
  return axios({
      url: UrlRoot + '/app/sjs/affairs/deleteFaxTempFile',
      method: 'get',
      params
  })
};

//   工作安排——下载传真模板文件
export const uploadFaxTempToAffairs = data => {
  return axios({
      url: UrlRoot + '/eos/communication/faxTemplate/uploadFaxTempToAffairs',
      method: 'post',
      data
  })
};

//   工作安排——获取传真模板文件
export const getFaxTempList = params => {
  return axios({
      url: UrlRoot + '/eos/communication/faxTemplate/getFaxTempList',
      method: 'get',
      params
  })
};

/*******?结束接报历史?******/

// 通知公告
export const getReceiveNotices = params => {
    return axios({ // 查询接收到的通知公告
        url: SITE_CONFIG + '/appManagement/recieve/noticePage',
        method: 'get',
        params
    })
};
export const getNoticeContent = params => {
    return axios({ // 查看通知公告详情
        url: SITE_CONFIG + `/appManagement/notice/${params.noticeId}`,
        method: 'get',
        params
    })
};
export const sendNoticeToOther = data => {
    return axios({ // 转发通知公告
        url: SITE_CONFIG + `/appManagement/transferNotice`,
        method: 'post',
        data
    })
};
export const readByPlatform = data => {
  return axios({ // 平台已读通知公告
      url: SITE_CONFIG + `/appnotice/appNoticePlatform/update`,
      method: 'post',
      data
  })
};

// 城管监督 查询图库
export const getMeetingImg = params => {
    return axios({
        url: SITE_CONFIG + '/meeting/meetingImg/page',
        method: 'get',
        params
    })
}

// 城管监督 保存提交
export const saveMeetingRecord = data => {
        return axios({
            url: SITE_CONFIG + '/weChatHandleTaskPC/monitoringSendSingle',
            method: 'post',
            data
        })
    }
    // 获取App可激活人数
export const getAppPeopleNumber = params => {
    return axios({
        url: SITE_CONFIG + '/sys/platform/appCount',
        method: 'get',
        params
    })
}

// // 根据需要进行
export default {
    readByPlatform,
    phoneQuickGroupList, //电话快捷组
    getConfirmList,
    listMuck,
    saveMuck,
    listEnergy,
    saveEnergy,
    saveGas,
    listGarbate,
    listQuality,
    listQualitysaveOrUpdate,
    listWeather,
    saveOrUpdateweather,
    listWaters,
    savewaterOrUpdate,
    outputWord,
    getMould,
    setMould,
    appCityReportH5Sms,
    listWater,
    saveGarbage,
    saveWater,
    uploadEvent,
    getLicenseExpireTime,
    getToken,
    emergencyGroupList,
    vdcConfStart,
    vdcConfJoin,
    vdcConfFinish,
    gliaisonGroupList,
    dutyGroupList,
    shortcutGroupList,
    getPhoneHelperByPid,
    getSamePidPhoneHelper,
    getTree,
    getJurisdiction,
    eventStat,
    telephoneGroupingTree,
    emergencyAddressBookTree,
    emergencyAddressBook,
    updateConcator,
    faxGroupList,
    smsGroupList,
    addNewGroup,
    smsSendRecord,
    findSmsGroup,
    smsQueue,
    immediateData,
    immediateDetail,
    timingData,
    timingDetail,
    remindData,
    remindDetail,
    sendHistory,
    sendHistoryDetail,
    failSend,
    removeSmsQueue,
    contactorList,
    addContactorToGroup,
    talkGroupListTree,
    talkGroupList,
    promptSmsQueue,
    removePromptSmsQueue,
    removeCommonContactor,
    getVideoList,
    concatorSex,
    contactorPosition,
    concatorImportant,
    findContactorById,
    findAllContactors,
    getBriefsByClassId,
    getStructTree,
    videoGroupList,
    terminalGroupList,
    terminalList,
    commonContactorList,
    recentContactorList,
    getRecentContactorList,
    holidayManagement,
    holidayManagementList,
    login,
    topTree,
    all,
    InformationReleas,
    InformationReleasUploadUrl,
    appDutyInformationReleasAdd,
    appDutyInformationReleasDetail,
    noticeOnscreen,
    seeResponse,
    chasing,
    workType,
    appDutyInformationReleasUpdate,
    appDutyInformationReleasDelete,
    addAffairs,
    delAffairs,
    seeAffairs,
    seeAffairsDetail,
    GovernmentAffairsUploadUrl,
    issue,
    initTypeData,
    typeDetail,
    addOrEditType,
    delType,
    todolist,
    ok,
    fax_success,
    fax,
    msg_box,
    typeList,
    statusList,
    lishijilu,
    getContacts,
    findSmsListByContactId,
    msg_table,
    msg,
    allocated,
    answered,
    Unanswered,
    /*===========事件管理=======*/
    eventHistory,
    eventDelete,
    eventAdvancedInquire,
    eventLevel,
    eventInformationHistory,
    eventLettersHistory,
    responseGetProcess,
    responseGetStruct,
    responseDispatch,
    responseSearch,
    responseAddContact,
    responseDeleteContact,
    responseSaveFlow,
    responseGetDispatch,
    responseGetReply,
    /*===========事件管理=======*/
    updateMonth,
    bullitinTree,
    findByDay,
    updateDay,
    selectLastEvent,
    phoneGroupList,
    findById,
    findByWeek,
    updateWeek,
    findByMonth,
    historyAndScheduling,
    operatorOnDuty,
    flightManagement,
    dutyLog_man,
    dutyLog,
    dutyLoghistory,
    dutyLogadd,
    dutyLogchange,
    dutyLogdel,
    operatorList,
    telephoneStat,
    // operatorOnDuty_del,
    holidayManagement_change,
    holidayManagement_add,
    operatorOnDutydel,
    holidayManagementadd,
    holidayManagementaddList,
    holidayManagementdel,
    holidayManagementdelete,
    // dutyLoghistory_word
    telephoneStatCall,
    saveDay,
    noteStat,
    damageList,
    faxStat,
    saveEventDay,
    caseList,
    caseAdd,
    caseUpdate,
    caseDelete,
    flightManagement_del,
    holidayManagementchange,
    operatorOnDutydeladd,
    importTemplate,
    importFromExcel,
    conferenceDuty_all,
    videoAndTerminalGroupList,
    //*************
    // yf
    // 备注：以下接口为 2019/09/10 添加
    //*************
    rescueList,
    rescueAdd,
    rescueUpdate,
    rescueDelete,
    materialList,
    materialAdd,
    materialUpdate,
    materialDelete,
    evacuateList,
    evacuateAdd,
    evacuateUpdate,
    evacuateDelete,
    riskList,
    riskAdd,
    riskUpdate,
    riskDelete,
    reportAdd,
    reportList,
    reportDelete,
    mergeSimpleUpload,
    getFlow,
    getFlowList,
    getFlowUpdate,
    getFlowDelete,
    selectOperator,
    saveOperator,
    deleteOperator,
    selectAllOperatorHistory,
    selectEventDealList,
    choose,
    leadList,
    leadList1,
    leadAdd,
    leadUpdate,
    leadDelete,
    getPreplanByCaseId,
    getLevelByPreplanId,
    StartThePlan,
    structList,
    userPlan,
    getFlowAdd,
    allman,
    searchFaxQueue,
    addContactsToGroup,
    conferenceDuty_num,
    dutyLogupdate,
    saveEventReceive,
    addEventInFos,
    saveApprovalOpinions,
    areaList,
    selectPhoneHistory,
    saveEventDeal,
    editEventDeal,
    deleteEventDeal,
    logout,
    allEventlist,
    createdEvent,
    getAllEventlist,
    saveScheduling,
    getPhoneHistory,
    getSmsHistory,
    getFaxHistory,
    selectSmsHistory,
    saveJudge,
    changeLevel,
    addSmsQueue,
    auditSubmissionList,
    getReviewer,
    saveOrUpdateAudit,
    saveReviewer,
    delAudit,
    submitApproval,
    reportH5Sms,
    judgePlan,
    eventEnd,
    listRelayInstruction,
    todayLeaderList,
    findSmsMould,
    addSmsMould,
    removeSmsMould,
    updateSmsMould,
    updateGroup,
    sendFax,
    saveRollCall,
    smsType,
    findSmsSign,
    eventImg,
    eventVideo,
    addPromptSmsQueue,
    //系统设置接口 2019.9.24
    changePassword,
    checkPassword,
    paramList,
    paramAdd,
    blackList,
    validateNumber,
    eventType,
    areaSetting,
    appContactors,
    dutyLogboss,
    eventlevelAll,
    paramDelete,
    selectPhoneDepartment,
    selectPhoneHistoryByEventAndUnit,
    selectSmsHistoryByEventAndUnit,
    selectSmsDepartment,
    selectFaxDepartment,
    flowAdd,
    flowUpdate,
    deleteFlow,
    structDelete,
    personAdd,
    forward,
    userManage,
    isAdmin,
    selectAttachmentHistory,
    addFlowContent,
    sendApp,
    videoEditVideoInfo,
    editTalkGroupInfo,
    addTalkGroupInfo,
    editTalkGroup,
    addTalkGroup,
    videoremoveGroup,
    removeTerminal,
    removeTalkGroup,
    vdioSave,
    sort,
    miniProgramSave,
    order,
    dutyplan,
    sendAppListAll,
    sendAppListAllNew,
    phoneWord,
    musicrecord,
    groupCollection,
    removeFaxQueue,
    recordToText,
    getAgent,
    findContactorByMobile,
    findContactorByFaxNum,
    findDeviceByNumber,
    usedContactor,
    importFromContactorExcel,
    LiveGetTime,
    defaultParameters,
    eventReception,
    loadTIFF,
    loadHistoryFax,
    handover,
    exportEventDayWord,
    extendGetAttach,
    extendDelAttach,
    getDefault,
    stopTime,
    addReport,
    eventReport,
    sendLocation,
    addContactor,
    findEventDealById,
    matchPreplan,
    findAllContactor,
    doBlacklist,
    checkBlacklist,
    groupOrder,
    contactorOrder,
    selectFaxHistoryByEventAndUnit,
    selectFaxHistory,
    findTencentmsg,
    findTencenttree,
    addTencentmsg,
    changeTencentmsg,
    recordPhoneHisory,
    addSmsSign,
    changeTencentree,
    getIp,
    getMachineId,
    loadtiff,
    findOperator,
    iStarted,
    deleteSmsSign,
    previewFax,
    rotateTiff,
    //往ecs系统发送信息
    sendMsgToECS,
    loginStatus,
    smsRead,
    faxRead,
    //系统菜单
    premitModules,
    downloadRecord,
    downloadRecordToText,
    getAiDefault,
    //信息处置
    getUnhandledFax,
    splitPdf,
    previewFaxArrayBuff,
    previewFaxArrayBuffdownload,
    getUnhandledPhone,
    getUnhandledSms,
    getByPcode,
    disposeEvent,
    imgToText,
    ocrResult,
    splitToJpgs,
    rotatePdf,
    getFileUrl,
    faxFileToText,
    pdfToText,
    saveOcrResult,
    ocrResultList,
    relateEvent,
    audioUrl,
    phoneToText,
    eventGetByPcodes,
    disposePhone,
    disposeSms,
    disposeFax,
    getShowHistory,
    removeRecord,
    previewPdf,
    getGroup,
    //end
    templateList,
    divideList,
    getDefaultEventLevel,
    dutyH5Sms,
    cutWav,
    recentDayContactor,
    preplanList,
    preplanDelete,
    preplanListContactor,
    conferenceList,
    perplanTree,
    preplanAdd,
    recentContactorConference,
    videoList1,
    talkGroupList1,
    contactorList1,
    groupTalkTalkGroupList1,
    emergencyAddressBook1,
    preplanUpdate,
    preplanListAll,
    listContactorNotNull,
    getAreaListByPid,
    updateAreaOrder,
    provinceMD5,
    reportEvent,
    stSelectEvent,
    searchPhoneGruopList,
    dutyDetail,
    getContactorHistory,
    getFaxTypeSelections,
    faxDelete,
    listFaxDeleted,
    deleteFaxInRecycleBin,
    deleteAllInRecycleBin,
    faxRecover,
    sendfaxGroupList,
    findFaxGroup,
    memoList,
    memoDelete,
    memoUpdate,
    todoAll,
    memoAdd,
    listClass,
    addlistClass,
    updatelistClass,
    deleteClasslistClass,
    listFileClass,
    addFileClass,
    detailFileClass,
    documentList,
    documentRestore,
    deleteFileClass,
    updateFileClass,
    orderlistClass,
    confirmDutyLog,
    resourceGroupList,
    convertHtmlPDF,
    faxQueuelistAll,
    faxQueuefindByName,
    faxQueuedeleteAll,
    faxReSendFax,
    faxQueuedelete,
    faxmergePdf,
    getRemindStatus,
    helperGetTree,
    helpergetHelper,
    updateContactorGroupOrder,
    updateOrderReplenish,
    getMsgOperatorSign,
    reverseValidatedNumber,
    updateRecordPhoneHisory,
    getFaxTemplateTree,
    addFaxTemplateTree,
    updateFaxTemplateTree,
    deleteFaxTemplateTree,
    getNumberArea,
    getDeptChildren,
    sendInstructionToLowerDept,
    monthlyListInLowerDept,
    getMissCalls,
    getUnreadSms,
    getUnreadFax,
    handleMissCalls,
    getLowerDeptUpdateTime,
    getReportListInLowerDept,
    getReportListInDetail,
    faxContactorList,
    findFaxListByContactId,
    sjsEventStat,
    exportSjsEventListToExcel,
    getSjsEventList,
    reloadGroupInfo,
    reloadDeviceInfo,
    beijingReloadDeviceInfo,
    getAllContactorByClassId,
    addDutyContactor,
    deleteDutyContactor,
    saveOrUpdate,
    deletedClasses,
    deletedClassesTime,
    addRule,
    getRule,
    addAllRule,
    getRuleList,
    getStatisticsList,
    automaticList,
    getDutyList,
    clearDuty,
    deleteDuty,
    saveDuty,
    dutyCopy,
    getRuleByClassId,
    getPageClasses,
    getPeople,
    searchDutyPeople,
    getContactorByClassId,
    deleteRule,
    orderClass,
    splitRecord,
    affairsClasses,
    affairsGroup,
    dateGroup,
    dateGroupSave,
    sendSms,
    unitScheduling,
    saveUnit,
    delUnit,
    collectionUnitList,
    deptTree,
    deduplicationPage,
    deduplicationList,
    contactorHistory,
    getListByGroup,
    affairsClassesSaveOrUpdate,
    affairsGroupSaveOrUpdate,
    affairsClassesDelete,
    affairsGroupDelete,
    getOneByDate,
    affairsTypeList,
    saveReportHistory,
    findCaseClassByCode,
    selectEventReportHistory,
    govEventDelete,
    govEventUpdate,
    govReportEvent,
    selectProvinceCaseClass,
    getUserConfig,
    updateUserConfig,
    setForwardingPhone,
    getSeatDuty,
    searchDuty,
    delCallForwarding,
    findAppCallForwardingHistory,
    findCallForwarding,
    classifyList,
    unitList,
    classifyListdelete,
    classifyBatchSave,
    classifyGetlist,
    classifyUpdateGetlist,
    classifyAddGetlist,
    classifyDeleteGetlist,

    subordinateModeGetModeList,
    subordinateModeGetClassesList,
    subordinateModeGetRoleList,
    subordinateModeSaveMode,
    subordinateModeSaveClassesList,
    subordinateModeSaveRoleList,
    subordinateModeDeleteMode,
    subordinateModeDeleteClassesList,
    subordinateModeDeleteRoleList,
    subordinateGetAllByDate,
    subordinateGetAllGroup,
    subordinateSaveSelectedGroup,
    subordinateGetSelectedGroup,
    subordinateGetCurrentMode,
    getGroupInfo,
    //统计分析=>值班点名
    getConferenceDutyStatistics,
    autoSort,
    contactorOrderList,
    verification,
    findRecordTextByPhoneId,
    pageAioEvent,
    exportWordFromEventAnalysis,
    eventActive,
    saveDeathList,
    findEventDeathList,
    findEventDeathListType,
    deleteDeathList,
    saveDeathLists,
    findEventDeathListByEventId,
    addAttachWithoutFile,
    delAttachWithoutFile,
    exportExcel,
    findAllSmsList,
    getReceiveSms,
    findAppDisaster,
    findAppDisasterPic,
    findAppSzXxydyjReport,
    findAppSzXxydyjReportAttach,
    findEventDealList,
    contactorGroupsFromDictionary,
    topUnitTree,
    unitSetting,
    saveEventDealReport,
    exportTemplate,
    yzEnd,
    getByCodeAndParentCode,
    deleteEvent,
    getEventByPhoneId,
    getEventBySmsId,
    getOutputTemplate,
    inputExcelFun,
    sendEventBulletin,
    saveApprovedBy,
    getEventBulletinHistory,
    superiorReadEvent,
    getEventPageNum,
    smsDelTask,
    smsDelPrompt,
    getReceiveNotices,
    getNoticeContent,
    sendNoticeToOther,
    getMeetingImg,
    saveMeetingRecord,
    getAppPeopleNumber,
    getMonthAllDepartment,
    getDutyAndPosition,
    getPostData,
    departmentGroupList,
    getTemplate,
    departmentListBy,
    templateSaveOrUpdate,
    templateDelete,
    deleteDepartments,
    saveOrUpdateDepartment,
    getNotificationData,
    getviewReplyData,
    issueNotice,
    saveDepartment,
    getStatusStatistics,
    getReplyList,
    getDefaultDeptAndGroupRel,
    deleteFaxTempFile,
    uploadFaxTempToAffairs,
    getFaxTempList,
    getWeather,
    getCommunication,
    getDuty,
};
