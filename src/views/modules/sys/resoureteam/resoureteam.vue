<!--
 * @Author: your name
 * @Date: 2020-11-18 16:46:55
 * @LastEditTime: 2020-12-02 16:27:25
 * @LastEditors: Please set LastEditors
 * @Description: 主要修改了页面布局，函数大部分复用之前的，需要的修改的函数或者字段已作出相应修改
 * @FilePath: \product_SBS\src\views\modules\sys\resoureteam\resoureteam.vue
-->

<template>
  <div>
    <sv-template
      ref="template"
      :use-plat-form-all="true"
      :tree-setting="treeSetting"
      title="应急队伍"
      :date-select="false"
      :search-setting="{
        width: '200',
        placeholder: '请输入队伍名称搜索',
      }"
      :overload="{
        getTree,
      }"
      :export-select-config="
        isAuth('resoureteam:resoureteamtree:xlsOutput')
          ? {
            api: '/resoure/resoureteam/xlsOutputSelect',
          }
          : {}
      "
      :export-query-config="
        isAuth('resoureteam:resoureteamtree:xlsOutput')
          ? {
            api: '/resoure/resoureteam/xlsOutput',
            params: { teamIds: [] },
          }
          : {}
      "
      :import-data-config="
        isAuth('resoureteam:resoureteamgroup:xlsInput')
        && isPlatformRoot
          ? {
            api: 'resoure/resoureteam/xlsInput',
            overload: handleAvatarSuccess,
          }
          : {}
      "
      :download-template-config="{
        api: '/resoure/resoureteam/gettemplate',
      }"
      :delete-selected-config="
        isAuth('resoure:resoureteam:delete')
        && isPlatformRoot
          ? { api: '/resoure/resoureteam/delete' }
          : {}
      "
      :table-request="tableRequest"
      @tree-click="handleNodeClick"
      @tree-node-delete="deleteEventType"
    >
      <template #grade__dropDown>
        <grade-dropDown
          :plat-show="true"
          :merge-node="true"
          @operationChange="operationChange"
        />
      </template>
      <template #middle__operation__button>
        <sv-button
          v-if="isAuth('resoure:resoureteam:save') && isPlatformRoot"
          type="primary"
          @click="addNewResoureteam('add', '')"
        >
          新增
        </sv-button>
      </template>
      <template #middle__table>
        <el-table-column
          prop="name"
          header-align="center"
          align="center"
          label="队伍名称"
          :show-overflow-tooltip="true"
        />

        <el-table-column
          prop="peopleNumber"
          header-align="center"
          align="center"
          label="队伍人数"
          :show-overflow-tooltip="true"
        />

        <el-table-column
          prop="creationTime"
          header-align="center"
          align="center"
          label="成立时间"
          :show-overflow-tooltip="true"
        />

        <el-table-column
          prop="nature"
          header-align="center"
          align="center"
          label="性质"
          :formatter="ifendcase"
        />

        <el-table-column
          prop="duties"
          header-align="center"
          align="center"
          label="主要职责"
          :show-overflow-tooltip="true"
        />

        <el-table-column
          prop="fax"
          header-align="center"
          align="center"
          label="传真"
        />

        <el-table-column
          prop="telephoneNum"
          header-align="center"
          align="center"
          label="电话"
          :show-overflow-tooltip="true"
        />

        <el-table-column
          prop="address"
          header-align="center"
          align="center"
          label="地址"
          :show-overflow-tooltip="true"
        />

        <el-table-column
          prop="platformName"
          header-align="center"
          align="center"
          label="数据来源"
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
              :display="isPlatformRoot? [
                'view',
                'edit',
                'delete'
              ]: ['view']"
              @view="seeHandle(scope.row.id)"
              @edit="addOrModifyHandle('modify', scope.row.id)"
              @delete="
                deleteIds = scope.row.id;
                $refs.delete_hint.visible = true;
              "
            />
          </template>
        </el-table-column>
      </template>
    </sv-template>

    <!-- 弹窗, 新增 / 修改 -->
    <!-- <add-or-update
      v-if="addOrUpdateVisible"
      ref="addOrUpdate"
      @refreshDataList="getDataList"
      @close="addOrUpdateVisible = false"
    ></add-or-update> -->

    <!-- 查看详情弹窗 -->
    <see
      v-if="seeVisible"
      ref="see"
      @close="seeVisible = false"
    />
    <!-- 新增/修改详情弹窗 -->
    <add-or-modify
      ref="addOrModify"
      :current-node="currentNode"
      @refreshDataList="getDataList"
    />

    <!-- 树状, 查看，修改-->
    <el-dialog
      :title="dialogtitle"
      :visible.sync="dialogVisible"
      width="40%"
    >
      <el-form
        ref="treeForm"
        :modal="treeForm"
      >
        <el-form-item
          label="队伍类型名称"
          size="large"
          label-width="120px"
        >
          <el-input
            v-model="treeForm.currentTreename"
            :readonly="groupingdisabled"
            placeholder="请输入内容"
            clearable
            style="margin-bottom: 10px"
          />
        </el-form-item>
      </el-form>
      <span
        v-if="!groupingdisabled"
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="submittingbygroups"
        >确 定</el-button>
      </span>
    </el-dialog>
    <sv-dialog-hint
      ref="delete_hint"
      type="delete"
      @confirm="batchDelete(deleteIds)"
    />
    <Resource-importError
      ref="resourceImportError"
    />
    <importDataDialog
      ref="importDataDialogRef"
      :down-load-url="downLoadUrl"
      @reUpload="reUpload"
    />
  </div>
</template>

<script>
import { treeDataTranslate } from '@/utils';
import Cookies from 'js-cookie';
import importDataDialog from '@/views/modules/importDataDialog/importDataDialog.vue'
import resoureteamtree from './resoureteam-tree';
import resoureteamheader from './resoureteam-header';
import AddOrUpdate from './resoureteam-add-or-update';
import see from './resoureteam-see';
import addOrModify from './resoureteam-add-or-modify';
import resoureteamtable from './resoureteam-table';
import resoureteamTreeCrud from './resoureteam-tree-crud';
import ResourceImportError from '../../resource/equipmentImportError.vue';
import GradeDropDown from '../../../common/GradeDropDown.vue';

const token = document.cookie;
const httpaddress = window.SITE_CONFIG.baseUrl;
export default {
  components: {
    // AddOrUpdate,
    see,
    addOrModify,
    resoureteamtable,
    resoureteamtree,
    resoureteamTreeCrud,
    resoureteamheader,
    ResourceImportError,
    GradeDropDown,
    importDataDialog,
  },
  data() {
    return {
      // 下载错误信息地址
      downLoadUrl: 'ser/resoure/resoureteam/xlsOutputError',
      isPlatformRoot: true,
      cloudUrl: window.SITE_CONFIG.cloudUrl,
      // 使用模板的一些参数配置，具体看文档
      treeSetting: {
        tab: [],
        // api: '/resoure/resoureteamtype/tree',
        api: '/resoure/resoureteamclass/search',
        edit: this.isAuth('mail:mailgroup:delete')
          ? {
            // add: '/resoure/resoureteamtype/save',
            add: '/resoure/resoureteamclass/save',
            // update: '/resoure/resoureteamtype/update',
            update: '/resoure/resoureteamclass/update',
            delete: true,
          }
          : false,
        isPlatformRoot: true,
        params: {},
      },

      tableRequest: {
        api: '/resoure/resoureteam/list?apiVersion=0.0.2',
        params: {
          teamClassIds: this.selectedNode,
          platformId: '',
          flag: false,
        },
      },
      currentNode: '',
      checkedNodes: [],
      selectedNode: [],
      fileList: [],
      // 获取到的token
      documenttoken: `${httpaddress}/resoure/resoureteam/xlsInput?token=${this.$cookie.get(
        'token',
      )}`,
      filename: '',
      // 上传文件的文件名
      uploadfilesname: '',
      // 树形勾选框选中的id
      checkedIds: [],
      dialogVisible: false,
      dialogtitle: '',
      groupingdisabled: false,
      treeForm: {
        id: '',
        parentId: '',
        ancestors: '',
        // 分组名字
        currentTreename: '',
        // 分组描述
        groupingdescription: '',
      },
      // 表格
      platShareMenuList: [],
      Treeexpansion: false,
      dataForm: {
        key: '',
      },
      // 树形
      modifiedUserList: [],
      modifiedUserProps: {
        children: 'children',
        label: 'name',
      },
      dataList: [],
      pageIndex: 1,
      pageSize: 20,
      totalCount: 0,
      dataListLoading: false,
      dataListSelections: [],
      addOrUpdateVisible: false,
      seeVisible: false,
      // 队伍类型Visible
      resoureteamTreeCrudVisible: false,
      // 导入错误提示表头
      errorTableColumn: [
        {
          prop: 'id',
          label: '序号',
          width: 60,
        },
        {
          prop: 'name',
          label: '队伍名称',
          width: 90,
        },
        {
          prop: 'contactorName',
          label: '联系人',
        },
        {
          prop: 'contactorMobile',
          label: '联系人手机号码',
        },
        {
          prop: 'principalName',
          label: '负责人',
        },
        {
          prop: 'principalMobile',
          label: '负责人手机号码',
        },
        {
          prop: 'teamTypeName',
          label: '队伍类型',
        },
        {
          prop: 'groupName',
          label: '队伍单位',
        },
        {
          prop: 'peopleNumber',
          label: '队伍人数',
        },
        {
          prop: 'creationTime',
          label: '成立时间',
        },
        {
          prop: 'fax',
          label: '传真',
        },
      ],
      // 导入错误底部提示信息
      errorTips: [
        '1、不能在该Excel表中对队伍进行删除或修改；',
        '2、Excel中红色字段为必填字段,黑色字段为选填字段，字段值里请不要填入特殊字符；',
        '3、队伍类型：上下级类型间用‘/’隔开，且从最上级类型开始，例如"防护用品类/消防/防火服"。类型字段长度不能超过32个字符；',
        '4、联系人：联系人可以为空。如果输入联系人的名字以及电话号码,若通讯录中不存在该联系人将不会保存。',
      ],
      // 导入错误表格必填项
      errorRequired: ['队伍名称', '队伍类型'],
    };
  },
  mounted() {
    // this.getDataList();
  },
  methods: {
    /**
     * 重新上传
     */
    reUpload() {
      this.$refs.template.reUpload();
    },
    // 是否选择的是本平台
    operationChange(isPlatformRoot, platformId) {
      // 换平台的时候清空搜索字
      const that = this.$refs.template;
      that.treeKeyWord = '';
      that.keyword = '';
      // 换平台的时候分页重置
      that.paginationConfig.currentIndex = 1;
      that.paginationConfig.totalCount = 0;
      that.paginationConfig.pageSize = 10;
      // 本平台的一些按钮显隐
      if(isPlatformRoot) {
        this.treeSetting.edit = this.isAuth('mail:mailgroup:delete')
          ? {
            // add: '/resoure/resoureteamtype/save',
            add: '/resoure/resoureteamclass/save',
            // update: '/resoure/resoureteamtype/update',
            update: '/resoure/resoureteamclass/update',
            delete: true,
          }
        : false
        this.treeSetting.isPlatformRoot = true
      }else {
        this.treeSetting.edit = false
        this.treeSetting.isPlatformRoot = false
      }
      this.isPlatformRoot = isPlatformRoot
      this.$refs.template.PlatName = false;
      if (platformId === -1) {
        this.$refs.template.PlatName = true;
        this.tableRequest.params.platformId = '';
        this.tableRequest.params.flag = true;
        this.tableRequest.params.teamClassIds = [];
        this.treeSetting.api = '/resoure/resoureteamclass/search';
        this.getTree();
        return;
      }
      // 请求数据参数
      this.tableRequest.params.flag = false;
      this.tableRequest.params.resoureArticleStorehouseId && delete this.tableRequest.params.resoureArticleStorehouseId
      this.tableRequest.params.platformId = platformId
      this.tableRequest.params.teamClassIds = []
      this.treeSetting.api = `/resoure/resoureteamclass/search?platformId=${platformId}`;
      new Promise((resolve, reject) => {
        this.getGroupTree()
        resolve()
      }).then(() => {
        // this.$refs.template.getTableList(this.tableRequest);
      })

    },
    /**
     * @description: 获得左侧平台的树结构
     */
    async getGroupTree() {
      const that = this.$refs.template;
      if (that) {
        that.tableLoading = true;
        const req = {
          method: 'get',
          url: this.treeSetting.api,
          baseURL: window.SITE_CONFIG.baseUrl,
          params: {
            name: that.treeKeyWord,
          },
        };
        try {
          const response = await this.$http(req);
          if (response.data.code === 0) {
            that.treeList = [
              {
                id: 0,
                name: '全部',
                children: null,
              },
              ...response.data.data,
            ];
            this.$refs.template.getTreeAllValue();
            this.$refs.template.getTableList(this.tableRequest);
          } else {
            throw Error(`代码${response.data.code}，${response.data.msg}`);
          }
        } catch (error) {
          this.$message.error(`获取组树失败！${error}`);
        } finally {
          that.tableLoading = false;
        }
      }
    },
    /**
     * @description: 获得左侧平台的树结构
     */
    async getTree() {
      const that = this.$refs.template;
      if (that) {
        if (this.tableRequest.params.platformId < 2) {
          that.tableLoading = true;
          const req = {
            method: 'get',
            url: this.treeSetting.api,
            baseURL: window.SITE_CONFIG.baseUrl,
            params: {
              name: that.treeKeyWord,
              flag: this.tableRequest.params.flag,
            },
          };
          try {
            const response = await this.$http(req);
            if (response.data.code === 0) {
              function findChilden(obj) {
                if (obj.platformName !== null && obj.platformName !== undefined) {
                  obj.name = obj.platformName;
                }
                const { children } = obj;
                if (children) {
                  children.forEach((item) => {
                    findChilden(item);
                  });
                }
              }
              [response.data.data].forEach((obj) => {
                findChilden(obj);
              });
              that.treeList = [
                {
                  id: 0,
                  name: '全部',
                  platformName: '全部',
                  platformTitle: '全部',
                  children: null,
                },
                response.data.data,
              ];
              this.$refs.template.getTreeAllValue();
              this.$refs.template.getTableList(this.tableRequest);
            } else {
              throw Error(`代码${response.data.code}，${response.data.msg}`);
            }
          } catch (error) {
            this.$message.error(`获取平台树失败！${error}`);
          } finally {
            that.tableLoading = false;
          }
        } else this.getGroupTree();
      }
    },
    ifendcase(row, column) {
      // console.log('ifendcase',row, column)
      if (column.property === 'nature') {
        switch (row.nature) {
          case 1: return '专职';
          case 2: return '兼职';
          case 3: return '专业自愿者';
          default: return '';
        }
      }
      if (column.property === 'level') {
        // 1:国家级2:省级3:市级 4:县级 5:乡镇级 6:其他
        return row.level === 1
          ? '国家级'
          : row.nature === 2
            ? '省级'
            : row.nature === 3
              ? '市级'
              : row.nature === 4
                ? '县级'
                : row.nature === 5
                  ? '乡镇级'
                  : '其他';
      }
      if (column.property === 'secretLevel') {
        // 1机密 2秘密 3限制  4公开  5其他
        return row.secretLevel === 1
          ? '机密'
          : row.secretLevel === 2
            ? '秘密'
            : row.secretLevel === 3
              ? '限制'
              : row.secretLevel === 4
                ? '公开'
                : '其他';
      }
    },
    // 新增队伍弹窗
    addNewResoureteam(type, id) {
      // this.addOrUpdateVisible = true;
      // this.$nextTick(() => {
      this.$refs.addOrModify.init(type, id, this.tableRequest.params.platformId);
      // });
    },
    // 被勾选的表格
    handleSelectionChange(val) {
      const tal = [];
      this.$emit('handleSelectionChange', val);
      for (let i = 0; i < val.length; i++) {
        tal.push(val[i].id);
        this.currenttableArray = tal;
      }
      // console.log(this.currenttableArray);
    },
    /**
     * @description: 函数获取selectedNode逻辑没变，更改了刷新页面的方法，因为树的结构在点击全部的时候返回null,所以加了判断处理
     * @param {*}
     * @return {*}
     */
    // 点击树形节点事件
    handleNodeClick(obj) {
      this.currentNode = obj;
      if (obj.platformName) { // 如果是平台
        // 换平台的时候清空搜索字
        const that = this.$refs.template;
        // that.treeKeyWord = '';
        that.keyword = '';
        // 换平台的时候分页重置
        that.paginationConfig.currentIndex = 1;
        that.paginationConfig.totalCount = 0;
        that.paginationConfig.pageSize = 10;
        // 相当于点击了组的全部
        this.tableRequest.params.resoureArticleStorehouseId && delete this.tableRequest.params.resoureArticleStorehouseId;
        this.tableRequest.params.platformId = obj.id;
        this.tableRequest.params.teamClassIds = [];
        if (obj.id === 0) {
          this.tableRequest.params.platformId = '';
          this.tableRequest.params.flag = true;
        } else {
          this.tableRequest.params.flag = false;
        }
        this.$refs.template.getTableList(this.tableRequest);
        return;
      } // 否则如果是点击分组的全部
      if (obj.id === 0) {
        this.tableRequest.params.teamClassIds = [];
        this.tableRequest.params.flag = false;
        this.$refs.template.getTableList(this.tableRequest);
        return;
      }
      // 否则按原逻辑走
      this.tableRequest.params.flag = false;
      this.tableRequest.params.platformId = obj.platformId;
      function findChilden(obj, list) {
        if (obj.id) list.push(obj.id);
        const { children } = obj;
        // console.log(list)
        if (children != null) {
          children.forEach((item, index) => {
            // console.log(item)
            findChilden(item, list);
          });
        }
      }
      if (obj == null) {
        this.selectedNode = [];
      } else {
        // console.log("树形结点点击事件", obj);
        this.selectedNode = [];
        this.currentTreeObject = obj.id;
        this.treeForm.currentTreename = obj.name;
        this.search = '';
        // 分组描述
        this.treeForm.groupingdescription = obj.remark;
        this.treeForm.id = obj.id;
        this.treeForm.ancestors = obj.ancestors;
        this.treeForm.parentId = obj.parentId;
        this.treeForm.name = obj.name;
        this.currentTreeplatformId = obj.platformId;
        this.currentTreeparentId = obj.parentId;
        this.currentTreeancestors = obj.ancestors;

        findChilden(obj, (this.selectedNode = []));
      }

      // console.log("selectedNode:"+this.selectedNode);
      // console.log(this.currentTreeObject);
      // console.log(this.treeForm.currentTreename);
      // 查询树形关联的联系人
      this.tableRequest.params.teamClassIds = this.selectedNode;
      this.$refs.template.getTableList(this.tableRequest);
      // this.$http({
      //   url: this.$http.adornUrl(`/resoure/resoureteam/list`),
      //   method: "POST",
      //   data: this.$http.adornData({
      //     limit: this.pageSize,
      //     page: this.pageIndex,
      //     teamTypeIds: this.selectedNode
      //   })
      // }).then(({ data }) => {
      //   if (data && data.code === 0) {
      //     // console.log(data);
      //     this.totalCount = data.page.totalCount;
      //     this.pageIndex = data.page.pageIndex;
      //     this.pageSize = data.page.pageSize;
      //     this.platShareMenuList = data.page.list;

      //   } else {
      //     this.$message.error(data.msg);
      //   }
      // });
    },
    // 查看分组
    showEventType() {
      this.dialogVisible = true;
      this.dialogtitle = '查看队伍类型';
      this.groupingdisabled = true;
    },
    // 添加分组
    addEventType() {
      this.resoureteamTreeCrudVisible = true;
      this.$nextTick(() => {
        this.$refs.resoureteamTreeCrud.init(null, null, 2); // 代表新增
      });
    },
    // 修改分组名称
    updateEventType(id) {
      // console.log(this.treeForm.currentTreename);
      this.dialogVisible = true;
      this.dialogtitle = '修改队伍类型';
      this.groupingdisabled = false;
    },
    // 分组拖拽排序
    modifythename(before, after, inner, event) {
      const treesubnode = [];
      // console.log("==============");
      // console.log(this.modifiedUserList);
      // console.log(before); // 移动的节点
      // console.log(after); // 移动到的父节点
      // console.log(inner);
      // console.log("==============");
      let prentId;
      if (inner == 'inner') {
        prentId = after.data.id;
        // this.modifiedUserList
      } else {
        prentId = after.data.parentId;
      }
      // console.log(prentId);
      // console.log(this.modifiedUserList);
      const groupId = before.data.id;
      let ancestors;
      let parentId;
      let groupIds;
      let prent;
      if (prentId == 0) {
        ancestors = '0';
        parentId = 0;
        groupIds = new Array();
        this.modifiedUserList.forEach((item, index) => {
          groupIds.push(item.id);
        });
      } else {
        prent = findPrent(prentId, this.modifiedUserList);
        ancestors = `${prent.ancestors},${prent.id}`;
        parentId = prent.id;
        groupIds = new Array();
        prent.children.forEach((item, index) => {
          groupIds.push(item.id);
        });
      }
      // console.log(groupId);
      // console.log(ancestors);
      // console.log(parentId);
      // console.log(groupIds);
      const params = {
        id: groupId,
        ancestors,
        parentId,
        groupIds,
        children: before.data.children,
      };
      this.$http({
        url: this.$http.adornUrl('/resoure/resoureteamtype/order'),
        method: 'POST',
        data: this.$http.adornData(params, false),
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.getDataList();
          // console.log(data);
          this.$message({
            message: '操作成功',
            type: 'success',
            duration: 1500,
          });
        } else {
          this.$message.error(data.msg);
        }
      });

      function findPrent(prentId, list) {
        for (let i = 0; i < list.length; i++) {
          const item = list[i];

          if (item.id == prentId) {
            // console.log(item.name);
            return item;
          }
          if (item.children != null) {
            const temp = findPrent(prentId, item.children);
            if (temp != null) {
              return temp;
            }
          }
        }
        return null;
      }
    },
    /**
     * @description: 多加了分组内是否还有数据的判断
     * @param {*}
     * @return {*}
     */
    // 删除分组
    deleteEventType(data) {
      const childrenNode = this.$refs.template.getTreeNodeChildren(data.id);
      const that = this;
      this.$http({
        url: this.$http.adornUrl('/resoure/resoureteam/list?apiVersion=0.0.2'),
        method: 'POST',
        data: this.$http.adornData({
          teamClassIds: childrenNode,
          limit: this.pageSize,
          page: this.pageIndex,
        }),
      }).then(({ data }) => {
        if (data && data.code === 0) {
          // console.log('getDataList',data)
          if (data.page.list.length > 0) {
            this.$alert('请先删除分组里的内容', '提醒', {
              confirmButtonText: '确定',
            });
          } else {
            this.$confirm('确定对进行[删除]操作?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning',
            }).then(() => {
              that
                .$http({
                  // url: that.$http.adornUrl('/resoure/resoureteamtype/delete'),
                  url: that.$http.adornUrl('/resoure/resoureteamclass/delete'),
                  method: 'post',
                  data: childrenNode,
                })
                .then(({ data }) => {
                  if (data && data.code === 0) {
                    that.$message({
                      message: '操作成功',
                      type: 'success',
                      duration: 1500,
                    });
                    that.getDataList();
                  } else {
                    that.$message.error(data.msg);
                  }
                });
            });
          }
          // console.log('this.platShareMenuList',this.platShareMenuList)
        } else {
          this.$message.error(data.msg);
        }
      });

      // console.log('删除前that.checkedIds',that.checkedIds)
      // this.$confirm(`确定对进行[删除]操作?`, "提示", {
      //   confirmButtonText: "确定",
      //   cancelButtonText: "取消",
      //   type: "warning",
      // }).then(() => {
      //   var checkedNames = "";
      //   if (that.selectedNode.length > 0) {
      //     that.selectedNode.forEach((item) => {
      //       if (item.system === 1) {
      //         checkedNames += item.name;
      //       }
      //     });
      //   }

      //   setTimeout(() => {
      //     if (checkedNames) {
      //       that.$message({
      //         message: `${checkedNames}删除失败`,
      //         type: "error",
      //         duration: 1500,
      //       });
      //       return 0;
      //     }
      //     that
      //       .$http({
      //         url: that.$http.adornUrl(`/resoure/resoureteamtype/delete`),
      //         method: "post",
      //         data: that.$http.adornData(
      //           {
      //             ids: that.selectedNode,
      //           },
      //           false
      //         ),
      //       })
      //       .then(({ data }) => {
      //         if (data && data.code === 0) {
      //           that.$message({
      //             message: "操作成功",
      //             type: "success",
      //             duration: 1500,
      //           });
      //           that.getDataList();
      //         } else {
      //           that.$message.error(data.msg);
      //         }
      //       });
      //   });
      // });
    },
    // 树形复选框勾选ID
    setCheckedIds(checkedIds, checkedNodes) {
      // console.log('勾选的checkedIds,checkedNodes',checkedIds,checkedNodes)
      this.checkedIds = checkedIds;
      // console.log('this.checkedIds',this.checkedIds);
      this.checkedNodes = checkedNodes;
    },
    /**
     * @description: 更改了刷新数据的形式
     * @param {*}
     * @return {*}
     */
    // 获取数据列表
    getDataList() {
      // this.dataListLoading = true
      // this.$http({
      //   url: this.$http.adornUrl('/resoure/resoureteamtype/tree'), //resoure/resoureteam/list
      //   method: 'get',
      //   params: this.$http.adornParams({
      //     'page': this.pageIndex,
      //     'limit': this.pageSize,
      //     'key': this.dataForm.key
      //   })
      // }).then(({data}) => {
      //   if (data && data.code === 0) {
      //     this.dataList = data.page.list
      //     this.totalPage = data.page.totalCount
      //     this.platShareMenuList = treeDataTranslate(data.data.list, "id");
      //   } else {
      //     this.dataList = []
      //     this.totalPage = 0
      //   }
      //   this.dataListLoading = false
      // })
      this.dataListLoading = true;
      this.getTree();
      // this.$refs.template.getTableList(this.tableRequest);
      // this.$http({
      //   url: this.$http.adornUrl("/resoure/resoureteamtype/tree"),
      //   method: "get"
      // }).then(({ data }) => {
      //   // console.log(data);
      //   this.modifiedUserList = treeDataTranslate(data.tree, "id");
      //   // console.log(this.modifiedUserList)
      //   //请求表格数据
      //   this.$http({
      //     url: this.$http.adornUrl("/resoure/resoureteam/list"),
      //     method: "POST",
      //     data: this.$http.adornData({
      //       teamTypeIds: this.selectedNode,
      //       limit: this.pageSize,
      //       page: this.pageIndex
      //     })
      //   }).then(({ data }) => {
      //     if (data && data.code === 0) {
      //       // console.log('getDataList',data)
      //       this.totalCount = data.page.totalCount;
      //       this.pageIndex = data.page.currPage;
      //       this.pageSize = data.page.pageSize;
      //       this.platShareMenuList = data.page.list;
      //       // console.log('this.platShareMenuList',this.platShareMenuList)
      //     } else {
      //       this.$message.error(data.msg);
      //     }
      //   });
      // });
    },
    // 分组修改提交
    submittingbygroups() {
      if (!this.treeForm.currentTreename) {
        this.$message.error('分组名称不能为空');
      } else {
        this.dialogVisible = false;
        this.$http({
          // url: this.$http.adornUrl('/resoure/resoureteamtype/update'),
          url: this.$http.adornUrl('/resoure/resoureteamclass/update'),
          method: 'post',
          data: this.$http.adornData({
            id: this.treeForm.id,
            parentId: this.treeForm.parentId,
            name: this.treeForm.currentTreename,
            ancestors: this.treeForm.ancestors,
          }),
        }).then(({ data }) => {
          if (data && data.code === 0) {
            this.$message({
              message: '操作成功',
              type: 'success',
              duration: 1500,
              onClose: () => {
                this.getDataList();
              },
            });
          } else {
            this.$message.error(data.msg);
          }
        });
      }
    },
    // 每页数
    sizeChangeHandle(val) {
      this.pageSize = val;
      this.pageIndex = 1;
      this.getDataList();
    },
    // 当前页
    currentChangeHandle(val) {
      this.pageIndex = val;
      this.getDataList();
    },
    // 多选
    selectionChangeHandle(val) {
      this.dataListSelections = val;
    },
    // 新增 / 修改
    // addOrUpdateHandle(id, status) {
    //   this.addOrUpdateVisible = true;
    //   this.$nextTick(() => {
    //     if (status === "watch") {
    //       this.$refs.addOrUpdate.init(id, status);
    //     } else {
    //       this.$refs.addOrUpdate.init(id);
    //     }
    //   });
    // },
    /**
     * @description 打开新增/修改分类点弹窗
     * @param {String} type 弹窗类型：add新增、modify编辑
     * @param {Number} id 编辑时该行的数据的id
     */
    addOrModifyHandle(type, id) {
      const that = this;
      that.addOrModifyVisible = true;
      that.$nextTick(() => {
        that.$refs.addOrModify.init(type, id, this.tableRequest.params.platformId);
      });
    },
    /**
     * @description: 打开查看表格数据弹窗
     * @param {Number} id 查看行的数据的id
     * @return {*}
     */
    seeHandle(id) {
      const that = this;
      that.seeVisible = true;
      that.$nextTick(() => {
        that.$refs.see.init(id);
      });
    },
    // 删除
    deleteHandle(id) {
      const ids = id
        ? [id]
        : this.dataListSelections.map((item) => item.id);
      this.$confirm(
        `确定对[id=${ids.join(',')}]进行[${id ? '删除' : '批量删除'}]操作?`,
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        },
      ).then(() => {
        this.$http({
          url: this.$http.adornUrl('/resoure/resoureteam/delete'),
          method: 'post',
          data: this.$http.adornData(ids, false),
        }).then(({ data }) => {
          if (data && data.code === 0) {
            this.$message({
              message: '操作成功',
              type: 'success',
              duration: 1500,
              onClose: () => {
                this.getDataList();
              },
            });
          } else {
            this.$message.error(data.msg);
          }
        });
      });
    },
    // 导出模板
    downloadtemplate() {
      const httpaddress = window.SITE_CONFIG.baseUrl;
      const token = document.cookie;
      const exportEx = this.currentTreeObject;
      // console.log(
      //   `${httpaddress}//resoure/resoureteam/gettemplate?gId=${exportEx}&token=${Cookies.get('token')}`
      // );
      // window.open(httpaddress +'//mail/mailgroup/gettemplate?gId=' + exportEx + '&' + token)
      window.location.href = `${httpaddress}//resoure/resoureteam/gettemplate?gId=${exportEx}&token=${Cookies.get(
        'token',
      )}`;
    },
    // 文件上传时的钩子
    beforeUploadFile(event, file, fileList) {
      // console.log("文件上传时的钩子", event, file, fileList);
    },
    // 导出数据
    exportExcel() {
      const httpaddress = window.SITE_CONFIG.baseUrl;
      const { checkedIds } = this;
      if (checkedIds.length < 1) {
        this.$message({
          message: '请选择一个分组进行导出',
          type: 'warning',
        });
      } else {
        const token = document.cookie;
        window.location.href = `${httpaddress}/resoure/resoureteam/xlsOutput?checkedIds=${checkedIds}&teamIds=${
          this.currenttableArray ? this.currenttableArray : -1
        }&token=${Cookies.get('token')}`;
      }
    },
    // 删除||批量删除联系人
    batchDelete(id) {
      const ids = {
        ids: this.currenttableArray || [id],
        groupId: this.currentTreeObject,
      };

      this.$http({
        url: this.$http.adornUrl('/resoure/resoureteam/delete'),
        method: 'post',
        data: this.$http.adornData(ids, false),
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.$message({
            message: '操作成功',
            type: 'success',
            duration: 1500,
            onClose: () => {
              this.getDataList();
            },
          });
        } else {
          this.$message.error('请选择一个联系人删除');
        }
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
          this.$refs.importDataDialogRef.open(response.data);
          // this.$refs.resourceImportError.init(response.data.errorData);
          // this.$refs.resourceImportError.tableColumn = this.errorTableColumn;
          // this.$refs.resourceImportError.tips = this.errorTips;
          // this.$refs.resourceImportError.required = this.errorRequired;
        });
      } else {
        this.$message.error({
          type: 'error',
          message: `${response.msg}`,
        });
      }
    },
    // 联系人搜索
    searchcontacts(contactsearch) {
      // console.log(this.currentTreeObject);
      this.search = contactsearch;
      this.pageIndex = 1;
      this.selectedNode = [];
      this.$http({
        url: this.$http.adornUrl('/resoure/resoureteam/list?apiVersion=0.0.2'),
        method: 'POST',
        data: this.$http.adornParams({
          teamClassIds: this.selectedNode,
          search: contactsearch,
          limit: this.pageSize,
          page: this.pageIndex,
        }),
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.platShareMenuList = data.page.list;
          this.totalCount = data.page.totalCount;
          this.pageIndex = data.page.pageIndex;
          this.pageSize = data.page.pageSize;
        } else {
          this.$message.error(data.msg);
        }
      });
    },
  },
};
</script>
<style lang="less">
.resoureteamWrap {
  margin: -20px;
  .addressbookbox > .el-header {
    color: #333;
    /*text-align: center;*/
    line-height: 80px;
  }

  .addressbookbox > .el-aside {
    /*background-color: #D3DCE6;*/
    color: red;
    text-align: center;
    line-height: 20px;
  }

  .addressbookbox > .el-main {
    /*background-color: #E9EEF3;*/
    color: #333;
    text-align: center;
    line-height: 150px;
  }
  .tableClass {
    padding: 3px;
    border: 1px solid rgba(230, 230, 230, 1);
    height: 652px;
    width: 82%;
    margin-left: 20px;
    min-width: 540px;
  }
  .el-table__fixed-right::before,
  .el-table__fixed::before {
    height: 0px;
  }
}
</style>
