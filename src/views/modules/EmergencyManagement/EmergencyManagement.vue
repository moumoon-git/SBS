<!--
 * @Author: yanghaohao
 * @Date: 2021-02-01 14:55:54
 * @LastEditTime: 2021-02-05 15:51:56
 * @LastEditors: Please set LastEditors
 * @Description: 应急专家页面
 * @FilePath: /SBS/src/views/modules/EmergencyManagement/EmergencyManagement.vue
-->

<template>
  <div>
    <div>
      <sv-template
        ref="template"
        :use-plat-form-all="true"
        :table-request="tableRequest"
        :tree-setting="treeSetting"
        :reginon="true"
        :date-select="false"
        :search-setting="{
          width:'255px',
          placeholder:'请输入人员名称关键字'
        }"
        :overload="{
          getTree,
        }"
        title="应急专家"
        :import-data-config="isPlatformRoot ? {
          api: '/resoure/resourexpert/xlsInput',
          overload: handleAvatarSuccess,
        }: {}"
        :export-select-config="{
          api: '/resoure/resourexpert/xlsOutputSelect',
        }"
        :export-query-config="{
          api: '/resoure/resourexpert/xlsOutput',
          params: {
          },
        }"
        :download-template-config="{
          api: '/resoure/resourexpert/exportTemplate'
        }"
        :delete-selected-config="isPlatformRoot ?
        { api: '/resoure/resourexpert/delete' } : {}"
        @tree-click="handleTreeClick"
        @tree-node-delete="deleteTreeNode"
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
            v-if="isPlatformRoot"
            type="primary"
            @click="addOrUpdateExpert('add', {})"
          >
            新增
          </sv-button>
        </template>
        <template #middle__table>
          <el-table-column
            prop="name"
            header-align="center"
            align="center"
            label="姓名"
          />
          <el-table-column
            prop="phone"
            header-align="center"
            align="center"
            label="手机号码"
          />
          <el-table-column
            prop="workUnit"
            header-align="center"
            align="center"
            label="工作单位"
          />
          <el-table-column
            prop="duty"
            header-align="center"
            align="center"
            label="职务"
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
            width="150"
            label="操作"
          >
            <template slot-scope="scope">
              <sv-table-operation
                :display="isPlatformRoot? [
                'view',
                'edit',
                'delete'
                ]: ['view']"
                @view="viewContent(scope.row.id)"
                @edit="addOrUpdateExpert('modify', scope.row)"
                @delete="
                  deleteIds = [scope.row.id];
                  $refs.delete_table.visible = true;
                "
              />
            </template>
          </el-table-column>
        </template>
      </sv-template>
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
      <sv-dialog-hint
        ref="delete_fail"
        type="fail"
        text="删除失败"
      />
      <add-or-update
        ref="addOrUpdate_expert"
        :current-node="currentNode"
        @refreshDataList="getTableList"
      />
      <view-content
        ref="viewContent"
      />
      <Resource-importError
        ref="resourceImportError"
      />
    </div>
    <importDataDialog
      ref="importDataDialogRef"
      :down-load-url="downLoadUrl"
      @reUpload="reUpload"
    />
  </div>
</template>
<script>
import importDataDialog from '@/views/modules/importDataDialog/importDataDialog.vue'
import AddOrUpdate from './EmergencyManagement-add-or-update.vue';
import ViewContent from './ViewContent.vue';
import ResourceImportError from '../resource/equipmentImportError.vue';
import GradeDropDown from '../../common/GradeDropDown.vue';

export default {
  components: {
    AddOrUpdate,
    ViewContent,
    ResourceImportError,
    GradeDropDown,
    importDataDialog,
  },
  data() {
    return {
      downLoadUrl: '/ser/resoure/resourexpert/xlsOutputError',
      isPlatformRoot: true,
      // 将要被删除的树节点
      tobeDeletedNode: {},
      // 当前选中的树节点
      currentNode: {},
      deleteIds: [],
      // 判断是查看还是编辑
      isViewOrEdit: false,
      // 统计数据
      statisticList: [],
      // 问题分类选项
      questionOptions: [],
      // 工单分类选项
      workListOptions: [],
      // 办理状态选项
      statusOptions: [],
      // 模板参数
      treeSetting: {
        api: '/resoure/expertGroup/listTree',
        edit: {
          add: '/resoure/expertGroup/addOrUpdateGroup',
          update: '/resoure/expertGroup/addOrUpdateGroup',
          delete: true,
        },
        isPlatformRoot: true,
      },
      tableRequest: {
        api: '/resoure/resourexpert/list',
        params: {
          groupIds: [],
          platformId: '',
          flag: false,
        },
      },
      // 导入错误提示表头
      errorTableColumn: [
        {
          prop: 'id',
          label: '序号',
        },
        {
          prop: 'name',
          label: '姓名',
        },
        {
          prop: 'phone',
          label: '手机号码',
          width: 120,
        },
        {
          prop: 'groupName',
          label: '专家组',
          width: 90,
        },
        {
          prop: 'officePhone',
          label: '办公电话',
          width: 120,
        },
        {
          prop: 'workUnit',
          label: '工作单位',
        },
        {
          prop: 'duty',
          label: '职位',
        },
        {
          prop: 'managerUnit',
          label: '主管单位',
        },
        {
          prop: 'datasource',
          label: '数据来源部门',
        },
      ],
      // 导入错误底部提示信息s
      errorTips: [
        '1、不能在该Excel表中对专家进行删除或修改；',
        '2、Excel中红色字段为必填字段,黑色字段为选填字段，字段值里请不要填入特殊字符；',
        '3、专家组：上下级类型间用‘/’隔开，且从最上级类型开始，例如"防护用品类/消防/防火服"。类型字段长度不能超过32个字符；',
        '4、手机号码：请直接输入手机号码，系统将自动匹配号码相同的专家，若导入的号码在系统中不存在，系统将根据已填写的信息自动新增该专家。',
      ],
      // 导入错误表格必填项
      errorRequired: ['姓名', '专家组'],
    };
  },
  mounted() {
    // this.getTableList();
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
        this.treeSetting.edit = {
          add: '/resoure/expertGroup/addOrUpdateGroup',
          update: '/resoure/expertGroup/addOrUpdateGroup',
          delete: true,
        }
        this.treeSetting.isPlatformRoot = true
      }else {
        this.treeSetting.edit = false
        this.treeSetting.isPlatformRoot = false
      }
      this.isPlatformRoot = isPlatformRoot
      this.$refs.template.PlatName = false;
      if (platformId === -1) {
        this.$refs.template.PlatName = true;
        this.tableRequest.params.platformId = null;
        this.tableRequest.params.flag = true;
        this.tableRequest.params.groupId = [];
        this.tableRequest.params.groupIds = [];
        this.treeSetting.api = '/resoure/expertGroup/listTree';
        this.getTree();
        return;
      }
      // 请求数据参数
      this.tableRequest.params.flag = false;
      this.tableRequest.params.resoureArticleStorehouseId && delete this.tableRequest.params.resoureArticleStorehouseId
      this.tableRequest.params.platformId = platformId
      this.tableRequest.params.groupId = []
      this.tableRequest.params.groupIds = []
      this.treeSetting.api = `/resoure/expertGroup/listTree?platformId=${platformId}`
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
    /**
     * @description: 新增或者编辑专家弹窗
     */
    addOrUpdateExpert(type, data) {
      this.$refs.addOrUpdate_expert.getType();
      this.$refs.addOrUpdate_expert.init(type, data);
    },
    /**
     * @description: 点击查看图标后出现弹窗进行查看操作
     * @param {Number} id 点击表格行的id
     */
    viewContent(id) {
      this.$refs.viewContent.init(id, this.tableRequest.params.platformId);
    },
    /**
     * @description: 根据问题分类，工单分类，办理状态，日期以及自定义搜索内容进行更新查询
     */
    getTableList() {
      this.$refs.template.getTableList(this.tableRequest);
    },
    /**
     * @description: 点击树节点获取节点结构展示其分组下的表单数据
     * @param {Object} obj 点击树节点的数据结构
     */
    handleTreeClick(obj) {
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
        this.tableRequest.params.groupId = [];
        this.tableRequest.params.groupIds = [];
        if (obj.id === 0) {
          this.tableRequest.params.platformId = null;
          this.tableRequest.params.flag = true;
        } else {
          this.tableRequest.params.flag = false;
        }
        this.$refs.template.getTableList(this.tableRequest);
        return;
      } // 否则如果点击分组的全部
      if (obj.id === 0) {
        this.tableRequest.params.groupId = [];
        this.tableRequest.params.groupIds = [];
        this.tableRequest.params.flag = false;
        this.$refs.template.getTableList(this.tableRequest);
        return;
      }
      // 否则按原逻辑走
      this.tableRequest.params.platformId = obj.platformId;
      this.tableRequest.params.flag = false;
      this.tableRequest.params.groupIds = [];
      if (obj === null) {
        this.currentNode = '';
      } else {
        this.currentNode = obj;
        this.getTreeChildren(obj);
      }
      this.$refs.template.getTableList(this.tableRequest);
    },
    /**
     * @description: 判断传进的数据是否包含子节点，并将所有节点的id保存为数组
     * @param {Obiect} obj 点击树节点的数据结构
     */
    getTreeChildren(obj) {
      if (obj.id) this.tableRequest.params.groupIds.push(obj.id);
      if (obj.children !== null) {
        obj.children.forEach((item) => {
          this.getTreeChildren(item);
        });
      }
    },
    /**
     * @description:删除选中的表格的行数据
     * @param {传入当前行id}
     * @return {type}
     */
    batchDelete(ids) {
      const request = {
        method: 'post',
        url: '/resoure/resourexpert/delete',
        baseURL: window.SITE_CONFIG.baseUrl,
        data: {
          ids,
        },
      };
      this.$http(request)
        .then((response) => {
          if (response.data.code === 0) {
            // 提交成功后，刷新表格
            this.$refs.template.getTableList(this.tableRequest);
          } else {
            window.console.log('删除失败！错误信息：【\n', response, '\n】');
            this.$refs.delete_fail.visible = true;
            this.$refs.delete_fail.supplementText = `错误代码：${response.data.code}`;
          }
        })
        .catch((error) => {
          window.console.log('删除失败！错误信息：【\n', error, '\n】');
          this.$refs.delete_fail.visible = true;
          this.$refs.delete_fail.supplementText = error;
        });
    },
    /**
     * @description: 删除对应的树节点，并限制树节点有数据时无法删除
     * @param node 树节点
     */
    deleteTreeNode(node) {
      if (this.$refs.template.getTreeNodeChildren(node.id).length > 1) {
        this.$refs.delete_fail.visible = true;
        this.$refs.delete_fail.supplementText = '请先删除子分组数据！';
        return;
      }
      this.tobeDeletedNode = node;
      const request = {
        method: 'post',
        baseURL: window.SITE_CONFIG.baseUrl,
        url: '/resoure/resourexpert/list',
        data: {
          endTime: '',
          groupIds: [node.id],
          limit: 1,
          page: 1,
          search: '',
          startTime: '',
        },
      };
      this.$http(request).then((response) => {
        if (
          response.data.code === 0
          && response.data.page
          && (
            !response.data.page.list
            || response.data.page.list.length === 0
          )
        ) {
          this.$refs.delete_hint.visible = true;
        } else {
          this.$refs.delete_fail.visible = true;
          this.$refs.delete_fail.supplementText = '请先删除分组内的表格数据！';
        }
      });
    },
    doDeleteTreeNode() {
      this.$http({
        url: this.$http.adornUrl('/resoure/expertGroup/deleteGroup'),
        method: 'post',
        data: {
          ids: [this.tobeDeletedNode.id],
        },
      }).then(({ data }) => {
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
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除',
        });
      });
    },
    // 上传成功的回调
    handleAvatarSuccess(response, file, fileList) {
      console.log(response,'--------------------')
      if (response.data.errorData.length === 0) {
        this.$message({
          message: '导入成功!',
          type: 'success',
        });
      } else if (response.data.errorData.length > 0) {
        this.$nextTick(() => {
          this.$refs.importDataDialogRef.open(response.data);
          // this.$refs.resourceImportError.init(response.data.data);
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
    getJurisdictionData() {
      this.$api.getTree().then((res) => {
        if (res.errorcode === 0) {
          this.regionOptions = res.data;
        }
      });
    },
    gradeDropDownChange(platformId) {
      this.$refs.template.basicGetTableList({
        api: '/resoure/resourexpert/list',
        params: {
          caseClassId: platformId,
          flag: this.tableRequest.params.flag,
        },
      })
    },
  },
};
</script>

<style lang="scss" module="PhoneRecord">
// 统计数据样式
.statistic_table {
  display: flex;
  justify-content: space-around;
  .statistic {
    font-size: 14px;
    color: #333333;
    padding-left: 70px;
    font-weight: bold;
    display: inline-block;
    height: 50px;
    width: 200px;
    .span_td {
      font-size: 13px;
      color: #333333;
      text-align: center;
    }
    .span_tr {
      color: #999999;
    }
  }
  .span_line {
    display: block;
    width: 2px;
    height: 20px;
    margin: 9px 5px;
    background-color: rgba(0, 0, 0, 0.05);
  }
}
</style>
