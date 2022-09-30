<template>
  <div class="mailListWrap">
    <el-header
      style="height: 80px;padding: 24px 16px; clear: both;border:1px solid rgba(219, 219, 219, 1);border-radius:3px;"
      class="left"
    >
      <mailListheader
        ref="mailListheader"
        :uploadfilesname="uploadfilesname"
        :before-upload-file="beforeUploadFile"
        :filename="filename"
        :documenttoken="documenttoken"
        :file-list="fileList"
        @downloadtemplate="downloadtemplate"
        @newcontactsHandle="newcontactsHandle"
        @batchHandler="batchHandler"
        @watchLeaderDialog="watchLeaderDialog"
        @invitedToJoin="invitedToJoin"
        @getSharedPlatform="getSharedPlatform"
        @exportExcel="exportExcel"
        @batchDelete="batchDelete"
        @handleAvatarSuccess="handleAvatarSuccess"
        @peopleSort="peopleSort"
        @peopleMenuDialog="peopleMenuDialog"
        @searchcontacts="searchcontacts"
        @platformChange="platformChange"
      />
    </el-header>
    <div style="height:8px;width:100%;background: rgb(240, 243, 244);" />
    <!-- <NoticeBar
      v-if="sharedPlatform.noticeBarVisible"
      :text="`当前平台为:${this.sharedPlatform.platformName}`"
      :bg-color="'#ffdca9'"
      :color="'#b36f0c'"
      left-icon="https://s2.ax1x.com/2019/11/26/QSSTat.png"
      mode="close"
      :speed="20"
    /> -->
    <div style="width:100%;display: flex;padding:32px 16px 0px 16px;">
      <!-- 树形控件 -->
      <div style="width:15%;min-width:320px;">
        <mailtree
          v-if="show"
          :list="modifiedUserList"
          :list-props="modifiedUserProps"
          :treeexpansion="treeexpansion"
          @handleNodeClick="handleNodeClick"
          @showTree="showEventType"
          @addTree="addEventType"
          @updateTree="updateEventType"
          @modifythename="modifythename"
          @deleteTree="deleteEventType"
          @setCheckedIds="setCheckedIds"
        />
      </div>
      <div class="tableClass">
        <div style>
          <mailListtable
            :data-list="platShareMenuList"
            @addOrUpdateHandle="addOrUpdateHandle"
            @handleSelectionChange="handleSelectionChange"
            @batchDelete="batchDelete"
          />
        </div>
        <div>
          <!--分页-->
          <el-pagination
            :current-page="currPage"
            :page-sizes="[9, 18, 30, 50]"
            :page-size="pageSize"
            :total="totalCount"
            layout="total, sizes, prev, pager, next, jumper"
            @size-change="sizeChangeHandle"
            @current-change="currentChangeHandle"
          />
          <!--分页-->
        </div>
      </div>
    </div>
    <!-- 树状, 查看，修改-->
    <Crud
      ref="Crud"
      @refreshEventTypeDataList="getDataList"
    />
    <!-- 批量授权 -->
    <mailListBatchHandler
      v-if="batchHandlerVisible"
      ref="mailBatchHandler"
    />
    <!-- 弹窗, 新增-->
    <newcontacts
      v-if="newcontactsVisible"
      ref="newcontacts"
      :checked-ids="checkedIds"
      @refreshDataList="getDataList"
    />
    <!-- 弹窗, 新增-->
    <leaderDialog
      v-if="leaderDialogVisible"
      ref="leaderDialog"
      @refreshDataList="getDataList"
    />
    <!-- 弹窗, 错误信息-->
    <!-- <errorData
      v-if="errorDataVisible"
      ref="errorData"
    /> -->
    <!-- 弹窗, 查看 / 修改 -->
    <add-or-update
      v-if="addOrUpdateVisible"
      ref="addOrUpdate"
      :modified-user-list="modifiedUserList"
      @refreshDataList="getDataList"
    />
    <!--人员排序-->
    <maiListSort
      v-if="mailListSortDialogVisible"
      ref="maiListSort"
      @refreshDataList="getDataList"
    />

    <!--分配权限-->
    <mailMenu
      v-if="mailMenuDialogVisible"
      ref="mailMenu"
    />

    <!--邀请加入-->
    <el-dialog
      title="邀请加入"
      class
      :visible.sync="invitedToJoinVisible"
      style="overflow: auto;
  zoom: 1;"
      @close="invitedToJoinList=[]"
    >
      <div>{{ `当前${invitedToJoinList.length}位成员未加入，请勾选要邀请的成员，邀请将通过短信和邮件发送邀请通知` }}</div>

      <el-table
        :data="invitedToJoinList"
        @selection-change="invitedToJoinSelectionChange"
      >
        <el-table-column
          type="selection"
          width="55"
        />
        <el-table-column
          property="name"
          label="姓名"
        />
        <el-table-column
          property="mobile1"
          label="手机"
        />
        <el-table-column
          property="email"
          label="邮箱"
        />
      </el-table>
      <div style="margin-left:70%;margin-top:20px;">
        <el-button
          type="primary"
          size="small"
          @click="sendInvitedMessage()"
        >
          发送邀请通知
        </el-button>
        <el-button
          plain
          size="small"
          @click="invitedToJoinVisible=false"
        >
          取消
        </el-button>
      </div>
    </el-dialog>

    <!--获取共享平台-->
    <el-dialog
      title="获取共享平台"
      class
      :visible.sync="getSharedPlatformVisible"
      style="overflow: auto;
  zoom: 1;"
      @close="sharedPlatformList=[]"
    >
      <div>
        <el-input
          v-model="sharedPlatform.searchPlatformName"
          size="medium"
          style="width:300px;float: left;"
          placeholder="请输入平台名字搜索"
        />
        <el-button
          style="margin-left:20px;background-color：rgb(64, 158, 255);width:inherit;"
          @click="getSharedPlatform(true)"
        >
          查询
        </el-button>
      </div>
      <el-table
        :data="sharedPlatformList"
        highlight-current-row
        @current-change="handleCurrentChange"
      >
        <el-table-column
          property="platformName"
          label="平台名称"
        />
      </el-table>
      <el-pagination
        :current-page="Number(sharedPlatform.pageIndex)"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="Number(sharedPlatform.pageSize)"
        :total="Number(sharedPlatform.totalCount)"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="sharedPlatformSizeChangeHandle"
        @current-change="sharedPlatformCurrentChangeHandle"
      />
      <div
        style="margin-left: 50%;transform: translateX(-50%);margin-top: 25px;text-align: center;"
      >
        <el-button
          type="primary"
          size="small"
          @click="submitSelectPlatform()"
        >
          确定
        </el-button>
        <el-button
          plain
          size="small"
          @click="getSharedPlatformVisible=false;sharedPlatform.platformId=''"
        >
          取消
        </el-button>
      </div>
    </el-dialog>
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
import { treeDataTranslate } from '@/utils';
import { setTimeout } from 'timers';
import Cookies from 'js-cookie';
import importDataDialog from '@/views/modules/importDataDialog/importDataDialog.vue'
import mailtree from './mailList-tree';
import AddOrUpdate from './mailList-See-or-update';
import mailListheader from './mailList-header';
import mailListtable from './mailList-table';
import EventtypeAddOrUpdate from './mailList-tree-crud';
import Crud from './mailList-tree-new-crud.vue';
import newcontacts from './mailList-add';
import mailListBatchHandler from './mailList-batchHandler';
import leaderDialog from './leaderDialog';
import errorData from './mailList-errorData';
import maiListSort from './mailList-sort';
import mailMenu from './mailMenu-add-or-update';

// import { NoticeBar } from "vue-easy-notice-bar";
const token = document.cookie;
const httpaddress = window.SITE_CONFIG.baseUrl;
export default {

  components: {
    importDataDialog,
    mailListheader,
    mailListtable,
    mailtree,
    AddOrUpdate,
    newcontacts,
    mailListBatchHandler,
    leaderDialog,
    EventtypeAddOrUpdate,
    Crud,
    errorData,
    // NoticeBar,
    maiListSort,
    mailMenu,
  },
  data() {
    return {
      show: true,
      // 下载错误信息地址
      downLoadUrl: '/ser/mail/mailgroup/xlsOutPutError',
      parentId: 0,
      parentName: '顶级分组节点',
      nodeData: {}, // 节点数据
      type: '',
      typeData: [
        {
          id: 0,
          name: '部门',
        },
        {
          id: 1,
          name: '义工',
        },
        {
          id: 2,
          name: '处置',
        },
      ],
      batchHandlerVisible: false,
      leaderDialogVisible: false,
      checkedNodes: [],
      selectInvitedToJoinList: [],
      invitedToJoinList: [],
      sharedPlatformList: [],
      invitedToJoinVisible: false,
      getSharedPlatformVisible: false,
      selectedNode: new Array(),
      treeexpansion: [],
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
      sharedPlatform: {
        platformId: '',
        searchPlatformName: '',
        platformName: '',
        pageSize: '10',
        pageIndex: '1',
        totalCount: '',
        noticeBarVisible: false,
      },
      // 获取到的token
      documenttoken: `${httpaddress}/mail/mailgroup/xlsInput?token=${this.$cookie.get(
        'token',
      )}`,
      // documenttoken: `${httpaddress}/mail/mailgroup/loading?${this.$cookie.get('token')}`,
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
      pageSize: 9,
      // 总条目数
      totalCount: 0,
      /// //////
      // 分页初始值
      value3: [],
      treeForm: {
        // 分组名字
        currentTreename: '',
        // 分组描述
        groupingdescription: '',
        type: 0,
      },
      // 错误信息弹窗
      errorDataVisible: false,
      // 新增窗口
      newcontactsVisible: false,
      // 新增/修改窗口
      addOrUpdateVisible: false,
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
      // 人员排序弹窗
      mailListSortDialogVisible: false,

      // 人员分配权限
      mailMenuDialogVisible: false,
      // 是否是本平台
      isPlatformRoot: false,
      // 是否点击的是全部的全部
      flag: true,
    };
  },
  created() {
    // this.getDataList();
  },
  methods: {
    platformChange(isPlatformRoot, platformId) {
      this.$refs.mailListheader.isPlatformRoot = isPlatformRoot;
      this.sharedPlatform.platformId = platformId;
      if (platformId === -1) {
        this.sharedPlatform.platformId = '';
        this.flag = true;
      } else {
        this.flag = false;
      }
      this.selectedNode = [];
      this.getDataList();
      if (isPlatformRoot) {
        this.sharedPlatform.noticeBarVisible = false;
      } else {
        this.sharedPlatform.noticeBarVisible = true;
      }
      // 切换平台重新渲染树，保证树勾选状态清空
      this.show = false;
      this.$nextTick(() => {
        this.show = true;
      });
      this.checkedIds = [];
      this.checkedNodes = [];
    },
    sendInvitedMessage() {
      const that = this;
      this.$http({
        url: this.$http.adornUrl('/mail/mailcontactor/list'),
        method: 'POST',
        data: this.$http.adornData({
          controllerIds: that.selectInvitedToJoinList,
        }),
      }).then((res) => {
        // console.log('invitedToJoin', res)
        if (res && res.data.code === 0) {
          this.$message({
            message: '操作成功',
            type: 'success',
            duration: 1500,
            onClose: () => {
              this.invitedToJoinVisible = false;
            },
          });
        } else {
          this.$message.error('操作失败');
          this.invitedToJoinVisible = false;
        }
      });
    },
    // 一来就请求树形和列表
    getDataList() {
       // 获取总页数
      const totalPage = Math.ceil((this.totalCount - 1) / this.pageSize) // 总页数
      // 如果删除最后一页所有数据后，跳转到第一页
      this.currPage = this.currPage > totalPage ? 1 : this.currPage
      // 防止当前页小于1的情况
      this.currPage = this.currPage < 1 ? 1 : this.currPage
      this.dataListLoading = true;
      this.$http({
        url: this.$http.adornUrl(
          `/mail/mailgroup/list?platformId=${String(
            this.sharedPlatform.platformId,
          )}`,
        ),
        params: {
          flag: this.flag,
        },
        method: 'get',
      }).then(({ data }) => {
        if (data && data.code === 0) {
          // this.modifiedUserList = treeDataTranslate(data.data, "id");
          if (this.flag) {
            const findChilden = (obj) => {
              if (obj.platformName !== null && obj.platformName !== undefined) {
                obj.name = obj.platformName;
              }
              const { children } = obj;
              if (children) {
                children.forEach((item) => {
                  findChilden(item);
                });
              }
            };
            [data.data].forEach((obj) => {
              findChilden(obj);
            });
            this.modifiedUserList = [
              {
                id: 0,
                name: '全部',
                platformName: '全部',
                platformTitle: '全部',
                children: null,
              },
              data.data,
            ];
          } else {
            this.modifiedUserList = data.data;
          }
          // 16639需要展开到第三层
          this.modifiedUserList.map(ele=>{
            if(ele.children) {
              ele.children.map(ele2=>{
                this.treeexpansion.push(ele2.id)
              })
            }
            this.treeexpansion.push(ele.id)
          })
          // console.log(this.modifiedUserList)          // 请求表格数据
          this.$http({
            url: this.$http.adornUrl('/mail/mailcontactor/list'),
            method: 'POST',
            data: this.$http.adornData({
              groupId: this.selectedNode,
              limit: this.pageSize,
              page: this.currPage,//因为修改、删除、新增都使用的是初始的，所以不写死为1
              platformId: String(this.sharedPlatform.platformId),
              flag: this.flag,
            }),
          }).then(({ data }) => {
            if (data && data.code === 0) {
              this.totalCount = data.data.totalCount;
              this.currPage = data.data.currPage;
              this.pageSize = data.data.pageSize;
              this.platShareMenuList = data.data.list;
            } else {
              this.$message.error(data.msg);
            }
          });
        } else {
          this.$message.error(data.msg);
        }
      });
    },
    // 联系人搜索
    searchcontacts(contactsearch) {
      this.search = contactsearch;
      this.currPage = 1;
      // this.selectedNode = [];
      this.$http({
        url: this.$http.adornUrl('/mail/mailcontactor/list'),
        method: 'POST',
        data: this.$http.adornParams({
          groupId: this.selectedNode,
          search: contactsearch,
          limit: this.pageSize,
          page: this.currPage,
          platformId: String(this.sharedPlatform.platformId),
          flag: this.flag,
        }),
      }).then(({ data }) => {
        if (data && data.code === 0) {
          //  console.log(data.data.list)
          this.platShareMenuList = data.data.list;
          this.totalCount = data.data.totalCount;
          this.currPage = data.data.currPage;
          this.pageSize = data.data.pageSize;
        } else {
          this.$message.error(data.msg);
        }
      });
    },
    // 分组拖拽排序
    modifythename(before, after, inner, event) {
      console.log('%c [ xxx ]', 'font-size:13px; background:pink; color:#bf2c9f;', before, 123);
      let prentId;
      if (inner == 'inner') {
        prentId = after.data.id;
      } else {
        prentId = after.data.parentId;
      }

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

      const params = {
        id: groupId,
        ancestors,
        parentId,
        groupIds,
        children: before.data.children,
      };
      this.$http({
        url: this.$http.adornUrl('/mail/mailgroup/order'),
        method: 'POST',
        data: this.$http.adornData(params, false),
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.getDataList();
          // console.log(data)
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
            // console.log(item.name)
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
    batchHandler() {
      console.log(11111);
      this.batchHandlerVisible = true;
      this.$nextTick(() => {
        // this.$refs.mailBatchHandler.init();
        this.$refs.mailBatchHandler.handleAddContacts(
          '/mail/mailgroup/list',
          '请选择',
          this.dataForm.notificationMethod,
        );
      });
    },
    watchLeaderDialog(id) {
      this.leaderDialogVisible = true;
      this.$nextTick(() => {
        this.$refs.leaderDialog.init(id);
      });
    },
    // 新增联系人弹窗
    newcontactsHandle(id) {
      this.newcontactsVisible = true;
      this.$nextTick(() => {
        this.$refs.newcontacts.init(id, this.checkedIds);
      });
    },
    // 邀请加入
    invitedToJoin(boolean) {
      const that = this;
      this.invitedToJoinVisible = boolean;
      this.$http({
        url: this.$http.adornUrl('/mail/mailcontactor/needActivationList'),
        method: 'GET',
        param: this.$http.adornParams(),
      }).then((res) => {
        if (res && res.code === 0) {
          // console.log('invitedToJoin', res)
          res.data.data.forEach((item) => {
            if (!item.openId) {
              that.invitedToJoinList.push(item);
            }
          });
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    // 获取共享平台
    getSharedPlatform(boolean) {
      const that = this;
      this.getSharedPlatformVisible = boolean;
      this.$http({
        url: this.$http.adornUrl(
          `/sys/platformShare/listByMenu?key=${
            this.sharedPlatform.searchPlatformName
          }&menuId=${this.$route.meta.menuId}&limit=${String(
            this.sharedPlatform.pageSize,
          )}&page=${String(this.sharedPlatform.pageIndex)}`,
        ),
        method: 'GET',
        param: this.$http.adornParams({}),
      }).then(({ data }) => {
        if (data && data.code === 0) {
          //  console.log('getSharedPlatform', data)
          this.sharedPlatformList = data.data.list;
          this.sharedPlatform.totalCount = data.data.totalCount;
          // res.data.data.forEach((item) => {
          //   if (!item.openId) {
          //     that.invitedToJoinList.push(item)
          //   }
          // })
        } else {
          this.$message.error(data.msg);
        }
      });
    },
    // 查询联系人弹窗 / 修改联系人弹窗
    addOrUpdateHandle(id, staus) {
      this.addOrUpdateVisible = true;
      if (staus == 0) {
        this.$nextTick(() => {
          this.$refs.addOrUpdate.init(id, staus);
        });
      } else if (staus == 1) {
        this.$nextTick(() => {
          this.$refs.addOrUpdate.init(id, staus);
        });
      }
    },
    sharedPlatformSizeChangeHandle(val) {
      this.sharedPlatform.pageSize = val;
      this.sharedPlatform.pageIndex = 1;
      this.getSharedPlatform(true);
    },
    // 每页显示条目个数改变时会触发
    sizeChangeHandle(val) {
      // console.log(`每页 ${val} 条`)
      this.pageSize = val;
      this.currPage = 1;
      this.$http({
        url: this.$http.adornUrl('/mail/mailcontactor/list'),
        method: 'POST',
        data: this.$http.adornParams(
          {
            limit: this.pageSize,
            page: this.currPage,
            groupId: this.selectedNode,
            search: this.search,
            platformId: String(this.sharedPlatform.platformId),
            flag: this.flag,
          },
          false,
        ),
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.platShareMenuList = data.data.list;
        } else {
          this.$message.error(data.msg);
        }
      });
    },
    sharedPlatformCurrentChangeHandle(val) {
      this.sharedPlatform.pageIndex = val;
      this.getSharedPlatform(true);
    },
    // 当前页数改变时会触发
    currentChangeHandle(val) {
      // console.log(`当前页: ${val}`)
      this.currPage = val;
      this.$http({
        url: this.$http.adornUrl('/mail/mailcontactor/list'),
        method: 'POST',
        data: this.$http.adornParams(
          {
            limit: this.pageSize,
            page: this.currPage,
            groupId: this.selectedNode,
            search: this.search,
            platformId: String(this.sharedPlatform.platformId),
            flag: this.flag,
          },
          false,
        ),
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.platShareMenuList = data.data.list;
        } else {
          this.$message.error(data.msg);
        }
      });
    },
    // 获取父节点的字
    returnParentName(id) {
      let tempName = '顶级分组节点';
      let tempId = 0;
      if (this.modifiedUserList) {
        const hasChildren = (item) => {
          if (item.children && item.children.length) {
            item.children.forEach((child) => {
              if (child.id === id) {
                tempName = item.name;
                tempId = item.id;
              }
              hasChildren(child);
            });
          }
        };
        this.modifiedUserList.forEach((item) => {
          hasChildren(item);
        });
      }
      this.parentName = tempName;
      this.parentId = tempId;
    },
    // 点击树形节点事件
    handleNodeClick(obj) {
      // 否则按原逻辑走
      this.nodeData = obj;
      console.log(this.nodeData);
      this.returnParentName(obj.id);
      function findChilden(obj, list) {
        list.push(obj.id);
        const { children } = obj;
        // console.log(list)
        if (children != null) {
          children.forEach((item, index) => {
            // console.log(item)
            findChilden(item, list);
          });
        }
      }

      this.selectedNode = [];
      this.currentTreeObject = obj.id;
      this.treeForm.currentTreename = obj.name;
      this.search = '';
      console.log('树形结点点击事件');
      // 分组描述
      this.treeForm.groupingdescription = obj.remark;
      this.treeForm.type = obj.type;
      this.currentTreeplatformId = obj.platformId;
      this.currentTreeparentId = obj.parentId;
      this.currentTreeancestors = obj.ancestors;
      // 如果点击的是平台直接按照平台方式请求
      if (obj.platformName) {
        this.sharedPlatform.platformId = obj.id;
        this.selectedNode = [];
      } else {
        this.sharedPlatform.platformId = obj.platformId;
        findChilden(obj, (this.selectedNode = []));
      }
      if (obj.id === 0) {
        this.flag = true;
        this.sharedPlatform.platformId = '';
      } else {
        this.flag = false;
      }

      // console.log('selectedNode:' + this.selectedNode)
      // console.log(this.currentTreeObject)
      // console.log(this.treeForm.currentTreename)
      // 查询树形关联的联系人
      this.$http({
        url: this.$http.adornUrl('/mail/mailcontactor/list'),
        method: 'POST',
        data: this.$http.adornData({
          limit: this.pageSize,
          page: 1,
          groupId: this.selectedNode,
          platformId: String(this.sharedPlatform.platformId),
          flag: this.flag,
        }),
      }).then(({ data }) => {
        if (data && data.code === 0) {
          // console.log(data)
          this.totalCount = data.data.totalCount;
          this.currPage = data.data.currPage;
          this.pageSize = data.data.pageSize;
          this.platShareMenuList = data.data.list;
        } else {
          this.$message.error(data.msg);
        }
      });
    },
    // 被勾选的表格
    handleSelectionChange(val) {
      const tal = [];
      this.$emit('handleSelectionChange', val);
      for (let i = 0; i < val.length; i++) {
        tal.push(val[i].id);
        this.currenttableArray = tal;
      }
      // console.log(this.currenttableArray)
    },
    // 邀请加入被勾选的表格
    invitedToJoinSelectionChange(val) {
      this.selectInvitedToJoinList = [];
      // console.log('invitedToJoinSelectionChange', val)
      for (let i = 0; i < val.length; i++) {
        this.selectInvitedToJoinList.push(val[i].id);
      }
      // console.log('this.selectInvitedToJoinList', this.selectInvitedToJoinList)
      // console.log(this.currenttableArray);
    },
    // 获取选择到的平台
    handleCurrentChange(val) {
      // console.log('获取选择到的平台',val)
      this.sharedPlatform.platformId = val.id;
      this.sharedPlatform.platformName = val.platformName;
    },
    // 确定选择的平台
    submitSelectPlatform() {
      const that = this;
      this.getDataList();
      this.getSharedPlatformVisible = false;
      this.sharedPlatform.noticeBarVisible = true;
      setTimeout(() => {
        document.querySelector('.notice-bar .right-icon').onclick = function (
          e,
        ) {
          // console.log("关闭关闭")
          that.sharedPlatform.platformId = '';
          that.sharedPlatform.noticeBarVisible = false;
          that.getDataList();
        };
      }, 500);
    },
    // 删除
    batchDelete(row) {
      if (!this.currentTreeObject) {
        var ids = {
          contactorIds: this.currenttableArray || [row.id],
          groupId: null,
        };
      } else {
        var ids = {
          contactorIds: this.currenttableArray || [row.id],
          groupId: this.currentTreeObject,
        };
        // console.log(ids)
      }
      this.$confirm(
        `确定对${this.currenttableArray || [
          row.name,
        ]}进行删除操作?删除该联系人将会删除所有部门下的该联系人，确定吗？`,
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        },
      )
        .then(() => {
          this.$http({
            url: this.$http.adornUrl('/mail/mailcontactor/deleteByMap'),
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
        })
        .catch(() => {});
    },
    // 上传文件之前的钩子
    beforeupload(file) {
      // console.log('上传文件之前的钩子', file)
    },
    // 文件上传时的钩子
    beforeUploadFile(event, file, fileList) {
      // console.log('文件上传时的钩子', event, file, fileList)
    },
    // 上传成功的回调
    handleAvatarSuccess(response, file, fileList) {
      this.filename = file.name;
      console.log('上传成功的回调', response);
      console.log('上传成功的回调2', file);
      console.log(fileList);
      if (file.response && file.response.errorData && file.response.errorData.length == 0) {
        this.$message({
          message: '导入成功!',
          type: 'success',
        });
        this.getDataList();
      } else if (file.response && file.response.errorData && file.response.errorData.length > 0) {
        this.getDataList();
        this.$refs.importDataDialogRef.open(file.response);
        // this.errorDataVisible = true;
        // this.$nextTick(() => {
        //   this.$refs.errorData.init(file.response.errorData); //
        // });
      } else {
        this.$message.error({
          type: 'error',
          message: `${file.response.msg}`,
        });
      }
    },
    // 导出模板
    downloadtemplate() {
      const exportEx = this.currentTreeObject;
      const request = {
        method: 'get',
        baseURL: window.SITE_CONFIG.baseUrl,
        url: '/mail/mailgroup/gettemplate',
        headers: {
          token: this.$cookie.get('token'),
        },
        params: {
          gId: exportEx,
        },
        responseType: 'arraybuffer',
      };
      axios(request).then((response) => {
        if (response.data) {
          if (navigator.msSaveOrOpenBlob) {
            // 兼容ie
            navigator.msSaveOrOpenBlob(
              new Blob([response.data], { type: 'application/vnd.ms-excel' }),
              '通讯录模板.xls',
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
            a.download = fileName || '通讯录模板.xls';
            document.body.appendChild(a); // 兼容Firefox浏览器
            a.click();
            a.remove();
          }
        }
      });
      // 注释原因：标题需要由后端返回
      // this.$http(request).then((response) => {
      //   if (response.data) {
      //     const a = document.createElement('a');
      //     a.target = '_blank';
      //     a.download = '导出通讯录模板.xls';
      //     a.href = window.URL.createObjectURL(new Blob([response.data]));
      //     a.click();
      //   }
      // });
    },
    // 树形复选框勾选ID
    setCheckedIds(checkedIds, checkedNodes) {
      this.checkedIds = checkedIds;
      // console.log('this.checkedIds', checkedIds, checkedNodes)
      this.checkedNodes = checkedNodes;
    },
    // 导出数据
    exportExcel(platform) {
      const httpaddress = window.SITE_CONFIG.baseUrl;
      const { checkedIds } = this;

      if (checkedIds.length < 1) {
        this.$message({
          message: '请选择一个分组进行导出',
          type: 'warning',
        });
      } else {
        const request = {
          method: 'get',
          baseURL: window.SITE_CONFIG.baseUrl,
          url: '/mail/mailgroup/xlsOutput',
          headers: {
            token: this.$cookie.get('token'),
            flag: platform === -1,
          },
          params: {
            checkedIds: String(checkedIds),
          },
          responseType: 'arraybuffer',
        };
        this.$http(request).then((response) => {
          if (response.data) {
            const a = document.createElement('a');
            a.target = '_blank';
            a.download = '导出通讯录数据.xls';
            a.href = window.URL.createObjectURL(new Blob([response.data]));
            a.click();
          }
        });
      }
    },
    // 查看分组
    showEventType() {
      this.$nextTick(() => {
        this.$refs.Crud.isDisabled = true;
        this.$refs.Crud.init(this.currentTreeObject);
      });
    },
    // 添加分组
    addEventType() {
      this.$nextTick(() => {
        this.$refs.Crud.isDisabled = false;
        this.$refs.Crud.init(0);
      });
    },
    // 修改分组名称
    updateEventType() {
      this.$nextTick(() => {
        this.$refs.Crud.isDisabled = false;
        this.$refs.Crud.init(this.currentTreeObject);
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
            type: this.treeForm.type,
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
                this.getDataList();
              },
            });
          } else {
            this.$message.error(data.msg);
          }
        });
      }
    },
    // 删除分组
    deleteEventType(ids) {
      const that = this;
      this.$confirm('确定要进行[删除]操作?分组内的联系人数据也会一并删除', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        let checkedNames = '';
        if (that.checkedNodes.length > 0) {
          that.checkedNodes.forEach((item) => {
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
                `/mail/mailgroup/delete/${that.checkedIds}`,
              ),
              method: 'post',
              // data: that.$http.adornData(id)
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
      });
    },

    // 排序联系人
    peopleSort() {
      this.mailListSortDialogVisible = true;
      this.$nextTick(() => {
        this.$refs.maiListSort.init();
      });
    },

    // 分配权限
    peopleMenuDialog() {
      this.mailMenuDialogVisible = true;
      this.$nextTick(() => {
        this.$refs.mailMenu.init();
      });
    },
    // 重新导入
    reUpload() {
      this.$refs.mailListheader.importData();
    },
  },
};
</script>
<style lang="less" >
.mailListWrap {
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
    width: 82%;
    margin-left: 20px;
    min-width: 540px;
  }
  .el-table__fixed-right::before,
  .el-table__fixed::before {
    height: 0px;
  }
  .has-gutter tr > th {
    background: initial;
  }
  .el-table th {
    background: initial;
  }
  .notice-bar {
    .left-icon {
      margin-left: 1%;
    }
    .right-icon {
      margin-left: 4%;
    }
  }
}
</style>
