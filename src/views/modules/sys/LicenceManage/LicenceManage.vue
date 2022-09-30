<template>
  <div>
    <sv-template
      ref="template"
      :tree-setting="treeSetting"
      :title="`License管理(${licNum})`"
      :date-select="false"
      :search-setting="{
        width: '255px',
        placeholder: '请输入项目名称、申请人姓名搜索',
      }"
      :table-request="tableRequest"
      :treeProps="tableTreeProps"
      :overload="{ getTree, getTableList }"
      @tree-click="handleNodeClick"
      @tree-node-delete="deleteEventType"
      @tree-add="handleNodeAdd"
      @tree-node-edit="handleNodeEdit"
      @tree-node-view="handleNodeView"
    >
      <template #header__titile>
        <span class="header__title">
          项目管理({{ licProjectNum }})
        </span>
      </template>
      <template #middle__operation__select>
        <sv-select
          v-model="tableRequest.params.status"
          placeholder="请选择状态"
          :options="statusOptions"
          @change="refresh"
        />
      </template>  
      <template #middle__operation__button>
        <sv-button
          type="primary"
          @click="addOrUpdateLicence('add', {})"
        >
          添加License
        </sv-button>
      </template>
      <template #middle__table>
        <el-table-column
          prop="projectName"
          header-align="center"
          align="center"
          label="项目名称"
          :show-overflow-tooltip="true"
        />
        <el-table-column
          prop="createTime"
          header-align="center"
          align="center"
          label="申请日期"
          :show-overflow-tooltip="true"
        />
        <el-table-column
          prop="proposer"
          header-align="center"
          align="center"
          label="申请人"
          :show-overflow-tooltip="true"
        />
        <el-table-column
          prop="proposerTel"
          header-align="center"
          align="center"
          label="联系电话"
        />
        <el-table-column
          prop="createUserName"
          header-align="center"
          align="center"
          label="创建人"
          :show-overflow-tooltip="true"
        />
        <el-table-column
          prop="createTime"
          header-align="center"
          align="center"
          label="创建日期"
        />
        <el-table-column
          prop="expireTime"
          header-align="center"
          align="center"
          label="有效期"
          :show-overflow-tooltip="true"
        />
        <el-table-column
          prop="remainingDays"
          header-align="center"
          align="center"
          label="剩余天数"
          :show-overflow-tooltip="true"
        />
        <!-- 0-使用中 1-已停用 -->
        <el-table-column
          prop="status"
          header-align="center"
          align="center"
          label="状态"
          :show-overflow-tooltip="true"
        >
          <template slot-scope="scope">
            <span v-if="scope.row.status" style="color: rgb(246, 110, 110);">已停用</span>
            <span v-else style="color: rgb(11, 210, 149);">使用中</span>
          </template>
        </el-table-column>
        <el-table-column
          header-align="center"
          align="center"
          width="260"
          label="操作"
        >
          <template slot-scope="scope">
            <sv-table-operation
              :display="[
                'view',
                'edit',
                'delete',
                'download',
              ]"
              @view="addOrUpdateLicence('get', scope.row)"
              @edit="addOrUpdateLicence('modify', scope.row)"
              @delete="
                deleteIds = [scope.row.id];
                $refs.delete_hint.visible = true;
              "
              @download="downloadFile(scope.row)"
            />
          </template>
        </el-table-column>
      </template>
    </sv-template>
    <licProjectDialog
      ref="licProjectDialog"
      @refresh="refresh"
    />
    <licenceAddOrUpdate
      ref="licenceAddOrUpdate"
      @refresh="refresh"
    />
    <licenceSee
      ref="licenceSee"
      @refresh="refresh"
    />
    <sv-dialog-hint
      ref="delete_hint"
      type="delete"
      @confirm="deleteLicence(deleteIds)"
    />
  </div>
</template>

<script>
import licProjectDialog from './LicProjectDialog.vue';
import licenceAddOrUpdate from './LicenceAddOrUpdate.vue';
import licenceSee from './LicenceSee.vue';
const $downLoadFile = require('@/utils/downloadFile.js').default;

export default {
  components: {
    licProjectDialog,
    licenceAddOrUpdate,
    licenceSee,
  },
  data() {
    return {
      treeSetting: {
        tab: [],
        api: window.SITE_CONFIG.cloudUrl + '/oauth/project/list',
        searchAdd: true,
        edit: ['view', 'edit', 'delete'],
        isPlatformRoot: true,
      },
      tableRequest: {
        api: window.SITE_CONFIG.cloudUrl + '/oauth/license/list',
        params: {
          page: 1,
          size: 10,
          projectId: 0,
          projectName: '', // 项目名字
          proposer: '', // 申请人
          projectId: 0,
          status: '', // 状态
        },
      },
      tableTreeProps: {
        id: 'id',
        label: 'name',
      },
      overload: {}, // 覆盖组件默认方法
      licNum: 0, // licence数量
      licProjectNum: 0, // 项目数量
      statusOptions: [
        {
          value: 0,
          label: '使用中',
        },
        {
          value: 1,
          label: '已停用',
        }
      ],
      projectOptions: [], // 项目数据
    }
  },
  methods: {
    // 点击树节点
    handleNodeClick(obj) {
      this.tableRequest.params.projectId = obj ? obj.id : 0;
      this.$refs.template.getTableList(this.tableRequest);
    },
    // 删除树节点
    deleteEventType(data) {
      const arr = this.$refs.template.getTreeNodeChildren(data.id);
      let datas = new FormData();
      datas.append('id', data.id);
      this.$confirm('确定要进行[删除]操作?', '提示', {
        customClass: 'message-del',
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        this.$http({
          url: `${window.SITE_CONFIG.cloudUrl}/oauth/project/delete`, 
          method: 'post',
          data: datas,
        })
        .then(({data}) => {
          if (data && data.errorcode === 0) {
            this.$message({
              message: '操作成功',
              type: 'success',
              duration: 1500,
            });
            this.$refs.template.getTree();
          } else {
            this.$message.error(data.msg);
          }
        });
      });
    },
    // 新增项目
    handleNodeAdd() {
      this.$refs.licProjectDialog.init('add', {});
    },
    // 修改项目
    handleNodeEdit(param) {
      this.$refs.licProjectDialog.init('edit', param);
    },
    // 查看项目
    handleNodeView(param) {
      this.$refs.licProjectDialog.init('view', param);
    },
    addOrUpdateLicence(type, data) {
      if (type === 'get') {
        this.$refs.licenceSee.init(type, data, this.projectOptions);
      } else {
        this.$refs.licenceAddOrUpdate.init(type, data, this.projectOptions);
      }
    },
    // 改写默认获取树数据方法
    getTree(request, vm) {
      let datas = new FormData();
      datas.append('name', request.params.name || '');
      vm.treeLoading = true;
      this.$http({
        url: `${window.SITE_CONFIG.cloudUrl}/oauth/project/list`, 
        method: 'post',
        data: datas,
      })
      .then(({data}) => {
        if (data && data.errorcode === 0) {
          let treeList = [
            {
              id: 0,
              name: '全部',
              children: null,
            },
            ...data.data,
          ]
          this.projectOptions = data.data;
          vm.treeList = treeList;
          this.licProjectNum = data.data.length
        } else {
          this.$message.error(data.msg);
        }
      }).finally(() => {
        vm.treeLoading = false;
      });
    },
    // 改写默认获取表格数据方法
    getTableList(request, vm) {
      console.log(request, vm)
      vm.tableLoading = true;
      let datas = new FormData();
      datas.append('projectId', request.params.projectId);
      datas.append('select', vm.keyword);
      datas.append('status', request.params.status);
      datas.append('page', vm.paginationConfig.currentIndex);
      datas.append('size', vm.paginationConfig.pageSize);
      this.$http({
        url: `${window.SITE_CONFIG.cloudUrl}/oauth/license/list`, 
        method: 'post',
        data: datas,
      }).then((response) => {
          // 表格列表
          vm.tableList = response.data.data.list;
          // 数据总数
          this.licNum = response.data.data.totalCount;
          vm.paginationConfig.totalCount = response.data.data.totalCount;
      }).finally(() => {
          vm.tableLoading = false;
      })
    },
    // 刷新
    refresh() {
      this.tableRequest.params.page = 1;
      this.$refs.template.getTree();
      this.$refs.template.getTableList(this.tableRequest);
    },
    // 删除表格数据
    deleteLicence(deleteIds) {
      let datas = new FormData();
      datas.append('id', deleteIds[0]);
      this.$http({
        url: `${window.SITE_CONFIG.cloudUrl}/oauth/license/delete`, 
        method: 'post',
        data: datas,
      })
      .then(({data}) => {
        if (data && data.errorcode === 0) {
          this.$message({
            message: '操作成功',
            type: 'success',
          });
          this.$refs.template.getTableList(this.tableRequest);
        } else {
          this.$message.error(data.msg);
        }
      });
    },
    //  下载合同
    downloadFile(row) {
      let licenseCheckModelString = {
        "ipAddress": row.serverIp.split(','),
        "macAddress": row.serverMacAddress.split(','),
        "cpuSerial": row.serverCpuSerial,
        "mainBoardSerial": row.serverMainBoard,
      }
      this.$http({
        url: `${window.SITE_CONFIG.cloudUrl}/oauth/license/generateLicense`,
        method: 'post',
        data: {
          expiryTime: row.expireTime + ' 00:00:00',
          licenseCheckModelString: JSON.stringify(licenseCheckModelString),
        },
      }).then(({data}) => {
        if(data && data.errorcode === '0') {
          let datas = new FormData();
          datas.append('path', data.data.licensePath);
          const request = {
            method: 'post',
            url: `/oauth/license/download`,
            baseURL: window.SITE_CONFIG.cloudUrl,
            headers: {
              'Content-Type': 'application/json; charset=utf-8',
              token: this.$cookie.get('token'),
            },
            responseType: 'arraybuffer',
            data: datas,
          };
          $downLoadFile(request);
        } else {
          this.$message.error('获取license文件失败');
        }
      })
    },
  }
};
</script>
<style lang="scss">
  .header__title {
    border-left: 3px solid #0091FF;
    font-size: 16px;
    line-height: 16px;
    font-weight: bold;
    padding: 0 0 0 14px;
    margin: 10px;
  }
</style>