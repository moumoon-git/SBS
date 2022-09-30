<template>
  <div>
    <el-dialog
        :title="title"
        :visible.sync="isDialogVisible"
        @close="closeDialog"
        width="360px"
        :close-on-click-modal="false"
    >
      <div>
        <el-row>
          <el-form ref="form" :model="form" :rules="rules">
            <el-form-item prop="content">
              <el-col>
                <el-input
                    type="textarea"
                    :rows="3"
                    resize="none"
                    placeholder="长度限100字符以内"
                    v-model="form.content">
                </el-input>
              </el-col>
            </el-form-item>
          </el-form>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-button type="primary" @click="submit">保存</el-button>
            <el-button type="primary" @click="closeDialog">关闭</el-button>
          </el-col>
        </el-row>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: "addProcessContentPopup",
    data() {
      return {
        title: "流程处理",//标题
        isDialogVisible: false,//是否显示弹窗,
        form: {content: ''},
        rules: {
          content: [
            {required: true, message: '内容不能为空', trigger: 'blur'},
            {
              max: 10000,
              message: '内容不能超过10000字'
            },
          ],
        },//验证规则
      }
    },
    methods: {
      closeDialog() {
        //清空表单内容以及校验信息
        this.$nextTick(() => {

        });
        this.isDialogVisible = false;
      },
      submit() {
          this.$confirm('说明:流程完成后,不可修改', '该流程是否已完成', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.$refs.form.validate(res => {
              if (!res)return
              //console.log(this.form.content)
              this.$emit('saveFlow', this.form.content)
            })
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消处理流程!'
            });
          });
      }
    },
  }
</script>

<style scoped>

</style>