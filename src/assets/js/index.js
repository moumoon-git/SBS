// 倒入所有接口
import apiList from '../interface/interface'
import eventRegistration from '../interface/eventRegistration'
const install = Vue => {
  if (install.installed)
    return;
  install.installed = true;

  Object.defineProperties(Vue.prototype, {
    /*
    * 注意,此处挂载在 Vue 原型的 $api 对象上
    * */
    $api: {
      get() {
        return apiList
      }
    },
    $szApi:{
      get() {
        return eventRegistration
      }
    }
  })


}



export default install
