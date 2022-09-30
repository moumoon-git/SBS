/* eslint-disable */
// dev 环境使用的配置文件
(function() {
    window.SITE_CONFIG = {};
    // api接口请求地址
    window.SITE_CONFIG['cloudUrl'] = 'http://192.168.1.189:8055';
    // websocket 服务地址
    window.SITE_CONFIG['websocketUrl'] = 'http://192.168.3.207:8080';
    // window.SITE_CONFIG["cloudUrl"] = "http://192.168.3.221:8055"; // 江华
    // window.SITE_CONFIG["cloudUrl"] = "http://192.168.3.43:8055"; // 楚鑫
    // window.SITE_CONFIG["cloudUrl"] = "http://192.168.3.37:8055"; // 团波
    // window.SITE_CONFIG['cloudUrl'] = 'http://192.168.3.187:8055'; // 竞翊
    // window.SITE_CONFIG["cloudUrl"] = "http://192.168.3.138:8055"; // 陈彬
    // window.SITE_CONFIG["cloudUrl"] = "http://192.168.3.187:8055"; // 代全
    // window.SITE_CONFIG["cloudUrl"] = "http://192.168.3.240:8055"; // 非凡
    // window.SITE_CONFIG["cloudUrl"] = "http://192.168.3.207:8055";// 洪斌
    // window.SITE_CONFIG["cloudUrl"] = "http://192.168.3.155:8055";// 炎城
    // window.SITE_CONFIG["cloudUrl"] = "http://192.168.3.159:8055";// 金健
    // window.SITE_CONFIG['cloudUrl'] = 'http://192.168.3.217:8055'; // 杨凡
    // window.SITE_CONFIG['cloudUrl'] = 'http://192.168.3.107:8055'; // 杨凡
    // window.SITE_CONFIG['cloudUrl'] = 'http://192.168.3.222:8055'; // 若浪
    // window.SITE_CONFIG['cloudUrl'] = 'http://192.168.3.251:8055'; // 少赞
    // window.SITE_CONFIG['cloudUrl'] = 'http://192.168.3.237:8055'; // 直潮
    // window.SITE_CONFIG['cloudUrl'] = 'http://192.168.3.183:8055'; // 泽聪
    // SOC服务接口
    window.SITE_CONFIG['baseUrl'] = window.SITE_CONFIG['cloudUrl'] + '/ser';
    // sockjs websocket服务接口
    window.SITE_CONFIG['websocket'] =
        window.SITE_CONFIG['websocketUrl'] + '/endpointOyzc';
    // 3.0模块文件上传地址
    window.SITE_CONFIG['fileupload'] =
        window.SITE_CONFIG['cloudUrl'] + '/fileupload';
    // 3.0模块事件服务接口
    window.SITE_CONFIG['event'] = window.SITE_CONFIG['cloudUrl'] + '/event';
    // 3.0模块MQ服务器地址，用于UDS
    window.SITE_CONFIG['MQServer'] = 'ws://192.168.1.185:61614';
    // 3.0 vue3模块的跳转地址，需要填写完整的地址（协议+ip+端口+路径）
    window.SITE_CONFIG['3.0'] = [];
    // 微前端项目部署地址
    window.SITE_CONFIG['micro'] = 'http://192.168.3.50:8080/micro';
    // 图片转文字服务
    window.SITE_CONFIG['proxyUrl'] = 'http://192.168.3.48:8200';
    // cdn地址 = 域名 + 版本号
    window.SITE_CONFIG['domain'] = './'; // 域名
    window.SITE_CONFIG['version'] = ''; // 版本号(年月日时分)
    window.SITE_CONFIG['cdnUrl'] =
        window.SITE_CONFIG.domain + window.SITE_CONFIG.version;
    // SOC可视化页面跳转uri
    window.SITE_CONFIG['visual'] =
        window.SITE_CONFIG['cloudUrl'] + '/visualizion/index.html';
    // SOC原来的C端websocket地址
    window.SITE_CONFIG['websocket_phone'] = 'ws://localhost:9529';
    // SOC自动登录后首页的路由地址
    window.SITE_CONFIG['autoLogin'] =
        '/PerformanceStatistics/WorkOrderOverview/WorkOrderOverview';
    // 华为ASR访问录音的地址
    window.SITE_CONFIG['HWASR'] = '';
    // UDS心跳检测回复的延迟时间（单位：秒）
    window.SITE_CONFIG['UDSHeartbeatAckTime'] = 3;
    // 科大讯飞语音转文字ASR
    window.SITE_CONFIG['ASR'] = {
      appId: '',
      secretKey: ''
    };
    // 百度图文识别OCR
    window.SITE_CONFIG['OCR'] = {
      apiKey: '',
      secretKey: ''
    };
})();
// 原来应急项目迁移过来的配置项
window.g = {
    /**
     *  服务【IP+端口】相关配置
     */
    AXIOS_TIMEOUT: 10000, //不用改
    /** 后端访问地址【IP+端口】 **/
    // ApiUrl: 'http://192.168.3.222:8089',           //EOS后端服务地址
    // ApiUrl: 'http://192.168.3.36:8089',           //EOS后端服务地址
    // ApiUrl: 'http://192.168.3.129:8089',           //EOS后端服务地址
    // ApiUrl: 'http://192.168.3.37:8088',
    ApiUrl: window.SITE_CONFIG['event'],
    // ApiUrl: "http://192.168.3.171:8088",
    // ApiUrl: 'http://192.168.3.136:8089',
    // ApiUrl: 'http://192.168.3.106:8088',
    // ApiUrl: 'http://192.168.1.182:9998',
    // ApiUrl: 'http://192.168.3.37:8088',
    serveEBS: 'http://192.168.3.54:8066', //EBS后端服务地址
    UcsApi: 'http://192.168.3.35:8582', //UCS后端服务地址
    FileUrl: 'http://192.168.1.184:9997', //文件服务地址
    semanticsAnalysisUrl: 'http://192.168.3.171:8092', // 固定话术语义分析访问地址（智能接报弹窗使用）

    /** 前端访问地址【IP+端口】 **/
    proxyUrl: 'http://192.168.3.79:7102', //EOS前端访问地址【代理服务地址（百度云，科大讯飞接口要用）】
    ApiMap: 'http://192.168.3.79:10552', //ECS前端访问地址
    ApiEBS: 'http://192.168.1.160:80', //EBS前端访问地址

    /** 暂弃用配置，保留就行 **/
    recordingApi: 'http://192.168.3.248:8085', //优士康配置,ICP项目可忽略--录音，话单（暂弃用）
    MQTT_url: '192.168.3.35', //MQ服务IP地址(已弃用)
    /**
     *  项目型-【开关】统一配置
     */
    logoIsShow: false, //是否显示公司logo true 显示、 false 隐藏
    MapProjectUrl: true, //是否ECS开启了权限系统,另外如果true,EOS跳转到ECS会带上账号和密码
    IsLanZhouProject: false, //是否为兰州项目 true // 是 false 否
    Stylemsg: false, //是否为腾讯云短信服务
    IsNanShanProject: false, //是否为南山项目(南山项目发不了H5短信)
    IsShenzhenProject: false, //是否为深圳市政府项目（事件接报独立业务、信息处置（短信回拨）等业务）
    IsShenShanProject: false, //是否为深汕项目（屏蔽融合通讯接听按钮）
    permissionSystem: false, //是否启用EmPlus 2.0后台管理系统(即权限系统),true为启用，false为关闭
    IsSuZhouPorject: false, //是否为苏州项目 true // 是 false 否
    isUserOauth2: false, //是否启动单点登录（苏州工业园项目）,与后端的oauth2.enable配置要同步,另外已在staticRoute里面做判断，如果是true用的是SuZhouLogin的登录页面。
    isSjsOauth2: false, //是否启用石景山单点登录
    userManagement: true, //是否显示右上角设置中的用户管理, true为显示，false为不显示
    oneClickSubmission: '【此信息报李新、利跃、春利、亢军同志和两办主任，请政法委、网信办关注】', //信息处置-事件接报-一键报送默认短信后缀
    oneClickDoubleReport: '【此信息报李新、利跃、春利、亢军同志和两办主任，拟报市应急办，请区委办双报，请政法委、网信办关注】', //信息处置-事件接报-一键双报默认短信后缀
    isNewDevelopmentCode: true, //是否启用2020年12月30日发布的新功能（新功能包括：事件管理页面，事件接报页面，信息处置页面，事件快报页面，通讯历史页面，首页页面），true为启用2020年12月30日发布的新功能，false为使用2020年12月30日前的旧功能
    /**
     *  【深圳市政府】省厅上报地址-----------------非【深圳市政府】项目忽略
     */
    provinceUrl: 'https://120.24.210.187:13041', //深圳市政府【省厅】接口地址(如果不需要报送到省厅就什么都不填给'')
    /**
     *  【苏州工业园】配置-竹云单点登录相关URL------非【苏州工业园】项目忽略
     */
    quitUrl: 'https://172.27.9.200:8083/apphub/logout', // 竹云退出登录接口
    oauth2Url: 'https://172.23.136.31:8083/idp/oauth2/authorize?redirect_uri=http://localhost:8060/%23/NanShan&state=xxxx&client_id=YJJCZH&response_type=code', // oauth2的url
    /**
     *  系统性配置，各项目自定义
     */
    systemTitle: '深圳市应急值守系统', // 项目系统名称
    HWICP_Version: 'HWICP-19.0', //【不变】ICP版本号 HWICP-19.0 与 HWICP-20.0 与YouShiKang，vdc
    route: 'login', //【不变】此配置为默认打开的登录页面。目前如果要改为 深圳南山区 项目，请将'login'改为 'NanShan'(注意大小写)
    eosVersion: '2.7.0.01', // eos版本号配置 （登录页面下方的版本号）
    communicationLoginSuccess: '通讯服务登录成功!', //通讯服务登录成功提示
    communicationLoginError: '通讯服务登录失败!', //通讯服务登录失败提示
    EOSWebTitile: '应急值守系统', // 配置网页标题
    downLoadAppUrl: '', // app下载地址
    thirdPartyAccount: {
        loginIp: '10.10.0.127', //  loginIp:平台登录 IP。
        loginPort: '8320', //  loginPort:平台登录端口，一般默认为 8320。
        // userName: 'system',  //  userName:平台登录用户名。
        // userPwd: 'system123', //  userPwd:平台登录密码。
        userName: 'yjb', //  userName:平台登录用户名。
        // userPwd: 'system123', //  userPwd:平台登录密码。
        userPwd: 'Admin@123', //  userPwd:平台登录密码。
        // token: String      //  token：平台连接 token，和密码两者选其一。
    },
};

// 超图配置
window.config = {
    project: 'SZ',
    cityName: '扬州', // 城市名，用于搜索服务
    mapConfig: {
        // 初始化中心点
        center: {
            longitude: 113.25905,
            latitude: 23.12784,
            level: 17,
        },
        // CLIENT_ID: '99eefd298fdc41b9af0fc9699b1cd4bf',
        // CLIENT_SCRECT: '5056cf818de74b8bbedef804c3f4f908',
        CLIENT_ID: 'e9f307cf120049ecae03e3f73d6214da',
        CLIENT_SCRECT: '6a1930aa5bdf413d9f04fe0210c06f63',
        WMTS_URL: 'http://172.21.12.74:8877/wmts', //底图服务
        MAPURL: 'http://172.21.12.74:8877',
        MAPServerUrl: 'http://172.21.12.74:8877/egis/services/api', // 地图服务
        mapApiERIVCE_URL: 'http://172.21.12.74:8877/egis',
        bounds: '',
        /*
         * 高德 GD 2300898618f6ce0fa1527f4e76866162
         * 百度 BDcccccc
         * 天地图 TDT 815233bc58d602a04377c6a2d30a3a51
         */
        mapBusiness: 'GD',
        mapBusinessAkey: 'MjMwMDg5ODYxOGY2Y2UwZmExNTI3ZjRlNzY4NjYxNjI=',
        tk: 'ODE1MjMzYmM1OGQ2MDJhMDQzNzdjNmEyZDMwYTNhNTE=',
        /* 项目上不用进行配置的：------------------------------------- start */
        // 天地图秘钥
        // tk:'ef7bd303756eda494dc334c62c7b75cb',
    },
};
