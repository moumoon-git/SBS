<template>
  <div class="sv-select-item">
    <div class="sv-select-item__container">
      <transition name="popup">
        <div
          v-show="visible"
          v-loading="treeLoading"
          class="sv-select-item__dialog"
          element-loading-spinner="sv-loading"
        >
          <div
            class="sv-tree sv-select-item__dialog__tree"
          >
            <el-tree
              ref="tree"
              node-key="id"
              :data="treeList"
              :props="treeProps"
              :highlight-current="true"
              :current-node-key="0"
              :default-expanded-keys="[0]"
              empty-text="暂无分组数据"
              @node-click="handleTreeClick"
            />
          </div>
          <div
            v-loading="itemLoading"
            v-infinite-scroll="scrollLoad"
            class="sv-select-item__dialog__list sv-tree"
            element-loading-spinner="sv-loading"
          >
            <el-tree
              ref="tree_item"
              node-key="id"
              :data="itemList"
              :props="treeProps"
              :show-checkbox="true"
              :default-checked-keys="itemCheckedId"
              @node-click="displayContent"
              @check="handleItemCheck"
            >
              <div
                slot-scope="{node}"
                class="sv-tree-node"
              >
                <div class="label">
                  {{ node.label }}
                </div>
              </div>
            </el-tree>
          </div>
          <div class="sv-select-item__dialog__detail">
            <div class="sv-select-item__dialog__detail__content">
              {{ content }}
            </div>
            <div class="sv-select-item__dialog__detail__footer">
              <span @click.stop="cancel">取消</span>
              <span @click.stop="confirm">确定</span>
            </div>
          </div>
        </div>
      </transition>
      <sv-button
        type="secondary"
        @click="visible = true"
      >
        选择{{ title }}
      </sv-button>
    </div>
    <div class="sv-select-item__result">
      <span
        v-for="(item, index) in itemCheckedNode"
        :key="index"
        class="sv-select-item__result__item"
      >
        {{ item.name }}
        <span @click="deleteItem(index)">×</span>
      </span>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'SvSelectItem',
  model: {
    event: 'update',
    prop: 'data',
  },
  props: {
    title: {
      type: String,
      default: '项目',
    },
    api: {
      type: Array,
      default: () => [
        '/investigation/investigationGroup/listTree',
        '/investigation/investigationInfor/list',
      ],
    },
    treeProps: {
      type: Object,
      default: () => ({
        children: 'children',
        label: 'name',
        value: 'id',
      }),
    },
    data: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      visible: false,
      treeLoading: false,
      token: this.$cookie.get('token'),
      treeList: [],
      itemLoading: false,
      itemList: [],
      // 当前页数，用于下拉更新
      currentPage: 1,
      // 项目已勾选
      itemCheckedId: [],
      itemCheckedNode: [],
      // 第三格的详细内容
      content: '',
    };
  },
  mounted() {
    // 获取项目分组列表
    this.getTreeList();
    // 获取全部项目
    this.getItemList(0);
    this.itemCheckedId = [];
    this.data.forEach((element) => {
      this.itemCheckedId.push(element.id);
    });
    this.$refs.tree.setCheckedKeys(this.itemCheckedId);
    this.itemCheckedNode = [...this.data];
  },
  methods: {
    /**
     * @method
     * @desc 获取树形数据
     */
    getTreeList() {
      this.treeLoading = true;
      const request = {
        method: 'get',
        url: this.api[0],
        baseURL: window.SITE_CONFIG.baseUrl,
        params: {
          token: this.token,
        },
      };
      axios(request).then(
        (response) => {
          if (response.data.code === 0) {
            this.treeList = [
              {
                id: 0,
                name: '全部',
                children: response.data.data,
              },
            ];
          }
          this.treeLoading = false;
        },
      );
    },

    /**
     * @method
     * @desc 树节点点击，请求该节点数据
     * @param {Object} 树节点对象
     */
    handleTreeClick(nodeObj) {
      this.itemLoading = true;
      this.currentPage = 1;
      this.getItemList(nodeObj.id);
    },

    /**
     * @method
     * @desc 获取对应id的表格数据
     * @param {Number} id
     */
    getItemList(id) {
      const request = {
        method: 'post',
        url: this.api[1],
        baseURL: window.SITE_CONFIG.baseUrl,
        headers: {
          token: this.token,
        },
        data: {
          page: this.currentPage,
          limit: 10,
          search: '',
          groupIds: id === 0 || id === '0' || id === null || id === undefined ? [] : [id],
        },
      };
      axios(request).then((response) => {
        if (response.data.code === 0) {
          if (this.currentPage === 1) {
            this.itemList = response.data.page.list;
          } else {
            this.itemList.push(...response.data.page.list);
            if (response.data.page.list.length === 0) {
              this.currentPage -= 1;
            }
          }
        }
        this.itemLoading = false;
      });
    },
    /**
     * @method
     * @desc 表格勾选
     */
    handleItemCheck(nodeObj, allChecked) {
      if (allChecked.checkedKeys.indexOf(nodeObj.id) > -1) {
        // 勾选
        this.itemCheckedId.push(nodeObj.id);
        this.itemCheckedNode.push(nodeObj);
      } else {
        // 取消勾选
        const index = this.itemCheckedId.indexOf(nodeObj.id);
        this.itemCheckedId.splice(index, 1);
        this.itemCheckedNode.splice(index, 1);
      }
      this.$refs.tree_item.setCheckedKeys(this.itemCheckedId);
    },

    /**
     * @method
     * @desc 展示该项目详情
     */
    displayContent(nodeObj) {
      this.content = nodeObj.content || nodeObj.remark;
    },
    /**
         * @method
         * @desc 点击取消
         */
    cancel() {
      this.visible = false;
      // 还原勾选
      this.itemCheckedId = [];
      this.itemCheckedNode = [...this.data];
      this.data.forEach((element) => {
        this.itemCheckedId.push(element.id);
      });
      this.$refs.tree_item.setCheckedKeys(this.itemCheckedId);
    },
    /**
         * @method
         * @desc 点击确定
         */
    confirm() {
      this.visible = false;
      this.$emit('update', this.itemCheckedNode);
    },
    /**
         * @method
         * @desc 删除项目
         * @param {Number} index 该项目在数组中的下标
         */
    deleteItem(index) {
      this.itemCheckedNode.splice(index, 1);
      this.itemCheckedId.splice(index, 1);
      this.$refs.tree_item.setCheckedKeys(this.itemCheckedId);
      if (!this.visible) {
        this.$emit('update', this.itemCheckedNode);
      }
    },
    /**
         * @method
         * @desc 滚动刷新列表
         */
    scrollLoad() {
      this.currentPage += 1;
      this.getItemList();
    },
  },
};
</script>

<style lang="scss" scoped>
.sv-select-item {
    &__container {position: relative}
    &__dialog {
        width: 700px;
        height: 250px;
        background: #ffffff;
        border-radius: 5px;
        box-shadow: 0px 2px 8px 0px rgba(0, 0, 0, 0.1);
        position: absolute;
        bottom: 35px;
        left: 0;
        z-index: 100;
        overflow: hidden;
        display: flex;
        justify-content: center;
        align-items: center;
        &__tree,
        &__list,
        &__detail {
            padding: 20px 0;
            display: inline-block;
            flex: 1;
            height: 100%;
            border-right: 1px solid #E6E6E6;
            overflow-y: auto;
            &::-webkit-scrollbar {
                width: 6px;
                background: transparent;
            }
            &::-webkit-scrollbar-thumb {
                background: #DBE0E6;
                border-radius: 3px;
            }
        }
        &__detail {
            border: none;
            &__content {
                padding: 0 20px 20px;
                height: 85%;
                overflow-y: auto;
                &::-webkit-scrollbar {
                    width: 6px;
                    background: transparent;
                }
                &::-webkit-scrollbar-thumb {
                    background: #DBE0E6;
                    border-radius: 3px;
                }
            }
            &__footer {
                margin-top: 10px;
                text-align: center;
                span {
                    cursor: pointer;
                    &:first-child {
                        color: #999999;
                        &:hover {color: #b4b4b4}
                        &:active {color: #0091FF}
                    }
                    &:last-child {
                        color: #0091FF;
                        &:hover {color: #5eadff}
                        &:active {color: #0083e6}
                    }
                }
            }
        }
    }
    // 选择的项目
    &__result {
        &__item {
            white-space: nowrap;
            font-size: 14px;
            display: inline-block;
            // height: 30px;
            line-height: 28px;
            border: 1px solid #E0E0E0;
            border-radius: 3px;
            background: #FAFAFA;
            padding: 0 5px;
            margin: 10px 10px 0 0;
            cursor: default;
            color: #999999;
            white-space: normal;
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
}
.popup-enter-active, .popup-leave-active {
    transition: transform .5s;
    transform-origin: left bottom;
}
.popup-enter, .popup-leave-to {
    transform: scale(0);
    transform-origin: left bottom;
}
</style>
