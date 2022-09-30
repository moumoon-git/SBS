//腾讯云专属
<template>
  <el-dialog
    :title="title"
    :visible.sync="isDialogVisible"
    :close-on-click-modal="false"
    :append-to-body="true"
    @close="closeDialog"
    width="50%"
  >
    <el-form :model="form" ref="dynamicValidateForm" label-width="100px">
      <el-form-item label="模板名称:">
        <el-col :span="12">
          <el-input v-model="form.msgTemplateName"></el-input>
          <el-checkbox v-if="this.title=='短信模板新增'" v-model="checked">是否添加为上级分组</el-checkbox>
        </el-col>
      </el-form-item>
      <el-form-item label="模板id:">
        <el-col :span="12">
          <el-input v-model="form.tencontid"></el-input>
        </el-col>
      </el-form-item>
      <el-form-item label="模板内容:">
        <el-col :span="12">
          <el-input type="textarea" resize="none"
                    placeholder="请输入短信模板内容"
                    v-model="content" show-word-limit maxlength="500" :autosize="{minRows: 8,maxRows:8}"></el-input>
        </el-col>
      </el-form-item>
    </el-form>

    <el-button @click="onSubmit">保存</el-button>
  </el-dialog>
</template>

<script>
    export default {
        name: "msgtencont",
        data() {
            return {
                msgTemplateName: '',//短信模板名称
                isDialogVisible: false,//是否显示弹窗
                title: '',//弹窗标题
                form: {
                    tencontid:'',//腾讯云模板id
                    id:'',//主键id
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
            //新增
            saveMsgTemplate() {
                let json;
                if (this.checked) {
                    json = {
                        templateId:this.form.tencontid,
                        templateName: this.form.msgTemplateName,//标题
                        templateContent: this.content,//内容
                        pid: 0
                    };
                } else {
                    json = {
                        templateId:this.form.tencontid,
                        templateName: this.form.msgTemplateName,//标题
                        templateContent: this.content,//内容
                        pid: this.msgTemplateId
                    };
                }
                console.log(data)
                let data = {
                    data: JSON.stringify(json)
                };
                this.$api.addTencentmsg(data).then(res => {
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
            // 修改
            updateMsgTemplate() {
                let json = {
                    smsTemplateId:this.msgTemplateId,
                    templateId:this.form.tencontid,
                    templateName: this.form.msgTemplateName,//标题
                    templateContent: this.content,//内容
                    smsTemplateTypeId: this.form.id
                };
                let data = {
                    data: JSON.stringify(json)
                };
                this.$api.changeTencentmsg(data).then(res => {
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
