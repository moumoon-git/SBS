<!--@author：llp-->
<template>
  <div>
    <el-dialog
      center
      :title="title"
      :visible.sync="isDialogVisible"
      :close-on-click-modal="false"
      @close="closeDialog"
    >
      <el-container>
        <el-aside width="250px">
          <el-scrollbar style="height: 100%">
            <el-row>
              <el-col
                class="selectGroup"
                style="border: 1px solid rgb(211, 215, 219);border-bottom: initial;height: 40px;line-height: 40px;position:relative;"
              >
                <span style="margin-left: 1vw;">选择分组</span>
                <i
                  class="el-icon-time"
                  style="position: absolute;right: 1vw;color:#409EFF;top: 50%;transform: translateY(-50%);cursor: pointer;"
                  @click="changeHistory"
                ></i>
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
                      :filter-node-method="filterNode"
                    ></el-tree>
                  </el-scrollbar>
                </div>
              </el-col>
            </el-row>
            <!-- <el-row>
              <el-col  style="text-align: center;padding-top: 10px"><el-link type="primary" @click="changeHistory">查看变更历史</el-link></el-col>
            </el-row>-->
          </el-scrollbar>
        </el-aside>

        <el-main style="margin-left:30px;">
          <el-scrollbar style="height: 90%">
            <el-row>
              <el-col :span="12">
                <span>姓名：</span>
                <span>{{contactForm.name}}</span>
              </el-col>
              <el-col :span="12">
                <span>办公电话：</span>
                <span>{{contactForm.officeTel}}</span>
              </el-col>
            </el-row>

            <el-row>
              <el-col :span="12">
                <span>性别：</span>
                <span>{{sexRadio.filter(item=>{return item.id==contactForm.sex}).length>0?sexRadio.filter(item=>{return item.id==contactForm.sex})[0].name:''}}</span>
              </el-col>
              <el-col :span="12">
                <span>其他电话：</span>
                <span>{{contactForm.otherTel2}}</span>
              </el-col>
            </el-row>

            <el-row>
              <el-col :span="12">
                <span>单位：</span>
                <span>{{contactForm.workUnit}}</span>
              </el-col>
              <el-col :span="12">
                <span>应急电话：</span>
                <span>{{contactForm.homeTel}}</span>
              </el-col>
            </el-row>

            <el-row>
              <el-col :span="12">
                <span>职位：</span>
                <span>{{contactForm.position}}</span>
              </el-col>
              <el-col :span="12">
                <span>终端号码：</span>
                <span>{{contactForm.temobile}}</span>
              </el-col>
            </el-row>

            <el-row>
              <el-col :span="12">
                <span>手机号码：</span>
                <span>{{contactForm.mobile}}</span>
              </el-col>
              <el-col :span="12">
                <span>电子邮箱：</span>
                <span>{{contactForm.email}}</span>
              </el-col>
            </el-row>

            <el-row>
              <el-col :span="12">
                <span>手机号码2：</span>
                <span>{{contactForm.otherTel}}</span>
              </el-col>
              <!-- <el-col :span="12">
                <span>常用联系人：</span>
                <span>{{contactForm.commonlyUsed>0?'是':'否'}}</span>
              </el-col> -->
            </el-row>

            <el-row>
              <el-col :span="12">
                <span>传真号码：</span>
                <span>{{contactForm.fax}}</span>
              </el-col>
              <el-col :span="12">
                <span>紧急程度：</span>
                <span>{{importanceRadio.filter(item=>{return item.id==contactForm.importance}).length>0?importanceRadio.filter(item=>{return item.id==contactForm.importance})[0].name:''}}</span>
              </el-col>
            </el-row>

            <el-row>
              <el-col :span="12">
                <span>备注：</span>
                <span>{{contactForm.remark}}</span>
              </el-col>
              <el-col :span="12">
                <span>办公地址：</span>
                <span>{{contactForm.officeAddress}}</span>
              </el-col>
            </el-row>
          </el-scrollbar>
          <div style="text-align: right">
            <el-button
              type="primary"
              size="medium"
              @click="copyBusinessCardHandle"
              v-if="changeName == 'IcpSms'"
            >复制名片</el-button>
          </div>
        </el-main>
      </el-container>

      <span
        slot="footer"
        class="dialog-footer"
        v-if="title != '查看联系人'"
        style="display: flex;justify-content: flex-end;"
      >
        <el-button type="primary" @click="submit('contactForm')">保存</el-button>
        <el-button
          type="primary"
          @click="closeDialog"
          style="    background: initial;border-color: rgb(211, 215, 219);color: initial;margin-left: 1vw;margin-right: 2vw;"
        >关闭</el-button>
      </span>
      <el-dialog width="40%" center title="变更 历史" :visible.sync="groupingHistory" append-to-body :close-on-click-modal="false">
        <el-table :data="tableData" border style="width: 100%">
          <el-table-column align="center" prop="editTime" label="更新时间" min-width="70%"></el-table-column>
          <el-table-column align="center" prop="workUnit" label="所在部门" min-width="30%"></el-table-column>
        </el-table>
      </el-dialog>
    </el-dialog>
    <position-tree ref="PositionTree" @handleNodeClick="handleNodeClick"></position-tree>
  </div>
</template>

<script>
import { adjustCurrentPage } from "../../assets/js/common";
import PositionTree from "@/view/integratedCommunication/positionTree";
import { mapGetters } from "vuex";

export default {
  components: { PositionTree },
  data() {
    let number = (rule, value, callback) => {
      let num = /^1(3|4|5|6|7|8|9)\d{9}$/;
      let n = value.match(num);
      if (value == "" || value == null) {
        callback();
      } else if (n == null) {
        callback(new Error("请输入正确的电话号码!"));
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
        remark: "",//备注
        officeAddress: '', //办公地址
      }, //表单数据
      rules: {
        name: [
          { required: true, message: "姓名不能为空", trigger: "blur" },
          { max: 100, message: "姓名长度不能超过100个字符" }
        ],
        mobile: [{ required: false, validator: number, trigger: "blur" }],
        otherTel: [{ required: false, validator: number, trigger: "blur" }],
        temobile: [{ required: false, validator: numberType, trigger: "blur" }],
        officeTel: [{ required: false, validator: officeTel, trigger: "blur" }],
        homeTel: [{ required: false, validator: officeTel, trigger: "blur" }],
        otherTel2: [
          { required: false, validator: numberType, trigger: "blur" }
        ],
        fax: [{ required: false, validator: officeTel, trigger: "blur" }],
        email: [
          {
            type: "email",
            message: "格式不正确",
            trigger: "blur"
          }
        ]
      }, //验证规则
      groupIds: [], //选中的树分组
      sexRadio: [], //性别选择框
      importanceRadio: [], //紧急程度选择框
      isDialogVisible: false, //是否显示弹窗
      defaultProps: {
        children: "children",
        label: "name",
        plusIcon: true
      },
      treeData: [], //树形数据
      groupType: "政务联络网", //分组类型
      commonlyUsedIsCheck: false,
      tableData: [],
    };
  },
  props: {
    tabPosition: Number // phone组件的 tab选择类型
  },

  mounted() {
    this.getTree();
    // this.getPhoneGroupingTree();
    // this.getSmsGroupListTree();
    // this.getFaxGroupingListTree();
    this.getSexData();
    this.getConcatorImportantData();
  },
  computed: {
    ...mapGetters({
      changeName: "getIcpName", //获取当前更换页标记
    }),
    copyBusinessCard:{
      get(){
          return this.$store.getters.getCopyBusinessCard;
      },
      set(val) {
        return this.$store.commit("setCopyBusinessCard",val)
      }

    },
  },
  methods: {
    //查看变更历史
    changeHistory() {
      this.$api
        .getContactorHistory({ contactorId: this.contactForm.id })
        .then(res => {
          if (res.errorcode == 0) {
            this.tableData = res.data || [];
            this.groupingHistory = true;
          } else {
            this.$message({
              message: res.msg,
              type: "error"
            });
          }
        });
    },
    //获取所有分组
    getTree(tabPosition, groupId, tabName) {
      console.log(...arguments);
      this.treeData = [];

      let data = {};
      this.$api.groupCollection(data).then(res => {
        console.log(res);

        this.treeData = res.data;

        this.getTreeParentId(res.data, tabName, groupId);
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
      // console.log(tabGroupIds)
      if (!!tabName) {
        // 获取标签id
        for (let obj of tabGroupIds) {
          if (groupName === obj.name) {
            tabId = obj.id;
            // this.treeData = [obj]
          }
        }
      }
      // 树节点勾选
      if (!!groupId || !!tabId) {
        // this.groupIds = []; // 重置选中分组id
        // this.groupIds.push(groupId, tabId);
        // this.groupIds = [...new Set(this.groupIds)];
      }
    },

    //电话分组树
    getPhoneGroupingTree() {
      let data = {
        displayDefault: false //是否显示未分组联系人
      };
      this.$api.telephoneGroupingTree(data).then(res => {
        if (res.errorcode != 0) {
          this.$message({
            message: res.msg,
            type: "error"
          });
          return;
        }
        this.treeData[0].children = res.data;
      });
    },
    //数据渲染
    showData(row) {
      this.$nextTick(() => {
        // console.log("showData row", row);
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
        this.contactForm.officeAddress = row.officeAddress;
        if (this.contactForm.commonlyUsed > 0) {
          this.commonlyUsedIsCheck = true;
        } else {
          this.commonlyUsedIsCheck = false;
        }
        this.contactForm.remark = row.remark;
        if (row.groupIds) {
          // this.groupIds = row.groupIds;
          // this.$refs.tree.setCheckedKeys(this.groupIds);
          let self = this;
          let treeData = [];
          let tree = this.$refs.tree;
          setTimeout(() => {
            tree.filter(row.groupIds);
            tree.setCheckedKeys(row.groupIds);
          }, 800);
        }
      });
    },
    filterNode(value, data) {
      if (!value) return true;
      data.disabled = true;
      return value.indexOf(data.id) !== -1;
    },
    //获取性别数据
    getSexData() {
      let data = {};
      this.$api.concatorSex(data).then(res => {
        if (res.errorcode != 0) {
          this.$message({
            message: res.msg,
            type: "error"
          });
          return;
        }
        this.sexRadio = res.data;
      });
    },
    //获取紧急程度
    getConcatorImportantData() {
      let data = {};
      this.$api.concatorImportant(data).then(res => {
        if (res.errorcode != 0) {
          this.$message({
            message: res.msg,
            type: "error"
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
        //   this.$refs['contactForm'].resetFields();
        this.resetGroupTree();
        this.isDialogVisible = false;
      });
    },
    //联系人信息提交
    submit(formName) {
      if (this.commonlyUsedIsCheck) {
        this.contactForm.commonlyUsed = 1;
      } else {
        this.contactForm.commonlyUsed = 0;
      }
      //operate	操作类型 0->新增 1-> 更新 2->删除
      this.$refs[formName].validate(valid => {
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
              remark: this.contactForm.remark
            };
            let keys = this.$refs.tree.getCheckedKeys().filter(key => {
              return key >= 0;
            });
            console.log(keys);
            let data = {
              data: json,
              operate: 0,
              groupId: keys // 分组id
            };
            this.$confirm("确认保存当前信息?", "提示", {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              type: "warning"
            })
              .then(() => {
                this.$api.updateConcator(data).then(res => {
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
                  console.log("getContactorList");
                  this.$emit("getContactorList");
                  this.$emit("refreshTable");
                });
              })
              .catch(() => {
                this.$message({
                  type: "info",
                  message: "已取消新增!"
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
              remark: this.contactForm.remark
            };
            let data = {
              data: json,
              operate: 1,
              groupId: this.$refs.tree.getCheckedKeys()
            };
            this.$confirm("是否确认保存当前修改?", "提示", {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              type: "warning"
            })
              .then(() => {
                this.$api.updateConcator(data).then(res => {
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
                  this.$emit("getContactorList");
                });
              })
              .catch(() => {
                this.$message({
                  type: "info",
                  message: "已取消修改!"
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
        displayDefault: false //是否显示未分组联系人
      };
      this.$api.smsGroupList(data).then(res => {
        if (res.errorcode != 0) {
          this.$message({
            message: res.msg,
            type: "error"
          });
          return;
        }
        this.treeData[1].children = res.data;
      });
    },
    //获取传真分组
    getFaxGroupingListTree() {
      let data = {
        displayDefault: false
      };
      this.$api.faxGroupList(data).then(res => {
        console.log(res);
        if (res.errorcode != 0) {
          this.$message({
            message: res.msg,
            type: "error"
          });
          return;
        }
        // this.treeData[2].children = res.data;
        // this.treeData = res.data;
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
    copyBusinessCardHandle() {
      if (
        this.copyBusinessCard.indexOf(
          (this.contactForm.name ? "姓名：" + this.contactForm.name : "") +
            (
              (this.sexRadio.filter(item => {
                return item.id == this.contactForm.sex;
              }).length > 0
                ? "；性别：" + this.sexRadio.filter(item => {
                    return item.id == this.contactForm.sex;
                  })[0].name
                : "")) +
            (this.contactForm.workUnit
              ? "；单位：" + this.contactForm.workUnit
              : "") +
            (this.contactForm.position
              ? "；职位：" + this.contactForm.position
              : "") +
            (this.contactForm.mobile
              ? "；手机号码：" + this.contactForm.mobile
              : "") +
            (this.contactForm.officeTel2
              ? "；手机号码2：" + this.contactForm.otherTel2
              : "") +
            (this.contactForm.officeTel
              ? "；其他电话：" + this.contactForm.otherTel
              : "") +
            (this.contactForm.officeTel
              ? "；办公电话：" + this.contactForm.officeTel
              : "") +
            (this.contactForm.homeTel
              ? "；应急电话：" + this.contactForm.homeTel
              : "") +
            (this.contactForm.temobile
              ? "；终端号码：" + this.contactForm.temobile
              : "") +
            (this.contactForm.fax ? "；传真号码：" + this.contactForm.fax : "") +
            "    "
        ) == -1
      ) {
        this.copyBusinessCard +=
          (this.contactForm.name ? "姓名：" + this.contactForm.name : "") +
          (
            (this.sexRadio.filter(item => {
              return item.id == this.contactForm.sex;
            }).length > 0
              ? "；性别：" + this.sexRadio.filter(item => {
                  return item.id == this.contactForm.sex;
                })[0].name
              : "")) +
          (this.contactForm.workUnit
            ? "；单位：" + this.contactForm.workUnit
            : "") +
          (this.contactForm.position
            ? "；职位：" + this.contactForm.position
            : "") +
          (this.contactForm.mobile
            ? "；手机号码：" + this.contactForm.mobile
            : "") +
          (this.contactForm.officeTel2
            ? "；手机号码2：" + this.contactForm.officeTel2
            : "") +
          (this.contactForm.otherTel2
            ? "；其他电话：" + this.contactForm.otherTel2
            : "") +
          (this.contactForm.officeTel
            ? "；办公电话：" + this.contactForm.officeTel
            : "") +
          (this.contactForm.homeTel
            ? "；应急电话：" + this.contactForm.homeTel
            : "") +
          (this.contactForm.temobile
            ? "；终端号码：" + this.contactForm.temobile
            : "") +
          (this.contactForm.fax ? "；传真号码：" + this.contactForm.fax : "") +
          "    ";

        this.$store.commit("setCopyBusinessCard", this.copyBusinessCard);
      }
    }
  }
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
  height: 400px;
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
>>> .el-main .el-col {
  margin: 10px 0px;
}
>>> .el-main .el-col span {
  font-size: 16px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: rgba(85, 85, 85, 1);
}
</style>
