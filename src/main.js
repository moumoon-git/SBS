import Vue from 'vue'
Vue.prototype.$window = window
import App from '@/App'
import router from '@/router'                 // api: https://github.com/vuejs/vue-router
import store from '@/store'                   // api: https://github.com/vuejs/vuex
import VueCookie from 'vue-cookie'            // api: https://github.com/alfhen/vue-cookie
import '@/element-ui'                         // api: https://github.com/ElemeFE/element
import '@/icons'                              // api: http://www.iconfont.cn/
import '@/element-ui-theme'
import '@/assets/scss/index.scss'
import httpRequest from '@/utils/httpRequest' // api: https://github.com/axios/axios
import { isAuth } from '@/utils'
import cloneDeep from 'lodash/cloneDeep'
// import VueAMap from 'vue-amap'
// 引入字体
import '@/assets/scss/SourceHanSans.scss'
import '@/assets/scss/Roboto.scss'
// 引入sinvieUI
import sinvieUI from '@/sinvieUI' // 组件
import '@/sinvieUI/scss/index.scss' // 样式
Vue.use(sinvieUI)
import '@/views/modules/Element/style/index.scss' // ElementUI 覆写样式
import VueClipboard from "vue-clipboard2";
Vue.use(VueClipboard); //使用一键复制
// 倒入 interface 文件夹下的 index.js,封装的api请求
import api from "./assets/js/index";
Vue.use(api);
import "./assets/js/utils";
Vue.prototype.$bus = Vue.prototype.$bus || new Vue(); //注册一个全局的总线组件

// import { lazyAMapApiLoaderInstance } from 'vue-amap';


import 'xe-utils'
import VXETable from 'vxe-table'
import VXETablePluginElement from 'vxe-table-plugin-element'
import 'vxe-table/lib/index.css'
import 'vxe-table-plugin-element/dist/style.css'
import 'jquery'
//import echarts from 'echarts'
import Viewer from 'v-viewer'
import 'viewerjs/dist/viewer.css'
// 颜色选择器
// import vcolorpicker from 'vcolorpicker'

// 电话拨接 全局挂载使用
import callPhone from './assets/js/callPhone'
Vue.prototype.callPhone = callPhone

import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');
Vue.prototype.$moment = moment

import _ from 'lodash'
//打印
import Print from "vue-print-nb";
import regular from "@/assets/js/regular.js";
import transformationTime from "@/assets/js/transformationTime.js";
import ParentnodeTree from "./assets/js/ParentnodeTree.js";
Vue.prototype.$ParentnodeTree = ParentnodeTree;
Vue.prototype.transformationTime = transformationTime;
Vue.prototype.$regular = regular;
Vue.prototype.$getQueryVariable = function getQueryVariable(variable)
{   
    var query = window.location.search.substring(1) || window.location.hash.split('?').slice(-1);
    var vars = query.split("&");
    for (var i=0;i<vars.length;i++) {
            var pair = vars[i].split("=");
            if(pair[0] == variable){return pair[1];}
    }
    return(false);
};
import Swiper from "swiper";
import "swiper/css/swiper.min.css";
import "swiper/js/swiper.min.js";
Vue.prototype.$Swiper = Swiper;

import uploader from "vue-simple-uploader";
Vue.use(uploader);

import "@/assets/js/htmlToPdf"; //生成pdf

Vue.use(Print); //注册

Vue.prototype._ = _


Vue.config.optionMergeStrategies.test = function(parent,child,vm){
  return child + 1
}

Vue.use(Viewer)
// Vue.use(vcolorpicker)


// Vue.use(Viewer)
// Viewer.setDefaults({
//   Options: { 'inline': true, 'button': true, 'navbar': true, 'title': true, 'toolbar': true, 'tooltip': true, 'movable': true, 'zoomable': true, 'rotatable': true, 'scalable': true, 'transition': true, 'fullscreen': true, 'keyboard': true, }
// })

Vue.use(VXETable)
VXETable.use(VXETablePluginElement)
Vue.config.productionTip = false

Vue.use(VueCookie)
// Vue.use(VueAMap)
// 非生产环境, 适配mockjs模拟数据                 // api: https://github.com/nuysoft/Mock
if (process.env.NODE_ENV !== 'production') {
  require('@/mock')
}

// 挂载全局
Vue.prototype.$http = httpRequest // ajax请求方法
Vue.prototype.isAuth = isAuth     // 权限方法

// 保存整站vuex本地储存初始状态
window.SITE_CONFIG['storeState'] = cloneDeep(store.state)

// 高德地图初始化
// VueAMap.initAMapApiLoader({
//   key: '1a4636d76aab717a3a560d3307d40fcf',
//   plugin: ['AMap.Scale', 'AMap.OverView', 'AMap.ToolBar', 'AMap.Geocoder', 'AMap.MapType', 'AMap.PlaceSearch', 'AMap.Autocomplete', 'Geolocation','AMap.DistrictSearch'],
//   uiVersion: '1.0', // ui库版本，不配置不加载,
//   v: '1.4.4'
// })

Vue.directive('dialogDrag', {
  bind(el, binding, vnode, oldVnode) {
    const dialogHeaderEl = el.querySelector('.el-dialog__header')
    const dragDom = el.querySelector('.el-dialog')
    dialogHeaderEl.style.cursor = 'move'

    // 获取原有属性 ie dom元素.currentStyle 火狐谷歌 window.getComputedStyle(dom元素, null);
    const sty = dragDom.currentStyle || window.getComputedStyle(dragDom, null)

    dialogHeaderEl.onmousedown = (e) => {
      // 鼠标按下，计算当前元素距离可视区的距离
      const disX = e.clientX - dialogHeaderEl.offsetLeft
      const disY = e.clientY - dialogHeaderEl.offsetTop

      // 获取到的值带px 正则匹配替换
      let styL, styT

      // 注意在ie中 第一次获取到的值为组件自带50% 移动之后赋值为px
      if (sty.left.includes('%')) {
        styL = +document.body.clientWidth * (+sty.left.replace(/\%/g, '') / 100)
        styT = +document.body.clientHeight * (+sty.top.replace(/\%/g, '') / 100)
      } else {
        styL = +sty.left.replace(/\px/g, '')
        styT = +sty.top.replace(/\px/g, '')
      }

      document.onmousemove = function(e) {
        // 通过事件委托，计算移动的距离
        const l = e.clientX - disX
        const t = e.clientY - disY

        // 移动当前元素
        dragDom.style.left = `${l + styL}px`
        dragDom.style.top = `${t + styT}px`

        // 将此时的位置传出去
        // binding.value({x:e.pageX,y:e.pageY})
      }

      document.onmouseup = function(e) {
        document.onmousemove = null
        document.onmouseup = null
      }
    }
  }
})
// 优化表格加载
Vue.directive('loadmore',{
  bind(el,binding){
    const selectWrap = el.querySelector('.el-table__body-wrapper')
    selectWrap.addEventListener('scroll',function(){

      let sign = 100
      const scrollDistance = this.scrollHeight - this.scrollTop - this.clientHeight
       if(scrollDistance <= sign){
         binding.value()
       }
    })

  }
})
// lazyAMapApiLoaderInstance.load().then(() => {
//   // your code ...
//   // this.map = new AMap.Map('amapContainer', {
//   //   center: new AMap.LngLat(121.59996, 31.197646)
//   // });
//   AMap.plugin('AMap.DistrictSearch', function () {
//     var districtSearch = new AMap.DistrictSearch({
//       // 关键字对应的行政区级别，country表示国家
//       level: 'country',
//       //  显示下级行政区级数，1表示返回下一级行政区
//       subdistrict: 1
//     })

//     // 搜索所有省/直辖市信息
//     districtSearch.search('中国', function(status, result) {
//       // 查询成功时，result即为对应的行政区信息
//     })
//   })
// });
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})
