<!--@author：llp-->
<template>
  <el-dialog
    :title="title"
    :visible.sync="isDialogVisible"
    :close-on-click-modal="false"
    @close="closeDialog"
    width="25%"
  >
    <el-form :model="form" ref="dynamicValidateForm" label-width="100px">
      <el-form-item label="模板名称:">
        <el-col :span="12">
          <el-input v-model="form.msgTemplateName"></el-input>
        </el-col>
      </el-form-item>
    </el-form>
    <el-checkbox v-if="this.title=='短信模板新增'" v-model="checked">是否添加为上级分组</el-checkbox>
    <el-button @click="onSubmit">保存</el-button>
  </el-dialog>
</template>

<script>
  export default {
    name: "msgTemplateDialog",
    data() {
      return {
        msgTemplateName: '',//短信模板名称
        isDialogVisible: false,//是否显示弹窗
        title: '',//弹窗标题
        form: {
          msgTemplateName: ''//模板名称
        },
        checked: true,//是否未上级分组
        msgTemplateId: '',
        content: '',//短信模板内容
      }
    },
    methods: {
      closeDialog() {
        this.isDialogVisible = false;
      },
      onSubmit(){
        if(this.title=="短信模板新增"){
          this.saveMsgTemplate();
        }else if (this.title=="短信模板修改"){
          this.updateMsgTemplate();
        }
      },
      saveMsgTemplate() {
        let data;
        if (this.checked) {
          data = {
            title: this.form.msgTemplateName,//标题
            content: this.content,//内容
            pid: 0
          };
        } else {
          data = {
            title: this.form.msgTemplateName,//标题
            content: this.content,//内容
            pid: this.msgTemplateId
          };
        }
        let postData = {
          data: JSON.parse(JSON.stringify(data))
        };
        this.$api.addSmsMould(postData).then(res => {
          if (res.errorcode != 0) {
            this.$message({
              message: res.msg,
              type: "error"
            });
            return
          }
          this.$message({
            message: "保存成功!",
            type: "success"
          });
          this.isDialogVisible = false;
          this.$emit("getSmsMould")
        });
      },
      updateMsgTemplate() {
        let data = {
          title: this.form.msgTemplateName,//标题
          content: this.content,//内容
          id: this.msgTemplateId
        };
        this.$api.updateSmsMould(data).then(res => {
          if (res.errorcode != 0) {
            this.$message({
              message: res.msg,
              type: "error"
            });
            return
          }
          this.$message({
            message: "修改成功!",
            type: "success"
          });
          this.isDialogVisible = false;
          this.$emit("getSmsMould")
        })
      }
    }
  }
</script>

<style scoped>

</style>
