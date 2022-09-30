<template>
  <div class="sv-dialog-tree">
    <sv-dialog
      ref="dialog"
      :title="type == 'add' ? '新增分组' : '编辑分组'"
      @cancel="$refs.dialog.visible = false"
      @modal="$refs.dialog.visible = false"
      @confirm="handleSubmit"
    >
      <div
        v-loading="loading"
        element-loading-spinner="sv-loading"
        class="sv-dialog-tree__container"
      >
        <div class="sv-dialog-tree__item">
          <span class="sv-dialog-tree__item__label">分组名称：</span>
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
          <span class="sv-dialog-tree__item__label">所属分组：</span>
          <div class="sv-dialog-tree__item__input">
            <sv-select-group
              v-model="parentId"
              :api="api.list"
              :top="true"
              :name="parentName"
              :params="api.params"
            />
          </div>
        </div>
        <div class="sv-dialog-tree__item">
          <span
            class="sv-dialog-tree__item__label"
            style="position: relative; bottom: 2px;"
          >分组描述：</span>
          <div class="sv-dialog-tree__item__input">
            <sv-textarea
              v-model="remark"
              placeholder="请输入描述"
            />
          </div>
        </div>
      </div>
    </sv-dialog>
    <sv-dialog-hint
      ref="hint"
      type="normal"
      text="分组名称不能为空！"
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
      text="所属分组不能为自身，请重新选择所属分组"
    />
    <!-- <sv-dialog-hint
      ref="fail_name"
      type="fail"
      text="分组名称重复"
    /> -->
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
      // 弹窗类型：add or edit
      type: '',
      loading: false,
      id: '',
      name: '',
      // 所属分组名称
      parentName: '',
      parentId: '',
      remark: '',
    };
  },

  methods: {
    /**
     * @method
     * @desc 打开弹窗
     */
    init(type, data) {
      this.type = type;
      if (type === 'add') {
        this.name = '';
        this.parentName = data ? data.name : '顶级分组';
        this.parentId = data ? data.id : 0;
        this.remark = '';
      } else {
        this.id = data.id;
        this.name = data.name;
        this.parentName = data.parentName;
        this.parentId = data.parentId;
        this.remark = data.remark;
      }
      this.$refs.dialog.visible = true;
    },

    /**
     * @method
     * @desc 提交结果
     */
    handleSubmit() {
      if (this.name === null || this.name === '' || this.name === undefined) {
        this.$refs.hint.visible = true;
        return;
      }
      if (this.type === 'add') {
        // if (this.countSameNameNodes().length > 0) {
        //   this.$refs.fail_name.visible = true;
        //   return;
        // }

        this.loading = true;
        const dataArr = this.api.params !== undefined
          ? {
            pid: this.parentId,
            deviceType: this.api.params.deviceType,
          }
          : {
            parentId: this.parentId,
          };
        const request = {
          method: 'post',
          url: this.api.add,
          baseURL: window.SITE_CONFIG.baseUrl,
          headers: {
            'Content-Type': 'application/json; charset=utf-8',
            token: this.$cookie.get('token'),
          },
          data: {
            name: this.name,
            remark: this.remark,
            ...dataArr,
          },
        };

        axios(request)
          .then((response) => {
            this.loading = false;
            if (response.data.code === 0 || response.data.errorcode === 0) {
              this.$refs.dialog.visible = false;
              this.$emit('update');
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
        // 限制编辑时，当前分组不能和所属分组相同
        if (this.id === this.parentId) {
          this.$refs.fail_updateGroup.visible = true;
          return;
        }
        // if (this.countSameNameNodes().length > 0) {
        //   let exit = false;
        //   this.countSameNameNodes().forEach((node) => {
        //     if (node[this.treeProps.value] !== this.id) {
        //       this.$refs.fail_name.visible = true;
        //       exit = true;
        //     }
        //   });
        //   if (exit) {
        //     return;
        //   }
        // }

        this.loading = true;
        const dataArr = this.api.params !== undefined
          ? {
            pid: this.parentId,
            deviceType: this.api.params.deviceType,
          }
          : {
            parentId: this.parentId,
          };
        const request = {
          method: 'post',
          url: this.api.update,
          baseURL: window.SITE_CONFIG.baseUrl,
          headers: {
            'Content-Type': 'application/json; charset=utf-8',
            token: this.$cookie.get('token'),
          },
          data: {
            id: this.id,
            name: this.name,
            remark: this.remark,
            ...dataArr,
          },
        };

        axios(request)
          .then((response) => {
            this.loading = false;
            if (response.data.code === 0 || response.data.errorcode) {
              this.$refs.dialog.visible = false;
              this.$emit('update');
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
</style>
