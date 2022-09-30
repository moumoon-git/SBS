<template>
  <div class="sv-template__container">
    <!-- 【插槽】整个左边栏 -->
    <slot name="left__container">
      <div :class="['left__container', { left__collapse: leftCollaspe }]">
        <!-- 折叠按钮 -->
        <div
          class="left__collapse__button"
          @click="
            leftCollaspe = !leftCollaspe;
            $emit('collapse', leftCollaspe);
          "
        />
        <!-- 【插槽】左边栏内容 -->
        <slot name="left__content">
          <!-- 标签页切换 -->
          <sv-tree-tab
            v-if="treeSetting.tab && treeSetting.tab.length > 0"
            :tab-list="treeSetting.tab"
            @switch="
              getTree($event, null);
              // 切换标签时，模拟点击全部
              treeClick({ id: 0 });
            "
          />

          <!-- S 综合保障下级平台下拉菜单 -->
          <slot name="grade__dropDown" />
          <!-- E 综合保障下级平台下拉菜单 -->

          <!-- 头部标题 -->
          <slot name="header__titile" />
          <!-- 头部 -->
          <div class="left__header">
            <!-- 搜索框 -->
            <sv-input-tree-search
              v-model="treeKeyWord"
              width="calc(100% - 20px)"
              @change="usePlatFormAll ? '' : getTree(null, $event)"
            />
            <slot name="other__options" />
            <!-- 添加分组按钮 -->
            <el-tooltip
              v-if="treeSetting.isPlatformRoot"
              placement="top"
              content="添加分组"
            >
              <div
                v-if="
                  treeSetting.edit === true ||
                  treeSetting.edit.add ||
                  (Array.isArray(treeSetting.edit) &&
                    treeSetting.edit.includes('add')) ||
                  treeSetting.searchAdd
                "
                class="add_group"
                @click="handleTreeNodeAdd(null)"
              />
            </el-tooltip>
          </div>
          <!-- 树形控件 -->
          <div
            v-loading="treeLoading"
            class="left__tree sv-tree"
            element-loading-spinner="sv-loading"
          >
            <el-tree
              ref="tree"
              node-key="id"
              :filter-node-method="filterNode"
              :data="treeList"
              :props="treeProps"
              :show-checkbox="
                (moreButtonActive &&
                  exportQueryConfig.api != '' &&
                  exportQueryConfig.api != undefined) ||
                treeCheck === true
              "
              :highlight-current="true"
              :current-node-key="0"
              @check-change="treeCheckChange"
              @node-click="treeClick"
            >
              <div slot-scope="{ node, data }" class="sv-tree-node">
                <div class="label">
                  {{ node.label }}
                </div>
                <div v-if="treeSetting.edit" class="button">
                  <slot name="tree__operation" :data="data">
                    <sv-table-operation
                      v-if="data.id != 0"
                      :display="authorizeTreeNodeOperation()"
                      @delete="handleTreeNodeDelete(data)"
                      @edit="handleTreeNodeEdit(data)"
                      @cross="handleTreeNodeAdd(data)"
                      @record="handleTreeNodeRecord(data)"
                      @view="handleTreeNodeView(data)"
                    />
                  </slot>
                </div>
              </div>
            </el-tree>
            <sv-dialog-tree
              ref="treeNodeEdit"
              :api="{
                list: treeSetting.api,
                add: treeSetting.edit.add,
                update: treeSetting.edit.update,
                params: treeSetting.params,
              }"
              :tree-list="treeList"
              :tree-props="treeProps"
              @update="getTree(null, null)"
            />
            <sv-dialog-hint
              ref="hint_tree_node_delete"
              type="submit"
              text="确认删除分组？"
              @confirm="confirmTreeNodeDelete"
            />
          </div>
        </slot>
      </div>
    </slot>
    <div class="middle__all">
      <!-- 【插槽】上方栏 -->
      <slot name="upper__container" />
      <!-- 【插槽】整个中间栏 -->
      <slot name="middle__container">
        <div class="middle__container">
          <div class="middle__header">
            <!-- 【插槽】整个头部 -->
            <slot name="middle__header">
              <!-- 页面标题 -->
              <slot name="middle__title">
                <span class="middle__header__title">{{ title }}</span>
              </slot>
              <!-- 【插槽】头部所有操作框和按钮 -->
              <slot name="middle__operation">
                <!-- 【插槽】选择器 -->
                <slot name="middle__operation__select" />
                <!-- 预设的日期选择器、搜索框、“更多按钮” -->
                <sv-select-date
                  v-if="dateSelect"
                  v-model="dateRange"
                  @change="
                    paginationConfig.currentIndex = 1;
                    getTableList(tableRequest);
                    $emit('date-change', dateRange);
                  "
                />
                <sv-input-search
                  v-model="keyword"
                  :placeholder="
                    searchSetting.placeholder
                      ? searchSetting.placeholder
                      : '请输入关键字'
                  "
                  :width="searchSetting.width ? searchSetting.width : '150px'"
                  @change="paginationConfig.currentIndex = 1; getTableList(tableRequest)"
                />
                <sv-button-more
                  v-if="
                    (exportSelectConfig.api != '' &&
                      exportSelectConfig.api != undefined) ||
                    (exportQueryConfig.api != '' &&
                      exportQueryConfig.api != undefined) ||
                    (exportAllConfig.api != '' &&
                      exportAllConfig.api != undefined) ||
                    (exportQrcodeConfig.api != '' &&
                      exportQrcodeConfig.api != undefined) ||
                    (importDataConfig.api != '' &&
                      importDataConfig.api != undefined) ||
                    (downloadTemplateConfig.api != '' &&
                      downloadTemplateConfig.api != undefined) ||
                    (deleteSelectedConfig.api != '' &&
                      deleteSelectedConfig.api != undefined)
                  "
                  ref="buttonMore"
                  :export-select="
                    exportSelectConfig.api != '' &&
                    exportSelectConfig.api != undefined
                  "
                  :export-query="
                    exportQueryConfig.api != '' &&
                    exportQueryConfig.api != undefined
                  "
                  :export-all="
                    exportAllConfig.api != '' &&
                    exportAllConfig.api != undefined
                  "
                  :export-qrcode="
                    exportQrcodeConfig.api != '' &&
                    exportQrcodeConfig.api != undefined
                  "
                  :import-data="
                    importDataConfig.api != '' &&
                    importDataConfig.api != undefined
                  "
                  :download-template="
                    downloadTemplateConfig.api != '' &&
                    downloadTemplateConfig.api != undefined
                  "
                  :delete-selected="
                    deleteSelectedConfig.api != '' &&
                    deleteSelectedConfig.api != undefined
                  "
                  @click="moreButtonActive = !moreButtonActive"
                  @export-select="
                    handleExport(
                      'exportingSelect',
                      exportSelectConfig.api,
                      exportSelectConfig.params,
                    )
                  "
                  @export-query="
                    handleExport(
                      'exportingQuery',
                      exportQueryConfig.api,
                      exportQueryConfig.params,
                      exportQueryConfig.noselect,
                    )
                  "
                  @export-all="
                    handleExport(
                      'exportingAll',
                      exportAllConfig.api,
                      exportAllConfig.params,
                    )
                  "
                  @export-qrcode="handleQrcodeExport(exportQrcodeConfig.api)"
                  @import-data="handleImportData($event, importDataConfig.api)"
                  @download-template="
                    handleDownloadTemplate(downloadTemplateConfig.api)
                  "
                  @delete-selected="
                    handleDeleteSelected(
                      deleteSelectedConfig.api,
                      deleteSelectedConfig.params
                    )
                  "
                />
                <!-- “更多按钮”相关的提示弹窗 -->
                <sv-dialog-hint
                  ref="export_fail"
                  type="fail"
                  text="抱歉，导出失败！"
                />
                <sv-dialog-hint
                  ref="export_empty"
                  type="normal"
                  text="请勾选表格数据！"
                />
                <sv-dialog-hint
                  ref="export_query_empty"
                  type="normal"
                  text="请勾选左侧树形分组！"
                />
                <sv-dialog-hint
                  ref="import_success"
                  type="success"
                  text="恭喜，导入成功！"
                />
                <sv-dialog-hint
                  ref="import_fail"
                  type="fail"
                  text="抱歉，导入失败！"
                />
                <sv-dialog-hint
                  ref="download_fail"
                  type="fail"
                  text="抱歉，下载模板失败！"
                />
                <sv-dialog-hint
                  ref="delete_empty"
                  type="normal"
                  text="请勾选需要删除的数据！"
                />
                <sv-dialog-hint
                  ref="delete_success"
                  type="success"
                  text="批量删除成功！"
                />
                <sv-dialog-hint
                  ref="delete_fail"
                  type="fail"
                  text="抱歉，删除失败！"
                />
                <!-- 【插槽】按钮 -->
                <slot name="middle__operation__button" />
              </slot>
            </slot>
          </div>
          <div class="middle__statistics">
            <!-- 【插槽】统计数据栏 -->
            <slot name="middle__statistics" />
          </div>
          <div class="middle__table sv-table">
            <el-table
              ref="table"
              v-loading="tableLoading"
              :data="tableList"
              :tree-props="tableTreeProps"
              :row-key="tableTreeProps.id || 'id'"
              border
              element-loading-spinner="sv-loading"
              height="100%"
              @header-dragend="$refs.table.doLayout()"
            >
              <!-- 0. 暂无数据时自定义显示 -->
              <template slot="empty">
                <img
                  class="sv-table__empty"
                  alt="暂无数据"
                  src="../img/table_empty.svg"
                />
                <p>暂无数据</p>
              </template>
              <!-- 1. 勾选框，当“更多”按钮激活时显示 -->
              <el-table-column
                v-if="
                  (moreButtonActive &&
                    ((deleteSelectedConfig.api != '' &&
                      deleteSelectedConfig.api != undefined) ||
                      (exportSelectConfig.api != '' &&
                        exportSelectConfig.api != undefined) ||
                      (exportQrcodeConfig.api != '' &&
                        exportQrcodeConfig.api != undefined))) ||
                  tableCheck === true
                "
                type="selection"
                header-align="center"
                align="center"
                width="50px"
              />
              <!-- 2. 每行数据的序号 -->
              <el-table-column
                v-if="showIndex"
                label="序号"
                type="index"
                header-align="center"
                align="center"
                width="55px"
              />
              <!-- 3. 【插槽】自定义内容 -->
              <slot name="middle__table" />
            </el-table>
          </div>
          <div class="middle__footer sv-pagination">
            <slot name="middle__footer">
              <el-pagination
                :total="paginationConfig.totalCount"
                :current-page="paginationConfig.currentIndex"
                :page-size="paginationConfig.pageSize"
                :page-sizes="[10, 20, 50, 100]"
                layout="total, prev, pager, next, sizes, jumper"
                @size-change="pageSizeChange"
                @current-change="currentIndexChange"
              />
            </slot>
          </div>
        </div>
      </slot>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'SvTemplate',
  props: {
    // true-【平台有“全部”选项】，默认false
    usePlatFormAll: {
      type: Boolean,
      default: false,
    },
    // 左边栏-树形控件配置
    treeSetting: {
      type: Object,
      default: () => ({
        tab: [], // 最上方可切换标签的列表，不需要则传空数组
        api: [], // 后台接口列表
        searchAdd: true, // 是否显示搜索框旁的加号
        edit: true, // 是否显示操作按钮，可以是一个对象（add, update, delete对应三种操作的url）
        delete: true, // 是否显示删除按钮
        isPlatformRoot: true, // 是否是本平台 是否显示新增分组按钮
      }),
    },
    // 左边栏-树形数据结构配置
    treeProps: {
      type: Object,
      default: () => ({
        children: 'children',
        label: 'name',
        value: 'id',
        // disabled: (data) => data.id === 0 || data.id === '0', // 注释原因：需求要勾选全部导出bug15471
      }),
    },
    tableTreeProps: {
      type: Object,
      default: () => ({
        children: 'children',
        hasChildren: 'hasChildren',
        id: 'id',
      }),
    },
    // 中间栏-标题
    title: {
      type: String,
      default: '标题名',
    },
    // 中间栏-头部-日期选择器是否显示
    dateSelect: {
      type: Boolean,
      default: true,
    },
    // 中间栏-头部-搜索框配置
    searchSetting: {
      type: Object,
      default: () => ({
        width: '150px',
        placeholder: '请输入关键字',
      }),
    },
    // 中间栏-表格-显示序号列
    showIndex: {
      type: Boolean,
      default: true,
    },
    // 导出已选择分组所有数据的配置
    exportSelectConfig: {
      type: Object,
      default: () => ({
        api: '',
        params: {},
        overload: '', // 覆盖导出方法
      }),
    },
    // 导出已选查询数据的配置
    exportQueryConfig: {
      type: Object,
      default: () => ({
        api: '',
        params: {},
        noselect: false,
        overload: '', // 覆盖导出方法
      }),
    },
    // 导出所有数据的配置
    exportAllConfig: {
      type: Object,
      default: () => ({
        api: '',
        params: {},
      }),
    },
    // 导出二维码的配置
    exportQrcodeConfig: {
      type: Object,
      default: () => ({
        api: '',
        params: {},
      }),
    },
    // 导入数据的配置
    importDataConfig: {
      type: Object,
      default: () => ({
        api: '',
        overload: '',
      }),
    },
    // 下载模板的配置
    downloadTemplateConfig: {
      type: Object,
      default: () => ({
        api: '',
      }),
    },
    // 批量删除的配置
    deleteSelectedConfig: {
      type: Object,
      default: () => ({
        api: '',
        params: {},
      }),
    },
    // 中间栏-请求表格数据的参数
    tableRequest: {
      type: Object,
      default: () => ({
        api: '',
        method: 'get',
        params: {},
      }),
    },
    // 覆盖默认行为
    overload: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      PlatName: false,
      // 左边树上面的搜索框取值
      treeKeyWord: '',
      // 当前登录用户的token
      token: this.$cookie.get('token'),
      // 当前激活的标签
      activeTab: 0,
      // 树形数据列表
      treeList: [],
      // 树形数据请求中
      treeLoading: false,
      // 将要删除的树节点id
      treeIdToBeDeleted: '',
      treeDeviceDelete: {},
      // 左边栏折叠
      leftCollaspe: false,
      // 更多按钮是否激活，激活时显示树形和表格勾选框
      moreButtonActive: false,
      // 表格数据请求中
      tableLoading: false,
      // 返回的表格数据列表
      tableList: [],
      // 关键词搜索框取值
      keyword: '',
      // 左边树上面的搜索框取值
      treeKeyWord: '',
      // 日期选择器取值
      dateRange: ['', ''],
      // 分页器配置
      paginationConfig: {
        currentIndex: 1,
        totalCount: 0,
        pageSize: 10,
      },
      // 外部控制树形勾选框
      treeCheck: false,
      // 外部控制表格勾选框
      tableCheck: false,
      // 所有树节点id
      treeIds: [],
    };
  },
  watch: {
    treeKeyWord(val) {
      this.$refs.tree.filter(val);
    },
  },
  mounted() {
    // 获取树形数据
    this.getTree();
    // 获取表格数据
    if (!this.usePlatFormAll) this.getTableList(this.tableRequest);
    this.$refs.tree.setCheckedKeys([]);
  },
  methods: {
    /**
     * 递归树形所有id
     */
    getAllId(data) {
      this.treeIds.push(data.id);
      const child = data.children;
      if (child != null && child.length > 0) {
        child.forEach((item) => {
          this.getAllId(item);
        });
      }
    },
    /**
     * @description 获取树所有节点的id
     */
    getTreeAllValue() {
      if (this.usePlatFormAll) this.treeIds = [];
      else this.treeIds = this.treeList.map((el) => el[this.treeProps.value]);
      this.treeList.forEach((item) => {
        if (this.usePlatFormAll) this.getAllId(item);
        else this.getChildren(item.children);
      });
      this.treeIds = [...new Set(this.treeIds)];
    },
    /**
     * @description 树勾选框改变时触发
     * @param 共三个参数，依次为：传递给 data 属性的数组中该节点所对应的对象、节点本身是否被选中、节点的子树中是否有被选中的节点
     */
    treeCheckChange(node, checked) {
      // 全选与取消全选
      if (node[this.treeProps.value] === 0 || node[this.treeProps.value] === '0') {
        this.$refs.tree.setCheckedKeys(checked ? this.treeIds : []);
      }
      // 已勾选选中的树节点
      const checkedKeys = this.$refs.tree.getCheckedKeys();
      // 如果所有的子节点都取消选中了，全选也要取消选中
      if (checkedKeys.length === 1 && checkedKeys.filter((el) => el === 0).length > 0) {
        this.$refs.tree.setCheckedKeys([]);
      }
      // 如果所有的子节点都选中了，全选也要选中
      if ((checkedKeys.length + 1 === this.treeIds.length) && checkedKeys.filter((el) => el === 0).length === 0) {
        this.$refs.tree.setCheckedKeys(this.treeIds);
      }
    },
    /**
     * @description 获取树的所有节点的id
     */
    getChildren(data) {
      if (data != null && data.length > 0) {
        data.forEach((d) => {
          this.treeIds.push(d[this.treeProps.value]);
          if (d[this.treeProps.children] != null && d[this.treeProps.children].length > 0) {
            this.getChildren(d);
          }
        });
      }
    },
    /**
     * @method
     * @desc 获取树形数据
     * @param {Number} tabIndex 当前标签下标
     * @param {String} keyword 搜索关键词
     */
    getTree(tabIndex, keyword) {
      let apiIndex = 0;
      if (tabIndex === null || tabIndex === undefined) {
        apiIndex = this.activeTab;
      } else {
        this.activeTab = tabIndex;
        apiIndex = tabIndex;
      }
      const url =
        typeof this.treeSetting.api === 'string'
          ? this.treeSetting.api
          : this.treeSetting.api[apiIndex];
      const otherParams = this.treeSetting.otherTreeParams
        ? { type: this.treeSetting.otherTreeParams.type }
        : {};
      const request = {
        method: 'get',
        url,
        baseURL:
          url && url.startsWith('http')
            ? undefined
            : window.SITE_CONFIG.baseUrl,
        headers: {
          token: this.token,
        },
        params: {
          name: this.treeKeyWord,
          token: this.token,
          ...otherParams,
        },
      };
      if (this.overload.getTree) {
        this.overload.getTree(request, this);
      } else {
        // 空url时不请求，否则控制台接口报错
        if (!url) {
          return;
        }
        this.treeLoading = true;
        axios(request).then((response) => {
          if (response.data.code === 0 || response.data.errorcode === 0) {
            this.treeList = [
              {
                id: 0,
                name: '全部',
                children: null,
              },
              ...response.data.data,
            ];
            this.$emit('get-tree-data', this.treeList);
          }
          this.treeLoading = false;
        });
      }
      setTimeout(() => {
        this.getTreeAllValue();
      });
    },

    /**
     * @method
     * @desc 树形点击时，传递选项的id
     * @return {Object} data 树节点数据
     * @return {Number} activeTab 当前激活的标签下标
     */
    treeClick(nodeObj) {
      this.paginationConfig.currentIndex = 1;
      let data;
      if (this.usePlatFormAll) data = nodeObj;
      else data = nodeObj.id === 0 || nodeObj.id === '0' ? null : nodeObj;
      this.$emit('tree-click', data, this.activeTab);
    },

    /**
     * @method
     * @desc 树形节点操作权限设置
     * @return {Array} sv-table-operation组件display attribute用的数组
     */
    authorizeTreeNodeOperation() {
      if (Array.isArray(this.treeSetting.edit)) {
        // 1. 数组：[]
        return this.treeSetting.edit;
      }
      if (typeof this.treeSetting.edit === 'object') {
        // 2. 对象：{delete, update, add}
        const display = [];
        if (this.treeSetting.edit.delete) {
          display.push('delete');
        }
        if (this.treeSetting.edit.update) {
          display.push('edit');
        }
        if (this.treeSetting.edit.add) {
          display.push('cross');
        }
        return display;
      }
      if (this.treeSetting.edit === true) {
        // 3. 布尔：true
        return ['delete', 'edit', 'cross'];
      }
      return [];
    },

    /**
     * @method
     * @desc 新增树节点
     * @param {Object} node 树节点数据
     */
    handleTreeNodeAdd(node) {
      if (node) {
        // 树节点的加号
        const data = node;
        this.$emit('tree-node-add', data);
        if (this.treeSetting.edit.add) {
          // 父节点的名称
          const parID = data.parentId === undefined ? data.pid : data.parentId;
          data.parentName =
            this.$refs.tree.getNode(parID).data.name === '全部'
              ? '顶级分组'
              : this.$refs.tree.getNode(parID).data.name;
          this.$refs.treeNodeEdit.init('add', data);
        }
      } else {
        // 搜索框旁的加号
        this.$emit('tree-add');
        if (this.treeSetting.edit.add) {
          this.$refs.treeNodeEdit.init('add', null);
        }
      }
    },

    /**
     * @method
     * @desc 编辑树节点
     * @param {Object} node 树节点数据
     */
    handleTreeNodeEdit(node) {
      const data = node;
      const parID = data.parentId === undefined ? data.pid : data.parentId;
      this.$emit('tree-node-edit', data);
      if (this.treeSetting.edit.update) {
        // 父节点的名称
        data.parentName =
          this.$refs.tree.getNode(parID).data.name === '全部'
            ? '顶级分组'
            : this.$refs.tree.getNode(parID).data.name;
        this.$refs.treeNodeEdit.init('edit', data);
      }
    },

    /**
     * @method
     * @desc 删除树节点
     * @param {Object} data 树节点数据
     */
    handleTreeNodeDelete(data) {
      this.$emit('tree-node-delete', data);
      if (this.treeSetting.edit.delete && this.treeSetting.edit.delete.length) {
        this.$refs.hint_tree_node_delete.visible = true;
        this.treeIdToBeDeleted = data.id;
        this.treeDeviceDelete = {
          id: data.id,
        };
      }
    },

    /**
     * @method
     * @desc 调拨查看树节点
     * @param {Object} data 树节点数据
     */
    handleTreeNodeRecord(data) {
      this.$emit('tree-node-record', data);
    },

    /**
     * @method
     * @desc 查看树节点
     * @param {Object} data 树节点数据
     */
    handleTreeNodeView(data) {
      this.$emit('tree-node-view', data);
    },
    /**
     * @method
     * @desc 确认删除树节点
     */
    async confirmTreeNodeDelete() {
      //该定义是为了删除分组时 需要删除分组的内容先
      if (this.treeSetting.deleteOption) {
        const total = await this.getAllTableListById();
        if (total > 0) {
          this.$message.error('删除失败，请先删除分组里的内容');
          return;
        }
      }
      const url = this.treeSetting.edit.delete;
      const dataParams =
        this.treeSetting.params !== undefined
          ? this.treeDeviceDelete.id
          : {
              ids: [this.treeIdToBeDeleted],
            };
      const request = {
        method: 'post',
        url,
        baseURL: url.startsWith('http')
          ? undefined
          : window.SITE_CONFIG.baseUrl,
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          token: this.token,
        },
        data: dataParams,
      };
      axios(request)
        .then((response) => {
          if (response.data.code === 0) {
            this.getTree(null, null);
          } else {
            this.$refs.delete_fail.supplementText = `错误代码：${response.data.code}`;
            this.$refs.delete_fail.visible = true;
          }
        })
        .catch((error) => {
          this.$refs.delete_fail.supplementText = error;
          this.$refs.delete_fail.visible = true;
        });
    },

    // 查找当前组id的所有table数据
    async getAllTableListById() {
      const data = this.treeSetting.deleteOption;
      const request = {
        method: this.tableRequest.method || 'post',
        url: this.tableRequest.api,
        baseURL: this.tableRequest.api.startsWith('http')
          ? undefined
          : window.SITE_CONFIG.baseUrl,
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          token: this.token,
        },
        params: this.tableRequest.method ? data : undefined,
        data: this.tableRequest.method ? undefined : data,
      };
      const response = await axios(request);
      if (response.data.code === 0) {
        return response.data.page.totalCount;
      }
    },

    /**
     * @method
     * @desc 获取树勾选的节点
     * @return {Array} 所有已勾选的节点的id的数组
     */
    getTreeChecked() {
      if (this.usePlatFormAll) {
        const arr = this.$refs.tree.getCheckedNodes().filter(
          (item) => item.id !== 0 && !item.platformName,
        );
        const ids = [];
        arr.forEach((item) => {
          ids.push(item.id);
        });
        return ids;
      }
      const ids = this.$refs.tree.getCheckedKeys().filter((item) => item !== 0);
      return ids;
    },

    /**
     * @method
     * @desc 获取改节点的所有子孙节点id
     * @param { String | Number } 节点的id
     * @return { Array } 该节点以及该节点id的数组
     */
    getTreeNodeChildren(id) {
      const result = [];
      const findChildren = (node) => {
        result.push(parseInt(node.data[this.treeProps.value || 'id'], 10));
        if (node.childNodes) {
          node.childNodes.forEach((child) => {
            findChildren(child);
          });
        }
      };
      findChildren(this.$refs.tree.getNode(id));
      return result;
    },

    /**
     * @method
     * @desc 外部获取时间选择器取值
     * @return {Array} 时间选择器取值：[startTime, endTime]
     */
    getDate() {
      return this.dateRange;
    },

    /**
     * @method
     * @desc 导出数据
     * @param {String} loadingFlag 按钮的下载中图标显示判断值的变量名
     * @param {String} url 接口地址
     * @param {Object} extraParams 额外的请求参数
     * @param {Boolean} noselect 无分组的情况
     */
    handleExport(loadingFlag, url, extraParams, noselect) {
      let ids = [];
      if (noselect || loadingFlag === 'exportingAll') {
        ids = [];
      } else {
        if (loadingFlag === 'exportingQuery') {
          ids = this.getTreeChecked();
        } else {
          ids = this.getTableChecked().map((item) => item.id);
        }
      }
      if (ids.length === 0 && !noselect && loadingFlag !== 'exportingAll') {
        if (loadingFlag === 'exportingQuery') {
          this.$refs.export_query_empty.visible = true;
        } else {
          this.$refs.export_empty.visible = true;
        }
        this.$nextTick().then(() => {
          this.$refs.buttonMore[loadingFlag] = false;
        });
        return;
      }
      // 覆盖默认方法 选中表格导出
      if (loadingFlag === 'exportingSelect' && !!this.exportSelectConfig.overload) {
        this.exportSelectConfig.overload(loadingFlag, url, ids).then(() => {
          this.$refs.buttonMore[loadingFlag] = false;
        }).catch((error) => {
          this.$refs.buttonMore[loadingFlag] = false;
          this.$refs.export_fail.supplementText = error;
          this.$refs.export_fail.visible = true;
        });
        return;
      }
      // 覆盖默认方法 选择分组导出
      if (loadingFlag === 'exportingQuery' && !!this.exportQueryConfig.overload) {
        this.exportSelectConfig.overload(loadingFlag, url, ids).then(() => {
          this.$refs.buttonMore[loadingFlag] = false;
        }).catch((error) => {
          this.$refs.buttonMore[loadingFlag] = false;
          this.$refs.export_fail.supplementText = error;
          this.$refs.export_fail.visible = true;
        });
        return;
      }

      const params = {
        token: this.token,
        ids,
        groupIds: ids,
        checkedIds: ids,
        search: this.keyword,
        page: this.paginationConfig.currentIndex,
        limit: this.paginationConfig.pageSize,
        startTime: this.dateRange[0],
        endTime: this.dateRange[1],
        ...extraParams,
      };
      if (this.usePlatFormAll) {
        params.flag = this.PlatName;
      }
      const request = {
        method: 'post',
        url,
        baseURL: url.startsWith('http')
          ? undefined
          : window.SITE_CONFIG.baseUrl,
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          token: this.token,
        },
        data: params,
        responseType: 'arraybuffer',
      };
      axios(request)
        .then((response) => {
          if (navigator.msSaveOrOpenBlob) {
            // 兼容ie
            navigator.msSaveOrOpenBlob(
              new Blob([response.data], { type: 'application/vnd.ms-excel' }),
              '导出数据.xls',
            );
          } else {
            // 后端导出响应头返回的content-disposition，文件名是filename字段，或许有的接口是返回fileName，所以加了判断
            const str =
              decodeURI(response.headers['content-disposition']).indexOf(
                'filename',
              ) > -1
                ? 'filename='
                : 'fileName=';
            // 获取文件名
            // const fileName = decodeURI(
            //   response.headers['content-disposition'],
            // ).split(str)[1];
            // 返回数据大小写可能不同，因此需要区分
            const fileName1 = decodeURI(
              escape(response.headers['content-disposition']),
            ).split('fileName%3D')[1];
            const fileName2 = decodeURI(
              escape(response.headers['content-disposition']),
            ).split('filename%3D')[1];
            const fileName = fileName1 || fileName2;
            const a = document.createElement('a');
            a.href = window.URL.createObjectURL(
              new Blob([response.data], { type: 'application/vnd.ms-excel' }),
            );
            a.download = fileName || '导出数据.xls';
            document.body.appendChild(a); // 兼容Firefox浏览器
            a.click();
            a.remove();
          }
          this.$refs.buttonMore[loadingFlag] = false;
        })
        .catch((error) => {
          this.$refs.buttonMore[loadingFlag] = false;
          this.$refs.export_fail.supplementText = error;
          this.$refs.export_fail.visible = true;
        });
    },
    // 树
    filterNode(value, data) {
      if (!value) return true;
      return data.name.indexOf(value) !== -1;
    },
    /**
     * @method
     * @desc 导出二维码
     * @param {String} url 接口地址
     */
    handleQrcodeExport(url) {
      const ids = this.getTableChecked();
      if (ids.length === 0) {
        this.$refs.export_empty.visible = true;
        this.$nextTick().then(() => {
          this.$refs.buttonMore.exportingQrcode = false;
        });
        return;
      }
      const request = {
        method: 'get',
        url,
        baseURL: url.startsWith('http')
          ? undefined
          : window.SITE_CONFIG.baseUrl,
        params: {
          id: ids.map((item) => item.id).join(','),
          token: this.token,
        },
        headers: {
          token: this.token,
        },
        responseType: 'arraybuffer',
      };
      axios(request)
        .then((response) => {
          if (navigator.msSaveOrOpenBlob) {
            // 兼容ie
            navigator.msSaveOrOpenBlob(
              new Blob([response.data], { type: 'application/zip' }),
              '二维码.zip',
            );
          } else {
            const a = document.createElement('a');
            a.href = window.URL.createObjectURL(
              new Blob([response.data], { type: 'application/zip' }),
            );
            a.download = '二维码.zip';
            document.body.appendChild(a); // 兼容Firefox浏览器
            a.click();
            a.remove();
          }
          this.$refs.buttonMore.exportingQrcode = false;
        })
        .catch((error) => {
          this.$refs.buttonMore.exportingQrcode = false;
          this.$refs.export_fail.supplementText = error;
          this.$refs.export_fail.visible = true;
        });
    },

    /**
     * @method
     * @desc 导入文件上传
     * @param {File} file 加载的文件
     * @param {String} url 后台接口
     */
    handleImportData(file, url) {
      const request = {
        method: 'post',
        url,
        baseURL: url.startsWith('http')
          ? undefined
          : window.SITE_CONFIG.baseUrl,
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
          if (this.importDataConfig.overload) {
            this.importDataConfig.overload(response);
            this.getTableList(this.tableRequest);
            this.getTree();
            return;
          }
          if (
            (response.data.errorData &&
              response.data.errorData.length === 0 &&
              response.data.code === 0) ||
            (response.data.errorData === undefined && response.data.code === 0)
          ) {
            this.$refs.import_success.visible = true;
            this.$refs.import_success.supplementText = response.data.msg;
            this.getTableList(this.tableRequest);
            this.getTree();
          } else {
            const errorMessage = []; // 详细的导入错误信息
            errorMessage.push(response.data.msg);
            if (response.data.errorData) {
              response.data.errorData.forEach((error) => {
                if (error.errorMsg) {
                  errorMessage.push(error.errorMsg);
                }
              });
            }
            this.$refs.import_fail.supplementText = errorMessage.join('\n');
            this.$refs.import_fail.visible = true;
          }
        })
        .catch((error) => {
          this.$refs.buttonMore.importingData = false;
          this.$refs.import_fail.supplementText = error;
          this.$refs.import_fail.visible = true;
        });
    },

    /**
     * @method
     * @desc 下载模板
     * @param {String} url 接口地址
     */
    handleDownloadTemplate(url) {
      const request = {
        method: 'get',
        url,
        baseURL: url.startsWith('http')
          ? undefined
          : window.SITE_CONFIG.baseUrl,
        params: {
          token: this.token,
        },
        headers: {
          token: this.token,
        },
        responseType: 'arraybuffer',
      };
      axios(request)
        .then((response) => {
          if (navigator.msSaveOrOpenBlob) {
            // 兼容ie
            navigator.msSaveOrOpenBlob(
              new Blob([response.data], { type: 'application/vnd.ms-excel' }),
              '导入模板.xls',
            );
          } else {
            // 后端导出响应头返回的content-disposition，文件名是filename字段，或许有的接口是返回fileName，所以加了判断
            const str =
              decodeURI(response.headers['content-disposition']).indexOf(
                'filename',
              ) > -1
                ? 'filename='
                : 'fileName=';
            // 获取文件名
            // const fileName = decodeURI(
            //   response.headers['content-disposition'],
            // ).split(str)[1];
            // 返回数据大小写可能不同，因此需要区分
            const fileName1 = decodeURI(
              escape(response.headers['content-disposition']),
            ).split('fileName%3D')[1];
            const fileName2 = decodeURI(
              escape(response.headers['content-disposition']),
            ).split('filename%3D')[1];
            const fileName = fileName1 || fileName2;
            const a = document.createElement('a');
            a.href = window.URL.createObjectURL(
              new Blob([response.data], { type: 'application/vnd.ms-excel' }),
            );
            a.download = fileName || '导入模板.xls';
            document.body.appendChild(a); // 兼容Firefox浏览器
            a.click();
            a.remove();
          }
          this.$refs.buttonMore.downloadingTemplate = false;
        })
        .catch((error) => {
          this.$refs.download_fail.supplementText = error;
          this.$refs.download_fail.visible = true;
          this.$refs.buttonMore.downloadingTemplate = false;
        });
    },

    /**
     * @method
     * @desc 批量删除
     * @param {String} url 后台接口
     */
    handleDeleteSelected(url, delParams) {
      const selectedRows = this.getTableChecked();
      if (selectedRows.length === 0) {
        this.$refs.delete_empty.visible = true;
        this.$nextTick().then(() => {
          this.$refs.buttonMore.deletingSelected = false;
        });
        return;
      }
      const request = {
        method: 'post',
        url,
        baseURL: url.startsWith('http')
          ? undefined
          : window.SITE_CONFIG.baseUrl,
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          token: this.token,
        },
        data: {
          ids: selectedRows.map((item) => item.id),
          ...delParams,
        },
      };
      axios(request)
        .then((response) => {
          this.$refs.buttonMore.deletingSelected = false;
          if (response.data.code === 0) {
            this.$refs.delete_success.visible = true;
            this.getTableList(this.tableRequest);
          } else {
            this.$refs.delete_fail.supplementText = response.data.code;
            this.$refs.delete_fail.visible = true;
          }
        })
        .catch((error) => {
          this.$refs.delete_fail.supplementText = error;
          this.$refs.delete_fail.visible = true;
        });
    },

    /**
     * @method
     * @desc 获取表格数据列表
     * @param {Object} tableRequest 接口地址，以及axios请求参数
     */
    getTableList(tableRequest) {
      if (this.overload.getTableList) {
        this.overload.getTableList(tableRequest, this);
      } else {
        this.basicGetTableList(tableRequest);
      }
    },

    /**
     * @method
     * @desc 获取表格数据列表，默认行为
     * @param {Object} tableRequest 接口地址，以及axios请求参数
     */
    basicGetTableList(tableRequest) {
      this.tableLoading = true;
      const data = {
        search: this.keyword,
        startTime: this.dateRange[0],
        endTime: this.dateRange[1],
        page: this.paginationConfig.currentIndex,
        limit: this.paginationConfig.pageSize,
        ...tableRequest.params,
      };
      this.$emit('table-request', data);
      const request = {
        method: this.tableRequest.method || 'post',
        url: tableRequest.api,
        baseURL: tableRequest.api.startsWith('http')
          ? undefined
          : window.SITE_CONFIG.baseUrl,
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          token: this.token,
        },
        params: this.tableRequest.method ? data : undefined,
        data: this.tableRequest.method ? undefined : data,
      };
      axios(request).then((response) => {
        if (response.data.code === 0) {
          // 表格内容
          this.tableList = response.data.page.list;
          this.paginationConfig.totalCount = response.data.page.totalCount;
          this.$emit('refresh', request, response.data);
        }
        this.tableLoading = false;
      });
    },

    /**
     * @method
     * @desc 获取表格勾选的数据
     * @return {Array} 所有已勾选的行的数据的数组
     */
    getTableChecked() {
      const rows = this.$refs.table.selection;
      return rows;
    },

    /**
     * @method
     * @desc 分页器每页显示数量变更
     */
    pageSizeChange(val) {
      this.paginationConfig.pageSize = val;
      this.getTableList(this.tableRequest);
    },

    /**
     * @method
     * @desc 分页器页跳转
     */
    currentIndexChange(val) {
      this.paginationConfig.currentIndex = val;
      this.getTableList(this.tableRequest);
    },
    /**
     * 重新上传
     */
    reUpload() {
      this.$refs.buttonMore.reUpload();
    },

  },
};
</script>

<style src="./sv_template.scss" lang="scss" />
