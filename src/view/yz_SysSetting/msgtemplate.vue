<template>
  <div>
<!--  <el-dialog-->
<!--    :title="title"-->
<!--    :visible.sync="isDialogVisible"-->
<!--    :close-on-click-modal="false"-->
<!--    @close="closeDialog"-->
<!--  >-->
    <el-row>
      <el-col  :span="8">
        <el-button type="primary" @click="add">新增</el-button>
        <el-button type="primary" @click="update">修改</el-button>
        <el-button type="primary" @click="remove">删除</el-button>
      </el-col>
    </el-row>

<!--    //腾讯云专属-->
    <el-row style="margin-top:10px">
      <el-col :span="8">
        <tree ref="tree" class="tree" :treeData="treeData" @handleNodeClick="handleNodeClick"></tree>
      </el-col>
      <el-col :offset="2" :span="12">
        <el-input type="textarea" resize="none"
                  placeholder="请输入短信模板内容"
                  v-model="content" show-word-limit maxlength="500" :autosize="{minRows: 8,maxRows:8}"></el-input>
      </el-col>
    </el-row>

<!--    <el-button  @click="saveTemplateContent">保存模板</el-button>-->
<!--    <el-button @click="selectTemplate">选取模板</el-button>-->
<!--  </el-dialog>-->
  <msgtencont ref="msgtencont"  @getSmsMould="getSmsMould"></msgtencont>
  </div>
</template>

<script>
    import Tree from "@/yz_components/tree/tree";
    import msgtencont from "@/view/yz_SysSetting/eventSettings/msgtencont.vue";
    
    export default {
        name: "msgtemplate",
        components: {msgtencont, Tree},
        data() {
            return {
                title: '短信模板',//标题
                isDialogVisible: true,//是否显示弹窗
                treeData: [],
                msgTemplateId: '',//模板分组id
                msgTemplateName: '',//模板标题名称
                content: '',//短信模板内容
                msgTemplateIds: '',//短信模板id数组
                Stylemsg:window.g.Stylemsg,//是否为腾讯云
                typeid:'',
            }
        },
        mounted() {
            this.getSmsMould();
        },
        methods: {
            getSmsMould() {
                let data;
                    this.$api.findTencentmsg(data).then(res => {
                        if (res.errorcode != 0) {
                            this.$message({
                                message: res.msg,
                                type: "error"
                            });
                            return;
                        }
                        console.log(res)
                        this.treeData = res.data;
                    })

            },
            handleNodeClick(node) {
                console.log(node)
                this.typeid=node.id
                    let data = {
                        smsTemplateTypeId:node.id//模板id
                    };
                    this.$api.findTencenttree(data).then(res => {
                        if (res.errorcode != 0) {
                            this.$message({
                                message: res.msg,
                                type: "error"
                            });
                            return
                        }
                        console.log(res.data)
                        this.msgTemplateId = node.id;
                        this.msgTemplateName = node.name;
                        this.content = res.data[0].templateContent;
                        this.$nextTick(() => {
                            this.$refs.msgtencont.msgTemplateId = this.msgTemplateId;
                            this.$refs.msgtencont.form.msgTemplateName = this.msgTemplateName;
                            this.$refs.msgtencont.form.id=this.typeid
                        })
                    })
            },
            // closeDialog() {
            //     this.isDialogVisible = false;
            // },
            // 新增
            add() {
                this.$nextTick(() => {
                    this.$refs.msgtencont.isDialogVisible = true;
                    this.$refs.msgtencont.title = "短信模板新增";
                    // this.$refs.msgtencont.content = this.content;
                })
            },
            //修改
            update() {
                if (this.msgTemplateId == "" || this.msgTemplateId == null) {
                    this.$message({
                        message: "请选中需要修改的模板信息",
                        type: "warning"
                    });
                    return;
                }
                this.$nextTick(() => {
                    this.$refs.msgtencont.isDialogVisible = true;
                    this.$refs.msgtencont.title = "短信模板修改";
                    this.$refs.msgtencont.content = this.content;
                })
            },
            // 删除
            remove() {
                if (this.msgTemplateId == "" || this.msgTemplateId == null) {
                    this.$message({
                        message: "请选中需要移除的短信模板",
                        type: "warning"
                    });
                    return;
                }
                this.$confirm('确认移除当前短信模板?', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    let data=new FormData()
                    data.append("smsTemplateTypeId",this.typeid)
                    // let data={
                    //     smsTemplateTypeId: this.typeid
                    // }
                    this.$api.changeTencentree(data).then(res => {
                        console.log(res)
                        if (res.errorcode != 0) {
                            this.$message({
                                message: res.msg,
                                type: "error"
                            });
                            return;
                        }
                        this.$message({
                            message: "删除成功!",
                            type: "success"
                        });
                        this.msgTemplateId = null;
                        this.content=null;
                        this.getSmsMould();
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消'
                    });
                });
            },
            // selectTemplate() {
            //     this.$emit("selectTemplate", this.content);
            // },
            saveTemplateContent() {
                let data = {
                    title: this.msgTemplateName,//标题
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
                        message: "保存成功!",
                        type: "success"
                    });
                    this.getSmsMould();
                })
            },
        }
    }
</script>

<style scoped>

</style>
