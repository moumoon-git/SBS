<template>
  <div>
    <el-dialog title="单位信息管理" :visible.sync="dialogVisible" width="695px" :close-on-click-modal="false">
      <!-- 通讯录 -->
      <add-contact
        ref="addContact"
        v-if="addContactVisible"
        @changeDialog="addContactVisible = false"
      ></add-contact>
      <!--选择分组-->
      <el-dialog
        width="400px"
        :visible.sync="innerVisible"
        append-to-body
        :close-on-click-modal="false"
      >
        <el-row>
          <el-col :span="20">
            <el-input clearable placeholder="输入关键字搜索" v-model="filterText"></el-input>
          </el-col>
          <el-col :span="4">
            <el-button
              type="primary"
              style="width:100%;padding-right:0;padding-left:0;"
              @click="filterTree"
            >搜索
            </el-button>
          </el-col>
        </el-row>
        <el-scrollbar>
          <el-tree
            style="height: 300px;"
            class="filter-tree"
            :data="treeData"
            :accordion="true"
            :props="defaultProps"
            :filter-node-method="filterNode"
            :default-expand-all="false"
            @node-click="handleNodeClick"
            ref="tree"
            node-key="id"
            highlight-current
          ></el-tree>
        </el-scrollbar>
        <div slot="footer" style="text-align: center">
          <el-button size="mini" @click="innerVisible = false">取消</el-button>
          <el-button size="mini" type="primary" @click="confirmSelect">确认</el-button>
        </div>
      </el-dialog>
      <el-form :model="formData" :rules="IsYangZhouProject ? yangzhouRules : rules" ref="myForm">
        <el-row>
          <el-col :span="12">
            <el-form-item label="上级单位:" prop="parentUnit">
              <el-input style="width: 70%" v-model="formData.parentUnit" disabled>
                <span slot="suffix" class="input-text-suffix" @click="innerVisible = true">选择</span>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="单位名称:" prop="info.name">
              <el-input style="width: 70%" v-model="formData.info.name"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :span="24">
          <el-form-item label="单位地址:">
            <el-input style="width: 80%" v-model="formData.info.officeAddress"></el-input>
          </el-form-item>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="办公电话:" prop="info.officeTel">
              <el-input style="width: 70%" v-model="formData.info.officeTel"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="传真号码:" prop="info.fax">
              <el-input style="width: 70%" v-model="formData.info.fax"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="联系电话:" prop="info.mobile">
              <el-input style="width: 70%" v-model="formData.info.mobile"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="电子邮箱:" prop="info.email">
              <el-input style="width: 70%" v-model="formData.info.email"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-form-item label="单位负责人:">
            <el-button type="primary" @click="addPrincipal">新增</el-button>
            <el-button type="primary" @click="selectPrincipal">选择</el-button>
          </el-form-item>
        </el-row>
        <div class="contactor-box">
          <div class="contactor-wrap" v-for="(item, index) in formData.principals">
            <div class="control-wrap">
              <img class="del-btn" :src="require('@/assets/icpImg/editGroupDel1.png')" @click="deletePrincipal(index)">
              <img class="pre-btn" :class="index === 0?'disable':'active'"
                   :src="require(index === 0?'@/assets/icpImg/editGroupPre1.png':'@/assets/icpImg/editGroupPre2.png')"
                   @click="upPrincipal(index)">
              <img class="next-btn" :class="index === formData.principals.length - 1?'disable':'active'"
                   :src="require(index === formData.principals.length - 1?'@/assets/icpImg/editGroupNext1.png':'@/assets/icpImg/editGroupNext2.png')"
                   @click="downPrincipal(index)">
            </div>
            <el-row>
              <el-col :span="11">
                <el-form-item label="姓名:">
                  <el-input style="width: 70%" v-model="item.name"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="11">
                <el-form-item label="职务:">
                  <el-input style="width: 70%" v-model="item.position"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="11">
                <el-form-item label="办公电话:" :prop="`principals[${index}].officeTel`">
                  <el-input style="width: 57%" v-model="item.officeTel"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="11">
                <el-form-item label="手机:" :prop="`principals[${index}].mobile`">
                  <el-input style="width: 70%" v-model="item.mobile"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="22">
                <el-form-item label="分工:">
                  <el-input style="width: 70%" v-model="item.remark"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </div>
        </div>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogVisible=false">取消</el-button>
        <el-button type="primary" @click="save('myForm')">保存</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import CryptoJS from 'crypto-js'
import addContact from "./icpPhone/icpPhonePage/smsStep/addContact/AddContact"
import bus from "@/yz_components/common/js/eventBus";
import REGULAR from "@/assets/js/regular"

export default {
  name: "editGroupDetails",
  //node,data是当前节点，treeDataProp是分组数据
  props: ["visibleProp", "node", "data", "treeDataProp", "topPosition"],
  components: {
    addContact,
  },
  data() {
    return {
      IsYangZhouProject: window.g.IsYangZhouProject, // 扬州项目
      innerVisible: false,
      filterText: "",
      defaultProps: {
        children: "children",
        label: "name"
      },
      treeData: [],
      currentData: {},
      selectedData: {},

      addContactVisible: false,
      dialogVisible: true,
      formData: {
        parentUnit: this.node.parent.data.name,
        parentId: this.node.parent.data.id?this.node.parent.data.id:0,
        info: {
          id: null,
          email: '',
          fax: '',
          importance: '',
          mobile: '',
          name: this.data.name,
          officeTel: '',
          officeAddress: '',
          workUnit: ''
        },
        principals: [
          // {
          //   name: "负责人1",
          //   officeTel: "办公电话",
          //   mobile: "手机",
          //   position: "职务",
          //   workUnit: "单位名称",
          //   remark: "分工",
          //   infoOrder: 1
          // },
        ]
      },
      rules: {
        parentUnit: [
          {required: true, message: ' ', trigger: 'blur'}
        ],
        "info.name": [
          {required: true, message: '单位名称不能为空', trigger: 'blur'}
        ],
        "info.mobile": [
          {validator: REGULAR.phoneReg, trigger: 'blur'},
          {required: true, message: '联系电话不能为空', trigger: 'blur'}
        ],
        "info.officeTel": [
          {validator: REGULAR.fixedTelephone, trigger: 'blur'}
        ],
        "info.fax": [
          {validator: REGULAR.fixedTelephone, trigger: 'blur'}
        ],
        "info.email": [
          {validator: REGULAR.emailCheck, trigger: 'blur'}
        ],
      },
      // qinjiaqi 扬州联系电话格式要用扬州单独的 bug10323
      yangzhouRules: {
        parentUnit: [
          {required: true, message: ' ', trigger: 'blur'}
        ],
        "info.name": [
          {required: true, message: '单位名称不能为空', trigger: 'blur'}
        ],
        "info.mobile": [
          {validator: REGULAR.yangzhouTelephone, trigger: 'blur'},
          {required: true, message: '联系电话不能为空', trigger: 'blur'}
        ],
        "info.officeTel": [
          {validator: REGULAR.fixedTelephone, trigger: 'blur'}
        ],
        "info.fax": [
          {validator: REGULAR.fixedTelephone, trigger: 'blur'}
        ],
        "info.email": [
          {validator: REGULAR.emailCheck, trigger: 'blur'}
        ],
      },

      code: "",
      top: "",
    }
  },
  created() {
    switch (this.topPosition){
      case 1:
        this.code = "phone";
        this.top = "政务联络网";
        break;
      case 5:
        this.code = "gliaison";
        this.top = "基层联络网";
        break;
      case 6:
        this.code = "dutyGroup";
        this.top = "备勤联络网";
        break;
      case 7:
        this.code = "resource";
        this.top = "资源联络网";
        break;
      case 10:
        this.code = "phoneQuick";
        this.top = "电话快捷组";
        break;
    }
    if(!this.node.parent.data.name){
      this.formData.parentUnit = this.top;
    }
    this.treeData = JSON.parse(JSON.stringify(this.treeDataProp))
    this.treeData = [{
      id: 0,
      name: this.top,
      parentId: 0,
      children: this.treeData,
    }]
    this.$api.getGroupInfo({
      groupId: this.data.id,
    }).then(res => {
      console.log(res)
      if (res.data.principals) {
        for (let item of res.data.principals) {
          let temp = {
            id: item.id,
            name: item.name,
            officeTel: item.officeTel,
            mobile: item.mobile,
            position: item.position,
            workUnit: item.workUnit,
            remark: item.remark,
            infoOrder: 1,
          }
          this.formData.principals.push(temp)
        }
      }
      if (res.data.info) {
        let temp = {
          id: res.data.info.id,
          email: res.data.info.email,
          fax: res.data.info.fax,
          importance: res.data.info.importance,
          mobile: (res.data.info.mobile.length <= 11 ? res.data.info.mobile : this.decrypt(res.data.info.mobile)),
          name: res.data.info.name,
          officeTel: res.data.info.officeTel,
          officeAddress: res.data.info.officeAddress,
          workUnit: res.data.info.workUnit,
        }
        this.formData.info = temp;
      }
    })
  },
  mounted() {
    bus.$on("getPrincipals", chooseList => {
      console.log("GET!!!", chooseList)
      for (let item of chooseList) {
        let existed = false
        for (let item2 of this.formData.principals) {
          if (item2.id && item2.id === item.id) {
            existed = true;
            break;
          }
        }
        if (!existed) {
          let temp = {
            id: item.id,
            name: item.name,
            officeTel: item.officeTel,
            mobile: item.mobile,
            position: item.position,
            workUnit: item.workUnit,
            remark: item.remark,
            infoOrder: 1,
          }
          this.formData.principals.push(temp);
          this.rules[`principals[${this.formData.principals.length - 1}].mobile`] = this.rules["info.mobile"];
          this.rules[`principals[${this.formData.principals.length - 1}].officeTel`] = this.rules["info.officeTel"];
        }
      }
    })
  },
  beforeDestroy(){
    bus.$off("getPrincipals");
  },
  methods: {
     // qinjiaqi ECB解密
     decrypt(word) {
      let key = CryptoJS.enc.Utf8.parse('abcdefgabcdefg12');
      let decrypt = CryptoJS.AES.decrypt(word, key, {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7
      });
      return decrypt.toString(CryptoJS.enc.Utf8);
    },
    //新增，删除，上移，下移，选择联系人
    addPrincipal() {
      console.log("regular", REGULAR)
      this.formData.principals.push(
        {
          name: "",
          officeTel: "",
          mobile: "",
          position: "",
          workUnit: "",
          remark: "",
          infoOrder: 1,
        }
      );
      this.rules[`principals[${this.formData.principals.length - 1}].mobile`] = this.rules["info.mobile"];
      this.rules[`principals[${this.formData.principals.length - 1}].officeTel`] = this.rules["info.officeTel"];
    },
    deletePrincipal(index) {
      this.formData.principals.splice(index, 1);
      delete this.rules[`principals[${this.formData.principals.length}].mobile`];
      delete this.rules[`principals[${this.formData.principals.length}].officeTel`];
    },
    upPrincipal(index) {
      let temp = this.formData.principals[index];
      this.formData.principals[index] = this.formData.principals[index - 1];
      this.formData.principals[index - 1] = temp;
      this.$forceUpdate()
    },
    downPrincipal(index) {
      let temp = this.formData.principals[index];
      this.formData.principals[index] = this.formData.principals[index + 1];
      this.formData.principals[index + 1] = temp;
      this.$forceUpdate()
    },
    selectPrincipal() {
      this.addContactVisible = true;
      this.$nextTick(() => {
        this.$refs.addContact.getDataList('getPrincipals', this.smsMember);
      });
    },
    /**
     * @lastEditor hexinting
     * @lastDate 2020-01-18
     * @description 保存退出
     */
    save(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (!this.formData.info.id) {
            delete this.formData.info.id;
          }
          this.$api
            .updateGroup({
              code: this.code,
              id: this.data.id,
              name: this.formData.info.name,
              operate: 1,
              pid: this.formData.parentId,
              info: this.formData.info,
              principals: this.formData.principals,
            })
            .then((res) => {
              if (res.errorcode == "0") {
                this.$message({
                  message: "添加成功!",
                  // type: "danger",
                });
                this.$emit("refresh");
                this.dialogVisible = false;
              } else {
                this.$message({
                  message: res.msg,
                  // type: "danger",
                });
              }
            });
        }
      });
    },
    //选择分组的方法
    filterNode(value, data) {
      if (!value) return true;
      return data.name.indexOf(value) != -1;
    },
    filterTree() {
      this.$refs.tree.filter(this.filterText);
    },
    handleNodeClick(data, node) {
      console.log(data, node)
      this.currentData = data;
    },
    confirmSelect() {
      this.selectedData = this.currentData;
      this.innerVisible = false;

      this.formData.parentUnit = this.selectedData.name;
      this.formData.parentId = this.selectedData.id;
    }
  },
  watch: {
    dialogVisible: {
      handler(newValue) {
        this.$emit("update:visibleProp", newValue);
      },
    },
  },
}
</script>

<style scoped>
.contactor-box {
  width: 100%;
  max-height: 440px;
  overflow: auto;
}

.input-text-suffix {
  color: #1fa1ff;
  cursor: pointer;
}

.contactor-wrap {
  width: 468px;
  border: 1px solid RGBA(218, 231, 248, 1);
  padding: 14px 14px 0;
  position: relative;
  margin: 0 auto 14px;
}

.control-wrap {
  position: absolute;
  top: 35%;
  right: 5%;
  z-index: 999;
}

.del-btn {
  display: block;
  margin-bottom: 6px;
  background: url("../../assets/icpImg/editGroupDel1.png");
}

.pre-btn {
  display: block;
  margin-bottom: 6px;
}

.next-btn {
  display: block;
}

.del-btn:hover {
  content: url("../../assets/icpImg/editGroupDel2.png");
}

.pre-btn.active:hover {
  content: url("../../assets/icpImg/editGroupPre3.png");
}

.next-btn.active:hover {
  content: url("../../assets/icpImg/editGroupNext3.png");
}

.pre-btn.disable {
  pointer-events: none;
}

.next-btn.disable {
  pointer-events: none;
}

.el-tree--highlight-current
>>> .el-tree-node.is-current
> .el-tree-node__content {
  background-color: #c0c0c0;
}
</style>
