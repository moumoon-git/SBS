<!--
 * @Author:
 * @Date: 2020-11-09 15:47:30
 * @LastEditTime: 2020-11-26 10:09:47
 * @LastEditors: Please set LastEditors
 * @Description:主要修改了页面布局，函数大部分复用之前的，需要的修改的函数或者字段已作出相应修改
 * @FilePath: \product_SBS\src\views\modules\sys\resource\resource-article.vue
-->

<template>
  <div>
    <sv-template
      ref="template"
      :use-plat-form-all="true"
      :tree-setting="treeSetting"
      :table-request="tableRequest"
      :overload="{
        getTree,
      }"
      @tree-node-edit="addOrUpdateLeft"
      @tree-node-add="addOrUpdateLeft"
      @tree-add="addOrUpdateLeft"
      @tree-click="handleNodeClick"
      @tree-node-delete="deleteEventType"
      @tree-node-record="transferRecord"
    >
      <template #grade__dropDown>
        <grade-dropDown
          :plat-show="true"
          :merge-node="true"
          @operationChange="operationChange"
        />
      </template>
      <template #other__options>
        <!-- 调拨记录操作按钮 -->
        <el-tooltip
          placement="top"
          content="调拨记录"
        >
          <div
            class="record_options"
            @click="transferRecord()"
          />
        </el-tooltip>
      </template>
      <template #middle__header>
        <span />

        <div class="middle__header__title">
          应急装备
        </div>
        <div class="middle__header__title2">
          <sv-input-search
            v-model="keySearch"
            width="200px"
            placeholder="请输入装备名称搜索"
            @keyup.enter.native="searchTable"
            @change="searchTable"
          />

          <div
            class="sv-button-more"
            :class="
              isFocus ? 'sv-button-more__focus' : 'sv-button-more__unfocus'
            "
          >
            <div @click="boxCheck">
              <span>更多</span>
              <span class="sv-icon-triangle" />
            </div>
            <div class="sv-button-more__content">
              <!-- <div
                v-if="isAuth('resoure:resourearticle:xlsOutput')"
                class="sv-button-more__content__item-header"
              >
                导出
              </div> -->
              <div
                v-if="isAuth('resoure:resourearticle:xlsOutput')"
                class="sv-button-more__content__item"
                @click="exportExcel()"
              >
                导出分组数据
              </div>
              <div
                v-if="isAuth('resoure:resourearticle:xlsOutput')"
                class="sv-button-more__content__item"
                @click="exportExcelAll()"
              >
                导出表格数据
              </div>
              <div class="sv-button-more__content__line" v-if="isPlatformRoot" />
              <el-upload
                ref="importData"
                v-if="isAuth('resoure:resourearticle:xlsInput') && isPlatformRoot"
                class="sv-button-more__content__item"
                :with-credentials="true"
                :show-file-list="false"
                :on-success="handleAvatarSuccess"
                :action="documenttoken"
                :headers="{ token: $cookie.get('token') }"
              >
                导入
                <!-- <el-tooltip placement="top"  effect="light">
              <div slot="content">请填写我们提供<br/>的模板进行导入</div>
              <sv-button

                element-loading-text="正在导入物资列表，可能需要几分钟时间，请耐心等待.."
                v-if="isAuth('resoure:resourearticle:xlsInput')"
                type="primary"
                size="small"
              >导入
              </sv-button>
            </el-tooltip> -->
              </el-upload>
              <div class="sv-button-more__content__line" v-if="isPlatformRoot" />
              <div
                class="sv-button-more__content__item"
                @click="downloadtemplate()"
              >
                下载模板
              </div>
              <div
                v-if="isAuth('resoure:resourearticle:delete') && isPlatformRoot"
                class="sv-button-more__content__item"
                @click="batchDeletes()"
              >
                批量删除
              </div>
            </div>
          </div>
          <sv-button
            v-if="isAuth('resoure:resourearticle:save') && isPlatformRoot"
            type="primary"
            style="width: 50px; margin-left: 5px"
            @click="newcontactsHandle(null, 1)"
          >
            新增
          </sv-button>
        </div>
      </template>

      <template #middle__table>
        <el-table-column
          sortable
          prop="name"
          header-align="center"
          align="center"
          width="120"
          :show-overflow-tooltip="true"
          label="装备名称"
        />

        <el-table-column
          prop="className"
          header-align="center"
          align="center"
          :show-overflow-tooltip="true"
          label="装备类型"
        />
        <el-table-column
          prop="specification"
          header-align="center"
          align="center"
          :show-overflow-tooltip="true"
          label="规格型号"
        />
        <el-table-column
          prop="number"
          header-align="center"
          align="center"
          label="装备数量"
        />
        <el-table-column
          prop="nowStatus"
          header-align="center"
          align="center"
          width="200"
          label="当前占用状态"
        >
          <template slot-scope="scope">
            <span>{{ statusText[scope.row.nowStatus] }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="quaguaPeriod"
          header-align="center"
          align="center"
          width="200"
          label="有效期"
        >
          <template slot-scope="scope">
            {{ scope.row.quaguaPeriod ? scope.row.quaguaPeriod.split(' ')[0] : '' }}
          </template>
        </el-table-column>

        <el-table-column
          prop="renewTime"
          header-align="center"
          align="center"
          width="200"
          label="需要更换时间"
        >
          <template slot-scope="scope">
            {{
              scope.row.renewTime
                && scope.row.renewTime.split(' ').length
                && scope.row.renewTime.split(' ')[0]
            }}
          </template>
        </el-table-column>
        <el-table-column
          prop="platformName"
          header-align="center"
          align="center"
          width="200"
          label="数据来源"
        >
          <template slot-scope="scope">
            {{ scope.row.platformName }}
          </template>
        </el-table-column>
        <el-table-column
          header-align="center"
          align="center"
          width="220"
          label="操作"
        >
          <template slot-scope="scope">
            <sv-table-operation
              :display="isPlatformRoot? [
                'view',
                'edit',
                'delete'
              ]: ['view']"
              @view="equipmentDetailSee(scope.row.id)"
              @edit="newcontactsHandle(scope.row.id, 2)"
              @delete="
                deleteIds = scope.row.id;
                $refs.delete_hint.visible = true;
              "
            />
          </template>
        </el-table-column>
      </template>
    </sv-template>
    <!--树状，新增 -->
    <EquipmentAddOrUpdate
      v-if="eventtypeAddOrUpdateVisible"
      ref="EquipmentAddOrUpdate"
      :tree-list="treeListData"
      @refreshEventTypeDataList="getDataList"
      @close="eventtypeAddOrUpdateVisible = false"
    />
    <!--    列表-->
    <AddEquipmentOrUpdate
      v-if="rightAddOrUpdateVisible"
      ref="EquipmentTableAddOrUpdate"
      @refreshDataList="getDataList"
      @close="rightAddOrUpdateVisible = false"
    />
    <!--    预览-->
    <EquipmentSee
      ref="equipmentView"
    />
    <sv-dialog-hint
      ref="delete_hint"
      type="delete"
      @confirm="batchDelete(deleteIds)"
    />
    <EquipmentImportError ref="equipmentImportError" />
    <TransferRecordDialog
      v-if="showRecordDialog"
      ref="recordDialog"
    />
    <importDataDialog
      ref="importDataDialogRef"
      :down-load-url="downLoadUrl"
      @reUpload="reUpload"
    />
  </div>
</template>

<script>
// import {getRules} from '@/utils/rules'
import axios from 'axios';
// import { treeDataTranslate } from '@/utils';
import { setTimeout } from 'timers';
import Cookies from 'js-cookie';
import EquipmentAddOrUpdate from './equipmentAddOrUpdate.vue';
import AddEquipmentOrUpdate from './AddEquipmentOrUpdate.vue';
import EquipmentImportError from './equipmentImportError.vue';
import EquipmentSee from './equipmentDetail.vue';
import GradeDropDown from '../../common/GradeDropDown.vue';
import TransferRecordDialog from '../sys/resource/transferRecordDialog.vue';
import importDataDialog from '@/views/modules/importDataDialog/importDataDialog.vue'

const httpaddress = window.SITE_CONFIG.baseUrl;
export default {
  components: {
    EquipmentAddOrUpdate,
    AddEquipmentOrUpdate,
    EquipmentSee,
    EquipmentImportError,
    GradeDropDown,
    TransferRecordDialog,
    importDataDialog,
  },
  data() {
    return {
      downLoadUrl: 'ser/resoure/resoureequipment/xlsOutputError',
      isPlatformRoot: true,
      // 使用模板的一些参数配置，具体看文档
      treeSetting: {
        tab: [],
        api: `${window.SITE_CONFIG.cloudUrl}/ser/resoure/resoureequipmentgroup/list`,
        searchAdd: true,
        edit: this.isAuth('resoure:resourearticle:delete') ? ['record', 'delete', 'edit'] : false,
        delete: true,
        isPlatformRoot: true,
      },

      tableRequest: {
        api: `${window.SITE_CONFIG.cloudUrl}/ser/resoure/resoureequipment/list`,
        method: 'get',
        params: {
          key: this.keySearch,
          groupId: this.groupIds,
          platformId: '',
          flag: false,
          townId: this.townId,
        },
      },
      statusText: {
        0: '正常',
        1: '损坏待维修',
        2: '报废',
      },
      currentTreeNode: '',
      keySearch: '',
      groupIds: [],
      checkedNodes: [],
      selectedNode: new Array(),
      Treeexpansion: false,
      // 表单验证
      rules: {
        currentTreename: [
          { required: true, message: '请输入分组名称', trigger: 'blur' },
          {
            min: 2, max: 10, message: '长度在 2 到 10个字', trigger: 'blur',
          },
        ],
      },
      // 当前树
      currentTreeProperty: {},
      // 保存搜索框里的值
      search: '',
      // 获取到的token
      documenttoken: `${httpaddress}/resoure/resoureequipment/xlsInput?token=${this.$cookie.get(
        'token',
      )}`,
      isFocus: false,
      fileList: [],
      filename: '',
      // 上传文件的文件名
      uploadfilesname: '',
      /// ///////////////////////
      // 修改||查看分组Form表单是否可用
      groupingdisabled: false,
      // 修改分组或者查看分组
      dialogtitle: '',
      // 修改||查看分组弹出框
      dialogVisible: false,
      /// ////////////////
      // 当前页数
      currPage: 1,
      // 每页显示条目个数
      pageSize: 10,
      // 总条目数
      totalCount: 0,
      /// //////
      // 分页初始值
      moreButtonActive: false,
      value3: [],
      type: 0,
      currentNode: '',
      arrowVisible: true,
      treeForm: {
        // 分组名字
        currentTreename: '',
        // 分组描述
        groupingdescription: '',
        contactorList: '',
        groupName: '',
        responsibleUnitAddress: '',
        aroundTraffic: '',
        address: '',
        name: '',
        remark: '',
        acreage: '',
      },
      // 错误信息弹窗
      errorDataVisible: false,
      // 新增窗口
      newcontactsVisible: false,
      // 新增/修改窗口
      addOrUpdateVisible: false,
      // 修改分组
      eventtypeUpdateVisible: false,
      // 事件类型窗口
      eventtypeAddOrUpdateVisible: false,
      rightAddOrUpdateVisible: false,
      dataForm: {},
      dataList: [],

      // 树形
      modifiedUserList: [],
      modifiedUserProps: {
        children: 'children',
        label: 'name',
      },
      // 表格内容
      platShareMenuForm: {
        age: 0,
        gmtCreate: 0,
        firstName: '',
        id: '',
        homeTel: '',
        mobile1: '',
        mobile2: '',
        name: '',
        officeTel: '',
        position: '',
        workUnit: '',
        isCommonlyUsed: '',
        isImportance: '',
      },
      // 表格
      platShareMenuList: [],
      // 树形勾选框选中的id
      checkedIds: [],
      // 导入错误提示表头
      errorTableColumn: [
        {
          prop: 'id',
          label: '序号',
          width: 60,
        },
        {
          prop: 'name',
          label: '装备名称',
          width: 90,
        },
        {
          prop: 'className',
          label: '装备类型',
        },
        {
          prop: 'groupName',
          label: '装备仓库',
        },
        {
          prop: 'longitude',
          label: '经度',
        },
        {
          prop: 'latitude',
          label: '纬度',
        },
        {
          prop: 'address',
          label: '装备库地址',
          width: 180,
        },
        {
          prop: 'caseClassName',
          label: '应急类别',
        },
        {
          prop: 'number',
          label: '装备数量',
        },
      ],
      // 导入错误底部提示信息
      errorTips: [
        '1、不能在该Excel表中对装备进行删除或修改；',
        '2、Excel中红色字段为必填字段,黑色字段为选填字段，字段值里请不要填入特殊字符；',
        '3、装备类型：上下级类型间用‘/’隔开，且从最上级类型开始，例如"防护用品类/消防/防火服"。类型字段长度不能超过32个字符；',
        '4、若导入的数据中拥有与装备类型中已存在的类型名相同的类型，将会自动与类型关联，若导入的装备类型名称在系统中不存在，系统将自动创建该类型。',
        '5、装备库：请直接输入装备库的名称，系统将自动匹配名称相同的装备库，若导入的装备库名称在系统中不存在，系统将自动创建该库。',
        '6、日期填写格式:年/月/日',
      ],
      // 导入错误表格必填项
      errorRequired: ['装备名称', '装备类型', '装备仓库', '装备数量'],
      showRecordDialog: false,
    };
  },
  computed: {
    treeListData() {
      if (this.$refs.template) {
        return this.$refs.template.treeList;
      }
      return [];
    },
  },
  created() {
    // this.getDataList();
  },
  methods: {
    /**
     * 重新上传
     */
    reUpload() {
      this.$refs.importData.$children[0].$refs.input.click();
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
      if (isPlatformRoot) {
        this.treeSetting.edit = this.isAuth('resoure:resourearticle:delete') ? ['record', 'delete', 'edit'] : false
        this.treeSetting.delete = true
        this.treeSetting.isPlatformRoot = true
      } else {
        this.treeSetting.edit = false
        this.treeSetting.delete = false
        this.treeSetting.isPlatformRoot = false
      }
      this.isPlatformRoot = isPlatformRoot
      if (platformId === -1) {
        this.tableRequest.params.platformId = null;
        this.tableRequest.params.flag = true;
        this.tableRequest.params.groupId = [];
        this.treeSetting.api = `resoure/resoureequipmentgroup/list`
        this.getTree();
        return;
      }
      // 请求数据参数
      this.tableRequest.params.flag = false;
      this.tableRequest.params.resoureArticleStorehouseId && delete this.tableRequest.params.resoureArticleStorehouseId
      this.tableRequest.params.platformId = platformId
      this.tableRequest.params.groupId = []
      this.treeSetting.api = `resoure/resoureequipmentgroup/list?platformId=${platformId}`
      new Promise((resolve, reject) => {
        this.getGroupTree()
        resolve()
      }).then(() => {
        // this.$refs.template.getTableList(this.tableRequest)
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
    boxCheck() {
      this.$refs.template.treeCheck = !this.$refs.template.treeCheck;
      this.$refs.template.tableCheck = !this.$refs.template.tableCheck;
      this.isFocus = !this.isFocus;
      console.log(`123`,this.tableRequest.params.flag)
    },

    searchTable() {
      this.tableRequest.params.key = this.keySearch;
      this.$refs.template.getTableList(this.tableRequest);
    },

    editTree() {
      this.type = 1;
      this.addOrEditTreeVisible = true;
      this.treeForm.currentTreename = this.currentNode.name;
    },
    addTree() {
      this.type = 0;
      this.addOrEditTreeVisible = true;
      this.treeForm.currentTreename = '';
    },
    /**
     * @description:新增修改树节点的表单提交
     * @param {type}
     * @return {type}
     */
    treeDataFormSubmit() {
      this.$refs.treeForm.validate((valid) => {
        if (valid && (this.type === 0 || this.type === 1)) {
          this.$http({
            url: this.$http.adornUrl(
              `/resoure/resourearticlestorehouse/${
                this.type === 0 ? 'save' : 'update'
              }`,
            ),

            method: 'post',
            data: this.$http.adornData({
              id: this.treeForm.treeId || undefined,

              name: this.treeForm.name,
            }),
          }).then(({ data }) => {
            if (data && data.code === 0) {
              this.treeAddorUpdateDialogVisible = false;
              this.$message({
                message: '操作成功',
                type: 'success',
                duration: 1500,
              });
              this.$refs.template.getTree();
            } else {
              this.$message.error('请选择您要新增到的分组');
            }
          });
        }
      });
    },
    /// ///////////////////
    // 一来就请求树形和列表
    getDataList() {
      console.log(
        "isAuth('resoure:resourearticle:xlsInput')",
        this.isAuth('resoure:resourearticle:xlsInput'),
      );
      this.getTree();
      // this.$refs.template.getTableList(this.tableRequest);
      this.mapDialogVisible = true;
    },
    // 物资搜索
    searchcontacts(contactsearch) {
      // console.log('this.currentTreeObject',this.currentTreeObject);
      this.search = contactsearch;
      this.currPage = 1;
      this.selectedNode = [];
      let key;

      this.$http({
        url: this.$http.adornUrl('/resoure/resourearticle/list'),
        method: 'get',
        params: this.$http.adornParams({
          // groupId: this.selectedNode,
          resoureArticleStorehouseId: this.currentTreeObject
            ? this.currentTreeObject
            : '',
          // search: contactsearch,
          key: contactsearch,
          limit: this.pageSize,
          page: this.currPage,
        }),
      }).then(({ data }) => {
        if (data && data.code === 0) {
          // console.log(data.resoureArticleList.list);
          this.platShareMenuList = data.resoureArticleList.list;
          this.totalCount = data.resoureArticleList.totalCount;
          this.currPage = data.resoureArticleList.currPage;
          this.pageSize = data.resoureArticleList.pageSize;
        } else {
          this.$message.error(data.msg);
        }
      });
    },
    // 每页显示条目个数改变时会触发
    sizeChangeHandle(val) {
      // console.log(`每页 ${val} 条`);
      this.pageSize = val;
      this.currPage = 1;
      this.$http({
        url: this.$http.adornUrl('/resoure/resourearticle/list'),
        method: 'GET',
        params: this.$http.adornParams(
          {
            limit: this.pageSize,
            page: this.currPage,
            resoureArticleStorehouseId: this.selectedNode.toString(),
            search: this.search,
          },
          false,
        ),
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.platShareMenuList = data.resoureArticleList.list;
          this.totalCount = data.resoureArticleList.totalCount;
        } else {
          this.$message.error(data.msg);
        }
      });
    },
    // 当前页数改变时会触发
    currentChangeHandle(val) {
      // console.log(`当前页: ${val}`);
      this.currPage = val;
      this.$http({
        url: this.$http.adornUrl('/resoure/resourearticle/list'),
        method: 'get',
        params: this.$http.adornParams(
          {
            limit: this.pageSize,
            page: this.currPage,
            resoureArticleStorehouseId: this.selectedNode.toString(),
            search: this.search,
          },
          false,
        ),
      }).then(({ data }) => {
        if (data && data.code === 0) {
          // console.log(data)
          this.platShareMenuList = data.resoureArticleList.list;
        } else {
          this.$message.error(data.msg);
        }
      });
    }, // 点击树形节点事件
    handleNodeClick(obj) {
      this.currentTreeNode = obj;
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
        this.tableRequest.params.resoureArticleStorehouseId && delete this.tableRequest.params.resoureArticleStorehouseId
        this.tableRequest.params.platformId = obj.id;
        this.tableRequest.params.groupId = []
        if (obj.id === 0) {
          this.tableRequest.params.platformId = null;
          this.tableRequest.params.flag = true;
        } else {
          this.tableRequest.params.flag = false;
        }
        this.$refs.template.getTableList(this.tableRequest);
        return;
      } // 如果点击分组的全部
      if (obj.id === 0) {
        this.tableRequest.params.groupId = [];
        this.tableRequest.params.flag = false;
        this.$refs.template.getTableList(this.tableRequest);
        return;
      }
      // 否则按原逻辑走
      this.tableRequest.params.flag = false;
      this.tableRequest.params.platformId = obj.platformId;
      console.log('obj', obj);
      console.log('obthis.currentTreeNodej', this.currentTreeNode);
      const that = this;
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

        this.search = '';
        // 分组描述

        this.currentTreeplatformId = obj.platformId;
        this.currentTreeparentId = obj.parentId;
        this.currentTreeancestors = obj.ancestors;

        findChilden(obj, (this.selectedNode = []));
      }

      this.tableRequest.params.groupId = this.selectedNode[0];
      this.$refs.template.getTableList(this.tableRequest);
    },

    /**
     * @description: 点击树结点获取相应的子节点
     * @param {}
     * @return {}
     */

    // 被勾选的表格
    handleSelectionChange(val) {
      const tal = [];
      const talName = [];
      this.$emit('handleSelectionChange', val);
      for (let i = 0; i < val.length; i++) {
        tal.push(val[i].id);
        talName.push(val[i].name);
      }
      this.currenttableArray = tal;
      this.currenttableArrayName = talName;
      // console.log(val, this.currenttableArray, this.currenttableArrayName);

      // console.log('this.currenttableArray',this.currenttableArray);
    },
    /**
     * @description: 表格数据的批量删除，获取id的方式改变
     * @param {*}
     * @return {*}
     */
    batchDeletes() {
      const ids = this.$refs.template.getTableChecked().map((v) => v.id);
      if (!ids.length) {
        this.$message.error('请勾选表格数据');
        return;
      }
      this.$confirm('确定进行删除操作?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          this.$http({
            url: this.$http.adornUrl('/resoure/resoureequipment/delete'),
            method: 'post',
            data: ids,
          }).then(({ data }) => {
            if (data && data.code === 0) {
              this.$message({
                message: '操作成功',
                type: 'success',
                duration: 1500,
              });
              this.getDataList();
            } else {
              this.$message.error('删除失败');
            }
          });
        })
        .catch(() => {});
      this.$refs.template.treeCheck = false;
      this.$refs.template.tableCheck = false;
      this.isFocus = false;
    },
    // 删除物资
    batchDelete(id) {
      this.$http({
        url: this.$http.adornUrl('/resoure/resoureequipment/delete'),
        method: 'post',
        data: [id],
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
          this.$message.error('请选择一个装备删除');
        }
      });
    },
    // 上传成功的回调
    handleImportData(file, url) {
      const request = {
        method: 'post',
        url,
        baseURL: window.SITE_CONFIG.baseUrl,
        data: file,
        headers: {
          'content-type':
            'multipart/form-data;charset=UTF-8;application/vnd.ms-excel',
          token: this.token,
        },
      };
      axios(request)
        .then((response) => {
          this.$refs.buttonMore.importingData = false;
          if (response.data.code == 0) {
            this.$refs.import_success.visible = true;
            this.getTableList(this.tableRequest);
          } else {
            this.$refs.import_fail.supplementText = response.data.msg;
            this.$refs.import_fail.visible = true;
          }
        })
        .catch((error) => {
          console.log('上传失败', error);
          this.$refs.buttonMore.importingData = false;
          this.$refs.import_fail.supplementText = error;
          this.$refs.import_fail.visible = true;
        });
    },
    handleAvatarSuccess(response, file) {
      this.filename = file.name;
      if (file.response.errorData.length === 0) {
        this.$message({
          message: '导入成功!',
          type: 'success',
        });
        this.getDataList();
      } else if (file.response.errorData.length > 0) {
        this.getDataList();
        this.$refs.importDataDialogRef.open(file.response);
        // this.$refs.equipmentImportError.init(file.response.data);
        // this.$refs.equipmentImportError.tableColumn = this.errorTableColumn;
        // this.$refs.equipmentImportError.tips = this.errorTips;
        // this.$refs.equipmentImportError.required = this.errorRequired;
      } else {
        this.$message.error({
          type: 'error',
          message: `${file.response.msg}`,
        });
      }
      this.$refs.template.treeCheck = false;
      this.$refs.template.tableCheck = false;
      this.isFocus = false;
    },
    exportExcelAll() {
      const checkedIds = this.$refs.template.getTableChecked().map((item) => item.id);
      if (!checkedIds.length) {
        this.$message.error('请勾选表格数据');
        return;
      }
      const request = {
        method: 'get',
        baseURL: window.SITE_CONFIG.baseUrl,
        url: '/resoure/resoureequipment/xlsOutputSelect',
        headers: {
          token: this.$cookie.get('token'),
        },
        params: {
          checkedIds: String(checkedIds),
          flag: this.tableRequest.params.flag,
        },
        responseType: 'arraybuffer',
      };
      axios(request).then((response) => {
        if (response.data) {
          if (navigator.msSaveOrOpenBlob) {
            // 兼容ie
            navigator.msSaveOrOpenBlob(
              new Blob([response.data], { type: 'application/vnd.ms-excel' }),
              '导出应急装备所有数据.xls',
            );
          } else {
            const str = decodeURI(
              escape(response.headers['content-disposition']),
            ).indexOf('filename') > -1 ? 'filename=' : 'fileName=';
            // 获取文件名
            const fileName = decodeURI(
              escape(response.headers['content-disposition']),
            ).split('fileName%3D')[1];
            console.log(fileName);
            const a = document.createElement('a');
            a.href = window.URL.createObjectURL(
              new Blob([response.data], { type: 'application/vnd.ms-excel' }),
            );
            a.download = fileName || '导出应急装备所有数据.xls';
            document.body.appendChild(a); // 兼容Firefox浏览器
            a.click();
            a.remove();
          }
          // 注释原因：后端说导出文件名由后端给
          // const a = document.createElement('a');
          // a.target = '_blank';
          // a.download = '导出应急装备所有数据.xls';
          // a.href = window.URL.createObjectURL(new Blob([response.data]));
          // a.click();
        }
      });
      this.$refs.template.treeCheck = false;
      this.$refs.template.tableCheck = false;
      this.isFocus = false;
    },
    // 导出模板
    downloadtemplate() {
      const exportEx = this.currentTreeObject;
      const request = {
        method: 'get',
        baseURL: window.SITE_CONFIG.baseUrl,
        url: '/resoure/resoureequipment/gettemplate',
        headers: {
          token: this.$cookie.get('token'),
        },
        params: {
          gId: exportEx,
        },
        responseType: 'arraybuffer',
      };
      axios(request).then((response) =>{
        if (navigator.msSaveOrOpenBlob) {
          // 兼容ie
          navigator.msSaveOrOpenBlob(
            new Blob([response.data], { type: 'application/vnd.ms-excel' }),
            '导出应急装备模板.xls',
          );
        } else {
          // 后端导出响应头返回的content-disposition，文件名是filename字段，或许有的接口是返回fileName，所以加了判断
          const str = decodeURI(
            response.headers['content-disposition'],
          ).indexOf('filename') > -1 ? 'filename=' : 'fileName=';
          // 获取文件名
          // const fileName = decodeURI(
          //   response.headers['content-disposition'],
          // ).split(str)[1];
          const fileName = decodeURI(
            escape(response.headers['content-disposition'])
          ).split('fileName%3D')[1];
          console.log(fileName);
          const a = document.createElement('a');
          a.href = window.URL.createObjectURL(
            new Blob([response.data], { type: 'application/vnd.ms-excel' })
          );
          a.download = fileName || '导出应急装备模板.xls';
          document.body.appendChild(a); // 兼容Firefox浏览器
          a.click();
          a.remove();
        }
      });
      // this.$http(request).then((response) => {
      //   if (response.data) {
      //     const a = document.createElement('a');
      //     a.target = '_blank';
      //     a.download = '导出应急装备模板.xlsx';
      //     a.href = window.URL.createObjectURL(new Blob([response.data]));
      //     a.click();
      //   }
      // });
      this.$refs.template.treeCheck = false;
      this.$refs.template.tableCheck = false;
      this.isFocus = false;
    },
    // 树形复选框勾选ID
    setCheckedIds(checkedIds, checkedNodes) {
      this.checkedIds = checkedIds;
      // console.log('this.checkedIds',this.checkedIds);
      this.checkedNodes = checkedNodes;
    },
    // 导出数据
    exportExcel() {
      const httpaddress = window.SITE_CONFIG.baseUrl;
      // console.log("this.$refs.template.getTableChecked",this.$refs.template.getTableChecked())

      const checkedIds = [];
      // for(let i=0;i<this.$refs.template.getTableChecked().length;i++)
      //     checkedIds.push(this.$refs.template.getTableChecked()[i].id)

      if (this.$refs.template.getTreeChecked().length < 1) {
        this.$message({
          message: '请选择一个分组进行导出',
          type: 'warning',
        });
      } else {
        const request = {
          method: 'get',
          baseURL: window.SITE_CONFIG.baseUrl,
          url: '/resoure/resoureequipment/xlsOutput',
          headers: {
            token: this.$cookie.get('token'),
          },
          params: {
            checkedIds: String(this.$refs.template.getTreeChecked()),
            flag: this.tableRequest.params.flag,
          },
          responseType: 'arraybuffer',
        };
        axios(request).then((response) => {
          if (response.data) {
            if (navigator.msSaveOrOpenBlob) {
              // 兼容ie
              navigator.msSaveOrOpenBlob(
                new Blob([response.data], { type: 'application/vnd.ms-excel' }),
                '导出应急装备数据.xls',
              );
            } else {
              const str = decodeURI(
                escape(response.headers['content-disposition']),
              ).indexOf('filename') > -1 ? 'filename=' : 'fileName=';
              // 获取文件名
              const fileName = decodeURI(
                escape(response.headers['content-disposition']),
              ).split('fileName%3D')[1];
              console.log(fileName);
              const a = document.createElement('a');
              a.href = window.URL.createObjectURL(
                new Blob([response.data], { type: 'application/vnd.ms-excel' }),
              );
              a.download = fileName || '导出应急装备数据.xls';
              document.body.appendChild(a); // 兼容Firefox浏览器
              a.click();
              a.remove();
            }
            // 注释原因：后端说导出文件名由后端给
            // const a = document.createElement('a');
            // a.target = '_blank';
            // a.download = '导出应急装备所有数据.xls';
            // a.href = window.URL.createObjectURL(new Blob([response.data]));
            // a.click();
          }
        });
        this.$refs.template.treeCheck = false;
        this.$refs.template.tableCheck = false;
        this.isFocus = false;
      }
    },
    // 查看分组
    showEventType() {
      this.dialogVisible = true;
      this.dialogtitle = '查看物资仓库';
      this.groupingdisabled = true;
    },
    // 树状添加分组
    addOrUpdateLeft(data) {
      const typeFlag = data === undefined ? 2 : 3;
      this.eventtypeAddOrUpdateVisible = true;
      this.$nextTick(() => {
        this.$refs.EquipmentAddOrUpdate.init(data, typeFlag); // 代表新增
      });
    },
    // 预览
    equipmentDetailSee(id) {
      this.$refs.equipmentView.init(id);
    },
    // 新增装备弹窗
    newcontactsHandle(id, type) {
      this.rightAddOrUpdateVisible = true;
      this.$nextTick(() => {
        this.$refs.EquipmentTableAddOrUpdate.init(id, type);
      });
    },
    // 修改分组名称
    updateEventType(data) {
      // console.log(this.treeForm.currentTreename);
      // this.dialogVisible = true;
      // this.dialogtitle = "修改分组";
      // this.groupingdisabled = false;
      // console.log('rows',id)
      // this.eventtypeUpdateVisible = true;
      //
      // this.$nextTick(() => {
      //   // this.$refs.resourceUpdate.visible=true;
      //   this.$refs.resourceUpdate.init(id, null, 3);
      // });
    },
    // 分组修改提交
    submittingbygroups() {
      if (!this.treeForm.currentTreename) {
        this.$message.error('分组名称不能为空');
      } else {
        this.dialogVisible = false;
        this.$http({
          url: this.$http.adornUrl('/mail/mailgroup/update'),
          method: 'post',
          data: this.$http.adornData({
            id: this.currentTreeObject,
            name: this.treeForm.currentTreename,
            platformId: this.currentTreeplatformId,
            remark: this.treeForm.groupingdescription,
          }),
        }).then(({ data }) => {
          if (data && data.code === 0) {
            this.$message({
              message: '操作成功',
              type: 'success',
              duration: 1500,
              onClose: () => {
                that.$refs.template.getTree();
              },
            });
          } else {
            this.$message.error(data.msg);
          }
        });
      }
    },
    /**
     * @description: 增加了删除前判断该分组下是否存在表格数据的操作
     * @return {*}
     * @param obj
     */
    // 树状删除分组
    deleteEventType(obj) {
      const that = this;
      if (this.$refs.template.tableList.length > 0) {
        this.$alert('请先删除分组里的内容', '提醒', {
          confirmButtonText: '确定',
        });
        return;
      }
      this.$confirm('确定要进行[删除]操作?', '提示', {
        customClass: 'message-del',
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        let checkedNames = '';
        if (that.selectedNode.length > 0) {
          that.selectedNode.forEach((item) => {
            if (item.system === 1) {
              checkedNames += item.name;
            }
          });
        }
        setTimeout(() => {
          if (checkedNames) {
            that.$message({
              message: `${checkedNames}删除失败`,
              type: 'error',
              duration: 1500,
            });
            return 0;
          }
          that
            .$http({
              url: `${window.SITE_CONFIG.cloudUrl}/ser/resoure/resoureequipmentgroup/delete`,
              method: 'post',
              data: obj.id,
            })
            .then(({ data }) => {
              if (data && data.code === 0) {
                that.$message({
                  message: '操作成功',
                  type: 'success',
                  duration: 1500,
                });
                that.$refs.template.getTree();
              } else {
                that.$message.error(data.msg);
              }
            });
        });
      });
    },
    // 调拨记录
    transferRecord(data) {
      this.showRecordDialog = true;
      this.$nextTick(() => {
        this.$refs.recordDialog.showType = 1;
        this.$refs.recordDialog.curId = data ? data.id : '';
        this.$refs.recordDialog.init();
      });
    },
  },
};
</script>
<style lang="less" scoped>
.sv-button-more {
  display: inline-block;
  position: relative;
  width: 57px;
  height: 30px;
  margin-left: 5px;
  line-height: 30px;
  border: 1px solid #dddee1;
  border-radius: 4px;
  font-size: 14px;
  text-align: center;
  color: #666666;
  user-select: none;
  cursor: pointer;
  .sv-button-more__content {
    position: absolute;
    top: 30px;
    right: 0;
    width: 160px;
    z-index: 1;
    transform: scaleY(0);
    transform-origin: center top;
    transition: transform 0.5s;
    background: #ffffff;
    box-shadow: 0px 3px 11px 0px rgba(0, 0, 0, 0.1);
    border-radius: 6px;
    padding: 5px 0;
    .sv-button-more__content__item-header {
      color: #999999;
      text-align: left;
      padding: 21px 0 15px 20px;
      line-height: 14px;
      cursor: auto;
    }
    .sv-button-more__content__item {
      text-align: left;
      padding: 13px 20px 15px 20px;
      line-height: 14px;
      &:hover {
        background: rgba(0, 145, 255, 0.1);
      }
      /deep/ .el-upload--text{
        width:150px;
        text-align: left;
      }
    }
    .sv-button-more__content__line {
      border-bottom: 1px solid #e6e6e6;

      height: 13px;
      margin: 0 auto;
      margin-bottom: 14px;
      cursor: auto;
    }
  }
  .sv-icon-triangle {
    position: relative;
    bottom: 3px;
    display: inline-block;
    width: 1px;
    height: 1px;
    border: 4px solid #b4b4b4;
    border-top-color: transparent;
    border-left-color: transparent;
    transform: rotate(45deg);
    transition: all 0.5s ease;
  }
  &.sv-button-more__unfocus:hover {
    border-color: #b4b4b4;
  }
  &.sv-button-more__focus {
    border-color: #0091ff;
    .sv-icon-triangle {
      bottom: -1px;
      transform: rotate(-135deg);
    }
    .sv-button-more__content {
      z-index: 100;
      transform: scaleY(1);
    }
  }
}
.middle__header {
  .middle__header__title {
    flex-grow: 1;
    flex-shrink: 0;
    border-left: 3px solid #0091ff;
    font-size: 16px;
    line-height: 16px;
    font-weight: bold;
    padding: 0 0 0 14px;
  }
  .middle__header__title2 {
  }
}

.wrap {
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

.wrap {
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
}
.wrap {
  margin: -20px;
}
.record_options {
  display: inline-block;
  width: 30px;
  height: 30px;
  margin-left: 5px;
  background: no-repeat url('../../../sinvieUI/img/icon/record.svg') center/50% 50%;
  cursor: pointer;
  &:hover {
      background-image: url('../../../sinvieUI/img/icon/record_hover.svg');
  }
  &:active {
      position: relative;
      top: 1px;
  }
}
</style>
