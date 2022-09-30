<template>
  <div>
    <el-dialog
      :title="title"
      :visible.sync="isDialogVisible"
      @close="closeDialog"
      width="1000px"
      top="50px"
      :close-on-click-modal="false"
    >
      <div style="height: 650px">
        <el-scrollbar style="height: 100%">
          <el-row>
            <el-col :span="24">
              <el-form
                ref="workForm"
                :model="workForm"
                :rules="rules"
                label-position="right"
                label-width="90px"
              >
                <el-form-item hidden>
                  <el-col :span="23">
                    <!--存储表格id-->
                    <el-input v-model="workForm.id"></el-input>
                  </el-col>
                </el-form-item>
                <el-form-item prop="type" hidden>
                  <el-col :span="23">
                    <!--存储树ID-->
                    <el-input v-model="workForm.type"></el-input>
                  </el-col>
                </el-form-item>
                <el-row>
                  <el-form-item prop="title" label="标题:">
                    <el-col :span="23">
                      <el-input
                        v-model="workForm.title"
                        placeholder="长度限100字符以内"
                      ></el-input>
                    </el-col>
                  </el-form-item>
                </el-row>
                <el-row>
                  <el-form-item prop="type" label="文档类别:">
                    <el-col :span="18" hidden>
                      <el-input v-model="workForm.type"></el-input>
                    </el-col>
                    <el-col :span="18">
                      <el-input
                        :readonly="true"
                        v-model="workForm.typeName"
                      ></el-input>
                    </el-col>
                    <el-col :span="6">
                      <div style="width: 100%; text-align: center">
                        <el-button
                          type="primary"
                          size="small"
                          @click="selectTreeType"
                          >选择</el-button
                        >
                        <el-button
                          type="primary"
                          size="small"
                          @click="emptyTreeType"
                          >清空</el-button
                        >
                      </div>
                    </el-col>
                  </el-form-item>
                </el-row>
                <el-row>
                  <el-form-item prop="keywords" label="关键词:">
                    <el-col :span="23">
                      <el-input v-model="workForm.keywords"></el-input>
                    </el-col>
                  </el-form-item>
                </el-row>
                <el-row>
                  <el-col :span="12">
                    <el-form-item prop="publishTime" label="发布时间:">
                      <el-col :span="23">
                        <el-date-picker
                          style="width: 100%"
                          format="yyyy-MM-dd"
                          value-format="yyyy-MM-dd"
                          v-model="workForm.publishTime"
                          type="date"
                          placeholder="选择日期"
                        >
                        </el-date-picker>
                      </el-col>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item prop="fileNo" label="文件号:">
                      <el-col :span="22">
                        <el-input v-model="workForm.fileNo"></el-input>
                      </el-col>
                    </el-form-item>
                  </el-col>
                </el-row>

                <el-row>
                  <el-form-item prop="dept" label="制订单位:">
                    <el-col :span="23">
                      <el-input v-model="workForm.dept"></el-input>
                    </el-col>
                  </el-form-item>
                </el-row>

                <el-row>
                  <el-form-item prop="useDescription" label="适用事件描述:">
                    <!--当数据获取且存在后再渲染标签-->
                    <el-col :span="23">
                      <el-input
                        type="textarea"
                        :rows="3"
                        resize="none"
                        placeholder="长度限10000字符以内"
                        v-model="workForm.useDescription"
                      >
                      </el-input>
                    </el-col>
                  </el-form-item>
                </el-row>

                <el-row>
                  <el-form-item prop="useScope" label="适用范围:">
                    <!--当数据获取且存在后再渲染标签-->
                    <el-col :span="23">
                      <el-input
                        type="textarea"
                        :rows="3"
                        resize="none"
                        placeholder="长度限10000字符以内"
                        v-model="workForm.useScope"
                      >
                      </el-input>
                    </el-col>
                  </el-form-item>
                </el-row>

                <el-row>
                  <el-form-item prop="content" label="内容:">
                    <!--当数据获取且存在后再渲染标签-->
                    <el-col :span="23">
                      <el-input
                        type="textarea"
                        :rows="3"
                        resize="none"
                        placeholder="长度限10000字符以内"
                        v-model="workForm.content"
                      >
                      </el-input>
                    </el-col>
                  </el-form-item>
                </el-row>

                <el-row>
                  <el-form-item prop="remark" label="备注:">
                    <!--当数据获取且存在后再渲染标签-->
                    <el-col :span="23">
                      <el-input
                        type="textarea"
                        :rows="3"
                        resize="none"
                        placeholder="长度限10000字符以内"
                        v-model="workForm.remark"
                      >
                      </el-input>
                    </el-col>
                  </el-form-item>
                </el-row>

                <el-row>
                  <el-form-item label="附件:" style="text-align: left">
                    <el-upload
                      class="upload-demo"
                      accept=".doc,.docx,.xls,.xlsx,.png,.jpg,.gif,.jpeg,.pdf,.txt"
                      :action="$api.InformationReleasUploadUrl"
                      :headers="{
                        Authorization: $window.localStorage.getItem('token')
                          ? $window.localStorage.getItem('token')
                          : '',
                      }"
                      :on-success="handleUploadFile"
                      :file-list="fileList"
                      :with-credentials="true"
                      :on-remove="handleRemoveFile"
                      :before-upload="beforeFileUpload"
                      multiple
                    >
                      <el-button size="small" type="primary"
                        >点击上传</el-button
                      >
                      <div slot="tip" class="el-upload__tip">
                        限doc,docx,xls,xlsx,png,jpg,gif,jpeg,pdf,txt，且不超过50mb
                      </div>
                    </el-upload>
                  </el-form-item>
                </el-row>
              </el-form>
            </el-col>
          </el-row>
        </el-scrollbar>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submit('workForm')">保存</el-button>
        <el-button type="primary" @click="closeDialog">关闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "tableDialog",
  data() {
    return {
      title: "", //标题
      workForm: {
        id: null,
        type: "",
        typeName: "",
        title: "",
        keywords: "",
        publishTime: "",
        fileNo: "",
        dept: "",
        useDescription: "",
        useScope: "",
        content: "",
        remark: "",
      }, //表单数据
      fileList: [], //上传文件列表
      att: [], //上传文件信息
      rules: {
        title: [
          { required: true, message: "标题不能为空", trigger: "blur" },
          {
            max: 100,
            message: "标题不能超过100字",
          },
        ],
        content: [
          { required: true, message: "内容不能为空", trigger: "blur" },
          {
            max: 10000,
            message: "内容不能超过10000字",
          },
        ],
        useDescription: [
          { required: true, message: "内容不能为空", trigger: "blur" },
          {
            max: 10000,
            message: "内容不能超过10000字",
          },
        ],
        useScope: [
          { required: true, message: "内容不能为空", trigger: "blur" },
          {
            max: 10000,
            message: "内容不能超过10000字",
          },
        ],
        remark: [
          { required: true, message: "内容不能为空", trigger: "blur" },
          {
            max: 10000,
            message: "内容不能超过10000字",
          },
        ],
        keywords: [
          { required: true, message: "内容不能为空", trigger: "blur" },
        ],
        publishTime: [
          { required: true, message: "内容不能为空", trigger: "blur" },
        ],
        fileNo: [{ required: true, message: "内容不能为空", trigger: "blur" }],
        dept: [{ required: true, message: "内容不能为空", trigger: "blur" }],
        type: [{ required: true, message: "内容不能为空", trigger: "change" }],
      }, //验证规则

      isDialogVisible: false, //是否显示弹窗
      defaultProps: {
        children: "children",
        label: "name",
        plusIcon: true,
      },
      treeData: [], //数形数据
      allowType: [
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "application/vnd.ms-excel",
        "image/png",
        "image/jpeg",
        "image/gif",
        "application/pdf",
        "text/plain",
      ], //允许上传的文件mine-type
    };
  },
  methods: {
    closeDialog() {
      //清空表单内容以及校验信息
      this.$nextTick(() => {
        this.$refs["workForm"].resetFields();
      });
      this.att = [];
      this.fileList = [];
      this.isDialogVisible = false;
    },
    showData(row) {
      this.getAtt(row.id);
    },
    //从文件列表删除文件
    handleRemoveFile(file, fileList) {
      //uid是刚上传的,id和releaseId是旧的
      let index = this.att.findIndex(
        (t) => t.uid === file.uid || t.id === file.id
      );
      this.att.splice(index, 1);
    },
    //上传文件
    handleUploadFile(response, file, fileList) {
      console.log(response);
      // bug9792 无法上传附件  author:husiyue date: 2020-12-29
      let path = response.src;
      let filename = response.src.slice(
        response.src.lastIndexOf("/") + 1,
        response.src.length
      );
      let extension = response.src.slice(
        response.src.lastIndexOf(".") + 1,
        response.src.length
      );
      let title = file.name.slice(0, file.name.lastIndexOf("."));
      this.att.push({
        title: title,
        path: path,
        size: file.size,
        filename: filename,
        extension: extension,
        type: "app_duty_information_release",
        uid: file.uid,
      });
    },
    submit(formName) {
      //operate	操作类型
      console.log(this.workForm.publishTime);
      this.$refs[formName].validate((valid) => {
        if (!valid) return;
        if (this.title.indexOf("新增") !== -1) {
          let data = {
            data: this.workForm,
            att: this.att,
          };
          this.$api.addFileClass(data).then((res) => {
            if (res.errorcode != 0) {
              this.$message({
                message: res.msg,
                type: "error",
              });
              return;
            }
            this.$message({
              message: "新增成功!",
              type: "success",
            });
            this.isDialogVisible = false;
            this.$emit("getTableData");
          });
        }
        if (this.title.indexOf("修改") !== -1) {
          let data = {
            data: this.workForm,
            att: this.att,
          };
          this.$confirm("是否确认保存当前修改?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          })
            .then(() => {
              this.$api.updateFileClass(data).then((res) => {
                if (res.errorcode != 0) {
                  this.$message({
                    message: res.msg,
                    type: "error",
                  });
                  return;
                }
                this.$message({
                  message: "修改成功!",
                  type: "success",
                });
                this.isDialogVisible = false;
                this.$emit("getTableData");
              });
            })
            .catch(() => {
              this.$message({
                type: "info",
                message: "已取消修改!",
              });
            });
        }
      });
    },
    selectTreeType() {
      this.$emit("selectTreeType");
    },
    emptyTreeType() {
      this.workForm.type = "";
      this.workForm.typeName = "";
    },
    getAtt(id) {
      //获取附件数量
      this.$api.detailFileClass({ id }).then((res) => {
        if (res.errorcode != 0) {
          this.$message({
            message: res.msg,
            type: "error",
          });
          return;
        }
        this.att = res.data.att;
        console.log(this.att);
        this.fileList = res.data.att.map((t) => {
          return {
            name: t.title + "." + t.extension,
            id: t.id,
          };
        });
        this.workForm.id = res.data.data.id;
        this.workForm.title = res.data.data.title;
        this.workForm.type = res.data.data.type;
        this.workForm.typeName = res.data.data.typeName;
        this.workForm.keywords = res.data.data.keywords;
        this.workForm.fileNo = res.data.data.fileNo;
        this.workForm.publishTime = res.data.data.publishTime;
        this.workForm.dept = res.data.data.dept;
        this.workForm.useDescription = res.data.data.useDescription;
        this.workForm.useScope = res.data.data.useScope;
        this.workForm.content = res.data.data.content;
        this.workForm.remark = res.data.data.remark;
      });
    },
    /**
     * @editorName: qinjiaqi
     * @editorDate: 2020-09-23
     * @param {file} 上传的文件名
     * @return {type} undefined
     * @description：上传类型和上传大小校验
     */
    beforeFileUpload(file) {
      // 上传校验
      // if (this.allowType.indexOf(file.type) === -1){
      //     this.$message({
      //         message:'不允许上传该类型文件',
      //         type:"error"
      //     });
      //     return false
      // }
      let extension = file.name.substring(file.name.lastIndexOf(".") + 1); //获取文件扩展名
      const exdoc = extension === "doc";
      const exdocx = extension === "docx";
      const exxls = extension === "xls";
      const exxlsx = extension === "xlsx";
      const expng = extension === "png";
      const exjpg = extension === "jpg";
      const exgif = extension === "gif";
      const exjpeg = extension === "jpeg";
      const expdf = extension === "pdf";
      const extxt = extension === "txt";
      if (
        !exdoc &&
        !exdocx &&
        !exxls &&
        !exxlsx &&
        !expng &&
        !exjpg &&
        !exgif &&
        !exjpeg &&
        !expdf &&
        !extxt
      ) {
        this.$message({
          message: "不允许上传该类型文件",
          type: "error",
        });
        return false;
      }
      if (file.size > 50 * 1024 * 1024) {
        this.$message({
          message: "不允许上传超过50m的文件",
          type: "error",
        });
        return false;
      }
    },
  },
};
</script>

<style scoped>
</style>
