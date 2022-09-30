<template>
  <div class="changeStatus">
    <el-dialog :title="title" :visible.sync="centerDialogVisible" width="400px" :close-on-click-modal="false">

      <img src="/static/img/ConvergedCommunication/deleteConfi.png" alt="">
      <span>是否确认{{title}}</span>

      <span slot="footer" class="dialog-footer">
        <el-button @click="centerDialogVisible = false" plain size="small">取 消</el-button>
        <el-button @click="changeStatu" type="primary" size="small">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      centerDialogVisible: false,
      remark: "",
      title: "",
    };
  },
  methods: {
    init(title) {
      this.title = title;
      this.centerDialogVisible = true
    },
    // 改变状态
    changeStatu() {
      this.$emit("deleteHandle")
      this.centerDialogVisible = false;
    }
  }
};
</script>

<style lang="scss" scoped>
.changeStatus {
  letter-spacing: 1px;
  .el-dialog--center .el-dialog__body {
    text-align: center;
  }
  /deep/ .el-dialog {
    border-radius: 5px;
    box-shadow: 0px 0px 15px 2px rgba(0,0,0,0.27);
    .el-dialog__header {
      background-color: rgba(241,244,246,1) !important;
      border-radius: 5px 5px 0 0;
      height: 40px;
      line-height: 40px;
      padding: 0 !important;
      padding-left: 20px !important;
      .el-dialog__headerbtn {
        top: 12px;
        .el-dialog__close {
          color: #ADB6C2;
        }
      }
      span {
        color: #333;
        font-size: 13px;
      }
    }
    .el-dialog__body{
      padding: 31px 0px 42px 78px;
      border-bottom: 1px solid #E9ECF1;
      color: #555;
      display: flex;
      align-items: center;
    }
    .el-dialog__footer {
      padding: 14px 20px 15px;
    }
  }
}
</style>