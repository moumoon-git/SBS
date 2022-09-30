<!--@author：llp-->
<template>
  <div class="msgTemplate">
    <el-dialog
      :title="title"
      :visible.sync="isDialogVisible"
      :close-on-click-modal="false"
      @close="closeDialog"
      append-to-body
    >
      <!-- <el-row>
        <el-col v-if="!Stylemsg" :span="8">
          <el-button @click="add">新增</el-button>
          <el-button @click="update">修改</el-button>
          <el-button @click="remove">删除</el-button>
        </el-col>
      </el-row>-->

      <el-row style="margin-top:10px">
        <el-col :span="6">
          <tree ref="tree" class="tree" :treeData="treeData" @handleNodeClick="handleNodeClick"></tree>
        </el-col>
        <el-col :span="18" style="padding-left:10px;">
          <el-input
            id="smsContent"
            type="textarea"
            resize="none"
            :disabled="input_text"
            placeholder="请输入短信模板内容"
            v-model="content"
            show-word-limit
            maxlength="500"
            :autosize="{minRows: 17,maxRows:17}"
          ></el-input>

          <div class="shearPlate">
            <div class="shearPlateTitle">
              <i class="el-icon-document"></i> 剪切板信息
            </div>
            <el-input
              type="textarea"
              resize="none"
              :disabled="input_text"
              v-model="shearPlate"
              show-word-limit
              maxlength="500"
              :autosize="{minRows: 8,maxRows:8}"
              class="shearPlateInfo"
            ></el-input>
          </div>
        </el-col>
      </el-row>

      <span slot="footer" class="dialog-footer">
        <el-button type="primary" v-if="!Stylemsg" @click="saveTemplateContent" size="medium">保存模板</el-button>
        <el-button
          type="primary"
          @click="selectTemplate"
          size="medium"
          style="margin:0 20px 0 3px;"
        >选取模板</el-button>
      </span>
    </el-dialog>
    <msg-template-dialog ref="MsgTemplateDialog" @getSmsMould="getSmsMould"></msg-template-dialog>
  </div>
</template>

<script>
import Tree from '@/yz_components/tree/tree';
import MsgTemplateDialog from '@/view/yz_integratedCommunication/icpSms/informationTransmission/msgTemplateDialog';

export default {
    name: 'msgTemplate',
    components: { MsgTemplateDialog, Tree },
    data() {
        return {
            title: '短信模板', //标题
            isDialogVisible: false, //是否显示弹窗
            treeData: [],
            msgTemplateId: '', //模板分组id
            msgTemplateName: '', //模板标题名称
            content: '', //短信模板内容
            msgTemplateIds: '', //短信模板id数组
            Stylemsg: window.g.Stylemsg, //是否为腾讯云
            input_text: false,
            mainid: '',
        };
    },
    mounted() {
        // this.getSmsMould();
        setTimeout(() => {
            let that = this;
            var smsContent = document.getElementById('smsContent');
            // date:2020-10-29 author:hexinting 判断有该dom再监听复制
            if (smsContent) {
                smsContent.addEventListener('copy', function() {
                    var content = window.getSelection().toString();
                    console.log('模板复制', content);
                    that.$store.commit('setCopy', content);
                });
            }
        }, 1000);
    },
    computed: {
        // 剪切板信息
        shearPlate: {
            get() {
                return this.$store.state.copyContent;
            },
            set(val) {
                this.$store.commit('setCopy', val);
            },
        },
    },
    methods: {
        getSmsMould() {
            let data;
            // 判断是否为腾讯云
            if (this.Stylemsg) {
                this.$api.findTencentmsg(data).then(res => {
                    if (res.errorcode != 0) {
                        this.$message({
                            message: res.msg,
                            type: 'error',
                        });
                        return;
                    }
                    console.log(res);
                    if (res.data.length > 0) {
                        this.isDialogVisible = true;
                        this.$nextTick(() => {
                            this.treeData = res.data;
                        });
                    } else {
                        this.$message.error('请先添加短信模板下分组');
                    }
                });
            } else {
                this.isDialogVisible = true;
                this.$api.findSmsMould(data).then(res => {
                    if (res.errorcode != 0) {
                        this.$message({
                            message: res.msg,
                            type: 'error',
                        });
                        return;
                    }
                    console.log(res);
                    if (res.data.length > 0) {
                        this.isDialogVisible = true;
                        this.$nextTick(() => {
                            this.treeData = res.data;
                        });
                    } else {
                        this.$message.error('请先添加短信模板下分组');
                    }
                    // this.msgTemplateId = res.data[0].id;
                    // this.msgTemplateName = res.data[0].name;
                    // this.content = res.data[0].attributes.content;
                });
            }
        },
        handleNodeClick(node) {
            if (this.Stylemsg) {
                this.input_text = true;
                let data = {
                    smsTemplateTypeId: node.id,
                };
                this.$api.findTencenttree(data).then(res => {
                    if (res.errorcode != 0) {
                        this.$message({
                            message: res.msg,
                            type: 'error',
                        });
                        return;
                    }
                    console.log(res.data[0].id);
                    this.msgTemplateId = node.id;
                    this.msgTemplateName = node.name;
                    this.content = res.data[0].templateContent;
                    this.mainid = res.data[0].id;
                    this.$nextTick(() => {
                        this.$refs.MsgTemplateDialog.msgTemplateId = this.msgTemplateId;
                        this.$refs.MsgTemplateDialog.form.msgTemplateName = this.msgTemplateName;
                    });
                });
            } else {
                this.msgTemplateId = node.id;
                this.msgTemplateName = node.name;
                this.content = node.attributes.content;
                this.$nextTick(() => {
                    this.$refs.MsgTemplateDialog.msgTemplateId = this.msgTemplateId;
                    this.$refs.MsgTemplateDialog.form.msgTemplateName = this.msgTemplateName;
                });
            }
        },
        closeDialog() {
            this.isDialogVisible = false;
            this.$emit('closeDialog');
        },
        add() {
            this.$nextTick(() => {
                this.$refs.MsgTemplateDialog.isDialogVisible = true;
                this.$refs.MsgTemplateDialog.title = '短信模板新增';
                this.$refs.MsgTemplateDialog.content = this.content;
            });
        },
        update() {
            if (this.msgTemplateId == '' || this.msgTemplateId == null) {
                this.$message({
                    message: '请选中需要修改的模板信息',
                    type: 'warning',
                });
                return;
            }
            this.$nextTick(() => {
                this.$refs.MsgTemplateDialog.isDialogVisible = true;
                this.$refs.MsgTemplateDialog.title = '短信模板修改';
                this.$refs.MsgTemplateDialog.content = this.content;
            });
        },
        remove() {
            if (this.msgTemplateId == '' || this.msgTemplateId == null) {
                this.$message({
                    message: '请选中需要移除的短信模板',
                    type: 'warning',
                });
                return;
            }
            this.$confirm('确认移除当前短信模板?', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
            })
                .then(() => {
                    let data = {
                        id: this.msgTemplateId.toString(),
                    };
                    this.$api.removeSmsMould(data).then(res => {
                        if (res.errorcode != 0) {
                            this.$message({
                                message: res.msg,
                                type: 'error',
                            });
                            return;
                        }
                        this.$message({
                            message: '删除成功!',
                            type: 'success',
                        });
                        this.msgTemplateId = null;
                        this.content = null;
                        this.getSmsMould();
                    });
                })
                .catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消',
                    });
                });
        },
        selectTemplate() {
            this.$emit('selectTemplate', {
                text: this.content,
                id: this.mainid,
            });
        },
        saveTemplateContent() {
            if (!this.msgTemplateId) {
                this.$message({
                    type: 'error',
                    message: '请选择短信模版',
                });
                return false;
            }
            let data = {
                title: this.msgTemplateName, //标题
                content: this.shearPlate ? this.shearPlate : this.content, //内容
                id: this.msgTemplateId,
            };
            this.$api.updateSmsMould(data).then(res => {
                if (res.errorcode != 0) {
                    this.$message({
                        message: res.msg,
                        type: 'error',
                    });
                    return;
                }
                this.$message({
                    message: '保存成功!',
                    type: 'success',
                });
                this.shearPlate = '';
                this.getSmsMould();
            });
        },
    },
};
</script>

<style scoped>
>>> .el-scrollbar__wrap {
    overflow-x: hidden;
}

.tree {
    height: 600px;
    background-color: white;
    border: 1px solid rgba(211, 215, 219, 1);
}
.shearPlate {
    position: relative;
    margin-top: 10px;
}
.shearPlate .shearPlateTitle {
    position: absolute;
    top: 8px;
    left: 15px;
    z-index: 999;
}
.shearPlate /deep/ .shearPlateInfo .el-textarea__inner {
    padding: 30px 15px 5px;
}
.msgTemplate /deep/ .el-dialog {
    background: rgba(255, 255, 255, 1);
    box-shadow: 0px 0px 15px 2px rgba(0, 0, 0, 0.27);
    border-radius: 5px;
}
.msgTemplate /deep/ .el-dialog .el-dialog__header {
    background: rgba(241, 244, 246, 1);
    border-radius: 5px 5px 0px 0px;
    text-align: left;
    height: 40px;
    line-height: 40px;
    padding: 0 20px;
}
.msgTemplate /deep/ .el-dialog .el-dialog__header .el-dialog__title {
    font-size: 13px;
    color: #333;
}
.msgTemplate /deep/ .el-dialog .el-dialog__header .el-dialog__headerbtn {
    top: 14px;
}
.msgTemplate /deep/ .el-dialog__body {
    padding: 10px 20px 15px;
}
.msgTemplate /deep/ .el-dialog__footer {
    padding: 15px 0px 20px;
    border-top: 1px solid #e9ecf1;
    text-align: right;
}
</style>
<style lang="scss" scoped>
/deep/ .el-dialog {
    background: rgba(255, 255, 255, 1);
    box-shadow: 0px 0px 15px 2px rgba(0, 0, 0, 0.27);
    border-radius: 5px;
    .el-dialog__header {
        background: rgba(241, 244, 246, 1);
        border-radius: 5px 5px 0px 0px;
        text-align: left;
        height: 40px;
        line-height: 40px;
        padding: 0 20px;
        .el-dialog__title {
            font-size: 13px;
            color: #333;
        }
        .el-dialog__headerbtn {
            top: 14px;
        }
    }
    .el-dialog__body {
        padding: 0 20px;
    }
}
</style>
