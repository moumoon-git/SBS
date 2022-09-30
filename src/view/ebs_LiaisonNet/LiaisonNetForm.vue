<template>
  <el-dialog
    :title="title"
    :visible.sync="Modal"
    width="900px"
    center
    @close="closeDialog"
    top="15vh"
    :close-on-click-modal="false"
    append-to-body
  >
    <el-form
      label-width="100px"
      :model="ruleForm"
      :rules="rules"
      ref="ruleForm"
      @submit.native.prevent
    >
      <!-- author: qinjiaqi -->
      <!-- description: 这一行是头像 -->
      <el-row :gutter="30">
        <el-col :span="24" v-if="!isDisabled">
          <el-form-item style="text-align: center">
            <div class="head-class">
              <img
                :src="
                  ruleForm.picture == ''
                    ? imageUrl
                    : this.$window.g.ApiUrl + ruleForm.picture
                "
                alt=""
              />
              <div class="head-class-background"></div>
            </div>
          </el-form-item>
        </el-col>
        <el-col :span="24" v-if="isDisabled">
          <el-form-item style="text-align: center">
            <div class="upload-class" v-if="ruleForm.picture == ''">
              <el-upload
                class="upload-demo"
                action=""
                :http-request="uploadFileMethod"
                :accept="accept"
                :before-upload="beforeAvatarUpload"
                :headers="{
                  Authorization: $window.localStorage.getItem('token')
                    ? $window.localStorage.getItem('token')
                    : '',
                }"
                :before-remove="beforeRemove"
              >
                <img :src="ruleForm.picture == '' ? uploadUrl : ''" alt="" />
              </el-upload>
              <div class="upload-class-background"></div>
              <p>上传照片</p>
            </div>
            <div class="head-class" v-if="ruleForm.picture != ''">
              <div class="delete-class">
                <img
                  :src="ruleForm.picture == '' ? '' : deleteUrl"
                  alt=""
                  @click="beforeRemove"
                />
              </div>
              <img
                :src="
                  ruleForm.picture == ''
                    ? ''
                    : this.$window.g.ApiUrl + ruleForm.picture
                "
                alt=""
              />
            </div>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="30">
        <el-col :span="12">
          <el-form-item label="姓名:" prop="name">
            <el-input
              v-model="ruleForm.name"
              :disabled="disabled"
              :maxlength="maxlength.VcName"
              show-word-limit
              clearable
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col
          :span="12"
          v-if="isDisabled || (ruleForm.sex != null && ruleForm.sex != '')"
        >
          <el-form-item label="性别:" prop="sex" style="text-align: left">
            <el-select
              v-model="ruleForm.sex"
              :disabled="disabled"
              clearable
              style="width: 310px"
              value-key="id"
            >
              <el-option
                v-for="item in genders"
                :key="item.id"
                :value="item.id"
                :label="item.name"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="30">
        <el-col
          :span="24"
          v-if="
            isDisabled ||
            (ruleForm.contactorGroup != null && ruleForm.contactorGroup != '')
          "
        >
          <el-form-item
            label="联系人分组"
            prop="contactorGroup"
            style="text-align: left"
          >
            <el-input
              v-model="ruleForm.contactorGroup"
              disabled
              style="width: 660px"
            ></el-input>
            <el-button
              type="primary"
              v-if="isDisplay"
              size="mini"
              :disabled="disabled"
              @click="onSelectTree()"
              style="margin-left: 0px; padding: 7px 7px"
              >选择</el-button
            >
            <el-button
              type="primary"
              v-if="isDisplay"
              size="mini"
              :disabled="disabled"
              @click="onClearSelect()"
              style="margin-left: 0px; padding: 7px 7px"
              >清除</el-button
            >
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="30">
        <el-col
          :span="12"
          v-if="
            isDisabled || (ruleForm.workUnit != null && ruleForm.workUnit != '')
          "
        >
          <el-form-item label="工作单位:" prop="workUnit">
            <el-input
              v-model="ruleForm.workUnit"
              :disabled="disabled"
              :maxlength="maxlength.VcWorkUnit"
              show-word-limit
              clearable
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col
          :span="12"
          v-if="
            isDisabled || (ruleForm.position != null && ruleForm.position != '')
          "
        >
          <el-form-item label="职务:" prop="position">
            <el-input
              v-model="ruleForm.position"
              :disabled="disabled"
              clearable
            >
              <el-button
                slot="append"
                @click="changePosition"
                v-show="isDisabled"
                >选择</el-button
              >
            </el-input>
          </el-form-item>
        </el-col>
        <el-col
          :span="12"
          v-if="
            isDisabled || (ruleForm.mobile != null && ruleForm.mobile != '')
          "
        >
          <el-form-item label="手机号码:" prop="mobile">
            <el-input
              v-model="ruleForm.mobile"
              :disabled="disabled"
              clearable
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col
          :span="12"
          v-if="
            isDisabled ||
            (ruleForm.officeTel != null && ruleForm.officeTel != '')
          "
        >
          <el-form-item label="办公电话:" prop="officeTel">
            <el-input
              v-model="ruleForm.officeTel"
              :disabled="disabled"
              clearable
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col
          :span="12"
          v-if="
            isDisabled || (ruleForm.otherTel != null && ruleForm.otherTel != '')
          "
        >
          <el-form-item label="手机2:" prop="otherTel">
            <el-input
              v-model="ruleForm.otherTel"
              :disabled="disabled"
              clearable
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col
          :span="12"
          v-if="
            isDisabled || (ruleForm.temobile != null && ruleForm.temobile != '')
          "
        >
          <el-form-item label="手持终端:" prop="temobile">
            <el-input
              v-model="ruleForm.temobile"
              :disabled="disabled"
              clearable
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col
          :span="12"
          v-if="
            isDisabled || (ruleForm.homeTel != null && ruleForm.homeTel != '')
          "
        >
          <el-form-item :label="home_tel" prop="homeTel">
            <el-input
              v-model="ruleForm.homeTel"
              :disabled="disabled"
              clearable
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col
          :span="12"
          v-if="
            isDisabled ||
            (ruleForm.otherTel2 != null && ruleForm.otherTel2 != '')
          "
        >
          <el-form-item label="其他电话:" prop="otherTel2">
            <el-input
              v-model="ruleForm.otherTel2"
              :disabled="disabled"
              clearable
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col
          :span="12"
          v-if="isDisabled || (ruleForm.fax != null && ruleForm.fax != '')"
        >
          <el-form-item label="传真号码:" prop="fax">
            <el-input
              v-model="ruleForm.fax"
              :disabled="disabled"
              clearable
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col
          :span="12"
          v-if="isDisabled || (ruleForm.email != null && ruleForm.email != '')"
        >
          <el-form-item label="电子邮箱:" prop="email">
            <el-input
              v-model="ruleForm.email"
              :disabled="disabled"
              clearable
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col
          :span="12"
          v-if="
            isDisabled ||
            (ruleForm.importance != null && ruleForm.importance != '')
          "
        >
          <el-form-item
            :label="imporanceTxet"
            prop="importance"
            style="text-align: left"
          >
            <el-select
              v-model="ruleForm.importance"
              clearable
              :disabled="disabled"
              style="width: 310px"
              value-key="id"
            >
              <el-option
                v-for="item in Importance"
                :key="item.id"
                :value="item.id"
                :label="item.name"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col
          :span="12"
          v-if="
            isDisabled || (ruleForm.remark != null && ruleForm.remark != '')
          "
        >
          <el-form-item label="备注" prop="remark">
            <el-input
              v-model="ruleForm.remark"
              :disabled="disabled"
              clearable
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col
          :span="12"
          v-if="
            isDisabled ||
            (ruleForm.officeAddress != null && ruleForm.officeAddress != '')
          "
        >
          <el-form-item label="办公地址:" prop="officeAddress">
            <el-input
              v-model="ruleForm.officeAddress"
              :disabled="disabled"
              clearable
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div v-if="isDisabled" class="dialog-footer">
      <el-button type="primary" size="medium" @click="save('ruleForm')"
        >确认</el-button
      >
      <el-button type="info" size="medium" @click="cancleDialog('ruleForm')"
        >取消</el-button
      >
    </div>
    <div v-else class="dialog-footer">
      <el-button type="primary" size="medium" @click="cancleDialog('ruleForm')"
        >确认</el-button
      >
    </div>
    <!-- 分组 -->
    <checked-grouping ref="mychild" @treeChild="treeChild"></checked-grouping>
    <!-- 职务弹窗 -->
    <position-tree
      ref="PositionTree"
      @handleNodeClick="handleNodeClick"
    ></position-tree>
  </el-dialog>
</template>

<script>
import checkedGrouping from "../../ebs_components/checkedGrouping";
import PositionTree from "@/view/positionTree"; // 导入职务数据
export default {
  name: "Form",
  props: ["treeData"],
  components: {
    PositionTree,
    "checked-grouping": checkedGrouping,
  },
  inject: ["reload"],
  data() {
    return {
      imageUrl: "../../../static/img/head.png", // 默认头像
      deleteUrl: "../../../static/img/delete.png", // 删除按钮
      uploadUrl: "../../../static/img/upload.png", // 上传按钮
      accept: ".jpg, .jpeg, .png, .JPG, .JPEG, .PNG", // 可接受类型
      isDisplay: true,
      title: "", //标题
      home_tel: "",
      imporanceTxet: "",
      dialogTitle: "",
      Modal: false, //模态框
      disabled: false,
      isDisabled: true,
      type: "", //判断是新增还是修改
      ID: "", //当前数据ID
      ruleForm: {
        name: "",
        contactorGroup: "", //联系人分组名称
        sex: "",
        importance: "",
        email: "",
        workUnit: "",
        position: "",
        mobile: "",
        officeTel: "",
        homeTel: "",
        fax: "",
        otherTel: "",
        otherTel2: "",
        temobile: "", //手持终端
        remark: "",
        officeAddress: "",
        picture: "",
      },
      rules: {
        //正则
        name: [
          {
            required: true,
            validator: this.$regular.mailList,
            trigger: "blur",
          },
        ],
        contactorGroup: [
          {
            required: true,
            message: "不能为空",
            trigger: "blur",
          },
        ],
        mobile: [
          {
            //手机
            validator: this.$regular.phoneReg,
            trigger: "blur",
          },
        ],
        email: [
          {
            type: "email",
            message: "格式不正确",
            trigger: "blur",
          },
        ],
        officeTel: [
          {
            //办公电话
            validator: this.$regular.fixedTelephone,
            trigger: "blur",
          },
        ],
        homeTel: [
          {
            //住宅电话
            validator: this.$regular.fixedTelephone,
            trigger: "blur",
          },
        ],
        fax: [
          {
            //传真号码
            validator: this.$regular.fixedTelephone,
            trigger: "blur",
          },
        ],
        otherTel: [
          {
            //其他手机号码1
            validator: this.$regular.phoneReg,
            trigger: "blur",
          },
        ],
        otherTel2: [
          {
            //其他号
            validator: this.$regular.numberType,
            trigger: "blur",
          },
        ],
        temobile: [
          {
            //手持终端
            validator: this.$regular.numberType,
            trigger: "blur",
          },
        ],
      },
      genders: [],
      Importance: [],
      root: "",
      contactorGroupId: [], //分组ID
      maxlength: [],
    };
  },
  created() {
    this.home_tel = window.g.home_tel + ":";
    this.imporanceTxet = window.g.imporanceTxet + ":";
    this.$http("/emergency/preparation/dictionary/getByParentCode", {
      pcode: "sex",
    }).then((result) => {
      this.genders = result.data; //性别
    });
    this.$http("/emergency/preparation/dictionary/getByParentCode", {
      pcode: "importance",
    }).then((result) => {
      this.Importance = result.data; //重要程度
    });
    this.$http("/common/getColumnLength", {
      table: "app_contactor",
    }).then((res) => {
      this.maxlength.VcName = res.data.VcName;
      this.maxlength.VcWorkUnit = res.data.VcWorkUnit;
      this.maxlength.VcPosition = res.data.VcPosition;
    });
  },
  methods: {
    /**
     * @author qinjiaqi
     * @param {type} 没有
     * @return {type} undefined
     * @description：使职务框可见，然后修改职务
     */
    changePosition() {
      this.$nextTick(() => {
        this.$refs.PositionTree.isShow = true;
      });
    },
    /**
     * @author qinjiaqi
     * @param {String} 数据传来的职务名称
     * @return {String} 前端展示的职务名称
     * @description：获得职务名称
     */
    handleNodeClick(position) {
      return (this.ruleForm.position = position);
    },
    onSelectTree() {
      //打开联系人分组类别树
      let data = {
        type: "phone",
        menuId: this.$store.state.menu.menuID,
      };
      this.$http("/emergency/preparation/contactorGroup/topTree", data).then(
        (res) => {
          let data = [res.data];
          let type = "选择联系人分组";
          let treeData = {
            id: this.contactorGroupId,
            name: this.ruleForm.contactorGroup,
          };
          this.$refs.mychild.openModal(data, type, treeData);
        }
      );
    },
    onClearSelect() {
      //清除联系人分组
      this.ruleForm.contactorGroup = "";
      this.contactorGroupId = [];
    },
    treeChild(data) {
      //数据回传
      this.ruleForm.contactorGroup = data.treeName;
      this.contactorGroupId = data.treeID;
    },
    /**
     * @editor qinjiaqi
     * @param {Object, String} 数据表单，当前是新增还是修改
     * @return {type} undefined
     * @description：新加头像的清空和获取, 修改工作单位的新增填充
     */
    openModal(fromData, type) {
      this.ruleForm.picture = "";
      console.log(fromData);
      let groups = [];
      this.contactorGroupId = [];
      this.Modal = true;
      this.ruleForm.officeAddress = fromData.officeAddress;
      switch (type) {
        case "add": //新增
          groups = fromData.groups;
          this.disabled = false;
          this.isDisabled = true;
          this.type = "add";
          this.title = "联系人新增";
          this.$nextTick(() => {
            this.$refs["ruleForm"].resetFields();
            for (let i in this.ruleForm) {
              this.ruleForm[i] = "";
            }
            let groupsName = "";
            let tempGroupsName = "";
            for (let i in groups) {
              this.contactorGroupId.push(groups[i].id);
              let parentName = this.$ParentnodeTree(
                this.treeData,
                groups[i].id
              ); //父级名称
              if (parentName) {
                if (parentName.name === this.treeData[0].name) {
                  groupsName += groups[i].name;
                  tempGroupsName = groups[i].name;
                } else groupsName += parentName.name + "->" + groups[i].name;
                tempGroupsName = groups[i].name;
                if (i < groups.length - 1) groupsName += `   `;
              }
            }
            this.ruleForm.contactorGroup = groupsName;
            this.ruleForm.workUnit = tempGroupsName;
          });
          break;
        default:
          if (type == "detail") {
            groups = fromData.groupIds;
            this.disabled = true;
            this.isDisabled = false;
            this.isDisplay = false;
            this.title = "联系人查看";
            this.type = "detail";
          } else if (type == "update") {
            groups = fromData.groupIds;
            this.disabled = false;
            this.isDisabled = true;
            this.isDisplay = true;
            this.title = "联系人修改";
            this.type = "update";
          }
          this.$nextTick(() => {
            let groupsName = "";
            for (let i in groups) {
              this.contactorGroupId.push(groups[i].id);
              let parentName = this.$ParentnodeTree(
                this.treeData,
                groups[i].id
              ); //父级名称
              if (parentName) {
                if (parentName.name === this.treeData[0].name)
                  groupsName += groups[i].name;
                else groupsName += parentName.name + "->" + groups[i].name;

                if (i < groups.length - 1) {
                  groupsName += `   `;
                }
              }
            }
            this.ruleForm.contactorGroup = groupsName;
            this.ID = fromData.id;
            this.ruleForm.name = fromData.name;
            this.ruleForm.sex = (fromData.sex == 0 ? '' : (fromData.sex == 12 ? '男' : '女'));
            this.ruleForm.importance = (fromData.importance == 0 ? '' : (fromData.importance == 217 ? '一般' : (fromData.importance == 219 ? '紧急' : '领导')));
            this.ruleForm.email = fromData.email;
            this.ruleForm.position = fromData.position;
            this.ruleForm.workUnit = fromData.workUnit;
            this.ruleForm.mobile = fromData.mobile;
            this.ruleForm.officeTel = fromData.officeTel;
            this.ruleForm.homeTel = fromData.homeTel;
            this.ruleForm.fax = fromData.fax;
            this.ruleForm.otherTel = fromData.otherTel;
            this.ruleForm.otherTel2 = fromData.otherTel2;
            this.ruleForm.temobile = fromData.temobile;
            this.ruleForm.remark = fromData.remark;
            this.ruleForm.picture =
              fromData.picture == null ? "" : fromData.picture;
          });
          break;
      }
    },
    save(ruleForm) {
      this.$refs[ruleForm].validate((valid) => {
        if (valid) {
          if (this.type == "update") {
            let test = {
              id: this.ID,
              groupIds: this.contactorGroupId,
              type: "phone",
            };
            let formData = Object.assign(test, this.ruleForm);
            let data = {
              data: formData,
            };
            let CallbackReload = this;
            this.$http(
              "/emergency/preparation/contactor/update",
              data,
              CallbackReload
            ).then((res) => {
              this.Modal = false;
              this.$emit("fatherMethod");
              this.$message({
                message: "修改成功",
                type: "success",
              });
            });
          } else if (this.type == "add") {
            let test = {
              groupIds: this.contactorGroupId,
              type: "phone",
            };
            let formData = Object.assign(test, this.ruleForm);
            let data = {
              data: formData,
            };
            let CallbackReload = this;
            this.$http(
              "/emergency/preparation/contactor/add",
              data,
              CallbackReload
            ).then((res) => {
              this.Modal = false;
              this.$emit("fatherMethod");
              this.$message({
                message: "新增成功",
                type: "success",
              });
            });
          }
        } else {
          return false;
        }
      });
    },
    cancleDialog(ruleForm) {
      //关闭模态框并清除规则
      this.Modal = false;
      this.$refs[ruleForm].resetFields();
    },
    closeDialog() {
      // 对话框关闭事件
      this.$refs["ruleForm"].resetFields();
    },
    /**
     * @author qinjiaqi
     * @param {Object} "el-upload"的参数
     * @return {type} undefined
     * @description：上传头像，把头像路径赋给表单
     */
    uploadFileMethod(param) {
      let fileObject = param.file;
      let formData = new FormData();
      formData.append("file", fileObject);
      this.$http(
        "/emergency/preparation/contactor/headPortraitUpload",
        formData
      ).then((res) => {
        this.$message({
          message: "上传成功",
          type: "success",
        });
        this.ruleForm.picture = res.data.src;
        console.log("图片路径：", param, this.ruleForm.picture);
      });
    },
    /**
     * @author qinjiaqi
     * @param {Object} 图像
     * @return {type} undefined
     * @description：上传前类型判断
     */
    beforeAvatarUpload(file) {
      let fileName = file.name.lastIndexOf("."); //取到文件名开始到最后一个点的长度
      let fileNameLength = file.name.length; //取到文件名长度
      let fileFormat = file.name.substring(fileName + 1, fileNameLength);
      let fileType =
        fileFormat === "jpg" ||
        fileFormat === "jpeg" ||
        fileFormat === "png" ||
        fileFormat === "JPG" ||
        fileFormat === "JPEG" ||
        fileFormat === "PNG";
      if (!fileType) {
        this.$message.error("上传格式为jpg, jpeg, png, JPG, JPEG, PNG");
      }
      return fileType;
    },
    /**
     * @author qinjiaqi
     * @param {type} 无
     * @return {type} undefined
     * @description：删除文件
     */
    beforeRemove() {
      this.ruleForm.picture = "";
      console.log("图片路径：", this.ruleForm.picture);
    },
  },
};
</script>

<style scoped>
.dialog-footer {
  text-align: center;
  padding-top: 30px;
}

.el-form-item >>> .el-form-item__content {
  line-height: 38px;
}
.el-input__inner {
  padding: 0px 65px 0 15px;
}
/** 
     * @author qinjiaqi
     * @description：头像类
     */
.head-class {
  top: -11px;
  left: 224px;
  width: 100px;
  height: 100px;
  position: relative;
  z-index: 0;
}
/** 
     * @author qinjiaqi
     * @description：头像类中头像图片的样式
     */
.head-class img {
  width: 100%;
  height: 100%;
  position: absolute;
  z-index: 0;
}
/** 
     * @author qinjiaqi
     * @description：头像类中头像背景的样式
     */
.head-class .head-class-background {
  position: absolute;
  width: 100%;
  height: 100%;
  right: -50px;
  background: #9fc8fe;
  z-index: -1;
}
/** 
     * @author qinjiaqi
     * @description：头像类中删除按钮的样式
     */
.head-class .delete-class img {
  top: -6px;
  left: 134px;
  width: 20px;
  height: 20px;
  position: absolute;
  z-index: 1;
}
/** 
     * @author qinjiaqi
     * @description：上传类
     */
.upload-class {
  top: -6px;
  left: 224px;
  width: 100px;
  height: 100px;
  position: relative;
  z-index: 0;
}
/** 
     * @author qinjiaqi
     * @description：上传类中上传图片的样式
     */
.upload-class img {
  position: absolute;
  right: -22px;
  top: 11px;
  width: 45px;
  height: 45px;
  z-index: 1;
}
/** 
     * @author qinjiaqi
     * @description：上传类中上传文字的样式
     */
.upload-class p {
  position: absolute;
  bottom: -3px;
  right: -28px;
  z-index: 10;
  color: #0091ff;
  font-family: PingFangSC-Medium, PingFang SC;
  z-index: 1;
}
/** 
     * @author qinjiaqi
     * @description：上传类中上传背景的样式
     */
.upload-class .upload-class-background {
  position: absolute;
  width: 100%;
  height: 100%;
  right: -50px;
  top: -7px;
  border: 2px dashed #9fc8fe;
  z-index: 0;
}
</style>
