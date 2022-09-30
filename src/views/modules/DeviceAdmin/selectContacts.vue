<template>
  <div>
    <sv-dialog
      ref="svdialog"
      @cancel="closePopup"
      @confirm="submitData"
    >
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
          <div :class="$style.selectContactsContentTitle">
            资源列表
          </div>
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
                    { [$style['shortcut--active']]: activeShortcut === 3 }
                  ]"
                  @click="handleAllClick"
                >
                  全部
                </div>
                <div
                  v-loading="isGroupTreeLoading"
                  element-loading-spinner="sv-loading"
                  style="height: 450px;"
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
                    <div
                      slot-scope="{ node, data }"
                      class="sv-tree-node"
                    >
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
                    <div>
                      {{ contact.name || contact.source || contact.phone || '-' }}
                    </div>
                  </el-checkbox>
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
                <div class="changePage">
                  <el-pagination
                    layout="prev, pager, next"
                    small
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
                <el-col
                  :span="22"
                  :class="$style.name_margin"
                >
                  <span :title="JSON.parse(item).name">{{ JSON.parse(item).name }}</span>
                </el-col>
                <el-col
                  :span="2"
                  :class="$style.icon_delete"
                >
                  <div @click.stop="deleteReciever(item)">
                    ×
                  </div>
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
  name: 'SelectContacts',
  props: {
    dialogTitle: {
      type: String,
      default: () => '1',
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
    };
  },
  watch: {
    dialogTitle(newVal, oldVal) {
      if (newVal !== oldVal) {
        this.deviceTitle = `关联${newVal}`;
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
        this.checkedContactsObjList.forEach((Val) => {
          const { id } = JSON.parse(Val);
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
      this.closePopup();
      this.$emit('selectedList', this.typeFlag, this.checkedContactsObjList);
    },
    handleCheckedCitiesChange(value) {
      const checkedCount = value.length;
      this.checkAll = checkedCount === this.cities.length;
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.cities.length;
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
      const o = {
        id: contact.id,
        name: contact.name || contact.source,
        type: this.typeFlag,
      };
      if (isChecked) {
        this.checkedContactsObjList.push(JSON.stringify(o));
      } else {
        const index = this.checkedContactsObjList.indexOf(JSON.stringify(o));
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
      this.checkedContactsObjList.splice(
        this.checkedContactsObjList.indexOf(item),
        1,
      );
      this.checkedContactsIdList.splice(
        this.checkedContactsIdList.indexOf(item),
        1,
      );
    },
    getGroupTree() {
      this.isGroupTreeLoading = true;
      const urlPathObj = {
        1: '/mail/mailgroup/list', // 联系人
        2: '', // 风险隐患
        3: '/resoure/resourareatype/list', // 避难场所 '/resoure/resourearea/list'
        4: '/resoure/resoureProtectGroup/listTree', // 防护目标 '/resoure/resoureProtectTarget/listByGroupId'
        5: 'resoure/resourearticlestorehouse/tree', // 应急物资库 '/resoure/resourearticle/list'
        6: '/resoure/resoureequipmentgroup/list', // 应急装备库
        7: '/resoure/resoureteamtype/tree', // 应急队伍 '/resoure/resoureteam/list'
        8: '/resoure/expertGroup/listTree', // 应急专家 '/resoure/resourexpert/list'
      };
      // 请求参数
      const request = {
        method: 'get',
        baseURL: window.SITE_CONFIG.baseUrl,
        url: urlPathObj[this.typeFlag],
        params: {
          search: this.searchKeyword,
        },
      };
      if (parseInt(this.typeFlag, 10) !== 2) {
        // 发送请求
        this.$http(request)
          .then(
            ({ data: response }) => {
              if (response.code === 0) {
                this.groupTreeData = [...response.data];
              }
            },
          )
          .finally(() => {
            this.isGroupTreeLoading = false;
          });
      } else {
        this.isGroupTreeLoading = false;
        this.groupTreeData = [];
      }
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
      const urlPathObj = {
        1: '/mail/mailcontactor/list', // 联系人
        2: '/risk/riskdanger/list', // 风险隐患
        3: '/resoure/resourearea/list', // 避难场所 areaTypeId
        4: '/resoure/resoureProtectTarget/listByGroupId', // 防护目标
        5: '/resoure/resourearticle/list', // 应急物资库
        6: '/resoure/resoureequipment/list', // 应急装备库
        7: '/resoure/resoureteam/list', // 应急队伍
        8: '/resoure/resourexpert/list', // 应急专家
      };
      const idTextObj = {
        3: 'areaTypeId',
        7: 'teamTypeIds',
      };
      const treeId = {};
      if (this.typeFlag in { 3: '', 7: '' }) {
        treeId[idTextObj[this.typeFlag]] = this.selectedGroupIds;
      } else if (this.typeFlag === '5') {
        [treeId.resoureArticleStorehouseId] = [this.selectedGroupIds[0]];
      } else if (this.typeFlag === '6') {
        [treeId.groupId] = [this.selectedGroupIds[0]];
      } else if (this.typeFlag === '8') {
        treeId.groupIds = this.selectedGroupIds;
      } else {
        treeId.groupId = this.selectedGroupIds;
      }
      this.isContactsListLoading = true;
      const paramsData = {
        limit: 10,
        page: this.pageIndex,
        search: this.searchKeyword,
        ...treeId,
      };
      const request = {
        method: parseInt(this.typeFlag, 10) === 6 ? 'get' : 'post',
        baseURL: window.SITE_CONFIG.baseUrl,
        url: urlPathObj[this.typeFlag],
        params: parseInt(this.typeFlag, 10) === 6 ? paramsData : undefined,
        data: parseInt(this.typeFlag, 10) === 6 ? undefined : paramsData,
      };
      this.$http(request)
        .then(({ data: response }) => {
          if (response.code === 0) {
            const listType = this.typeFlag in {
              1: '', 2: '',
            }
              ? 'data'
              : 'page';
            this.pageTotal = response[listType].totalPage || response[listType].totalCount;
            this.contactListData = [...response[listType].list];
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
    },
  },
};
</script>

<style lang="scss" module>
.selectContactsTitle{
    width: 100%;
    height: 40px;
    line-height: 40px;
    background: #F1F4F6;
    color: #333333;
    position: relative;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    justify-content: center;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
    position: relative;
    &>span{
        &:last-child{
            width: 15px;
            height: 15px;
            top: 10px;
            right: 14px;
            position: absolute;
            background: url('./assets/close.svg')no-repeat;
            background-size: 100% 100%;
            cursor: pointer;
        }
    }
}
.selectContacts{

}
.selectContactsContent{
    padding: 10px;
    box-sizing: border-box;
    width: 1000px;
    height: 600px;
    display: flex;
}
.selectContactsContentTitle{
    border-left: 2px solid #3F92FE;
    font-size: 16px;
    color: #333333;
    font-weight: bold;
    padding-left: 10px;
}
.selectContactsContentLeft{
    flex: 1;
    overflow:hidden;
    padding-right: 10px;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    &>div:first-child{
        margin-bottom: 10px;
    }
    &>div:last-child{
        padding-bottom: 10px;
        flex: 1;
        box-sizing: border-box;
        display: flex;
        &>div{
            flex: 1;
            padding: 10px;
            background: #F1F4F6;
            border-radius: 5px;
            box-sizing: border-box;
            &:first-child{
                margin-right: 10px;
            }
        }
    }
}
.selectContactsContentRight{
    width: 30%;
    display: flex;
    flex-direction: column;
    &>div{
        &:last-child{
            margin-top: 10px;
            flex: 1;
            position: relative;
            background: #F1F4F6;
            padding: 10px;
            box-sizing: border-box;
            border-radius: 5px;
            span{
                //position: absolute;
                //bottom: 10px;
                //left: 10px;
                //cursor: pointer;
                //color: #48b8c9;
                &:hover{
                    color: #0091FF;
                }
            }
        }
    }
}
.selectContactsContentTree{
  height: 500px;
  margin-top: 10px;
}
.result{
    height: 556px;
    max-height: 556px;
    background: #fff;
    position: relative;
    &>div{
        &:first-child{
            height: 100%;
            overflow-y: auto;
            overflow-x: hidden;
            &>div{
                display: flex;
                flex-direction: column;
            }
        }
        &:last-child{
            position: absolute;
            bottom: 20px;
            left: 10px;
        }
    }
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

.treeScroll {
  height: 500px;
  overflow-y: auto;
  &::-webkit-scrollbar {
        background: transparent;
        width: 5px;
    }

    &::-webkit-scrollbar-thumb {
        background: #d5d5d5;
        border-radius: 5px;
    }
}
.contactList {
  // width: 330px;
 height: 500px;
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
      // flex-direction: row-reverse;
      height: 30px !important;
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
.clear_all {
  float: right;
  font-size: 14px;
  cursor: pointer;
  color: #0091FF;
}
.selected_items {
  display: flex;
  height: 30px;
  align-items: center;
  border: 1px solid #f1f4f6;
    &:hover {
      border: 1px solid #0091FF;
      border-radius: 4px;
    }
    .icon_delete {
      cursor: pointer;
    }
    .name_margin {
      margin-left: 10px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
}
</style>
<style lang="scss" scoped>
.changePage  /deep/ .el-pager li.active {
  background: transparent;
  color: #0091ff !important;
}
.changePage /deep/ .el-pager li {
  border: 1px solid #f1f4f6;
  background: #f1f4f6;
  margin-right: 10px;
  min-width: 30px;
  height: 30px;
  border-radius: 2px;
  text-align:center !important;
}
// 下一页样式
.changePage /deep/ .btn-prev,
.changePage /deep/ .btn-next {
  border: 1px solid #f1f4f6;
  background: #f1f4f6;
  padding: 0;
  border-radius: 2px;
  margin: 0 5px 0 10px;
}
// 上一页样式
.changePage /deep/ .btn-prev {
  border: 1px solid #f1f4f6;
  background: #f1f4f6;
  padding: 0;
  margin-right: 10px;
}
// 上、下一页点击后的样式
.changePage /deep/ .el-pagination button:hover {
  color: #0091ff;
}
.changePage /deep/ .el-pagination button:disabled {
  color: #c0c4cc;
}
</style>
