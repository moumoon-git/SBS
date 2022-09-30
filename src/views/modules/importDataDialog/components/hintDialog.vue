<template>
  <el-dialog
    :visible.sync="dialogVisible"
    width="450px"
    append-to-body
    top="35vh"
    class="hintDialog"
    :show-close="false"
  >
    <span slot="title" class="dialog-title title">
      <span>提示</span>
      <i class="el-icon-close icon" style="cursor: pointer;" @click="dialogVisible = false"/>
    </span>
    <div class="content">
      <div class="top">
        <div class="topMessage">
          <div class="messageImg" />
          <div class="message">
            <span> 是否有下载失败信息表？</span>
            <span>关闭窗口后将无法再下载本次导入的失败信息</span>
          </div>
        </div>
      </div>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="download">
        下载失败记录
      </el-button>
      <el-button type="primary" @click="closeImportDialog">确 定</el-button>
    </span>
  </el-dialog>
</template>
<script>
export default {
  name: 'hintDialog',
  data() {
    return {
      dialogVisible: false,
    };
  },
  methods: {
    open() {
      this.dialogVisible = true;
    },
    download() {
      this.dialogVisible = false;
      this.$emit('download');
    },
    closeImportDialog() {
      this.dialogVisible = false;
      this.$emit('close');
    },
  },
};
</script>
<style scoped lang="scss">
.hintDialog /deep/ .el-dialog {
  border-radius: 5px;
}
.hintDialog /deep/ .el-dialog__body{
  padding: 0px;
}
.hintDialog /deep/ .el-dialog__header {
  border-radius: 5px 5px 0px 0px;
  padding: 10px;
  background: #F1F4F6;
}
.title{
  font-size: 15px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #333333;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.content{
  height: 120px;
  box-sizing: border-box;
  padding: 40px 0px 20px 0px;
  border-bottom: 1px solid #F2F2F2;
  .top{
    height: 50%;
    .topMessage{
      height: 70%;
      display: flex;
      padding: 20px;
      align-items: center;
      justify-content: center;
      .message{
        span{
          display: block;
        }
        & :nth-of-type(1){
          font-size: 18px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #555555;
          line-height: 20px;
        }
        & :nth-of-type(2){
          margin-top: 10px;
          font-size: 15px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #999999;
          line-height: 17px;
        }
      }
      .messageImg{
        background: url('../img/warning.svg') no-repeat;
        width: 70px;
        height: 50px;
      }
    }
    .topBtn{
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
}
</style>
