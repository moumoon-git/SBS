<template>
  <div>
    <el-dialog
      :title="type==='add' ? '新增' : '修改'"
      :close-on-click-modal="false"
      :visible.sync="visible"
    >
      <el-form
        ref="dataForm"
        :model="dataForm"
        :rules="dataRule"
        label-width="110px"
        @keyup.enter.native="dataFormSubmit()"
      >
        <el-form-item label="调度能力">
          <el-radio-group v-model="dataForm.useUDS">
            <el-radio :label="1">
              启用
            </el-radio>
            <el-radio :label="0">
              不启用
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item
          label="终端类型"
          prop="terminal"
        >
          <el-radio-group
            v-model="dataForm.terminal"
            @change="terminalChange"
          >
            <el-radio
              v-if="type=='add'||dataForm.terminal=='0'"
              label="0"
            >
              PC端
            </el-radio>
            <el-radio
              v-if="type=='add'||dataForm.terminal=='1'"
              label="1"
            >
              移动端
            </el-radio>
            <el-radio
              v-if="type=='add'||dataForm.terminal=='2'"
              label="2"
            >
              APP端
            </el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item
          label="终端用户"
          prop="platformName"
        >
          <span @click="selectPlatform">
            <el-input
              v-model="dataForm.platformName"
              :readonly="true"
              placeholder="终端用户"
            />
          </span>
        </el-form-item>
        <el-form-item
          label="角色名称"
          prop="roleName"
        >
          <el-input
            v-model="dataForm.roleName"
            placeholder="角色名称"
          />
        </el-form-item>
        <el-form-item
          label="备注"
          prop="remark"
        >
          <el-input
            v-model="dataForm.remark"
            placeholder="备注"
          />
        </el-form-item>
        <el-form-item
          size="mini"
          label="授权"
        >
          <el-tree
            ref="menuListTree"
            :data="menuList"
            :props="menuListTreeProps"
            node-key="menuId"
            :default-expand-all="true"
            show-checkbox
          >
            <template slot-scope="{ node, data }">
              <div class="menuDiv">
                <div class="menu_l">
                  {{ `${node.label}` }}
                </div>
                <div
                  v-if="dataForm.terminal=='2'"
                  class="menu_r"
                >
                  <div
                    class="menuOperation"
                    :class="returnNewClass(data)"
                    @click="setQuickMenu(data)"
                  >
                    <!-- 设置为快捷菜单 -->
                    {{ returnSetmenuStr(data) }}
                  </div>
                </div>
              </div>
            </template>
          </el-tree>
        </el-form-item>
      </el-form>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="visible = false">取消</el-button>
        <el-button
          type="primary"
          @click="dataFormSubmit()"
        >确定</el-button>
      </span>
    </el-dialog>
    <GroupSelect
      v-if="showSelectPlatform"
      ref="selectPlatformRef"
      :prop="prop"
      @onSubmit="onSubmit"
    />
  </div>
</template>

<script>
import { treeDataTranslate } from '@/utils';
import GroupSelect from '@/views/common/groupselect';

export default {
  components: {
    GroupSelect,
  },
  data() {
    return {
      visible: false,
      type: '',
      showSelectPlatform: false,
      prop: {
        children: 'children',
        label: 'platformName',
      },
      menuList: [],
      menuListTreeProps: {
        label: 'name',
        children: 'children',
      },
      dataForm: {
        changValue: 0,
        id: 0,
        roleName: '',
        remark: '',
        terminal: '',
        // 终端数据
        platformId: null,
        platformName: '',
        useUDS: 0, // 调度能力
      },
      dataRule: {
        roleName: [
          { required: true, message: '角色名称不能为空', trigger: 'blur' },
        ],
        terminal: [
          { required: true, message: '终端类型不能为空', trigger: 'blur' },
        ],
      },
      tempKey: -666666, // 临时key, 用于解决tree半选中状态项不能传给后台接口问题. # 待优化
      quickMenus: [], // 快捷菜单id数组
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
        return this.$store.state.user.isAdmin;
      },
    },
  },
  watch: {
    'dataForm.platformId': {
      handler(newPlatformId, oldPlatformId) {
        // 获取菜单
        // alert("watch")
        if (newPlatformId !== null) this.getMenuList(newPlatformId);
      },
      deep: true,
      immediate: true,
    },
  },

  methods: {
    terminalChange() {
      this.getMenuList(this.dataForm.platformId);
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
        // console.log(this.$refs.selectPlatformRef)
        this.$refs.selectPlatformRef.init(
          '/sys/platform/treeList',
          '请选择终端用户',
        );
      });
    },
    // 选择终端用户
    onSubmit(obj) {
      // console.log('选择终端用户后', obj)
      this.dataForm.platformId = obj.id;
      this.dataForm.platformName = obj.platformName;
      // this.getMenuList(this.dataForm.platformId);
    },
    clearDataForm() {
      // console.log('clearDataForm')
      this.dataForm.roleName = '';
      this.dataForm.remark = '';
      this.dataForm.platformName = '';
      this.dataForm.menuList = [];
      this.dataForm.platformId = null;
      this.menuList = [];
      this.dataForm.terminal = '';
      this.dataForm.useUDS = 0;
    },
    init(id, type, activeName) {
      // 先清除表单数据
      this.clearDataForm();
      this.dataForm.id = id;
      this.type = type;

      // 新增

      switch (type) {
        case 'add':
          // 不是系统管理员
          if (this.isAdmin !== 1) {
            // 查询用户所属终端
            this.$http({
              url: this.$http.adornUrl(
                `/sys/platform/infoById/${this.platformId}`,
              ),
              method: 'get',
              params: this.$http.adornParams({
                terminal: this.dataForm.terminal,
              }),
            }).then(({ data }) => {
              if (data && data.code === 0) {
                this.dataForm.platformName = data.platform.platformName;
              } else {
                this.$message.error(data.msg);
              }
            });
            this.quickMenus = [];
            this.getMenuList(this.platformId);
          } else {
            this.visible = true;
          }
          break;

        case 'update':
          // 修改
          this.$http({
            url: this.$http.adornUrl(`/sys/role/info/${this.dataForm.id}`),
            method: 'get',
            params: this.$http.adornParams(),
          }).then(({ data }) => {
            if (data && data.code === 0) {
              this.dataForm.terminal = data.role.terminal;
              this.dataForm.roleName = data.role.roleName;
              this.dataForm.remark = data.role.remark;
              this.dataForm.useUDS = data.role.useUDS;
              this.quickMenus = data.role.fastMenuIdList; // 当前角色的快捷菜单
              this.$http({
                url: this.$http.adornUrl(
                  `/sys/platformmenu/menuList/${data.role.platformId}`,
                ),
                method: 'get',
                params: this.$http.adornParams({
                  terminal: this.dataForm.terminal,
                }),
              }).then(({ data: _data }) => {
                if (data && data.code === 0) {
                  this.menuList = treeDataTranslate(_data.data, 'menuId');
                  this.visible = true;
                  const idx = data.role.menuIdList.indexOf(this.tempKey);
                  if (idx !== -1) {
                    data.role.menuIdList.splice(
                      idx,
                      data.role.menuIdList.length - idx,
                    );
                  }
                  this.$nextTick(function () {
                    this.$refs.menuListTree.setCheckedKeys(
                      data.role.menuIdList,
                    );
                  });
                } else {
                  this.$message.error(data.msg);
                }
              });

              // 查询用户所属终端
              this.$http({
                url: this.$http.adornUrl(
                  `/sys/platform/infoById/${data.role.platformId}`,
                ),
                method: 'get',
                params: this.$http.adornParams(),
              }).then(({ data }) => {
                if (data && data.code === 0) {
                  this.dataForm.platformName = data.platform.platformName;
                } else {
                  this.$message.error(data.msg);
                }
              });
            } else {
              this.$message.error(data.msg);
            }
          });
          break;
        default:
        // console.log("type异常......")
      }
      activeName !== null ? this.dataForm.terminal = activeName.toString() : null;
    },
    getMenuList(platformId) {
      this.$http({
        url: this.$http.adornUrl(`/sys/platformmenu/menuList/${platformId}`),
        method: 'get',
        params: this.$http.adornParams({
          terminal: this.dataForm.terminal,
        }),
      })
        .then(({ data }) => {
          this.menuList = treeDataTranslate(data.data, 'menuId');
          this.visible = true;
        })
        .then(() => {
          this.$nextTick(() => {
            // this.$refs['dataForm'].resetFields()
            this.$refs.menuListTree.setCheckedKeys([]);
          });
        });
    },
    // 表单提交
    dataFormSubmit() {
      console.log('树结构的全部数据');
      console.log(this.menuList);
      this.$refs.dataForm.validate((valid) => {
        if (valid) {
          this.$http({
            url: this.$http.adornUrl(
              `/sys/role/${!this.dataForm.id ? 'save' : 'update'}`,
            ),
            method: 'post',
            data: this.$http.adornData({
              roleId: this.dataForm.id || undefined,
              roleName: this.dataForm.roleName,
              terminal: this.dataForm.terminal,
              remark: this.dataForm.remark,
              platformId: this.dataForm.platformId,
              // 原来没有排序的传参
              menuIdList: [].concat(
                this.$refs.menuListTree.getCheckedKeys(),
                [this.tempKey],
                this.$refs.menuListTree.getHalfCheckedKeys(),
              ),
              // 添加排序后的传参
              // sysRoleMenuEntityList: topicArr,
              useUDS: this.dataForm.useUDS,
              fastMenuIdList: this.quickMenus,
            }),
          }).then(({ data }) => {
            if (data && data.code === 0) {
              this.$message({
                message: '操作成功',
                type: 'success',
                duration: 1500,
              });
              this.visible = false;
              this.$emit('refreshDataList');
            } else {
              this.$message.error(data.msg);
            }
          });
        }
      });
    },
    setQuickMenu(e) {
      console.log(e);
      console.log(this.menuList);
      console.log(this.quickMenus);
      if (this.quickMenus.includes(e.menuId)) {
        this.quickMenus.forEach((item, index) => {
          if (item === e.menuId) {
            this.quickMenus.splice(index, 1);
          }
        });
      } else {
        if (this.quickMenus.length > 3) {
          return this.$message.error('最多选择四个快捷菜单');
        }
        this.quickMenus.push(e.menuId);
      }
      console.log('快捷菜单ids');
      console.log(this.quickMenus);
    },
    returnSetmenuStr(data) {
      if (this.quickMenus.includes(data.menuId)) {
        return '已设置为快捷菜单';
      }
      return '设置为快捷菜单';
    },
    returnNewClass(data){
      if(this.quickMenus.includes(data.menuId)) {
        return `newClass`
      }else{
        return ``
      }
    }
  },
};
</script>
<style lang="scss">
.menuDiv{
    display: flex;
    justify-content: space-between;
    width: 80%;
  .menu_r{
    display: flex;
    .menuSort{
      display: flex;
      margin-right: 11px;
          .menu_up{
            width: 22px;
            height: 22px;
            background: url(./img/up.png) no-repeat;
          }
          .menu_down{
            width: 22px;
            height: 22px;
            background: url(./img/down.png) no-repeat;
          }
    }
    .menuOperation{
      display: none;
    }
    .newClass{
      display:block
    }

  }
  &:hover{
     .menuOperation{
      display: block;
    }
  }
}
</style>
