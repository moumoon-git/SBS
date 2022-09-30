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
      :tree-setting="treeSetting"
      :table-request="tableRequest"
      @tree-click="handleNodeClick"
    >
      <template #middle__header>
        <span />

        <div class="middle__header__title">
          应急物资
        </div>
        <div class="middle__header__title2">
          <sv-input-search
            v-model="keySearch"
            width="200px"
            placeholder="请输入物资名称搜索"
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
              </div>
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
                导出所有数据
              </div> -->
              <div class="sv-button-more__content__line" />
              <!-- <el-upload
                class="sv-button-more__content__item"
                action
                :http-request="uploadSectionFile"
                :show-file-list="false"
           >导入</el-upload> -->

              <el-upload
                v-if="isAuth('resoure:resourearticle:xlsInput')"
                class="sv-button-more__content__item"
                :with-credentials="true"
                :on-progress="beforeUploadFile"
                :show-file-list="false"
                :data="{
                  file: filename,
                  url:
                    'http://localhost:8200/108ee3f1-9df4-4998-9112-17ee0b9f08db',
                }"
                :on-success="handleAvatarSuccess"
                :action="documenttoken"
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
              <div class="sv-button-more__content__line" />
              <div
                class="sv-button-more__content__item"
                @click="downloadtemplate()"
              >
                下载模板
              </div>
              <div
                v-if="isAuth('resoure:resourearticle:delete')"
                class="sv-button-more__content__item"
                @click="batchDeletes()"
              >
                批量删除
              </div>
            </div>
          </div>

          <sv-button
            v-if="isAuth('resoure:resourearticle:save')"
            type="primary"
            style="width: 50px; margin-left: 5px"
            @click="newcontactsHandle"
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
          label="物资名称"
        />

        <el-table-column
          prop="typeName"
          header-align="center"
          align="center"
          :show-overflow-tooltip="true"
          label="物资类型"
        />
        <el-table-column
          prop="factory"
          header-align="center"
          align="center"
          :show-overflow-tooltip="true"
          label="生产厂家"
        />
        <el-table-column
          prop="amount"
          header-align="center"
          align="center"
          :show-overflow-tooltip="true"
          label="数量"
        />
        <el-table-column
          prop="measureUnit"
          header-align="center"
          align="center"
          :show-overflow-tooltip="true"
          label="计量单位"
        />
        <el-table-column
          prop="expireTime"
          header-align="center"
          align="center"
          :show-overflow-tooltip="true"
          label="保质期"
        />
        <el-table-column
          prop="replaceTime"
          header-align="center"
          align="center"
          :show-overflow-tooltip="true"
          label="需要更换的时间"
        />

        <el-table-column
          prop="nowStatus"
          header-align="center"
          align="center"
          :show-overflow-tooltip="true"
          label="现状态"
        >
          <template slot-scope="scope">
            <span
              v-if="scope.row.nowStatus == '0'"
              style="color: #3c91ff"
            >可用</span>
            <span
              v-else-if="scope.row.nowStatus == '1'"
              style="color: #ffb269"
            >不可用</span>
            <span
              v-else
              style="color: #83b8c2"
            >未知</span>
          </template>
        </el-table-column>

        <el-table-column
          header-align="center"
          align="center"
          label="物资图片"
          width="130"
        >
          <template slot-scope="scope">
            <viewer>
              <img
                v-if="scope.row.picPath"
                :src="
                  scope.row.picPath.indexOf('http') === -1
                    ? cloudUrl + scope.row.picPath
                    : scope.row.picPath
                "
                style="width: 100px; height: 100px"
              >
              <img
                v-else
                :src="scope.row.picPath"
                style="width: 100px; height: 100px"
              >
            </viewer>
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
              :display="[
                isAuth('resoure:resourearticle:info') ? 'view' : '',
                isAuth('resoure:resourearticle:update') ? 'edit' : '',
                isAuth('resoure:resourearticle:delete') ? 'delete' : '',
              ]"
              @view="addOrUpdateHandle(scope.row.id, 0)"
              @edit="addOrUpdateHandle(scope.row.id, 1)"
              @delete="
                deleteIds = scope.row.id;
                $refs.delete_hint.visible = true;
              "
            />
          </template>
        </el-table-column>
      </template>
    </sv-template>
    <resourcearticleAddOrUpdate
      v-if="newcontactsVisible"
      ref="newcontacts"
      :current-tree-node="currentTreeNode"
      @refreshDataList="getDataList"
      @close="newcontactsVisible = false"
    />
    <!-- 弹窗, 错误信息-->
    <errorData
      v-if="errorDataVisible"
      ref="errorData"
    />
    <!-- 弹窗, 查看 / 修改 -->
    <add-or-update
      v-if="addOrUpdateVisible"
      ref="addOrUpdate"
      @refreshDataList="getDataList"
    />
    <!--树状，新增 -->
    <ResourcetreeAddOrUpdate
      v-if="eventtypeAddOrUpdateVisible"
      ref="resourcetreeAddOrUpdate"
      @refreshEventTypeDataList="getDataList"
      @close="eventtypeAddOrUpdateVisible = false"
    />
    <!--树状，修改 -->
    <resource-tree-update
      v-if="eventtypeUpdateVisible"
      ref="resourceUpdate"
      @refreshEventTypeDataList="getDataList"
    />
    <sv-dialog-hint
      ref="delete_hint"
      type="delete"
      @confirm="batchDelete(deleteIds)"
    />
  </div>
</template>

<script>
// import {getRules} from '@/utils/rules'
import axios from 'axios';
import { setTimeout } from 'timers';
import Cookies from 'js-cookie';
// import resourcetree from './resource-tree.vue';
import AddOrUpdate from './resource-See-or-update.vue';
// import resourceheader from './resource-header.vue';
// import resourcetable from './resource-table.vue';
import ResourcetreeAddOrUpdate from './resource-tree-add.vue';
import ResourceTreeUpdate from './resource-tree-update.vue';
import resourcearticleAddOrUpdate from './resource-article-add-or-update.vue';
import errorData from './resource-errorData.vue';

const httpaddress = window.SITE_CONFIG.baseUrl;
export default {
  components: {
    AddOrUpdate,
    resourcearticleAddOrUpdate,
    ResourcetreeAddOrUpdate,
    ResourceTreeUpdate,
    errorData,
  },
  data() {
    return {
      cloudUrl: window.SITE_CONFIG.cloudUrl,
      // 使用模板的一些参数配置，具体看文档
      treeSetting: {
        tab: [],
        api: 'resoure/resourearticlestorehouse/tree',
        edit: {},
      },

      tableRequest: {
        api: '/resoure/resourearticle/listByUser',
        params: {
          key: this.keySearch,
          resoureArticleStorehouseId: this.groupIds,
        },
      },
      currentTreeNode: '',
      keySearch: '',
      groupIds: [],
      checkedNodes: [],
      selectedNode: [],
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
      documenttoken: `${httpaddress}/resoure/resourearticle/xlsInput?token=${this.$cookie.get(
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
    };
  },
  created() {
    // this.getDataList();
  },
  methods: {
    boxCheck() {
      this.$refs.template.treeCheck = !this.$refs.template.treeCheck;
      this.$refs.template.tableCheck = !this.$refs.template.tableCheck;
      this.isFocus = !this.isFocus;
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
      this.$refs.template.getTree();
      this.$refs.template.getTableList(this.tableRequest);
      this.mapDialogVisible = true;
      // this.$http({
      //   url: this.$http.adornUrl("/resoure/resourearticlestorehouse/list"),
      //   method: "get",
      // }).then(({ data }) => {
      //   // var resoureArticleStorehouseId;
      //   // console.log('resource',data);
      //   if(data && data.code == 0) {
      //     if (data.articleStorehouseList.length>0) {
      //       data.articleStorehouseList.map(v=>{
      //         v.children = null
      //         v.parentId = 0
      //       })
      //     }
      //     console.log(data.articleStorehouseList)
      //     this.modifiedUserList = treeDataTranslate(data.articleStorehouseList, "id");
      //     console.log('this.modifiedUserList',this.modifiedUserList)
      // resoureArticleStorehouseId=this.modifiedUserList[0].id;
      // 请求表格数据
      // this.$http({
      //   url: this.$http.adornUrl("/resoure/resourearticle/list"),
      //   method: "get",
      //   params: this.$http.adornParams({
      //       // groupId: this.selectedNode,
      //       key:'',
      //       resoureArticleStorehouseId:'',
      //       limit:this.pageSize ,
      //       page:1,
      //       // resoureArticleStorehouseId:this.modifiedUserList.length>0?'':
      //       resoureArticleStorehouseId

      //     })
      // }).then(({ data }) => {
      //   if (data && data.code === 0) {
      //     // console.log('getDataList',data)
      //     this.totalCount = data.resoureArticleList.totalCount;
      //     // console.log('this.totalCount: ', this.totalCount);
      //     this.currPage = data.resoureArticleList.currPage;
      //     this.pageSize = data.resoureArticleList.pageSize;
      //     this.platShareMenuList = data.resoureArticleList.list
      //     // console.log(this.platShareMenuList)
      //   } else {
      //     this.$message.error(data.msg)
      //   }

      // });

      //   }else{
      //     this.$message.warning(data.msg)
      //   }
      // });
    },
    // 物资搜索
    searchcontacts(contactsearch) {
      // console.log('this.currentTreeObject',this.currentTreeObject);
      this.search = contactsearch;
      this.currPage = 1;
      this.selectedNode = [];
      // let key;

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
    // 分组拖拽排序
    // modifythename(before, after, inner, event) {
    //   let treesubnode = [];
    //   // console.log("==============");
    //   // console.log(this.modifiedUserList);
    //   // console.log(before); // 移动的节点
    //   // console.log(after); // 移动到的父节点
    //   // console.log(inner);
    //   // console.log("==============");
    //   let prentId;
    //   if (inner == "inner") {
    //     prentId = after.data.id;
    //     //this.modifiedUserList
    //   } else {
    //     prentId = after.data.parentId;
    //   }
    //   // console.log(prentId);
    //   // console.log(this.modifiedUserList);
    //   let groupId = before.data.id;
    //   let ancestors;
    //   let parentId;
    //   let groupIds;
    //   let prent;
    //   if (prentId == 0) {
    //     ancestors = "0";
    //     parentId = 0;
    //     groupIds = new Array();
    //     this.modifiedUserList.forEach((item, index) => {
    //       groupIds.push(item.id);
    //     });
    //   } else {
    //     prent = findPrent(prentId, this.modifiedUserList);
    //     ancestors = prent.ancestors + "," + prent.id;
    //     parentId = prent.id;
    //     groupIds = new Array();
    //     prent.children.forEach((item, index) => {
    //       groupIds.push(item.id);
    //     });
    //   }
    //   // console.log(groupId);
    //   // console.log(ancestors);
    //   // console.log(parentId);
    //   // console.log(groupIds);
    //   var params = {
    //     id: groupId,
    //     ancestors: ancestors,
    //     parentId: parentId,
    //     groupIds: groupIds,
    //     children:before.data.children
    //   };
    //   this.$http({
    //     url: this.$http.adornUrl("/mail/mailgroup/order"),
    //     method: "POST",
    //     data: this.$http.adornData(params, false)
    //   }).then(({ data }) => {
    //     if (data && data.code === 0) {
    //         this.getDataList();
    //         // console.log(data);
    //         this.$message({
    //           message: "操作成功",
    //           type: "success",
    //           duration: 1500
    //         });
    //     } else {
    //       this.$message.error(data.msg)
    //     }
    //   });

    //   function findPrent(prentId, list) {
    //     for (let i = 0; i < list.length; i++) {
    //       var item = list[i];

    //       if (item.id == prentId) {
    //         // console.log(item.name);
    //         return item;
    //       }
    //       if (item.children != null) {
    //         let temp = findPrent(prentId, item.children);
    //         if (temp != null) {
    //           return temp;
    //         }
    //       }
    //     }
    //     return null;
    //   }
    // },
    // 新增物资弹窗
    newcontactsHandle(id) {
      this.newcontactsVisible = true;
      this.$nextTick(() => {
        this.$refs.newcontacts.init(id);
      });
    },

    // 查询列表物资弹窗 / 修改列表物资弹窗
    addOrUpdateHandle(id, staus) {
      this.addOrUpdateVisible = true;
      if (staus === 0) {
        this.$nextTick(() => {
          this.$refs.addOrUpdate.init(id, staus);
        });
      } else if (staus === 1) {
        this.$nextTick(() => {
          this.$refs.addOrUpdate.init(id, staus);
        });
      }
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
      const that = this;
      function findChilden(data, list) {
        list.push(data.id);
        const { children } = data;
        // console.log(list)
        if (children != null) {
          children.forEach((item) => {
            // console.log(item)
            findChilden(item, list);
          });
        }
      }
      // 点击分组查看分组信息
      // this.$http({
      //   url: this.$http.adornUrl(
      //     `/resoure/resourearticlestorehouse/info/${obj.id}`
      //   ),
      //   method: "get",
      //   params: this.$http.adornParams({}, false),
      // }).then(({ data }) => {
      //   if (data && data.code === 0) {
      //     //  console.log('点击分组查看分组信息',data)
      //     this.treeForm.currentTreename = data.resoureArticleStorehouse.name;
      //     this.treeForm.groupingdescription =
      //       data.resoureArticleStorehouse.remark;
      //     this.treeForm.contactorList = "";
      //     data.resoureArticleStorehouse.contactorList.forEach((item) => {
      //       this.treeForm.contactorList += `${item.name},电话:${item.mobile1}  `;
      //     });
      //     this.treeForm.groupName = data.resoureArticleStorehouse.groupName;
      //     this.treeForm.aroundTraffic =
      //       data.resoureArticleStorehouse.aroundTraffic;
      //     this.treeForm.address = data.resoureArticleStorehouse.address;
      //     this.treeForm.responsibleUnitAddress =
      //       data.resoureArticleStorehouse.responsibleUnitAddress;
      //     this.treeForm.remark = data.resoureArticleStorehouse.remark;
      //     this.treeForm.acreage = data.resoureArticleStorehouse.acreage;
      //   } else {
      //     this.$message.error(data.msg);
      //   }
      // });
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
      this.tableRequest.params.resoureArticleStorehouseId = this.selectedNode[0];
      this.$refs.template.getTableList(this.tableRequest);
      // console.log("selectedNode:"+this.selectedNode);
      // console.log(this.currentTreeObject);
      // console.log(this.treeForm.currentTreename);
      // console.log('this.pageSize,this.selectedNodethis.pageSize,this.selectedNode',
      // this.pageSize,this.selectedNode)
      // 查询树形关联的物资
      // this.$http({
      //   url: this.$http.adornUrl(`/resoure/resourearticle/list`),
      //   method: "get",
      //   params: this.$http.adornParams({
      //     limit:this.pageSize,
      //     page:1,
      //     'resoureArticleStorehouseId':this.selectedNode[0]
      //   })
      // }).then(({ data }) => {
      //   if (data && data.code === 0) {
      //     this.totalCount = data.resoureArticleList.totalCount;
      //     this.currPage = data.resoureArticleList.currPage;
      //     this.pageSize = data.resoureArticleList.pageSize;
      //     this.platShareMenuList = data.resoureArticleList.list;
      //   } else {
      //     this.$message.error(data.msg)
      //   }
      // });
    },
    // 点击树形节点事件
    // handleNodeClick(obj) {

    //  function findChilden(obj, list) {
    //   list.push(obj.id);
    //   let children = obj.children;
    //   // console.log(list)
    //   if (children != null) {
    //     children.forEach((item, index) => {
    //       // console.log(item)
    //       findChilden(item, list);
    //     });
    //   }
    // }
    // if(obj == null){
    //   this.selectedNode = []
    // }
    // else{
    // // console.log("树形结点点击事件", obj);
    // this.selectedNode = [];
    // this.currentTreeObject = obj.id;
    // this.treeForm.currentTreename = obj.name;
    // this.search = "";
    // //分组描述
    // this.treeForm.groupingdescription = obj.remark;
    // this.treeForm.id = obj.id;
    // this.treeForm.ancestors = obj.ancestors;
    // this.treeForm.parentId = obj.parentId;
    // this.treeForm.name = obj.name;
    // this.currentTreeplatformId = obj.platformId;
    // this.currentTreeparentId = obj.parentId;
    // this.currentTreeancestors = obj.ancestors;

    // findChilden(obj, (this.selectedNode = []));}

    // // console.log("selectedNode:"+this.selectedNode);
    // // console.log(this.currentTreeObject);
    // // console.log(this.treeForm.currentTreename);
    // //查询树形关联的联系人
    // this.tableRequest.params.resoureArticleStorehouseId = this.selectedNode
    // this.$refs.template.getTableList(this.tableRequest)

    //       if (obj == null) {
    //   this.groupIds = [];
    //   this.currentNode = "";
    //   this.tableRequest.params.resoureArticleStorehouseId = this.groupIds;
    // } else {
    //   this.currentNode = obj;
    //   this.groupIds = [];
    //   this.tableRequest.params.resoureArticleStorehouseId = this.groupIds;
    //   this.pageIndex = 1;

    //   if (obj.id == 0) {
    //     this.groupIds = [];
    //     this.tableRequest.params.resoureArticleStorehouseId = this.groupIds;
    //   } else {
    //     this.groupIds = [obj.id];
    //     this.tableRequest.params.resoureArticleStorehouseId = obj.id;
    //   }

    //   if (obj.children != null) this.getChildren(obj.children);

    //   this.dataForm.treeId = obj.id;
    // }
    // this.$refs.template.getTableList(this.tableRequest);
    // },

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
      for (let i = 0; i < val.length; i += 1) {
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
      const id = [];
      for (let i = 0; i < this.$refs.template.getTableChecked().length;
        i += 1) id.push(this.$refs.template.getTableChecked()[i].id);
      if (!this.currentTreeObject) {
        var ids = {
          ids: this.currenttableArray || id,
          resoureArticleStorehouseId: null,
        };
      } else {
        var ids = {
          ids: this.currenttableArray || id,
          resoureArticleStorehouseId: null,
        };
        // console.log(ids);
      }
      this.$confirm('确定进行删除操作?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          this.$http({
            url: this.$http.adornUrl('/resoure/resourearticle/delete'),
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
      const ids = {
        ids: [id],
        resoureArticleStorehouseId: null,
      };

      this.$http({
        url: this.$http.adornUrl('/resoure/resourearticle/delete'),
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
    // 上传文件之前的钩子
    beforeupload() {
      // console.log("上传文件之前的钩子", file);
    },
    // 文件上传时的钩子
    beforeUploadFile() {
      // console.log("文件上传时的钩子", event, file, fileList);
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
          if (response.data.code === 0) {
            this.$refs.import_success.visible = true;
            this.getTableList(this.tableRequest);
          } else {
            this.$refs.import_fail.supplementText = response.data.msg;
            this.$refs.import_fail.visible = true;
          }
        })
        .catch((error) => {
          this.$refs.buttonMore.importingData = false;
          this.$refs.import_fail.supplementText = error;
          this.$refs.import_fail.visible = true;
        });
    },
    handleAvatarSuccess(response, file) {
      this.filename = file.name;
      // console.log("上传成功的回调", response);
      // console.log("上传成功的回调2", file);
      // console.log(fileList);
      if (file.response.errorData.length === 0) {
        this.$message({
          message: '导入成功!',
          type: 'success',
        });
        this.getDataList();
      } else if (file.response.errorData.length > 0) {
        this.getDataList();
        this.errorDataVisible = true;
        this.$nextTick(() => {
          this.$refs.errorData.init(file.response.errorData); //
        });
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
      const httpaddress = window.SITE_CONFIG.baseUrl;
      const token = document.cookie;
      window.location.href = `${httpaddress}//resoure/resourearticle/xlsOutput?checkedIds=&token=${Cookies.get(
        'token',
      )}`;
      this.$refs.template.treeCheck = false;
      this.$refs.template.tableCheck = false;
      this.isFocus = false;
    },
    // 导出模板
    downloadtemplate() {
      const httpaddress = window.SITE_CONFIG.baseUrl;
      const token = document.cookie;
      const exportEx = this.currentTreeObject;
      // console.log(
      //   `${httpaddress}//resoure/resourearticle/gettemplate?gId=${exportEx}&token=${Cookies.get('token')}`
      // );
      // window.open(httpaddress +'//mail/mailgroup/gettemplate?gId=' + exportEx + '&' + token)
      window.location.href = `${httpaddress}//resoure/resourearticle/gettemplate?gId=${exportEx}&token=${Cookies.get(
        'token',
      )}`;
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
        const token = document.cookie;
        window.location.href = `${httpaddress}//resoure/resourearticle/xlsOutput?checkedIds=${this.$refs.template.getTreeChecked()}&token=${Cookies.get(
          'token',
        )}`;
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
    addEventType() {
      this.eventtypeAddOrUpdateVisible = true;
      this.$nextTick(() => {
        this.$refs.resourcetreeAddOrUpdate.init(null, null, 2); // 代表新增
      });
    },
    // 修改分组名称
    updateEventType(id) {
      // console.log(this.treeForm.currentTreename);
      // this.dialogVisible = true;
      // this.dialogtitle = "修改分组";
      // this.groupingdisabled = false;
      // console.log('rows',id)
      this.eventtypeUpdateVisible = true;

      this.$nextTick(() => {
        // this.$refs.resourceUpdate.visible=true;
        this.$refs.resourceUpdate.init(id, null, 3);
      });
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
     * @param {*}
     * @return {*}
     */
    // 树状删除分组
    deleteEventType(ids) {
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
              url: that.$http.adornUrl(
                '/resoure/resourearticlestorehouse/delete',
              ),
              method: 'post',
              data: this.$http.adornData({
                ids: that.selectedNode,
              }),
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

    // deleteEventType(ids) {
    //   var that=this
    //   this.$confirm(`确定对进行[删除]操作?`, "提示", {
    //     confirmButtonText: "确定",
    //     cancelButtonText: "取消",
    //     type: "warning"
    //   }).then(() => {
    //     var checkedNames='';
    //     if(that.checkedNodes.length>0){
    //       that.checkedNodes.forEach(item=>{

    //         if(item.system===1){
    //           checkedNames+=item.name
    //         }

    //       })
    //     }

    //     setTimeout(()=>{
    //       if(checkedNames){
    //       that.$message({
    //         message: `${checkedNames}删除失败`,
    //         type: "error",
    //         duration: 1500
    //       });
    //       return 0;
    //     }
    //     that.$http({
    //       url: that.$http.adornUrl(
    //         `/resoure/resourearticlestorehouse/delete`
    //       ),
    //       method: "post",
    //       data: that.$http.adornData({
    //         ids:that.checkedIds
    //       },false)
    //       }).then(({ data }) => {
    //         if (data && data.code === 0) {
    //           that.$message({
    //             message: "操作成功",
    //             type: "success",
    //             duration: 1500
    //           });
    //           that.getDataList();
    //         } else {
    //           that.$message.error(data.msg);
    //         }
    //       });
    //     })

    //   });
    // }
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
</style>
