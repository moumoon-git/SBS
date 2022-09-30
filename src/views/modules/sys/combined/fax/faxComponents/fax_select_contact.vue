<template>
  <div class="sv-select-contact">
    <sv-button
      type="secondary"
      @click="$refs.dialog.visible = true"
    >
      {{ `选择${title}` }}
    </sv-button>
    <div>
      <span
        v-for="(item, index) in displayResult"
        :key="`contact_result_${index}`"
        class="sv-select-contact__item"
      >
        {{ `${item.name}${ item.fax }` }}
        <span @click="deleteItem(index)">×</span>
      </span>
    </div>
    <sv-dialog
      ref="dialog"
      :title="`请选择${title}`"
      @cancel="cancel"
      @modal="cancel"
      @confirm="confirm"
    >
      <div class="sv-select-contact__container">
        <div class="sv-select-contact__left">
          <div class="sv-tree">
            <el-tree
              ref="group"
              node-key="memberId"
              :data="groupList"
              :props="groupTreeProps"
              :highlight-current="true"
              :check-on-click-node="true"
              :show-checkbox="multiple"
              :default-checked-keys="contactCheckedIds"
              :current-node-key="0"
              @check="contactCheck"
              @node-click="groupClick"
            />
          </div>
        </div>
        <!-- <div class="sv-tree sv-select-contact__middle">
          <sv-input-tree-search
            v-model="searchKeyword"
            class="sv-input-tree-search"
            width="calc(100% - 20px)"
            placeholder="按enter搜索"
            @change="
              currentPage = 1;
              getContactList();
            "
          />
          <div
            v-loading="contactLoading"
            element-loading-spinner="sv-loading"
            class="sv-tree"
          >
            <el-tree
              ref="contact"
              node-key="id"
              :data="contactList"
              :props="contactTreeProps"
              :highlight-current="true"
              :check-on-click-node="true"
              :show-checkbox="multiple"
              :default-checked-keys="contactCheckedIds"
              @node-click="contactClick"
              @check="contactCheck"
            />
          </div>
          <div class="sv-pagination">
            <el-pagination
              :total="totalCount"
              :current-page="currentPage"
              :page-size="10"
              :pager-count="5"
              layout="prev, pager, next"
              @current-change="handlePageChange"
            />
          </div>
        </div> -->
        <div
          v-if="multiple"
          class="sv-select-contact__right"
        >
          <div class="sv-select-contact__right__list">
            <div
              v-for="(man, index) in contactCheckedNodes"
              :key="`selected_man_${index}`"
              class="sv-select-contact__item"
            >
              {{ `${man.name}${ man.fax }` }}
              <span @click="deleteDisplayItem(index)">×</span>
            </div>
          </div>
          <div class="sv-select-contact__right__total">
            <span>
              已选择{{ contactCheckedNodes.length }}个单位
            </span>
            <span @click="deleteAllDisplayItem">
              全部清空
            </span>
          </div>
        </div>
      </div>
    </sv-dialog>
    <sv-dialog-hint
      ref="hint_empty"
      type="normal"
      :text="`请选择${title}！`"
    />
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'FaxSelectContact',

  model: {
    prop: 'data',
    event: 'update',
  },
  props: {
    title: {
      type: String,
      default: '联系人',
    },

    data: {
      type: [Array, String, Number],
      default: '',
    },

    detail: {
      type: Object,
      default: () => ({
        id: '',
        name: '',
        mobile1: '',
        phone: '',
      }),
    },

    // 接口
    api: {
      type: Array,
      default: () => [
        '/mail/mailgroup/list',
        '/mail/mailcontactor/list',
      ],
    },

    // 树形数据结构配置
    groupTreeProps: {
      type: Object,
      default: () => ({
        children: 'children',
        label: 'name',
        value: 'memberId',
      }),
    },

    // 树形数据结构配置
    contactTreeProps: {
      type: Object,
      default: () => ({
        children: 'children',
        label: 'name',
        value: 'id',
      }),
    },

    // 是否多选
    multiple: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      groupLoading: false,
      contactLoading: false,
      groupList: [],
      contactList: [],
      contactCheckedIds: [],
      contactCheckedNodes: [],
      searchKeyword: '',
      currentPage: 1,
      totalCount: 0,
      selectedResult: [],
      displayResult: [],
      currentGroupId: null,
    };
  },

  computed: {
    phoneNumber() {
      return (item) => {
        if (item.phone) {
          return `（${item.phone}）`;
        }

        if (item.mobile1) {
          return `（${item.mobile1}）`;
        }

        return '';
      };
    },
  },

  watch: {
    data: {
      deep: true,
      handler(val) {
        if (this.multiple) {
          // 多选
          if (val) {
            this.contactCheckedNodes = [...val];
            this.displayResult = [...this.contactCheckedNodes];
            this.contactCheckedIds = [];
            val.forEach((element) => {
              this.contactCheckedIds.push(element.memberId);
            });
          } else {
            this.contactCheckedNodes = [];
            this.displayResult = [];
            this.contactCheckedIds = [];
          }
        } else {
          // 单选
          if (val) {
            // 数据初始化时赋值
            if (this.selectedResult.length === 0) {
              this.selectedResult = [{
                id: this.detail.id,
                name: this.detail.name,
                phone: this.detail.mobile1,
              }];
              this.displayResult = [...this.selectedResult];
            }
          }
        }
      },
    },
  },

  mounted() {
    this.currentGroupId = null;
    // 获取树形数据
    this.getGroupList();
    this.getContactList();
    // 设置选择的人
    if (this.multiple) {
      if (this.data && this.data.length > 0) {
        this.contactCheckedNodes = [...this.data];
        this.displayResult = [...this.contactCheckedNodes];
        this.contactCheckedIds = [];
        this.contactCheckedNodes.forEach((element) => {
          this.contactCheckedIds.push(element.memberId);
        });
      }
    } else {
      if (this.data) {
        this.selectedResult = [{
          id: this.detail.id,
          name: this.detail.name,
          phone: this.detail.mobile1 || this.detail.phone,
        }];
        this.displayResult = [...this.selectedResult];
      }
    }
  },

  methods: {
    /**
     * @method
     * @desc 获取分组数据
     */
    getGroupList() {
      this.groupLoading = true;
      const request = {
        method: 'get',
        url: this.api[0],
        baseURL: window.SITE_CONFIG.baseUrl,
        headers: {
          token: this.$cookie.get('token'),
        },
        params: {
          name: this.searchKeyword,
          token: this.$cookie.get('token'),
        },
      };
      axios(request)
        .then((response) => {
          if (response.data.code === 0) {
            response.data.data.forEach((item) => {
              item.memberId = item.id;
            });
            const all = {};
            all[this.groupTreeProps.label] = '全部';
            all[this.contactTreeProps.value] = 0;
            this.groupList = [
              all,
              ...response.data.data,
            ];
          } else {
            this.$message.error(`获取分组数据失败！错误信息：${response}`);
          }
          this.groupLoading = false;
        })
        .catch((error) => {
          this.$message.error(`获取分组数据失败！错误信息：${error}`);
          this.groupLoading = false;
        });
    },

    /**
     * @method
     * @desc 获取联系人列表
     */
    getContactList() {
      this.contactLoading = true;
      const request = {
        method: 'post',
        url: this.api[1],
        baseURL: window.SITE_CONFIG.baseUrl,
        headers: {
          token: this.$cookie.get('token'),
        },
        data: {
          page: this.currentPage,
          limit: 10,
          search: this.searchKeyword,
          groupId: this.currentGroupId > 0 ? this.currentGroupId : [],
          groupIds: this.currentGroupId > 0 ? this.currentGroupId : [],
        },
      };

      axios(request).then((response) => {
        if (response.data.code === 0) {
          this.contactList = response.data.data ? response.data.data.list : response.data.page.list;
          this.totalCount = response.data.data
            ? response.data.data.totalCount
            : response.data.page.totalCount;
        } else {
          this.$message.error(`获取分组数据失败！错误信息：${response}`);
        }
        this.contactLoading = false;
      })
        .catch((error) => {
          this.$message.error(`获取分组数据失败！错误信息：${error}`);
          this.contactLoading = false;
        });
    },

    /**
     * @method
     * @desc 点击分组树，查询该分组的联系人
     */
    groupClick(nodeObj) {
      this.currentPage = 1;
      const result = [];
      const findAllChildren = (node) => {
        result.push(node[this.groupTreeProps.value]);
        if (node[this.groupTreeProps.children] && node[this.groupTreeProps.children].length) {
          node[this.groupTreeProps.children].forEach((child) => findAllChildren(child));
        }
      };
      findAllChildren(nodeObj);
      this.currentGroupId = result;
      this.getContactList();
    },

    /**
     * @method
     * @desc 点击联系人，单选的情况下有效
     */
    contactClick(nodeObj) {
      if (!this.multiple) {
        this.selectedResult = [{
          name: nodeObj.name,
          id: nodeObj.id,
          phone: nodeObj.mobile1 || nodeObj.phone,
        }];
      }
    },

    /**
     * @method
     * @desc 联系人勾选，多选的情况下有效
     */
    contactCheck(nodeObj, allChecked) {
      if (this.multiple) {
        // 左侧属性结构选中的所有数据
        const selectLeftAllArray = this.$refs.group.getCheckedNodes(false, false);
        this.contactCheckedNodes = selectLeftAllArray;
        const selectGroupIds = [];
        selectLeftAllArray.forEach((item) => {
          selectGroupIds.push(item.memberId);
        });
        this.contactCheckedIds = selectGroupIds;
        this.$refs.group.setCheckedKeys(this.contactCheckedIds);
      }
    },

    /**
     * @method
     * @desc 分页器换页
     */
    handlePageChange(val) {
      this.currentPage = val;
      this.getContactList();
    },

    /**
     * @method
     * @desc 外部删除项目
     * @param {Number} index 该项目在数组中的下标
     */
    deleteItem(index) {
      if (this.multiple) {
        // 更新v-model
        const result = [...this.data];
        result.splice(index, 1);
        this.$emit('update', result);
        this.$emit('update:templateDeleteNodes', result[index]);
        this.contactCheckedNodes = [...result];
        this.displayResult = [...result];
        // 设置勾选
        this.contactCheckedIds = [];
        result.forEach((element) => {
          this.contactCheckedIds.push(element.memberId);
        });
      } else {
        this.selectedResult = [];
        this.displayResult = [];
        this.$emit('update', '');
      }
    },

    /**
     * @method
     * @desc 删除弹窗中的已选项目
     * @param {Number} index 该项目在数组中的下标
     */
    deleteDisplayItem(index) {
      this.contactCheckedNodes.splice(index, 1);
      this.contactCheckedIds.splice(index, 1);
      this.$refs.group.setCheckedKeys(this.contactCheckedIds);
    },

    /**
     * @method
     * @desc 清空弹窗中的已选项目
     */
    deleteAllDisplayItem() {
      this.contactCheckedNodes = [];
      this.contactCheckedIds = [];
      this.$refs.group.setCheckedKeys(this.contactCheckedIds);
    },

    /**
     * @method
     * @desc 点击确定，更新数据
     */
    confirm() {
      // 检测选择是否为空
      if (
        (this.selectedResult.length === 0 && !this.multiple)
        || (this.contactCheckedIds.length === 0 && this.multiple)
      ) {
        this.$refs.hint_empty.visible = true;
        return;
      }
      if (this.multiple) {
        this.displayResult = [...this.contactCheckedNodes];
        this.$emit('update', this.contactCheckedNodes);
        // 筛选本次删除的单位节点
        this.data.forEach((dataItem) => {
          if (this.contactCheckedNodes.filter((nodeItem) => { return dataItem.memberId === nodeItem.memberId }).length === 0) {
            this.$emit('update:templateDeleteNodes', dataItem);
          }
        });
        // 筛选本次新增的单位节点
        this.contactCheckedNodes.forEach((nodeItem) => {
          if (this.data.filter((dataItem) => { return nodeItem.memberId === dataItem.memberId }).length === 0) {
            this.$emit('update:templateAddNodes', nodeItem);
          }
        });
      } else {
        this.$emit('update', this.selectedResult[0].id);
        this.displayResult = [...this.selectedResult];
      }
      // 初始化
      this.$refs.dialog.visible = false;
      this.currentPage = 1;
      this.currentGroupId = null;
      this.searchKeyword = '';
      this.getContactList();
    },

    /**
     * @method
     * @desc 点击取消，复原数据
     */
    cancel() {
      if (this.multiple) {
        if (this.data && this.data.length > 0) {
          this.contactCheckedNodes = [...this.data];
          this.contactCheckedIds = [];
          this.contactCheckedNodes.forEach((element) => {
            this.contactCheckedIds.push(element.memberId);
          });
          this.$refs.group.setCheckedKeys(this.contactCheckedIds);
        } else {
          this.contactCheckedNodes = [];
          this.contactCheckedIds = [];
          this.$refs.group.setCheckedKeys(this.contactCheckedIds);
        }
      } else {
        if (this.data && this.detail) {
          this.selectedResult = [{
            id: this.detail.id,
            name: this.detail.name,
            phone: this.detail.mobile1 || this.detail.phone,
          }];
        }
      }
      // 初始化
      this.$refs.dialog.visible = false;
      this.currentPage = 1;
      this.searchKeyword = '';
      this.currentGroupId = null;
      this.getContactList();
    },
  },
};
</script>

<style lang="scss" scoped>
.sv-select-contact {
    &__container {
      min-width: 600px;
      height: 560px;
      display: flex;
      justify-content: center;
    }
    &__left {
      width: 300px;
      height: 100%;
      border-right: 1px solid #E6E6E6;
      .sv-input-tree-search {
        margin: 10px;
      }
      .sv-tree {
        height: calc(100% - 50px);
        overflow-y: auto;
        & /deep/ .el-tree-node__label {
          overflow: hidden;
          text-overflow: ellipsis;
        }
      }
    }
    &__middle {
      width: 350px;
      height: 100%;
      display: flex;
      flex-direction: column;
      .sv-input-tree-search {
        margin: 10px;
        flex: 0;
      }
      .sv-tree {
        flex-grow: 1;
      }
      .sv-pagination {
        padding: 10px;
      }
    }
    &__right {
        width: 300px;
        height: 100%;
        border-left: 1px solid #E6E6E6;
        display: flex;
        flex-direction: column;
        &__list {
            flex-grow: 1;
            overflow-x: auto;
            padding: 0 20px 10px;
            &::-webkit-scrollbar {
                background: transparent;
                width: 5px;
            }
            &::-webkit-scrollbar-thumb {
                background: #d5d5d5;
                border-radius: 5px;
            }
        }
        &__total {
            height: 54px;
            line-height: 54px;
            text-align: center;
            padding: 0 20px;
            & > span:first-child {
                float: left;
            }
            // 清空按钮
            & > span:last-child {
                float: right;
                color: #0091FF;
                cursor: pointer;
                user-select: none;
                &:hover {
                    color: #5eadff;
                }
                &:active {
                    color: #2476E0;
                }
            }
        }
    }
    &__item {
        white-space: nowrap;
        font-size: 14px;
        display: inline-block;
        height: 30px;
        line-height: 28px;
        border: 1px solid #E0E0E0;
        border-radius: 3px;
        background: #FAFAFA;
        padding: 0 5px;
        margin: 10px 10px 0 0;
        cursor: default;
        color: #999999;
        // 删除按钮
        span {
            cursor: pointer;
            font-size: 18px;
            &:hover {
                color: #b4b4b4;
            }
        }
    }
}
</style>
