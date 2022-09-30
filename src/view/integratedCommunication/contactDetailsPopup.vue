<!--@author：llp-->
<template>
  <div>
    <el-dialog
      center
      :title="title"
      :visible.sync="isDialogVisible"
      :close-on-click-modal="false"
      @open="openDialog"
      @close="closeDialog"
    >
      <el-container>
        <el-aside width="250px">
          <el-scrollbar style="height: 100%">
            <el-row>
              <el-col
                class="selectGroup"
                style="
                  border: 1px solid rgb(211, 215, 219);
                  border-bottom: initial;
                  height: 40px;
                  line-height: 40px;
                  position: relative;
                "
              >
                <span style="margin-left: 1vw">选择分组</span>
                <!-- <i class="el-icon-time" style="position: absolute;right: 1vw;color:#409EFF;top: 50%;transform: translateY(-50%);cursor: pointer;" @click="changeHistory"></i> -->
              </el-col>
            </el-row>
            <el-row>
              <el-col>
                <div class="tree">
                  <el-scrollbar style="height: 100%">
                    <el-tree
                      :data="treeData"
                      :check-on-click-node="true"
                      ref="tree"
                      show-checkbox
                      :check-strictly="true"
                      node-key="id"
                      :default-expanded-keys="groupIds"
                      :default-checked-keys="groupIds"
                      :props="defaultProps"
                      @node-click="handleClick"
                      @check-change="handleClick"
                    >
                    </el-tree>
                  </el-scrollbar>
                </div>
              </el-col>
            </el-row>
            <!-- <el-row>
              <el-col  style="text-align: center;padding-top: 10px"><el-link type="primary" @click="changeHistory">查看变更历史</el-link></el-col>
            </el-row>         -->
          </el-scrollbar>
        </el-aside>

        <el-main>
          <el-scrollbar style="height: 100%">
            <el-row v-if="title !== '新增联系人'">
              <el-col
                :span="24"
                style="
                  display: flex;
                  justify-content: flex-end;
                  height: 40px;
                  color: rgb(64, 158, 255);
                "
              >
                <span @click="changeHistory" style="cursor: pointer"
                  >分组变更记录</span
                >
              </el-col>
            </el-row>
            <el-row>
              <el-col>
                <el-form
                  ref="contactForm"
                  :model="contactForm"
                  :rules="rules"
                  label-position="right"
                  label-width="100px"
                >
                  <el-form-item prop="id" hidden>
                    <el-col :span="24">
                      <el-input v-model="contactForm.id"></el-input>
                    </el-col>
                  </el-form-item>

                  <el-row>
                    <el-col :span="12">
                      <el-form-item prop="name" label="姓名:">
                        <el-col :span="24">
                          <el-input
                            v-model="contactForm.name"
                            maxlength="100"
                            show-word-limit
                          ></el-input>
                        </el-col>
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item
                        prop="position"
                        label="职务:"
                        style="position: relative"
                      >
                        <el-col :span="24">
                          <el-input v-model="contactForm.position"></el-input>
                        </el-col>
                        <el-col
                          :span="6"
                          style="
                            position: absolute;
                            right: -5%;
                            color: #409eff;
                            cursor: pointer;
                          "
                        >
                          <span @click="changePosition">选择</span>
                        </el-col>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="12">
                      <el-form-item
                        prop="workUnit"
                        label="工作单位:"
                        maxlength="10"
                      >
                        <el-col :span="24">
                          <el-input v-model="contactForm.workUnit"></el-input>
                        </el-col>
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item
                        prop="sex"
                        label="性别:"
                        class="leftDeviation"
                      >
                        <!--当数据获取且存在后再渲染标签-->
                        <el-radio
                          v-if="sexRadio[1] != undefined"
                          v-model="contactForm.sex"
                          :label="sexRadio[1].id"
                        >
                          {{ sexRadio[1].name }}
                        </el-radio>
                        <el-radio
                          v-if="sexRadio[0] != undefined"
                          v-model="contactForm.sex"
                          :label="sexRadio[0].id"
                        >
                          {{ sexRadio[0].name }}
                        </el-radio>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="12">
                      <el-form-item prop="mobile" label="手机号码:">
                        <el-col :span="24">
                          <el-input
                            v-model="contactForm.mobile"
                            show-word-limit
                          ></el-input>
                        </el-col>
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item prop="otherTel" label="手机2:">
                        <el-col :span="24">
                          <el-input
                            v-model="contactForm.otherTel"
                            show-word-limit
                          ></el-input>
                        </el-col>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="12">
                      <el-form-item prop="temobile" label="手持终端:">
                        <el-col :span="24">
                          <el-input
                            v-model="contactForm.temobile"
                            show-word-limit
                          ></el-input>
                        </el-col>
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item prop="officeTel" label="办公电话:">
                        <el-col :span="24">
                          <el-input
                            v-model="contactForm.officeTel"
                            show-word-limit
                          ></el-input>
                        </el-col>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="12">
                      <el-form-item prop="homeTel" label="应急电话:">
                        <el-col :span="24">
                          <el-input
                            v-model="contactForm.homeTel"
                            show-word-limit
                          ></el-input>
                        </el-col>
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item
                        prop="otherTel2"
                        label="其它电话:"
                        show-word-limit
                      >
                        <el-col :span="24">
                          <el-input
                            v-model="contactForm.otherTel2"
                            show-word-limit
                          ></el-input>
                        </el-col>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="12">
                      <el-form-item prop="fax" label="传真号码:">
                        <el-col :span="24">
                          <el-input
                            v-model="contactForm.fax"
                            show-word-limit
                          ></el-input>
                        </el-col>
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item prop="email" label="电子邮箱:">
                        <el-col :span="24">
                          <el-input v-model="contactForm.email"></el-input>
                        </el-col>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="12">
                      <el-form-item prop="importance" label="紧急程度:">
                        <el-radio
                          v-if="importanceRadio[1] != undefined"
                          v-model="contactForm.importance"
                          :label="importanceRadio[1].id"
                          >{{ importanceRadio[1].name }}
                        </el-radio>
                        <el-radio
                          v-if="importanceRadio[0] != undefined"
                          v-model="contactForm.importance"
                          :label="importanceRadio[0].id"
                          >{{ importanceRadio[0].name }}
                        </el-radio>
                      </el-form-item>
                      <!-- <el-form-item prop="commonlyUsed" label="常用联系人:">
                        <template>
                          <el-radio v-model="commonlyUsedIsCheck" :label="true">是</el-radio>
                          <el-radio v-model="commonlyUsedIsCheck" :label="false">否</el-radio>
                        </template>
                      </el-form-item>
                      <el-form-item prop="commonlyUsed" label="常用联系人:">
                        <el-checkbox ref="elCheckBox" v-model="commonlyUsedIsCheck">
                        常用联系人
                        </el-checkbox>
                      </el-form-item> -->
                    </el-col>
                    <el-col :span="12">
                      <el-form-item prop="remark" label="备注:">
                        <el-col :span="24">
                          <el-input
                            type="textarea"
                            :rows="3"
                            resize="none"
                            v-model="contactForm.remark"
                          ></el-input>
                        </el-col>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <!-- 办公地址 -->
                  <el-row>
                    <el-col :span="12">
                      <el-form-item prop="officeAddress" label="办公地址:">
                        <el-col :span="24">
                          <el-input
                            v-model="contactForm.officeAddress"
                            show-word-limit
                          ></el-input>
                        </el-col>
                      </el-form-item>
                    </el-col>
                  </el-row>
                </el-form>
              </el-col>
            </el-row>
          </el-scrollbar>
        </el-main>
      </el-container>

      <span
        slot="footer"
        class="dialog-footer"
        v-if="title != '查看联系人'"
        style="display: flex; justify-content: flex-end"
      >
        <el-button type="primary" @click="submit('contactForm')"
          >保存</el-button
        >
        <el-button
          type="primary"
          @click="closeDialog"
          style="
            background: initial;
            border-color: rgb(211, 215, 219);
            color: initial;
            margin-left: 1vw;
            margin-right: 2vw;
          "
          >关闭</el-button
        >
      </span>
      <el-dialog
        width="40%"
        center
        title="变更 历史"
        :visible.sync="groupingHistory"
        :close-on-click-modal="false"
        append-to-body
      >
        <el-table :data="tableData" border style="width: 100%">
          <el-table-column
            align="center"
            prop="editTime"
            label="更新时间"
            min-width="70%"
          >
          </el-table-column>
          <el-table-column
            align="center"
            prop="workUnit"
            label="所在部门"
            min-width="30%"
          >
          </el-table-column>
        </el-table>
      </el-dialog>
    </el-dialog>
    <position-tree
      ref="PositionTree"
      @handleNodeClick="handleNodeClick"
    ></position-tree>
  </div>
</template>

<script>
import { adjustCurrentPage } from "../../assets/js/common";
import PositionTree from "@/view/integratedCommunication/positionTree";

export default {
  name: "contactDetailsPopup",
  components: { PositionTree },
  data() {
    let name = (rule, value, callback) => {
      //通讯录,内容不能为空
      let blankSpace = new RegExp("[ ]");
      if (blankSpace.test(value)) {
        callback(new Error("不能含有空格"));
      } else {
        callback();
      }
    };
    let number = (rule, value, callback) => {
      let num = /^1(3|4|5|6|7|8|9)\d{9}$/;
      let n = value.match(num);
      if (value == "" || value == null) {
        callback();
      } else if (n == null) {
        callback(new Error("请输入正确的手机号码!"));
      }
      callback();
    };
    let officeTel = (rule, value, callback) => {
      let officel = /^(0\d{2,3}\-|0\d{2,3})?[1-9]\d{6,7}(\-\d{1,4})?$/;
      let n = value.match(officel);
      if (value == "" || value == null) {
        callback();
      } else if (n == null) {
        callback(new Error("格式不正确!"));
      }
      callback();
    };
    let homeTelProp = (rule, value, callback) => {
      let officel = /^(0\d{2,3}\-|0\d{2,3})?[1-9]\d{6,7}(\-\d{1,4})?$/;
      let num = /^1(3|4|5|6|7|8|9)\d{9}$/;
      let n = value.match(officel);
      let m = value.match(num);
      if (value == "" || value == null) {
        callback();
      } else if (n == null && m == null) {
        callback(new Error("格式不正确!"));
      }
      callback();
    };
    let numberType = (rule, value, callback) => {
      //纯数字,内容可以为空
      var reg = new RegExp("^[0-9]*$");
      if (value == "" || value == null) {
        callback();
      } else {
        if (!reg.test(value)) {
          callback(new Error("请填写纯数字"));
        } else {
          callback();
        }
      }
    };
    return {
      groupingHistory: false,
      title: "", //标题
      contactForm: {
        id: "", //联系人id
        name: "", //姓名
        sex: 0, //性别 默认为0（未知）
        position: "", //职务
        workUnit: "", //工作单位
        mobile: "", //手机号码
        otherTel: "", //备用手机
        temobile: "", //手持终端
        officeTel: "", //办公电话
        homeTel: "", //应急电话
        otherTel2: "", //其它电话
        fax: "", //传真电话
        email: "", //邮箱
        importance: 0, //紧急程度 默认为0（未知）
        commonlyUsed: 0, //常用联系人(大于0即为常用联系人，小于等于0取消常用联系人)
        remark: "", //备注
        officeAddress: "", //办公地址
      }, //表单数据
      rules: {
        name: [
          {
            required: true,
            message: "姓名不能为空",
            validator: name, // 石景山需求添加去除空格校验 lastEditor:xuchuangxing  lastUpdateTime:2020-12-16
            trigger: "blur",
          },
          { max: 100, message: "姓名长度不能超过100个字符" },
        ],
        mobile: [{ required: false, validator: number, trigger: "blur" }],
        otherTel: [{ required: false, validator: number, trigger: "blur" }],
        temobile: [{ required: false, validator: numberType, trigger: "blur" }],
        officeTel: [{ required: false, validator: officeTel, trigger: "blur" }],
        homeTel: [{ required: false, validator: homeTelProp, trigger: "blur" }],
        otherTel2: [
          { required: false, validator: numberType, trigger: "blur" },
        ],
        fax: [{ required: false, validator: officeTel, trigger: "blur" }],
        email: [
          {
            type: "email",
            message: "格式不正确",
            trigger: "blur",
          },
        ],
      }, //验证规则
      groupIds: [], //选中的树分组
      sexRadio: [], //性别选择框
      importanceRadio: [], //紧急程度选择框
      isDialogVisible: false, //是否显示弹窗
      defaultProps: {
        children: "children",
        label: "name",
        plusIcon: true,
      },
      treeData: [], //树形数据
      groupType: "政务联络网", //分组类型
      commonlyUsedIsCheck: false,
      tableData: [],
    };
  },
  props: {
    tabPosition: Number, // phone组件的 tab选择类型
  },

  mounted() {
    this.getTree();
    // this.getPhoneGroupingTree();
    // this.getSmsGroupListTree();
    // this.getFaxGroupingListTree();
    this.getSexData();
    this.getConcatorImportantData();
  },
  methods: {
    //查看变更历史
    changeHistory() {
      this.$api
        .getContactorHistory({ contactorId: this.contactForm.id })
        .then((res) => {
          if (res.errorcode == 0) {
            this.tableData = res.data || [];
            this.groupingHistory = true;
          } else {
            this.$message({
              message: res.msg,
              type: "error",
            });
          }
        });
    },
    //获取所有分组
    getTree(tabPosition, groupId, tabName) {
      console.log(...arguments);
      this.treeData = [];

      let data = {};
      this.$api.groupCollection(data).then((res) => {
        console.log(res);
        this.treeData = res.data;
        // 禅道6294 添加禁用一级分组的勾选 lastEditor:hexinting date:2020-9-24
        this.treeData.forEach((el) => {
          el.disabled = true;
        });
        this.getTreeParentId(res.data, tabName, groupId);

        // 新增时 工作单位默认显示当前选中组名
        if (this.title == "新增联系人") {
          if (groupId > 0) {
            var getTreeName = (arr) => {
              arr.map((v) => {
                if (v.id == groupId) {
                  this.contactForm.workUnit = v.name;
                  return;
                } else {
                  getTreeName(v.children);
                }
              });
            };
            getTreeName(this.treeData);
          } else {
            this.contactForm.workUnit = tabName;
          }
        }
      });
    },

    // 获取树父节点分组
    getTreeParentId(data, tabName, groupId) {
      // console.log(tabName)
      // console.log(`${tabName}分组`)
      let groupName = `${tabName}分组`;
      let tabGroupIds = [];
      let tabId = "";

      for (let item of data) {
        let { name, id } = item;
        tabGroupIds.push({ name, id });
      }
      if (!!tabName) {
        // 获取标签id
        for (let obj of tabGroupIds) {
          if (groupName === obj.name) {
            // console.log(obj.id)
            tabId = obj.id;
          }
        }
      }
      // 树节点勾选
      if (!!groupId || !!tabId) {
        this.groupIds = []; // 重置选中分组id
        console.log("groupId: ", groupId);
        console.log("tabId: ", tabId);
        this.groupIds.push(groupId, tabId);
        // console.log(this.groupIds)
        this.groupIds = [...new Set(this.groupIds)];
      }
    },

    //电话分组树
    getPhoneGroupingTree() {
      let data = {
        displayDefault: false, //是否显示未分组联系人
      };
      this.$api.telephoneGroupingTree(data).then((res) => {
        if (res.errorcode != 0) {
          this.$message({
            message: res.msg,
            type: "error",
          });
          return;
        }
        this.treeData[0].children = res.data;
      });
    },
    //数据渲染
    showData(row) {
      console.log(row);
      this.$nextTick(() => {
        this.contactForm.officeAddress = row.officeAddress;
        this.contactForm.id = row.id;
        this.contactForm.name = row.name;
        this.contactForm.sex = row.sex;
        this.contactForm.position = row.position;
        this.contactForm.workUnit = row.workUnit;
        this.contactForm.mobile = row.mobile;
        this.contactForm.otherTel = row.otherTel;
        this.contactForm.temobile = row.temobile;
        this.contactForm.officeTel = row.officeTel;
        this.contactForm.homeTel = row.homeTel;
        this.contactForm.otherTel2 = row.otherTel2;
        this.contactForm.fax = row.fax;
        this.contactForm.email = row.email;
        this.contactForm.importance = row.importance;
        this.contactForm.commonlyUsed = row.commonlyUsed;
        if (this.contactForm.commonlyUsed > 0) {
          this.commonlyUsedIsCheck = true;
        } else {
          this.commonlyUsedIsCheck = false;
        }
        this.contactForm.remark = row.remark;
        if (row.groupIds != null) {
          this.groupIds = row.groupIds;
          this.$refs.tree.setCheckedKeys(this.groupIds);
        }
      });
    },
    //获取性别数据
    getSexData() {
      let data = {};
      this.$api.concatorSex(data).then((res) => {
        if (res.errorcode != 0) {
          this.$message({
            message: res.msg,
            type: "error",
          });
          return;
        }
        this.sexRadio = res.data;
      });
    },
    //获取紧急程度
    getConcatorImportantData() {
      let data = {};
      this.$api.concatorImportant(data).then((res) => {
        if (res.errorcode != 0) {
          this.$message({
            message: res.msg,
            type: "error",
          });
          return;
        }
        this.importanceRadio = res.data;
      });
    },
    //修改职务
    changePosition() {
      this.$nextTick(() => {
        this.$refs.PositionTree.isShow = true;
      });
    },
    //获得职务名称
    handleNodeClick(position) {
      return (this.contactForm.position = position);
    },
    //关闭弹窗
    closeDialog() {
      //清空表单内容以及校验信息
      this.$nextTick(() => {
        this.$refs["contactForm"].resetFields();
        this.resetGroupTree();
        this.commonlyUsedIsCheck = false;
        this.isDialogVisible = false;
      });
    },
    // 开启弹窗
    openDialog() {
      this.commonlyUsedIsCheck = false;
    },
    //联系人信息提交
    submit(formName) {
      if (this.commonlyUsedIsCheck) {
        this.contactForm.commonlyUsed = 1;
      } else {
        this.contactForm.commonlyUsed = 0;
      }
      //operate	操作类型 0->新增 1-> 更新 2->删除
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.title == "新增联系人") {
            let json = {
              name: this.contactForm.name,
              sex: this.contactForm.sex,
              position: this.contactForm.position,
              workUnit: this.contactForm.workUnit,
              mobile: this.contactForm.mobile,
              otherTel: this.contactForm.otherTel,
              temobile: this.contactForm.temobile,
              officeTel: this.contactForm.officeTel,
              homeTel: this.contactForm.homeTel,
              otherTel2: this.contactForm.otherTel2,
              fax: this.contactForm.fax,
              email: this.contactForm.email,
              importance: this.contactForm.importance,
              commonlyUsed: this.contactForm.commonlyUsed,
              remark: this.contactForm.remark,
              officeAddress: this.contactForm.officeAddress,
            };
            let keys = this.$refs.tree.getCheckedKeys().filter((key) => {
              return key >= 0;
            });
            console.log(keys);
            let data = {
              data: json,
              operate: 0,
              groupId: keys, // 分组id
            };
            this.$confirm("确认保存当前信息?", "提示", {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              type: "warning",
            })
              .then(() => {
                this.$api.updateConcator(data).then((res) => {
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
                  console.log("getContactorList");
                  this.$emit("getContactorList");
                  this.$emit("refreshTable");
                });
              })
              .catch(() => {
                this.$message({
                  type: "info",
                  message: "已取消新增!",
                });
                adjustCurrentPage();
              });
          }
          if (this.title == "修改联系人") {
            let json = {
              id: this.contactForm.id,
              name: this.contactForm.name,
              sex: this.contactForm.sex,
              position: this.contactForm.position,
              workUnit: this.contactForm.workUnit,
              mobile: this.contactForm.mobile,
              otherTel: this.contactForm.otherTel,
              temobile: this.contactForm.temobile,
              officeTel: this.contactForm.officeTel,
              homeTel: this.contactForm.homeTel,
              otherTel2: this.contactForm.otherTel2,
              fax: this.contactForm.fax,
              email: this.contactForm.email,
              importance: this.contactForm.importance,
              commonlyUsed: this.contactForm.commonlyUsed,
              remark: this.contactForm.remark,
              officeAddress: this.contactForm.officeAddress,
            };
            let data = {
              data: json,
              operate: 1,
              groupId: this.$refs.tree.getCheckedKeys(),
            };
            this.$confirm("是否确认保存当前修改?", "提示", {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              type: "warning",
            })
              .then(() => {
                this.$api.updateConcator(data).then((res) => {
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
                  this.$emit("getContactorList");
                });
              })
              .catch(() => {
                this.$message({
                  type: "info",
                  message: "已取消修改!",
                });
              });
          }
        }
      });
    },
    //重置树的选中状态
    resetGroupTree() {
      this.$refs.tree.setCheckedKeys([]);
    },
    //短信分组
    getSmsGroupListTree() {
      let data = {
        displayDefault: false, //是否显示未分组联系人
      };
      this.$api.smsGroupList(data).then((res) => {
        if (res.errorcode != 0) {
          this.$message({
            message: res.msg,
            type: "error",
          });
          return;
        }
        this.treeData[1].children = res.data;
      });
    },
    //获取传真分组
    getFaxGroupingListTree() {
      let data = {
        displayDefault: false,
      };
      this.$api.faxGroupList(data).then((res) => {
        console.log(res);
        if (res.errorcode != 0) {
          this.$message({
            message: res.msg,
            type: "error",
          });
          return;
        }
        // this.treeData[2].children = res.data;
        this.treeData = res.data;
        // this.getTreeParentId(res.data, tabName, groupId)
      });
    },
    //历史记录-短信历史添加到联系人，初始手机号赋值
    setMobile(number) {
      this.contactForm.mobile = number;
    },
    // 新历史记录 - 添加联系人,初始化号码
    setNewNumber(number) {
      if (number.charAt(0) == "1") {
        console.log("手机号码");
        this.contactForm.mobile = number;
        this.contactForm.officeTel = "";
      } else {
        console.log("电话号码");
        this.contactForm.officeTel = number;
        this.contactForm.mobile = "";
      }
    },
    // 新增时点击勾选节点，把节点名赋值给工作单位
    handleClick(obj) {
      if (this.title == "新增联系人") {
        this.contactForm.workUnit = obj.name;
      }
    },
  },
};
</script>

<style scoped>
>>> .el-dialog {
  border-radius: 10px;
}
>>> .el-dialog__header {
  position: relative;
  height: 36px;
  line-height: 36px;
  background: #409eff !important;
  padding: 10px !important;
  border-radius: 10px 10px 0px 0px !important;
}

>>> .el-dialog__title {
  position: absolute;
  left: 20px;
  top: 50%;
  transform: translateY(-50%);
  color: white !important;
}
>>> .el-dialog__headerbtn {
}
>>> .el-dialog__close {
  color: white !important;
}
>>> .el-dialog__body {
  padding: 30px 50px !important;
}
>>> .el-dialog__footer {
  border-top: 1px solid rgba(233, 236, 241, 1);
  padding: 2vh 0px;
  text-align: initial;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
}
>>> .el-container {
  box-sizing: initial !important;
}
>>> .el-aside {
  box-sizing: initial !important;
}
>>> .el-main {
  padding: 0px !important;
}
.selectGroup {
  font-family: MicrosoftYaHei, sans-serif;
  font-weight: 400;
}

.tree {
  background-color: white;
  border: 1px solid rgba(211, 215, 219, 1);
  height: 436px;
  overflow: auto;
}

>>> .el-form-item {
  margin-bottom: 20px;
}

>>> .el-scrollbar__wrap {
  overflow-x: hidden;
  margin: auto !important;
}

.leftDeviation {
  text-align: left;
}
</style>
