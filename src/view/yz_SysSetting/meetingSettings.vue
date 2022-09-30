<template>
  <div>
    <div style="display: flex; justify-content: space-between; margin: 10px 0">
      <div>
        <el-input
          type="input"
          placeholder="请输入视频会议账号"
          v-model="searchText"
          class="selectInput"
        ></el-input>
        <el-button type="primary" @click="query">查询</el-button>
      </div>
      <div>
        <el-button type="primary" @click="showDialog('新增')">新增</el-button>
        <el-button type="primary" @click="showDialog('修改')">修改</el-button>
        <el-button type="primary" @click="showDialog('删除')">删除</el-button>
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
        @row-dblclick="showDialog('修改')"
        style="width: 100%"
      >
        <el-table-column
          min-width="160"
          v-for="(item, key) in tableColumn"
          :key="key"
          :label="item.label"
          :prop="item.prop"
          :width="item.width"
          :resizable="false"
        ></el-table-column>
      </el-table>
      <el-pagination
        class="pagination"
        :page-size="pageSize"
        :total="total"
        :current-page.sync="currentPage"
        @current-change="getMeeting()"
        layout="total, prev, pager, next, jumper"
      ></el-pagination>
    </div>

    <el-dialog
      :title="title"
      :visible.sync="dialogVisible"
      width="30%"
      append-to-body
      :close-on-click-modal="false"
      center
    >
      <div>
        <el-form
          :label-position="labelPosition"
          label-width="150px"
          :model="ruleForm"
          :rules="rules"
          ref="ruleForm"
        >
          <el-form-item label="视频会议账号：" prop="username">
            <el-input
              v-model.trim="ruleForm.username"
              maxlength="20"
              placeholder="请输入视频会议账号"
            ></el-input>
          </el-form-item>
          <el-form-item
            v-if="visible"
            label="视频会议账号密码："
            prop="password"
          >
            <el-input
              type="text"
              v-model.trim="ruleForm.password"
              maxlength="20"
              placeholder="请输入视频会议账号密码"
            >
              <i
                slot="suffix"
                title="显示密码"
                @click="changePass('show')"
                style="cursor: pointer;font-family:element-icons !important"
                class="el-input__icon el-icon-view"
              ></i>
            </el-input>
          </el-form-item>
          <el-form-item v-else label="视频会议账号密码：" prop="password">
            <el-input
              type="password"
              v-model.trim="ruleForm.password"
              maxlength="20"
              placeholder="请输入视频会议账号密码"
            >
              <i
                slot="suffix"
                title="隐藏密码"
                @click="changePass('hidden')"
                style="cursor: pointer;font-family:element-icons !important;"
                class="el-input__icon el-icon-hidden-pwd"
              ></i>
            </el-input>
          </el-form-item>
          <el-form-item label="视频会议服务器IP：" prop="serverAddress">
            <el-input
              v-model.trim="ruleForm.serverAddress"
              maxlength="20"
              placeholder="请输入视频会议服务器IP"
            ></el-input>
          </el-form-item>
          <el-form-item label="视频会议服务器端口" prop="serverPort">
            <el-input
              v-model="ruleForm.serverPort"
              placeholder="请输入视频会议服务器端口"
            ></el-input>
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
import md5 from "js-md5";
export default {
  name: "meetingSettings",
  data() {
    return {
      tableColumn: [
        {
          prop: "username",
          label: "视频会议账号",
        },
        {
          prop: "serverAddress",
          label: "视频会议服务器IP",
        },
        {
          prop: "serverPort",
          label: "视频会议服务器端口",
        },
      ], //表头
      tableData: [], //表格数据
      pageSize: 5, //页数
      total: 0, //数据总数
      currentPage: 1, //当前页数
      dialogVisible: false,
      title: "",
      labelPosition: "right",
      row: "",
      searchText: "",
      clickSearch: "",
      ruleForm: {
        // id:"",
        username: "",
        password: "",
        serverAddress: "",
        serverPort: "",
      },
      rules: {
        username: [{ required: true, message: "视频会议账号不能为空" }],
        password: [{ required: true, message: "视频会议账号密码不能为空" }],
        serverAddress: [{ required: true, message: "视频会议服务器IP不能为空" }],
        serverPort: [{ required: true, message: "视频会议服务器端口不能为空" }],
      },
      visible: false,
    };
  },
  methods: {
    // 查询方法
    query() {
      this.clickSearch = this.searchText;
      this.currentPage = 1;
      this.getMeeting();
    },
    getMeeting() {
      let search = this.clickSearch === "" ? "" : this.clickSearch;
      let data = {
        "data": {
        "parameter": {
          "page": this.currentPage,
          "value": search,
        },
        "type": "select",
        },
      };
      console.log(data);
      // 查找全部数据
      this.$api.updateAppConfrences(data).then((res) => {
        console.log(res);
        if (res.errorcode != 0) {
          this.$message({
            message: res.msg,
            type: "error",
          });
          return;
        }
        this.row = "";
        this.tableData = res.data.parameter;
        this.total = res.data.paging.size;
      });
    },
    showDialog(button) {
      this.title = button;
      if (button == "新增") {
        this.$nextTick(() => {
          if (this.$refs["ruleForm"] !== undefined) {
            this.$refs["ruleForm"].resetFields(); //如果是第一次就点击新增就没必要reset, 根据元素undefined判断
          }
          // this.ruleForm.id = "";
          this.ruleForm.username = "";
          this.ruleForm.password = "";
          this.ruleForm.serverAddress = "";
          this.ruleForm.serverPort = "";
        });
        this.dialogVisible = true;
      } else if (button == "修改") {
        // this.ruleForm.username = this.row.username;
        // this.ruleForm.password = this.row.password;
        // this.ruleForm.serverAddress = this.row.serverAddress;
        // this.ruleForm.serverPort = this.row.serverPort;
        console.log(this.row);
        if (!this.row) {
          this.$message({
            message: "请先单击选中要修改的行",
            type: "warning",
          });
          return;
        }
        let data = {
          "data": {
            "parameter": this.row.id,
            "type": "conferencesId",// 单个会议数据查询
          },
        };
        console.log(data);
        this.$api.updateAppConfrences(data).then((res) => {
          console.log(res);
          if (res.errorcode != 0) {
            this.$message({
              message: res.msg,
              type: "error",
            });
            return;
          }
          let d = res.data;
          this.$nextTick(() => {
            if (this.$refs["ruleForm"] !== undefined) {
              this.$refs["ruleForm"].resetFields(); //如果是第一次就点击修改就没必要reset, 根据元素undefined判断
            }
            // this.ruleForm.id = d.id
            this.ruleForm.username = d.username;
            this.ruleForm.password = d.password;
            this.ruleForm.serverAddress = d.serverAddress;
            this.ruleForm.serverPort = d.serverPort;
          });
          this.dialogVisible = true;
        });
      } else if (button == "删除") {
        if (!this.row) {
          this.$message({
            message: "请先单击选中要" + button + "的行",
            type: "warning",
          });
          return;
        }
        this.$confirm("是否删除该会议账号？", "删除提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(() => {
            let data = {
              "data": {
                "parameter": [this.row.id],
                "type": "delete",
              },
            };
            console.log(data);
            // 删除
            this.$api.updateAppConfrences(data).then((res) => {
              console.log(res);
              if (res.errorcode == 0) {
                this.$message({
                  type: "success",
                  message: "删除成功!",
                });
                this.row = "";
                this.getMeeting();
              } else {
                this.$message.error(res.msg);
              }
            });
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消删除",
            });
          });
      }
    },
    tableDataRow(row) {
      this.row = row;
      console.log(row);
    },
    save() {
      this.$refs["ruleForm"].validate((valid) => {
        console.log(valid);
        if (valid) {
          if (this.title == "新增") {
            let data = {
              "data": {
                "parameter": {
                  "username": this.ruleForm.username,
                  "password": this.ruleForm.password,
                  "serverAddress": this.ruleForm.serverAddress,
                  "serverPort": this.ruleForm.serverPort,
                },
                "type": "add",
              },
            };
            // 新增
            this.$api.updateAppConfrences(data).then((res) => {
              console.log(res);
              if (res.errorcode != 0) {
                this.$message({
                  message: res.msg,
                  type: "error",
                });
                return;
              }
              this.getMeeting();
              this.dialogVisible = false;
            });
          } else if (this.title == "修改") {
            console.log(this.oldName, this.oldMobile);
            let data = {
              "data": {
                "parameter": {
                  "id": this.row.id,
                  "username": this.ruleForm.username,
                  "password": this.ruleForm.password,
                  "serverAddress": this.ruleForm.serverAddress,
                  "serverPort": this.ruleForm.serverPort,
                },
                type: "update",
              },
            };
            console.log(data);
            // 修改
            this.$api.updateAppConfrences(data).then((res) => {
              console.log(res);
              if (res.errorcode != 0) {
                this.$message({
                  message: res.msg,
                  type: "error",
                });
              } else {
                this.$message({
                  message: "修改成功",
                  type: "success",
                });
                this.getMeeting();
                this.dialogVisible = false;
              }
            });
          }
        } else {
          this.$message.error("请填写正确后提交");
          return false;
        }
      });
    },
    /**
     * @author husiyue
     * @date 2021/01/18
     * @description 密码明文暗文显示切换
     */
    changePass(value) {
      console.log(this.visible);
      this.visible = !(value === "show");
    }, //判断渲染，true:暗文显示，false:明文显示
  },
  mounted() {
    this.getMeeting();
  },
};
</script>

<style scoped>
>>> .el-tabs .el-tabs__content {
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

.tableStyle {
  line-height: 36px;
}
.selectInput {
  width: 330px;
  margin-right: 15px;
}
.el-icon-hidden-pwd{
  background:url("../../assets/icpImg/closeEye.png") no-repeat;
  background-position: center;
  background-size: 58% 58%;
  transition: none;
}
</style>
