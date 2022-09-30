<template>
  <div class="changeStatus">
    <el-dialog :title="'删除企业申请'" :visible.sync="centerDialogVisible" width="450px">
      <img src="../../../../assets/img/ElectronicPass/trash.png" alt="">
      <span >是否删除所选企业申请</span>

      <span slot="footer" class="dialog-footer">
        <el-button @click="centerDialogVisible = false">取 消</el-button>
        <el-button class="save" @click="changeStatu">删除</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      centerDialogVisible: false,
      checkCode: "",
      remark: "",
      title: "",
      currentId: "",
      type: ""
    };
  },
  methods: {
    init(id, checkCode, title, type) {
      this.currentId = id;
      this.checkCode = checkCode;
      this.title = title;
      this.centerDialogVisible = true
      this.type = type
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
  .el-dialog--center .el-dialog__body {
    text-align: center;
  }
  /deep/ .el-dialog {
    border-radius: 5px;
    box-shadow: 0px 0px 15px 2px rgba(0,0,0,0.27);
    .el-dialog__header {
      background-color: rgba(241,244,246,1) !important;
      padding: 11px 0 11px 20px;
      border-radius: 5px 5px 0 0;
      font-size: 25px;
      .el-dialog__headerbtn {
        top: 19px;
        .el-dialog__close {
          color: #ADB6C2;
        }
      }
      span {
        color: #333;
      }
    }
    .el-dialog__body{
      padding: 30px 71.5px;
    }
  }
  .save {
    color: white !important;
    background-color: #0091ff !important;
    border-color: #0091ff !important;
  }
}
</style>