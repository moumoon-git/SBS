<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible"
  >
    <el-form
      :model="dataForm"
      :rules="dataRule"
      ref="dataForm"
      @keyup.enter.native="dataFormSubmit()"
      label-width="80px"
    >
      <el-form-item label="终端类型">
        <el-radio-group v-model="dataForm.terminal" @change="terminalChange">
          <el-radio label="0">PC端</el-radio>
          <el-radio label="1">移动端</el-radio>
          <el-radio label="2">APP端</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="类型" prop="type">
        <el-radio-group v-model="dataForm.type">
          <el-radio
            v-for="(type, index) in dataForm.terminal !== '2'
              ? dataForm.typeList
              : ['菜单']"
            :label="index"
            :key="index"
            >{{ type }}</el-radio
          >
        </el-radio-group>
      </el-form-item>

      <el-form-item
        :label="dataForm.typeList[dataForm.type] + '名称'"
        prop="name"
      >
        <el-input
          v-model="dataForm.name"
          :placeholder="dataForm.typeList[dataForm.type] + '名称'"
        ></el-input>
      </el-form-item>

      <el-form-item label="上级菜单" prop="parentName">
        <el-popover
          ref="menuListPopover"
          :disabled="dataForm.terminal == 2"
          placement="bottom-start"
          trigger="click"
        >
          <el-tree
            :data="menuList"
            :props="menuListTreeProps"
            node-key="menuId"
            ref="menuListTree"
            @current-change="menuListTreeCurrentChangeHandle"
            :default-expand-all="true"
            :highlight-current="true"
            :expand-on-click-node="false"
          ></el-tree>
        </el-popover>
        <el-input
          v-model="dataForm.parentName"
          v-popover:menuListPopover
          :readonly="true"
          :disabled="dataForm.terminal == 2"
          placeholder="点击选择上级菜单"
          class="menu-list__input"
        ></el-input>
      </el-form-item>

      <el-form-item v-if="dataForm.type === 1" label="菜单路由" prop="url">
        <el-input v-model="dataForm.url" placeholder="菜单路由"></el-input>
      </el-form-item>

      <el-form-item v-if="dataForm.type !== 0" label="授权标识" prop="perms">
        <el-input
          v-model="dataForm.perms"
          placeholder="多个用逗号分隔, 如: user:list,user:create"
        ></el-input>
      </el-form-item>
      <template v-if="dataForm.terminal !== '2'">
        <el-form-item v-if="dataForm.type !== 2" label="排序号" prop="orderNum">
          <el-input-number
            v-model="dataForm.orderNum"
            controls-position="right"
            :min="0"
            label="排序号"
          ></el-input-number>
        </el-form-item>

        <el-form-item v-if="dataForm.type !== 2" label="菜单图标" prop="icon">
          <el-row>
            <el-col :span="22">
              <el-popover
                ref="iconListPopover"
                placement="bottom-start"
                trigger="click"
                popper-class="mod-menu__icon-popover"
              >
                <div class="mod-menu__icon-inner">
                  <div class="mod-menu__icon-list">
                    <el-button
                      v-for="(item, index) in iconList"
                      :key="index"
                      @click="iconActiveHandle(item)"
                      :class="{ 'is-active': item === dataForm.icon }"
                    >
                      <icon-svg :name="item"></icon-svg>
                    </el-button>
                  </div>
                </div>
              </el-popover>
              <el-input
                v-model="dataForm.icon"
                v-popover:iconListPopover
                :readonly="true"
                placeholder="菜单图标名称"
                class="icon-list__input"
              ></el-input>
            </el-col>
            <el-col :span="2" class="icon-list__tips">
              <el-tooltip placement="top" effect="light">
                <!--              <div slot="content">全站推荐使用SVG Sprite, 详细请参考:<a href="//github.com/daxiongYang/renren-fast-vue/blob/master/src/icons/index.js" target="_blank">icons/index.js</a>描述</div>
            <i class="el-icon-warning"></i>-->
              </el-tooltip>
            </el-col>
          </el-row>
        </el-form-item>

        <el-form-item label="菜单图片">
          <el-upload
            class="avatar-uploader"
            action="https://jsonplaceholder.typicode.com/posts/"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img
              v-if="dataForm.backgroundImage"
              :src="dataForm.backgroundImage"
              class="avatar"
            />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>

        <el-form-item label="设为首页">
          <template>
            <el-radio v-model="dataForm.backgroundImageFlag" :label="1"
              >是</el-radio
            >
            <el-radio v-model="dataForm.backgroundImageFlag" :label="0"
              >否</el-radio
            >
          </template>
        </el-form-item>

        <el-form-item v-if="dataForm.type !== 2" label="是否移动端显示">
          <template>
            <el-radio v-model="dataForm.mobileDisplay" :label="1">是</el-radio>
            <el-radio v-model="dataForm.mobileDisplay" :label="0">否</el-radio>
          </template>
        </el-form-item>

        <el-form-item label="是否设为快捷菜单">
          <template>
            <el-radio v-model="dataForm.isFast" :label="1">是</el-radio>
            <el-radio v-model="dataForm.isFast" :label="0">否</el-radio>
          </template>
        </el-form-item>

        <el-form-item
          v-if="dataForm.type !== 2"
          label="移动端url"
          prop="mobileUrl"
        >
          <el-input
            v-model="dataForm.mobileUrl"
            placeholder="移动端url"
          ></el-input>
        </el-form-item>
      </template>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { treeDataTranslate } from '@/utils';
import Icon from '@/icons';
export default {
  data() {
    var validateUrl = (rule, value, callback) => {
      if (this.dataForm.type === 1 && !/\S/.test(value)) {
        callback(new Error('菜单URL不能为空'));
      } else {
        callback();
      }
    };
    return {
      visible: false,
      dataForm: {
        id: 0,
        type: 1,
        terminal: '0',
        typeList: ['目录', '菜单', '按钮'],
        name: '',
        parentId: 0,
        parentName: '',
        url: '',
        perms: '',
        orderNum: 0,
        icon: '',
        iconList: [],
        backgroundImage: '',
        backgroundImageFlag: 1,
        mobileDisplay: 0,
        mobileUrl: '',
        isFast: 0,
      },
      dataRule: {
        name: [
          { required: true, message: '菜单名称不能为空', trigger: 'blur' },
        ],
        parentName: [
          { required: true, message: '上级菜单不能为空', trigger: 'change' },
        ],
        url: [{ validator: validateUrl, trigger: 'blur' }],
      },
      menuList: [],
      menuListTreeProps: {
        label: 'name',
        children: 'children',
      },
    };
  },
  created() {
    this.iconList = Icon.getNameList();
  },
  methods: {
    terminalChange() {
      this.getMenuList();
    },
    getMenuList() {
      this.$http({
        url: this.$http.adornUrl('/sys/menu/select'),
        method: 'get',
        params: this.$http.adornParams({
          terminal: this.dataForm.terminal,
        }),
      }).then(({ data }) => {
        if (data && data.code === 0) {
          console.log('菜单1', data.menuList);
          var root = {
            menuId: 0,
            name: '一级菜单',
            parentId: 0,
            open: true,
            type: 1,
          };
          data.menuList.push(root);
          this.menuList = treeDataTranslate(data.menuList, 'menuId');
        } else {
          this.$message.error(data.msg);
        }
      });
    },
    init(id, activeName) {
      this.dataForm.id = id || 0;
      this.$http({
        url: this.$http.adornUrl('/sys/menu/select'),
        method: 'get',
        params: this.$http.adornParams({
          terminal: this.dataForm.terminal,
        }),
      })
        .then(({ data }) => {
          if (data && data.code === 0) {
            console.log('菜单1', data.menuList);
            var root = {
              menuId: 0,
              name: '一级菜单',
              parentId: 0,
              open: true,
              type: 1,
            };
            data.menuList.push(root);
            this.menuList = treeDataTranslate(data.menuList, 'menuId');
          } else {
            this.$message.error(data.msg);
          }
        })
        .then(() => {
          this.visible = true;
          this.$nextTick(() => {
            this.$refs['dataForm'].resetFields();
          });
        })
        .then(() => {
          if (!this.dataForm.id) {
            // 新增
            this.menuListTreeSetCurrentNode();
          } else {
            // 修改
            this.$http({
              url: this.$http.adornUrl(`/sys/menu/info/${this.dataForm.id}`),
              method: 'get',
              params: this.$http.adornParams({
                // terminal: this.dataForm.terminal
              }),
            }).then(({ data }) => {
              // console.log("修改",data.menu.terminal);
              if (data && data.code === 0) {
                this.dataForm.id = data.menu.menuId;
                this.dataForm.type = data.menu.type;
                this.dataForm.terminal = data.menu.terminal;
                this.dataForm.name = data.menu.name;
                this.dataForm.parentId = data.menu.parentId;
                this.dataForm.url = data.menu.url;
                this.dataForm.perms = data.menu.perms;
                this.dataForm.orderNum = data.menu.orderNum;
                this.dataForm.icon = data.menu.icon;
                this.dataForm.backgroundImage = data.menu.backgroundImage;
                this.dataForm.isFast = data.menu.isFast;
                this.dataForm.backgroundImageFlag = data.menu
                  .backgroundImageFlag
                  ? 1
                  : 0;
                this.dataForm.mobileDisplay = data.menu.mobileDisplay;
                this.dataForm.mobileUrl = data.menu.mobileUrl;
                this.menuListTreeSetCurrentNode();
              } else {
                this.$message.error(data.msg);
              }
            });
          }
        });
      activeName !== null
        ? (this.dataForm.terminal = activeName.toString())
        : null;
    },

    //背景图片上传成功触发
    handleAvatarSuccess(res, file) {},

    //图片上传之前
    beforeAvatarUpload(file) {
      let form = new FormData();
      form.append('file', file);
      this.$http({
        baseURL: window.SITE_CONFIG.fileupload,
        url: '/scgMailContactor/uploadImg',
        method: 'post',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        data: form,
      })
        .then(({ data }) => {
          // console.log("/upload/platformImages",data)
          if (data && data.errorcode === 0) {
            this.dataForm.backgroundImage =
              window.SITE_CONFIG.cloudUrl + data.data.url;
          } else {
            this.$message.error(data.msg);
          }
        })
        .catch((err) => {});
    },

    // 菜单树选中
    menuListTreeCurrentChangeHandle(data, node) {
      this.dataForm.parentId = data.menuId;
      this.dataForm.parentName = data.name;
      if (document.querySelectorAll('div[role=tooltip]')) {
        document
          .querySelectorAll('div[role=tooltip]')
          [
            document.querySelectorAll('div[role=tooltip]').length - 1
          ].setAttribute('style', 'display:none;');
      }
    },
    // 菜单树设置当前选中节点
    menuListTreeSetCurrentNode() {
      this.$refs.menuListTree.setCurrentKey(this.dataForm.parentId);
      this.dataForm.parentName = (this.$refs.menuListTree.getCurrentNode() ||
        {})['name'];
    },
    // 图标选中
    iconActiveHandle(iconName) {
      this.dataForm.icon = iconName;
    },
    // 表单提交
    dataFormSubmit() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          // console.log("新增",this.dataForm.terminal)
          this.$http({
            url: this.$http.adornUrl(
              `/sys/menu/${!this.dataForm.id ? 'save' : 'update'}`,
            ),
            method: 'post',
            data: this.$http.adornData({
              menuId: this.dataForm.id || undefined,
              terminal: this.dataForm.terminal,
              type: this.dataForm.type,
              name: this.dataForm.name,
              parentId: this.dataForm.parentId,
              url: this.dataForm.url,
              perms: this.dataForm.perms,
              orderNum: this.dataForm.orderNum,
              icon: this.dataForm.icon,
              //背景图片
              backgroundImage: this.dataForm.backgroundImage,
              //是否启动背景图片,0是不开启，1是开启
              backgroundImageFlag: this.dataForm.backgroundImageFlag,
              mobileDisplay: this.dataForm.mobileDisplay,
              mobileUrl: this.dataForm.mobileUrl,
              isFast: this.dataForm.isFast,
            }),
          }).then(({ data }) => {
            if (data && data.code === 0) {
              this.$http({
                method: 'post',
                url: window.SITE_CONFIG['baseUrl'] + '/sys/platformmenu/save',
                data: {
                  platformMenuId: this.dataForm.id,
                  customMenuName: this.dataForm.name,
                  customOrderNum: this.dataForm.orderNum,
                },
              }).then((res) => {
                if (res.data.errorcode === 0 || res.data.code === 0) {
                  this.$message({
                    message: '操作成功',
                    type: 'success',
                    duration: 1500,
                  });
                  this.visible = false;
                  this.$emit('refreshDataList');
                }
              });
            } else {
              this.$message.error(data.msg);
            }
          });
        }
      });
    },
  },
};
</script>

<style lang="scss">
.el-tree {
  overflow-y: auto;
  overflow-x: scroll;
  height: 500px;
  //border: 1px solid blue;
}

.mod-menu {
  .menu-list__input,
  .icon-list__input {
    > .el-input__inner {
      cursor: pointer;
    }
  }
  &__icon-popover {
    width: 458px;
    overflow: hidden;
  }
  &__icon-inner {
    width: 478px;
    max-height: 258px;
    overflow-x: hidden;
    overflow-y: auto;
  }
  &__icon-list {
    width: 458px;
    padding: 0;
    margin: -8px 0 0 -8px;
    > .el-button {
      padding: 8px;
      margin: 8px 0 0 8px;
      > span {
        display: inline-block;
        vertical-align: middle;
        width: 18px;
        height: 18px;
        font-size: 18px;
      }
    }
  }
  .icon-list__tips {
    font-size: 18px;
    text-align: center;
    color: #e6a23c;
    cursor: pointer;
  }
  #el-popover-7226 {
    height: 500px !important;
    overflow: auto !important;
  }

  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409eff;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
}
</style>
