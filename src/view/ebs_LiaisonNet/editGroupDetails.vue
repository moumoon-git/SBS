<!--
    * @description 编辑以及查看单位信息
    * @author yangqingdong
    * @lastEditors yangqingdong
    * @lastEditTime 2020/9/17 16:06
    -->
<template>
  <div>
    <!-- 
        @editorName: qinjiaqi
        @editorTime: 2020-10-19 9:52:41
        @description: 弹出框默认可点击区域外关闭，故将:close-on-click-modal设为"false"
    -->
    <el-dialog
      :title="title"
      :visible.sync="dialogVisible"
      width="695px"
      :close-on-click-modal="false"
    >
      <!-- 上级分组 -->
      <superior-grouping
        ref="mychild"
        @treeChild="treeChild"
      ></superior-grouping>
      <!--选择联系人-->
      <person-search
        ref="personSearch"
        :title="dialogTitle"
        @childByValue="getPeople"
      ></person-search>
      <!--表格-->
      <el-form :model="formData" :rules="rules" ref="myForm">
        <el-row>
          <el-col :span="12">
            <el-form-item label="上级单位:" prop="parentUnit">
              <el-input
                style="width: 70%"
                v-model="formData.parentUnit"
                disabled
              >
                <span
                  slot="suffix"
                  class="input-text-suffix"
                  @click="onSelectTree"
                  v-if="title !== '联系人分组查看'"
                  >选择</span
                >
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="单位名称:" prop="info.name">
              <el-input
                style="width: 70%"
                v-model="formData.info.name"
                :disabled="title === '联系人分组查看'"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :span="24">
          <el-form-item label="单位地址:">
            <el-input
              style="width: 80%"
              v-model="formData.info.officeAddress"
              :disabled="title === '联系人分组查看'"
            ></el-input>
          </el-form-item>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="办公电话:" prop="info.officeTel">
              <el-input
                style="width: 70%"
                v-model="formData.info.officeTel"
                :disabled="title === '联系人分组查看'"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="传真号码:" prop="info.fax">
              <el-input
                style="width: 70%"
                v-model="formData.info.fax"
                :disabled="title === '联系人分组查看'"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="联系电话:" prop="info.mobile">
              <el-input
                style="width: 70%"
                v-model.number="formData.info.mobile"
                :disabled="title === '联系人分组查看'"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="电子邮箱:" prop="info.email">
              <el-input
                style="width: 70%"
                v-model="formData.info.email"
                :disabled="title === '联系人分组查看'"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-form-item label="单位负责人:">
            <el-button
              type="primary"
              @click="addPrincipal"
              v-if="title !== '联系人分组查看'"
              >新增</el-button
            >
            <el-button
              type="primary"
              @click="addPeople"
              v-if="title !== '联系人分组查看'"
              >选择</el-button
            >
          </el-form-item>
        </el-row>
        <div class="contactor-box">
          <div
            class="contactor-wrap"
            v-for="(item, index) in formData.principals"
            :key="index"
          >
            <div class="control-wrap" v-if="title !== '联系人分组查看'">
              <img
                class="del-btn"
                :src="require('../../assets/img/editGroupDel1.png')"
                @click="deletePrincipal(index)"
              />
              <img
                class="pre-btn"
                :class="index === 0 ? 'disable' : 'active'"
                :src="
                  require(index === 0
                    ? '../../assets/img/editGroupPre1.png'
                    : '../../assets/img/editGroupPre2.png')
                "
                @click="upPrincipal(index)"
              />
              <img
                class="next-btn"
                :class="
                  index === formData.principals.length - 1
                    ? 'disable'
                    : 'active'
                "
                :src="
                  require(index === formData.principals.length - 1
                    ? '../../assets/img/editGroupNext1.png'
                    : '../../assets/img/editGroupNext2.png')
                "
                @click="downPrincipal(index)"
              />
            </div>
            <el-row>
              <el-col :span="11">
                <el-form-item label="姓名:">
                  <el-input
                    style="width: 70%"
                    v-model="item.name"
                    :disabled="title === '联系人分组查看'"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="11">
                <el-form-item label="职务:">
                  <el-input
                    style="width: 70%"
                    v-model="item.position"
                    :disabled="title === '联系人分组查看'"
                  ></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="11">
                <el-form-item
                  label="办公:"
                  :prop="`principals[${index}].officeTel`"
                >
                  <el-input
                    style="width: 70%"
                    v-model="item.officeTel"
                    :disabled="title === '联系人分组查看'"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="11">
                <el-form-item
                  label="手机:"
                  :prop="`principals[${index}].mobile`"
                >
                  <el-input
                    style="width: 70%"
                    v-model.number="item.mobile"
                    :disabled="title === '联系人分组查看'"
                  ></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="22">
                <el-form-item label="分管:">
                  <el-input
                    style="width: 70%"
                    v-model="item.remark"
                    :disabled="title === '联系人分组查看'"
                  ></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </div>
        </div>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button
          type="primary"
          @click="dialogVisible = false"
          v-if="title !== '联系人分组查看'"
          >取消</el-button
        >
        <el-button
          type="primary"
          @click="save('myForm')"
          v-if="title !== '联系人分组查看'"
          >保存</el-button
        >
        <el-button type="primary" @click="dialogVisible = false" v-else
          >确认</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import SuperiorGrouping from "../../components/SuperiorGrouping";
import PersonSearch from "../Organization/Search";
import REGULAR from "../../assets/js/regular";

export default {
  name: "editGroupDetails",

  /**
   @data = {
    treeName: Name,
    treeID: ID,
    parentID: parentID,
    parentName: parentName
  }
   */
  props: ["visibleProp", "data", "title"],

  components: {
    "superior-grouping": SuperiorGrouping,
    "person-search": PersonSearch,
  },
  data() {
    return {
      dialogVisible: true,
      formData: {
        parentUnit: this.data.parentName,
        parentID: this.data.parentID,
        info: {
          name: this.data.treeName,
          officeAddress: "",
          officeTel: "",
          fax: "",
          mobile: "",
          email: "",
          importance: "",
          workUnit: "",
        },
        principals: [
          // {
          //   name: "",
          //   officeTel: "",
          //   mobile: "",
          //   position: "",
          //   workUnit: "",
          //   remark: "",
          //   infoOrder: "",
          // },
        ],
      },
      rules: {
        parentUnit: [{ required: true, message: " ", trigger: "blur" }],
        "info.name": [{ required: true, message: "单位名称不能为空", trigger: "blur" }],
        "info.mobile": [
          {  validator: REGULAR.phoneReg, trigger: "blur" },
          {  required: true, message: "联系电话不能为空", trigger: "blur" }
        ],
        "info.officeTel": [
          { validator: REGULAR.fixedTelephone, trigger: "blur" },
        ],
        "info.fax": [{ validator: REGULAR.fixedTelephone, trigger: "blur" }],
        "info.email": [{ validator: REGULAR.emailCheck, trigger: "blur" }],
      },

      dialogTitle: "",
    };
  },
  created() {
    //创建时获取分组信息
    if (this.title !== "联系人分组新增") {
      let URL, data;

      data = {
        id: this.data.treeID,
      };
      URL = "emergency/preparation/contactorGroup/info";

      let CallbackReload = this;
      this.$http(URL, data, CallbackReload).then((res) => {
        console.log(res);
        if (res.data.principals) {
          this.formData.principals = res.data.principals;
        }
        if (res.data.info) {
          this.formData.info = res.data.info;
        }
      });
    }
  },
  mounted() {},
  methods: {
    addPrincipal() {
      console.log("regular", REGULAR);
      this.formData.principals.push({
        name: "",
        officeTel: "",
        mobile: "",
        position: "",
        workUnit: "",
        remark: "",
        infoOrder: "",
      });
      this.rules[
        `principals[${this.formData.principals.length - 1}].mobile`
      ] = this.rules["info.mobile"];
      this.rules[
        `principals[${this.formData.principals.length - 1}].officeTel`
      ] = this.rules["info.officeTel"];
    },
    deletePrincipal(index) {
      this.formData.principals.splice(index, 1);
      delete this.rules[
        `principals[${this.formData.principals.length}].mobile`
      ];
      delete this.rules[
        `principals[${this.formData.principals.length}].officeTel`
      ];
    },
    upPrincipal(index) {
      let temp = this.formData.principals[index];
      this.formData.principals[index] = this.formData.principals[index - 1];
      this.formData.principals[index - 1] = temp;
      this.$forceUpdate();
    },
    downPrincipal(index) {
      let temp = this.formData.principals[index];
      this.formData.principals[index] = this.formData.principals[index + 1];
      this.formData.principals[index + 1] = temp;
      this.$forceUpdate();
    },
    onSelectTree() {
      //选择上级分组
      let URL, data;

      data = {
        type: "phone",
        id: this.data.treeID,
        menuId: this.$store.state.menu.menuID,
      };
      URL = "/emergency/preparation/contactorGroup/getAllGroup";

      let CallbackReload = this;
      this.$http(URL, data, CallbackReload).then((res) => {
        console.log(res);
        let data = [res.data];
        this.$refs.mychild.openModal(
          data,
          this.data.parentID,
          this.data.parentName
        );
      });
    },
    treeChild(data) {
      //获取上级分组组件选择的数据
      this.formData.parentUnit = data.treeName;
      this.formData.parentID = data.treeID;
    },
    save(formName) {
      // if (!this.formData.info.name) {
      //   return;
      // }
      this.$refs[formName].validate((valid) => {
        if (!valid) {
          return;
        }
      });

      let URL, data;

      if (this.title === "联系人分组新增") {
        data = {
          type: "phone",
          data: {
            name: this.formData.info.name,
            pid: this.formData.parentID,
          },
          principals: this.formData.principals,
          info: this.formData.info,
        };
        URL = "/emergency/preparation/contactorGroup/add";
      } else {
        data = {
          type: "phone",
          data: {
            id: this.data.treeID,
            name: this.formData.info.name,
            pid: this.formData.parentID,
          },
          principals: this.formData.principals,
          info: this.formData.info,
        };
        URL = "/emergency/preparation/contactorGroup/update";
      }

      let CallbackReload = this;
      this.$refs[formName].validate((valid) => {
        if (!valid) {
          this.$message({
            message: "请输入正确的数据格式",
            type: "error",
          });
          return;
        }
        this.$http(URL, data, CallbackReload).then((res) => {
          console.log(res);
          console.log("输入格式不正确");
          if (res.errorcode === 0) {
            this.$message({
              message:
                CallbackReload.title === "联系人分组新增"
                  ? "新增成功"
                  : "修改成功",
              type: "success",
            });
            let data = {
              treeID: res.data.id,
              treeName: res.data.name,
              parentID: this.formData.parentID,
              parentName: this.formData.parentUnit,
            };
            CallbackReload.$emit("childmethod", data);
            CallbackReload.dialogVisible = false;
          }
        });
      });
    },
    addPeople() {
      //显示添加联系人弹框
      this.dialogTitle = "联系人查找";
      this.$refs.personSearch.childFn();
      this.$refs.personSearch.visible = true;
    },
    getPeople(chooseList) {
      //获取选择联系人组件选择的数据
      for (let temp of chooseList) {
        let item = JSON.parse(JSON.stringify(temp));
        let existed = false;
        for (let item2 of this.formData.principals) {
          //筛选重复数据
          if (item2.id && item2.id === item.id) {
            existed = true;
            break;
          }
        }
        if (!existed) {
          delete item.importance;
          delete item.sex;
          this.formData.principals.push(item);
          this.rules[
            `principals[${this.formData.principals.length - 1}].mobile`
          ] = this.rules["info.mobile"];
          this.rules[
            `principals[${this.formData.principals.length - 1}].officeTel`
          ] = this.rules["info.officeTel"];
        }
      }
    },
  },
  watch: {
    dialogVisible: {
      handler(newValue) {
        this.$emit("update:visibleProp", newValue);
      },
    },
  },
};
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
  background: url("../../assets/img/editGroupDel1.png");
}

.pre-btn {
  display: block;
  margin-bottom: 6px;
}

.next-btn {
  display: block;
}

.del-btn:hover {
  content: url("../../assets/img/editGroupDel2.png");
}

.pre-btn.active:hover {
  content: url("../../assets/img/editGroupPre3.png");
}

.next-btn.active:hover {
  content: url("../../assets/img/editGroupNext3.png");
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
