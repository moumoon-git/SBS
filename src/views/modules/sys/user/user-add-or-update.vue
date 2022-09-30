<template>
  <div>
    <el-dialog
      :title="type === 'add' ? '新增' : '修改'"
      :close-on-click-modal="false"
      :visible.sync="visible"
      @close="closeDialog"
    >
      <el-form
        :model="dataForm"
        :rules="dataRule"
        ref="dataForm"
        @keyup.enter.native="dataFormSubmit()"
        label-width="80px"
      >
        <el-form-item label="终端用户" prop="platformName">
          <!--用户是超级管理员新增时显示-->
          <span @click="selectPlatform">
            <el-input
              v-model="dataForm.platformName"
              :readonly="true"
              placeholder="选择终端用户"
              class="menu-list__input"
            />
          </span>
        </el-form-item>

        <el-form-item label="用户名" prop="userName">
          <el-input v-model="dataForm.userName" placeholder="登录帐号"></el-input>
        </el-form-item>

        <el-form-item label="昵称" prop="name">
          <el-input v-model="dataForm.name" placeholder="昵称"></el-input>
        </el-form-item>

        <el-form-item label="所属部门" prop="department">
          <el-input v-model="dataForm.department" placeholder="所属部门"></el-input>
        </el-form-item>

        <el-form-item
          v-if="type !== 'add'"
          label="重置密码"
        >
          <el-switch v-model="isResetPassword" />
        </el-form-item>
        <!-- 新增或重置密码的时候显示 -->
        <template v-if="type === 'add' || isResetPassword">
          <el-form-item
            label="密码"
            prop="password"
            :class="{ 'is-required': !dataForm.id }"
          >
            <el-input
              v-model="dataForm.password"
              type="password"
              placeholder="密码"
            />
          </el-form-item>
          <el-form-item
            label="确认密码"
            prop="comfirmPassword"
            :class="{ 'is-required': !dataForm.id }"
          >
            <el-input
              v-model="dataForm.comfirmPassword"
              type="password"
              placeholder="确认密码"
            />
          </el-form-item>
        </template>

        <el-form-item label="邮箱" prop="email">
          <el-input v-model="dataForm.email" placeholder="邮箱"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="dataForm.mobile" placeholder="手机号"></el-input>
        </el-form-item>
        <el-form-item label="角色" size="mini" prop="roleIdList">
          <el-radio-group v-model="dataForm.roleIdList">
            <el-radio
              v-for="role in roleList"
              :key="role.roleId"
              :label="role.roleId"
            >{{ role.roleName }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="状态" size="mini" prop="status">
          <el-radio-group v-model="dataForm.status">
            <el-radio :label="0">禁用</el-radio>
            <el-radio :label="1">正常</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="resetForm('dataForm')">取消</el-button>
        <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
      </span>
    </el-dialog>

    <GroupSelect
      v-if="showSelectPlatform"
      :prop="prop"
      ref="selectPlatformRef"
      @onSubmit="onSubmit"
    />
  </div>
</template>

<script>
import { treeDataTranslate } from "@/utils";
import { isEmail, isMobile } from "@/utils/validate";
import GroupSelect from "@/views/common/groupselect";

export default {
  components: {
    GroupSelect,
  },
  data() {
    var validatePassword = (rule, value, callback) => {
      if (!this.dataForm.id && !/\S/.test(value)) {
        callback(new Error("密码不能为空"));
      } else if (
        !/(?=.*[a-zA-Z])(?=.*\d)(?=.*[~!@#$%^&*()_+`\-={}:";'<>?,.\/])/.test(
          value
        )
      ) {
        callback(new Error("密码需要为字母、字符、数字三类组合"));
      } else if (value.length < 8) {
        callback(new Error('密码长度至少8个字符'));
      } else if (value === this.dataForm.userName) {
        callback(new Error('密码不能和用户名相同'));
      } else {
        callback();
      }
    };
    var validateComfirmPassword = (rule, value, callback) => {
      if (!this.dataForm.id && !/\S/.test(value)) {
        callback(new Error("确认密码不能为空"));
      } else if (this.dataForm.password !== value) {
        callback(new Error("确认密码与密码输入不一致"));
      } else {
        callback();
      }
    };
    var validateEmail = (rule, value, callback) => {
      if (!isEmail(value)) {
        callback(new Error("邮箱格式错误"));
      } else {
        callback();
      }
    };
    var validateMobile = (rule, value, callback) => {
      if (!isMobile(value)) {
        callback(new Error("手机号格式错误"));
      } else {
        callback();
      }
    };
    return {
      visible: false,
      type: "",
      roleList: [],
      dataForm: {
        id: 0,
        userName: "",
        name: "", //昵称
        password: "",
        comfirmPassword: "",
        salt: "",
        email: "",
        mobile: "",
        roleIdList: '',
        status: 1,
        //终端数据
        platformId: "",
        platformTypeId: "",
        platformName: "",
        // 所属部门
        department: '',
      },
      platformList: [],
      prop: {
        children: "children",
        label: "platformName",
      },
      showSelectPlatform: false, //显示终端用户窗口
      dataRule: {
        platformName: [
          { required: true, message: "终端用户不能为空", trigger: "change" },
        ],
        userName: [
          { required: true, message: "用户名不能为空", trigger: "blur" },
        ],
        name: [{ required: true, message: "昵称不能为空", trigger: "blur" }],
        department: [{ required: true, message: "所属部门不能为空", trigger: "blur" }],
        password: [{ validator: validatePassword, trigger: "blur" }],
        comfirmPassword: [
          { validator: validateComfirmPassword, trigger: "blur" },
        ],
        email: [
          { required: true, message: "邮箱不能为空", trigger: "blur" },
          { validator: validateEmail, trigger: "blur" },
        ],
        mobile: [
          { required: true, message: "手机号不能为空", trigger: "blur" },
          { validator: validateMobile, trigger: "blur" },
        ],
      },
      // 编辑时，是否重置密码
      isResetPassword: false,
    };
  },

  computed: {
    platformId: {
      get() {
        return this.$store.state.user.platformId;
      },
    },
    isAdmin: {
      get() {
        console.log(this.$store.state.user.isAdmin);
        return this.$store.state.user.isAdmin;
      },
    },
  },

  watch: {
    "dataForm.platformId": {
      handler(newPlatformId, oldPlatformId) {
        this.$http({
          url: this.$http.adornUrl(`/sys/role/select/${newPlatformId}`),
          method: "get",
          params: this.$http.adornParams(),
        }).then(({ data }) => {
          if (data && data.code == 0) {
            this.roleList = data.list;
          } else {
            this.$message.error(data.msg);
          }
        });
      },
      deep: true,
      immediate: false,
    },
  },
  methods: {
    // handleClose(done) {
    //    this.$refs.dataForm.resetFields()
    //    this.visible = false;
    // },
    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.visible = false;
    },
    clearDataForm() {
      this.dataForm.id = 0;
      this.dataForm.userName = "";
      this.dataForm.name = "";
      this.dataForm.department = '';
      this.dataForm.password = "";
      this.dataForm.comfirmPassword = "";
      this.dataForm.salt = "";
      this.dataForm.email = "";
      this.dataForm.mobile = "";
      this.dataForm.roleIdList = '';
      this.dataForm.status = 1;
      // this.dataForm.platformId = "";
      this.dataForm.platformTypeId = "";
      this.dataForm.platformName = "";
      // this.roleList = [];
    },

    init(id, type) {
      //先清除表单数据
      this.clearDataForm();
      this.dataForm.id = id;
      this.type = type;

      //新增
      switch (type) {
        case "add":
          //不是系统管理，
          if (this.isAdmin !== 1) {
            this.$http({
              url: this.$http.adornUrl(
                `/sys/platform/infoById/${this.platformId}`
              ),
              method: "get",
              params: this.$http.adornParams(),
            }).then(({ data }) => {
              if (data && data.code == 0) {
                this.visible = true;
                this.dataForm.platformName = data.platform.platformName;
                this.dataForm.platformId = data.platform.id;
              } else {
                this.$message.error(data.msg);
              }
            });
            //查询角色
            this.$http({
              url: this.$http.adornUrl(`/sys/role/select/${this.platformId}`),
              method: "get",
              params: this.$http.adornParams(),
            }).then(({ data }) => {
              if (data && data.code == 0) {
                this.roleList = data.list;
              } else {
                this.$message.error(data.msg);
              }
            });
          } else {
            this.visible = true;
          }
          break;

        case "update":
          //修改
          this.$http({
            url: this.$http.adornUrl(`/sys/user/info/${this.dataForm.id}`),
            method: "get",
            params: this.$http.adornParams(),
          }).then(({ data }) => {
            if (data && data.code === 0) {
              // console.log(data);
              this.dataForm.userName = data.user.username;
              this.dataForm.name = data.user.name;
              this.dataForm.salt = data.user.salt;
              this.dataForm.email = data.user.email;
              this.dataForm.mobile = data.user.mobile;
              this.dataForm.roleIdList = data.user.roleIdList && data.user.roleIdList.length ? data.user.roleIdList[0] : '';
              this.dataForm.status = data.user.status;
              this.dataForm.platformId = data.user.platformId;
              this.dataForm.department = data.user.department;

              this.$http({
                url: this.$http.adornUrl(
                  `/sys/platform/infoById/${data.user.platformId}`
                ),
                method: "get",
                params: this.$http.adornParams(),
              }).then(({ data }) => {
                // console.log(data);
                this.visible = true;
                this.dataForm.platformName = data.platform.platformName;
              });
            } else {
              this.$message.error(data.msg);
            }
          });
          break;

        default:
        // console.log("type异常......");
      }
    },

    // 只有超管账号且新增时才可以选择终端用户
    selectPlatform() {
      // 不是超管账号新增的弹窗
      if (this.isAdmin === 0 && !this.dataForm.id) {
        this.$message.warning('如需选择终端用户，请登录超级管理员账号');
        return;
      }
      // 修改
      if (this.dataForm.id) {
        this.$message.warning('终端用户无法修改');
        return;
      }
      this.showSelectPlatform = true;
      this.$nextTick(() => {
        // console.log(this.$refs.selectPlatformRef);
        this.$refs.selectPlatformRef.init(
          "/sys/platform/treeList",
          "请选择终端用户"
        );
      });
    },
    //选择终端用户
    onSubmit(obj) {
      // console.log("选择终端用户后", obj);
      this.dataForm.platformId = obj.id;
      this.dataForm.platformName = obj.platformName;
    },

    // 表单提交
    dataFormSubmit() {
      this.$refs["dataForm"].validate((valid) => {
        if (valid) {
          this.$http({
            url: this.$http.adornUrl(
              `/sys/user/${!this.dataForm.id ? "save" : "update"}`
            ),
            method: "post",
            data: this.$http.adornData({
              platformId: this.dataForm.platformId,
              name: this.dataForm.name,
              userId: this.dataForm.id || undefined,
              username: this.dataForm.userName,
              password: this.dataForm.password,
              salt: this.dataForm.salt,
              email: this.dataForm.email,
              mobile: this.dataForm.mobile,
              status: this.dataForm.status,
              roleIdList: [this.dataForm.roleIdList],
              department: this.dataForm.department,
              isResetPW: Number(this.isResetPassword),
            }),
          }).then(({ data }) => {
            if (data && data.code === 0) {
              this.$message({
                message: "操作成功",
                type: "success",
                duration: 1500,
                onClose: () => {},
              });
              this.visible = false;
              this.$emit("refreshDataList");
            } else {
              this.$message.error(data.msg);
            }
          });
        }
      });
    },
    //关闭弹窗的回调事件
    closeDialog() {
      this.$nextTick(() => {
        this.$refs.dataForm.clearValidate();
      });
    },
  },
};
</script>
