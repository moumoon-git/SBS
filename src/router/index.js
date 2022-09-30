/**
 * 全站路由配置
 *
 * 建议:
 * 1. 代码中路由统一使用name属性跳转(不使用path属性)
 */
import Vue from "vue";
import Router from "vue-router";
import http from "@/utils/httpRequest";
import { isURL } from "@/utils/validate";
import { clearLoginInfo } from "@/utils";
import Cookies from "js-cookie";

Vue.use(Router);

// 开发环境不使用懒加载, 因为懒加载页面太多的话会造成webpack热更新太慢, 所以只有生产环境使用懒加载
const _import = require("./import-" + process.env.NODE_ENV);
const microRoute = require("./microRoute");
// 全局路由(无需嵌套上左右整体布局)
const globalRoutes = [{
        path: "/404",
        component: _import("common/404"),
        name: "404",
        meta: { title: "404未找到" },
    },
    {
        path: "/login",
        component: _import("common/login"),
        /*
          使用 require 进行异步加载，在打包时把login/secondary一起打包到app.js中
          把 main 也设置为异步加载，把它打包到0.js中。
          这样首次进入时依次加载完manifest、vendor、app.js
          不需要等待main的加载完成，就能先加载login模块
          然后在window.onload的时候插入 main （0.js），也就是在login时就对main进行载入，节省资源加载时间
        */
        // component: require('@/views/common/login.vue').default,
        name: "login",
        meta: { title: "登录" },
    },
    {
        path: "/secret",
        component:_import("common/secret/Secret"),
        name: "secret"
    },
    // {
    //   path: "/secondary",
    //   component: _import("common/secondary"),
    //   // component: require('@/views/common/secondary.vue').default,
    //   name: "secondary",
    //   meta: { title: "系统门户" },
    // },
    {
        // 3.0 新的次级页面
        name: 'SecondaryPage',
        path: '/SecondaryPage',
        component: _import('common/SecondaryPage/SecondaryPage'),
    },
];
// 主入口路由(需嵌套上左右整体布局)
var mainRoutes = {
    path: "/",
    // component: require('@/views/main.vue').default,
    component: _import("main"),
    name: "main",
    redirect: { name: "home" },
    meta: { title: "主入口整体布局" },
    children: [
        // 通过meta对象设置路由展示方式
        // 1. isTab: 是否通过tab展示内容, true: 是, false: 否
        // 2. iframeUrl: 是否通过iframe嵌套展示内容, '以http[s]://开头': 是, '': 否
        // 提示: 如需要通过iframe嵌套展示内容, 但不通过tab打开, 请自行创建组件使用iframe处理!
        //{ path: '/home', component: _import('common/home'), name: 'home', meta: { title: '首页' } },
        {
            path: "/home",
            component: _import("modules/home/HomePage"),
            name: "home",
            meta: { title: "首页" },
        },

        {
            path: "/theme",
            component: _import("common/theme"),
            name: "theme",
            meta: { title: "主题" },
        },
        /* { path: '/demo-echarts', component: _import('demo/echarts'), name: 'demo-echarts', meta: { title: 'demo-echarts', isTab: true } },
        { path: '/demo-ueditor', component: _import('demo/ueditor'), name: 'demo-ueditor', meta: { title: 'demo-ueditor', isTab: true } }, */
        // { path: '/sys-reserveplan/reserveplan', component: _import('modules/sys/reserveplan/reserveplan'), name: 'sys-reserveplan/reserveplan', meta: { title: '预案管理',keepAlive:true } },
        {
            path: "/reserveplan-add-or-updata",
            component: _import("modules/sys/reserveplan/reserveplan-add-or-updata"),
            name: "reserveplan-add-or-updata",
            meta: { title: "新增预案", keepAlive: false },
        },
        {
            path: "/reserveplan-add-or-updata2",
            component: _import("modules/sys/yuan/reserveplan-add-or-updata"),
            name: "reserveplan-add-or-updata2",
            meta: { title: "新增预案" },
        },
        {
            path: "/caseWarning",
            component: _import("modules/sys/tinymce/caseWarning"),
            name: "caseWarning",
            meta: { title: "案例警示富文本" },
        },
        {
            path: "/safeEducation",
            component: _import("modules/sys/tinymce/safeEducation"),
            name: "safeEducation",
            meta: { title: "安全教育富文本" },
        },
        {
            path: "/noticeWarning",
            component: _import("modules/sys/tinymce/noticeWarning"),
            name: "noticeWarning",
            meta: { title: "公告警示富文本" },
        },
        {
            path: "/property/statisticalAnalysis/communityhome",
            component: _import("modules/statisticalAnalysis/community"),
            name: "propertystatisticalAnalysis",
            meta: { title: "小区统计分析" },
        },
        {
            path: "/school/statisticalAnalysis/schoolhome",
            component: _import("modules/statisticalAnalysis/school"),
            name: "schoolstatisticalAnalysis",
            meta: { title: "学校统计分析" },
        },
        {
            path: "/human/statisticalAnalysis/human",
            component: _import("modules/statisticalAnalysis/human"),
            name: "humanstatisticalAnalysis",
            meta: { title: "人员统计分析" },
        },
        {
            path: "/vehicle/statisticalAnalysis/vehicle",
            component: _import("modules/statisticalAnalysis/vehicle"),
            name: "vehiclestatisticalAnalysis",
            meta: { title: "车辆统计分析" },
        },
        {
            path: "/hiddenDanger-add-or-update",
            component: _import("modules/DepartmentReport/hiddenDanger-add-or-update"),
            name: "hiddenDanger-add-or-update",
            meta: { title: "部门上传隐患" },
        },
        {
            path: "/emergencyinfo-add-or-update",
            component: _import("modules/event/emergency/emergencyinfo-add-or-update"),
            name: "emergencyinfo-add-or-update",
            meta: { title: "要情新增或编辑" },
        },
        {
            path: "/taskManagement-add",
            component: _import("modules/Linkage/taskManagement/taskManagement-add"),
            name: "taskManagement-add",
            meta: { title: "任务管理新增" },
        },
        {
            path: "/taskManagement-update",
            component: _import(
                "modules/Linkage/taskManagement/taskManagement-update"
            ),
            name: "taskManagement-update",
            meta: { title: "任务管理编辑" },
        },
        {
            path: "/HiddenDanger-add-or-update",
            component: _import(
                "modules/Troubleshooting/HiddenDanger/HiddenDanger-add-or-update"
            ),
            name: "HiddenDanger-add-or-update",
            meta: { title: "查看排查" },
        },
        {
            path: "/PersonDeclare-see",
            component: _import(
                "modules/Troubleshooting/PersonDeclare/PersonDeclare-see"
            ),
            name: "PersonDeclare-see",
            meta: { title: "查看个人" },
        },
        {
            path: "/PersonDeclare-AddOrEdit",
            component: _import(
                "modules/Troubleshooting/PersonDeclare/PersonDeclare-AddOrEdit"
            ),
            name: "PersonDeclare-AddOrEdit",
            meta: { title: "新增/编辑个人" },
        },
        {
            path: "/ElectronicPass-AddOrEdit",
            component: _import(
                "modules/Linkage/ElectronicPass/ElectronicPass-AddOrEdit"
            ),
            name: "ElectronicPass-AddOrEdit",
            meta: { title: "电子通行新增/编辑" },
        },
        {
            path: "/ElectronicPass-see",
            component: _import("modules/Linkage/ElectronicPass/ElectronicPass-see"),
            name: "ElectronicPass-see",
            meta: { title: "电子通行查看" },
        },
        {
            path: "/Resumption-AddOrEdit",
            component: _import(
                "modules/Troubleshooting/Resumption/Resumption-AddOrEdit"
            ),
            name: "Resumption-AddOrEdit",
            meta: { title: "企业复工新增/编辑" },
        },
        {
            path: "/Resumption-see",
            component: _import("modules/Troubleshooting/Resumption/Resumption-see"),
            name: "Resumption-see",
            meta: { title: "企业复工查看" },
        },
        {
            path: "/fax/faxIndex",
            component: _import("modules/fax/faxIndex"),
            name: "faxIndex",
            meta: { title: "传真调度" },
        },
        {
            path: "/riskInvestigation/report/report",
            component: _import("modules/riskInvestigation/warning/warning"),
            name: "report",
            meta: { title: "报告" },
        },
        {
            path: "/areapublishresponse",
            component: _import("modules/AreaPublishResponse/AreaPublishResponse"),
            name: "areapublishresponse",
            meta: { title: "区发布响应", isTab: true, isDynamic: true  },
        },
        {
            path: "/unitresponse",
            component: _import("modules/UnitResponse/UnitResponse"),
            name: "unitresponse",
            meta: { title: "各单位接响应", isTab: true, isDynamic: true  },
        },
        {
            path: "/riskInvestigation/inspectionSheetManagement/inspectionSheetManagement",
            component: _import(
                "modules/riskInvestigation/inspectionSheetManagement/inspectionSheetManagement"
            ),
            name: "inspectionSheetManagement",
            meta: { title: "巡查工单管理", isTab: "true", isDynamic: true },
        },
        {
            path: "/jlsq",
            component: _import("modules/approveLevel/tjf/jlsq"),
            name: "jlsq",
            meta: {
                title: "奖励申请",
                isTab: "true",
                isDynamic: true,
            },
        },
        {
            path: "/shgl",
            component: _import("modules/approveLevel/tjf/shgl"),
            name: "shgl",
            meta: {
                title: "审核管理",
                isTab: "true",
                isDynamic: true,
            },
        },
        {
            path: "/cygl",
            component: _import("modules/groupControl/cygl"),
            name: "cygl",
            meta: { title: "成员管理", isTab: true, isDynamic: true  },
        },
        {
            path: "/shlc",
            component: _import("modules/groupControl/shlc"),
            name: "shlc",
            meta: { title: "审核流程管理", isTab: true, isDynamic: true  },
        },
        {
            path: "/riskInvestigation/wasteManagement/wasteManagement",
            component: _import(
                "modules/riskInvestigation/wasteManagement/wasteManagement"
            ),
            name: "wasteManagement",
            meta: { title: "垃圾分类点管理", isTab: true, isDynamic: true  },
        },
        {
            path: "/historyRecord",
            component: _import("modules/approveLevel/resourceManage/historyRecord"),
            name: "historyRecord",
            meta: { title: "历史记录", isTab: true },
        },
        {
            path: "/previewPicture",
            component: _import("modules/approveLevel/resourceManage/previewPicture"),
            name: "previewPicture",
            meta: { title: "预览", isTab: true, isDynamic: true  },
        },
        {
            path: "/specialTopicTemplate",
            component: _import(
                "modules/specialTopic/specialTopicTemplate/SpecialTopicTemplateNew"
            ),
            name: "specialTopicTemplate",
            meta: { title: "专题模板", isTab: true, isDynamic: true  },
        },
        {
            path: "/specialTopicPublishTop",
            component: _import(
                "modules/specialTopic/specialTopicPublishTop/specialTopicPublishTop"
            ),
            name: "specialTopicPublishTop",
            meta: { title: "专题发布顶级", isTab: true, isDynamic: true  },
        },

        {
            path: "/specialTopicPublishLower",
            component: _import(
                "modules/specialTopic/specialTopicPublishLower/specialTopicPublishLower"
            ),
            name: "specialTopicPublishLower",
            meta: { title: "专题发布次级", isTab: true, isDynamic: true  },
        },

        {
            path: "/specialTopicCollect",
            component: _import(
                "modules/specialTopic/specialTopicCollect/SpecialTopicCollectNew"
            ),
            name: "specialTopicCollect",
            meta: { title: "专题采集", isTab: true, isDynamic: true  },
        },
        {
            path: "/lookRegisterMessageDialog",
            component: _import(
                "modules/specialTopic/specialTopicCollect/components/lookRegisterMessageDialog"
            ),
            name: "lookRegisterMessageDialog",
            meta: { title: "测试", isTab: true },
        },
        {
            path: "/LY_Personalize/campusPeriphery/school",
            component: _import("modules/LY_Personalize/campusPeriphery/school"),
            name: "schoolstatisticalAnalysis",
            meta: { title: "洛阳学校统计分析", isTab: true },
        },
        {
            path: "/LY_Personalize/propertyDistrict/communityhome",
            component: _import("modules/LY_Personalize/propertyDistrict/community"),
            name: "propertystatisticalAnalysis",
            meta: { title: "洛阳小区统计分析", isTab: true },
        },
        {
            path: "/clanManage",
            component: _import("modules/clanManage/clanManage"),
            name: "clanManage",
            meta: { title: "集群终端管理", isTab: true, isDynamic: true },
        },
        {
            path: "/sjsOnDutyRoster",
            component: () =>
                import ("@/view/dutyManagement/onDutyRoster/sjsOnDutyRoster.vue"),
            name: "sjsOnDutyRoster",
            meta: { title: "值班排班", isTab: true, isDynamic: true },
        },
        {
            path: "/informationDisposal",
            component: () =>
                import (
                    "@/view/eventManagement/informationDisposal/informationDisposalNew.vue"
                ),
            name: "informationDisposal",
            meta: { title: "信息处置", isTab: true, isDynamic: true },
        },
        {
            path: "/yangZhouEventReports",
            name: "yangZhouEventReports",
            component: () =>
                import ("@/view/yangZhouEventReports/yangZhouEventReports"),
            meta: { title: "事件接报", isTab: true, isDynamic: true },
        },
        {
            path: "/organization",
            name: "organization",
            component: () =>
                import ("@/view/ebs_Organization/Index"),
            meta: { title: "数字预案", isTab: true, isDynamic: true },
        },
        {
            path: "/preplanSubordinateunits",
            name: "preplanSubordinateunits",
            component: () =>
                import (
                    "@/view/ebs_PreplanSubordinateunits/PreplanSubordinateunitsIndex"
                ),
            meta: { title: "预案备案", isTab: true, isDynamic: true },
        },
        {
            path: "/TaskManager",
            name: "TaskManager",
            component: () =>
                // import (
                //     "@/views/modules/TaskManager/TaskManager"
                // ),
                import (
                    "@/views/modules/MFEModule/MFEModule"
                ),
            meta: { title: "任务管理", isTab: true, isDynamic: true, microModule: microRoute.default['TaskManager'] ? microRoute.default['TaskManager'] : {}, },
        },
        {
            path: "/thirdParty",
            name: "thirdParty",
            component: () =>
                import (
                    "@/views/modules/sys/thirdParty/thirdParty"
                ),
            meta: { title: "第三方平台接入", isTab: true, isDynamic: true },
        },
        {
            path: "/duty",
            name: "duty",
            component: () =>
                import ("@/view/paiban/paiban"),
            meta: { title: "下级值班", isTab: true, isDynamic: true },
        },
        {
            path: '/announce',
            name: 'announce',
            component: () =>
                import ("@/view/paiban/announce"),
            meta: { title: "联合值班", isTab: true, isDynamic: true },
        },
        {
            path: "/KnowledgeBase",
            name: "KnowledgeBase",
            component: () =>
                import (
                    "@/views/modules/sys/KnowledgeBase/KnowledgeBase"
                ),
            meta: { title: "应急知识库", isTab: true },
        },
        // 暂时写在这里
        {
          path: '/announcement',
          name: 'announcement',
          component: () =>
              import ("@/views/modules/announcement/announcement.vue"),
          meta: { title: "通知公告", isTab: true, isDynamic: true },
        },
        {
            path: '/edition',
            name: 'edition',
            component: resolve => require(['@/view/ebs_Organization/Edition'], resolve),
            meta: {
                requireAuth: true,
            }
        },
        {
            path: '/newlyadded',
            name: 'newlyadded',
            component: resolve => require(['@/view/ebs_Organization/Newlyadded'], resolve),
            meta: {
                requireAuth: true,
            }
        },
        {
            path: "/eventBulletin",
            name: "eventBulletin",
            component: require("@/view/yz_eventManagement/eventBulletin/eventBulletin")
                .default,
            meta: { title: "事件快报", isTab: true, isDynamic: true }
        },
        {
            path: "/yangZhouEventRegistration",
            name: "yangZhouEventRegistration",
            component: require("@/view/yz_eventManagement/eventRegistration/yangZhouEventRegistration")
                .default,
            meta: { title: "事件管理", isTab: true, isDynamic: true }
        },
        {   // 石景山值班管理-值班点名
            path: "/rollCallOnDuty",
            name: "rollCallOnDuty",
            component: require("@/view/dutyManagement/RollCallOnDuty/rollCallOnDuty")
                .default,
            meta: { title: "值班点名", isTab: true, isDynamic: true },
        },
        {   // 石景山政务管理-工作安排
            path: "/sjsPInformationRelease",
            name: "sjsPInformationRelease",
            component: require("@/view/sjs_informationDynamics/governmentAffairs/GovernmentAffairs")
              .default,
            meta: { title: "工作安排", isTab: true, isDynamic: true },
        },
        {   // 石景山政务管理-应急动态
            path: "/lEmergency",
            name: "lEmergency",
            component: require("@/view/sjs_informationDynamics/lEmergency/emergencyResponse.vue")
              .default,
            meta: { title: "应急动态", isTab: true, isDynamic: true },
        },
        {   // 石景山-事件统计分析
            path: "/eventInformation_copy",
            name: "eventInformation_copy",
            component: ()=>import("@/view/sjs_statisticAnalysis/eventInformation/eventInformation_copy.vue"),
            meta: { title: "事件信息仪表盘", isTab: true, isDynamic: true },
        },
        {   // 石景山-事件统计分析
            path: "/eventStore",
            name: "eventStore",
            component: ()=>import("@/view/sjs_statisticAnalysis/eventInformation/eventInformation_copy.vue"),
            meta: { title: "事件库", isTab: true, isDynamic: true },
        },
        {   // 石景山-值班统计分析
            path: "/workOnDuty",
            name: "workOnDuty",
            component: ()=>import("@/view/sjs_statisticAnalysis/workOnDuty/workOnDuty.vue"),
            meta: { title: "值班工作仪表盘", isTab: true, isDynamic: true },
        },

        {   // 扬州-值班排班上电视
            path: "/yz_duty",
            name: "yz_duty",
            component: ()=>import("@/view/yz_duty/yz_duty.vue"),
            meta: { title: "值班一览表", isTab: true, isDynamic: true },
        },
    ],

    beforeEnter(to, from, next) {
        let token = Vue.cookie.get("token")||localStorage.getItem('token');
        if (!token || !/\S/.test(token)) {
            clearLoginInfo();
            next({ name: "login" });
        }
        next();
  },
};

const router = new Router({
    mode: "hash",
    scrollBehavior: () => ({ y: 0 }),
    isAddDynamicMenuRoutes: false, // 是否已经添加动态(菜单)路由
    routes: globalRoutes.concat(mainRoutes),
});
function getQueryVariable(variable)
{
    var query = window.location.search.substring(1) || window.location.hash.split('?').slice(-1)[0];
    var vars = query.split("&");
    for (var i=0;i<vars.length;i++) {
            var pair = vars[i].split("=");
            if(pair[0] == variable){return pair[1];}
    }
    return(false);
}
// console.log(globalRoutes, mainRoutes)
router.beforeEach((to, from, next) => {
    console.log("to跳转前", to, router,from.query.token);
    if (
        router.options.isAddDynamicMenuRoutes ||
        fnCurrentRouteType(to, globalRoutes) === "global"
    ) {
        next();
    } else {
        http({
                url: http.adornUrl("/sys/menu/nav"),
                method: "get",
                params: http.adornParams(),
            })
            .then(({ data }) => {
                if (data && data.code === 0) {
                    fnAddDynamicMenuRoutes(data.menuList);
                    router.addRoutes([mainRoutes, { path: "*", redirect: { name: "404" } }]);
                    sessionStorage.setItem(
                        "dynamicMenuRoutes",
                        JSON.stringify(mainRoutes.children || "[]")
                    );
                    router.options.isAddDynamicMenuRoutes = true;
                    sessionStorage.setItem(
                        "menuList",
                        JSON.stringify(data.menuList || "[]")
                    );
                    sessionStorage.setItem(
                        "permissions",
                        JSON.stringify(data.permissions || "[]")
                    );
                    sessionStorage.setItem(
                        "useUDS",
                        JSON.stringify(data.useUDS || 0) // 是否启用uds。0：默认不启用
                    );
                    next({...to, replace: true });
                } else {
                    sessionStorage.setItem("menuList", "[]");
                    sessionStorage.setItem("permissions", "[]");
                    sessionStorage.setItem("useUDS", "0");
                    next();
                }
            })
            .catch((e) => {
                console.log(
                    `%c${e} 请求菜单列表和权限失败，跳转至登录页！！`,
                    "color:blue"
                );
                router.push({ name: "login" });
            });
    }
});

/**
 * 判断当前路由类型, global: 全局路由, main: 主入口路由
 * @param {*} route 当前路由
 */
function fnCurrentRouteType(route, globalRoutes = []) {
    var temp = [];
    for (var i = 0; i < globalRoutes.length; i++) {
        if (route.path === globalRoutes[i].path) {
            return "global";
        } else if (
            globalRoutes[i].children &&
            globalRoutes[i].children.length >= 1
        ) {
            temp = temp.concat(globalRoutes[i].children);
        }
    }
    return temp.length >= 1 ? fnCurrentRouteType(route, temp) : "main";
}

/**
 * 添加动态(菜单)路由
 * @param {*} menuList 菜单列表
 * @param {*} routes 递归创建的动态(菜单)路由
 */
function fnAddDynamicMenuRoutes(menuList = [], routes = []) {

    for (var i = 0; i < menuList.length; i++) {
        var temp = [];
        if (menuList[i].list && menuList[i].list.length >= 1) {
            temp = temp.concat(menuList[i].list);
        } else if (menuList[i].url && /\S/.test(menuList[i].url)) {
            menuList[i].url = menuList[i].url.replace(/^\//, "");
            var route = {
                path: menuList[i].url.replace("/", "/"),
                component: null,
                name: menuList[i].url.replace("/", "/"),
                children: null,
                meta: {
                    menuId: menuList[i].menuId,
                    title: menuList[i].customMenuName != null ?
                        menuList[i].customMenuName : menuList[i].name,
                    isDynamic: true,
                    isTab: true,
                    iframeUrl: "",
                    // 判断模块是否存在乾坤路由表中
                    microModule: microRoute.default[menuList[i].url] ? microRoute.default[menuList[i].url] : {},
                },
            };
            // url以http[s]://开头, 通过iframe展示
            if (isURL(menuList[i].url)) {
                route["path"] = `i/${menuList[i].menuId}`;
                route["name"] = `i/${menuList[i].menuId}`;
                route["meta"]["iframeUrl"] = menuList[i].url;
            } else {
                try {
                    // 如果通过乾坤引入，跳转到乾坤页面统一加载处理
                    if (Object.keys(route['meta']['microModule']).length > 0) {
                        route["component"] = _import(`modules/MFEModule/MFEModule`) || null;
                    } else {
                        route["component"] = _import(`modules/${menuList[i].url}`) || null;
                    }
                } catch (e) {}
            }
            /**
             * @author tanjinfeng
             * @date 2020-11-23
             * @description 新增：要情记录页面，查看和新增页面作为嵌套路由
             */
            // *** 新增的代码 ***
            if (route.path === "event/emergency/emergencyinfo") {
                route.children = [{
                    path: "/emergencyinfo-add-or-update-nest",
                    component: _import(
                        "modules/event/emergency/emergencyinfo-add-or-update"
                    ),
                }, ];
            }
            // *** 结束 ***
            if (route.path === "PhoneRecord/PhoneRecord") {
                route.children = [{
                    path: "/phoneRecord-edit-or-view",
                    component: _import("modules/PhoneRecord/PhoneRecord-viewOrEdit"),
                }, ];
            }
            routes.push(route);
        }
        if (temp.length >= 1) {
            // console.log(temp.length)
            fnAddDynamicMenuRoutes(temp, routes);
        } else {
            mainRoutes.name = "main-dynamic";
            mainRoutes.children = routes;

            // console.log('\n')
            // console.log('%c!<-------------------- 动态(菜单)路由 s -------------------->', 'color:blue')
            // console.log(mainRoutes.children)
            // console.log('%c!<-------------------- 动态(菜单)路由 e -------------------->', 'color:blue')
        }
    }
}
export default router;
