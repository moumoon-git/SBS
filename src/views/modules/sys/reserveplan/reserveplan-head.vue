<template>
  <div>
    <el-input
      style="width: 300px; float: left"
      v-model="seekdata"
      placeholder="请输入预案名称"
      @keyup.enter.native="handelHTTPSeek(seekdata)"
      clearable
      size="small"
    ></el-input>
    <el-button
      style="margin-left:20px;background-color：rgb(64, 158, 255)"
      @click="handelHTTPSeek(seekdata)"
      type="primary"
      size="small"
      >查询</el-button
    >
    <div style="float: right">
      <el-button @click="planMoreStart" type="primary" size="small"
        >批量启动</el-button
      >
      <el-button @click="planMoreStop" type="primary" size="small"
        >批量停止</el-button
      >
      <el-button
        style="width: 90px"
        v-if="isAuth('rp:plan:save')"
        @click="addOrUpdateHandle()"
        type="primary"
        size="small"
        >新增</el-button
      >
      <el-button
        @click="planMoreDelete"
        v-if="isAuth('rp:plan:delete')"
        type="primary"
        size="small"
        >批量删除</el-button
      >

      <el-upload
        style="display: inline-block"
        action
        :http-request="uploadSectionFile"
        :show-file-list="false"
        accept="application/vnd.ms-excel"
      >
        <el-button
          style="margin-left: 10px"
          type="primary"
          size="small"
          icon="el-icon-upload"
          v-if="isAuth('rp:plan:save')"
          >导入预案</el-button
        >
      </el-upload>

      <!--<el-button  style="margin-left:10px;" type="primary" size="small" @click="exportExcel()" icon="el-icon-printer">导出模板</el-button>-->
      <el-dropdown style="margin-left: 10px">
        <el-button sytle="width: 95px;height: 34px;" type="primary" size="small"
          >导出模板</el-button
        >
        <el-dropdown-menu slot="dropdown" split-button="true">
          <el-dropdown-item @click.native="exportHumanExcel()"
            >导出人员模板</el-dropdown-item
          >
          <el-dropdown-item @click.native="exportVehicleExcel()"
            >导出车辆模板</el-dropdown-item
          >
          <el-dropdown-item @click.native="exportCameraExcel()"
            >导出相机模板</el-dropdown-item
          >
          <el-dropdown-item @click.native="illegalCapture()"
            >违规抓拍</el-dropdown-item
          >
        </el-dropdown-menu>
      </el-dropdown>

      <!-- 导出预案 -->
      <!-- <el-button @click="exportExcel()" icon="el-icon-printer" v-if="isAuth('mail:mailgroup:xlsOutput')">导出预案模板</el-button> -->
      <!-- <el-button @click="planpdf()" icon="el-icon-printer" v-if="isAuth('mail:mailgroup:xlsOutput')">导出预案数据</el-button> -->
    </div>
  </div>
</template>

<script>
export default {
  props: ["value3", "dataForm", "checkedIds"],
  data() {
    return {
      planNames: [],
      deleteId: [],
      seekdata: "",
    };
  },
  computed: {
    f1() {
      return this.$store.state.user.planMultipleDelete;
      return this.$store.state.user.planNames;
    },
  },
  watch: {
    f1() {
      this.deleteId = this.$store.state.user.planMultipleDelete;
      this.planNames = this.$store.state.user.planNames;
    },
  },

  methods: {
    // 导出人员预案模板
    exportHumanExcel() {
      let httpaddress = window.SITE_CONFIG.baseUrl;
      window.location.href = `${httpaddress}/rp/BulkImport/getHumanPlanTemplate?token=${this.$cookie.get(
        "token"
      )}`;
    },
    // 导出车辆预案模板
    exportVehicleExcel() {
      let httpaddress = window.SITE_CONFIG.baseUrl;
      window.location.href = `${httpaddress}/rp/BulkImport/getVehiclePlanTemplate?token=${this.$cookie.get(
        "token"
      )}`;
    },
    // 导出相机预案模板
    exportCameraExcel() {
      let httpaddress = window.SITE_CONFIG.baseUrl;
      window.location.href = `${httpaddress}/rp/BulkImport/getCameraPlanTemplate?token=${this.$cookie.get(
        "token"
      )}`;
    },
    // 导出违规抓拍模板
    illegalCapture() {
      let httpaddress = window.SITE_CONFIG.baseUrl;
      window.location.href = `${httpaddress}/rp/BulkImport/getViolationPlanTemplate?token=${this.$cookie.get(
        "token"
      )}`;
    },

    //批量导入预案
    uploadSectionFile(param) {
      let form = new FormData();
      form.append("file", param.file);
      this.$http({
        url: this.$http.adornUrl(`/rp/BulkImport/inputxls`),
        method: "post",
        headers: {
          "Content-Type": "multipart/form-data",
        },
        data: form,
      })
        .then(({ data }) => {
          // if (!data.code) {
          //   this.$message({
          //     message: "预案导入成功",
          //     type: "success",
          //   });
          //   // 上传成功重新请求数据渲染页面
          //   this.$emit("planData");
          // } else {
          //   this.$message.error("只支持导入预案模板文件");
          // }
          if (!data.code && data.errorData.length == 0) {
            this.$message({
              message: `${data.msg}`,
              type: "success",
            });
            this.dataForm.enclosure = data.filePath;
            this.dataForm.fileName = data.fileName;
            // 上传成功重新请求数据渲染页面
            this.getDataList();
          }
          else if(!data.code && data.errorData.length !=0){
            // this.$message.error(`${data.msg}`);
            let str = document.createElement('div')
            data.errorData.forEach(item=>{
              let cdiv = document.createElement('div')
              cdiv.innerHTML = item.errorMsg;
              cdiv.style.marginTop = "10px"
              str.appendChild(cdiv);
            })
            this.$message({
              dangerouslyUseHTMLString: true,
              message: `<div>${data.msg}</div>${str.innerHTML}`,
              type: 'error'
            })
          }  
          else {
            this.$message.error("导入失败,请检查文件格式");
          }
        })
        .catch((err) => {});
    },

    addOrUpdateHandle() {
      this.$emit("addOrUpdateHandle", null, 2, 0);
    },
    planMoreDelete() {
      let arr = [...this.deleteId];
      let planNames = [...this.planNames];
      this.$emit("planMoreDelete", arr,planNames);
    },
    handelHTTPSeek(data) {
      this.$emit("handelHTTPSeek", data);
    },
    planMoreStart() {
      let arr = [...this.deleteId];
      this.$emit("planMoreStart", arr);
    },
    planMoreStop() {
      let arr = [...this.deleteId];
      this.$emit("planMoreStop", arr);
    },
  },
};
</script>

<style scoped>
</style>
