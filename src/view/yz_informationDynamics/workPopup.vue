<template>
  <div>
    <el-dialog
      :title="title"
      :visible.sync="isDialogVisible"
      @close="closeDialog"
      width="30%"
      :close-on-click-modal="false"
    >
      <div style="height: 550px">
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
                <el-form-item prop="id" hidden>
                  <el-col :span="23">
                    <el-input v-model="workForm.id"></el-input>
                  </el-col>
                </el-form-item>
                <el-form-item prop="type" hidden>
                  <el-col :span="23">
                    <el-input v-model="workForm.type"></el-input>
                  </el-col>
                </el-form-item>
                <el-row v-show="title !== '添加附件'">
                  <el-form-item prop="title" label="标题:">
                    <el-col :span="23">
                      <el-input
                        v-model="workForm.title"
                        placeholder="长度限100字符以内"
                      ></el-input>
                    </el-col>
                  </el-form-item>
                </el-row>
                <el-row v-show="title !== '添加附件'">
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
                <el-row
                  v-show="
                    (workForm.type === 373 || workForm.type === 371) &&
                    title !== '添加附件'
                  "
                >
                  <el-form-item prop="unit" label="责任单位:">
                    <el-col :span="23">
                      <el-input
                        v-model="workForm.unit"
                        placeholder="长度限200字符以内"
                      ></el-input>
                    </el-col>
                  </el-form-item>
                </el-row>
                <el-row v-show="workForm.type === 373 && title !== '添加附件'">
                  <el-form-item prop="vcExtend1" label="责任人:">
                    <el-col :span="23">
                      <el-input
                        v-model="workForm.vcExtend1"
                        placeholder="长度限100字符以内"
                      ></el-input>
                    </el-col>
                  </el-form-item>
                </el-row>
                <el-row v-show="workForm.type === 373 && title !== '添加附件'">
                  <el-form-item prop="vcExtend2" label="执行情况:">
                    <el-col :span="23">
                      <el-input
                        v-model="workForm.vcExtend2"
                        placeholder="长度限100字符以内"
                      ></el-input>
                    </el-col>
                  </el-form-item>
                </el-row>
                <!--因为time的非空校验在其他版块通不过,只能用v-if-->
                <el-row
                  v-if="
                    (workForm.type === 373 || workForm.type === 371) &&
                    title !== '添加附件'
                  "
                >
                  <el-form-item prop="time" label="执行时间:">
                    <el-col :span="23" style="text-align: left">
                      <el-date-picker
                        v-model="workForm.time"
                        type="datetime"
                        placeholder="选择日期"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        format="yyyy-MM-dd HH:mm"
                      >
                      </el-date-picker>
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
              <el-row>
                <el-col :span="24">
                  <el-button type="primary" @click="submit('workForm')"
                    >保存</el-button
                  >
                  <el-button type="primary" @click="closeDialog"
                    >关闭</el-button
                  >
                </el-col>
              </el-row>
            </el-col>
          </el-row>
        </el-scrollbar>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "appDutyPopup",
  data() {
    return {
      title: "", //标题
      workForm: {
        id: "",
        title: "",
        content: "",
        unit: "",
        time: "",
        type: "",
        vcExtend1: "",
        vcExtend2: "",
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
        unit: [
          {
            max: 200,
            message: "负责单位名称不能超过200字",
          },
        ],
        time: [{ required: true, message: "时间不能为空", trigger: "blur" }],
        vcExtend1: [
          {
            max: 100,
            message: "负责人不能超过100字",
          },
        ],
        vcExtend2: [
          {
            max: 100,
            message: "执行情况不能超过100字",
          },
        ],
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
      this.$nextTick(() => {
        this.workForm.id = row.id;
        this.workForm.title = row.title;
        this.workForm.content = row.content;
        this.workForm.unit = row.unit;
        this.workForm.time = row.time;
        this.workForm.type = row.type;
        this.workForm.vcExtend1 = row.extend1;
        this.workForm.vcExtend2 = row.extend2;
      });
      this.getAtt(row.id);
    },
    //从文件列表删除文件
    handleRemoveFile(file, fileList) {
      //uid是刚上传的,id和releaseId是旧的
      let index = this.att.findIndex(
        (t) =>
          t.uid === file.uid ||
          (t.id === file.id && t.releaseId === file.releaseId)
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
      //operate	操作类型 0->新增 1-> 更新 2->删除
      this.$refs[formName].validate((valid) => {
        if (!valid) return;
        if (this.title.indexOf("新增") !== -1) {
          let data = {
            data: this.workForm,
            att: this.att,
            // operatorId: sessionStorage.getItem('operator_id') // 暂时用不上
          };
          this.$api.appDutyInformationReleasAdd(data).then((res) => {
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
        if (this.title.indexOf("修改") !== -1 || this.title === "添加附件") {
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
              this.$api.appDutyInformationReleasUpdate(data).then((res) => {
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
    getAtt(id) {
      //获取附件数量
      this.$api.appDutyInformationReleasDetail({ id }).then((res) => {
        if (res.errorcode != 0) {
          this.$message({
            message: res.msg,
            type: "error",
          });
          return;
        }
        this.att = res.attachment;
        console.log(this.att);
        this.fileList = res.attachment.map((t) => {
          return {
            name: t.title + "." + t.extension,
            id: t.id,
            releaseId: t.releaseId,
          };
        });
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
