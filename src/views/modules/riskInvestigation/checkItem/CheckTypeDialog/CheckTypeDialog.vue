<template>
  <div>
    <sv-dialog
      ref="dialog"
      title="检查类型"
      @cancel="$refs.dialog.visible = false"
      @modal="$refs.dialog.visible = false"
    >
      <div
        v-loading="loading"
        class="check-type-dialog"
      >
        <div @click="handleTreeNodeAdd({})">
          ＋&nbsp;新增类型
        </div>
        <div class="sv-tree">
          <el-tree
            :data="treeList"
            :props="{
              children: 'children',
              label: 'name',
            }"
          >
            <div
              slot-scope="{ node, data }"
              class="sv-tree-node"
            >
              <div class="label">
                {{ node.label }}
              </div>
              <div class="button">
                <slot name="tree__operation">
                  <sv-table-operation
                    :display="['cross', 'edit', 'delete']"
                    @delete="handleTreeNodeDelete(data)"
                    @edit="handleTreeNodeEdit(data)"
                    @cross="handleTreeNodeAdd(data)"
                  />
                </slot>
              </div>
            </div>
          </el-tree>
        </div>
      </div>
      <template #footer>
        <span />
      </template>
    </sv-dialog>
    <sv-dialog
      ref="addOrEditDialog"
      :title="currentId ? '编辑类型' : '新增类型'"
      @cancel="handleCancel"
      @modal="handleCancel"
      @confirm="handleConfirm"
    >
      <div class="check-type-dialog__dialog">
        <div>
          <span>类型名称：</span>
          <sv-input-search
            v-model="currentTypeName"
            width="100%"
            :suffix="false"
          />
        </div>
        <div>
          <span>所属分组：</span>
          <sv-select-group
            v-model="currentParentId"
            api="/work/workProperty/treelist?module=1"
            :top="true"
            :name="currentParentName"
          />
        </div>
      </div>
    </sv-dialog>
  </div>
</template>

<script>
export default {
  name: 'CheckTypeDialog',
  data() {
    return {
      loading: false,
      treeList: [],
      currentId: 0,
      currentParentId: 0,
      currentParentName: '顶级分组',
      currentTypeName: '新增类型',
      // 新增还是编辑
      isAdding: true,
    };
  },
  methods: {
    /**
     * 打开弹窗
     */
    open() {
      this.$refs.dialog.visible = true;
      this.getTreeList();
    },
    /**
     * 获取树形列表
     */
    getTreeList() {
      const request = {
        method: 'get',
        url: this.$http.adornUrl('/work/workProperty/treelist'),
        params: {
          module: '1',
        },
      };
      this.loading = true;
      this.$http(request)
        .then((response) => {
          if (response.data.code === 0 && response.data.data) {
            this.treeList = response.data.data;
          } else {
            this.$message.error(`获取树形列表数据失败！错误代码${response.data.code}，错误信息：${response.data.msg}`);
          }
        })
        .catch((error) => {
          this.$message.error(`获取树形列表数据失败！错误信息：${error}`);
        })
        .finally(() => { this.loading = false; });
    },
    /**
     * 删除节点
     * @param {Object} node
     */
    handleTreeNodeDelete(node) {
      this.$confirm(`确定删除节点【${node.name}】？子孙节点将一并删除，且数据无法恢复`)
        .then(() => {
          const ids = [];
          const findAllChildren = (parent) => {
            ids.push(parent.id);
            if (parent.children && parent.children.length) {
              parent.children.forEach((child) => {
                findAllChildren(child);
              });
            }
          };
          findAllChildren(node);
          const request = {
            method: 'post',
            baseURL: window.SITE_CONFIG.baseUrl,
            url: '/work/workProperty/delete',
            data: {
              ids,
            },
          };
          this.$http(request).then((response) => {
            if (response.data.code === 0) {
              this.$message.success('删除成功');
              this.handleCancel();
              this.getTreeList();
              this.$emit('refresh-type');
            } else {
              this.$message.error(`删除失败，错误代码${response.data.code}，错误信息：${response.data.msg}`);
            }
          }).catch((error) => {
            this.$message.error(`删除失败，错误信息：${error}`);
          });
        })
        .catch(() => {});
    },
    /**
     * 编辑节点
     * @param {Object} node
     */
    handleTreeNodeEdit(node) {
      this.currentId = node.id;
      this.currentParentId = node.parentId || 0;
      this.currentParentName = node.parentName || '顶级分组';
      this.currentTypeName = node.name;
      this.$refs.addOrEditDialog.visible = true;
    },
    /**
     * 新增节点
     * @param {Object} node
     */
    handleTreeNodeAdd(node) {
      this.currentId = 0;
      this.currentParentId = node.id || 0;
      this.currentParentName = node.name || '顶级分组';
      this.currentTypeName = '新建类型';
      this.$refs.addOrEditDialog.visible = true;
    },
    /**
     * 关闭新增、编辑弹窗，初始化数据
     */
    handleCancel() {
      this.$refs.addOrEditDialog.visible = false;
      this.currentId = 0;
      this.currentParentId = 0;
      this.currentParentName = '顶级分组';
      this.currentTypeName = '新建类型';
    },
    /**
     * 确认新增或编辑
     */
    handleConfirm() {
      const request = {
        method: 'post',
        baseURL: window.SITE_CONFIG.baseUrl,
        url: '/work/workProperty/save',
        data: {
          name: this.currentTypeName,
          parentId: this.currentParentId,
          module: 1,
        },
      };
      if (this.currentId) {
        request.url = '/work/workProperty/update';
        request.data.id = this.currentId;
      }
      this.$http(request).then((response) => {
        if (response.data.code === 0) {
          this.handleCancel();
          this.getTreeList();
          this.$emit('refresh-type');
        } else {
          this.$message.error(`${this.currentId ? '更新' : '新增'}失败，错误代码${response.data.code}，错误信息：${response.data.msg}`);
        }
      }).catch((error) => {
        this.$message.error(`${this.currentId ? '更新' : '新增'}失败，错误信息：${error}`);
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.check-type-dialog {
  width: 400px;
  height: 500px;
  & > div:first-child {
    text-align: center;
    padding: 5px;
    margin: 5px;
    border: 1px dashed currentColor;
    color: #0091FF;
    border-radius: 4px;
    user-select: none;
    cursor: pointer;
    font-size: 16px;
    &:hover {
      opacity: .8;
    }
  }
  .sv-tree {
    height: calc(100% - 36px);
  }
  &__dialog {
    padding: 10px;
    width: 300px;
    & > div {
      display: flex;
      margin: 5px 0;
      align-items: center;
      & > span {
        flex-shrink: 0;
      }
    }
  }
}
</style>
