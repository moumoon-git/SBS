<template>
  <el-dialog
    class="sbs-dialog"
    :title="status === 'add' ? '新增登录页文件' : '修改登录页文件'"
    :visible.sync="dialogVisible"
    width="25vw"
    append-to-body
    :before-close="reset"
    top="25vh"
  >
    <div :class="$style.main" v-loading="loading">
      <div :class="$style.item">
        <span>文件名称</span>
        <el-input v-model="fileName" placeholder="请输入名称" style="width: 70%;"/>
      </div>
      <div :class="$style.item">
        <span>上传文件</span>
        <el-upload
          :class="$style.upload"
          ref="upload"
          action=""
          :http-request="uploadFileMethod"
          :file-list="fileList"
          :on-remove="removeFile"
        >
          <el-button size="mini" type="plain" @click="isapp=false" v-show="!fileList.length">
            <i class="el-icon-plus" />上传
          </el-button>
        </el-upload>
      </div>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="reset">取 消</el-button>
      <el-button type="primary" @click="submit">确 定</el-button>
    </span>
  </el-dialog>
</template>
<script>
export default {
  name: 'addOrEditUploadDialog',
  data() {
    return {
      // 弹窗标题
      status: '',
      dialogVisible: false,
      fileName: '', // 文件名称
      loading: false,
      fileList: [],
      id: '',
    };
  },
  mounted() {
    // this.getUpFileList();
  },
  methods: {
    open(status, item) {
      this.status = status;
      if (item) {
        this.fileName = item.fileName;
        const obj = {
          name: item.fileOriginalName,
          url: item.url,
          path: item.url,
        };
        this.id = item.id;
        this.fileList.push(obj);
      }
      this.dialogVisible = true;
    },
    /**
     * 上传文件
     */
    async uploadFileMethod(param) {
      this.loading = true;
      const formData = new FormData();
		  formData.append('file', param.file);
      const request = {
        method: 'post',
        url: 'loginPageFile/fileUpload',
        baseURL: window.SITE_CONFIG.fileupload,
        data: formData,
        timeout: 0,
      };
      try {
        const { data } = await this.$http(request);
        if (data.errorcode === 0) {
          this.fileList.push(data.data);
          this.$message.success('文件上传成功!');
          // this.getFileList();
        } else {
          this.$message.error(`上传文件报错,报错原因${data.msg}`);
        }
      } catch (error) {
        this.$message.error(`上传文件报错,报错原因${error}`);
      } finally {
        this.loading = false;
      }
    },
    /**
     * 删除文件
     */
    async removeFile() {
      const request = {
        method: 'get',
        url: 'loginPageFile/deleteFile',
        baseURL: window.SITE_CONFIG.baseUrl,
        params: {
          url: this.fileList[0].path,
        },
      };
      try {
        const { data } = await this.$http(request);
        if (data.errorcode === 0) {
          this.fileList.pop();
          this.$message.success('删除文件成功!');
        } else {
          this.$message.error(`删除文件报错,报错原因${data.msg}`);
        }
      } catch (error) {
        this.$message.error(`删除文件报错,报错原因${error}`);
      }
    },
    /**
     * 上传首页下载文件
     */
    async submit() {
      const errmsg = this.status === 'add' ? '新增' : '修改';
      if (!this.fileList.length || !this.fileName) {
        this.$message.error('请上传文件或填写文件名');
        return ;
      }
      this.loading = true;
      const request = {
        method: 'post',
        url: this.status === 'add' ? 'loginPageFile/save' : 'loginPageFile/update',
        baseURL: window.SITE_CONFIG.baseUrl,
        data: {
          url: this.fileList[0].path,
          fileName: this.fileName,
          id: this.status === 'add' ? '' : this.id,
          fileOriginalName: this.fileList[0].name,
        },
      };
      try {
        const { data } = await this.$http(request);
        if (data.errorcode === 0) {
          this.$message.success(`${errmsg}首页下载文件成功!`);
          this.reset();
        } else {
          this.$message.error(`${errmsg}首页下载文件报错,报错原因${data.msg}`);
        }
      } catch (error) {
        this.$message.error(`${errmsg}首页下载文件报错,报错原因${error}`);
      } finally {
        this.loading = false;
      }
    },
    /**
     * 重置状态并关闭
     */
    reset() {
      this.fileName = '';
      this.fileList = [];
      this.dialogVisible = false;
      this.id = '';
      this.loading = false;
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
    .upload{
      width: 70%;
      display: flex;
      align-items: center;
      :global(.el-upload-list){
        width: 100%;
      }
    }

    span{
      display: inline-block;
      width: 100px;
      font-size: 16px;
    }
  }
}
</style>
