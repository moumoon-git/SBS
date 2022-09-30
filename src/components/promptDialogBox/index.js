// 全局引入封装的弹窗提示组件 author:hexinting date:2020-12-16
import promptDialogBoxGlobal from "@/components/promptDialogBox/promptDialogBox_global.vue";
 
const promptDialog = {};

promptDialog.install = ((Vue) => {
  const vue = Vue;
  const PromptDialogClass = vue.extend(promptDialogBoxGlobal);
  const instance = new PromptDialogClass();
  instance.$mount(document.createElement('div'));
  document.body.appendChild(instance.$el);

  const promptDialogMain = {
    showDialog (promptConfig) {
      instance.showDialog(promptConfig);
    }
  };

  vue.prototype.$prompt = promptDialogMain
  // 用法：
  // this.$prompt.showDialog({
  //     type: 'warn', // 弹窗类型：delete:删除提示弹窗,warn：警告提示弹窗,success：成功提示弹窗,error：错误提示弹窗,info：常规类信息提示弹窗,default：不包含icon提示弹窗
  //     maskClosable: false, // 点击蒙层是否允许关闭
  //     title: '温馨提示', // 标题
  //     content: '确定删除？', // 内容
  //     tips: '删除后将不可恢复！', // 小字提示
  //     confirmText: '确定', // 确认按钮文本，默认值：“确定”
  //     cancelText: '取消', // 取消按钮文本，默认值：“取消”
  //     showCancel: true, // 是否显示取消按钮，默认true
  //     showIcon: true, // 是否需要显示左边的图标，默认true
  //     onConfirm: () => {
  //       console.log('点击了确定按钮！')
  //     },
  //     onCancel: () => {
  //       console.log('点击了取消按钮！')
  //     }
  // })

})

 export default promptDialog;