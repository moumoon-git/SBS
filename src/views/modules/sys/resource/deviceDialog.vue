<template>
  <div>
    <sv-dialog ref="svdialog" @cancel="closePopup" @confirm="submitData">
      <!-- @confirm="confirm" -->
      <!-- 头部居中 -->
      <template #title>
        <div :class="$style.selectContactsTitle">
          <span>{{ deviceTitle }}</span>
          <span @click="closePopup" />
        </div>
      </template>
      <!-- 内容 -->
      <main :class="$style.selectContactsContent">
        <!-- 左边内容 -->
        <aside :class="$style.selectContactsContentLeft">
          <div :class="$style.selectContactsContentTitle">资源列表</div>
          <div>
            <!-- 搜索和树的外套 -->
            <div>
              <sv-input-tree-search
                v-model.lazy="searchKeyword"
                width="calc(100% - 20px)"
                @change="handleSearchKeywordChange"
              />
              <!-- 树 -->
              <div :class="$style.selectContactsContentTree">
                <div
                  :class="[
                    $style.shortcut,
                    { [$style['shortcut--active']]: activeShortcut === 3 },
                  ]"
                  @click="handleAllClick"
                >
                  全部
                </div>
                <div
                  v-loading="isGroupTreeLoading"
                  element-loading-spinner="sv-loading"
                  style="height: 450px"
                  :class="['sv-tree', $style.treeScroll]"
                >
                  <el-tree
                    ref="groupTree"
                    node-key="id"
                    style="background: #f1f4f6"
                    :data="groupTreeData"
                    :props="defaultProps"
                    :highlight-current="true"
                    default-expand-all
                    @node-click="seleteNode"
                  >
                    <div slot-scope="{ node, data }" class="sv-tree-node">
                      <div class="label">
                        {{ node.label }}
                      </div>
                    </div>
                  </el-tree>
                </div>
              </div>
            </div>
            <!-- 结果 -->
            <div :class="$style.result">
              <div
                v-loading="isContactsListLoading"
                element-loading-spinner="sv-loading"
                :class="$style.contactList"
              >
                <!-- B.2 勾选列表 -->
                <!-- 分级平台管理只可以选择一个终端 -->
                <el-checkbox-group
                  v-model="checkedContactsIdList"
                  :class="$style.checkGroupList"
                  :max="selectedOne ? 1 : undefined"
                >
                  <el-tooltip
                    v-for="(contact, index) in contactListData"
                    :key="`contact_${index}`"
                    :disabled="!contact.resources || !contact.resources.length"
                    :content="contact.resources
                      &&  contact.resources.length
                        && contact.resources[0].type === 1 ?
                      `该设备已被${contact.resources[0].data[0].entity.name}绑定`
                      : ''
                    "
                    placement="right"
                    effect="light">
                      <!-- <el-checkbox>的label attribute取值不支持Object，需要转换成String -->
                      <el-checkbox
                      :class="$style.checkboxItem"
                      :label="contact.id"
                      border
                      size="medium"
                      @change="handleCheckChange($event, contact)"
                      :disabled="contact.resources && contact.resources.length > 0 && contact.resources[0].type === 1"
                    >
                      <div :class="$style.checkbox_detail">
                        {{
                          contact.name || contact.mobile1 || contact.phone || '-'
                        }}
                      </div>
                    </el-checkbox>
                  </el-tooltip>


                </el-checkbox-group>
              </div>
              <div>
                <el-checkbox
                  v-model="isCheckAll"
                  :indeterminate="isCheckAllIndeterminate"
                  @change="handleCheckAllChange"
                >
                  全选
                </el-checkbox>
                <!-- B.3 分页器 -->
                <div :class="$style.pagination_detail">
                  <el-pagination
                    layout="prev, pager, next"
                    background
                    :current-page.sync="pageIndex"
                    :page-count="pageTotal"
                    :pager-count="5"
                    @current-change="getDeviceData"
                  />
                </div>
              </div>
            </div>
          </div>
        </aside>
        <!-- 右边内容 -->
        <aside :class="$style.selectContactsContentRight">
          <div :class="$style.selectContactsContentTitle">
            已选（{{ checkedContactsObjList.length }}）
          </div>
          <div>
            <div :class="$style.treeScroll">
              <el-col
                v-for="(item, idx) in checkedContactsObjList"
                :key="idx"
                :class="$style.selected_items"
              >
                <el-col :span="22" :class="$style.name_margin">
                  <span :title="item.name">{{ item.name }}</span>
                </el-col>
                <el-col :span="2" :class="$style.icon_delete">
                  <div @click.stop="deleteReciever(item)">×</div>
                </el-col>
              </el-col>
            </div>
            <span @click="clearReciever">全部清除</span>
          </div>
        </aside>
      </main>
    </sv-dialog>
  </div>
</template>

<script>
export default {
  props: {
    dialogTitle: {
      type: String,
      default: () => '1',
    },
    selectedList: {
      type: Array,
      required: false,
    },
    selectedOne: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      searchKeyword: '',
      // 树形数据
      defaultProps: {
        children: 'children',
        label: 'name',
      },
      // 树形全选
      checked: false,
      // 选完树之后的结果
      isIndeterminate: false,
      activeShortcut: 3,
      deviceTitle: '',
      filterText: '',
      dataList: [],
      // 选中的分组及其子孙节点的id集合
      selectedGroupIds: [],
      // 联系人列表数据
      contactListData: [],
      // 联系人列表分页页码
      pageIndex: 1,
      isGroupTreeLoading: false,
      // 联系人列表载入中动画
      isContactsListLoading: false,
      // 联系人列表分页总页数
      pageTotal: 1,
      // 是否全选
      isCheckAll: false,
      // 是否半选
      isCheckAllIndeterminate: false,
      // 已勾选的联系人列表
      checkedContactsIdList: [],
      checkedContactsObjList: [],
      checkedIds: {}, // 当前变化的复选框
      checkedNodes: [],
      groupTreeData: [],
      typeFlag: '',
      isMettingismDevice: false,
      selectedOne: '', // 是否单选
    };
  },
  watch: {
    dialogTitle(newVal, oldVal) {
      if (newVal !== oldVal) {
        this.deviceTitle = `关联${newVal}`;
      }
    },
    selectedOne(newVal, oldVal) {
      if (newVal !== oldVal) {
        this.selectedOne = newVal;
      }
    },
    // 换页、点击分组、常用联系人、最近联系人时列表数据改变，判断全选按钮状态
    contactListData() {
      this.validateCheckAll();
    },

    // 收信人列表发生变化
    checkedContactsObjList: {
      handler(newVal, oldVal) {
        this.validateCheckAll();
        this.checkedContactsObjList = newVal;
        // 更新勾选列表
        const newCheckedContactsIdList = [];
        this.checkedContactsObjList.forEach((newVals) => {
          const { id } = newVals;
          if (id) {
            newCheckedContactsIdList.push(id);
          }
        });
        this.checkedContactsIdList = [...newCheckedContactsIdList];
      },
      deep: true,
    },
  },
  methods: {
    // 加载弹窗
    loadingPopup() {
      if (this.$refs.svdialog) {
        this.$refs.svdialog.visible = true;
      } else {
        setTimeout(() => {
          this.$refs.svdialog.visible = true;
        }, 200);
      }
    },
    // 关闭弹窗
    closePopup() {
      this.$refs.svdialog.visible = false;
    },
    initData(type, data) {
      this.typeFlag = type;
      this.getGroupTree();
      this.getDeviceData();
      this.checkedContactsObjList = [...data];
    },
    submitData() {
      if (!this.isMettingismDevice) {
        if (this.checkedContactsObjList.length) {
          this.closePopup();
          this.$emit(
            'selectedList',
            this.typeFlag,
            this.checkedContactsObjList,
          );
        } else {
          this.$message.error('请选择设备');
        }
      } else {
        if (this.checkedContactsObjList.length) {
          this.closePopup();
          this.$emit('mettingDeviceData', this.checkedContactsObjList);
        } else {
          this.$message.error('请选择设备');
        }
      }
    },
    handleCheckedCitiesChange(value) {
      const checkedCount = value.length;
      this.checkAll = checkedCount === this.cities.length;
      this.isIndeterminate =
        checkedCount > 0 && checkedCount < this.cities.length;
    },
    reset() {
      this.$refs.groupTree.setCurrentKey(null);
      this.selectedGroupIds = [];
      this.pageIndex = 1;
    },
    /**
     * @description 搜索栏发生变化
     */
    handleSearchKeywordChange() {
      this.reset();
      this.getDeviceData();
      this.getGroupTree();
    },
    /**
     * @description 点击“全部”按钮，获取联系人列表数据
     */
    handleAllClick() {
      this.activeShortcut = 3;
      this.reset();
      this.getDeviceData();
    },
    /**
     * @description 单个联系人勾选改变
     * @param { Boolean } isChecked 是否勾选
     * @param { Object } contact 联系人
     */
    handleCheckChange(isChecked, contact) {
      console.log('%c [ xxx ]', 'font-size:13px; background:pink; color:#bf2c9f;', 123123);
      const o = {
        id: contact.id,
        name: contact.name,
        type: this.typeFlag,
        isDefault: 0,
        subscription: contact.subscription, // 是否订阅
      };
      if (isChecked) {
        this.checkedContactsObjList.push(o);
      } else {
        const index = this.checkedContactsObjList.findIndex(
          (item) => item.id === contact.id,
        );
        this.checkedContactsObjList.splice(index, 1);
      }
      this.validateCheckAll();
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
     * @description 清空已选
     */
    clearReciever() {
      this.checkedContactsObjList = [];
      this.checkedContactsIdList = [];
    },
    /**
     * @description 删除特定收信人
     * @param { String } reciever 收信人
     */
    deleteReciever(item) {
      const index = this.checkedContactsObjList.findIndex(
        (it) => it.id === item.id,
      );
      this.checkedContactsObjList.splice(index, 1);
      this.checkedContactsIdList.splice(index, 1);
    },
    getGroupTree() {
      this.isGroupTreeLoading = true;
      // 请求参数
      const request = {
        method: 'get',
        baseURL: window.SITE_CONFIG.baseUrl,
        url: `${window.SITE_CONFIG.cloudUrl}/device/device/appdevicegroup/tree/all`,
        params: {
          search: this.searchKeyword,
          type: this.typeFlag,
        },
      };
      // 发送请求
      this.$http(request)
        .then(({ data: response }) => {
          if (response.code === 0) {
            this.groupTreeData = [...response.data];
          }
        })
        .finally(() => {
          this.isGroupTreeLoading = false;
        });
    },
    // 点击节点
    seleteNode(nodeObj) {
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
      this.getDeviceData();
      // if (data) {
      //   // console.log('发起请求了', data)
      //   this.$emit('handleNodeClick', data);
      // }
    },
    getDeviceData() {
      this.isContactsListLoading = true;
      const data = {
          size: 10,
          page: this.pageIndex,
          search: this.searchKeyword,
          groupIds: this.selectedGroupIds,
          type: this.typeFlag,
      }
      if(this.typeFlag === '4') {
        data.selectRelated = 1
      }else {
        data.countObject = 1
      }
      const request = {
        method: 'post',
        baseURL: window.SITE_CONFIG.baseUrl,
        url: `${window.SITE_CONFIG.cloudUrl}/device/device/appdevice/page`,
        data,
      };
      this.$http(request)
        .then(({ data: response }) => {
          if (response.code === 0) {
            this.contactListData = [...response.data.list];
            this.pageTotal = response.data.totalPage;
          }
        })
        .finally(() => {
          this.isContactsListLoading = false;
        });
    },
    // 删除选择的传真对象
    deleteSelection(item) {
      const selectIdx = this.checkedNodes.findIndex((e) => e.id === item.id);
      this.checkedNodes.splice(selectIdx, 1);
      this.$refs.tree.setCheckedKeys(this.checkedNodes.map((item) => item.id));
    },
    handleCheckAllChange() {
      if (this.isCheckAll) {
        // 当前页全选
        this.contactListData.forEach((contact) => {
          // 未勾选的勾选上
          if (!this.checkedContactsIdList.includes(contact.id)) {
            this.checkedContactsIdList.push(contact.id);
            this.checkedContactsObjList.push(contact);
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
    },
  },
};
</script>

<style lang="scss" module>
.selectContactsTitle {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  position: relative;
  position: relative;
  justify-content: center;
  align-items: center;
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
  width: 100%;
  height: 40px;
  background: #f1f4f6;
  line-height: 40px;
  color: #333;

  -webkit-box-align: center;
  -ms-flex-align: center;
  & > span {
    &:last-child {
      position: absolute;
      right: 14px;
      top: 10px;
      width: 15px;
      height: 15px;
      background: url('../../DeviceAdmin/assets/close.svg') no-repeat;
      background-size: 100% 100%;
      cursor: pointer;
    }
  }
}

.selectContactsContent {
  display: flex;
  box-sizing: border-box;
  padding: 10px;
  width: 1000px;
  height: 600px;
}
.selectContactsContentTitle {
  padding-left: 10px;
  border-left: 2px solid #3f92fe;
  font-weight: bold;
  font-size: 16px;
  color: #333;
}
.selectContactsContentLeft {
  display: flex;
  overflow: hidden;
  flex-direction: column;
  flex: 1;
  box-sizing: border-box;
  padding-right: 10px;
  & > div:first-child {
    margin-bottom: 10px;
  }
  & > div:last-child {
    display: flex;
    flex: 1;
    box-sizing: border-box;
    padding-bottom: 10px;
    & > div {
      flex: 1;
      box-sizing: border-box;
      padding: 10px;
      border-radius: 5px;
      background: #f1f4f6;
      max-width: 333px;
      &:first-child {
        margin-right: 10px;
      }
    }
  }
}
.selectContactsContentRight {
  display: flex;
  flex-direction: column;
  width: 30%;
  & > div {
    &:last-child {
      position: relative;
      flex: 1;
      //padding: 10px;
      box-sizing: border-box;
      margin-top: 10px;
      border-radius: 5px;
      background: #f1f4f6;
      span {
        //position: absolute;
        //bottom: 10px;
        //left: 10px;
        //cursor: pointer;
        //color: #48b8c9;
        &:hover {
          color: #0091ff;
        }
      }
    }
  }
}
.selectContactsContentTree {
  margin-top: 10px;
  height: 500px;
}
.result {
  position: relative;
  height: 556px;
  max-height: 556px;
  background: #f1f4f6;
  & > div {
    &:first-child {
      overflow-x: hidden;
      overflow-y: auto;
      height: 100%;
      & > div {
        display: flex;
        flex-direction: column;
      }
    }
    &:last-child {
      position: absolute;
      left: 10px;
      bottom: 20px;
    }
  }

  .pagination_detail {
    max-width: 333px;
  }
}
.shortcut {
  padding-left: 25px;
  border-left: 2px solid transparent;
  height: 45px;
  cursor: pointer;
  line-height: 45px;

  &:hover {
    background: rgba(0, 145, 255, 0.1);
  }

  &--active {
    border-left: 2px solid #0091ff;
    background: rgba(0, 145, 255, 0.1);
    color: #0091ff;
  }
}

.treeScroll {
  overflow-y: auto;
  height: 500px;
  &::-webkit-scrollbar {
    width: 5px;
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    border-radius: 5px;
    background: #d5d5d5;
  }
}
.contactList {
  display: flex;
  flex-direction: column;
  // width: 330px;
  height: 500px;

  .header {
    flex-grow: 0;
    flex-shrink: 0;
    padding: 0 10px;
    height: 50px;
    line-height: 50px;
    font-size: 16px;

    .title {
      display: inline-block;
      padding-left: 20px;
      border-left: 3px solid #0091ff;
      height: 16px;
      line-height: 16px;
      font-weight: bold;
    }
  }
  .checkGroupList {
    overflow-x: hidden;
    overflow-y: auto;
    flex-grow: 1;
    height: 100%;

    &::-webkit-scrollbar {
      width: 5px;
      background: transparent;
    }

    &::-webkit-scrollbar-thumb {
      border-radius: 5px;
      background: #d5d5d5;
    }

    .checkboxItem {
      display: flex;
      align-items: center;
      margin: 0 10px 10px 10px !important;
      border-radius: 4px;
      // flex-direction: row-reverse;
      height: 30px !important;

      .checkbox_detail {
        width: 255px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      &:hover {
        border-color: #0091ff;
      }

      &:last-child {
        margin-bottom: 0 !important;
      }
    }

    .contactName {
      font-weight: bold;
    }

    .workUnit {
      margin-top: 5px;
    }
  }

  .footer {
    flex-grow: 0;
    flex-shrink: 0;
    padding-top: 5px;
    height: 45px;
    line-height: 45px;
  }
}
.clear_all {
  float: right;
  cursor: pointer;
  font-size: 14px;
  color: #0091ff;
}
.selected_items {
  display: flex;
  align-items: center;
  border: 1px solid #f1f4f6;
  height: 30px;
  &:hover {
    border: 1px solid #0091ff;
    border-radius: 4px;
  }
  .icon_delete {
    cursor: pointer;
  }
  .name_margin {
    overflow: hidden;
    margin-left: 10px;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}
</style>
