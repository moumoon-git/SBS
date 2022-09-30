import Router from "vue-router";
// import $router from "@/router";

// 乾坤路由表
let microRoute = {
  // 微前端DEMO
  'MFEDemo/MFEDemo':
  {
    module: 'ElementStyle', // 对应模块跳转的页面
  },
  // 任务管理
  'TaskManager': {
    module: 'TaskManager',
  }
}

export default microRoute;