<template>
  <div>
    <div style="display: flex;justify-content:space-between;margin: 10px 0">
       <div>
            <el-input type="input"  placeholder="输入用户名/登录名/手机号码" v-model="searchText" class='selectInput'></el-input>
            <el-button type="primary" @click="query">查询</el-button>
        </div>
        <div>
            <el-button type="primary" @click='showDialog("新增用户")'>新增</el-button>
            <el-button type="primary" @click='showDialog("修改用户")'>修改</el-button>
            <el-button type="primary" @click='showDialog("删除")'>删除</el-button>
            <el-button type="primary" @click='showDialog("重置密码")'>重置密码</el-button>
            <!-- <el-button type="primary" @click='showDialog("解锁")'>解锁</el-button> -->
        </div>
    </div>
    <div>
      <el-table
        ref="singleTable"
        class="tableStyle"
        :data="tableData"
        :height="301"
        highlight-current-row
        @row-click="tableDataRow"
        @row-dblclick='showDialog("修改用户")'
        style="width: 100%"
        v-if="IsOpenLabProject">
        <el-table-column min-width="160" v-for="(item,key) in tableColumnOpb" :key="key" :label="item.label"
        :prop="item.prop"
        :width="item.width" :resizable="false"></el-table-column>   
      </el-table>
      <el-table
        ref="singleTable"
        class="tableStyle"
        :data="tableData"
        :height="301"
        highlight-current-row
        @row-click="tableDataRow"
        @row-dblclick='showDialog("修改用户")'
        style="width: 100%"
        v-else>
        <el-table-column min-width="160" v-for="(item,key) in tableColumn" :key="key" :label="item.label"
                         :prop="item.prop"
                         :width="item.width" :resizable="false"></el-table-column>        
      </el-table>
      <el-pagination class="pagination" :page-size="pageSize"  :total="total"
                     :current-page.sync="currentPage"
                     @current-change="getUser()"
                     layout="total, prev, pager, next, jumper"></el-pagination>
    </div>

    <el-dialog
      :title='title'
      :visible.sync="dialogVisible"
      width="30%"
      append-to-body
      :close-on-click-modal="false"
      center>
      <div>
       <el-form :label-position="labelPosition" label-width="150px" :model="ruleForm" :rules="rules" ref="ruleForm">
        <el-form-item label="用户名：" prop="userName">
          <el-input v-model.trim="ruleForm.userName" maxlength='20'></el-input>
        </el-form-item>
        <el-form-item label="登录名称：" prop="loginName">
          <el-input v-model.trim="ruleForm.loginName" maxlength='20'></el-input>
        </el-form-item>
        <el-form-item label="手机号码：" prop="phoneNumber">
          <el-input v-model.trim="ruleForm.phoneNumber" maxlength='20'></el-input>
        </el-form-item>
        <el-form-item label="状态：" v-if="title == '修改用户'">
          <el-input v-model="ruleForm.state" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="是否设为管理员：">
          <el-radio v-model="ruleForm.radio" label="yes">是</el-radio>
          <el-radio v-model="ruleForm.radio" label="no">否</el-radio>
        </el-form-item>
        <el-form-item label="视频会议账号" v-if="IsOpenLabProject">
          <el-select v-model="ruleForm.meetingId" placeholder="请选择视频会议账号">
            <el-option
              v-for="item in meetingIdArr"
              :key="item.username"
              :label="item.username"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
     </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="save">保 存</el-button>
    </span>
  </el-dialog>
 </div>
</template>

<script>
  // import Qs from 'qs';
  import md5 from 'js-md5';
  import CryptoJS from "crypto-js";
  export default {
    name: "eventSettingsUser",
    data() {
      let userNameCheck = (rule, value, callback) => {
        //value = value.replace(/^(\s|\xA0)+|(\s|\xA0)+$/g, '');
        if (value === '') {
          callback(new Error('用户名不能为空'));
        }
        callback();
      };
      let loginNameCheck = (rule, value, callback) => {
        //value = value.replace(/^(\s|\xA0)+|(\s|\xA0)+$/g, '');
        if (value === '') {
          callback(new Error('登录名不能为空'));
        }
        let reg = new RegExp("[\\u4E00-\\u9FFF]+","g");
        if(reg.test(value)){
          callback(new Error('登录名不能含有中文字符'));
        }
        callback();
      };
      let phoneNumberCheck=(rule,value,callback)  =>{
            let num1 = /^[1][2,3,4,5,6,7,8,9][0-9]{9}$/;   //手机号码校验
            if(value && !value.match(num1)){
              callback(new Error('请输入正确的11位手机号码!'));
            }
            callback();
          };
      return {
        tableColumn: [
          {
            prop: "displayname",
            label: "用户名"
          }, {
            prop: "name",
            label: "登录名"
          }, {
            prop: "Mobile",
            label: "手机号码"
          }, {
            prop: "lastLogin",
            label: "最近登录时间"
          }, {
            prop: "errorCount",
            label: "状态"
          }
        ],//表头
        tableColumnOpb: [
          {
            prop: "displayname",
            label: "用户名"
          }, {
            prop: "name",
            label: "登录名"
          }, {
            prop: "Mobile",
            label: "手机号码"
          }, {
            prop: "lastLogin",
            label: "最近登录时间"
          }, {
            prop: "conferencesName",
            label: "视频会议账号"
          }, {
            prop: "errorCount",
            label: "状态"
          }
        ],//表头
        tableData: [],//表格数据
        pageSize: 5,//页数
        total: 0,//数据总数
        currentPage: 1,//当前页数
        dialogVisible:false,
        title:'',
        labelPosition:'right',
        row:'',
        searchText:'',
        clickSearch:'',
        ruleForm:{
              userName:'',
              loginName:'',
              phoneNumber:'',
              state:'',
              radio:'no',
              meetingId:'',
            },
        oldName:'',
        oldMobile:'',
        rules: {
          userName: [
            {validator: userNameCheck, trigger: 'blur'}
          ],
          loginName: [
            {validator: loginNameCheck, trigger: 'blur'}
          ],
          phoneNumber: [
            {validator: phoneNumberCheck, trigger: 'blur'}
          ]
        },
        meetingIdArr: [],// 视频会议账号数据
        IsOpenLabProject: window.g.IsOpenLabProject
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
     query(){
         this.clickSearch = this.searchText;
         this.currentPage = 1;
         this.getUser();
     },
     getUser(){
        let search = this.clickSearch === ""? '':this.clickSearch;
        let data = {
          "data":{
            "parameter":{
              "page":this.currentPage,
              "value":search
            },
            "type":"select"
            }
        };
        console.log(data)
        this.$api.userManage(data).then(res => {
          console.log(res)
          if (res.errorcode!=0){
            this.$message({
              message:res.msg,
              type:"error"
            });
            return
          }
          this.row = '';
          this.tableData = res.data.parameter;
          this.total = res.data.paging.size;
        })
        if(window.g.IsOpenLabProject){
          let data2 = {
            "data": {
              "type": "selectAll",
            },
          };
          // 查找视频会议账号数据
          this.$api.updateAppConfrences(data2).then((res) => {
            console.log(res);
            if (res.errorcode != 0) {
              this.$message({
                message: res.msg,
                type: "error",
              });
              return;
            }
            this.meetingIdArr = res.data;
            
          });
        }
      },
   showDialog(button){
        this.title = button;
        if(button == '新增用户'){
           this.$nextTick(()=>{
              if (this.$refs['ruleForm'] !== undefined) {
                  this.$refs['ruleForm'].resetFields(); //如果是第一次就点击新增就没必要reset, 根据元素undefined判断
              }
              this.ruleForm.userName = '';
              this.ruleForm.loginName = '';
              this.ruleForm.phoneNumber = '';
              this.ruleForm.radio = 'no';
              this.ruleForm.meetingId = ''
           });
           this.dialogVisible = true;
           if(window.g.IsOpenLabProject){
            let data2 = {
                "data": {
                  "type": "selectAll",
                },
              };
              // 查找视频会议账号数据
              this.$api.updateAppConfrences(data2).then((res) => {
                console.log(res);
                if (res.errorcode != 0) {
                  this.$message({
                    message: res.msg,
                    type: "error",
                  });
                  return;
                }
                this.meetingIdArr = res.data;
                
              });
           }
        }else if(button == '修改用户'){
           console.log(this.row)
           if(!this.row){
              this.$message({
                message: '请先单击选中要修改的行',
                type: 'warning'
              });
              return;
           }
           let data = {
              "data":{
                "parameter":this.row.id,
                "type":"operatorId"
                }
            };
            console.log(data)
          this.$api.userManage(data).then(res => {
            console.log(res)
            if (res.errorcode!=0){
              this.$message({
                message:res.msg,
                type:"error"
              });
              return
            }
             let d = res.data;
             this.$nextTick(()=>{
                if (this.$refs['ruleForm'] !== undefined) {
                    this.$refs['ruleForm'].resetFields(); //如果是第一次就点击修改就没必要reset, 根据元素undefined判断
                }
                 this.ruleForm.userName = d.displayname;
                 this.ruleForm.loginName = d.name;
                 this.ruleForm.phoneNumber = d.mobile;
                 this.ruleForm.radio = d.isAdmin;
                 this.ruleForm.state = d.errorCount;
                 this.ruleForm.meetingId = d.conferencesId
                 this.oldName = d.name;
                 this.oldMobile = d.mobile;
                 if(window.g.IsOpenLabProject){
                  let data2 = {
                    "data": {
                      "type": "selectAll",
                    },
                  };
                  // 查找视频会议账号数据
                  this.$api.updateAppConfrences(data2).then((res) => {
                    console.log(res);
                    if (res.errorcode != 0) {
                      this.$message({
                        message: res.msg,
                        type: "error",
                      });
                      return;
                    }
                    this.meetingIdArr = res.data;
                    
                  });
                 }
             });
             this.dialogVisible = true;
          })
        }else if(button == '删除' || button == '重置密码' || button == '解锁'){
           if(!this.row){
              this.$message({
                message: '请先单击选中要'+button+'的行',
                type: 'warning'
              });
              return;
           }
           if(button == '解锁'){
              if(this.row.errorCount == '正常'){
                this.$message({
                  type: 'success',
                  message: '该用户状态正常，无需解锁!'
                });
                return;
              }
           }
           this.$prompt('请输入您的登录密码，以确认身份', '确认密码', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              center: true,
              closeOnClickModal:false,
              inputType:'password',
              //inputPattern: /[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?/,
              //inputErrorMessage: '邮箱格式不正确'
            }).then(({ value }) => {
              console.log(value);
              let data = {'password':window.g.IsYangZhouProject ? this._encrypt(value) : md5(value) }; // 扬州项目使用AES加密
              this.$api.checkPassword(data).then((res) => {
                  console.log(res)
                if (res.errorcode == 0) {
                   if(button == '重置密码'){
                       let data = {
                         "data":{
                          "parameter":[this.row.id],
                          "type":"reset"
                        }
                      }
                      console.log(data);
                      this.$api.userManage(data).then((res) => {
                        console.log(res)
                        if(res.errorcode == 0){
                          this.$message({
                            type: 'success',
                            message: '重置密码成功!'
                          });
                          // 如果重置的是当前登录用户的密码，要退出重新登录数据库才能更新密码
                          if (sessionStorage.getItem('operator_id') == this.row.id) {
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
                              }
                            })
                          }
                        } else{
                          this.$message.error(res.msg);
                        }

                      })
                       return;
                   }
                   if(button == '解锁'){
                       let data = {
                         "data":{
                          "parameter":this.row.id,
                          "type":"cancel"
                        }
                      }
                      console.log(data);
                      this.$api.userManage(data).then((res) => {
                        console.log(res)
                        if(res.errorcode == 0){
                          this.$message({
                            type: 'success',
                            message: '解锁成功!'
                          });
                          this.getUser();
                        } else{
                          this.$message.error(res.msg);
                        }

                      })
                       return;
                   }
                   this.$confirm('删除后该用户将不能再登录，是否删除？', '删除提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                      }).then(() => {
                        let data = {
                         "data":{
                          "parameter":[this.row.id],
                          "type":"delete"
                        }
                      }
                      console.log(data);
                      this.$api.userManage(data).then((res) => {
                        console.log(res)
                        if(res.errorcode == 0){
                          this.$message({
                            type: 'success',
                            message: '删除成功!'
                          });
                          this.row = '';
                          this.getUser();
                        } else{
                          this.$message.error(res.msg);
                        }
                      })
                    }).catch(() => {
                      this.$message({
                        type: 'info',
                        message: '已取消删除'
                      });
                    });
                } else {
                   this.$message.error(res.msg);
                }
              })
            }).catch(() => {
              this.$message({
                type: 'info',
                message: '取消输入'
              });
            });
        }
    },
    tableDataRow(row){
        this.row = row;
        console.log(row)
     },
    save(){
        this.$refs['ruleForm'].validate((valid) => {
          console.log(valid)
          if (valid) {
                if(this.title == '新增用户'){
                   let data = {
                        "data":{
                          "parameter":{
                            "name":this.ruleForm.loginName,
                            "mobile":this.ruleForm.phoneNumber,
                            "displayname":this.ruleForm.userName,
                            "isAdmin":this.ruleForm.radio,
                            "conferencesId":this.ruleForm.meetingId
                          },
                          "type":"add"
                          }
                    };
                  this.$api.userManage(data).then(res => {
                    console.log(res)
                    if (res.errorcode!=0){
                      this.$message({
                        message:res.msg,
                        type:"error"
                      });
                      return
                    }
                    this.getUser();
                    this.dialogVisible = false;
                  })
                }else if(this.title == '修改用户'){
                  console.log(this.oldName,this.oldMobile)
                   let data = {
                        "data":{
                          "parameter":{
                            "id":this.row.id,
                            "name":this.ruleForm.loginName,
                            "mobile":this.ruleForm.phoneNumber,
                            "displayname":this.ruleForm.userName,
                            "isAdmin":this.ruleForm.radio,
                            "oldName":this.oldName,
                            "oldMobile":this.oldMobile? this.oldMobile:'',
                            "conferencesId":this.ruleForm.meetingId
                          },
                          "type":"update"
                          }
                    };
                    console.log(data)
                  this.$api.userManage(data).then(res => {
                    console.log(res)
                    if (res.errorcode!=0){
                      this.$message({
                        message:res.msg,
                        type:"error"
                      });
                    } else{
                      this.$message({
                        message: '修改成功',
                        type: 'success'
                      });
                      this.getUser();
                      this.dialogVisible = false;
                    }

                  })
                }
          } else {
            this.$message.error('请填写正确后提交');
            return false;
          }
        });

    }

  },
  mounted() {
      this.getUser();
  }
}
</script>

<style scoped>
 >>>.el-tabs .el-tabs__content{
      overflow: hidden !important;
      position: relative;
  }
  .pagination {
    float: right;
    width: 892px;
    height: 36px;
    margin-top: 16px;
    padding: 0;
  }

  .tableStyle{
    line-height: 36px;
  }
  .selectInput{
    width:330px;
    margin-right: 15px;
  }
</style>
