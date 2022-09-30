<template>
  <div class="div">
    <!-- 石景山不需要，导入，模板，去除 author:qinjiaqi -->
    <el-button
      class="btn"
      @click="Refresh"
      type="primary"
      icon="el-icon-refresh"
      >刷新</el-button
    >
    <!-- <el-upload :action='uploadActionUrl'
      :show-file-list='false'
      class="upload-demo"
      ref="upload"
      accept=".xls,.xlsx"
      :headers="{Authorization: $window.localStorage.getItem('token') ? $window.localStorage.getItem('token') : ''}"
      :with-credentials="true"
      :on-success="success"
      :on-error="error"
      :beforeUpload="beforeAvatarUpload">
      <el-button class="btn import" type="primary" icon="el-icon-plus">导入</el-button>
    </el-upload> -->
    <el-button
      class="btn"
      @click="monthlyList"
      type="primary"
      icon="el-icon-plus"
      >导出</el-button
    >
    <!-- <el-button class="btn" @click="importTemplate" type="primary" icon="el-icon-plus" >模板</el-button> -->
    <!-- <el-button class="btn" plain icon="el-icon-plus" >短信通知</el-button> -->
    <el-button class="btn" type="primary" @click="saveScheduling"
      >保存排班</el-button
    >
    <el-button class="btn" type="primary" @click="notification"
      >短信通知</el-button
    >
    <el-button
      class="btn"
      icon="el-icon-plus"
      type="primary"
      @click="exportDuty('date')"
      >按单位导出</el-button
    >
    <el-button
      class="btn"
      icon="el-icon-plus"
      type="primary"
      @click="exportDuty('unit')"
      >按日期导出</el-button
    >
    <el-button
      class="btn"
      icon="el-icon-plus"
      type="primary"
      @click="importFile"
      >获取模板</el-button
    >
    <el-button
      class="btn"
      icon="el-icon-plus"
      type="primary"
      @click="importClass"
      >导入</el-button
    >
  </div>
</template>

<script>
const UrlRoot = window.g.ApiUrl;

export default {
  props: ["msg"],
  name: "tableButtonDuty",
  data() {
    return {
      uploadActionUrl: UrlRoot + "/upload/dutyImportTemplatesUpload",
      // moth:''
    };
  },
  methods: {
    // getData(data){
    //     this.moth = data
    // }   ,
    importFile(){
      this.$emit("importFileEmit");
    },
    importClass(){
      this.$emit("importClassFunEmit");
    },
    begin() {
      // this.uploadActionUrl=UrlRoot+'/upload/dutyImportTemplatesUpload'
    },
    Refresh() {
      this.$emit("Refresh");
    },
    importTemplate() {
      this.$emit("importTemplate");
    },
    monthlyList() {
      this.$emit("monthlyList");
    },
    saveScheduling() {
      this.$emit("saveScheduling");
    },
    notification() {
      this.$emit("notification");
    },

    /**
     * @author hexinting
     * @lastEditor xuchuangxing
     * @lastUpdateTime 2021/1/13
     * @description 导出日期或单位排班
     */
    exportDuty(type) {
      this.$emit("exportDuty", type);
    },
    success(response, file, fileList) {
      var fileName = file.response;
      fileName = fileName.substring(5, fileName.length - 1);
      console.log(fileName);
      let data = {
        date: this.msg,
        filePath: fileName,
      };
      console.log(data);
      //  请求
      this.$api.importFromExcel(data).then((res) => {
        console.log(res);
        if (res.errorcode != 0) {
          if (res.fails.length == 0) {
            this.$message({
              message: res.msg,
              type: "error",
            });
          } else {
            this.$message({
              message:
                res.msg +
                ":" +
                res.fails[0].msg +
                "；  错误在" +
                res.fails[0].错误行数 +
                "行",
              type: "error",
            });
          }
        } else {
          this.$emit("axios");
          this.$message({
            message: "导入成功",
            type: "success",
          });
        }
      });
    },
    error(err, file, fileList) {
      this.$message({
        showClose: true,
        message: err.msg,
        type: "error",
      });
    },
    beforeAvatarUpload(file) {
      var testmsg = file.name.substring(file.name.lastIndexOf(".") + 1);
      const extension = testmsg === "xls";
      const extension2 = testmsg === "xlsx";
      const isLt2M = file.size / 1024 / 1024 < 10;
      if (!extension && !extension2) {
        this.$message({
          message: "上传文件只能是 xls、xlsx格式!",
          type: "warning",
        });
      }
      if (!isLt2M) {
        this.$message({
          message: "上传文件大小不能超过 10MB!",
          type: "warning",
        });
      }
      return extension || (extension2 && isLt2M);
    },
  },
  mounted() {
    this.begin();
  },
};
</script>

<style scoped>
.div {
  padding-top: 15px;
  display: flex;
  /* width: 500px; */
  height: 100px;
  overflow: hidden;
}

.upload-demo {
  height: 36px;
  line-height: 36px;
}

.btn {
  height: 36px;
}

.import {
  margin: 0 10px;
}
</style>
