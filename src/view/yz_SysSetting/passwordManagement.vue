<template>
  <div style="width:500px">
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
      <el-form-item label="旧密码" prop="oldPassword">
        <el-input type="password" v-model="ruleForm.oldPassword" autocomplete="off" :show-password="true"></el-input>
      </el-form-item>
      <el-form-item label="新密码" prop="password">
        <el-input type="password" v-model="ruleForm.password" autocomplete="off" :show-password="true"></el-input>
      </el-form-item>
      <el-form-item label="确认密码" prop="checkPass">
        <el-input type="password" v-model="ruleForm.checkPass" autocomplete="off"
                  :show-password="true"></el-input>
      </el-form-item>
    </el-form>
    <el-button type="primary" @click="submitForm('ruleForm')">保存</el-button>
  </div>
</template>

<!--
说明:autocomplete 属性是 HTML5 中的新属性，在input中autocomplete属性是默认开启的。
参考:https://www.w3school.com.cn/tags/att_input_autocomplete.asp
-->

<script>
  // import Qs from 'qs';
  import md5 from 'js-md5';
  import CryptoJS from "crypto-js";
  export default {
    name: "passwordManagement",
    data() {
      var oldPassword = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入原密码'));
        }  else {
          let data = {
              'password': window.g.IsYangZhouProject ? this._encrypt(value) : md5(value) // 扬州项目使用AES加密
          }
          this.$api.checkPassword(data).then((res) => {
                  console.log(res)
                if (res.errorcode == 0) {
                   callback();
                } else {
                   callback(new Error('请输入正确的原密码！'));
                }

              })

        }
      };
      var newPassword = (rule, value, callback) => {
        var pattern1 = /([0-9]+)/;
        var pattern2 = /([a-zA-Z]+)/;
        //var pattern3 = /([A-Z]+)/;
        var pattern4 = /\s+/g;
        console.log(pattern1.exec(value))
        if (value === '') {
          callback(new Error('请输入您的新密码'));
        } else if (value.length < 6 || value.length > 16) {
          callback(new Error('请输入6-16位的数字、字母、符号组合的新密码!'));
        } else if(!(pattern1.exec(value) && pattern2.exec(value))){
           callback(new Error('请输入6-16位的包含数字以及字母的密码组合!'));
        } else if(pattern4.exec(value)){
           callback(new Error('密码不能有空格、换行、tab缩进等所有的空白字符!'));
        }else {
          if (this.ruleForm.checkPass !== '') {
            this.$refs.ruleForm.validateField('checkPass');
          }
          callback();
        }
      };
      var chackPasswork = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'));
        } else if (value !== this.ruleForm.password) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
      };
      return {
        ruleForm: {
          oldPassword: "",//旧密码
          password: "",//新密码
          checkPass: "",//确认密码
        },
        rules: {
          oldPassword: [
            {validator: oldPassword, trigger: 'blur'}
          ],
          password: [
            {validator: newPassword, trigger: 'blur'}
          ],
          checkPass: [
            {validator: chackPasswork, trigger: 'blur'}
          ]
        }
      }
    },
    methods: {
      /**
       * 加密
       * @param word
       * @returns {*}
       */
      _encrypt(word) {
          console.log("encrypt加密");
          var key = CryptoJS.enc.Utf8.parse("abcdefgabcdefg12");
          var srcs = CryptoJS.enc.Utf8.parse(word);
          var encrypted = CryptoJS.AES.encrypt(srcs, key, {
              mode: CryptoJS.mode.ECB,
              padding: CryptoJS.pad.Pkcs7,
          });
          return encrypted.toString();
      },
      //提交方法
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          console.log(valid)
          if (valid) {
             //原密码以及新密码、确认密码都通过验证，可提交密码
            this.$confirm('确定修改密码吗？修改后需重新登录', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                let data = {
                'data':{
                  'oldPassword': window.g.IsYangZhouProject ? this._encrypt(this.ruleForm.oldPassword) : md5(this.ruleForm.oldPassword),
                  'password': window.g.IsYangZhouProject ? this._encrypt(this.ruleForm.password) : md5(this.ruleForm.password)
                }
              }
              this.$api.changePassword(data).then((res) => {
                  console.log(res);
                  if(res.errorcode === 0){
                      //退出重新登录
                      let data = {};
                      this.$api.logout(data).then((res) => {
                        console.log(res)
                      if (res.errorcode == 0) {
                        this.$message({
                          message: '退出成功',
                          type: 'success'
                        });
                        this.$router.push({
                          path: window.g.route
                        });
                        this.$icp.unifiedLogout();
                      }
                    })
                  }
              });
            }).catch(() => {
                this.$message({
                  type: 'info',
                  message: '已取消'
                });
            });

          } else {
            return false;
          }
        });
      },
      //重置表单方法
      resetForm(formName) {
        this.$refs[formName].resetFields();
      }
    }
  }
</script>

<style scoped>
</style>
