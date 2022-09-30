<template>
  <div>
    <el-dialog title="发送短信" :visible.sync="centerDialogVisible" width="500px" center custom-class="resetStyle">
      <p>短信内容：</p>
      <el-input type="textarea" v-model="content" rows="5" resize="none" placeholder="请输入200字以内短信内容" maxlength="200"></el-input>
      <p style="text-align:right">字数{{content.length}}/200</p>
      <span slot="footer" class="dialog-footer">
        <el-button @click="centerDialogVisible = false">取 消</el-button>
        <el-button @click="toSend">确 定</el-button>
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
      content: '',
      currentId: '',
      url: '',
    };
  },
  methods: {
    init(id,url){
      this.currentId = id
      this.url = url
        this.centerDialogVisible = true
    },
    // 发送短信
    toSend(){
       this.$http({
        url: this.$http.adornUrl(this.url),
        method: "post",
        data: this.$http.adornData({
            ids: [this.currentId],
            content: this.content,
        })
      }).then(({ data }) => {
        // console.log(data);
        if (data.code == 0) {
          this.$message({
            type: "success",
            message:'发送成功',
          });
          this.centerDialogVisible = false
        } else {
          this.$message.error(data.msg)
        }
      });
    },
  }
};
</script>

<style lang="scss" scpoed>
p {
  margin: 0;
}
.el-dialog {
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
  }
}
.message-logout{
    display: initial !important;
    text-align: center !important;
}

</style>