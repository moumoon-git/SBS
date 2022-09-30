<!--author:hexinting date:2020-12-16 description:弹窗提示组件-->
<template>
  <div class="promptDialogBox">
    <el-dialog
      :title="title"
      :visible.sync="visible"
      :close-on-click-modal="maskClosable"
      :before-close="onCancel"
      :append-to-body="appendToBody"
      width="440px"
      class="promptDialogBox">
      <div class="prompt_content">
        <template v-if="showIcon">
          <!-- 弹窗类型：delete:删除提示弹窗,warn：警告提示弹窗,success：成功提示弹窗,error：错误提示弹窗,info：常规类信息提示弹窗,default：不包含icon提示弹窗 -->
          <img v-if="type === 'delete'" src="./../../../static/img/promptDialogIcon/delete.png" alt="" class="icon">
          <img v-else-if="type === 'warn'" src="./../../../static/img/promptDialogIcon/warn.png" alt="" class="icon">
          <img v-else-if="type === 'success'" src="./../../../static/img/promptDialogIcon/success.png" alt="" class="icon">
          <img v-else-if="type === 'error'" src="./../../../static/img/promptDialogIcon/error.png" alt="" class="icon">
          <img v-else-if="type === 'info'" src="./../../../static/img/promptDialogIcon/info.png" alt="" class="icon">
        </template>
        <div class="promptText_content">
          <!-- 弹窗提示文本 -->
          <p class="promptText">{{ content }}</p>
          <!-- 二级提示文本 -->
          <p v-show="tips !== ''" class="sub_promptText">{{ tips }}</p>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <!-- 返回 -->
        <el-button v-if="showCancel" size="small" @click="onCancel">{{ cancelText }}</el-button>
        <!-- 确认 -->
        <el-button size="small" type="primary" @click="onConfirm">{{ confirmText }}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  let confirmCallback = null;
  let cancelCallback = null;

  export default {
    name: 'promptDialogBoxGlobal',
    props: {},
    data() {
      return {
        type: 'default', // 弹窗类型：delete:删除提示弹窗,warn：警告提示弹窗,success：成功提示弹窗,error：错误提示弹窗,info：常规类信息提示弹窗,default：不包含icon提示弹窗
        visible: false, // 对话框显示/隐藏
        maskClosable: false, // 点击蒙层是否允许关闭
        title: '', // 标题
        content: '', // 内容
        tips: '', // 小字提示
        confirmText: '确定', // 确认按钮文本
        cancelText: '取消', // 取消按钮文本
        showCancel: true, // 是否显示取消按钮
        appendToBody: true, // Dialog 自身是否插入到body
        showIcon: true // 是否需要显示左边的图标
      };
    },
    methods: {
      /**
       * @author hexinting
       * @date 2020-12-16
       * @description 显示对话框
       */
      showDialog({
        type,
        maskClosable,
        title,
        content,
        tips,
        confirmText,
        cancelText,
        showCancel,
        showIcon,
        onConfirm,
        onCancel
      }) {
        this.visible = true;
        this.type = type || 'default';
        this.maskClosable = maskClosable || false;
        this.title = title || '';
        this.content = content || '';
        this.tips = tips || '';
        this.confirmText = confirmText || '确定';
        this.cancelText = cancelText || '取消';
        this.showCancel = showCancel || true;
        this.showIcon = showIcon || true;
        confirmCallback = onConfirm;
        cancelCallback = onCancel;
      },
      /**
       * 关闭对话框
       */
      closeDialog() {
        this.visible = false
      },
      /**
       * 点击确认
       */
      onConfirm() {
        this.closeDialog()
        if (confirmCallback) {
          confirmCallback()
        }
      },
      /**
       * 点击取消
       */
      onCancel() {
        this.closeDialog()
        if (cancelCallback) {
          cancelCallback()
        }
      }
    }
  };
</script>

<style scoped>
>>> [role="dialog"] {
  margin: auto !important;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
.promptDialogBox {
  text-align: left;
}
.promptDialogBox >>> .el-dialog__body {
  padding: 30px 20px;
}
.promptDialogBox >>> .el-dialog__header {
  padding: 13px 0 11px 22px;
  background: #F1F4F6 !important;
  border-radius: 10px 10px 0px 0px;
}
.promptDialogBox >>> .el-dialog__title {
  font-size: 14px;
  color: rgba(51, 51, 51, 1);
}
.promptDialogBox .icon {
  width: 46px;
  height: 48px;
  margin-right: 15px;
}
.promptDialogBox .prompt_content {
  display: flex;
  padding: 0 32px;
}
.promptDialogBox .promptText_content {
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.promptDialogBox >>> .el-dialog__footer {
  height: 56px;
  border-top: 1px solid rgba(242, 242, 242, 1);
}
.promptText {
  padding: 0;
  color: rgba(85, 85, 85, 1);
  margin: 0;
}
.sub_promptText {
  padding: 0;
  font-size:12px;
  color:rgba(153, 153, 153, 1);
}
</style>