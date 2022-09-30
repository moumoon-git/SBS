<template>
  <el-dialog
    class="sbs-dialog"
    :visible.sync="dialogVisible"
    width="20vw"
    :show-close="false"
    append-to-body
    top="30vh"
  >
    <span slot="title" class="dialog-title " :class="$style.title">
      <span>下载文件</span>
      <i class="el-icon-close icon" style="cursor: pointer;" @click="dialogVisible = false"/>
    </span>
    <div :class="$style.main">
      <div :class="$style.top">
        <div>
          <div :class="$style.icon" />
          <div :class="$style.fileName" :title="file.name">
            {{ file.fileName }}
          </div>
        </div>
        <el-button class="sbs-button" @click="downloadFile(file)">本地下载</el-button>
      </div>
      <div :class="$style.bottom">
        <canvas id="canvas" :class="$style.canvas"/>
        <div>
          扫码下载
        </div>
      </div>
    </div>
  </el-dialog>
</template>
<script>
import QRCode from 'qrcode';

export default {
  name: 'downloadDialog',
  data() {
    return {
      dialogVisible: false,
      file: '',
    };
  },
  methods: {
    open(item) {
      this.file = item;
      console.log(item);
      this.dialogVisible = true;
      this.$nextTick(() => {
        this.useqrcode();
      });
    },
    // 下载
    downloadFile() {
      window.open(`${window.SITE_CONFIG.fileupload}/loginPageFile/downloadLoginPageFile?path=${this.file.url}`, '_blank');
    },
    /**
     * 生成二维码
     */
    useqrcode() {
      const QueryDetail = `${window.SITE_CONFIG.fileupload}/loginPageFile/downloadLoginPageFile?path=${this.file.url}`;
      const canvas = document.getElementById('canvas');
      QRCode.toCanvas(canvas, QueryDetail, (error) => {
        if (error) {
          this.$message({
            message: '二维码加载失败',
            type: 'error',
          });
        }
      });
    },
  },
};

</script>
<style module lang="scss">
  .title{
      font-size: 15px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #333333;
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
  }
.main{
  height: 300px;
  .top{
    padding: 0px 20px;
    border-bottom: 1px solid #F2F2F2;
    height: 100px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    div:nth-of-type(1){
      display: flex;
      align-items: center;
      font-size: 14px;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: #333333;
    }
    .fileName{
      max-width: 200px;
      overflow: hidden;
      text-overflow:ellipsis;
      white-space:nowrap;
    }
    .icon{
      width: 40px;
      height: 40px;
      background: url(../../assets/img/download3.svg) no-repeat 100%/100%;
      margin-right: 5px;
    }
  }
  .bottom{
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    .canvas{
      width: 150px !important;
      height: 150px !important;
    }
    div{
      width: 200px;
      height: 40px;
      // border: 1px solid #99C5FF;
      background: #FFFFFF;
      border-radius: 6px;
      color: #0091FF;
      line-height: 40px;
      text-align: center;
    }
  }
}
</style>
