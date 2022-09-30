<!--运输企业-->
<template>
  <div>
    <sv-template
      ref="template"
      title="运输企业"
      :search-setting="{
        width: '255px',
        placeholder: '请输入运输企业名称关键字',
      }"
      :date-select="false"
      :table-request="tableRequest"
      :tree-setting="treeSetting"
      :import-data-config="isPlatformRoot ? {
        api: '/resoure/resourcetransport/xlsInput',
        overload: handleAvatarSuccess,
      }: {}"
      :export-select-config="{
        api: '/resoure/resourcetransport/xlsOutputSelect',
        overload: handleExport
      }"
      :export-query-config="{
        api: '/resoure/resourcetransport/xlsOutputSelect',
        overload: handleExport
      }"
      :download-template-config="{
        api: '/resoure/resourcetransport/gettemplate'
      }"
      :delete-selected-config="isPlatformRoot ?
        { api: '/resoure/resourcetransport/delete' } : {}"
      :overload="overload"
      @tree-click="handleTreeClick"
      @tree-node-delete="deleteTreeNode"
    >
      <!-- 平台 & 子平台 -->
      <template #grade__dropDown>
        <grade-dropDown @operationChange="operationChange" />
      </template>

      <!-- 按钮：添加 -->
      <template #middle__operation__button>
        <sv-button
          v-if="isPlatformRoot"
          type="primary"
          @click="addOrEditOrViewTransportation('add')"
        >
          添加
        </sv-button>
      </template>
      <template #middle__table>
        <el-table-column
          prop="name"
          header-align="center"
          align="center"
          label="名称"
        />
        <el-table-column
          prop="typeName"
          header-align="center"
          align="center"
          label="类别"
        />
        <el-table-column
          prop="levelName"
          header-align="center"
          align="center"
          label="级别"
        />
        <el-table-column
          prop="address"
          header-align="center"
          align="center"
          label="地址"
        />
        <el-table-column
          prop="longitude"
          header-align="center"
          align="center"
          label="经度"
        />
        <el-table-column
          prop="latitude"
          header-align="center"
          align="center"
          label="纬度"
        />
        <el-table-column
          header-align="center"
          align="center"
          width="150"
          label="操作"
        >
          <template slot-scope="scope">
            <sv-table-operation
              :display="isPlatformRoot ? ['view', 'edit', 'delete'] : ['view']"
              @view="addOrEditOrViewTransportation('detail', scope.row)"
              @edit="addOrEditOrViewTransportation('update', scope.row)"
              @delete="
                deleteIds = [scope.row.id];
                $refs.delete_table.visible = true;
              "
            />
          </template>
        </el-table-column>
      </template>
    </sv-template>
    <!-- 添加|编辑表单 -->
    <AddOrEditOrView
      ref="addOrEditOrView"
      @refresh="getTableList"
    />
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
    <!-- 导入错误弹窗 -->
    <Resource-importError
      ref="resourceImportError"
    />
  </div>
</template>
<script>
import GradeDropDown from '../../common/GradeDropDown.vue';
import AddOrEditOrView from './Transportation-add-update-view.vue';
import axios from 'axios';
import ResourceImportError from '@/views/modules/resource/equipmentImportError.vue';
const downLoadFile = require('@/utils/downloadFile.js').default;

export default {
  name: 'Transportation',
  components: {
    GradeDropDown,
    AddOrEditOrView,
    ResourceImportError,
  },
  data() {
    return {
      // 当前登录用户的token
      token: this.$cookie.get('token'),
      // 将要删除的多个id
      deleteIds: [],
      // 是否是本平台
      isPlatformRoot: true,
      // 将要被删除的树节点
      tobeDeletedNode: {},
      // 当前选中的树节点
      currentNode: {},
      // 左边栏-树形控件配置
      treeSetting: {
        api: '/resoure/resourcetransportgroup/list', // 后台接口列表
        edit: {
          add: '/resoure/resourcetransportgroup/save', // 添加节点接口
          update: '/resoure/resourcetransportgroup/update', // 更新树节点接口
          delete: true, // 是否可删除
        }, // 是否显示操作按钮，可以是一个对象（add, update, delete对应三种操作的url）
        isPlatformRoot: true, // 是否是本平台 是否显示新增分组按钮
      },
      // 中间栏-请求表格数据的参数
      tableRequest: {
        api: '/resoure/resourcetransport/list',
        method: 'post',
        data: {
          page: 1,
          limit: 10,
          groupId: [],
          platformId: -1,
          search: '',
        },
      },
      overload: {
        getTableList: () => {},
      },
      // 导入错误提示表头
      errorTableColumn: [
        {
          prop: 'id',
          label: '序号',
          width: 60,
        },
        {
          prop: 'name',
          label: '名称',
        },
        {
          prop: 'belongGroupName',
          label: '分组',
        },
        {
          prop: 'typeName',
          label: '类别',
        },
        {
          prop: 'levelName',
          label: '级别',
        },
        {
          prop: 'address',
          label: '地址',
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
          prop: 'passCap',
          label: '客运能力',
        },
        {
          prop: 'freCap',
          label: '货运能力',
        },
        {
          prop: 'transTools',
          label: '运输工具及数量',
        },
        {
          prop: 'firmDesc',
          label: '基本情况',
        },
        {
          prop: 'emCapDesc',
          label: '应急能力描述',
        },
        {
          prop: 'notes',
          label: '备注',
        },
      ],
      // 导入错误底部提示信息
      errorTips: [
        '1、不能在该Excel表中对企业信息进行删除或修改；',
        '2、Excel中红色字段为必填字段,黑色字段为选填字段，字段值里请不要填入特殊字符；',
        '3、上下级之间用“/”隔开，且从最上级开始，例如“分组/分组1”。若导入的数据中拥有与分组中已存在的分组名相同的分组，将自动与该分组关联，若导入的分组名称在系统中不存在，系统将自动创建该分组',
        '4、类别和等级为固定选项的字段，提供选择，而非输入；',
        '5、名称字段长度不能超过50 个字符、地址字段长度不能超过200个字符、客运能力字段长度不能超过200个字符、货运能力字段长度不能超过200个字符；运输工具及数量字段长度不能超过200个字符；基本情况字段长度不能超过600个字符；应急能力描述字段长度不能超过2000个字符；备注字段长度不能超过200个字符；',
        '6、手机号码：请直接输入手机号码，系统将自动匹配号码相同的联系人，若导入的号码在系统中不存在，系统将根据已填写的信息自动新增该联系人至“综合保障-运输企业”的分组里；',
      ],
      // 导入错误表格必填项
      errorRequired: ['名称', '分组'],
    };
  },
  mounted() {
  },
  methods: {
    /**
     * @description 切换平台触发
     */
    operationChange(isPlatformRoot, platformId) {
      this.isPlatformRoot = isPlatformRoot;
      // 是本平台，可以进行添加、编辑、删除操作
      if (isPlatformRoot) {
        // TODO: 添加左边树的操作接口
        this.treeSetting.edit = {
          add: '/resoure/resourcetransportgroup/save', // 添加节点接口
          update: '/resoure/resourcetransportgroup/update', // 更新树节点接口
          delete: true, // 是否可删除
        };
        this.treeSetting.isPlatformRoot = true;
      } else {
        this.treeSetting.isPlatformRoot = false;
        this.treeSetting.edit = false; // 非本平台不能进行添加、编辑、删除操作
      }
      this.getTreeAndTableData(platformId);
    },

    /**
     * @description 获取表格数据
     */
    getTreeAndTableData(platformId) {
      this.tableRequest.data.platformId = platformId;
      this.tableRequest.data.groupId = [];
      this.treeSetting.api = `/resoure/resourcetransportgroup/list?platformId=${platformId}`;
      new Promise((resolve, reject) => {
        this.$refs.template.getTree();
        resolve();
      }).then(() => {
        this.overload.getTableList = this.getTableList;
        this.$refs.template.getTableList();
      });
    },

    /**
     * @description 覆盖默认行为，获取表格数据
     */
    getTableList(params) {
      return new Promise((resolve) => {
        this.tableRequest.data.search = this.$refs.template.keyword;
        this.tableRequest.data.limit = this.$refs.template.paginationConfig.pageSize;
        this.tableRequest.data.page = this.$refs.template.paginationConfig.currentIndex;
        let data = { ...this.tableRequest.data };
        data.groupId = !params ? data.groupId : params.groupId ? params.groupId : [];
        const request = {
          method: this.tableRequest.method,
          url: this.tableRequest.api,
          baseURL: window.SITE_CONFIG.baseUrl,
          headers: {
            'Content-Type': 'application/json; charset=utf-8',
            token: this.$refs.template.token,
          },
          data,
        };
        axios(request).then((response) => {
          if (response.data.code === 0) {
            if (!params || !params.groupId) {
              // 表格内容
              this.$refs.template.tableList = response.data.data.page.records;
              this.$refs.template.paginationConfig.totalCount = response.data.data.page.total;
            }
            resolve(response.data.data.page.records || []);
          } else {
            resolve([]);
          }
          this.$refs.template.tableLoading = false;
        });
      });
    },

    /**
     * @description:删除选中的表格的行数据
     * @param {传入当前行id}
     * @return {type}
     */
    batchDelete(ids) {
      const request = {
        method: 'post',
        url: '/resoure/resourcetransport/delete',
        baseURL: window.SITE_CONFIG.baseUrl,
        data: {
          ids,
        },
      };
      this.$http(request)
        .then((response) => {
          if (response.data.code === 0) {
            // 提交成功后，刷新表格
            this.$refs.template.getTableList();
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
     * @description 添加 | 编辑数据
     * @param type add | edit
     * @param row type为add row为空 | type为edit row为表格行数据
     */
    addOrEditOrViewTransportation(type, row) {
      this.$refs.addOrEditOrView.ruleForm.groupId = this.currentNode.id;
      this.$refs.addOrEditOrView.initData(type, row);
      this.$refs.addOrEditOrView.groupOptions = this.$refs.template.treeList;
      // 显示分组
      this.$refs.addOrEditOrView.getGroupName(row ? row.groupId : this.currentNode.id);
    },

    /**
     * @description: 点击树节点获取节点结构展示其分组下的表单数据
     * @param {Object} obj 点击树节点的数据结构
     */
    handleTreeClick(obj) {
      this.tableRequest.data.groupId = [];
      if (obj === null) {
        this.currentNode = '';
      } else {
        this.currentNode = obj;
        this.getTreeChildren(obj);
      }
      this.$refs.template.getTableList();
    },

    /**
     * @description: 判断传进的数据是否包含子节点，并将所有节点的id保存为数组
     * @param {Obiect} obj 点击树节点的数据结构
     */
    getTreeChildren(obj) {
      this.tableRequest.data.groupId.push(obj.id);
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
      if (this.$refs.template.getTreeNodeChildren(node.id).length > 1) {
        this.$refs.delete_fail.visible = true;
        this.$refs.delete_fail.supplementText = '请先删除子分组数据！';
        return;
      }
      this.tobeDeletedNode = node;
      this.getTableList({groupId: [node.id]}).then((res) => {
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
        url: this.$http.adornUrl('/resoure/resourcetransportgroup/delete'),
        method: 'post',
        data: [this.tobeDeletedNode.id],
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

    /**
     * @description 上传成功的回调
     */
    handleAvatarSuccess(response, file, fileList) {
      if (response.data.errorData.length == 0) {
        this.$message({
          message: '导入成功!',
          type: 'success',
        });
      } else if (response.data.errorData.length > 0) {
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

    /**
     * @description 导出
     * @param flag exportingSelect: 选中表格导出; exportingQuery: 选择分组导出
     * @param url 路径
     * @param ids 选中的分组id或者表格数据id
     */
    handleExport(flag, url, ids) {
      return new Promise((resolve, reject) => {
        const params = flag === 'exportingQuery' ? {
          groupIds: ids,
        } : {
          checkedIds: ids,
        };
        const request = {
          method: 'post',
          url,
          baseURL: url.startsWith('http')
            ? undefined
            : window.SITE_CONFIG.baseUrl,
          headers: {
            'Content-Type': 'application/json; charset=utf-8',
            token: this.$refs.template.token,
          },
          data: params,
          responseType: 'arraybuffer',
        };
        downLoadFile(request).then(() => {
          resolve();
        }).catch((error) => {
          reject(error);
        });
      });
    },
  },
};
</script>
