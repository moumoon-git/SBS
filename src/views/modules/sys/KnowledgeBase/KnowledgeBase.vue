<template>
  <div>
    <sv-template
      ref="template"
      :tree-setting="treeSetting"
      :table-request="tableRequest"
      :overload="{
        getTree,
        getTableList
      }"
      title="知识库管理"
      :date-select="false"
      :search-setting="{
        width: '200px',
        placeholder: '按enter搜索'
      }"
      :export-select-config="{api: ''}"
      :export-query-config="{api: ''}"
      :import-data-config="{api: ''}"
      :download-template-config="{api: ''}"
      :delete-selected-config="{api: ''}"
      @tree-click="handleNodeClick"
      @tree-node-delete="deleteEventType"
    >
      <template #grade__dropDown>
        <GradeDropDown
          @operationChange="operationChange"
        />
      </template>
      <template #middle__operation__select>
        <el-cascader
          v-model="eventValue"
          placeholder="事件类型"
          :options="eventOptions"
          clearable
          :props="eventProps"
          :show-all-levels="false"
          class="sbs-cascader"
          style="width: 200px;"
          @change="changeCascader"
        />
      </template>
      <template #middle__operation__button>
        <sv-button
          type="primary"
          @click="openKnowledgeBaseDialog('add', 0)"
        >
          新增知识
        </sv-button>
      </template>
      <template #middle__table>
        <el-table-column
          header-align="center"
          align="center"
          label="名称"
        >
          <template slot-scope="scope">
            <sv-table-tooltip :content="scope.row.name || '-'" />
          </template>
        </el-table-column>
        <el-table-column
          header-align="center"
          align="center"
          label="所属分组"
        >
          <template slot-scope="scope">
            <sv-table-tooltip :content="scope.row.groupName || '-'" />
          </template>
        </el-table-column>
        <el-table-column
          header-align="center"
          align="center"
          label="应急类型"
        >
          <template slot-scope="scope">
            <sv-table-tooltip :content="scope.row.caseClassNames || '-'" />
          </template>
        </el-table-column>
        <el-table-column
          header-align="center"
          align="center"
          label="知识标签"
        >
          <template slot-scope="scope">
            <div v-if="scope.row.labels && JSON.parse(scope.row.labels).length">
              <el-tag
                v-for="item in JSON.parse(scope.row.labels)"
                :key="Number(item.id)"
                :closable="false"
                :disable-transitions="false"
                :class="[$style.labelItem]"
                :style="`background: ${item.label_style}`"
              >
                {{ item.name }}
              </el-tag>
            </div>
            <span v-else>-</span>
          </template>
        </el-table-column>
        <el-table-column
          header-align="center"
          align="center"
          label="操作"
          width="170px"
        >
          <template slot-scope="scope">
            <sv-table-operation
              :display="['view', 'edit', 'delete']"
              @view="openKnowledgeBaseDialog('see', scope.row.id)"
              @edit="openKnowledgeBaseDialog('edit', scope.row.id)"
              @delete="
                deleteIds = [scope.row.id];
                $refs.delete_hint.visible = true;
              "
            />
          </template>
        </el-table-column>
      </template>
    </sv-template>
    <!-- 弹窗 -->
    <KnowledgeBaseDialog
      ref="KnowledgeBaseDialogRef"
      :platform-id="tableRequest.params.platformId"
      @refresh="getTableList"
    />
    <!-- 删除提示弹窗 -->
    <sv-dialog-hint ref="delete_hint" type="delete" @confirm="handleDelete(deleteIds)" />
    <sv-dialog-hint ref="delete_fail" type="fail" text="抱歉！删除失败" />
  </div>
</template>

<script>
import GradeDropDown from '../../../common/GradeDropDown.vue';
import KnowledgeBaseDialog from './KnowledgeBaseDialog.vue';

export default {
  components: {
    GradeDropDown,
    KnowledgeBaseDialog,
  },
  data() {
    return {
      selectedNode: [],
      deleteIds: [],
      knowledgeValue: '',
      knowledgeOptions: [],
      eventValue: '',
      eventOptions: [],
      // 树形接口
      treeSetting: {
        api: '/resoure/resourceKnowledgeBaseGroup/list',
        edit: {
          add: '/resoure/resourceKnowledgeBaseGroup/save',
          update: '/resoure/resourceKnowledgeBaseGroup/update',
          delete: true,
        },
        isPlatformRoot: true,
        searchAdd: false,
      },
      // 表格数据接口
      tableRequest: {
        api: '/resoure/resourceKnowledgeBase/list',
        params: {
          groupId: [],
          limit: 10,
          page: 1,
          platformId: '27',
        },
      },
      eventProps: {
        value: 'id',
        label: 'name',
        checkStrictly: true,
      },
      addVisible: false,
    };
  },
  mounted() {
    this.getEventOptions();
  },
  methods: {
    /**
     * @description: 是否选择的是本平台
     */
    operationChange(isPlatformRoot, platformId) {
      // 换平台的时候清空搜索字
      const that = this.$refs.template;
      that.treeKeyWord = '';
      that.keyword = '';
      // 清空事件
      this.eventValue = '';
      // 换平台的时候分页重置
      that.paginationConfig.currentIndex = 1;
      that.paginationConfig.totalCount = 0;
      that.paginationConfig.pageSize = 10;
      this.treeSetting.isPlatformRoot = isPlatformRoot;
      this.tableRequest.params.platformId = String(platformId);
      new Promise((resolve) => {
        this.$refs.template.getTree();
        resolve();
      }).then(() => {
        this.getTableList();
      });
    },
    /**
     * @description: 获得知识库管理左侧树结构
     */
    async getTree(request) {
      const that = this.$refs.template;
      that.tableLoading = true;
      const req = {
        method: 'get',
        url: '/resoure/resourceKnowledgeBaseGroup/list',
        baseURL: window.SITE_CONFIG.baseUrl,
        params: {
          name: request.params.name || '',
          platformId: String(this.tableRequest.params.platformId),
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
        } else {
          throw Error(`代码${response.data.code}，${response.data.msg}`);
        }
      } catch (error) {
        this.$message.error(`获取知识库管理树数据失败！${error}`);
      } finally {
        that.tableLoading = false;
      }
    },
    /**
     * @description: 获得右侧表格数据
     */
    async getTableList() {
      const that = this.$refs.template;
      that.tableLoading = true;
      const request = {
        method: 'post',
        url: that.tableRequest.api,
        baseURL: window.SITE_CONFIG.baseUrl,
        data: {
          groupIds: this.selectedNode,
          caseClassId: this.eventValue,
          page: that.paginationConfig.currentIndex,
          size: that.paginationConfig.pageSize,
          search: that.keyword,
          platformId: String(this.tableRequest.params.platformId),
        },
      };
      try {
        const response = await this.$http(request);
        if (response.data.code === 0) {
          that.tableList = response.data.data.page.list;
          that.paginationConfig.totalCount = response.data.data.page.totalCount;
        } else {
          throw Error(`代码${response.data.code}，${response.data.msg}`);
        }
      } catch (error) {
        this.$message.error(`获得知识库管理表格数据失败！${error}`);
      } finally {
        that.tableLoading = false;
      }
    },
    /**
     * @description: 点击树形节点事件
     * @param {Object} obj 点击的树节点
     * @return {*}
     */
    handleNodeClick(obj) {
      // 换结点的时候清空搜索字
      const that = this.$refs.template;
      that.keyword = '';
      this.eventValue = '';
      // 换结点的时候分页重置
      that.paginationConfig.currentIndex = 1;
      that.paginationConfig.totalCount = 0;
      that.paginationConfig.pageSize = 10;
      function findChilden(treeObj, list) {
        list.push(treeObj.id);
        const { children } = treeObj;
        if (children != null) {
          children.forEach((item) => {
            findChilden(item, list);
          });
        }
      }
      if (obj === null) { // 没有选择树节点，则显示全部数据
        this.selectedNode = [];
      } else {
        this.selectedNode = [];
        findChilden(obj, (this.selectedNode = []));
      }
      this.getTableList();
    },
    /**
     * @description: 打开分配资源窗
     */
    openKnowledgeBaseDialog(type, id) {
      this.$nextTick(() => {
        this.$refs.KnowledgeBaseDialogRef.init(type, id);
      });
    },
    /**
     * @description: 获得应急类型数据
     */
    async getEventOptions() {
      const request = {
        method: 'post',
        url: '/eos/caseClass/getTree',
        baseURL: window.g.ApiUrl,
        data: {},
      };
      this.isLoading = 1;
      try {
        const response = await this.$http(request);
        if (response.data.code === 0) {
          this.eventOptions = response.data.data;
        } else {
          throw Error(`代码${response.data.code}，${response.data.msg}`);
        }
      } catch (error) {
        this.$message.error(`获取事件类型失败：${error}`);
      } finally {
        this.isLoading = 0;
      }
    },
    /**
     * @method
     * @desc 删除数据
     * @param 需要删除的数据的id数组
     */
    handleDelete(ids) {
      const request = {
        method: 'post',
        url: '/resoure/resourceKnowledgeBase/delete',
        baseURL: window.SITE_CONFIG.baseUrl,
        data: {
          ids,
        },
      };
      this.$http(request).then((response) => {
        if (response.data.code === 0) {
          new Promise((resolve) => {
            this.$refs.template.getTree();
            resolve();
          }).then(() => {
            this.$message({
              message: '删除成功！',
              type: 'success',
            });
            this.getTableList();
          });
        } else {
          this.$refs.delete_fail.visible = true;
          this.$refs.delete_fail.supplementText = `错误代码：${response.data.code}`;
        }
      }).catch((error) => {
        this.$refs.delete_fail.visible = true;
        this.$refs.delete_fail.supplementText = error;
      });
    },
    /**
     * @description: 删除树分组
     * @param {*} data 要删除的树节点
     * @return {*}
     */
    deleteEventType(data) {
      this.$http({
        url: this.$http.adornUrl('/resoure/resourceKnowledgeBaseGroup/delete'),
        method: 'post',
        data: [data.id],
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.$message({
            message: '删除成功',
            type: 'success',
          });
          new Promise((resolve) => {
            this.$refs.template.getTree();
            resolve();
          }).then(() => {
            this.getTableList();
          });
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
     * @description: 获得当前点击事件类型
     * @param {*} val 选择的级联数据
     * @return {*}
     */
    changeCascader(val) {
      this.eventValue = val[val.length - 1];
      // 换结点的时候分页重置
      const that = this.$refs.template;
      that.paginationConfig.currentIndex = 1;
      that.paginationConfig.totalCount = 0;
      that.paginationConfig.pageSize = 10;
      this.getTableList();
    },
  },
};
</script>

<style lang="scss" module>
  // 标签项
  .labelItem {
    color: #FFF;
    vertical-align: middle;
    height: 24px;
    line-height: 24px;
    padding: 0 16px;
    margin: 0 5px 5px 0;
    font-size: 12px;
    border-radius: 16px;
    position: relative;
    max-width: 100px;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    &:nth-child(4n) {
      background: #f2b626;
    }
    &:nth-child(4n + 1) {
      background: #f66e6e;
    }
    &:nth-child(4n + 2) {
      background: #0091ff;
    }
    &:nth-child(4n + 3) {
      background: #56e9ff;
    }
  }
</style>
