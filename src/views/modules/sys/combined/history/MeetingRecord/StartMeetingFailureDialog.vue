<!--
 * @Author: yaoweixin
 * @Date: 2020-11-11 19:46:44
 * @LastEditors: yaoweixin
 * @LastEditTime: 2020-11-23 20:09:39
 * @Description: 启动会议失败弹框
 * @FilePath: \SBSNEW\src\views\modules\sys\combined\history\MeetingRecord\StartMeetingFailureDialog.vue
-->
<template>
    <div class="StartMeetingFailureDialog">
        <el-dialog
            title=""
            :visible.sync="dialogVisible"
            width="33%"
            append-to-body
            >
            <img src="~@/assets/img/Warning.svg" alt="">
            <div class="toastText">当前已有会议进行中，无法启动新会议，请关闭当前会议后重试。</div>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="dialogVisible = false">知道了</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
export default {
    name: 'StartMeetingFailureDialog',
    data() {
        return {
            dialogVisible: false//控制弹框是否显示
        }
    }
}
</script>
<style lang="less" scoped>
  .StartMeetingFailureDialog {
      /* 弹框样式 */
 /deep/ .el-dialog__wrapper {
      text-align: center;
/deep/ .el-dialog__body {
    img {
        width: 20px;
    }

    .toastText {

    }

    span.dialog-footer {
      .el-button {

      }
    }
 }
  }
}
</style>