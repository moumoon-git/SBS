<template>
  <div>
    <el-dialog
        :title="title"
        :visible.sync="isDialogVisible"
        @close="closeDialog"
        width="30%"
        :close-on-click-modal="false"
    >
      <div style="height: 350px">
        <el-scrollbar style="height: 100%;">
          <el-row>
            <el-col :span="24">
              <el-form ref="workForm" :model="workForm" :rules="rules" label-position="right" label-width="90px">
                <el-form-item prop="id" hidden>
                  <el-col :span="23">
                    <el-input v-model="workForm.id"></el-input>
                  </el-col>
                </el-form-item>


                  <el-form-item prop="title" label="内容概要:">
                    <el-col :span="23">
                      <el-input v-model="workForm.title" placeholder="长度限100字符以内"></el-input>
                    </el-col>
                  </el-form-item>



                <el-form-item prop="memo" label="提醒内容:">
                  <!--当数据获取且存在后再渲染标签-->
                  <el-col :span="23">
                    <el-input
                      type="textarea"
                      :rows="3"
                      resize="none"
                      placeholder="长度限10000字符以内"
                      v-model="workForm.memo">
                    </el-input>
                  </el-col>
                </el-form-item>






                <el-form-item prop="remindTime" label="到期时间:">
                    <el-col :span="23" style="text-align: left;">
                      <el-date-picker
                          popper-class="date-picker"
                          v-model="workForm.remindTime"
                          type="datetime"
                          placeholder="选择日期"
                          value-format="yyyy-MM-dd HH:mm:ss"
                      >
                      </el-date-picker>
                    </el-col>
                  </el-form-item>

              </el-form>
              <el-row>
                <el-col :span="24">
                  <el-button type="primary" @click="submit('workForm')">保存</el-button>
                  <el-button type="primary" @click="closeDialog">关闭</el-button>
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
    data(){
      return {
        title: "",//标题
        workForm: {
          id:'',//
          title: "",
          memo: "",
          remindTime: "",
        }, //表单数据
        rules: {
          title: [
            {required: true, message: '标题不能为空', trigger: 'blur'},
            {
              max: 100,
              message: '标题不能超过100字'
            },
          ],
          memo: [
            {required: true, message: '内容不能为空', trigger: 'blur'},
            {
              max: 10000,
              message: '内容不能超过10000字'
            },
          ],
          remindTime: [
            {required: true, message: '时间不能为空', trigger: 'blur'},
          ],
        },//验证规则
        isDialogVisible: false,//是否显示弹窗
      }
    },
    methods:{
      closeDialog() {
        //清空表单内容以及校验信息
        this.$nextTick(() => {
          this.$refs['workForm'].resetFields();
        });
        this.isDialogVisible = false;
      },
      showData(row) {
        this.$nextTick(() => {
          this.workForm.title= row.title;
          this.workForm.memo= row.memo;
          this.workForm.remindTime= row.remindTime;
          this.workForm.id=row.id;
        })
      },
      submit(formName) {
        //operate	操作类型 0->新增 1-> 更新 2->删除
        this.$refs[formName].validate((valid) => {
          if (!valid) return;
          if (this.title.indexOf("新增") !== -1) {
            let data = {
              data:this.workForm,
            };
            this.$api.memoAdd(data).then(res => {
              if (res.errorcode != 0) {
                this.$message({
                  message: res.msg,
                  type: "error"
                });
                return;
              }
              this.$message({
                message: "新增成功!",
                type: "success"
              });
              this.isDialogVisible = false;
              this.$emit("getTableData");
            });
          }
          if (this.title.indexOf("修改") !== -1) {
            let data = {
              data:this.workForm,
            };
            this.$confirm('是否确认保存当前修改?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              this.$api.memoUpdate(data).then(res => {
                if (res.errorcode != 0) {
                  this.$message({
                    message: res.msg,
                    type: "error"
                  });
                  return;
                }
                this.$message({
                  message: "修改成功!",
                  type: "success"
                });
                this.isDialogVisible = false;
                this.$emit("getTableData");
              });
            }).catch(() => {
              this.$message({
                type: 'info',
                message: '已取消修改!'
              });
            });
          }
        });
      },
    },
  }
</script>

<style scoped>

</style>
