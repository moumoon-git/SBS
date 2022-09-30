<template>
  <div class="sv-dialog-tree">
    <!-- :title="type == 'add' ? '新增分组' : '编辑分组'" -->
    <sv-dialog
      ref="dialog"
      :title="title"
      @cancel="$refs.dialog.visible = false"
      @modal="$refs.dialog.visible = false"
      @confirm="handleSubmit(title)"
    >
      <div
        v-loading="loading"
        element-loading-spinner="sv-loading"
        class="sv-dialog-tree__container"
      >
        <div class="sv-dialog-tree__item">
          <span class="sv-dialog-tree__item__label">类型名称：</span>
          <div class="sv-dialog-tree__item__input">
            <sv-input-search
              v-model="name"
              :suffix="false"
              placeholder="请输入名称"
              width="100%"
              :clearable="false"
            />
          </div>
        </div>
        <div class="sv-dialog-tree__item">
          <span class="sv-dialog-tree__item__label">上级类型：</span>
          <div class="sv-dialog-tree__item__input">
            <sv-select-group
              v-model="parentId"
              :api="api.list"
              :top="title === '新增群防共治类型' || title === '修改群防共治类型' ? false:true"
              :name="parentName"
              :params="api.params"
              @clickParentCallBackObj="clickParentCallBackObj"
              @allData="selectChange"
            />
          </div>
        </div>
        <div class="sv-dialog-tree__item">
          <span
            class="sv-dialog-tree__item__label"
            style="position: relative; bottom: 2px;"
          >备注信息：</span>
          <div class="sv-dialog-tree__item__input">
            <sv-textarea
              v-model="remark"
              placeholder="请输入备注信息"
            />
          </div>
        </div>

        <div class="sv-dialog-tree__item" v-show="selectStyleFlag" >
          <span
            class="sv-dialog-tree__item__label"
            style="position: relative; bottom: 2px;"
          >类型样式：</span>
          <div v-if="graph" class="selectStyle" @click="selectStyleFun">
            选择样式
          </div>
          <!-- 图形 -->
          <div v-else class="graph" >
            <!-- 关闭 -->
            <img src="./assets/img/close.svg" @click="graph=true" />
            <!-- 图片 -->
            <img :src="(api.paramsIconId.src || require('./assets/img/notAvailable.svg'))"/>
          </div>
        </div>

      </div>
    </sv-dialog>
    <sv-dialog-hint
      ref="hint"
      type="normal"
      text="类型名称不能为空！"
    />
    <sv-dialog-hint
      ref="fail_add"
      type="fail"
      text="新增分组失败"
    />
    <sv-dialog-hint
      ref="fail_update"
      type="fail"
      text="更新分组失败"
    />
    <sv-dialog-hint
      ref="fail_updateGroup"
      type="fail"
      text="上级类型不能为自身，请重新选择上级类型"
    />
    <sv-dialog-hint
      ref="fail_name"
      type="fail"
      text="类型名称重复"
    />
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'SvDialogTree',

  props: {
    api: {
      type: Object,
      default: () => ({
        list: '',
        add: '',
        update: '',
        params: {},
        paramsIconId: {},
      }),
    },

    treeList: {
      type: Array,
      default: () => ([]),
    },

    treeProps: {
      type: Object,
      default: () => ({
        children: 'children',
        label: 'name',
        value: 'id',
      }),
    },
  },

  data() {
    return {
      selectStyleFlag:true,
      // 弹窗类型：add or edit
      type: '',
      loading: false,
      id: '',
      name: '',
      // 所属类型名称
      parentName: '',
      parentId: '',
      remark: '',
      title: '', // 弹窗名字
      platformTypeId: '', // 群防共治类型的平台类型id
      graph: true,
    };
  },
  methods: {
    /**
     * @method
     * @desc 打开弹窗
     * @param {string} type 标题，可自定义
     * @param {Object} node 树节点数据
     */
    init(type, data) {
      console.log(type,data);
      if(type.indexOf('edit') !== -1){
        if(data.assistIcon) {
          this.api.paramsIconId = data.assistIcon;
          this.api.paramsIconId.src = window.SITE_CONFIG["cloudUrl"] + data.assistIcon.iconUrl;
        } else {
          this.api.paramsIconId.src = '';
        }
        // console.log('%c [ xxx ]', 'font-size:13px; background:pink; color:#bf2c9f;', this.api.paramsIconId);
        this.graph = false;
      } else {
        this.graph = true;
      }
      switch (type) {
        case 'add':
          this.title = '新增分组';
          break;
        case 'edit':
          this.title = '修改分组';
          break;
        case 'title_deatil_customize_add': // 新增弹窗自定义标题
          this.title = data.customizeTitle;
          this.platformTypeId = data.customizeTitle === '新增群防共治类型' ? data.platformTypeId : '';
          break;
        case 'title_deatil_customize_edit': // 修改弹窗自定义标题
          this.title = data.customizeTitle;
          this.platformTypeId = data.customizeTitle === '修改群防共治类型' ? data.platformTypeId : '';
          break;
        case 'title_deatil_root': // 分组上方新增按钮
          this.title = data;
          break;
        default:
          this.title = '修改分组';
          break;
      }
      this.type = type;
      // 树节点中新增图标
      if (type === 'add' || type === 'title_deatil_customize_add') {
        this.name = '';
        if (this.title === '新增群防共治类型') {
          this.parentName = data ? data.name : '';
        } else {
          this.parentName = data ? data.name : '顶级分组';
        }
        this.parentId = data ? data.id : 0;
        this.remark = '';
      } else if (type === 'title_deatil_root') { // 新增类型按钮，与树无关联
        this.name = '';
        if (this.title === '新增群防共治类型') {
          this.parentName = '';
        } else {
          this.parentName = '顶级分组';
        }
        this.parentId = 0;
        this.remark = '';
      } else { // 树节点中修改图标
        this.id = data.id;
        this.name = data.name;
        this.parentName = data.parentName;
        this.parentId = data.parentId;
        this.remark = data.remark;
      }
      this.$refs.dialog.visible = true;
    },
    clickParentCallBackObj (node){
      if(node.level === 1) {
        // 点击了父级
        this.selectStyleFlag = true;
      } else {
        // 点击了非父级
        this.selectStyleFlag = false;
      }
    },
    /**
     * @method
     * @desc 提交结果
     */
    handleSubmit(title) {
      if (this.name === null || this.name === '' || this.name === undefined) {
        this.$refs.hint.visible = true;
        return;
      }
      console.log(this.id, this.parentId);
      // 当修改时，子节点不能和父节点相同
      if (this.id === this.parentId && this.type === 'edit' && this.type === 'title_deatil_customize_edit') {
        this.$refs.fail_updateGroup.visible = true;
        return;
      }
      if (this.type === 'add' || this.type === 'title_deatil_customize_add' || this.type === 'title_deatil_root') {
        if (this.countSameNameNodes().length > 0) {
          this.$refs.fail_name.visible = true;
          return;
        }
        this.loading = true;
        const dataArr = this.api.params.showParentId
          ? { parentId: this.parentId }
          : { pid: this.parentId };
        let dataInfo = {};
        if (title === '新增群防共治类型' || title === '修改群防共治类型') {
          dataInfo = {
            name: this.name,
            remark: this.remark,
            platformTypeId: this.platformTypeId,
            type_flag: 2,
            // 当parentId小于0时，是群防共治类型自定义的id 并非数据库中存储id
            parentId: this.parentId < 0 ? 0 : this.parentId,
            iconId: this.api.paramsIconId.iconId
          };
        } else {
          dataInfo = {
            name: this.name,
            remark: this.remark,
            ...dataArr,
            iconId: this.api.paramsIconId.iconId
          };
        }
        console.log('%c [ xxx ]', 'font-size:13px; background:pink; color:#bf2c9f;', this.api.paramsIconId);
        const request = {
          method: 'post',
          url: this.api.add,
          baseURL: window.SITE_CONFIG.baseUrl,
          headers: {
            'Content-Type': 'application/json; charset=utf-8',
            token: this.$cookie.get('token'),
          },
          data: dataInfo,
        };

        axios(request)
          .then((response) => {
            this.loading = false;
            if (response.data.code === 0 || response.data.errorcode === 0) {
              this.$refs.dialog.visible = false;
              this.$emit('update');
              this.$message.success(`${this.title}成功！`);
            } else {
              this.$refs.fail_add.supplementText = `错误信息：${response.data.msg}`;
              this.$refs.fail_add.visible = true;
            }
          })
          .catch((error) => {
            this.$refs.fail_add.supplementText = error;
            this.$refs.fail_add.visible = true;
          });
      } else {
        if (this.countSameNameNodes().length > 0) {
          let exit = false;
          this.countSameNameNodes().forEach((node) => {
            if (node[this.treeProps.value] !== this.id) {
              this.$refs.fail_name.visible = true;
              exit = true;
            }
          });
          if (exit) {
            return;
          }
        }

        this.loading = true;
        const dataArr = this.api.params.showParentId
          ? { parentId: this.parentId }
          : { pid: this.parentId };
        let dataInfo = {};
        if (title === '新增群防共治类型' || title === '修改群防共治类型') {
          dataInfo = {
            id: this.id,
            name: this.name,
            remark: this.remark,
            platformTypeId: this.platformTypeId,
            type_flag: 2,
            // 当parentId小于0时，是群防共治类型自定义的id 并非数据库中存储id
            parentId: this.parentId < 0 ? 0 : this.parentId,
            iconId: this.api.paramsIconId.iconId
          };
        } else {
          dataInfo = {
            id: this.id,
            name: this.name,
            remark: this.remark,
            ...dataArr,
            iconId: this.api.paramsIconId.iconId
          };
        }
        const request = {
          method: 'post',
          url: this.api.update,
          baseURL: window.SITE_CONFIG.baseUrl,
          headers: {
            'Content-Type': 'application/json; charset=utf-8',
            token: this.$cookie.get('token'),
          },
          data: dataInfo,
        };

        axios(request)
          .then((response) => {
            this.loading = false;
            if (response.data.code === 0 || response.data.errorcode) {
              this.$refs.dialog.visible = false;
              this.$emit('update');
              this.$message.success(`${this.title}成功！`);
            } else {
              this.$refs.fail_update.supplementText = `错误信息：${response.data.msg}`;
              this.$refs.fail_update.visible = true;
            }
          })
          .catch((error) => {
            this.$refs.fail_update.supplementText = error;
            this.$refs.fail_update.visible = true;
          });
      }
    },

    /**
     * @method
     * @desc 找出树形中有多少个同名的节点
     * @return { Array } 同名的节点
     */
    countSameNameNodes() {
      const count = [];
      const findAllChildren = (list) => {
        list.forEach((node) => {
          if (node[this.treeProps.label] === this.name) {
            count.push(node);
          }
          if (node[this.treeProps.children]) {
            findAllChildren(node[this.treeProps.children]);
          }
        });
      };
      findAllChildren(this.treeList);
      return count;
    },
    selectChange(data) {
      this.platformTypeId = data.platformTypeId ? data.platformTypeId : '';
    },
    // 选择样式
    selectStyleFun() {
      this.$emit('selectStyleFun', this.type);
    }
  },
};
</script>

<style lang="scss" scoped>
.sv-dialog-tree {
    &__container {
        padding: 10px;
        width: 350px;
    }

    &__item {
        display: flex;
        width: 100%;
        align-items: center;

        &:not(:last-child) {
            margin-bottom: 10px;
        }

        &__label {
            display: inline-block;
            width: 75px;
        }

        &__input {
            flex-grow: 1;
        }
    }
}
.selectStyle{
  cursor: pointer;
  color: #0091ff;
}
.graph{
  position:relative;
  &>img{
    &:nth-child(1){
      position: absolute;
      top: -5px;
      right: -5px;
      cursor: pointer;
    }
    &:nth-child(2){
      width: 20px;
      height: 20px;
    }
  }
}
</style>
