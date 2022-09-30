import axios from "axios"; // 引入axios
import config from "../../assets/js/httpConfig"; // 倒入默认配置
import router from "../../router/index";
import { Notification, MessageBox } from "element-ui";
import NProgress from "nprogress";
import icp19 from "../js/HWICP-19.0/ucsApi";
import store from "@/store/index";
import { phoneReset } from "../js/common";
//引入element ui的弹窗
import cookie from "js-cookie";

let MessageBoxshow = true;
export default function $axios(options) {
    return new Promise((resolve, reject) => {
        const instance = axios.create({
            baseURL: config.baseURL,
            headers: {
                // 把token捞出来
                Authorization: localStorage.getItem("token") || cookie.get("token"),
                token: cookie.get("token") || localStorage.getItem("token"),
            },
            transformResponse: [function(data) {}],
        });

        // http request 拦截器
        instance.interceptors.request.use(
            (config) => {
                // startLoading()
                NProgress.start();
                return config;
            },
            (err) => {
                return Promise.reject(err);
            }
        );
        // response 拦截器

        instance.interceptors.response.use(
            (response) => {
                NProgress.done();
                let data;

                if (response.data === undefined) {
                    if (response.headers && response.headers['content-disposition']) {
                        // 是文件下载时
                        return response;
                    }
                    try {
                        data = JSON.parse(response.request.responseText); //将返回的字段转为JSON,可以和后台约定
                    } catch (e) {
                        data = response.request.responseText;
                    }
                } else {
                    data = response.data;
                }

                if (data.errorcode == "10002" || data.errorcode == "10004") {
                    if (MessageBoxshow) {
                        MessageBox.alert(data.msg, "提示", {
                            //多个接口同时请求，会弹出多次弹窗，目前最方便是定义MessageBoxshow变量，但是太low不治本 ，这是bug，未解决？
                            confirmButtonText: "确定",
                            callback: () => {
                                icp19.UnInitialize(function() {
                                    phoneReset(); //重置计时
                                    let boxList = [{
                                            current: 1,
                                            text: "三方",
                                            start: false,
                                            url: "/static/img/phoneCallImg/peopleGray.png",
                                        },
                                        {
                                            current: 1,
                                            text: "拨号",
                                            start: false,
                                            url: "/static/img/phoneCallImg/callGray.png",
                                        },
                                        {
                                            current: 1,
                                            text: "恢复",
                                            start: false,
                                            url: "/static/img/phoneCallImg/recoverGray.png",
                                        },
                                        {
                                            current: 1,
                                            text: "转接",
                                            start: false,
                                            url: "/static/img/phoneCallImg/switchGray.png",
                                        },
                                        {
                                            current: 1,
                                            text: "拨号盘",
                                            start: true,
                                            url: "/static/img/phoneCallImg/phoneBlue.png",
                                        },
                                        {
                                            current: 1,
                                            text: "保持",
                                            start: false,
                                            url: "/static/img/phoneCallImg/keepCallingGray.png",
                                        },
                                    ];
                                    store.commit("setBoxList", boxList); //复原新的拨号组可操作按钮
                                    store.commit("setPhoneList", []); //提交修改状态之后的通话列表
                                    store.commit("setNowSelectPhoneList", []);
                                    store.commit("setPhoneState", 5); // 三方通话存储当前通话类型
                                    store.commit("setThreePhoneList", []); //存储三方列表
                                    store.commit("setIsCallPhone", "hangUp"); //不在通话状态,关闭弹窗
                                    store.commit("setIsPhoneCallStatus", false); //修改是否可以操作队列
                                    store.commit("setCallStatus", false); //旧弹窗关闭
                                    store.commit("SET_ISSHOWWIN", false);
                                    store.commit("setCallClass", "");
                                    store.commit("SET_USERC", {});
                                    store.commit("setTxtNotify", []);
                                    store.commit("setIsDialogType", "");
                                    store.commit("setUploadAgent", false); //是否加载agent
                                });
                                router.replace({
                                    path: window.g.route,
                                    querry: {
                                        redirect: router.currentRoute.fullPath,
                                    },
                                });
                            },
                        });
                        MessageBoxshow = false;
                    }
                } else {
                    MessageBoxshow = true;
                    return data;
                }
            },
            (error) => {
                return Promise.reject(error);
            }
        );
        //请求处理
        instance(options)
            .then((res) => {
                resolve(res);
                return false;
            })
            .catch((error) => {
                reject(error);
                let notifyInstance = Notification.warning("网络连接延时!");
                if (notifyInstance) {
                    notifyInstance.close();
                }
            });
    });
}