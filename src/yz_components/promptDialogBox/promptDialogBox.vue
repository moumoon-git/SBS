<!--author:hexinting date:2020-10-25 description:弹窗提示组件-->
<template>
  <div class="promptDialogBox">
    <el-dialog
      :title="promptDialogConfig.promptTitle"
      :visible.sync="dialogVisible"
      :close-on-click-modal="closeOnClickModal"
      :before-close="handleClose"
      :append-to-body="appendToBody"
      width="440px"
      class="promptDialogBox">
      <div class="prompt_content">
        <template v-if="promptDialogConfig.isNeedIcon">
          <!-- 弹窗类型：delete:删除提示弹窗,warn：警告提示弹窗,success：成功提示弹窗,error：错误提示弹窗,info：常规类信息提示弹窗,default：不包含icon提示弹窗 -->
          <img v-if="promptDialogConfig.promptType === 'delete'" src="./../../../static/img/promptDialogIcon/delete.png" alt="" class="icon">
          <img v-if="promptDialogConfig.promptType === 'warn'" src="./../../../static/img/promptDialogIcon/warn.png" alt="" class="icon">
          <img v-if="promptDialogConfig.promptType === 'success'" src="./../../../static/img/promptDialogIcon/success.png" alt="" class="icon">
          <img v-if="promptDialogConfig.promptType === 'error'" src="./../../../static/img/promptDialogIcon/error.png" alt="" class="icon">
          <img v-if="promptDialogConfig.promptType === 'info'" src="./../../../static/img/promptDialogIcon/info.png" alt="" class="icon">
        </template>
        <div class="promptText_content">
          <!-- 弹窗提示文本 -->
          <p class="promptText">{{ promptDialogConfig.promptText }}</p>
          <!-- 二级提示文本 -->
          <p v-if="promptDialogConfig.subPomptText && promptDialogConfig.subPomptText !== ''" class="sub_promptText">{{ promptDialogConfig.subPomptText }}</p>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <!-- 返回 -->
        <el-button v-if="promptDialogConfig.cancelButtonText !== ''" size="small" @click="cancel">{{ promptDialogConfig.cancelButtonText }}</el-button>
        <!-- 确认 -->
        <el-button v-if="promptDialogConfig.confirmButtonText !== ''" size="small" type="primary" @click="confirm">{{ promptDialogConfig.confirmButtonText }}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: 'promptDialogBox',
    props: {
      promptDialogConfig: {
        type: Object,
        default: function() {
          return {
            visible: false, // 是否显示弹窗
            promptType: 'warn', // 弹窗类型：delete:删除提示弹窗,warn：警告提示弹窗,success：成功提示弹窗,error：错误提示弹窗,info：常规类信息提示弹窗,default：不包含icon提示弹窗
            promptTitle: '', // 弹窗标题
            promptText: '', // 弹窗提示文本
            subPomptText: '', // 二级提示文本
            cancelButtonText: '取消', // 取消操作按钮文本
            confirmButtonText: '确定', // 确认操作按钮文本
            isNeedIcon: true // 是否需要显示左边的图标
          }
        }
      }
    },
    watch:{
      promptDialogConfig: {
        handler: function(newVal) {
          console.log('promptDialogConfig', newVal)
        }
      }
    },
    data() {
      return {
        dialogVisible: true, // 弹窗显示隐藏
        closeOnClickModal: false, // 是否可以通过点击 modal 关闭 Dialog
        appendToBody: true // Dialog 自身是否插入至 body 元素上。嵌套的 Dialog 必须指定该属性并赋值为 true
      };
    },
    methods: {
      /**
       * @author hexinting
       * @date 2020-10-25
       * @description 取消
       */
      cancel() {
        this.$emit('cancel')
      },
      /**
       * @author hexinting
       * @date 2020-10-25
       * @description 确认
       */
      confirm() {
        this.$emit('confirm')
      },
      /**
       * @author hexinting
       * @date 2020-10-25
       * @description 关闭弹窗
       */
      handleClose() {
        this.$emit('cancel')
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