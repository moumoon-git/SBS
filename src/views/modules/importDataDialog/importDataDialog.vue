<template>
  <el-dialog
    :visible.sync="dialogVisible"
    width="500px"
    class="dialog"
    top="28vh"
    :show-close="false"
    :before-close="openHintDialog"
  >
    <span slot="title" class="dialog-title title">
      <span>导入提示</span>
      <i class="el-icon-close icon" style="cursor: pointer;" @click="openHintDialog"/>
    </span>
    <el-tabs v-model="activeName" @tab-click="handleTabs" v-if="tabs.length">
      <el-tab-pane
        v-for="item in tabs"
        :key="item.id"
        :label="item.label"
        :name="item.id"
      />
    </el-tabs>
    <div class="content">
      <div class="top">
        <div class="topMessage">
          <div class="messageImg" />
          <div class="message">
            <span> {{ data.msg }}</span>
            <span>您可以下载导入失败的信息，修改后重新上传</span>
          </div>
        </div>
        <div class="topBtn">
          <el-button @click="reUpload">
            再次上传
          </el-button>
          <el-button type="primary" @click="downloadErrorMsg" :disabled="!data.errorData.length">
            下载失败记录
          </el-button>
        </div>
      </div>
      <div class="buttom" v-if="data.errorData.length">
        <span class="buttomTitle">失败记录</span>
        <ul>
          <li v-for="item in data.errorData" :key="item.id">
            <span>行数{{ item.errorNum }}:</span>
            <span>{{ item.errorMsg }}</span>
          </li>
        </ul>
      </div>
    </div>
    <hintDialog
      ref="hintDialogRef"
      @close="close"
      @download="downloadErrorMsg"
    />
  </el-dialog>
</template>
<script>
// 关闭窗口前的提示窗口
import hintDialog from './components/hintDialog.vue';

export default {
  name: 'importDataDialog',
  components: {
    hintDialog,
  },
  props: {
    tabs: {
      type: Array,
      default: () => [],
    },
    downLoadUrl: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      dialogVisible: false,
      // success: 99,
      // error: 10,
      data: '',
      activeName: '0',
    };
  },
  methods: {
    /**
     * 切换数据
    */
    handleTabs() {
      this.$emit('switchTabs', this.activeName);
    },
    open(data) {
      this.dialogVisible = true;
      this.data = data;
      this.activeName = '0';
    },
    close() {
      // this.openHintDialog();
      this.dialogVisible = false;
    },
    openHintDialog() {
      this.$refs.hintDialogRef.open();
    },
    /**
     * 再次上传
     */
    reUpload() {
      this.$emit('reUpload');
      this.dialogVisible = false;
    },
    /**
     * @method
     * @desc 下载错误信息详情
     * @param {String} url 接口地址
     */
    downloadErrorMsg() {
      if (this.data.errorData.length === 0) {
        this.$message.error('无错误记录下载!');
        return;
      }
      const request = {
        method: 'post',
        url: this.downLoadUrl,
        baseURL: window.SITE_CONFIG.cloudUrl,
        data: {
          params: this.data.errorData,
        },
        responseType: 'arraybuffer',
      };
      if (this.tabs.length) {
        delete request.params;
        if (this.activeName === '0') {
          request.data = {
            articleList: this.data.errorData,
            storeList: [],
          };
        } else {
          request.data = {
            storeList: this.data.errorData,
            articleList: [],
          };
        }
      }
      this.$http(request)
        .then((response) => {
          if (navigator.msSaveOrOpenBlob) {
            // 兼容ie
            navigator.msSaveOrOpenBlob(
              new Blob([response.data], { type: 'application/vnd.ms-excel' }),
              '导入模板.xls',
            );
          } else {
            // 后端导出响应头返回的content-disposition，文件名是filename字段，或许有的接口是返回fileName，所以加了判断
            const str =
              decodeURI(response.headers['content-disposition']).indexOf(
                'filename',
              ) > -1
                ? 'filename='
                : 'fileName=';
            const fileName1 = decodeURI(
              escape(response.headers['content-disposition']),
            ).split('fileName%3D')[1];
            const fileName2 = decodeURI(
              escape(response.headers['content-disposition']),
            ).split('filename%3D')[1];
            const fileName = fileName1 || fileName2;
            const a = document.createElement('a');
            a.href = window.URL.createObjectURL(
              new Blob([response.data], { type: 'application/vnd.ms-excel' }),
            );
            a.download = fileName || '错误信息.xls';
            document.body.appendChild(a); // 兼容Firefox浏览器
            a.click();
            a.remove();
          }
        })
        .catch((error) => {

        });
    },
  },
};
</script>
<style scoped lang="scss">
.dialog /deep/ .el-dialog {
  border-radius: 5px;
}
 .dialog /deep/ .el-dialog__body{
  padding: 0px;
}
.dialog /deep/ .el-dialog__header {
  border-radius: 5px 5px 0px 0px;
  padding: 10px;
  background: #F1F4F6;
}
.dialog /deep/ .el-tabs__item {
  font-size: 16px;
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
  // height: 340px;
  .top{
    height: 170px;
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
        background: url('./img/hint.png') no-repeat;
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
  .buttom{
    height: 170px;
    font-size: 15px;
    font-weight: 500;
    color: #555555;
    line-height: 18px;
    ul{
      list-style: none;
      padding:0;
      margin: 5px 0px;
      overflow: auto;
      &::-webkit-scrollbar {
        width: 5px;
        background: transparent;
      }

      &::-webkit-scrollbar-thumb {
        border-radius: 5px;
        background: #d5d5d5;
      }
      height: 75%;
      li{
        color: #999999;
        margin: 5px 0px;
        display: flex;
        span:first-child{
          display: inline-block;
          width: 80px;
          text-align: right;
          margin-right: 5px;
        }
        span:last-child{
          display: inline-block;
          width: 75%;
        }

      }
    }
    .buttomTitle {
      width: 100%;
      padding: 10px;
      font-weight: blod;
      &::after{
        content: ' -------------------------------------------------------------';
        color: #EBEDF0;
      }
    }
  }
}

</style>
