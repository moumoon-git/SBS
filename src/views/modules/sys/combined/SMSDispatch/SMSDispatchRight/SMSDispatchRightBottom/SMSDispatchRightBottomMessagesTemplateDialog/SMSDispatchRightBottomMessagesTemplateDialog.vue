<template>
  <sv-dialog
    ref="dialog"
    title="短信模板"
    @cancel="close"
    @modal="close"
  >
    <div
      v-loading="isSubmitting"
      element-loading-spinner="sv-loading"
      :class="$style.dialog"
    >
      <!-- A. 左边树形 -->
      <div
        v-loading="treeLoading"
        :class="['sv-tree', $style.left]"
        element-loading-spinner="sv-loading"
      >
        <div :class="$style.addGroup">
          <div
            :class="$style.addBtn"
            @click="handleTreeNodeAdd('add')"
          >
            ＋ 新建分组
          </div>
          <div
            :class="$style.addBtn"
            @click="handleTempAdd({})"
          >
            ＋ 添加模板
          </div>
        </div>
        <el-tree
          ref="tree"
          :current-node-key="0"
          :data="treeList"
          :expand-on-click-node="false"
          node-key="id"
          :props="treeProps"
          :highlight-current="true"
          @node-click="treeClick"
        >
          <div slot-scope="{ node, data }" class="sv-tree-node">
            <div class="label">{{ node.label }}</div>
            <div class="button">
              <sv-table-operation
                :display="data.id === 0 ? [] : ['edit', 'delete']"
                @delete="handleTreeNodeDelete(data)"
                @edit="handleTreeNodeAdd('edit', data, node)"
              />
            </div>
          </div>
        </el-tree>
        <AddOrEditDialog
          ref="AddOrEditDialog"
          @refresh-messages-group="getTreeList"
        />
      </div>
      <!-- B. 中间列表 -->
      <div :class="$style.middle">
        <div :class="$style.title">
          短信模板列表
        </div>
        <el-scrollbar
          ref="smsScroll"
          :vertical="false"
          :class="$style.middle__scroll"
        >
          <ul
            v-infinite-scroll="scrollEvent"
            :class="$style.middle__list"
          >
            <li
              v-for="(item,index) in oneList"
              :key="item.id"
              :class="idx === index
                ? $style.middle__list__active
                : $style.middle__list__item"
              @click="detailHandle('check', index, item)"
            >
              <div :class="$style.middle__list__item__label">
                {{ item.templateId }}
              </div>
              <div class="button">
                <sv-table-operation
                  :display="['edit', 'delete']"
                  @edit="detailHandle('edit', index, item)"
                  @delete="handleTempDelete(item)"
                />
              </div>
            </li>
          </ul>
        </el-scrollbar>
      </div>
      <!-- C. 右边编辑 -->
      <div
        v-if="firstInto"
        :class="$style.rightNone"
      >
        请选择短信模板
      </div>
      <div
        v-else
        :class="$style.right"
      >
        <div :class="$style.title">
          {{ isEditingAdding ? '新增短信模板' : checkOrEdit === 'check' ? '查看短信模板' : '编辑短信模板' }}
        </div>
        <div :class="$style.item">
          <label>模板名称：</label>
          <div>
            <sv-input-search
              v-model="editingName"
              :suffix="false"
              width="100%"
              :clearable="checkOrEdit === 'check' ? false : true"
              :readonly="checkOrEdit === 'check' ? true : false"
            />
          </div>
        </div>
        <div :class="$style.item">
          <label>所属分组：</label>
          <div>
            <SelectGroup
              v-model="editingParentId"
              :name="editingParentName"
              :check="checkOrEdit === 'check' ? true : false"
            />
          </div>
        </div>
        <div :class="$style.item">
          <label>模板内容：</label>
          <div>
            <sv-textarea
              v-model="editingContent"
              :rows="7"
              placeholder="请输入短信内容"
              :maxlength="500"
              :scroll="true"
              :readonly="checkOrEdit === 'check' ? true : false"
            />
            <div
              :style="{
                'float': 'right',
                'color': editingContent && editingContent.toString().length === 500
                  ? '#F66E6E' : '#666666',
              }"
            >
              {{ editingContent?editingContent.toString().length : 0 }}/500字
            </div>
          </div>
        </div>
        <div :class="$style.footer">
          <sv-button @click="close">
            取消
          </sv-button>
          <sv-button
            v-if="isEditingAdding"
            @click="addTemplate"
          >
            保存
          </sv-button>
          <sv-button
            v-else-if="checkOrEdit === 'edit'"
            type="primary"
            @click="updateTemplate"
          >
            保存
          </sv-button>
          <sv-button
            v-else-if="checkOrEdit === 'check'"
            type="primary"
            @click="chooseTemplate"
          >
            选取模板
          </sv-button>
        </div>
      </div>
    </div>
    <template #footer>
      <span />
    </template>
  </sv-dialog>
</template>

<script>
import SMSDispatchSelectTemplateGroup from '../SMSDispatchSelectTemplateGroup/SMSDispatchSelectTemplateGroup.vue';
import SMSDispatchRightBottomMessagesTemplateAddOrEditDialog from './SMSDispatchRightBottomMessagesTemplateAddOrEditDialog.vue';

export default {
  name: 'SMSDispatchRightBottomMessagesTemplateDialog',

  components: {
    SelectGroup: SMSDispatchSelectTemplateGroup,
    AddOrEditDialog: SMSDispatchRightBottomMessagesTemplateAddOrEditDialog,
  },

  data() {
    return {
      // 弹窗是否可见
      visible: false,
      // 树形数据加载中
      treeLoading: false,
      // 树形数据
      treeList: [],
      // 树形配置
      treeProps: {
        children: 'children',
        label: 'name',
        value: 'id',
      },
      // 选中的短信模板
      selectedTemplate: {},
      // 正在编辑的模板名称
      editingName: '新增模板',
      // 正在编辑的所属分组id
      editingParentId: 0,
      // 正在编辑的所属分组名称
      editingParentName: '顶级分组',
      // 正在编辑的模板内容
      editingContent: '',
      // 正在编辑新增
      isEditingAdding: true,
      // 正在提交数据
      isSubmitting: false,
      // 短信模板列表
      oneList: [],
      idx: '', // 判断是否选中
      currentTreeId: '', // 当前选中模板Id
      currNode: {}, // 当前选中模板分组
      checkOrEdit: 'edit', // 查看/编辑模板
      page: 1, // 当前页数
      totalPages: 1, // 短信模板总页数
      firstInto: true, // 是否第一次进入模板
    };
  },

  mounted() {
    this.getTreeList();
  },

  methods: {
    /**
     * @description 打开弹窗
     */
    init() {
      this.$refs.dialog.visible = true;
      this.oneList = [];
      this.getTreeList();
      this.idx = '';
      this.treeClick({});
      this.firstInto = true;
      this.$nextTick(() => {
        this.$refs.smsScroll.wrap.addEventListener('scroll', this.scrollEvent); // 滑动底部自动加载
      });
    },

    /**
     * @description 关闭弹窗
     */
    close() {
      this.$refs.dialog.visible = false;
      this.reset();
    },

    reset() {
      this.selectedTemplate = {};
      this.isEditingAdding = true;
      this.checkOrEdit = 'add';
      this.editingName = '新增模板';
      this.editingParentId = 0;
      this.editingParentName = '顶级分组';
      this.editingContent = '';
      this.handleTempAdd({});
      this.treeClick({});
    },

    /**
     * @description 获取树形数据
     */
    getTreeList() {
      this.treeLoading = true;
      const request = {
        method: 'post',
        baseURL: window.SITE_CONFIG.event,
        url: '/smsTemplateType/tree',
        data: {},
      };
      this.$http(request)
        .then(({ data: response }) => {
          if (response.code === 0) {
            this.treeList = [...response.data];
            this.treeList.splice(0, 0, {
              id: 0,
              name: '顶级分组',
              pid: 0,
            });
          }
        })
        .finally(() => { this.treeLoading = false; });
    },

    /**
     * @description 树节点点击
     * @param { Object } node 节点数据
     */
    treeClick(node, type) {
      // 初次加载、搜索时清空数据
      if (type !== 'load') {
        this.oneList = [];
        this.page = 1;
      }
      this.currNode = node;
      this.idx = '';
      const request = {
        method: 'post',
        baseURL: window.SITE_CONFIG.event,
        url: '/smsTemplate/getList',
        data: {
          page: this.page, // 页码
          size: 10, // 每页数量
          id: node.id, // 分组id，不传或0则查全部
          includeLowerLevel: node.id === 0 ? 0 : 1, // 是否包含下级节点，1 是，其他否 },
        },
      };
      this.$http(request).then(({ data: response }) => {
        if (response.code === 0) {
          const contentItem = response.data.data;
          contentItem.forEach((element) => {
            this.oneList.push(element);
          });
          this.totalPages = response.data.totalPages; // 总页数
        } else {
          this.$message.error(`删除失败，错误信息：${response.msg}`);
        }
      });
    },

    /**
     * @description 删除树节点
     * @param { Object } node 节点数据
     */
    handleTreeNodeDelete(node) {
      this.treeClick(node);
      this.$confirm(
        '确定要删除吗？其下属模板也会一并删除，且数据不可恢复',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        },
      ).then(() => {
        const ids = [];
        const findChildren = (parent) => {
          ids.push(parent.id);
          if (parent.children) {
            parent.children.forEach((child) => {
              findChildren(child);
            });
          }
        };
        findChildren(node);

        const request = {
          method: 'post',
          baseURL: window.SITE_CONFIG.event,
          url: '/smsTemplateType/delete',
          data: { ids },
        };
        this.$http(request).then(({ data: response }) => {
          if (response.code === 0) {
            this.$message.success('删除成功');
            this.getTreeList();
          } else {
            this.$message.error(`删除失败，错误信息：${response.msg}`);
          }
        });
      }).catch(() => {});
    },
    /**
     * @description 删除模板
     * @param { Object } item 模板数据
     */
    handleTempDelete(item) {
      this.$confirm(
        '确定要删除模板吗？',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        },
      ).then(() => {
        const request = {
          method: 'post',
          baseURL: window.SITE_CONFIG.event,
          url: '/smsTemplate/delete',
          data: { ids: [item.id] },
        };
        this.$http(request).then(({ data: response }) => {
          if (response.code === 0) {
            this.$message.success('删除成功');
            this.treeClick(this.currNode);
            this.handleTempAdd({});
            this.checkOrEdit = 'edit';
          } else {
            this.$message.error(`删除失败，错误信息：${response.msg}`);
          }
        });
      }).catch(() => {});
    },
    /**
     * @description 新增模板
     */
    handleTempAdd(node) {
      this.isEditingAdding = true;
      this.firstInto = false;
      this.checkOrEdit = 'add';
      this.selectedTemplate = {};
      this.$refs.tree.setCurrentKey(this.currNode.id);
      this.editingName = '新增模板';
      this.editingParentId = this.currNode.id || 0;
      this.editingParentName = this.currNode.name || '顶级分组';
      this.editingContent = '';
      this.idx = '';
    },

    /**
     * @description 新增模板分组
     */
    handleTreeNodeAdd(type, data, node) {
      if (type === 'add') {
        this.$refs.AddOrEditDialog.init(type, data, '');
      } else {
        this.$refs.AddOrEditDialog.init(type, data, node.parent ? node.parent.label : '');
      }
    },

    /**
     * @description 选取模板
     */
    chooseTemplate() {
      this.$emit('choose-template', this.editingContent);
      this.close();
    },

    /**
     * @description 保存编辑更新
     */
    updateTemplate() {
      // 提交数据验证
      if (this.editingName.length === 0) {
        this.$message.error('请输入模板名称');
        return;
      }
      if (this.editingContent.length === 0) {
        this.$message.error('请输入模板内容');
        return;
      }
      // 开启动画
      this.isSubmitting = true;
      // 提交数据
      const request = {
        method: 'post',
        baseURL: window.SITE_CONFIG.event,
        url: '/smsTemplate/update',
        data: {
          data: {
            templateId: this.editingName,
            templateContent: this.editingContent,
            typeIds: [this.editingParentId],
            id: this.currentTreeId,
          },
        },
      };
      this.$http(request)
        .then(({ data: response }) => {
          if (response.code === 0) {
            this.$message.success('更新短信模板成功');
            this.selectedTemplate = {
              ...this.selectedTemplate,
              content: this.editingContent,
              parentId: this.editingParentId,
              parentName: this.editingParentName,
              name: this.editingName,
            };
            this.getTreeList(this.currNode);
            this.reset();
          } else {
            this.$message.error(`保存失败，错误信息：${response.msg}`);
          }
        })
        .catch((error) => { this.$message.error(`保存失败，错误信息：${error}`); })
        .finally(() => { this.isSubmitting = false; });
    },

    /**
     * @description 新增
     */
    addTemplate() {
      // 提交数据验证
      if (this.editingName.length === 0) {
        this.$message.error('请输入模板名称');
        return;
      }
      if (this.editingContent.length === 0) {
        this.$message.error('请输入模板内容');
        return;
      }
      // 开启动画
      this.isSubmitting = true;
      // 提交数据
      const request = {
        method: 'post',
        baseURL: window.SITE_CONFIG.event,
        url: '/smsTemplate/add',
        data: {
          data: {
            templateContent: this.editingContent,
            typeIds: [this.editingParentId],
            templateId: this.editingName,
          },
        },
      };
      this.$http(request)
        .then(({ data: response }) => {
          if (response.code === 0) {
            this.$message.success('新增短信模板成功');
            this.getTreeList(this.currNode);
            this.reset();
          } else {
            this.$message.error(`保存失败，错误信息：${response.msg}`);
          }
        })
        .catch((error) => { this.$message.error(`保存失败，错误信息：${error}`); })
        .finally(() => { this.isSubmitting = false; });
    },
    /**
     * @description 选择模板
     */
    detailHandle(type, index, item) {
      this.firstInto = false;
      this.checkOrEdit = type;
      this.idx = index;
      this.currentTreeId = item.id;
      this.isEditingAdding = false;
      this.selectedTemplate = item; // 模板内容
      this.editingName = item.templateId; // 模板名称
      this.editingContent = item.templateContent; // 模板内容
      this.editingParentId = this.currNode.id || 0; // 所属分组id
      this.editingParentName = this.currNode.name || '顶级分组'; // 所属分组名字
    },
    // 滚动底部加载数据
    scrollEvent() {
      let scrollHeight = '';
      let scrollTop = '';
      let clientHeight = '';
      scrollHeight = this.$refs.smsScroll.wrap.scrollHeight;
      scrollTop = this.$refs.smsScroll.wrap.scrollTop;
      clientHeight = this.$refs.smsScroll.wrap.clientHeight;
      if (scrollHeight - scrollTop === clientHeight) {
        if (this.page < this.totalPages) {
          this.page += 1;
          this.treeClick(this.currNode, 'load');
        }
      }
    },
  },
};
</script>

<style lang="scss" module>
.dialog {
  width: 800px;
  height: 450px;
  display: flex;

  .left {
    width: 220px;
    height: 100%;
    border-right: 1px solid #F2F2F2;

    .addGroup {
      display: flex;
      justify-content: center;
      align-items: center;
      .addBtn {
        cursor: pointer;
        height: 40px;
        background: #F1F6FF;
        color: #0091FF;
        line-height: 40px;
        text-align: center;
        font-size: 14px;
        border: 1px dashed #DAE7F8;
        border-radius: 4px;
        margin: 10px;
        &:hover {
          border-color: #0091FF;
        }
      }
    }
  }

  .middle {
    width: 220px;
    border-left: 1px solid #F2F2F2;
    border-right: 1px solid #F2F2F2;

    .title {
      display: inline-block;
      font-weight: bold;
      height: 14px;
      line-height: 14px;
      padding-left: 20px;
      border-left: 3px solid #0091FF;
    }
    &__scroll {
      height: 430px;
    }
    &__list {
      height: 92%;
      list-style-type: none;
      margin: 0;
      padding: 0;

      &__item {
        border: 1px solid #E4E4E4;
        border-radius: 4px;
        cursor: pointer;
        color: #333333;
        padding: 0 10px;
        height: 30px;
        line-height: 30px;
        font-size: 14px;
        margin: 10px;
        position: relative;

        &:hover {
          border-color: #0091FF;
        }

        &:before {
          content: '';
          position: absolute;
          right: 0;
          top: 0;
          width: 50px;
          height: 50px;
        }

        &__label {
          white-space: nowrap;
          width: calc(100% - 60px);
          text-overflow: ellipsis;
          overflow: hidden;
        }

        & > div:nth-child(2) {
          display: none;
          position: absolute;
          right: 10px;
          top: 50%;
          transform: translateY(-50%);
        }

        &:hover > div:nth-child(2) {
          display: block;
        }
      }

      &__active {
        border: 1px solid #E4E4E4;
        border-radius: 4px;
        cursor: pointer;
        color: #333333;
        padding: 0 10px;
        height: 30px;
        line-height: 30px;
        font-size: 14px;
        margin: 10px;
        position: relative;
        border-color: #0091FF;
        background: rgba(0, 145, 255, 0.1);
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
    }
  }
  .rightNone{
    width: 500px;
    height: 100%;
    flex: 1;
    text-align: center;
    line-height: 450px;
  }
  .right {
    width: 500px;
    height: 100%;
    flex: 1;

    .title {
      margin: 27px 10px;
      font-weight: bold;
      font-size: 16px;
      height: 16px;
      line-height: 16px;
      padding-left: 20px;
      border-left: 3px solid #0091FF;
    }

    .item {
      display: flex;
      margin: 10px;

      & > label {
        font-weight: bold;
        color: #333333;
        width: 80px;
        flex-shrink: 0;
        line-height: 30px;
      }

      & > div {
        flex-grow: 1;
        line-height: 30px;
      }
    }
  }

  .footer {
    text-align: center;
    line-height: 50px;
    height: 50px;
    margin-top: -10px;
  }
}
</style>
