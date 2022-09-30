<template>
  <div class="changeStatus">
    <el-dialog :title="title+'通行证'" :visible.sync="centerDialogVisible" width="450px">
      <img v-if="title==='删除'" src="../../../../assets/img/ElectronicPass/trash.png" alt="">
      <span v-if="title==='删除'">删除所选通行证</span>
      <div v-if="title==='审核'">
        审核备注：
        <input type="text" v-model="remark" style="outline:none;border:1px solid #ccc;" />
      </div>

      <span slot="footer" class="dialog-footer">
        <el-button @click="centerDialogVisible = false">取 消</el-button>
        <el-button class="save" @click="changeStatu">{{title}}</el-button>
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
      this.type = type
      this.centerDialogVisible = true
    },
    // 改变状态
    changeStatu() {
      let status = "";
      if (this.title === "审核") {
        status = 1;
      }
      if(status || status === 0){
        this.$http({
          url: this.$http.adornUrl("/pass/passRegister/updateLockStatus"),
          method: "post",
          data: this.$http.adornData({
            messageCode: this.checkCode,
            id: this.currentId,
            lockStatus: status,
            lockReason: this.remark
          })
        }).then(({ data }) => {
          if (data && data.code === 0) {
            this.$message({
              message: "操作成功",
              type: "success",
              duration: 1500,
              onClose: () => {
                if (this.type == 1) {
                  this.$emit("getDataList");
                } else if (this.type == 2) {
                  this.$emit("getStatu");
                }
              }
            });
          } else {
            this.$message.error(data.msg);
          }
        });
      }

      if (this.title == "删除") {
        this.$emit("deleteHandle")
      }
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