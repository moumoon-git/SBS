<template>
  <div>
    <sv-template
      ref="template"
      :tree-setting="treeSetting"
      title="应急机构"
      :date-select="false"
      :search-setting="{
        width: '200',
        placeholder: '请输入应急机构名称搜索',
      }"
      :export-select-config="
        isAuth('')
          ? {
              api: '',
            }
          : {}
      "
      :export-query-config="
        isAuth('')
          ? {
              api: '',
              params: { teamIds: [] },
            }
          : {}
      "
      :import-data-config="
        isAuth('') && isPlatformRoot
          ? {
              api: '',
              overload: handleAvatarSuccess,
            }
          : {}
      "
      :download-template-config="{
        api: '',
      }"
      :delete-selected-config="
        isAuth('') && isPlatformRoot
          ? { api: '' }
          : {}
      "
      :table-request="tableRequest"
      @tree-click="handleNodeClick"
      @tree-node-delete="deleteTreeNode"
      :overload="overload"
    >
      <template #grade__dropDown>
        <grade-dropDown @operationChange="operationChange" />
      </template>
      <!-- <template #sort__options>
        <sv-button
          v-if="isAuth('resoure:resoureteam:save') && isPlatformRoot"
          type="primary"
          @click="handleSort"
        >
          排序
        </sv-button>
      </template> -->
      <template #middle__operation__button>
        <sv-button
          v-if="isAuth('resoure:resoureteam:save') && isPlatformRoot"
          type="primary"
          @click="handleAppend('add', '')"
        >
          新增
        </sv-button>
      </template>
      <template #middle__table>
        <el-table-column
          prop="name"
          header-align="center"
          align="center"
          label="名称"
          :show-overflow-tooltip="true"
        />

        <el-table-column
          prop="mobile1"
          header-align="center"
          align="center"
          label="手机号码"
          :show-overflow-tooltip="true"
        />

        <el-table-column
          prop="workUnit"
          header-align="center"
          align="center"
          label="工作单位"
          :show-overflow-tooltip="true"
        />

        <el-table-column
          prop="officeTel"
          header-align="center"
          align="center"
          label="办公电话"
        />

        <el-table-column
          prop="position"
          header-align="center"
          align="center"
          label="职务"
          :show-overflow-tooltip="true"
        />
        <el-table-column
          header-align="center"
          align="center"
          width="260"
          label="操作"
        >
          <template slot-scope="scope">
            <sv-table-operation
              :display="isPlatformRoot ? ['view', 'edit', 'delete'] : ['view']"
              @view="handleDetail(scope.row)"
              @edit="handleUpdate(scope.row)"
              @delete="handledelete(scope.row)"
            />
          </template>
        </el-table-column>
      </template>
    </sv-template>
    <Resource-importError ref="resourceImportError" />
    <!-- 新增/修改/查看表格弹出框 -->
    <Form
      ref="mychild"
      @fatherMethod="fatherMethod"
      :current-node="currentNode"
      :treeData="treeData"
    ></Form>
    <!-- description: 联系人排序弹出框 -->
    <contact-sorting-popup
      ref="ContactSortingPopup"
      @getTable="getTable"
    ></contact-sorting-popup>
    <!-- 树的删除弹窗 -->
    <sv-dialog-hint
      ref="delete_hint"
      type="delete"
      @confirm="doDeleteTreeNode"
    />
    <!-- 表格数据的删除弹窗 -->
    <sv-dialog-hint
      ref="delete_table"
      type="delete"
      @confirm="batchDelete(deleteIds)"
    />
    <sv-dialog-hint ref="delete_fail" type="fail" text="删除失败" />
  </div>
</template>

<script>
import ResourceImportError from '../../resource/equipmentImportError.vue';
import GradeDropDown from '../../../common/GradeDropDown.vue';
import Form from './DepartmentForm';
import ContactSortingPopup from '../../../../ebs_components/contactSortingPopup'; // 联系人排序
import axios from 'axios';
export default {
  name: 'departmentInfo',
  data() {
    return {
      isPlatformRoot: true,
      // 使用模板的一些参数配置，具体看文档
      treeSetting: {
        tab: [],
        api: `${window.SITE_CONFIG['event']}/emergency/mechanism/group/tree`,
        edit: this.isAuth('mail:mailgroup:delete')
          ? {
              add: `${window.SITE_CONFIG['event']}/emergency/mechanism/group/save`,
              update: `${window.SITE_CONFIG['event']}/emergency/mechanism/group/save`,
              delete: `${window.SITE_CONFIG['event']}/emergency/mechanism/group/delete`,
            }
          : false,
        isPlatformRoot: true,

      },
      tableRequest: {
        api: `${window.SITE_CONFIG['event']}/emergency/mechanism/contactor/listByPage`,
        method: 'post',
        params: {
          page: 1,
          limit: 10,
          search: '',
          groupId: this.currentTreeID ? Number(this.currentTreeID) : 0,
        },
      },
      currentNode: '',
      checkedNodes: [],
      selectedNode: [],
      treeID: 0, //类别ID
      currentTreeID: '',
      currentName: '',
      treeData: [],
      overload: {
        getTableList: () => {},
      },
    };
  },
  components: {
    ResourceImportError,
    GradeDropDown,
    Form,
    ContactSortingPopup, // 联系人排序
  },
  created() {
    this.overload.getTableList = this.getTableList;
  },
  methods: {
    // 是否选择的是本平台
    operationChange(isPlatformRoot, platformId) {
      // 本平台的一些按钮显隐
      if (isPlatformRoot) {
        this.treeSetting.edit = this.isAuth('mail:mailgroup:delete')
          ? {
              add: `${window.SITE_CONFIG['event']}/emergency/mechanism/group/save`,
              update: `${window.SITE_CONFIG['event']}/emergency/mechanism/group/save`,
              delete: true,
            }
          : false;
        this.treeSetting.isPlatformRoot = true;
      } else {
        this.treeSetting.edit = false;
        this.treeSetting.isPlatformRoot = false;
      }
      this.isPlatformRoot = isPlatformRoot;

      // 请求数据参数
      this.tableRequest.params.platformId = platformId;
      this.tableRequest.params.groupId = 0;
      this.treeSetting.api = `${window.SITE_CONFIG['event']}/emergency/mechanism/group/tree?platformId=${platformId}`; //树查找的接口
      new Promise((resolve, reject) => {
        this.$refs.template.getTree();
        resolve();
      }).then(() => {
        this.overload.getTableList = this.getTableList;
        this.$refs.template.getTableList();
      });
    },

    /**
     * @description 获取表格数据
     */
    getTableList(params) {
      return new Promise((resolve) => {
        this.tableRequest.params.search = this.$refs.template.keyword;
        this.tableRequest.params.limit =
          this.$refs.template.paginationConfig.pageSize;
        this.tableRequest.params.page =
          this.$refs.template.paginationConfig.currentIndex;
        let data = { ...this.tableRequest.params };
        data.groupId = !params
          ? data.groupId
          : params.groupId
          ? params.groupId
          : 0;
        const request = {
          method: this.tableRequest.method,
          url: this.tableRequest.api,
          headers: {
            'Content-Type': 'application/json; charset=utf-8',
            token: this.$refs.template.token,
          },
          data,
        };
        axios(request).then((response) => {
          if (response.data.code === 0) {
            // 表格内容
            this.$refs.template.tableList = response.data.data.data;
            this.$refs.template.paginationConfig.totalCount =
              response.data.data.totalElements;
            resolve(response.data.data.data || []);
          } else {
            resolve([]);
          }
          this.$refs.template.tableLoading = false;
        });
      });
    },

    /**
     * @description: 函数获取selectedNode逻辑没变，更改了刷新页面的方法，因为树的结构在点击全部的时候返回null,所以加了判断处理
     * @param {*}
     * @return {*}
     */
    // 点击树形节点事件
    handleNodeClick(obj) {
      console.log('点击树：', obj);
      if (obj === null) {
        this.currentNode = '';
        this.tableRequest.params.groupId = 0;
      } else {
        this.currentNode = obj;
        this.getTreeChildren(obj);
        this.tableRequest.params.groupId = obj.id;
      }
      console.log(this.tableRequest);
      this.$refs.template.getTableList();
    },

    /**
     * @description: 判断传进的数据是否包含子节点，并将所有节点的id保存为数组
     * @param {Obiect} obj 点击树节点的数据结构
     */
    getTreeChildren(obj) {
      this.tableRequest.params.groupId = obj.id;
      if (obj.children !== null) {
        obj.children.forEach((item) => {
          this.getTreeChildren(item);
        });
      }
    },

    /**
     * @description: 删除对应的树节点，并限制树节点有数据时无法删除
     * @param node 树节点
     */
    deleteTreeNode(node) {
      console.log('node:', node);
      if (this.$refs.template.getTreeNodeChildren(node.id).length > 1) {
        this.$refs.delete_fail.visible = true;
        this.$refs.delete_fail.supplementText = '请先删除子分组数据！';
        return;
      }
      this.tobeDeletedNode = node;
      this.getTableList({ groupId: node.id }).then((res) => {
        console.log('获取表格数据：', res);
        if (res.length === 0) {
          this.$refs.delete_hint.visible = true;
        } else {
          this.$refs.delete_fail.visible = true;
          this.$refs.delete_fail.supplementText = '请先删除分组内的表格数据！';
        }
      });
    },

    /**
     * @description 删除树节点
     */
    doDeleteTreeNode() {
      this.$http({
        url: `${window.SITE_CONFIG['event']}/emergency/mechanism/group/delete`,
        method: 'post',
        data: [this.tobeDeletedNode.id],
      })
        .then(({ data }) => {
          if (data && data.code === 0) {
            this.$message({
              message: '删除成功',
              type: 'success',
            });
            this.$refs.template.getTree();
          } else {
            this.$message({
              message: `${data.msg}`,
              type: 'error',
            });
          }
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除',
          });
        });
    },

    // 上传成功的回调
    handleAvatarSuccess(response, file, fileList) {
      if (response.data.errorData.length == 0) {
        this.$message({
          message: '导入成功!',
          type: 'success',
        });
        this.getDataList();
      } else if (response.data.errorData.length > 0) {
        this.getDataList();
        this.$nextTick(() => {
          this.$refs.resourceImportError.init(response.data.errorData);
          this.$refs.resourceImportError.tableColumn = this.errorTableColumn;
          this.$refs.resourceImportError.tips = this.errorTips;
          this.$refs.resourceImportError.required = this.errorRequired;
        });
      } else {
        this.$message.error({
          type: 'error',
          message: `${response.msg}`,
        });
      }
    },
    handleAppend(type, id) {
      //新增
      // if (this.treeID == 0) {
      //   this.$message({
      //     type: 'warning',
      //     message: '请选择一个分组进行新增联系人',
      //   });
      //   return;
      // }
      //  const that = this;
      //   that.$nextTick(() => {
      //     that.$refs.mychild.init(type, id);
      //   });
      let data = {
        groups: [{ id: this.currentTreeID, name: this.currentName }],
      };
      // this.$refs.search.reset();
      this.$refs.mychild.openModal(data, 'add');
      // this.$refs.mychild.onSelectTree(this.currentTreeID,'add');
    },
    handleSort() {
      this.$refs.ContactSortingPopup.type = 'machinery';
      this.$refs.ContactSortingPopup.isDialogVisible = true; // 弹出框可见
      this.$refs.ContactSortingPopup.getTree(this.treeID); // 获取通讯录树
    },
    /**
     * @description: 打开查看表格数据弹窗
     * @param {Number} id 查看行的数据的id
     * @return {*}
     */
    handleDetail(row) {
      console.log(row, 'row');
      //查看
      let data = row;
      this.$refs.mychild.openModal(data, 'detail', this.currentTreeID);
      this.$refs.mychild.allTreeData = this.$refs.template.treeList;
    },
    fatherMethod() {
      this.$refs.template.getTableList();
    },
    /**
     * @description 打开新增/修改分类点弹窗
     * @param {String} type 弹窗类型：add新增、modify编辑
     * @param {Number} id 编辑时该行的数据的id
     */
    //修改
    handleUpdate(row) {
      let data = row;
      this.$refs.mychild.openModal(data, 'update', this.currentTreeID);
      this.$refs.mychild.allTreeData = this.$refs.template.treeList;
    },
    getTable() {
      this.$refs.template.getTableList(this.tableRequest);
    },
    handledelete(row) {
      let arr = [row.id];
      this.$http({
        url: `${window.SITE_CONFIG['event']}/emergency/mechanism/contactor/delete`,
        method: 'post',
        data: arr,
      }).then(({ data }) => {
        if (data && data.code == 0) {
          this.$message.success('删除成功');
        } else {
          this.$message.error(data.msg);
        }
        this.$refs.template.getTableList();
      });
    },
  },
};
</script>

<style>
</style>