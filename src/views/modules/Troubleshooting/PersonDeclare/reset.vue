<template>
  <div>
    <el-dialog title="重置口令" :visible.sync="centerDialogVisible" width="500px" center custom-class="resetStyle">
      <div>
        <div style="text-align:center;margin: 20px 0">重置口令后，原口令将失效，请谨慎操作</div>
        <div style="display:flex;">
          登录密码：
          <el-input style="width:320px" v-model="password"></el-input>
        </div>
        <p style="color:red;height:33px">{{tip}}</p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="centerDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="sureReset">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import $ from "jquery";
export default {
  data() {
    return {
      centerDialogVisible: false,
      password: '',
      tip: '',
    };
  },
  methods: {
    init(){
        this.centerDialogVisible = true
    },
    sureReset() {
      this.$http({
        url: this.$http.adornUrl("/pass/passCode/reupdatePer"),
        method: "post",
        data: this.$http.adornData({
            password: this.password
        })
      }).then(({ data }) => {
        console.log(data);
        if (data.msg === "success") {
          this.$message({
            type: "success",
            customClass: 'message-logout',
            dangerouslyUseHTMLString: true,
            message:
              '<br><div style="margin:20px 0;">原口已令失效，请使用新口令进行相关业务操作。<div>'
          });
          $(".el-message__icon").after("<span>重置成功</span>");
          this.centerDialogVisible = false;
          this.$emit('udpateCode',data.code)
          this.password = ''
        } else {
          this.tip = '重置失败，登录' + data.msg
        }
      });
    }
  }
};
</script>

<style lang="scss" scpoed>
p {
  margin: 0;
}
.resetStyle {
  border-radius: 10px;
  .el-dialog__header {
    background-color: rgba(241, 244, 246, 1) !important;
    border-radius: 8px 8px 0 0;
    padding: 15px 0 15px 20px !important;
    font-weight: initial !important;
    .el-dialog__headerbtn {
      top: 14px;
    }
    span {
      color: #333333;
    }
  }
  .el-dialog__body {
    padding: 10px 10px 20px 20px;
    color: black;
  }
}
.message-logout{
    display: initial !important;
    text-align: center !important;
}

</style>