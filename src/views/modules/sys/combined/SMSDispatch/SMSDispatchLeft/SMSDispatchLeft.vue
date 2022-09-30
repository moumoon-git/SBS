<template>
  <div :class="$style.wrapper">
    <!-- A. 分组列表 -->
    <div :class="$style.tree">
      <!-- A-1. 分组切换按钮 -->
      <sv-tree-tab
        :tab-list="['通讯录分组', '短信分组']"
        @switch="tabSwitch($event)"
      />
      <!-- A-2. 搜索框 -->
      <div :class="$style.header">
        <sv-input-tree-search
          v-model.lazy="searchKeyword"
          :class="$style.search"
          width="calc(100% - 20px)"
          @change="handleSearchKeywordChange"
        />
        <!-- 短信分组下新增分组按钮 -->
        <sv-table-operation
          v-if="groupType === 'messages'"
          :display="['cross']"
          style="width: 30px"
          @cross="handleTreeNodeAdd({})"
        />
      </div>
      <!-- A-3. 树形快捷按钮 -->
      <div
        :class="[
          $style.shortcut,
          { [$style['shortcut--active']]: activeShortcut === 1 },
        ]"
        @click="handleCommonlyUsedClick(true)"
      >
        常用联系人
      </div>
      <div
        :class="[
          $style.shortcut,
          { [$style['shortcut--active']]: activeShortcut === 2 },
        ]"
        @click="handleRecentContactsClick"
      >
        最近联系人
      </div>
      <template v-if="groupTreeData.length">
        <div
          :class="[
            $style.shortcut,
            { [$style['shortcut--active']]: activeShortcut === 3 },
          ]"
          @click="handleAllClick"
        >
          全部
        </div>
        <!-- A-4. 树形 -->
        <div
          v-loading="isGroupTreeLoading"
          element-loading-spinner="sv-loading"
          :class="['sv-tree', $style.treeScroll]"
        >
          <el-tree
            ref="groupTree"
            node-key="id"
            :data="groupTreeData"
            :highlight-current="true"
            :props="groupTreeProps"
            :pager-count="5"
            :small="true"
            @node-click="handleGroupTreeNodeClick"
          >
            <div slot-scope="{ node, data }" class="sv-tree-node">
              <div class="label">{{ node.label }}</div>
              <div v-if="groupType === 'messages'" class="button">
                <slot name="tree__operation">
                  <sv-table-operation
                    v-if="data.id != 0"
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
      </template>
      <div :class="$style.treeScroll" v-else>
        <div
          :class="[
            $style.title,
          ]"
        >
          部门单位
        </div>
        <!-- A-4. 树形 -->
        <div
          element-loading-spinner="sv-loading"
          style="height:auto;"
          :class="['sv-tree']"
        >
          <el-tree
            ref="groupTree"
            node-key="id"
            :data="groupTree"
            :highlight-current="true"
            :props="groupTreeProps"
            :pager-count="5"
            :small="true"
            @node-click="handleGroupTreeNodeClick"
          >
            <div slot-scope="{ node, data }" class="sv-tree-node">
              <div class="label">{{ node.label }}</div>
              <div v-if="groupType === 'messages'" class="button">
                <slot name="tree__operation">
                  <sv-table-operation
                    v-if="data.id != 0"
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
        <div
          :class="[
            $style.title,
          ]"
        >
          人员列表
        </div>
        <el-checkbox-group
          v-model="checkedContactsIdList"
          :class="$style.search_checkGroupList"
        >
          <!-- <el-checkbox>的label attribute取值不支持Object，需要转换成String -->
          <el-checkbox
            v-for="(contact, index) in mailContacotor"
            :key="`contact_${index}`"
            :class="$style.checkboxItem"
            :label="contact.id"
            border
            size="medium"
            @change="handleCheckChange($event, contact)"
          >
            <div :class="$style.contactName">
              {{ contact.name || contact.mobile1 || contact.phone || '-' }}
              {{ contact.position ? `（${contact.position}）` : '' }}
            </div>
            <div :class="$style.workUnit">
              {{ contact.workUnit || '暂无单位信息' }}
            </div>
          </el-checkbox>
        </el-checkbox-group>
      </div>
    </div>
    <!-- B. 联系人列表 -->
    <div
      v-loading="isContactsListLoading"
      element-loading-spinner="sv-loading"
      :class="$style.contactList"
    >
      <!-- B.1 头部标题和全选按钮 -->
      <div :class="$style.header">
        <span :class="$style.title">联系人列表</span>
        <el-checkbox
          v-model="isCheckAll"
          :indeterminate="isCheckAllIndeterminate"
          style="float: right"
          @change="handleCheckAllChange"
        >
          全选
        </el-checkbox>
      </div>
      <!-- B.2 勾选列表 -->
      <el-checkbox-group
        v-model="checkedContactsIdList"
        :class="$style.checkGroupList"
      >
        <!-- <el-checkbox>的label attribute取值不支持Object，需要转换成String -->
        <el-checkbox
          v-for="(contact, index) in contactListData"
          :key="`contact_${index}`"
          :class="$style.checkboxItem"
          :label="contact.id"
          border
          size="medium"
          @change="handleCheckChange($event, contact)"
        >
          <div :class="$style.contactName">
            {{ contact.name || contact.mobile1 || contact.phone || '-' }}
            {{ contact.position ? `（${contact.position}）` : '' }}
          </div>
          <div :class="$style.workUnit">
            {{ contact.workUnit || '暂无单位信息' }}
          </div>
        </el-checkbox>
      </el-checkbox-group>
      <!-- B.3 分页器 -->
      <div :class="['sv-pagination', $style.footer]">
        <el-pagination
          layout="prev, pager, next"
          :current-page.sync="pageIndex"
          :page-count="pageTotal"
          :pager-count="5"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>

    <!-- 新增/编辑短信分组弹窗 -->
    <AddOrEditDialog
      ref="AddOrEditDialog"
      @refresh-messages-group="getGroupTree"
    />
  </div>
</template>

<script>
import SMSDispatchLeftAddOrEditDialog from './SMSDispatchLeftAddOrEditDialog/SMSDispatchLeftAddOrEditDialog.vue';

export default {
  name: 'SMSDispatchLeft',

  components: {
    AddOrEditDialog: SMSDispatchLeftAddOrEditDialog,
  },

  props: {
    // 收信人列表
    selectedList: {
      type: Array,
      required: true,
    },
  },

  data() {
    return {
      activeShortcut: 3,
      // 分组类型：'contacts'---通讯录分组，'messages'---短信分组
      groupType: 'contacts',
      // 搜索关键词
      searchKeyword: '',
      // 分组树数据
      groupTreeData: [],
      // 搜索分组数据
      groupTree: [],
      // 搜索联系人数据
      mailContacotor: [],
      // 分组树配置
      groupTreeProps: {
        children: 'children',
        label: 'name',
      },
      // 选中的分组及其子孙节点的id集合
      selectedGroupIds: [],
      // 联系人列表数据
      contactListData: [],
      // 联系人列表分页页码
      pageIndex: 1,
      // 联系人列表分页总页数
      pageTotal: 1,
      // 已勾选的联系人列表
      checkedContactsIdList: [],
      checkedContactsObjList: [],
      // 是否全选
      isCheckAll: false,
      // 是否半选
      isCheckAllIndeterminate: false,
      // 分组树载入中动画
      isGroupTreeLoading: false,
      // 联系人列表载入中动画
      isContactsListLoading: false,
    };
  },

  watch: {
    // 切换分组类型，获取对应分组类型数据
    groupType() {
      this.reset();
      this.getGroupTree();
      this.getContactsListData();
    },

    // 换页、点击分组、常用联系人、最近联系人时列表数据改变，判断全选按钮状态
    contactListData() {
      this.validateCheckAll();
    },

    // 收信人列表发生变化
    selectedList(selectedList) {
      this.checkedContactsObjList = [...selectedList];

      // 更新勾选列表
      const newCheckedContactsIdList = [];
      this.checkedContactsObjList.forEach((contact) => {
        const { id } = JSON.parse(contact);
        if (id) {
          newCheckedContactsIdList.push(id);
        }
      });
      this.checkedContactsIdList = [...newCheckedContactsIdList];
      this.validateCheckAll();
    },
  },

  mounted() {
    this.getGroupTree();
    this.getContactsListData();
  },

  methods: {
    /**
     * @description 点击分页的页数改变
     */
    handleCurrentChange() {
      if (this.activeShortcut === 1) {
        // 常用联系人
        this.handleCommonlyUsedClick();
      } else if (this.activeShortcut === 2) {
        // 最近联系人
        this.handleRecentContactsClick();
      } else {
        // 获取联系人列表数据
        this.getContactsListData();
      }
    },
    /**
     * @description 重置初始状态
     */
    reset() {
      this.$refs.groupTree.setCurrentKey(null);
      this.selectedGroupIds = [];
      this.pageIndex = 1;
    },

    /**
     * @description 标签切换
     * @param { Number } tabIndex 标签下标
     */
    tabSwitch(tabIndex) {
      this.activeShortcut = 3;
      this.groupType = tabIndex === 0 ? 'contacts' : 'messages';
    },

    /**
     * @description 获取分组树数据
     */
    getGroupTree() {
      this.isGroupTreeLoading = true;
      // 请求参数
      let request;
      if (this.groupType === 'contacts') {
        const url = this.searchKeyword
          ? '/mail/mailgroup/getSearchGroupOrContactor'
          : '/mail/mailgroup/list';
        request = {
          method: 'get',
          service: 'soc',
          baseURL: window.SITE_CONFIG.baseUrl,
          url,
          params: {
            search: this.searchKeyword,
          },
        };
      } else if (this.groupType === 'messages') {
        request = {
          method: 'post',
          baseURL: window.SITE_CONFIG.baseUrl,
          url: '/message/messageGroup/listTree',
          data: {
            search: this.searchKeyword,
          },
        };
      }

      // 发送请求
      this.$http(request)
        .then(({ data: response }) => {
          if (response.code === 0) {
            if (this.searchKeyword) {
              this.groupTree = response.data.groupTree;
              this.mailContacotor = response.data.mailContacotor;
              this.groupTreeData = [];
            } else {
              this.groupTreeData = [...response.data];
            }
          }
        })
        .finally(() => {
          this.isGroupTreeLoading = false;
        });
    },

    /**
     * @description 搜索栏发生变化
     */
    handleSearchKeywordChange() {
      this.reset();
      // this.getContactsListData();
      this.getGroupTree();
    },

    /**
     * @description 点击“常用联系人”按钮，获取联系人列表数据
     */
    handleCommonlyUsedClick(needReset = false) {
      this.activeShortcut = 1;
      this.isContactsListLoading = true;
      if (needReset) {
        this.reset();
      }
      // 注释原因：替换接口
      // const request = {
      //   method: 'get',
      //   baseURL: window.SITE_CONFIG.baseUrl,
      //   url: '/message/messageinfor/getCommonContract',
      // };
      const request = {
        method: 'post',
        baseURL: window.SITE_CONFIG.baseUrl,
        url: '/mail/mailcontactor/commonContactorList',
        data: this.$http.adornParams({
          page: this.pageIndex,
          limit: 10,
        }),
      };
      this.$http(request)
        .then(({ data: response }) => {
          if (response.code === 0) {
            this.pageTotal = response.data.totalPage;
            this.contactListData = [...response.data.list];
            // 注释原因：替换接口，接口的返回数据格式更改
            // this.contactListData = [...response.data];
          }
        })
        .finally(() => {
          this.isContactsListLoading = false;
        });
    },

    /**
     * @description 点击“最近联系人”按钮，获取联系人列表数据
     */
    handleRecentContactsClick() {
      this.activeShortcut = 2;
      this.isContactsListLoading = true;
      this.reset();
      // 注释原因：替换接口
      // const request = {
      //   method: 'get',
      //   url: `${window.SITE_CONFIG.baseUrl}/message/messageinfor/getCurrentContract`,
      // };
      const request = {
        method: 'get',
        url: `${window.SITE_CONFIG.event}/sms/history/recentlyContact`, // 替换接口
        params: this.$http.adornParams({
          page: this.pageIndex,
          limit: 10,
        }),
      };
      this.$http(request)
        .then(({ data: response }) => {
          if (response.errorcode === 0) {
            this.pageTotal = response.data.totalPage;
            this.contactListData = [...response.data.list];
            // 注释原因：替换接口，接口的返回数据格式更改
            // this.contactListData = [...response.data];
          }
        })
        .finally(() => {
          this.isContactsListLoading = false;
        });
    },

    /**
     * @description 点击“全部”按钮，获取联系人列表数据
     */
    handleAllClick() {
      this.activeShortcut = 3;
      this.reset();
      this.getContactsListData();
    },

    /**
     * @description 点击分组树节点
     * @param { Object } nodeObj 树节点对象
     */
    handleGroupTreeNodeClick(nodeObj) {
      this.activeShortcut = 0;
      // 被点击节点及其所有子孙节点的id集合
      const ids = [];
      /**
       * @function
       * @description 递归遍历获取所有子孙节点的id
       */
      const findAllDescendant = (node) => {
        ids.push(node.id);
        if (node.children) {
          node.children.forEach((child) => {
            findAllDescendant(child);
          });
        }
      };
      findAllDescendant(nodeObj);
      // 获取联系人列表数据
      this.selectedGroupIds = ids;
      this.pageIndex = 1;
      this.getContactsListData();
    },

    /**
     * @description 获取联系人列表数据
     */
    getContactsListData() {
      this.isContactsListLoading = true;
      if (this.groupType === 'contacts') {
        const request = {
          method: 'post',
          baseURL: window.SITE_CONFIG.baseUrl,
          url: '/mail/mailcontactor/list',
          data: {
            limit: 10,
            page: this.pageIndex,
            groupId: this.selectedGroupIds,
          },
        };
        this.$http(request)
          .then(({ data: response }) => {
            if (response.code === 0) {
              this.pageTotal = response.data.totalPage;
              this.contactListData = [...response.data.list];
            }
          })
          .finally(() => {
            this.isContactsListLoading = false;
          });
      } else if (this.groupType === 'messages') {
        const request = {
          method: 'post',
          baseURL: window.SITE_CONFIG.baseUrl,
          url: '/message/messageGroup/selectById',
          data: {
            limit: 10,
            page: this.pageIndex,
            // id: this.selectedGroupIds.join(','),
            id: this.selectedGroupIds,
            search: this.searchKeyword,
          },
        };
        this.$http(request)
          .then(({ data: response }) => {
            if (response.code === 0) {
              this.pageTotal = response.page.totalPage;
              this.contactListData = [...response.page.list];
            }
          })
          .finally(() => {
            this.isContactsListLoading = false;
          });
      }
    },

    /**
     * @description 点击全选勾选框
     */
    handleCheckAllChange() {
      if (this.isCheckAll) {
        // 当前页全选
        this.contactListData.forEach((contact) => {
          // 未勾选的勾选上
          if (!this.checkedContactsIdList.includes(contact.id)) {
            this.checkedContactsIdList.push(contact.id);
            this.checkedContactsObjList.push(JSON.stringify(contact));
          }
        });
      } else {
        // 当前页全不选
        this.contactListData.forEach((contact) => {
          if (this.checkedContactsIdList.includes(contact.id)) {
            const index = this.checkedContactsIdList.indexOf(contact.id);
            this.checkedContactsIdList.splice(index, 1);
            this.checkedContactsObjList.splice(index, 1);
          }
        });
      }
      this.validateCheckAll();
      this.$emit('update:selectedList', this.checkedContactsObjList);
    },

    /**
     * @description 单个联系人勾选改变
     * @param { Boolean } isChecked 是否勾选
     * @param { Object } contact 联系人
     */
    handleCheckChange(isChecked, contact) {
      if (isChecked) {
        this.checkedContactsObjList.push(JSON.stringify(contact));
      } else {
        const index = this.checkedContactsObjList.indexOf(
          JSON.stringify(contact),
        );
        this.checkedContactsObjList.splice(index, 1);
      }
      this.validateCheckAll();
      this.$emit('update:selectedList', this.checkedContactsObjList);
    },

    /**
     * @description 勾选和页数变化改变全选按钮的状态
     */
    validateCheckAll() {
      let isCheckedCount = 0;
      this.contactListData.forEach((contact) => {
        if (this.checkedContactsIdList.includes(contact.id)) {
          isCheckedCount += 1;
        }
      });
      if (isCheckedCount === 0) {
        this.isCheckAll = false;
        this.isCheckAllIndeterminate = false;
      } else if (isCheckedCount === this.contactListData.length) {
        this.isCheckAll = true;
        this.isCheckAllIndeterminate = false;
      } else {
        this.isCheckAll = false;
        this.isCheckAllIndeterminate = true;
      }
    },

    /**
     * @description 删除分组
     * @param { Object } node 树节点数据
     */
    handleTreeNodeDelete(nodeObj) {
      this.$confirm('将删除该分组及其下属所有分组，删除后数据不可恢复')
        .then(() => {
          // 被点击节点及其所有子孙节点的id集合
          const ids = [];
          /**
           * @function
           * @description 递归遍历获取所有子孙节点的id
           */
          const findAllDescendant = (node) => {
            ids.push(node.id);
            if (node.children) {
              node.children.forEach((child) => {
                findAllDescendant(child);
              });
            }
          };
          findAllDescendant(nodeObj);
          const request = {
            method: 'post',
            baseURL: window.SITE_CONFIG.baseUrl,
            url: '/message/messageGroup/delete',
            data: { ids },
          };
          this.$http(request)
            .then(({ data: response }) => {
              if (response.code === 0) {
                this.$message.success('删除成功');
                this.getGroupTree();
              } else {
                this.$message.error(`删除失败，错误信息：${response.msg}`);
              }
            })
            .catch((error) => {
              this.$message.error(`删除失败，错误信息：${error}`);
            });
        })
        .catch(() => {});
    },

    /**
     * @description 编辑分组
     * @param { Object } node 树节点数据
     */
    handleTreeNodeEdit(node) {
      this.$refs.AddOrEditDialog.init('edit', node);
    },

    /**
     * @description 新增分组
     * @param { Object } node 树节点数据
     */
    handleTreeNodeAdd(node) {
      this.$refs.AddOrEditDialog.init('add', node);
    },
  },
};
</script>

<style lang="scss" module>
.wrapper {
  display: flex;
  width: 630px;
  height: 100%;
}

.tree {
  width: 300px;
  height: 100%;
  flex-shrink: 0;
  flex-grow: 0;
  border-right: 1px solid #f2f2f2;

  .header {
    padding: 10px;
    text-align: center;
    display: flex;
  }

  .shortcut {
    height: 45px;
    line-height: 45px;
    padding-left: 25px;
    cursor: pointer;
    border-left: 2px solid transparent;

    &:hover {
      background: rgba(0, 145, 255, 0.1);
    }

    &--active {
      background: rgba(0, 145, 255, 0.1);
      border-left: 2px solid #0091ff;
      color: #0091ff;
    }
  }

  .search {
    margin: 10px;
  }

  .treeScroll {
    height: calc(100% - 255px);
    overflow-y: auto;
    .contactName,.workUnit{
      width: 200px;
    }
    .sv-tree{
        height: auto;
        overflow: visible;
    }
    .search_checkGroupList{
      height: auto;
      overflow-y: visible;
      overflow-x: visible;
    }
  }

    .title{
      color:#0091ff;
      padding-left: 15px;
      border-left: 4px solid #0091ff;
    }
}
  .checkGroupList,.search_checkGroupList {
    flex-grow: 1;
    height: 100%;
    overflow-y: auto;
    overflow-x: hidden;

    &::-webkit-scrollbar {
      background: transparent;
      width: 5px;
    }

    &::-webkit-scrollbar-thumb {
      background: #d5d5d5;
      border-radius: 5px;
    }

    .checkboxItem {
      display: flex;
      flex-direction: row-reverse;
      height: 65px !important;
      align-items: center;
      margin: 0 10px 10px 10px !important;
      border-radius: 4px;

      &:hover {
        border-color: #0091ff;
      }

      &:last-child {
        margin-bottom: 0 !important;
      }
    }

    .contactName,
    .workUnit {
      width: 250px;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .contactName {
      font-weight: bold;
    }

    .workUnit {
      margin-top: 5px;
    }
  }
.contactList {
  width: 330px;
  height: 100%;
  display: flex;
  flex-direction: column;

  .header {
    height: 50px;
    line-height: 50px;
    padding: 0 10px;
    font-size: 16px;
    flex-shrink: 0;
    flex-grow: 0;

    .title {
      display: inline-block;
      font-weight: bold;
      height: 16px;
      line-height: 16px;
      padding-left: 20px;
      border-left: 3px solid #0091ff;
    }
  }

  .footer {
    height: 45px;
    line-height: 45px;
    flex-shrink: 0;
    flex-grow: 0;
    padding-top: 5px;
  }
}
</style>
