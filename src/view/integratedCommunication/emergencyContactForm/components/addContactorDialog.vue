<!-- 事件上报弹窗 eventReportDialog.vue -->
<template>
  <div>
    <el-dialog
      title="事件上报"
      width="1090px"
      :visible.sync="dialogVisible"
      :before-close="handleClose"
      :close-on-click-modal="false"
      class="dialog-style">
      <div class="dialog-content">
        <div class="item">
          <div class="title">单位信息</div>

        </div>
      </div>
      
    </el-dialog>
  </div>
</template>
<script>

export default {
  name: 'addContactorDialog',
  data() {
    return {
      gutter:24,
      dialogVisible: true,
    }
  },
  methods: {
    handleClose() {
      this.$emit('close')
    },
    handleChange() {

    }
  }
}
</script>
<style scoped>
/deep/ .dialog-style .el-dialog {
  margin-top: 40px !important;
}
/deep/ .dialog-style .el-dialog__header {
  background:rgba(241,244,246,1);
  text-align: left !important;
  padding: 10px 20px;
  border-radius: 5px 5px 0 0;
}
/deep/ .dialog-style .el-dialog__headerbtn {
  top: 15px !important;
}
/deep/ .dialog-style .el-dialog__body {
  padding: 14px 30px;
  height: 758px;
  border-radius: 0 0 7px 7px;
  position: relative;
}
.dialog-content {
  height: 100%;
  overflow: scroll;
}
.item {
  margin-bottom: 14px;
}
.title {
  height:20px;
  font-size:18px;
  font-weight:bold;
  color:rgba(51,51,51,1);
  line-height:20px;
  text-align: left;
  margin-bottom: 17px;
  border-left: 2px solid #0091FF;
  padding-left: 11px;
}

</style>