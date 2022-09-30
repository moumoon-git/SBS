<template>
  <div>
    <el-upload
      v-if="isShowImport"
      class="uploadfile"
      action=""
      :accept="fileType"
      :http-request="uploadFileMethod"
      :before-upload="beforeAvatarUpload"
      :show-file-list="false"
      :headers="{
        Authorization: $window.localStorage.getItem('token')
          ? $window.localStorage.getItem('token')
          : '',
      }"
      multiple
      style="display: inline-block; margin-left: 4px; margin-right: 10px"
    >
      <el-button type="success" size="medium" icon="el-icon-upload"
        >导入</el-button
      >
    </el-upload>
    <el-button
      v-if="isShowExportTemplate"
      type="success"
      size="medium"
      icon="el-icon-download"
      @click="exportTemplate(-1)"
      style="display: inline-block"
      >模板</el-button
    >
    <el-button
      v-if="isShowExport"
      type="success"
      size="medium"
      icon="el-icon-download"
      @click="exportData()"
      style="display: inline-block"
      >导出</el-button
    >
    <el-dialog
      title="导入情况"
      :visible.sync="dialogVisible"
      center
      width="600px"
      @close="closeDialog"
      :close-on-click-modal="false"
    >
      <div style="text-align: left">导入情况:{{ SituationMessage }}</div>
      <el-button
        type="primary"
        @click="failsBtn"
        plain
        size="mini"
        style="text-align: left; margin-top: 10px; margin-bottom: 10px"
        >错误详情</el-button
      >
      <ul style="padding: 0; margin: 0; text-align: left" v-if="show">
        <li
          v-for="(fails, key) in failsData"
          :key="key"
          style="text-align: left"
        >
          第{{ fails.row }}行,{{ fails.msg }}
        </li>
      </ul>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="surnBtn">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { root, getlocalStorage } from "../assets/js/common.js";
export default {
  props: ["excelType", "eltreeId", "ids"],
  name: "excel",
  data() {
    return {
      dialogVisible: false,
      show: false,
      SituationMessage: "", //导入情况
      exportTemplateurl: "", //导出模板
      failsData: [], //导入错误的数据
      exportDataurl: "", //导出分组
      URL: "",
      exportID: "",
      fileType:
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel",
      isShowImport: true,
      isShowExportTemplate: true,
      isShowExport: true,
    };
  },
  created() {
    this.exportID = this.eltreeId;
    this.uploadType(this.excelType);
  },
  watch: {
    eltreeId(id) {
      this.exportID = id;
    },
  },
  methods: {
    failsBtn() {
      this.show = !this.show;
    },
    uploadType(dataType) {
      switch (dataType) {
        case "potentialRisk": //风险隐患
          this.URL = "/emergency/preparation/dbRisk/importFromExcel";
          this.exportTemplateurl =
            root + "/emergency/preparation/dbRisk/export?classId=-1";
          this.exportDataurl =
            root + "/emergency/preparation/dbRisk/export?classId=";
          break;
        case "dangerousChemistry": //危化品
          this.URL = "/emergency/preparation/dangerousChemistry/importFromExcel";
          this.exportTemplateurl =
            root +
            "/emergency/preparation/dangerousChemistry/export?isTemplate=true";
          this.exportDataurl =
            root +
            "/emergency/preparation/dangerousChemistry/export?isTemplate=false&groupId=";
          break;
        case "emergencySupply": //应急物资
          this.URL = "/emergency/preparation/material/importFromExcel";
          this.exportTemplateurl =
            root +
            "/emergency/preparation/material/export?materialAddressId=-1";
          this.exportDataurl =
            root + "/emergency/preparation/material/export?materialAddressId=";
          break;
        case "phone": //应急联络网
          this.URL = "/emergency/preparation/contactor/importFromExcel";
          this.exportTemplateurl =
            root + "/emergency/preparation/contactor/export?type=phone&groupId=-1";
          this.exportDataurl =
            root +
            "/emergency/preparation/contactor/export?type=phone&groupId=";
          break;
        case "gliaison": //基层联络网
          this.URL = "/emergency/preparation/contactor/importFromExcel";
          this.exportTemplateurl =
            root + "/emergency/preparation/contactor/export?type=gliaison&groupId=-1";
          this.exportDataurl =
            root +
            "/emergency/preparation/contactor/export?type=gliaison&groupId=";
          break;
        case "machinery": //应急机构
          this.URL = "/emergency/preparation/contactor/importFromExcel";
          this.exportTemplateurl =
            root + "/emergency/preparation/contactor/export?type=machinery&groupId=-1";
          this.exportDataurl =
            root +
            "/emergency/preparation/contactor/export?type=machinery&groupId=";
          break;
        case "rescueTeam": //应急队伍
          this.URL = "/emergency/preparation/dbTeam/importFromExcel";
          this.exportTemplateurl =
            root + "/emergency/preparation/dbTeam/export?areaId=-1";
          this.exportDataurl =
            root + "/emergency/preparation/dbTeam/export?areaId=";
          break;
        case "protection": //重点防护
          this.URL = "/emergency/preparation/protectionObject/importFromExcel";
          this.exportTemplateurl =
            root + "/emergency/preparation/protectionObject/export?typeId=-1";
          this.exportDataurl =
            root + "/emergency/preparation/protectionObject/export?typeId=";
          break;
        case "shelter": //庇护场所
          this.URL = "/emergency/preparation/disasterShelter/importFromExcel";
          this.exportTemplateurl =
            root + "/emergency/preparation/disasterShelter/export?areaId=-1";
          this.exportDataurl =
            root + "/emergency/preparation/disasterShelter/export?areaId=";
          break;
        case "expert": //专家库
          this.URL = "/emergency/preparation/expert/importFromExcel";
          this.exportTemplateurl =
            root + "/emergency/preparation/expert/export?expertGroupId=-1";
          this.exportDataurl =
            root + "/emergency/preparation/expert/export?expertGroupId=";
          break;
        case "responder": //第一响应人
          this.URL = "/emergency/preparation/firstResponder/importFromExcel";
          this.exportTemplateurl =
            root + "/emergency/preparation/firstResponder/export?areaId=-1";
          this.exportDataurl =
            root + "/emergency/preparation/firstResponder/export?areaId=";
          break;
        case "releaseTask": //发布任务管理
          this.URL = "/emergency/preparation/publishTask/importFromExcel";
          this.exportTemplateurl =
            root + "/emergency/preparation/publishTask/export?type=-1";
          this.exportDataurl =
            root + "/emergency/preparation/publishTask/export?type=";
          break;
        case "evaluationData": //评估数据管理
          this.URL = "/emergency/preparation/assessData/importFromExcel";
          this.exportTemplateurl =
            root + "/emergency/preparation/assessData/export?type=-1";
          this.exportDataurl =
            root + "/emergency/preparation/assessData/export?type=";
          break;
        case "equipment": //应急物资
          this.URL = "/emergency/preparation/equipment/importFromExcel";
          this.exportTemplateurl =
            root +
            "/emergency/preparation/equipment/export?materialAddressId=-1";
          this.exportDataurl =
            root + "/emergency/preparation/equipment/export?materialAddressId=";
          break;
        case "resource": //资源通讯录
          this.URL = "/emergency/preparation/contactor/importFromExcel";
          this.exportTemplateurl =
            root + "/emergency/preparation/contactor/export?groupId=-1";
          this.exportDataurl =
            root +
            "/emergency/preparation/contactor/export?type=resource&groupId=";
          break;
        case "medicalInstitution": //医疗机构
          this.URL = "/emergency/preparation/healthdept/importFromExcel";
          this.exportTemplateurl =
            root + "/emergency/preparation/healthdept/export?areaId=-1";
          this.exportDataurl =
            root + "/emergency/preparation/healthdept/export?areaId=";
          break;
        case "transportation": //运输企业
          this.URL = "/emergency/preparation/transporten/importFromExcel";
          this.exportTemplateurl =
            root + "/emergency/preparation/transporten/export?groupId=-1";
          this.exportDataurl =
            root + "/emergency/preparation/transporten/export?groupId=";
          break;
        case "knowledgeBase": //应急知识库
          this.URL = "/emergency/preparation/file/importFromExcel";
          this.exportTemplateurl =
            root + "/emergency/preparation/file/export?typeId=-1";
          this.exportDataurl =
            root + "/emergency/preparation/file/export?typeId=";
          this.isShowImport = false;
          this.isShowExportTemplate = false;
          break;
        default:
          break;
      }
    },
    uploadFileMethod(param) {
      //自定义上传
      let fileObject = param.file;
      let formData = new FormData();
      formData.append("file", fileObject);
      this.$http(
        "/emergency/preparation/attachment/uploadImportFile",
        formData
      ).then((res) => {
        let filePath = res.data.filePath;
        this.ImportData(filePath);
      });
    },
    ImportData(filePath) {
      let data = {
        filePath: filePath,
        type: this.excelType,
      };
      this.$http(this.URL, data).then((res) => {
        if (res.msg == "SUCCESS") {
          this.dialogVisible = true;
          this.SituationMessage =
            "格式正确:" +
            res.data.successNum +
            "条," +
            "格式错误:" +
            res.data.fails.length +
            "条";
          this.failsData = res.data.fails;
        }
      });
    },
    beforeAvatarUpload(file) {
      //上传前类型判断
      let fileName = file.name.lastIndexOf("."); //取到文件名开始到最后一个点的长度
      let fileNameLength = file.name.length; //取到文件名长度
      let fileFormat = file.name.substring(fileName + 1, fileNameLength);
      let fileType = fileFormat === "xlsx" || fileFormat === "xls";
      if (!fileType) {
        this.$message.error("上传格式为.xlsx 或.xls");
      }
      return fileType;
    },
    exportTemplate(id) {
      location.href = this.exportTemplateurl;
    },
    exportData() {
      let menuId = this.$store.state.menu.menuID || "";

      if (
        this.excelType == "medicalInstitution" ||
        this.excelType == "transportation" ||
        this.excelType == "knowledgeBase"
      ) {
        location.href =
          this.exportDataurl +
          this.exportID +
          "&menuId=" +
          menuId +
          "&ids=" +
          this.ids;
      } else if (this.excelType == "dangerousChemistry") {
        location.href = this.exportDataurl + this.exportID + "&ids=" + this.ids;
      } else {
        location.href =
          this.exportDataurl + this.exportID + "&menuId=" + menuId + "&ids=" + this.ids;
      }
    },
    closeDialog() {
      this.$emit("fatherMethod");
    },
    surnBtn() {
      this.dialogVisible = false;
      this.$emit("fatherMethod");
    },
  },
};
</script>

<style scoped>
li {
  padding: 0;
  margin: 0;
  list-style: none;
}

.el-dialog >>> .el-dialog__body {
  padding: 0;
  margin: 0;
}

.el-dialog__wrapper >>> .el-dialog--center .el-dialog__body {
  text-align: left;
}
</style>
