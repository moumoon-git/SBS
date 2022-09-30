<template>
  <el-dialog
    class="sbs-dialog"
    title="查看登录页文件"
    :visible.sync="dialogVisible"
    width="25vw"
    append-to-body
    top="25vh"
  >
    <div :class="$style.main">
      <div :class="$style.item">
        <span>文件名称:</span>
        <span :class="$style.fileName">{{ fileName }}</span>
      </div>
      <div :class="$style.item">
        <span>上传文件:</span>
        <span :class="$style.fileOriginalName" :title="fileOriginalName">
          {{ fileOriginalName }}
        </span>
      </div>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
    </span>
  </el-dialog>
</template>
<script>
export default {
  name: 'viewUploadDialog',
  data() {
    return {
      dialogVisible: false,
      fileName: '', // 文件名称
      fileOriginalName: '',
    };
  },
  methods: {
    open(item) {
      this.fileName = item.fileName;
      this.fileOriginalName = item.fileOriginalName;
      this.dialogVisible = true;
    },
  },
};

</script>
<style module lang="scss">
.main{
  height: 150px;
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
  .item{
    margin-top: 20px;
    height: 30%;
    display: flex;
    width: 90%;
    align-items: center;
    .fileOriginalName{
      color: #0091FF;
      width: 70%;
      text-overflow:ellipsis;
      white-space:nowrap;
      overflow: hidden;
    }
    .fileName{
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      font-size: 16px;
      color: #333333;
    }
    span:first-child{
      display: inline-block;
      width: 100px;
      font-size: 16px;
    }
  }
}
</style>
