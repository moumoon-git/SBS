<template>
  <div :class="$style.wrapper">
    <!-- A. 分组列表 -->
    <div :class="$style.tree">
      <!-- A-1. 分组切换按钮 -->
      <sv-tree-tab
        :tab-list="['通讯录分组', '传真分组']"
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
        <!-- 传真分组下新增分组按钮 -->
        <sv-table-operation
          v-if="groupType === 'messages'"
          :display="['cross']"
          style="width: 30px;"
          @cross="handleTreeNodeAdd({});"
        />
      </div>
      <!-- A-3. 树形快捷按钮 -->
      <!-- <div
        :class="[
          $style.shortcut,
          { [$style['shortcut--active']]: activeShortcut === 1 }
        ]"
        @click="handleCommonlyUsedClick"
      >
        常用联系人
      </div> -->
      <div
        v-if="groupType === 'messages'"
        :class="[
          $style.shortcut,
          { [$style['shortcut--active']]: activeShortcut === 2 }
        ]"
        @click="handleRecentContactsClick"
      >
        最近联系单位
      </div>
      <!-- <div
        :class="[
          $style.shortcut,
          { [$style['shortcut--active']]: activeShortcut === 3 }
        ]"
        @click="handleAllClick"
      >
        全部
      </div> -->
      <!-- A-4. 树形 -->
      <div
        v-loading="isGroupTreeLoading"
        element-loading-spinner="sv-loading"
        :class="['sv-tree', $style.treeScroll]"
      >
        <el-tree
          ref="groupTree"
          node-key="id"
          :lazy="groupType === 'contacts' ? false : true"
          :load="loadNode"
          :data="groupTreeData"
          :highlight-current="true"
          :props="groupTreeProps"
          :show-checkbox="true"
          @check-change="handleCheckChange"
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
    </div>
    <!-- B. 联系人列表 -->
    <div
      v-show="false"
      v-loading="isContactsListLoading"
      element-loading-spinner="sv-loading"
      :class="$style.contactList"
    >
      <!-- B.1 头部标题和全选按钮 -->
      <div :class="$style.header">
        <span :class="$style.title">联系单位列表</span>
        <el-checkbox
          v-model="isCheckAll"
          :indeterminate="isCheckAllIndeterminate"
          style="float: right;"
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
          :key="`contact_${ index }`"
          :class="$style.checkboxItem"
          :label="contact.id"
          border
          size="medium"
          @change="handleCheckChange($event, contact);"
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
      <!-- <div :class="['sv-pagination', $style.footer]">
        <el-pagination
          layout="prev, pager, next"
          :current-page.sync="pageIndex"
          :page-count="pageTotal"
          :pager-count="5"
          @current-change="getContactsListData"
        />
      </div> -->
    </div>

    <!-- 新增/编辑传真分组弹窗 -->
    <AddOrEditDialog
      ref="AddOrEditDialog"
      @refresh-messages-group="getGroupTree"
    />
  </div>
</template>

<script>
import FaxDispatchLeftAddOrEditDialog from './FaxDispatchLeftAddOrEditDialog.vue';

export default {
  name: 'FaxDispatchLeft',

  components: {
    AddOrEditDialog: FaxDispatchLeftAddOrEditDialog,
  },

  props: {
    // 收传真人列表
    selectedList: {
      type: Array,
      required: true,
    },
  },

  data() {
    return {
      activeShortcut: 3,
      // 分组类型：'contacts'---通讯录分组，'messages'---传真分组
      groupType: 'contacts',
      // 搜索关键词
      searchKeyword: '',
      // 分组树数据
      groupTreeData: [],
      // 分组树配置
      groupTreeProps: {
        children: 'children',
        label: 'name',
        isLeaf: '',
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

    // 收传真人列表发生变化
    selectedList(selectedList) {
      this.checkedContactsObjList = [...selectedList];

      // 更新勾选列表
      const newCheckedContactsIdList = [];
      this.checkedContactsObjList.forEach((contact) => {
        const { id } = contact;
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
      this.groupType = tabIndex === 0 ? 'contacts' : 'messages';
      if (this.groupType === 'messages') {
        this.groupTreeProps.children = 'children';
        this.groupTreeProps.isLeaf = '';
      } else {
        this.groupTreeProps.children = 'children';
        this.groupTreeProps.isLeaf = '';
      }
    },

    /**
     * @description 获取分组树数据
     */
    getGroupTree() {
      this.isGroupTreeLoading = true;
      // 请求参数
      let request;
      if (this.groupType === 'contacts') {
        this.groupTreeProps.label = 'name';
        request = {
          method: 'get',
          baseURL: window.SITE_CONFIG.baseUrl,
          url: '/mail/mailgroup/list',
          params: {
            search: this.searchKeyword,
          },
        };
      } else if (this.groupType === 'messages') {
        this.groupTreeProps.label = 'groupName';
        request = {
          method: 'GET',
          baseURL: window.SITE_CONFIG.cloudUrl,
          url: '/event/cdrFaxGroup/getCdrFaxGroupList',
          params: {
            groupName: this.searchKeyword,
          },
        };
      }

      // 发送请求
      this.$http(request)
        .then(
          ({ data: response }) => {
            console.log('查询树状分组', response);
            if (response.code === 0 || response.errorcode === 0) {
              // if (this.groupType === 'messages') {
              //   const request = {
              //     method: 'GET',
              //     baseURL: window.SITE_CONFIG.cloudUrl,
              //     url: '/event/cdrFaxGroupMemberMember/getCdrFaxGroupMemberList',
              //     params: {
              //       groupId: this.selectedGroupIds.join(),
              //     },
              //   };
              //   this.$http(request)
              //     .then(({ data: response }) => {
              //       if (response.errorcode === 0) {
              //         // this.pageTotal = response.page.totalPage;
              //         this.contactListData = [...response.data];
              //       }
              //     })
              //     .finally(() => {
              //       this.isContactsListLoading = false;
              //     });
              // }
              this.groupTreeData = [...response.data];
              this.handleCheckShow();
            }
          },
        )
        .finally(() => {
          this.isGroupTreeLoading = false;
        });
    },
    loadNode(node, resolve) {
      console.log('树懒加载node, resolve', node, resolve);
      if (this.groupType === 'messages' && node.level !== 0) {
        const request = {
          method: 'GET',
          baseURL: window.SITE_CONFIG.cloudUrl,
          url: '/event/cdrFaxGroupMemberMember/getCdrFaxGroupMemberList',
          params: {
            groupId: node.data.id,
          },
        };
        this.$http(request)
          .then(({ data: response }) => {
            if (response.errorcode === 0) {
              resolve(response.data.map( function (item) { item.groupName=item.name;return item;} ));
            }
          });
      }
    },
    /**
     * @description 搜索栏发生变化
     */
    handleSearchKeywordChange() {
      this.reset();
      this.getContactsListData();
      this.getGroupTree();
    },

    /**
     * @description 点击“常用联系人”按钮，获取联系人列表数据
     */
    handleCommonlyUsedClick() {
      this.activeShortcut = 1;
      this.isContactsListLoading = true;
      this.reset();
      const request = {
        method: 'get',
        baseURL: window.SITE_CONFIG.baseUrl,
        url: '/message/messageinfor/getCommonContract',
      };
      this.$http(request)
        .then(({ data: response }) => {
          if (response.code === 0) {
            this.pageTotal = 1;
            this.contactListData = [...response.data];
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
      const request = {
        baseURL: window.SITE_CONFIG.cloudUrl,
        url: '/event/fax/getRecentContactor',
        method: 'get',
        params: this.$http.adornParams({
        }),
      };
      this.$http(request)
        .then(({ data: response }) => {
          console.log('/event/fax/getRecentContactor', response);
          if (response.errorcode === 0) {
            this.pageTotal = 1;
            this.contactListData = [...response.data];
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
      if (this.groupType === 'contacts') {
        this.contactListData = [nodeObj];
        return;
      }
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
            search: this.searchKeyword,
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
          method: 'GET',
          baseURL: window.SITE_CONFIG.cloudUrl,
          url: '/event/cdrFaxGroupMemberMember/getCdrFaxGroupMemberList',
          params: {
            groupId: this.selectedGroupIds.join(),
          },
        };
        this.$http(request)
          .then(({ data: response }) => {
            if (response.errorcode === 0) {
              // this.pageTotal = response.page.totalPage;
              this.contactListData = [...response.data];
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
      let noFaxGroupNames = []; // 没有传真号码的单位名称
      if (this.isCheckAll) {
        // 当前页全选
        this.contactListData.forEach((contact) => {
          // 未勾选的勾选上
          if (!this.checkedContactsIdList.includes(contact.id)) {
            contact.groupType = this.groupType;
            if (!contact.fax) {
              noFaxGroupNames.push(contact.name);
            } else {
              this.checkedContactsObjList.push(JSON.parse(JSON.stringify(contact)));
              this.checkedContactsIdList.push(contact.id);
            }
          }
        });
        if (noFaxGroupNames.length > 0) {
          this.$message.error(`${noFaxGroupNames.length > 1 ? noFaxGroupNames.join(',') : noFaxGroupNames[0]}没有传真号码`);
        }
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
      console.log("this.checkedContactsObjList",this.checkedContactsObjList);
    },

    /**
     * @description 单个联系人勾选改变
     * @param { Boolean } isChecked 是否勾选
     * @param { Object } contact 联系人
     */
    handleCheckChange(contact, isChecked) {
      // console.log('勾选回调函数 isChecked, contact', isChecked, contact);
      if (isChecked) {
        contact.groupType = this.groupType;
        if (!contact.fax) {
          this.$message.error(`${contact.name || contact.groupName}单位没有传真号码`);
        } else {
          this.checkedContactsObjList.push(JSON.parse(JSON.stringify(contact)));
        }
      } else {
        const index = this.checkedContactsObjList.indexOf(JSON.parse(JSON.stringify(contact)));
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
            baseURL: window.SITE_CONFIG.cloudUrl,
            url: '/event/cdrFaxGroup/delete',
            data: { id: ids.join() },
          };
          this.$http(request)
            .then(({ data: response }) => {
              if (response.errorcode === 0) {
                this.$message.success('删除成功');
                this.getGroupTree();
              } else {
                this.$message.error(`删除失败，错误信息：${response.msg}`);
              }
            })
            .catch((error) => { this.$message.error(`删除失败，错误信息：${error}`); });
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
    // 回显
    handleCheckShow() {
      const members = [];
      Array.from(this.selectedList, (el) => {members.push(el.id)});
      // console.log('当前勾选树回显', members);
      this.$refs.groupTree.setCheckedKeys(members);
    },
  },
};
</script>

<style lang="scss" module>
.wrapper {
  display: flex;
  height: 100%;
}

.tree {
  width: 300px;
  height: 100%;
  flex-shrink: 0;
  flex-grow: 0;
  border-right: 1px solid #F2F2F2;

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
      border-left: 2px solid #0091FF;
      color: #0091FF;
    }
  }

  .search {
    margin: 10px;
  }

  .treeScroll {
    height: calc(100% - 255px);
    overflow-y: auto;
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
      border-left: 3px solid #0091FF;
    }
  }

  .checkGroupList {
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
        border-color: #0091FF;
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

  .footer {
    height: 45px;
    line-height: 45px;
    flex-shrink: 0;
    flex-grow: 0;
    padding-top: 5px;
  }
}
</style>
