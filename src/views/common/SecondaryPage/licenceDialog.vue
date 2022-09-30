<template>
  <div>
    <el-dialog
      :title="LicTitle"
      :visible.sync="dialogVisible"
      :modal-append-to-body='false'
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :show-close="false"
      width="30%"
    >
      <div v-if="expired">
        尊敬的用户，您的License已在<span :class="$style.importFont">{{ validDate }}过期</span>
        ,当前无法使用系统。请联系管理员更新License。
      </div>
      <div v-else>
        尊敬的用户，您的License将在<span :class="$style.importFont">{{ validDate }}过期</span>
        ,有效期剩余<span :class="$style.importFont">{{remainer}}天</span>。
        License过期后将无法登录系统。请及时联系管理员更新License。
      </div>
      <div :class="$style.serveInfos">
        <span>服务器信息</span>
        <span>服务器IP: {{ serveInfo.ipAddress ? serveInfo.ipAddress.toString() : '' }}</span>
        <span>主板信息：{{ serveInfo.mainBoardSerial }}</span>
        <span>MacAddress: {{ serveInfo.macAddress ? serveInfo.macAddress.toString() : '' }}</span>
        <span>CPUSerial: {{ serveInfo.cpuSerial }}</span>
        <span 
          :class="$style.copyInfo"
          v-clipboard:copy="serveCopy"
          v-clipboard:success="copyTextSuccess"
          v-clipboard:error="copyTextError"
        >
          复制信息
        </span>
      </div>
      <span :class="$style.tips">注：请在服务器所在电脑登录系统获取服务器信息</span>
      <div :class="$style.upload">
        <div>License文件：</div>
        <el-upload
          ref="upload"
          :show-file-list="true"
          action=""
          :limit="1"
          :on-exceed="overFile"
          :http-request="uploadFileMethod"
          :on-change="changeUpload"
          :on-remove="removeFile"
          :headers="{
            Authorization: $window.localStorage.getItem('token')
              ? $window.localStorage.getItem('token')
              : '',
          }"
          :auto-upload="false"
        >
          <el-button size="small">上传文件</el-button>
        </el-upload>
      </div>
      <div slot="footer" style="text-align: right;">
        <el-button
          v-if="!expired"
          @click="dialogVisible = false;$refs.upload.clearFiles();"
        >
          暂不更新
        </el-button>
        <el-button
          type="primary"
          @click="upload"
        >
          更新
        </el-button>
      </div>
    </el-dialog>
    <sv-dialog-hint
      ref="upload_success"
      type="success"
      text="License更新成功！"
      :supplement="`有效期：${validDate}`"
      @confirm="successUpload()"
    />
    <sv-dialog-hint
      ref="delete_fail"
      type="fail"
      text="License更新失败，请重新上传License文件"
    />
  </div>
</template>

<script>
export default {
  name: 'SecondaryPage',
  data() {
    return {
      LicTitle: 'License即将过期',
      dialogVisible: false,
      expired: true, // 是否过期
      validDate: '', // 到期日期
      remainer: '', // 剩余时间
      serveInfo: {}, // 服务器信息
      serveCopy: '', // 复制信息
      hasFile: false, // 是否上传文件
    };
  },
  mounted() {
    this.hasFile = false
  },
  methods: {
    // 初始化时效信息
    initInfo(expired, validDate, remainer) {
     this.dialogVisible = true;
     this.expired = expired;
     this.validDate = validDate;
     this.remainer = remainer;
     this.getServerInfo()
    },
    // 获取服务器信息
    getServerInfo() {
      this.$http.post(`${window.SITE_CONFIG.cloudUrl}/oauth/ignorelicense/getServerInfos`, {
        osName: '',
      })
      .then((result) => {
        if (result.data.errorcode === 0) {
          this.serveInfo = result.data.data;
          this.serveCopy =`
          服务器信息
          服务器IP: ${ this.serveInfo.ipAddress ? this.serveInfo.ipAddress.toString() : '' }
          主板信息：${ this.serveInfo.mainBoardSerial }
          MacAddress: ${ this.serveInfo.macAddress ? this.serveInfo.macAddress.toString() : '' }
          CPUSerial: ${ this.serveInfo.cpuSerial }`
        } else {

        }
      });
    },
    uploadFileMethod(param) {
      console.log(param)
      let filePoint = param.file.name.lastIndexOf('.')
      let fileType = param.file.name.substring(filePoint + 1, param.file.name.length);
      console.log(filePoint, fileType)
      if (fileType !== 'lic') {
        this.$message.error('请上传格式为.lic的文件');
        return;
      }
      //自定义上传
      let fileObject = param.file;
      let formData = new FormData();
      formData.append('file', fileObject);
      this.$http.post(
        `${window.SITE_CONFIG.cloudUrl}/oauth/ignorelicense/install`,
        formData
      ).then((res) => {
        if (res.data.errorcode === 0) {
          console.log(this.$refs)
          this.$refs.upload_success.visible = true;
          this.validDate = res.data.data;
          this.$refs.upload.clearFiles();
        } else {
          this.$refs.delete_fail.visible = true;
        }
      });
    },
    successUpload() {
      if (this.expired) {
        this.$router.push({ name: 'login' })
      }
      // 更新过期时间
      this.$emit('timeDiff', this.validDate);
      this.dialogVisible = false;
    },
    upload() {
      if (!this.hasFile) {
        this.$message.warning('请先上传License文件')
      }
      this.$refs.upload.submit();
    },
    overFile() {
      this.$message.warning('当前限制选择 1 个文件');
    },
    copyTextSuccess(e) {
      this.$message.success('复制成功');
      console.log(e);
    },
    copyTextError() {
      this.$message.error('复制失败');
    },
    removeFile(file, fileList) {
      if ( fileList.length > 0) {
        this.hasFile = true;
      } else {
        this.hasFile = false;
      }
    },
    changeUpload(file, fileList) {
      if ( fileList.length > 0) {
        this.hasFile = true;
      } else {
        this.hasFile = false;
      }
    },
  },
};
</script>

<style lang="scss" module >
.importFont {
  color: red;
}
.serveInfos {
  display: flex;
  flex-direction: column;
  background: #F7F7F7;
  padding: 5px;
  margin: 10px 0;
}
.serveInfos > span {
  margin: 5px 0;
}
.serveInfos > :first-child {
  font-weight: bold;
}
.copyInfo {
  color: #0091FF;
  cursor: pointer;
  position: absolute;
  right: 30px;
  bottom: 180px;
}
.tips {
  color: grey;
  margin: 10px 0;
}
.upload {
  display: flex;
  color: grey;
  margin: 10px 0;
}
</style>
